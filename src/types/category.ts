import type { ContentImage } from "@/types/media";

export type CategoryMotif =
  | "balloons"
  | "birthday"
  | "baby"
  | "reveal"
  | "wedding"
  | "celebration"
  | "gift"
  | "ribbon";

export type Category = {
  slug: string;
  parentSlug?: string;
  level?: 1 | 2 | 3;
  name: string;
  eyebrow: string;
  shortDescription: string;
  description: string;
  accent: string;
  accentSoft: string;
  accentDark: string;
  motif: CategoryMotif;
  coverImage?: ContentImage;
  sortOrder: number;
  highlights: readonly string[];
};
