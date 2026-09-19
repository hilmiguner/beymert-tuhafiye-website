import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CategoryCard } from "@/components/categories/category-card";
import { ConceptArtwork } from "@/components/concepts/concept-artwork";
import { EmptyState } from "@/components/shared/empty-state";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/container";
import { whatsappHref } from "@/config/site";
import { categories } from "@/data/categories";
import { concepts, getConceptBySlug } from "@/data/concepts";

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

  return {
    title: concept.name,
    description: concept.shortDescription,
  };
}

export default async function ConceptPage({ params }: ConceptPageProps) {
  const { slug } = await params;
  const concept = getConceptBySlug(slug);

  if (!concept) {
    notFound();
  }

  const relatedCategories = categories.filter((category) =>
    concept.relatedCategorySlugs.includes(category.slug),
  );

  return (
    <main>
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
              <ConceptArtwork
                motif={concept.motif}
                primary={concept.colors.primary}
                secondary={concept.colors.secondary}
                background={concept.colors.background}
                foreground={concept.colors.foreground}
              />
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="bt-eyebrow text-secondary">Konsept galerisi</p>
              <h2 className="bt-display mt-3 text-4xl font-semibold sm:text-5xl">
                Aynı tema, farklı detaylar.
              </h2>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {concept.gallery.map((scene) => (
              <div
                key={scene.title}
                className="overflow-hidden rounded-card border border-border bg-surface shadow-soft"
              >
                <ConceptArtwork
                  motif={concept.motif}
                  primary={concept.colors.primary}
                  secondary={concept.colors.secondary}
                  background={concept.colors.background}
                  foreground={concept.colors.foreground}
                  variant={scene.variant}
                />
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

      <Section>
        <Container>
          <EmptyState
            title="Tekil ürün eşleştirmeleri sırada"
            description="Bu konsepte bağlı tekil ürün kartları Product Catalog fazında eklenecek. Şimdilik ilgili ürün gruplarını inceleyebilir veya güncel seçenekleri WhatsApp üzerinden sorabilirsin."
            actionHref={whatsappHref(
              `Merhaba, "${concept.name}" konseptine uygun güncel ürünleri öğrenmek istiyorum.`,
            )}
            actionLabel="Uygun ürünleri sor"
          />
        </Container>
      </Section>
    </main>
  );
}
