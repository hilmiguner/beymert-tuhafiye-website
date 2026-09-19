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
  name: string;
  eyebrow: string;
  shortDescription: string;
  description: string;
  accent: string;
  accentSoft: string;
  accentDark: string;
  motif: CategoryMotif;
  sortOrder: number;
  highlights: readonly string[];
};
