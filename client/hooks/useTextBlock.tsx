import { useEffect, useState } from "react";

export function useTextBlock(title: string, fallback?: string) {
  const [value, setValue] = useState<string>(fallback ?? title ?? "");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/texts/by-title?title=${encodeURIComponent(title)}`)
      .then(async (res) => {
        if (!res.ok) {
          // 404 or other error: use fallback or title (no console error)
          setValue(fallback ?? title ?? "");
          return;
        }
        const data = await res.json();
        setValue(data.value || fallback || title || "");
      })
      .catch(() => {
        // Silently fail, do not log
        setValue(fallback ?? title ?? "");
      });
  }, [title, fallback]);

  return value;
}
 