import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/products/product-card";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductVariantHero } from "@/components/products/product-variant-hero";
import { ProductVariantProvider } from "@/components/products/product-variant-context";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/container";
import { getCategoryAncestors } from "@/lib/category-hierarchy";
import { getPublicCategories } from "@/lib/public-categories";
import { getPublicConcepts } from "@/lib/public-concepts";
import {
  getPublicProductBySlug,
  getRelatedPublicProducts,
} from "@/lib/public-products";
import { buildPageMetadata } from "@/lib/seo";
import { getStoreSettings, whatsappHref } from "@/lib/store-settings";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublicProductBySlug(slug);

  if (!product) {
    return { title: "Ürün bulunamadı" };
  }

  return buildPageMetadata({
    title: product.name,
    description: product.shortDescription,
    path: `/urunler/${product.slug}`,
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const [product, settings, concepts, categories] = await Promise.all([
    getPublicProductBySlug(slug),
    getStoreSettings(),
    getPublicConcepts(),
    getPublicCategories(),
  ]);

  if (!product) {
    notFound();
  }

  const category = categories.find(
    (candidate) => candidate.slug === product.categorySlug,
  );
  const categoryAncestors = category
    ? getCategoryAncestors(categories, category.slug)
    : [];
  const assignedCategorySlugs = new Set(
    product.categorySlugs && product.categorySlugs.length > 0
      ? product.categorySlugs
      : product.categorySlug
        ? [product.categorySlug]
        : [],
  );
  const assignedCategories = categories.filter((candidate) =>
    assignedCategorySlugs.has(candidate.slug),
  );
  const relatedProducts = await getRelatedPublicProducts(product);
  const relatedConcepts = concepts.filter((concept) =>
    product.conceptSlugs.includes(concept.slug),
  );
  const productImages = product.images ?? [];
  const whatsappMessage =
    product.whatsappMessage ||
    `Merhaba, web sitenizde gördüğüm "${product.name}" hakkında bilgi almak istiyorum.`;

  return (
    <ProductVariantProvider>
    <main id="main-content" tabIndex={-1}>
      <BreadcrumbJsonLd
        items={[
          { name: "Ana Sayfa", path: "/" },
          { name: "Ürünler", path: "/urunler" },
          ...categoryAncestors.map((ancestor) => ({
            name: ancestor.name,
            path: `/kategoriler/${ancestor.slug}`,
          })),
          ...(category
            ? [
                {
                  name: category.name,
                  path: `/kategoriler/${category.slug}`,
                },
              ]
            : []),
          { name: product.name, path: `/urunler/${product.slug}` },
        ]}
      />
      <Section className="border-b border-border bg-surface-muted/30">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <ProductVariantHero product={product} />

            <div>
              <div className="flex flex-wrap gap-2">
                {product.newArrival ? (
                  <span className="rounded-pill bg-foreground px-3 py-1.5 text-xs font-black tracking-[0.08em] text-white uppercase">
                    Yeni
                  </span>
                ) : null}
                {product.featured ? (
                  <span className="rounded-pill bg-primary px-3 py-1.5 text-xs font-black tracking-[0.08em] text-white uppercase">
                    Öne çıkan
                  </span>
                ) : null}
              </div>

              <p className="bt-eyebrow mt-5 text-primary">
                {category?.name ?? product.categoryName ?? settings.shortName}
              </p>
              <h1 className="bt-display bt-balance mt-3 text-5xl leading-[0.95] font-semibold sm:text-6xl lg:text-7xl">
                {product.name}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg">
                {product.description}
              </p>

              {assignedCategories.length > 1 ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {assignedCategories.map((assignedCategory) => (
                    <Link
                      key={assignedCategory.slug}
                      href={`/kategoriler/${assignedCategory.slug}`}
                      className="rounded-pill border border-border bg-surface px-3 py-1.5 text-xs font-extrabold text-muted shadow-soft transition-colors hover:border-primary/30 hover:text-primary"
                    >
                      {assignedCategory.name}
                    </Link>
                  ))}
                </div>
              ) : null}

              {product.highlights.length > 0 ? (
                <div className="mt-7 flex flex-wrap gap-2">
                  {product.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="rounded-pill border border-border bg-surface px-3.5 py-2 text-sm font-extrabold shadow-soft"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink
                  href={whatsappHref(settings, whatsappMessage)}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp’tan Bilgi Al
                </ButtonLink>
                {category ? (
                  <ButtonLink
                    href={`/kategoriler/${category.slug}`}
                    variant="outline"
                  >
                    {category.name} kategorisi
                  </ButtonLink>
                ) : null}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <p className="bt-eyebrow text-secondary">Ürün bilgileri</p>
              <h2 className="bt-display mt-3 text-4xl font-semibold">
                Ürün detayları.
              </h2>

              {product.dimensions ? (
                <div className="mt-6">
                  <p className="text-sm font-extrabold">Ölçü / uygulama</p>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {product.dimensions}
                  </p>
                </div>
              ) : null}

              <p className="mt-6 text-xs leading-5 text-muted">
                Güncel model, renk ve stok bilgisi mağazadan doğrulanmalıdır.
              </p>
            </div>

            <div>
              <p className="bt-eyebrow text-primary">Ürün galerisi</p>
              {productImages.length > 0 ? (
                <div className="mt-4">
                  <ProductGallery
                    images={productImages}
                    productName={product.name}
                  />
                </div>
              ) : (
                <div className="mt-4 rounded-card border border-dashed border-border bg-surface-muted p-8 text-sm text-muted">
                  Bu ürün için henüz galeri fotoğrafı bulunmuyor.
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {relatedConcepts.length > 0 ? (
        <Section className="border-y border-border bg-surface">
          <Container>
            <p className="bt-eyebrow text-primary">Konsept eşleşmeleri</p>
            <h2 className="bt-display mt-3 text-4xl font-semibold sm:text-5xl">
              Bu ürün hangi temalara uyuyor?
            </h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {relatedConcepts.map((concept) => (
                <Link
                  key={concept.slug}
                  href={`/konseptler/${concept.slug}`}
                  className="rounded-pill border border-border bg-background px-4 py-2.5 text-sm font-extrabold shadow-soft transition-colors hover:border-primary/30 hover:text-primary"
                >
                  {concept.name}
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      {relatedProducts.length > 0 ? (
        <Section>
          <Container>
            <p className="bt-eyebrow text-secondary">Benzer ürünler</p>
            <h2 className="bt-display mt-3 text-4xl font-semibold sm:text-5xl">
              Bunlara da göz at.
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.slug}
                  product={relatedProduct}
                />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}
    </main>
    </ProductVariantProvider>
  );
}
