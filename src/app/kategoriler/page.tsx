import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

import { CategoryCard } from "@/components/categories/category-card";
import { Container, Section } from "@/components/ui/container";
import { getPublicCategories } from "@/lib/public-categories";

export const metadata: Metadata = buildPageMetadata({
  title: "Kategoriler",
  description: "Beymert’in balon, doğum günü, baby shower, söz-nişan-düğün, hediyelik ve tuhafiye kategorilerini keşfedin.",
  path: "/kategoriler",
});

export default async function CategoriesPage() {
  const categories = await getPublicCategories();

  return (
    <main id="main-content" tabIndex={-1}>
      <Section className="bt-brand-glow border-b border-border">
        <Container>
          <p className="bt-eyebrow text-primary">Ürün grupları</p>
          <h1 className="bt-display bt-balance mt-4 max-w-4xl text-5xl leading-[0.95] font-semibold sm:text-6xl lg:text-7xl">
            Aradığın kutlama detayına buradan başla.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            Beymert’in ana ürün kategorilerini incele; detay sayfasından ürün
            grubu hakkında bilgi al veya WhatsApp üzerinden bize ulaş.
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </Container>
      </Section>
    </main>
  );
}
