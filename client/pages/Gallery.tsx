import { useState, useEffect } from "react";
import { useTextBlock } from "@/hooks/useTextBlock";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Camera,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Users,
} from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "@/components/Footer";
import TimedCarouselText from "../components/TimedCarouselText";
import { apiService, GalleryImage } from "@/services/api";

// Utility: detect YouTube link (simple check)
function isYouTubeLink(url: string = ""): boolean {
  return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(url);
}
// Utility: convert YouTube link to embed URL
function getYouTubeEmbedUrl(url: string = ""): string {
  if (!url) return "";
  // Handle youtu.be short links
  const shortMatch = url.match(/youtu\.be\/(.+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1].split(/[?&]/)[0]}`;
  // Handle full youtube.com links
  const idMatch = url.match(/[?&]v=([^&]+)/);
  if (idMatch) return `https://www.youtube.com/embed/${idMatch[1]}`;
  // Handle embed links
  if (url.includes("/embed/")) return url;
  return url;
}

interface GalleryItem {
  _id: string;
  title: string;
  url: string;
  alt?: string;
  event?: string;
  date?: string;
  location?: string;
  category?: string;
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

export default function Gallery() {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [filter, setFilter] = useState<string>("All");
  const navigate = useNavigate();
  const location = useLocation();
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  const categories = [
    "All",
    "Debate",
    "MUN",
    "Workshop",
    "Speaker Session",
    "Social Impact",
  ];

  useEffect(() => {
    apiService.getGalleryImages().then(setGalleryItems).catch(console.error);
  }, []);

  const filteredItems = galleryItems.filter(
    (item) => filter === "All" || item.category === filter,
  );

  // Handle modal open/close with history
  useEffect(() => {
    if (selectedItem) {
      // Push a new history entry when modal opens
      navigate(`?item=${selectedItem._id}`, { replace: false, state: { modal: true } });
    }
    // Listen for popstate (back button)
    const handlePop = () => {
      setSelectedItem(null);
    };
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, [selectedItem, navigate]);

  // Open modal if ?item=ID in URL (on direct link or back)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const itemId = params.get("item");
    if (itemId) {
      const item = galleryItems.find((g) => g._id === itemId);
      if (item) setSelectedItem(item);
    } else {
      setSelectedItem(null);
    }
    // eslint-disable-next-line
  }, [location.search]);

  const openModal = (item: GalleryItem) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  const navigateImage = (direction: "prev" | "next") => {
    if (!selectedItem) return;

    const currentIndex = filteredItems.findIndex(
      (item) => item._id === selectedItem._id,
    );
    let newIndex;

    if (direction === "prev") {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredItems.length - 1;
    } else {
      newIndex = currentIndex < filteredItems.length - 1 ? currentIndex + 1 : 0;
    }

    setSelectedItem(filteredItems[newIndex]);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Debate":
        return "bg-primary/10 text-primary border-primary/20";
      case "MUN":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Workshop":
        return "bg-green-100 text-green-700 border-green-200";
      case "Speaker Session":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Social Impact":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const heroImages = useCarouselImages("Gallery Photo");
  const [carouselIndex, setCarouselIndex] = useState(0);

  const gallerySectionTitle = useTextBlock("Gallery Section Title", "Our Moments");
  const gallerySectionSubheading = useTextBlock("Gallery Section Subheading", "Capturing the essence of leadership, learning, and Community impact through memorable moments at TPC events");

  // White fullscreen loading screen until text blocks AND gallery images are ready
  const textBlocksLoading = !gallerySectionTitle || !gallerySectionSubheading;
  const imagesLoading = galleryItems.length === 0;
  const allDataLoaded = !textBlocksLoading && !imagesLoading;
  if (!allDataLoaded) {
    return (
      <div style={{ background: '#fff', width: '100vw', height: '100vh', position: 'fixed', inset: 0, zIndex: 9999 }} />
    );
  }
  const visibleImages = heroImages.length > 0 ? [heroImages[carouselIndex % heroImages.length]] : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-8 md:py-12 lg:py-16 overflow-hidden" style={{ minHeight: 'calc(14rem + 4cm)' }}>
        <div className="absolute inset-0 flex">
          {visibleImages.map((img, idx) => (
            <img
              key={img}
              src={img}
              alt={`Gallery Hero ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          ))}
          <button onClick={() => setCarouselIndex((carouselIndex - 1 + heroImages.length) % heroImages.length)} className="absolute left-2 top-1/2 z-20 bg-white/50 rounded-full px-2 py-1">{"<"}</button>
          <button onClick={() => setCarouselIndex((carouselIndex + 1) % heroImages.length)} className="absolute right-2 top-1/2 z-20 bg-white/50 rounded-full px-2 py-1">{">"}</button>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center w-full h-full md:relative md:h-72 lg:h-80 z-10">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
  {gallerySectionTitle}
</h1>
<p className="text-lg md:text-2xl text-white max-w-2xl text-center">
  {gallerySectionSubheading}
</p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-2 md:py-3 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 md:gap-4 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={filter === category ? "default" : "outline"}
                onClick={() => setFilter(category)}
                size="sm"
                className="h-8 px-2 text-xs md:h-10 md:px-4 md:text-base"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-1 md:px-4">
          <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1 md:gap-6">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="group relative aspect-square overflow-hidden rounded-none md:rounded-xl cursor-pointer hover:shadow-xl transition-all duration-300"
                onClick={() => setSelectedItem(item)}
              >
                {isYouTubeLink(item.url) ? (
  <iframe
    src={getYouTubeEmbedUrl(item.url)}
    title={item.title}
    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  />
) : (
  <img
    src={item.url.startsWith('/uploads/') ? `${import.meta.env.VITE_API_URL}${item.url}` : item.url}
    alt={item.alt || item.title}
    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
  />
)}
                {/* Hide overlay and captions on mobile */}
                <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-semibold text-sm md:text-base mb-1 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-300 mb-2">
                      {item.event}
                    </p>
                    <Badge
                      className={`${getCategoryColor(item.category || '')} text-xs`}
                    >
                      {item.category}
                    </Badge>
                  </div>
                </div>
                {/* Media Type Icon */}
                <div className="absolute top-3 right-3">
                  <div className="w-8 h-8 bg-black/60 rounded-full flex items-center justify-center">
                    {isYouTubeLink(item.url) ? <Play className="w-4 h-4 text-white" /> : <Camera className="w-4 h-4 text-white" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredItems.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                No images found for the selected category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:top-1/3 md:-translate-y-1/3 max-w-2xl w-full h-auto md:h-[70vh] p-0 bg-primary border-0 z-[9999]">
          <VisuallyHidden>
            <DialogTitle>Gallery Image</DialogTitle>
          </VisuallyHidden>
          {selectedItem && (
            <div className="relative w-full h-full flex flex-col">
              {/* Modern Card-Style Modal: Only image with overlayed info */}
              <div className="flex-1 relative flex items-center justify-center bg-black/80 rounded-xl overflow-hidden">
                {isYouTubeLink(selectedItem.url) ? (
  <iframe
    src={getYouTubeEmbedUrl(selectedItem.url)}
    title={selectedItem.title}
    className="w-full h-full object-contain"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  />
) : (
  <img
    src={selectedItem.url.startsWith('/uploads/') ? `${import.meta.env.VITE_API_URL}${selectedItem.url}` : selectedItem.url}
    alt={selectedItem.alt || selectedItem.title}
    className="max-w-full max-h-full object-contain w-full h-full"
  />
)}
                {/* Small White Close Button Top Right */}
                <button
                  onClick={closeModal}
                  className="absolute top-2 right-2 z-10 bg-transparent p-1 flex items-center justify-center"
                  aria-label="Close"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
                {/* Gradient Overlay and Info at Bottom */}
                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 via-black/30 to-transparent rounded-b-xl flex flex-col items-start">
                  <h2 className="text-white text-lg md:text-2xl font-bold mb-1">
                    {selectedItem.title}
                  </h2>
                  <Badge className={`${getCategoryColor(selectedItem.category || '')} text-xs mb-1`}>{selectedItem.category}</Badge>
                  <p className="text-white/80 text-[10px] mb-0">
                    {selectedItem.event}
                  </p>
                  {selectedItem.date && (
                    <p className="text-white/80 text-[10px] mt-1">
                      {selectedItem.date}
                    </p>
                  )}
                  {selectedItem.location && (
                    <p className="text-white/80 text-[10px] mt-1">
                      <MapPin className="inline-block mr-1 w-3 h-3" /> {selectedItem.location}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
}


