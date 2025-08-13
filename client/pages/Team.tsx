import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Linkedin } from "lucide-react";
import { useTextBlock } from "@/hooks/useTextBlock";
import { useEffect, useState, useMemo, useCallback } from "react";
import Footer from "@/components/Footer";
import RegistrationModal from "@/components/RegistrationModal";
import CityCard from "@/components/CityCard";
import TeamMemberCard from "@/components/TeamMemberCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { apiService, TeamMember, CityData } from "@/services/api";

interface Advisor {
  id: number;
  name: string;
  title: string;
  organization: string;
  description: string;
  expertise: string[];
  image?: string;
}

function useCarouselImages(partPrefix: string) {
  const [images, setImages] = useState<string[]>([]);
  useEffect(() => {
    apiService.getImages().then(allImages => {
      setImages(
        allImages
          .filter(img => img.part && img.part.startsWith(partPrefix))
          .sort((a, b) => {
            const getNum = (part: string) => parseInt(part.replace(/\D/g, "")) || 0;
            return getNum(a.part!) - getNum(b.part!);
          })
          .map(img => img.url.startsWith("/uploads/") ? `${import.meta.env.VITE_API_URL}${img.url}` : img.url)
      );
    });
  }, [partPrefix]);
  return images;
}


export default function Team() {
  const teamSectionTitle = useTextBlock("Team Section Title");
  const teamSectionSubheading = useTextBlock("Team Section Subheading");
  const coreTeamTitle = useTextBlock("Core Team Title");
  const coreTeamSubheading = useTextBlock("Core Team Subheading");
  const connectWithTeamTitle = useTextBlock("Connect With Team Title");
  const connectWithTeamSubheading = useTextBlock("Connect With Team Subheading");
  const joinTeamButton = useTextBlock("Join Team Button");
  const contactTeamButton = useTextBlock("Contact Team Button");
 const leadersSectionTitle = useTextBlock("Leaders Section Title"); 
 const quickLink2 = useTextBlock("Quick Link 2");

  const heroImages = useCarouselImages("Team Photo");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const visibleImages = heroImages.length > 0 ? [heroImages[carouselIndex % heroImages.length]] : [];
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cities, setCities] = useState<CityData[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(true);
  const [citiesError, setCitiesError] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  useEffect(() => {
    async function fetchTeam() {
      try {
        const data = await apiService.getPublicTeamMembers();
        setTeamMembers(data);
      } catch (err: any) {
        setError(err.message || "Failed to load team members");
      } finally {
        setLoading(false);
      }
    }
    fetchTeam();
  }, []);

  useEffect(() => {
    async function fetchCities() {
      try {
        const data = await apiService.getCities();
        setCities(data);
      } catch (err: any) {
        setCitiesError(err.message || "Failed to load cities");
      } finally {
        setCitiesLoading(false);
      }
    }
    fetchCities();
  }, []);

  // 1. Filter core members (by a 'core' field if present, or by position)
  const coreMembers = teamMembers.filter(m => m.core === true);
  const nonCoreMembers = teamMembers.filter(m => !coreMembers.includes(m));
  const ahmedabadMembers = nonCoreMembers.filter(m => m.city === 'Ahmedabad');
  const gandhinagarMembers = nonCoreMembers.filter(m => m.city === 'Gandhinagar');
  const vadodaraMembers = nonCoreMembers.filter(m => m.city === 'Vadodara');
  const suratMembers = nonCoreMembers.filter(m => m.city === 'Surat');

  // Memoize active cities to prevent unnecessary re-renders
  const activeCities = useMemo(() => cities.filter(city => city.isActive), [cities]);

  const handleRegisterClick = useCallback((city: CityData) => {
    if (city.registrationLink) {
      // If city has external registration link, open it
      window.open(city.registrationLink, '_blank');
    } else {
      // Otherwise, open our registration modal
      setSelectedCity(city);
      setShowRegistrationModal(true);
    }
  }, []);

  const handleRegistrationSuccess = useCallback(() => {
    // Refresh cities data to update student count
    async function refreshCities() {
      try {
        const data = await apiService.getCities();
        setCities(data);
      } catch (err) {
        console.error('Failed to refresh cities:', err);
      }
    }
    refreshCities();
  }, []);

  const BACKEND_URL = import.meta.env.VITE_API_URL; // Change to your backend URL in production

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Background Image */}
      <section className="relative py-8 md:py-12 lg:py-16 overflow-hidden" style={{ minHeight: 'calc(14rem + 4cm)' }}>
        <div className="absolute inset-0 flex">
          {visibleImages.map((img, idx) => (
            <img
              key={img}
              src={img}
              alt={`Team Hero ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          ))}
          <button onClick={() => setCarouselIndex((carouselIndex - 1 + heroImages.length) % heroImages.length)} className="absolute left-2 top-1/2 z-20 bg-white/50 rounded-full px-2 py-1">{"<"}</button>
          <button onClick={() => setCarouselIndex((carouselIndex + 1) % heroImages.length)} className="absolute right-2 top-1/2 z-20 bg-white/50 rounded-full px-2 py-1">{">"}</button>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center h-56 md:h-72 lg:h-80">
          <div className="text-center space-y-8 text-white">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                {teamSectionTitle}
              </h1>
              <p className="text-xl lg:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
                {teamSectionSubheading}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Members Section */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-1 rounded-full border border-primary text-primary font-semibold mb-4">Core Team</span>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-2"> {leadersSectionTitle}</h2>
            <p className="text-lg text-muted-foreground">{coreTeamSubheading}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreMembers.map(member => (
              <Card key={member._id} className="flex flex-row items-center justify-center p-6 rounded-2xl shadow-lg w-full h-auto md:w-96 md:h-48 mx-auto text-left">
                {/* Avatar/Image */}
                <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center bg-primary/10 mr-4">
                  {member.image ? (
                    <img src={member.image.startsWith('/uploads/') ? BACKEND_URL + member.image : member.image} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="flex flex-col justify-center flex-1">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <div className="text-primary font-semibold text-base mb-1">{member.position}</div>
                  {member.city && (
                    <div className="text-muted-foreground text-sm mb-1">{member.city}</div>
                  )}
                  {member.core && (
                    <div className="inline-block px-3 py-1 rounded-md bg-yellow-200 text-yellow-900 font-semibold text-xs mb-1">Core Member</div>
                  )}
                  {member.description && (
                    <div className="text-muted-foreground text-xs mt-1 line-clamp-3">{member.description}</div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <div className="w-full flex justify-center my-8">
        <div className="h-1 w-40 rounded-full" style={{ background: '#800000' }}></div>
      </div>

      {/* Our Team Section - All non-core members unified */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-1 rounded-full border border-primary text-primary font-semibold mb-4">Our Team</span>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-2 underline decoration-primary decoration-4 underline-offset-8">{quickLink2}</h2>
         
          </div>
          {loading ? (
            <LoadingSkeleton type="team" count={8} />
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {nonCoreMembers.map((member) => (
                <TeamMemberCard
                  key={member._id}
                  member={member}
                  backendUrl={BACKEND_URL}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Cities We Have Covered Section */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 rounded-full border border-primary text-primary font-semibold mb-4">Our Reach</span>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">Cities We Have Covered</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Discover the cities where TPC has made an impact and join our growing Community of changemakers
            </p>
          </div>

          {citiesLoading ? (
            <LoadingSkeleton type="city" count={3} />
          ) : citiesError ? (
            <div className="text-center text-red-500 py-8">{citiesError}</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {activeCities.map((city) => (
                <CityCard
                  key={city._id}
                  city={city}
                  onRegisterClick={handleRegisterClick}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {connectWithTeamTitle}
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            {connectWithTeamSubheading}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-8"
              onClick={() => window.open('https://linktr.ee/ArgueFest?lt_utm_source=lt_share_link#470901593', '_blank')}
            >
              {joinTeamButton}
            </Button>
          </div>
        </div>
      </section>

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={showRegistrationModal}
        city={selectedCity}
        onClose={() => {
          setShowRegistrationModal(false);
          setSelectedCity(null);
        }}
        onSuccess={handleRegistrationSuccess}
      />

      <Footer />
    </div>
  );
}
