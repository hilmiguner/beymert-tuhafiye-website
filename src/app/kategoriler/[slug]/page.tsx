import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CategoryMedia } from "@/components/categories/category-media";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { ProductCard } from "@/components/products/product-card";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/container";
import { getCategorySeoContent } from "@/lib/category-seo";
import { getPublicCategoryBySlug } from "@/lib/public-categories";
import { getPublicProductsByCategory } from "@/lib/public-products";
import { buildPageMetadata } from "@/lib/seo";
import {
  directionsHref,
  getStoreSettings,
  whatsappHref,
} from "@/lib/store-settings";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getPublicCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Kategori bulunamadı",
    };
  }

  const seo = getCategorySeoContent(category);

  return buildPageMetadata({
    title: seo.title,
    description: seo.description,
    path: `/kategoriler/${category.slug}`,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const [category, settings, categoryProducts] = await Promise.all([
    getPublicCategoryBySlug(slug),
    getStoreSettings(),
    getPublicProductsByCategory(slug),
  ]);

  if (!category) {
    notFound();
  }

  const seo = getCategorySeoContent(category);

  return (
    <main id="main-content" tabIndex={-1}>
      <BreadcrumbJsonLd
        items={[
          { name: "Ana Sayfa", path: "/" },
          { name: "Kategoriler", path: "/kategoriler" },
          { name: category.name, path: `/kategoriler/${category.slug}` },
        ]}
      />
      <Section className="bt-brand-glow border-b border-border">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.85fr]">
            <div>
              <p
                className="bt-eyebrow"
                style={{ color: category.accentDark }}
              >
                {category.eyebrow}
              </p>
              <h1 className="bt-display bt-balance mt-4 text-5xl leading-[0.95] font-semibold sm:text-6xl lg:text-7xl">
                {category.name}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg">
                {category.description}
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <ButtonLink
                  href={whatsappHref(
                    settings,
                    `Merhaba, web sitenizdeki "${category.name}" kategorisi hakkında bilgi almak istiyorum.`,
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp’tan Bilgi Al
                </ButtonLink>
                <ButtonLink href="/kategoriler" variant="outline">
                  Tüm Kategoriler
                </ButtonLink>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-white/80 bg-surface shadow-lift">
              <CategoryMedia category={category} />
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.65fr_1.35fr]">
            <div>
              <p className="bt-eyebrow text-secondary">Bu kategoride</p>
              <h2 className="bt-display mt-3 text-3xl font-semibold sm:text-4xl">
                Öne çıkan ürün grupları
              </h2>
              {category.highlights.length > 0 ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {category.highlights.map((item) => (
                    <span
                      key={item}
                      className="rounded-pill border border-border bg-surface px-3.5 py-2 text-sm font-extrabold shadow-soft"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <div>
              <p className="text-sm leading-6 text-muted">
                Bu kategoride yayında olan ürünleri aşağıda görebilirsin.
                Güncel stok bilgisi mağazadan doğrulanmalıdır.
              </p>
              {categoryProducts.length > 0 ? (
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  {categoryProducts.map((product) => (
                    <ProductCard key={product.slug} product={product} />
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-card border border-border bg-surface p-6 text-sm leading-6 text-muted shadow-soft">
                  Bu kategoride yayınlanmış ürünler hazırlandıkça burada
                  görünecek. Güncel seçenekleri mağazadan veya WhatsApp
                  üzerinden sorabilirsin.
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>

      <Section className="border-t border-border bg-surface-muted/35">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <p className="bt-eyebrow text-primary">
                Gemlik’te {category.name}
              </p>
              <h2 className="bt-display mt-3 text-4xl font-semibold sm:text-5xl">
                {seo.localHeading}
              </h2>
              <p className="mt-5 max-w-xl leading-7 text-muted">
                {seo.localDescription}
              </p>
            </div>

            <div className="rounded-card border border-border bg-surface p-6 shadow-soft sm:p-7">
              <p className="text-sm leading-7 text-muted">
                {settings.address}. Ürün renkleri ve stoklar dönemsel olarak
                değişebilir; mağazaya gelmeden önce güncel durumu
                doğrulayabilirsin.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href={seo.localPageHref}
                  className="font-extrabold text-primary hover:text-primary-hover"
                >
                  {seo.localPageLabel} →
                </Link>
                <Link
                  href={seo.regionalPageHref}
                  className="font-extrabold text-primary hover:text-primary-hover"
                >
                  {seo.regionalPageLabel} →
                </Link>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <ButtonLink
                  href={directionsHref(settings)}
                  target="_blank"
                  rel="noreferrer"
                  variant="outline"
                >
                  Yol Tarifi
                </ButtonLink>
                <ButtonLink href="/iletisim" variant="outline">
                  İletişim Bilgileri
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
