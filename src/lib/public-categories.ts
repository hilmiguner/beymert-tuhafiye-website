import { cache } from "react";

import { categories as fallbackCategories } from "@/data/categories";
import { sortPublicCategoriesByHierarchy } from "@/lib/category-hierarchy";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import type { Category, CategoryMotif } from "@/types/category";
import type { Tables } from "@/types/database";

type CategoryRow = Pick<
  Tables<"categories">,
  "id" | "parent_id" | "slug" | "name" | "description" | "sort_order"
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

function toPublicCategory(
  row: CategoryRow,
  index: number,
  parentSlug: string | undefined,
  level: 1 | 2 | 3,
): Category {
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
    parentSlug,
    level,
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
        .select("id, parent_id, slug, name, description, sort_order")
        .eq("status", "published")
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true });

      if (error || !data) {
        return fallbackCategories;
      }

      const rowsById = new Map(data.map((row) => [row.id, row]));
      const metadata = new Map<
        string,
        { parentSlug?: string; level: 1 | 2 | 3 } | null
      >();

      const resolveMetadata = (
        row: CategoryRow,
        path = new Set<string>(),
      ): { parentSlug?: string; level: 1 | 2 | 3 } | null => {
        if (metadata.has(row.id)) {
          return metadata.get(row.id) ?? null;
        }

        if (path.has(row.id)) {
          metadata.set(row.id, null);
          return null;
        }

        if (!row.parent_id) {
          const value = { level: 1 as const };
          metadata.set(row.id, value);
          return value;
        }

        const parent = rowsById.get(row.parent_id);
        if (!parent) {
          metadata.set(row.id, null);
          return null;
        }

        const nextPath = new Set(path);
        nextPath.add(row.id);
        const parentMetadata = resolveMetadata(parent, nextPath);

        if (!parentMetadata || parentMetadata.level >= 3) {
          metadata.set(row.id, null);
          return null;
        }

        const value = {
          parentSlug: parent.slug,
          level: (parentMetadata.level + 1) as 2 | 3,
        };
        metadata.set(row.id, value);
        return value;
      };

      const categories = data.flatMap((row, index) => {
        const resolved = resolveMetadata(row);
        return resolved
          ? [
              toPublicCategory(
                row,
                index,
                resolved.parentSlug,
                resolved.level,
              ),
            ]
          : [];
      });

      return sortPublicCategoriesByHierarchy(categories);
    } catch {
      return fallbackCategories;
    }
  },
);

export const getPublicCategoryBySlug = cache(async (slug: string) => {
  const categories = await getPublicCategories();
  return categories.find((category) => category.slug === slug);
});
