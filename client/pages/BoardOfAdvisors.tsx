
import { useTextBlock } from "@/hooks/useTextBlock";
import { useCarouselImages } from "@/hooks/useCarouselImages";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiService, Advisor } from "@/services/api";
import Footer from "@/components/Footer";
import AdvisorSection from "@/components/AdvisorSection";
import TimedCarouselTextEvents from "../components/TimedCarouselTextEvents";


export default function BoardOfAdvisors() {
  const [carouselIndex, setCarouselIndex] = useState(0);

  const advisorsSectionTitle = useTextBlock("Advisors Section Title") || "Board of Advisors";
  const advisorsSectionSubheading = useTextBlock("Advisors Section Subheading") || "Meet the distinguished advisors guiding our mission.";
  const interactionsSectionTitle = useTextBlock("Interactions Section Title", "Interactions");
  const interactionsSectionSubheading = useTextBlock("Interactions Section Subheading", "Explore our collaborative partnerships and Community engagements");

  // Advisors and interactions via React Query
  const { data: advisorsData = [], isLoading: advisorsLoading, error: advisorsError } = useQuery<Advisor[]>({
    queryKey: ["advisors"],
    queryFn: () => apiService.getAdvisors(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Hero/slider section state and images
  const heroImages = useCarouselImages("Board of Advisors");

  // White fullscreen loading screen until text blocks are ready (don't wait for advisors data)
  const textBlocksLoading = !advisorsSectionTitle || !advisorsSectionSubheading;
  if (textBlocksLoading) {
    return (
      <div style={{ background: '#fff', width: '100vw', height: '100vh', position: 'fixed', inset: 0, zIndex: 9999 }} />
    );
  }

  const visibleImages = heroImages.length > 0 ? [heroImages[carouselIndex % heroImages.length]] : [];
  console.log(`[BoardOfAdvisors] Hero images: ${heroImages.length}, Visible: ${visibleImages.length}`, visibleImages);

  const boardAdvisors = advisorsData.filter((advisor: Advisor) => !advisor.isInteraction);
  const interactions = advisorsData.filter((advisor: Advisor) => advisor.isInteraction);

  const boardLoading = advisorsLoading;
  const interactionsLoading = advisorsLoading;
  const boardError = advisorsError ? (advisorsError as Error).message : null;
  const interactionsError = advisorsError ? (advisorsError as Error).message : null;


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
        <div className="absolute inset-0 flex flex-col items-center justify-center w-full h-full md:relative md:h-72 lg:h-80 z-10">
          <div className="text-center space-y-8 text-white">
            <div className="space-y-4">

              <TimedCarouselTextEvents
                title={advisorsSectionTitle || "Board of Advisors"}
                subtitle={advisorsSectionSubheading || "Meet our advisors"}
              />
            </div>
          </div>
        </div>
      </section>
      {/* Advisors Section */}
      <AdvisorSection
        title={advisorsSectionTitle}
        subtitle={advisorsSectionSubheading}
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