import { cache } from "react";

import { products as fallbackProducts } from "@/data/products";
import { getCategoryDescendantSlugs } from "@/lib/category-hierarchy";
import { getPublicCategories } from "@/lib/public-categories";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import type {
  Product,
  ProductArtworkKind,
  ProductCategoryRef,
  ProductColor,
  ProductColorSeries,
  ProductColorVariant,
} from "@/types/product";

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
        { data: categoryRows, error: categoryError },
        { data: productColorRows, error: productColorError },
        { data: productSeriesRows, error: productSeriesError },
        { data: variantRows, error: variantError },
      ] = await Promise.all([
        supabase
          .from("products")
          .select(
            "id, slug, name, short_description, description, category_id, colors, dimensions, featured, new_arrival, whatsapp_message, sort_order, categories!products_category_id_fkey(slug, name)",
          )
          .eq("status", "published")
          .order("sort_order", { ascending: true })
          .order("name", { ascending: true }),
        supabase
          .from("product_media")
          .select(
            "product_id, media_id, caption, sort_order, is_cover, media_assets(storage_path, alt_text, width, height)",
          )
          .order("sort_order", { ascending: true }),
        supabase
          .from("product_concepts")
          .select("product_id, concepts(slug)"),
        supabase
          .from("product_categories")
          .select("product_id, category_id, categories!product_categories_category_id_fkey(slug, name)"),
        supabase
          .from("product_colors")
          .select(
            "product_id, sort_order, colors!product_colors_color_id_fkey(id, name, hex, group_key, sort_order)",
          )
          .order("sort_order", { ascending: true }),
        supabase
          .from("product_color_series")
          .select(
            "product_id, sort_order, color_series!product_color_series_series_id_fkey(id, name, slug, sort_order)",
          )
          .order("sort_order", { ascending: true }),
        supabase
          .from("product_color_variants")
          .select(
            "product_id, color_id, series_id, media_id, sort_order, colors!product_color_variants_color_id_fkey(id, name, hex, group_key), color_series!product_color_variants_series_id_fkey(id, name, slug)",
          )
          .order("sort_order", { ascending: true }),
      ]);

      if (productError || !rows) {
        return fallbackProducts;
      }

      const mediaByProduct = new Map<
        string,
        Array<{
          mediaId: string;
          caption: string;
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
            mediaId: relation.media_id,
            caption: relation.caption,
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

      const categoriesByProduct = new Map<string, ProductCategoryRef[]>();
      if (!categoryError) {
        for (const relation of categoryRows ?? []) {
          const category = relation.categories;
          if (!category) continue;

          const current = categoriesByProduct.get(relation.product_id) ?? [];
          if (!current.some((item) => item.slug === category.slug)) {
            current.push({ slug: category.slug, name: category.name });
          }
          categoriesByProduct.set(relation.product_id, current);
        }
      }

      const colorsByProduct = new Map<string, ProductColor[]>();
      if (!productColorError) {
        for (const relation of productColorRows ?? []) {
          const color = relation.colors;
          if (!color) continue;

          const current = colorsByProduct.get(relation.product_id) ?? [];
          current.push({
            id: color.id,
            name: color.name,
            hex:
              color.hex ??
              knownColorHex[normalizeColorName(color.name)] ??
              genericPalette[current.length % genericPalette.length],
            groupKey: color.group_key as ProductColor["groupKey"],
          });
          colorsByProduct.set(relation.product_id, current);
        }
      }

      const seriesByProduct = new Map<string, ProductColorSeries[]>();
      if (!productSeriesError) {
        for (const relation of productSeriesRows ?? []) {
          const item = relation.color_series;
          if (!item) continue;

          const current = seriesByProduct.get(relation.product_id) ?? [];
          current.push({
            id: item.id,
            name: item.name,
            slug: item.slug,
          });
          seriesByProduct.set(relation.product_id, current);
        }
      }

      const variantsByProduct = new Map<
        string,
        Array<{
          colorId: string;
          colorName: string;
          colorHex: string;
          seriesId?: string;
          seriesName?: string;
          seriesSlug?: string;
          mediaId?: string;
        }>
      >();

      if (!variantError) {
        for (const relation of variantRows ?? []) {
          const color = relation.colors;
          if (!color) continue;

          const current = variantsByProduct.get(relation.product_id) ?? [];
          current.push({
            colorId: color.id,
            colorName: color.name,
            colorHex:
              color.hex ??
              knownColorHex[normalizeColorName(color.name)] ??
              genericPalette[current.length % genericPalette.length],
            seriesId: relation.color_series?.id,
            seriesName: relation.color_series?.name,
            seriesSlug: relation.color_series?.slug,
            mediaId: relation.media_id ?? undefined,
          });
          variantsByProduct.set(relation.product_id, current);
        }
      }

      return rows.map((row) => {
        const fallback = fallbackProducts.find(
          (product) => product.slug === row.slug,
        );
        const legacyCategory = row.categories
          ? { slug: row.categories.slug, name: row.categories.name }
          : undefined;
        const relatedCategories = categoriesByProduct.get(row.id) ?? [];
        const allCategories = [
          ...(legacyCategory ? [legacyCategory] : []),
          ...relatedCategories.filter(
            (category) => category.slug !== legacyCategory?.slug,
          ),
        ];
        const categorySlug =
          legacyCategory?.slug ??
          allCategories[0]?.slug ??
          fallback?.categorySlug ??
          "";
        const categoryName =
          legacyCategory?.name ??
          allCategories.find((category) => category.slug === categorySlug)
            ?.name;
        const categorySlugs =
          allCategories.length > 0
            ? allCategories.map((category) => category.slug)
            : fallback
              ? [fallback.categorySlug]
              : [];
        const description =
          row.description.trim() ||
          fallback?.description ||
          row.short_description.trim() ||
          row.name;
        const selectedColors = colorsByProduct.get(row.id);
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
            mediaId: item.mediaId,
            caption: item.caption || undefined,
            src: supabase.storage
              .from("cms-media")
              .getPublicUrl(item.storagePath).data.publicUrl,
            alt: item.altText,
            width: item.width ?? 1600,
            height: item.height ?? 1200,
          }));
        const mediaById = new Map(
          media
            .filter((item) => item.mediaId)
            .map((item) => [item.mediaId!, item]),
        );
        const productVariants: ProductColorVariant[] = (
          variantsByProduct.get(row.id) ?? []
        ).map((variant) => ({
          ...variant,
          image: variant.mediaId
            ? mediaById.get(variant.mediaId)
            : undefined,
        }));

        return {
          slug: row.slug,
          name: row.name,
          categorySlug,
          categoryName,
          categorySlugs,
          categories: allCategories,
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
          colors:
            selectedColors && selectedColors.length > 0
              ? selectedColors
              : colorsFor(colorNames, fallback),
          colorSeries: seriesByProduct.get(row.id) ?? [],
          colorVariants: productVariants,
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
  const [products, categories] = await Promise.all([
    getPublicProducts(),
    getPublicCategories(),
  ]);
  const categorySlugs = getCategoryDescendantSlugs(categories, categorySlug);

  return products.filter((product) => {
    const assignedSlugs =
      product.categorySlugs && product.categorySlugs.length > 0
        ? product.categorySlugs
        : product.categorySlug
          ? [product.categorySlug]
          : [];

    return assignedSlugs.some((slug) => categorySlugs.has(slug));
  });
}

export async function getPublicProductsByConcept(conceptSlug: string) {
  const products = await getPublicProducts();
  return products.filter((product) =>
    product.conceptSlugs.includes(conceptSlug),
  );
}

export async function getRelatedPublicProducts(product: Product, limit = 4) {
  const products = await getPublicProducts();
  const productCategorySlugs = new Set(
    product.categorySlugs && product.categorySlugs.length > 0
      ? product.categorySlugs
      : product.categorySlug
        ? [product.categorySlug]
        : [],
  );

  const sameConcept = products.filter(
    (candidate) =>
      candidate.slug !== product.slug &&
      candidate.conceptSlugs.some((slug) => product.conceptSlugs.includes(slug)),
  );

  const sameCategory = products.filter((candidate) => {
    const candidateSlugs =
      candidate.categorySlugs && candidate.categorySlugs.length > 0
        ? candidate.categorySlugs
        : candidate.categorySlug
          ? [candidate.categorySlug]
          : [];

    return (
      candidate.slug !== product.slug &&
      candidateSlugs.some((slug) => productCategorySlugs.has(slug)) &&
      !sameConcept.some((item) => item.slug === candidate.slug)
    );
  });

  return [...sameConcept, ...sameCategory].slice(0, limit);
}
