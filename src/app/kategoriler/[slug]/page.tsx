import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoryArtwork } from "@/components/categories/category-artwork";
import { EmptyState } from "@/components/shared/empty-state";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/container";
import { categories, getCategoryBySlug } from "@/data/categories";
import { whatsappHref } from "@/config/site";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Kategori bulunamadı",
    };
  }

  return {
    title: category.name,
    description: category.shortDescription,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  return (
    <main>
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
              <CategoryArtwork
                motif={category.motif}
                accent={category.accent}
                accentSoft={category.accentSoft}
                accentDark={category.accentDark}
              />
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
            </div>

            <EmptyState
              title="Ürün kataloğu hazırlanıyor"
              description="Bu kategorideki tekil ürün kartları Product Catalog fazında eklenecek. Şimdilik güncel seçenekler ve stok bilgisi için WhatsApp üzerinden bize ulaşabilirsin."
              actionHref={whatsappHref(
                `Merhaba, "${category.name}" kategorisindeki güncel ürünleri öğrenmek istiyorum.`,
              )}
              actionLabel="Güncel ürünleri sor"
            />
          </div>
        </Container>
      </Section>
    </main>
  );
}
