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

export type ProductColorGroupKey =
  | "basic"
  | "special"
  | "metallic_chrome"
  | "other";

export type ProductColor = {
  id?: string;
  name: string;
  hex: string;
  groupKey?: ProductColorGroupKey;
};

export type ProductColorSeries = {
  id: string;
  name: string;
  slug: string;
};

export type ProductColorVariant = {
  colorId: string;
  colorName: string;
  colorHex: string;
  seriesId?: string;
  seriesName?: string;
  seriesSlug?: string;
  mediaId?: string;
  image?: ContentImage;
};

export type ProductCategoryRef = {
  slug: string;
  name: string;
};

export type Product = {
  slug: string;
  name: string;
  categorySlug: string;
  categoryName?: string;
  categorySlugs?: readonly string[];
  categories?: readonly ProductCategoryRef[];
  conceptSlugs: readonly string[];
  shortDescription: string;
  description: string;
  artworkKind: ProductArtworkKind;
  images?: readonly ContentImage[];
  colors: readonly ProductColor[];
  colorSeries?: readonly ProductColorSeries[];
  colorVariants?: readonly ProductColorVariant[];
  dimensions?: string;
  featured: boolean;
  newArrival: boolean;
  sortOrder: number;
  highlights: readonly string[];
  whatsappMessage?: string;
};
