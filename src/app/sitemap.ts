import type { MetadataRoute } from "next";

import { concepts } from "@/data/concepts";
import { getPublicCategories } from "@/lib/public-categories";
import { getPublicProducts } from "@/lib/public-products";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([
    getPublicCategories(),
    getPublicProducts(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/urunler"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/kategoriler"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/konseptler"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/galeri"), changeFrequency: "monthly", priority: 0.75 },
    { url: absoluteUrl("/hakkimizda"), changeFrequency: "yearly", priority: 0.6 },
    { url: absoluteUrl("/iletisim"), changeFrequency: "monthly", priority: 0.7 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: absoluteUrl(`/kategoriler/${category.slug}`),
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  const conceptRoutes: MetadataRoute.Sitemap = concepts.map((concept) => ({
    url: absoluteUrl(`/konseptler/${concept.slug}`),
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: absoluteUrl(`/urunler/${product.slug}`),
    changeFrequency: "monthly",
    priority: product.featured ? 0.8 : 0.7,
  }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...conceptRoutes,
    ...productRoutes,
  ];
}
