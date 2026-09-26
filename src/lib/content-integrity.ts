import { categories } from "@/data/categories";
import { concepts } from "@/data/concepts";
import { galleryItems } from "@/data/gallery";
import { products } from "@/data/products";
import type { ContentImage } from "@/types/media";

function duplicateValues(values: readonly string[]) {
  return values.filter((value, index) => values.indexOf(value) !== index);
}

function validateImage(
  image: ContentImage | undefined,
  label: string,
  errors: string[],
) {
  if (!image) return;

  if (!image.src.startsWith("/media/")) {
    errors.push(`${label}: image src must start with /media/`);
  }

  if (!image.alt.trim()) {
    errors.push(`${label}: image alt text is required`);
  }

  if (image.width <= 0 || image.height <= 0) {
    errors.push(`${label}: image width/height must be positive`);
  }
}

export function assertContentIntegrity() {
  const errors: string[] = [];

  const categorySlugs = categories.map((item) => item.slug);
  const conceptSlugs = concepts.map((item) => item.slug);
  const productSlugs = products.map((item) => item.slug);
  const galleryIds = galleryItems.map((item) => item.id);

  for (const duplicate of duplicateValues(categorySlugs)) {
    errors.push(`duplicate category slug: ${duplicate}`);
  }
  for (const duplicate of duplicateValues(conceptSlugs)) {
    errors.push(`duplicate concept slug: ${duplicate}`);
  }
  for (const duplicate of duplicateValues(productSlugs)) {
    errors.push(`duplicate product slug: ${duplicate}`);
  }
  for (const duplicate of duplicateValues(galleryIds)) {
    errors.push(`duplicate gallery id: ${duplicate}`);
  }

  const categorySet = new Set<string>(categorySlugs);
  const conceptSet = new Set<string>(conceptSlugs);
  const productSet = new Set<string>(productSlugs);

  for (const category of categories) {
    validateImage(
      category.coverImage,
      `category ${category.slug} coverImage`,
      errors,
    );
  }

  for (const concept of concepts) {
    for (const categorySlug of concept.relatedCategorySlugs) {
      if (!categorySet.has(categorySlug)) {
        errors.push(
          `concept ${concept.slug}: unknown category ${categorySlug}`,
        );
      }
    }

    validateImage(
      concept.coverImage,
      `concept ${concept.slug} coverImage`,
      errors,
    );

    concept.gallery.forEach((scene, index) => {
      validateImage(
        scene.image,
        `concept ${concept.slug} gallery[${index}]`,
        errors,
      );
    });
  }

  for (const product of products) {
    if (!categorySet.has(product.categorySlug)) {
      errors.push(
        `product ${product.slug}: unknown category ${product.categorySlug}`,
      );
    }

    for (const conceptSlug of product.conceptSlugs) {
      if (!conceptSet.has(conceptSlug)) {
        errors.push(
          `product ${product.slug}: unknown concept ${conceptSlug}`,
        );
      }
    }

    product.images?.forEach((image, index) => {
      validateImage(
        image,
        `product ${product.slug} images[${index}]`,
        errors,
      );
    });
  }

  for (const item of galleryItems) {
    if (item.categorySlug && !categorySet.has(item.categorySlug)) {
      errors.push(
        `gallery ${item.id}: unknown category ${item.categorySlug}`,
      );
    }
    if (item.conceptSlug && !conceptSet.has(item.conceptSlug)) {
      errors.push(
        `gallery ${item.id}: unknown concept ${item.conceptSlug}`,
      );
    }
    if (item.productSlug && !productSet.has(item.productSlug)) {
      errors.push(
        `gallery ${item.id}: unknown product ${item.productSlug}`,
      );
    }

    if (
      item.source?.kind === "product" &&
      !productSet.has(item.source.slug)
    ) {
      errors.push(
        `gallery ${item.id}: unknown source product ${item.source.slug}`,
      );
    }

    if (
      item.source?.kind === "concept" &&
      !conceptSet.has(item.source.slug)
    ) {
      errors.push(
        `gallery ${item.id}: unknown source concept ${item.source.slug}`,
      );
    }

    validateImage(item.image, `gallery ${item.id} image`, errors);
  }

  if (errors.length > 0) {
    throw new Error(
      `Content integrity check failed:\n- ${errors.join("\n- ")}`,
    );
  }
}
