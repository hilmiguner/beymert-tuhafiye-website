import type { Product, ProductCardData } from "@/types/product";

/**
 * Never serialize full product-detail and color-variant payloads into the
 * interactive catalogue: cards only need the cover image and first 4 swatches.
 * Detail pages continue to use the untouched Product records.
 */
export function toProductCardData(
  products: readonly Product[],
): ProductCardData[] {
  return products.map((product) => ({
    slug: product.slug,
    name: product.name,
    categorySlug: product.categorySlug,
    categoryName: product.categoryName,
    categorySlugs: product.categorySlugs,
    shortDescription: product.shortDescription,
    artworkKind: product.artworkKind,
    images: product.images?.slice(0, 1),
    colors: product.colors.slice(0, 4),
    featured: product.featured,
    newArrival: product.newArrival,
  }));
}
