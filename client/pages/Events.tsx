import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { apiService, Event as DBEvent, User } from "@/services/api";
import { useTextBlock } from "@/hooks/useTextBlock";
import Footer from "@/components/Footer";

const getEventImageUrl = (image?: string) => {
  if (!image) return undefined;
  if (image.startsWith('/uploads/')) {
    return `${import.meta.env.VITE_API_URL}${image}`;
  }
  return image;
};

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

export default function Events() {
  const [events, setEvents] = useState<DBEvent[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(false);
  const [registering, setRegistering] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const user = apiService.getStoredUser();
  const categories = [
    "All",
    "Debate",
    "Model UN",
    "Workshop",
    "Speaker Session",
    "Social Impact",
  ];
  const eventsSectionTitle = useTextBlock("Events Section Title");
  const eventsSectionSubheading = useTextBlock("Events Section Subheading");

  useEffect(() => {
    setIsLoading(true);
    apiService.getEvents()
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredEvents = events.filter(
    (event) => filter === "All" || event.category === filter,
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Debate":
        return "bg-primary/10 text-primary";
      case "Model UN":
        return "bg-accent/10 text-accent";
      case "Workshop":
        return "bg-blue-100 text-blue-700";
      case "Speaker Session":
        return "bg-green-100 text-green-700";
      case "Social Impact":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Upcoming":
        return "bg-green-100 text-green-700";
      case "Ongoing":
        return "bg-yellow-100 text-yellow-700";
      case "Completed":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Carousel logic for hero images
  const heroImages = useCarouselImages("Events Section");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const visibleImages = heroImages.length > 0 ? [heroImages[carouselIndex % heroImages.length]] : [];

  // Helper to determine if event is completed
  function isEventCompleted(event) {
    // Combine date and time into a single Date object
    const eventDateTime = new Date(`${event.date}T${event.time}`);
    return new Date() > eventDateTime;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Background Image */}
      <section className="relative py-8 md:py-12 lg:py-16 overflow-hidden" style={{ minHeight: 'calc(14rem + 4cm)' }}>
        <div className="absolute inset-0 flex">
          {visibleImages.map((img, idx) => (
            <img
              key={img}
              src={img}
              alt={`Events Hero ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          ))}
          <button onClick={() => setCarouselIndex((carouselIndex - 1 + heroImages.length) % heroImages.length)} className="absolute left-2 top-1/2 z-20 bg-white/50 rounded-full px-2 py-1">{"<"}</button>
          <button onClick={() => setCarouselIndex((carouselIndex + 1) % heroImages.length)} className="absolute right-2 top-1/2 z-20 bg-white/50 rounded-full px-2 py-1">{">"}</button>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
        {/* Floating Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-xl animate-float"></div>
          <div
            className="absolute top-40 right-20 w-24 h-24 bg-accent/20 rounded-full blur-xl animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute bottom-32 left-1/3 w-40 h-40 bg-primary/10 rounded-full blur-xl animate-float"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center w-full h-full md:relative md:h-72 lg:h-80 z-10">
          <div className="text-center space-y-8 text-white">
            <div className="space-y-4">
            
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                {eventsSectionTitle}
              </h1>
              <p className="text-xl lg:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
                {eventsSectionSubheading}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 mb-12 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={filter === category ? "default" : "outline"}
                onClick={() => setFilter(category)}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Events Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.length === 0 && (
              <div className="col-span-full text-center text-muted-foreground py-12">
                No events found.
              </div>
            )}
            {filteredEvents.map((event) => {
              const completed = isEventCompleted(event);
              const statusLabel = completed ? "Completed" : "Upcoming";
              const isRegistered = event.registeredUsers && user && event.registeredUsers.some((u: User) => u._id === user.userId);
              return (
                <Card key={event._id} className="overflow-hidden shadow-lg border border-muted bg-white hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                  {/* Show event image if present */}
                  {event.image && (
                    <img
                      src={getEventImageUrl(event.image)}
                      alt={event.title}
                      className="w-full h-48 object-cover"
                      style={{ borderBottom: '1px solid #eee' }}
                    />
                  )}
                  <CardHeader className="pb-2 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Badge className={getCategoryColor(event.category)}>{event.category}</Badge>
                      <Badge className={getStatusColor(statusLabel)}>{statusLabel}</Badge>
                    </div>
                    <CardTitle className="text-xl font-bold text-foreground">
                      {event.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {event.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-1 space-y-2">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{event.date}</span>
                      <Clock className="h-4 w-4 ml-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex-1"></div>
                    <Button
                      className="w-full mt-4"
                      variant={event.registrationLink ? (completed ? "secondary" : "default") : "secondary"}
                      disabled={!event.registrationLink}
                      onClick={() => {
                        if (event.registrationLink) {
                          window.open(event.registrationLink, '_blank', 'noopener');
                        }
                      }}
                    >
                      {isRegistered ? 'Registered' : registering === event._id ? 'Registering...' : 'Register Now'}
                    </Button>
                    {error && <div className="text-red-500 text-xs mt-2">{error}</div>}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                No events found for the selected category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-8 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Want to Organize an Event?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Join our organizing team and help create impactful events that shape
            the future leaders of Gujarat.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8"
            onClick={() => window.open('https://linktr.ee/ArgueFest?lt_utm_source=lt_share_link#470901593', '_blank')}
          >
            Join Our Team
          </Button>
        </div>
      </section>
      <Footer />
    </div>
  );
}
