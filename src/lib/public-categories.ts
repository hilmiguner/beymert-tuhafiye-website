import { cache } from "react";

import { categories as fallbackCategories } from "@/data/categories";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import type { Category, CategoryMotif } from "@/types/category";
import type { Tables } from "@/types/database";

type CategoryRow = Pick<
  Tables<"categories">,
  "slug" | "name" | "description" | "sort_order"
>;

type CategoryPresentation = Pick<
  Category,
  "accent" | "accentSoft" | "accentDark" | "motif"
>;

const presentationPresets: readonly CategoryPresentation[] = [
  {
    accent: "#d13f73",
    accentSoft: "#f9dce6",
    accentDark: "#8e3155",
    motif: "balloons",
  },
  {
    accent: "#c85b69",
    accentSoft: "#fde8e7",
    accentDark: "#7c3640",
    motif: "birthday",
  },
  {
    accent: "#c08aa3",
    accentSoft: "#f7eaf0",
    accentDark: "#765165",
    motif: "baby",
  },
  {
    accent: "#9676b9",
    accentSoft: "#eee8f6",
    accentDark: "#5e4778",
    motif: "celebration",
  },
] satisfies readonly {
  accent: string;
  accentSoft: string;
  accentDark: string;
  motif: CategoryMotif;
}[];

function excerpt(value: string, maxLength = 118) {
  const normalized = value.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}

function toPublicCategory(row: CategoryRow, index: number): Category {
  const fallback = fallbackCategories.find(
    (category) => category.slug === row.slug,
  );
  const description =
    row.description.trim() ||
    fallback?.description ||
    `${row.name} kategorisindeki ürünleri keşfetmek için Beymert ile iletişime geçebilirsin.`;
  const presentation =
    fallback ?? presentationPresets[index % presentationPresets.length];

  return {
    slug: row.slug,
    name: row.name,
    eyebrow: fallback?.eyebrow ?? "Beymert seçkisi",
    shortDescription:
      fallback && description === fallback.description
        ? fallback.shortDescription
        : excerpt(description),
    description,
    accent: presentation.accent,
    accentSoft: presentation.accentSoft,
    accentDark: presentation.accentDark,
    motif: presentation.motif,
    coverImage: fallback?.coverImage,
    sortOrder: row.sort_order,
    highlights: fallback?.highlights ?? [],
  };
}

export const getPublicCategories = cache(
  async (): Promise<readonly Category[]> => {
    const supabase = createPublicSupabaseClient();

    if (!supabase) {
      return fallbackCategories;
    }

    try {
      const { data, error } = await supabase
        .from("categories")
        .select("slug, name, description, sort_order")
        .eq("status", "published")
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true });

      if (error || !data) {
        return fallbackCategories;
      }

      return data.map(toPublicCategory);
    } catch {
      return fallbackCategories;
    }
  },
);

export const getPublicCategoryBySlug = cache(async (slug: string) => {
  const categories = await getPublicCategories();
  return categories.find((category) => category.slug === slug);
});
