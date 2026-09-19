import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { buildPageMetadata } from "@/lib/seo";

import { ProductMedia } from "@/components/products/product-media";
import { ProductCard } from "@/components/products/product-card";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/container";
import { whatsappHref } from "@/config/site";
import { getCategoryBySlug } from "@/data/categories";
import { concepts } from "@/data/concepts";
import {
  getProductBySlug,
  getRelatedProducts,
  products,
} from "@/data/products";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

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
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const category = getCategoryBySlug(product.categorySlug);
  const relatedProducts = getRelatedProducts(product);
  const relatedConcepts = concepts.filter((concept) =>
    product.conceptSlugs.includes(concept.slug),
  );

  return (
    <main id="main-content" tabIndex={-1}>
      <Section className="border-b border-border bg-surface-muted/30">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="overflow-hidden rounded-[2rem] border border-white/80 bg-surface shadow-lift">
              <ProductMedia product={product} />
            </div>

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
                {category?.name ?? "Beymert"}
              </p>
              <h1 className="bt-display bt-balance mt-3 text-5xl leading-[0.95] font-semibold sm:text-6xl lg:text-7xl">
                {product.name}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg">
                {product.description}
              </p>

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

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink
                  href={whatsappHref(
                    `Merhaba, web sitenizde gördüğüm "${product.name}" hakkında bilgi almak istiyorum.`,
                  )}
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
                Renk ve detaylar.
              </h2>

              <div className="mt-6">
                <p className="text-sm font-extrabold">Renk seçenekleri</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <div
                      key={color.name}
                      className="flex items-center gap-2 rounded-pill border border-border bg-surface px-3 py-2"
                    >
                      <span
                        className="size-5 rounded-full border border-black/5"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-sm font-bold">{color.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {product.dimensions ? (
                <div className="mt-6">
                  <p className="text-sm font-extrabold">Ölçü / uygulama</p>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {product.dimensions}
                  </p>
                </div>
              ) : null}

              <p className="mt-6 text-xs leading-5 text-muted">
                Ürün bilgileri örnek katalog verisidir. Güncel model, renk ve
                stok bilgisi mağazadan doğrulanmalıdır.
              </p>
            </div>

            <div>
              <p className="bt-eyebrow text-primary">Ürün galerisi</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="overflow-hidden rounded-card border border-border bg-surface shadow-soft sm:col-span-2">
                  <ProductMedia product={product} variant="main" />
                </div>
                <div className="overflow-hidden rounded-card border border-border bg-surface shadow-soft">
                  <ProductMedia product={product} variant="detail" />
                </div>
                <div className="overflow-hidden rounded-card border border-border bg-surface shadow-soft">
                  <ProductMedia product={product} variant="color" />
                </div>
              </div>
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
  );
}
