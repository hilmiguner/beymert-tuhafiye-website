import { cache } from "react";

import {
  defaultStoreSettings,
  type StoreSettings,
} from "@/config/site";
import { createPublicClient } from "@/lib/supabase/public";
import type { Category, CategoryMotif } from "@/types/category";
import type { Concept, ConceptMotif } from "@/types/concept";
import type { Tables } from "@/types/database";
import type { GalleryAspect, GalleryItem } from "@/types/gallery";
import type { ContentImage } from "@/types/media";
import type {
  Product,
  ProductArtworkKind,
  ProductColor,
} from "@/types/product";

type MediaRow = Tables<"media_assets">;
type CategoryRow = Tables<"categories">;
type ProductRow = Tables<"products">;
type ConceptRow = Tables<"concepts">;
type GalleryRow = Tables<"gallery_items">;
type ProductMediaRow = Tables<"product_media">;
type ConceptMediaRow = Tables<"concept_media">;
type ProductConceptRow = Tables<"product_concepts">;

const categoryStyles: Array<{
  motif: CategoryMotif;
  accent: string;
  accentSoft: string;
  accentDark: string;
}> = [
  { motif: "balloons", accent: "#d03d72", accentSoft: "#fbe8ef", accentDark: "#8d2c51" },
  { motif: "birthday", accent: "#c87865", accentSoft: "#faece7", accentDark: "#825044" },
  { motif: "baby", accent: "#8f9fc9", accentSoft: "#edf0fa", accentDark: "#586587" },
  { motif: "reveal", accent: "#b986d3", accentSoft: "#f4eafa", accentDark: "#75558a" },
  { motif: "wedding", accent: "#b89562", accentSoft: "#f6efe4", accentDark: "#75603f" },
  { motif: "celebration", accent: "#ca668b", accentSoft: "#f9eaf0", accentDark: "#82425b" },
  { motif: "gift", accent: "#7f9c73", accentSoft: "#edf4ea", accentDark: "#52674a" },
  { motif: "ribbon", accent: "#b87091", accentSoft: "#f5eaf0", accentDark: "#77495f" },
];

const conceptStyles: Array<{
  motif: ConceptMotif;
  primary: string;
  secondary: string;
  background: string;
  foreground: string;
}> = [
  { motif: "safari", primary: "#75865a", secondary: "#c99a66", background: "#f3efe3", foreground: "#34402a" },
  { motif: "princess", primary: "#d980a8", secondary: "#d6b07a", background: "#fff0f5", foreground: "#6f3551" },
  { motif: "unicorn", primary: "#b986d3", secondary: "#e58dac", background: "#f7f1ff", foreground: "#5d3e71" },
  { motif: "football", primary: "#438a58", secondary: "#f0f0e8", background: "#eaf4ec", foreground: "#23452e" },
  { motif: "pink-gold", primary: "#d03d72", secondary: "#d9a58c", background: "#fff1f5", foreground: "#673147" },
  { motif: "blue-silver", primary: "#648bb5", secondary: "#b9c2ca", background: "#edf4fa", foreground: "#314a64" },
  { motif: "baby", primary: "#c895a7", secondary: "#d7c4ae", background: "#faf5ef", foreground: "#65545a" },
  { motif: "bride", primary: "#cf577f", secondary: "#b88a9a", background: "#fff0f5", foreground: "#6d3248" },
];

const artworkKinds: ProductArtworkKind[] = [
  "balloon-bouquet",
  "foil-number",
  "chrome-balloons",
  "birthday-table",
  "birthday-banner",
  "baby-balloons",
  "baby-keepsake",
  "reveal-balloon",
  "reveal-table",
  "engagement-tray",
  "rose-gold-set",
  "bride-set",
  "henna-set",
  "magnet",
  "gift-basket",
  "ribbon",
];

const fallbackColorHexes = [
  "#d03d72",
  "#d9a58c",
  "#75865a",
  "#648bb5",
  "#b986d3",
  "#c6a15e",
];

const namedColorHexes: Record<string, string> = {
  "altın": "#c6a15e",
  "gold": "#c6a15e",
  "gümüş": "#b9c2ca",
  "silver": "#b9c2ca",
  "rose gold": "#c79078",
  "pembe": "#d87096",
  "pink": "#d87096",
  "beyaz": "#f6f1ed",
  "white": "#f6f1ed",
  "mavi": "#648bb5",
  "blue": "#648bb5",
  "yeşil": "#75865a",
  "green": "#75865a",
  "siyah": "#333239",
  "black": "#333239",
  "kırmızı": "#b85555",
  "red": "#b85555",
  "bordo": "#8f455c",
  "krem": "#eee3d7",
  "cream": "#eee3d7",
  "lila": "#b986d3",
  "mor": "#8e68a8",
  "purple": "#8e68a8",
  "doğal": "#c6a17d",
  "sarı": "#e6c85c",
  "yellow": "#e6c85c",
  "turuncu": "#dc8c57",
  "orange": "#dc8c57",
};

function stableIndex(value: string, length: number) {
  let hash = 0;
  for (const char of value) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return hash % length;
}

function textValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function storeSettingsFromRow(
  row: Tables<"store_settings"> | null | undefined,
): StoreSettings {
  if (!row) return defaultStoreSettings;

  const openingHours = objectValue(row.opening_hours);
  const socialLinks = objectValue(row.social_links);

  return {
    name: textValue(row.site_name) || defaultStoreSettings.name,
    shortName: textValue(row.short_name) || defaultStoreSettings.shortName,
    locationLabel:
      textValue(row.location_label) || defaultStoreSettings.locationLabel,
    address: textValue(row.address) || defaultStoreSettings.address,
    phoneDisplay: textValue(row.phone) || defaultStoreSettings.phoneDisplay,
    whatsapp: textValue(row.whatsapp) || defaultStoreSettings.whatsapp,
    defaultWhatsappMessage:
      textValue(row.default_whatsapp_message) ||
      defaultStoreSettings.defaultWhatsappMessage,
    publicHours: {
      weekdayLabel:
        textValue(openingHours.weekdayLabel) ||
        defaultStoreSettings.publicHours.weekdayLabel,
      weekdayHours:
        textValue(openingHours.weekdayHours) ||
        defaultStoreSettings.publicHours.weekdayHours,
      sundayLabel:
        textValue(openingHours.sundayLabel) ||
        defaultStoreSettings.publicHours.sundayLabel,
      sundayHours:
        textValue(openingHours.sundayHours) ||
        defaultStoreSettings.publicHours.sundayHours,
    },
    socialLinks: {
      facebook: textValue(socialLinks.facebook),
      instagram: textValue(socialLinks.instagram),
    },
    mapQuery: textValue(row.map_query) || defaultStoreSettings.mapQuery,
  };
}

function productColors(values: string[], seed: string): ProductColor[] {
  return values.map((value, index) => {
    const trimmed = value.trim();
    const directHex = /^#[0-9a-f]{6}$/i.test(trimmed) ? trimmed : undefined;
    const normalized = trimmed.toLocaleLowerCase("tr-TR");
    return {
      name: trimmed,
      hex:
        directHex ??
        namedColorHexes[normalized] ??
        fallbackColorHexes[(stableIndex(seed, fallbackColorHexes.length) + index) % fallbackColorHexes.length],
    };
  });
}

function galleryAspect(media?: MediaRow): GalleryAspect {
  if (!media?.width || !media.height) return "landscape";
  const ratio = media.width / media.height;
  if (ratio > 1.45) return "wide";
  if (ratio > 1.08) return "landscape";
  if (ratio < 0.86) return "portrait";
  return "square";
}

function logQueryError(label: string, error: unknown) {
  if (error) {
    console.error(`[public-content] ${label} query failed`, error);
  }
}

export const getPublicContentSnapshot = cache(async () => {
  const supabase = createPublicClient();

  if (!supabase) {
    return {
      storeSettings: defaultStoreSettings,
      categories: [] as Category[],
      products: [] as Product[],
      concepts: [] as Concept[],
      galleryItems: [] as GalleryItem[],
    };
  }

  const [
    settingsResult,
    categoriesResult,
    productsResult,
    conceptsResult,
    galleryResult,
    mediaResult,
    productMediaResult,
    conceptMediaResult,
    productConceptResult,
  ] = await Promise.all([
    supabase.from("store_settings").select("*").eq("id", 1).maybeSingle(),
    supabase
      .from("categories")
      .select("*")
      .eq("status", "published")
      .order("sort_order")
      .order("name"),
    supabase
      .from("products")
      .select("*")
      .eq("status", "published")
      .order("sort_order")
      .order("name"),
    supabase
      .from("concepts")
      .select("*")
      .eq("status", "published")
      .order("sort_order")
      .order("name"),
    supabase
      .from("gallery_items")
      .select("*")
      .eq("status", "published")
      .order("sort_order")
      .order("created_at"),
    supabase.from("media_assets").select("*"),
    supabase.from("product_media").select("*"),
    supabase.from("concept_media").select("*"),
    supabase.from("product_concepts").select("*"),
  ]);

  logQueryError("store_settings", settingsResult.error);
  logQueryError("categories", categoriesResult.error);
  logQueryError("products", productsResult.error);
  logQueryError("concepts", conceptsResult.error);
  logQueryError("gallery_items", galleryResult.error);
  logQueryError("media_assets", mediaResult.error);
  logQueryError("product_media", productMediaResult.error);
  logQueryError("concept_media", conceptMediaResult.error);
  logQueryError("product_concepts", productConceptResult.error);

  const categoryRows = (categoriesResult.data ?? []) as CategoryRow[];
  const productRows = (productsResult.data ?? []) as ProductRow[];
  const conceptRows = (conceptsResult.data ?? []) as ConceptRow[];
  const galleryRows = (galleryResult.data ?? []) as GalleryRow[];
  const mediaRows = (mediaResult.data ?? []) as MediaRow[];
  const productMediaRows = (productMediaResult.data ?? []) as ProductMediaRow[];
  const conceptMediaRows = (conceptMediaResult.data ?? []) as ConceptMediaRow[];
  const productConceptRows = (productConceptResult.data ?? []) as ProductConceptRow[];

  const mediaById = new Map(mediaRows.map((row) => [row.id, row]));
  const categoryById = new Map(categoryRows.map((row) => [row.id, row]));
  const productById = new Map(productRows.map((row) => [row.id, row]));
  const conceptById = new Map(conceptRows.map((row) => [row.id, row]));

  const contentImage = (mediaId: string | null): ContentImage | undefined => {
    if (!mediaId) return undefined;
    const media = mediaById.get(mediaId);
    if (!media) return undefined;

    return {
      src: supabase.storage
        .from("cms-media")
        .getPublicUrl(media.storage_path).data.publicUrl,
      alt: media.alt_text,
      width: media.width ?? 1200,
      height: media.height ?? 900,
    };
  };

  const productMediaByProduct = new Map<string, ProductMediaRow[]>();
  for (const relation of productMediaRows) {
    const current = productMediaByProduct.get(relation.product_id) ?? [];
    current.push(relation);
    productMediaByProduct.set(relation.product_id, current);
  }

  const conceptMediaByConcept = new Map<string, ConceptMediaRow[]>();
  for (const relation of conceptMediaRows) {
    const current = conceptMediaByConcept.get(relation.concept_id) ?? [];
    current.push(relation);
    conceptMediaByConcept.set(relation.concept_id, current);
  }

  const conceptIdsByProduct = new Map<string, string[]>();
  const productIdsByConcept = new Map<string, string[]>();
  for (const relation of productConceptRows) {
    const conceptIds = conceptIdsByProduct.get(relation.product_id) ?? [];
    conceptIds.push(relation.concept_id);
    conceptIdsByProduct.set(relation.product_id, conceptIds);

    const productIds = productIdsByConcept.get(relation.concept_id) ?? [];
    productIds.push(relation.product_id);
    productIdsByConcept.set(relation.concept_id, productIds);
  }

  const products: Product[] = productRows.map((row) => {
    const category = row.category_id
      ? categoryById.get(row.category_id)
      : undefined;
    const mediaRelations = [...(productMediaByProduct.get(row.id) ?? [])].sort(
      (a, b) =>
        Number(b.is_cover) - Number(a.is_cover) ||
        a.sort_order - b.sort_order,
    );
    const conceptSlugs = (conceptIdsByProduct.get(row.id) ?? [])
      .map((id) => conceptById.get(id)?.slug)
      .filter((slug): slug is string => Boolean(slug));
    const colors = productColors(row.colors, row.slug);

    return {
      slug: row.slug,
      name: row.name,
      categorySlug: category?.slug ?? "",
      categoryName: category?.name,
      conceptSlugs,
      shortDescription: row.short_description || row.description,
      description: row.description || row.short_description,
      artworkKind: artworkKinds[stableIndex(row.slug, artworkKinds.length)],
      images: mediaRelations
        .map((relation) => contentImage(relation.media_id))
        .filter((image): image is ContentImage => Boolean(image)),
      colors,
      dimensions: row.dimensions ?? undefined,
      featured: row.featured,
      newArrival: row.new_arrival,
      sortOrder: row.sort_order,
      highlights: row.colors.slice(0, 4),
      whatsappMessage: row.whatsapp_message ?? undefined,
    };
  });

  const productsByCategoryId = new Map<string, ProductRow[]>();
  for (const row of productRows) {
    if (!row.category_id) continue;
    const current = productsByCategoryId.get(row.category_id) ?? [];
    current.push(row);
    productsByCategoryId.set(row.category_id, current);
  }

  const categories: Category[] = categoryRows.map((row) => {
    const style = categoryStyles[stableIndex(row.slug, categoryStyles.length)];
    const categoryProducts = productsByCategoryId.get(row.id) ?? [];
    const description =
      row.description || `${row.name} ürünlerini ve güncel seçenekleri keşfedin.`;

    return {
      slug: row.slug,
      name: row.name,
      eyebrow: "Beymert seçkisi",
      shortDescription: description,
      description,
      accent: style.accent,
      accentSoft: style.accentSoft,
      accentDark: style.accentDark,
      motif: style.motif,
      coverImage: contentImage(row.cover_media_id),
      sortOrder: row.sort_order,
      highlights: categoryProducts.slice(0, 4).map((product) => product.name),
    };
  });

  const concepts: Concept[] = conceptRows.map((row) => {
    const style = conceptStyles[stableIndex(row.slug, conceptStyles.length)];
    const mediaRelations = [...(conceptMediaByConcept.get(row.id) ?? [])].sort(
      (a, b) =>
        Number(b.is_cover) - Number(a.is_cover) ||
        a.sort_order - b.sort_order,
    );
    const relatedProductIds = productIdsByConcept.get(row.id) ?? [];
    const relatedCategorySlugs = Array.from(
      new Set(
        relatedProductIds
          .map((productId) => productById.get(productId)?.category_id)
          .map((categoryId) =>
            categoryId ? categoryById.get(categoryId)?.slug : undefined,
          )
          .filter((slug): slug is string => Boolean(slug)),
      ),
    );
    const variants = ["hero", "table", "detail"] as const;
    const mediaScenes = mediaRelations.map((relation, index) => ({
      title:
        index === 0
          ? "Konsept görünümü"
          : `Konsept detayı ${index + 1}`,
      description:
        row.short_description ||
        row.description ||
        `${row.name} konseptinden bir görünüm.`,
      variant: variants[index % variants.length],
      image: contentImage(relation.media_id),
    }));
    const fallbackScenes =
      mediaScenes.length > 0
        ? mediaScenes
        : variants.map((variant, index) => ({
            title:
              index === 0
                ? "Konsept görünümü"
                : `Konsept detayı ${index + 1}`,
            description:
              row.short_description ||
              row.description ||
              `${row.name} konseptinden bir görünüm.`,
            variant,
          }));

    return {
      slug: row.slug,
      name: row.name,
      eyebrow: "Beymert konsepti",
      shortDescription: row.short_description || row.description,
      description: row.description || row.short_description,
      motif: style.motif,
      coverImage:
        contentImage(row.cover_media_id) ??
        mediaScenes.find((scene) => scene.image)?.image,
      colors: {
        primary: style.primary,
        secondary: style.secondary,
        background: style.background,
        foreground: style.foreground,
      },
      relatedCategorySlugs,
      gallery: fallbackScenes,
      sortOrder: row.sort_order,
      whatsappMessage: row.whatsapp_message ?? undefined,
    };
  });

  const galleryItems: GalleryItem[] = galleryRows.map((row, index) => {
    const media = mediaById.get(row.media_id);
    const category = row.category_id
      ? categoryById.get(row.category_id)
      : undefined;
    const concept = row.concept_id
      ? conceptById.get(row.concept_id)
      : undefined;

    return {
      id: row.id,
      title: row.title || "Beymert galeri görseli",
      description: row.description,
      image: contentImage(row.media_id),
      aspect: galleryAspect(media),
      categorySlug: category?.slug,
      categoryName: category?.name,
      conceptSlug: concept?.slug,
      conceptName: concept?.name,
      featured: index < 4,
      sortOrder: row.sort_order,
    };
  });

  return {
    storeSettings: storeSettingsFromRow(settingsResult.data),
    categories,
    products,
    concepts,
    galleryItems,
  };
});

export async function getStoreSettings() {
  return (await getPublicContentSnapshot()).storeSettings;
}

export async function getCategories() {
  return (await getPublicContentSnapshot()).categories;
}

export async function getCategoryBySlug(slug: string) {
  return (await getCategories()).find((category) => category.slug === slug);
}

export async function getProducts() {
  return (await getPublicContentSnapshot()).products;
}

export async function getProductBySlug(slug: string) {
  return (await getProducts()).find((product) => product.slug === slug);
}

export async function getProductsByCategory(categorySlug: string) {
  return (await getProducts()).filter(
    (product) => product.categorySlug === categorySlug,
  );
}

export async function getProductsByConcept(conceptSlug: string) {
  return (await getProducts()).filter((product) =>
    product.conceptSlugs.includes(conceptSlug),
  );
}

export async function getRelatedProducts(product: Product, limit = 4) {
  const products = await getProducts();
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

export async function getConcepts() {
  return (await getPublicContentSnapshot()).concepts;
}

export async function getConceptBySlug(slug: string) {
  return (await getConcepts()).find((concept) => concept.slug === slug);
}

export async function getGalleryItems() {
  return (await getPublicContentSnapshot()).galleryItems;
}
