import { useEffect, useState, useCallback, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { apiService, CarouselImage } from "@/services/api";

interface HomepageCarouselProps {
  autoplayDelay?: number;
  showDots?: boolean;
  className?: string;
}

export default function HomepageCarousel({
  autoplayDelay = 5000,
  showDots = true,
  className = "",
}: HomepageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Fetch carousel images
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        const carouselImages = await apiService.getCarouselImages();
        setImages(carouselImages);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch carousel images:", err);
        setError("Failed to load carousel images");
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Update selected index when slide changes
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi, onSelect]);

  // Auto-play functionality with pause support
  useEffect(() => {
    if (!emblaApi || images.length <= 1 || isPaused) return;

    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, autoplayDelay);

    return () => clearInterval(autoplay);
  }, [emblaApi, autoplayDelay, images.length, isPaused]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!emblaApi || images.length <= 1) return;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          emblaApi.scrollPrev();
          break;
        case 'ArrowRight':
          event.preventDefault();
          emblaApi.scrollNext();
          break;
        case ' ':
        case 'Enter':
          if (event.target === carouselRef.current) {
            event.preventDefault();
            setIsPaused(!isPaused);
          }
          break;
      }
    };

    const carouselElement = carouselRef.current;
    if (carouselElement) {
      carouselElement.addEventListener('keydown', handleKeyDown);
      return () => carouselElement.removeEventListener('keydown', handleKeyDown);
    }
  }, [emblaApi, images.length, isPaused]);

  // Navigate to specific slide
  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  // Loading state
  if (isLoading) {
    return (
      <div className={`relative w-full ${className}`}>
        <div className="rounded-2xl overflow-hidden shadow-2xl animate-pulse bg-gray-200 w-full h-full">
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-gray-400">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  // Error state or no images - show fallback
  if (error || images.length === 0) {
    return (
      <div className={`relative w-full ${className}`}>
        <div className="rounded-2xl overflow-hidden shadow-2xl w-full h-full">
          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <div className="text-lg font-medium">No carousel images</div>
              <div className="text-sm">Upload images with part "homepage carousel"</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Single image - no carousel needed
  if (images.length === 1) {
    const image = images[0];
    const imageUrl = image.url.startsWith("/uploads/") 
      ? `${import.meta.env.VITE_API_URL}${image.url}` 
      : image.url;

    return (
      <div className={`relative w-full ${className}`}>
        <div className="rounded-2xl overflow-hidden shadow-2xl w-full h-full">
          <img
            src={imageUrl}
            alt={image.alt || image.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    );
  }

  // Multiple images - show carousel
  return (
    <div 
      className={`absolute inset-0 flex flex-col items-center justify-center w-full h-full md:relative md:h-auto ${className}`} 
      ref={carouselRef}
      tabIndex={0}
      role="region"
      aria-label="Homepage image carousel"
      aria-live="polite"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div 
        className="overflow-hidden rounded-2xl shadow-2xl w-full h-full" 
        ref={emblaRef}
        role="img"
        aria-label={`Image ${selectedIndex + 1} of ${images.length}: ${images[selectedIndex]?.alt || images[selectedIndex]?.title}`}
      >
        <div className="flex">
          {images.map((image, index) => {
            const imageUrl = image.url.startsWith("/uploads/") 
              ? `${import.meta.env.VITE_API_URL}${image.url}` 
              : image.url;

            return (
              <div key={image._id} className="flex-[0_0_100%] min-w-0">
                <div className="w-full h-full relative">
                  <img
                    src={imageUrl}
                    alt={image.alt || image.title}
                    className="w-full h-full object-cover object-center"
                    loading={index === 0 ? "eager" : "lazy"}
                    aria-hidden={index !== selectedIndex}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation dots */}
      {showDots && images.length > 1 && (
        <div 
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2"
          role="tablist"
          aria-label="Carousel navigation"
        >
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                index === selectedIndex
                  ? "bg-primary scale-110"
                  : "bg-white/50 hover:bg-white/70"
              }`}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-selected={index === selectedIndex}
              role="tab"
              tabIndex={index === selectedIndex ? 0 : -1}
            />
          ))}
        </div>
      )}

      {/* Screen reader only status */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Showing image {selectedIndex + 1} of {images.length}. 
        {isPaused ? 'Carousel paused.' : 'Carousel auto-playing.'}
        Use arrow keys to navigate or press space to pause.
      </div>
    </div>
  );
}