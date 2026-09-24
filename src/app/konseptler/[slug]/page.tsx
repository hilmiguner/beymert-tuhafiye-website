import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CategoryCard } from "@/components/categories/category-card";
import { ConceptMedia } from "@/components/concepts/concept-media";
import { ProductCard } from "@/components/products/product-card";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/container";
import { concepts, getConceptBySlug } from "@/data/concepts";
import { getPublicCategories } from "@/lib/public-categories";
import { getPublicProductsByConcept } from "@/lib/public-products";
import { buildPageMetadata } from "@/lib/seo";
import { getStoreSettings, whatsappHref } from "@/lib/store-settings";

type ConceptPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return concepts.map((concept) => ({ slug: concept.slug }));
}

export async function generateMetadata({
  params,
}: ConceptPageProps): Promise<Metadata> {
  const { slug } = await params;
  const concept = getConceptBySlug(slug);

  if (!concept) {
    return {
      title: "Konsept bulunamadı",
    };
  }

  return buildPageMetadata({
    title: concept.name,
    description: concept.shortDescription,
    path: `/konseptler/${concept.slug}`,
  });
}

export default async function ConceptPage({ params }: ConceptPageProps) {
  const { slug } = await params;
  const concept = getConceptBySlug(slug);

  if (!concept) {
    notFound();
  }

  const [categories, relatedProducts, settings] = await Promise.all([
    getPublicCategories(),
    getPublicProductsByConcept(concept.slug),
    getStoreSettings(),
  ]);
  const relatedCategories = categories.filter((category) =>
    concept.relatedCategorySlugs.includes(category.slug),
  );

  return (
    <main id="main-content" tabIndex={-1}>
      <Section className="border-b border-border bg-surface-muted/35">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <p
                className="bt-eyebrow"
                style={{ color: concept.colors.primary }}
              >
                {concept.eyebrow}
              </p>
              <h1 className="bt-display bt-balance mt-4 text-5xl leading-[0.95] font-semibold sm:text-6xl lg:text-7xl">
                {concept.name}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg">
                {concept.description}
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <ButtonLink
                  href={whatsappHref(
                    settings,
                    `Merhaba, web sitenizdeki "${concept.name}" konsepti hakkında bilgi almak istiyorum.`,
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  Konsepti WhatsApp’tan Sor
                </ButtonLink>
                <ButtonLink href="/konseptler" variant="outline">
                  Tüm Konseptler
                </ButtonLink>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-white/80 bg-surface shadow-lift">
              <ConceptMedia concept={concept} />
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <p className="bt-eyebrow text-secondary">Konsept galerisi</p>
          <h2 className="bt-display mt-3 text-4xl font-semibold sm:text-5xl">
            Aynı tema, farklı detaylar.
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {concept.gallery.map((scene) => (
              <div
                key={scene.title}
                className="overflow-hidden rounded-card border border-border bg-surface shadow-soft"
              >
                <ConceptMedia concept={concept} scene={scene} />
                <div className="border-t border-border p-5">
                  <h3 className="bt-display text-2xl font-semibold">
                    {scene.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {scene.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="border-y border-border bg-surface">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="bt-eyebrow text-primary">Ürün grupları</p>
              <h2 className="bt-display mt-3 text-4xl font-semibold sm:text-5xl">
                Bu konsepte neler yakışır?
              </h2>
            </div>
            <Link
              href="/kategoriler"
              className="text-sm font-extrabold text-primary hover:text-primary-hover"
            >
              Tüm kategoriler →
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {relatedCategories.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </Container>
      </Section>

      {relatedProducts.length > 0 ? (
        <Section>
          <Container>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="bt-eyebrow text-secondary">Örnek ürünler</p>
                <h2 className="bt-display mt-3 text-4xl font-semibold sm:text-5xl">
                  Bu temaya uyum sağlayan ürünler.
                </h2>
              </div>
              <Link
                href="/urunler"
                className="text-sm font-extrabold text-primary hover:text-primary-hover"
              >
                Tüm ürünler →
              </Link>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}
    </main>
  );
}
