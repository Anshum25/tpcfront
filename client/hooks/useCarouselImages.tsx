import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api";

export function useCarouselImages(partPrefix: string) {
  const { data: images = [] } = useQuery<string[]>({
    queryKey: ["carouselImages", partPrefix],
    queryFn: async () => {
      const allImages = await apiService.getImages();
      return allImages
        .filter(img => img.part && img.part.startsWith(partPrefix))
        .sort((a, b) => {
          const getNum = (part: string) => parseInt(part.replace(/\D/g, "")) || 0;
          return getNum(a.part!) - getNum(b.part!);
        })
        .map(img => img.url.startsWith("/uploads/") ? `${import.meta.env.VITE_API_URL}${img.url}` : img.url);
    },
    staleTime: 0, // Always fetch fresh data
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Always refetch on mount
    refetchOnReconnect: false,
    retry: 3, // Retry failed requests
    retryDelay: 1000, // Wait 1 second between retries
  });
  
  return images;
}
