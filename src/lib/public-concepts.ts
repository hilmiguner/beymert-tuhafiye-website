import { cache } from "react";

import { concepts as fallbackConcepts } from "@/data/concepts";
import { getPublicProducts } from "@/lib/public-products";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import type {
  Concept,
  ConceptGalleryScene,
  ConceptMotif,
} from "@/types/concept";
import type { ContentImage } from "@/types/media";

type Presentation = Pick<Concept, "eyebrow" | "motif" | "colors">;

const genericPresentations: readonly Presentation[] = [
  {
    eyebrow: "Beymert konsepti",
    motif: "pink-gold",
    colors: {
      primary: "#d13f73",
      secondary: "#d9a58c",
      background: "#fff1f5",
      foreground: "#673147",
    },
  },
  {
    eyebrow: "Beymert konsepti",
    motif: "blue-silver",
    colors: {
      primary: "#648bb5",
      secondary: "#b9c2ca",
      background: "#edf4fa",
      foreground: "#314a64",
    },
  },
  {
    eyebrow: "Beymert konsepti",
    motif: "baby",
    colors: {
      primary: "#c895a7",
      secondary: "#d7c4ae",
      background: "#faf5ef",
      foreground: "#65545a",
    },
  },
  {
    eyebrow: "Beymert konsepti",
    motif: "safari",
    colors: {
      primary: "#75865a",
      secondary: "#c99a66",
      background: "#f3efe3",
      foreground: "#34402a",
    },
  },
] satisfies readonly {
  eyebrow: string;
  motif: ConceptMotif;
  colors: Concept["colors"];
}[];

function excerpt(value: string, maxLength = 120) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}

function galleryFromImages(
  images: ContentImage[],
  fallback: Concept | undefined,
): ConceptGalleryScene[] {
  if (images.length === 0) {
    return fallback ? [...fallback.gallery] : [];
  }

  const variants: ConceptGalleryScene["variant"][] = [
    "hero",
    "table",
    "detail",
  ];

  return images.slice(0, 3).map((image, index) => {
    const fallbackScene = fallback?.gallery[index];

    return {
      title:
        fallbackScene?.title ??
        ["Ana görünüm", "Konsept detayı", "Tamamlayıcı detay"][index] ??
        "Konsept görünümü",
      description:
        fallbackScene?.description ??
        "Konsept için mağazadan yüklenen güncel görsel.",
      variant: fallbackScene?.variant ?? variants[index] ?? "detail",
      image,
    };
  });
}

export const getPublicConcepts = cache(
  async (): Promise<readonly Concept[]> => {
    const supabase = createPublicSupabaseClient();

    if (!supabase) {
      return fallbackConcepts;
    }

    try {
      const [
        { data: rows, error: conceptError },
        { data: mediaRows, error: mediaError },
        products,
      ] = await Promise.all([
        supabase
          .from("concepts")
          .select(
            "id, slug, name, short_description, description, whatsapp_message, sort_order",
          )
          .eq("status", "published")
          .order("sort_order", { ascending: true })
          .order("name", { ascending: true }),
        supabase
          .from("concept_media")
          .select(
            "concept_id, sort_order, is_cover, media_assets(storage_path, alt_text, width, height)",
          )
          .order("sort_order", { ascending: true }),
        getPublicProducts(),
      ]);

      if (conceptError || !rows) {
        return fallbackConcepts;
      }

      const mediaByConcept = new Map<
        string,
        Array<{
          sortOrder: number;
          isCover: boolean;
          storagePath: string;
          altText: string;
          width: number | null;
          height: number | null;
        }>
      >();

      if (!mediaError) {
        for (const relation of mediaRows ?? []) {
          if (!relation.media_assets) continue;
          const current = mediaByConcept.get(relation.concept_id) ?? [];
          current.push({
            sortOrder: relation.sort_order,
            isCover: relation.is_cover,
            storagePath: relation.media_assets.storage_path,
            altText: relation.media_assets.alt_text,
            width: relation.media_assets.width,
            height: relation.media_assets.height,
          });
          mediaByConcept.set(relation.concept_id, current);
        }
      }

      return rows.map((row, index) => {
        const fallback = fallbackConcepts.find(
          (concept) => concept.slug === row.slug,
        );
        const presentation =
          fallback ?? genericPresentations[index % genericPresentations.length];
        const description =
          row.description.trim() ||
          fallback?.description ||
          row.short_description.trim() ||
          row.name;

        const images = (mediaByConcept.get(row.id) ?? [])
          .sort(
            (a, b) =>
              Number(b.isCover) - Number(a.isCover) ||
              a.sortOrder - b.sortOrder,
          )
          .map((item) => ({
            src: supabase.storage
              .from("cms-media")
              .getPublicUrl(item.storagePath).data.publicUrl,
            alt: item.altText,
            width: item.width ?? 1600,
            height: item.height ?? 1200,
          }));

        const relatedCategorySlugs = Array.from(
          new Set(
            products
              .filter((product) => product.conceptSlugs.includes(row.slug))
              .map((product) => product.categorySlug)
              .filter(Boolean),
          ),
        );

        return {
          slug: row.slug,
          name: row.name,
          eyebrow: fallback?.eyebrow ?? presentation.eyebrow,
          shortDescription:
            row.short_description.trim() ||
            fallback?.shortDescription ||
            excerpt(description),
          description,
          motif: presentation.motif,
          coverImage: images[0] ?? fallback?.coverImage,
          colors: presentation.colors,
          relatedCategorySlugs:
            relatedCategorySlugs.length > 0
              ? relatedCategorySlugs
              : fallback?.relatedCategorySlugs ?? [],
          gallery: galleryFromImages(images, fallback),
          sortOrder: row.sort_order,
          whatsappMessage: row.whatsapp_message?.trim() || undefined,
        } satisfies Concept;
      });
    } catch {
      return fallbackConcepts;
    }
  },
);

export const getPublicConceptBySlug = cache(async (slug: string) => {
  const concepts = await getPublicConcepts();
  return concepts.find((concept) => concept.slug === slug);
});
