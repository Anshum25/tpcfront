
import { useTextBlock } from "@/hooks/useTextBlock";
import { useEffect, useState } from "react";
import { apiService, Advisor } from "@/services/api";
import Footer from "@/components/Footer";
import AdvisorSection from "@/components/AdvisorSection";

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

export default function BoardOfAdvisors() {
  const advisorsSectionTitle = useTextBlock("Advisors Section Title") || "Board of Advisors";
  const advisorsSectionSubheading = useTextBlock("Advisors Section Subheading") || "Meet the distinguished advisors guiding our mission.";
  const interactionsSectionTitle = useTextBlock("Interactions Section Title", "Interactions");
  const interactionsSectionSubheading = useTextBlock("Interactions Section Subheading", "Explore our collaborative partnerships and Community engagements");

  // Hero/slider section state and images
  const heroImages = useCarouselImages("Board of Advisors");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const visibleImages = heroImages.length > 0 ? [heroImages[carouselIndex % heroImages.length]] : [];

  // Separate state for board advisors and interactions
  const [boardAdvisors, setBoardAdvisors] = useState<Advisor[]>([]);
  const [interactions, setInteractions] = useState<Advisor[]>([]);
  const [boardLoading, setBoardLoading] = useState(true);
  const [interactionsLoading, setInteractionsLoading] = useState(true);
  const [boardError, setBoardError] = useState<string | null>(null);
  const [interactionsError, setInteractionsError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBoardAdvisors() {
      try {
        const data = await apiService.getAdvisors();
        // Filter for board advisors (isInteraction: false or undefined)
        const boardData = data.filter(advisor => !advisor.isInteraction);
        setBoardAdvisors(boardData);
      } catch (err: any) {
        setBoardError(err.message || "Failed to load board advisors");
      } finally {
        setBoardLoading(false);
      }
    }

    async function fetchInteractions() {
      try {
        const data = await apiService.getAdvisors();
        // Filter for interactions (isInteraction: true)
        const interactionData = data.filter(advisor => advisor.isInteraction);
        setInteractions(interactionData);
      } catch (err: any) {
        setInteractionsError(err.message || "Failed to load interactions");
      } finally {
        setInteractionsLoading(false);
      }
    }

    fetchBoardAdvisors();
    fetchInteractions();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-8 md:py-12 lg:py-16 overflow-hidden" style={{ minHeight: 'calc(14rem + 4cm)' }}>
        <div className="absolute inset-0 flex">
          {visibleImages.map((img, idx) => (
            <img
              key={img}
              src={img}
              alt={`Advisors Hero ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          ))}
          <button onClick={() => setCarouselIndex((carouselIndex - 1 + heroImages.length) % heroImages.length)} className="absolute left-2 top-1/2 z-20 bg-white/50 rounded-full px-2 py-1">{"<"}</button>
          <button onClick={() => setCarouselIndex((carouselIndex + 1) % heroImages.length)} className="absolute right-2 top-1/2 z-20 bg-white/50 rounded-full px-2 py-1">{">"}</button>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-56 md:h-72 lg:h-80">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
            {advisorsSectionTitle}
          </h1>
          <p className="text-lg md:text-2xl text-white max-w-2xl text-center">
           {advisorsSectionSubheading}
          </p>
        </div>
      </section>
      {/* Advisors Section */}
      <AdvisorSection
        title={advisorsSectionTitle}
        advisors={boardAdvisors}
        loading={boardLoading}
        error={boardError}
      />

      {/* Interactions Section */}
      <AdvisorSection
        title={interactionsSectionTitle}
        subtitle={interactionsSectionSubheading}
        advisors={interactions}
        loading={interactionsLoading}
        error={interactionsError}
      />
      <Footer />
    </div>
  );
} 