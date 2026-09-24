import type { ContentImage } from "@/types/media";

export type ProductArtworkKind =
  | "balloon-bouquet"
  | "foil-number"
  | "chrome-balloons"
  | "birthday-table"
  | "birthday-banner"
  | "baby-balloons"
  | "baby-keepsake"
  | "reveal-balloon"
  | "reveal-table"
  | "engagement-tray"
  | "rose-gold-set"
  | "bride-set"
  | "henna-set"
  | "magnet"
  | "gift-basket"
  | "ribbon";

export type ProductColor = {
  name: string;
  hex: string;
};

export type Product = {
  slug: string;
  name: string;
  categorySlug: string;
  categoryName?: string;
  conceptSlugs: readonly string[];
  shortDescription: string;
  description: string;
  artworkKind: ProductArtworkKind;
  images?: readonly ContentImage[];
  colors: readonly ProductColor[];
  dimensions?: string;
  featured: boolean;
  newArrival: boolean;
  sortOrder: number;
  highlights: readonly string[];
  whatsappMessage?: string;
};
