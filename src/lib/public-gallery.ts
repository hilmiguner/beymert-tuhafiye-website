import { cache } from "react";

import { galleryItems as fallbackGalleryItems } from "@/data/gallery";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import type { GalleryAspect, GalleryItem } from "@/types/gallery";

function aspectFor(width: number | null, height: number | null): GalleryAspect {
  if (!width || !height) {
    return "landscape";
  }

  const ratio = width / height;

  if (ratio >= 1.55) return "wide";
  if (ratio >= 1.1) return "landscape";
  if (ratio <= 0.85) return "portrait";
  return "square";
}

export const getPublicGalleryItems = cache(
  async (): Promise<readonly GalleryItem[]> => {
    const supabase = createPublicSupabaseClient();

    if (!supabase) {
      return fallbackGalleryItems;
    }

    try {
      const { data, error } = await supabase
        .from("gallery_items")
        .select(
          "id, title, description, sort_order, created_at, media_assets(storage_path, alt_text, width, height), categories(slug, name), concepts(slug, name)",
        )
        .eq("status", "published")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error || !data) {
        return fallbackGalleryItems;
      }

      return data
        .filter((row) => row.media_assets)
        .map((row) => {
          const media = row.media_assets!;
          const title = row.title.trim() || media.alt_text || "Galeri görseli";

          return {
            id: row.id,
            title,
            description: row.description.trim(),
            image: {
              src: supabase.storage
                .from("cms-media")
                .getPublicUrl(media.storage_path).data.publicUrl,
              alt: media.alt_text || title,
              width: media.width ?? 1600,
              height: media.height ?? 1200,
            },
            aspect: aspectFor(media.width, media.height),
            categorySlug: row.categories?.slug ?? undefined,
            categoryName: row.categories?.name ?? undefined,
            conceptSlug: row.concepts?.slug ?? undefined,
            conceptName: row.concepts?.name ?? undefined,
            featured: true,
            sortOrder: row.sort_order,
          } satisfies GalleryItem;
        });
    } catch {
      return fallbackGalleryItems;
    }
  },
);
