import type { ContentImage } from "@/types/media";

export type GalleryAspect =
  | "portrait"
  | "landscape"
  | "square"
  | "wide";

export type GallerySource =
  | {
      kind: "product";
      slug: string;
      variant: "main" | "detail" | "color";
    }
  | {
      kind: "concept";
      slug: string;
      variant: "hero" | "table" | "detail";
    };

export type GalleryItem = {
  id: string;
  title: string;
  description: string;
  source: GallerySource;
  image?: ContentImage;
  aspect: GalleryAspect;
  categorySlug?: string;
  conceptSlug?: string;
  productSlug?: string;
  featured: boolean;
  sortOrder: number;
};
