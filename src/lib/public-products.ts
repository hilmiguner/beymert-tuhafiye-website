import { cache } from "react";

import { products as fallbackProducts } from "@/data/products";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import type { Product, ProductArtworkKind, ProductColor } from "@/types/product";

const genericPalette = [
  "#d13f73",
  "#c895a7",
  "#7294b8",
  "#cda55f",
  "#8f455c",
  "#75865a",
] as const;

const knownColorHex: Record<string, string> = {
  siyah: "#333239",
  beyaz: "#f6f1ec",
  pembe: "#d96d94",
  pudra: "#d9a9b9",
  krem: "#f1e5da",
  lila: "#a98bc9",
  mavi: "#7294b8",
  "açık mavi": "#aac5de",
  yesil: "#6d9b78",
  yeşil: "#6d9b78",
  gumus: "#bdc3ca",
  gümüş: "#bdc3ca",
  altin: "#d8b56f",
  altın: "#d8b56f",
  gold: "#d8b56f",
  "rose gold": "#c9967f",
  rose: "#b98998",
  bordo: "#8f3b50",
  doğal: "#c6a17d",
  "pembe krom": "#c96f8f",
  "gümüş krom": "#9da8b2",
  "altın krom": "#b99352",
};

const artworkByCategory: Record<string, ProductArtworkKind> = {
  balonlar: "balloon-bouquet",
  "dogum-gunu": "birthday-table",
  "baby-shower": "baby-balloons",
  "cinsiyet-partisi": "reveal-balloon",
  "soz-nisan-dugun": "engagement-tray",
  "kina-bekarliga-veda": "bride-set",
  "kisiye-ozel-hediyelik": "magnet",
  "tul-kurdele-tuhafiye": "ribbon",
};

function normalizeColorName(value: string) {
  return value.trim().toLocaleLowerCase("tr-TR");
}

function colorsFor(
  names: readonly string[],
  fallback: Product | undefined,
): ProductColor[] {
  return names.map((name, index) => {
    const fallbackColor = fallback?.colors.find(
      (color) =>
        normalizeColorName(color.name) === normalizeColorName(name),
    );

    return {
      name,
      hex:
        fallbackColor?.hex ??
        knownColorHex[normalizeColorName(name)] ??
        genericPalette[index % genericPalette.length],
    };
  });
}

function excerpt(value: string, maxLength = 120) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}

export const getPublicProducts = cache(
  async (): Promise<readonly Product[]> => {
    const supabase = createPublicSupabaseClient();

    if (!supabase) {
      return fallbackProducts;
    }

    try {
      const [
        { data: rows, error: productError },
        { data: mediaRows, error: mediaError },
        { data: conceptRows, error: conceptError },
      ] = await Promise.all([
        supabase
          .from("products")
          .select(
            "id, slug, name, short_description, description, category_id, colors, dimensions, featured, new_arrival, whatsapp_message, sort_order, categories(slug, name)",
          )
          .eq("status", "published")
          .order("sort_order", { ascending: true })
          .order("name", { ascending: true }),
        supabase
          .from("product_media")
          .select(
            "product_id, sort_order, is_cover, media_assets(storage_path, alt_text, width, height)",
          )
          .order("sort_order", { ascending: true }),
        supabase
          .from("product_concepts")
          .select("product_id, concepts(slug)"),
      ]);

      if (productError || !rows) {
        return fallbackProducts;
      }

      const mediaByProduct = new Map<
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
          const current = mediaByProduct.get(relation.product_id) ?? [];
          current.push({
            sortOrder: relation.sort_order,
            isCover: relation.is_cover,
            storagePath: relation.media_assets.storage_path,
            altText: relation.media_assets.alt_text,
            width: relation.media_assets.width,
            height: relation.media_assets.height,
          });
          mediaByProduct.set(relation.product_id, current);
        }
      }

      const conceptsByProduct = new Map<string, string[]>();
      if (!conceptError) {
        for (const relation of conceptRows ?? []) {
          const slug = relation.concepts?.slug;
          if (!slug) continue;
          const current = conceptsByProduct.get(relation.product_id) ?? [];
          current.push(slug);
          conceptsByProduct.set(relation.product_id, current);
        }
      }

      return rows.map((row) => {
        const fallback = fallbackProducts.find(
          (product) => product.slug === row.slug,
        );
        const categorySlug =
          row.categories?.slug ?? fallback?.categorySlug ?? "";
        const description =
          row.description.trim() ||
          fallback?.description ||
          row.short_description.trim() ||
          row.name;
        const colorNames =
          row.colors.length > 0
            ? row.colors
            : fallback?.colors.map((color) => color.name) ?? [];
        const relatedConcepts = conceptsByProduct.get(row.id);
        const media = (mediaByProduct.get(row.id) ?? [])
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

        return {
          slug: row.slug,
          name: row.name,
          categorySlug,
          categoryName: row.categories?.name,
          conceptSlugs:
            relatedConcepts && relatedConcepts.length > 0
              ? relatedConcepts
              : fallback?.conceptSlugs ?? [],
          shortDescription:
            row.short_description.trim() ||
            fallback?.shortDescription ||
            excerpt(description),
          description,
          artworkKind:
            fallback?.artworkKind ??
            artworkByCategory[categorySlug] ??
            "balloon-bouquet",
          images: media.length > 0 ? media : fallback?.images,
          colors: colorsFor(colorNames, fallback),
          dimensions: row.dimensions?.trim() || fallback?.dimensions,
          featured: row.featured,
          newArrival: row.new_arrival,
          sortOrder: row.sort_order,
          highlights: fallback?.highlights ?? [],
          whatsappMessage: row.whatsapp_message?.trim() || undefined,
        } satisfies Product;
      });
    } catch {
      return fallbackProducts;
    }
  },
);

export const getPublicProductBySlug = cache(async (slug: string) => {
  const products = await getPublicProducts();
  return products.find((product) => product.slug === slug);
});

export async function getPublicProductsByCategory(categorySlug: string) {
  const products = await getPublicProducts();
  return products.filter((product) => product.categorySlug === categorySlug);
}

export async function getPublicProductsByConcept(conceptSlug: string) {
  const products = await getPublicProducts();
  return products.filter((product) =>
    product.conceptSlugs.includes(conceptSlug),
  );
}

export async function getRelatedPublicProducts(product: Product, limit = 4) {
  const products = await getPublicProducts();

  const sameConcept = products.filter(
    (candidate) =>
      candidate.slug !== product.slug &&
      candidate.conceptSlugs.some((slug) => product.conceptSlugs.includes(slug)),
  );

  const sameCategory = products.filter(
    (candidate) =>
      candidate.slug !== product.slug &&
      candidate.categorySlug === product.categorySlug &&
      !sameConcept.some((item) => item.slug === candidate.slug),
  );

  return [...sameConcept, ...sameCategory].slice(0, limit);
}
