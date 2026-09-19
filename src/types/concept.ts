export type ConceptMotif =
  | "safari"
  | "princess"
  | "unicorn"
  | "football"
  | "pink-gold"
  | "blue-silver"
  | "baby"
  | "bride";

export type ConceptGalleryScene = {
  title: string;
  description: string;
  variant: "hero" | "table" | "detail";
};

export type Concept = {
  slug: string;
  name: string;
  eyebrow: string;
  shortDescription: string;
  description: string;
  motif: ConceptMotif;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    foreground: string;
  };
  relatedCategorySlugs: readonly string[];
  gallery: readonly ConceptGalleryScene[];
  sortOrder: number;
};
