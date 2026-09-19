import type { Metadata } from "next";

import { CategoryCard } from "@/components/categories/category-card";
import { Container, Section } from "@/components/ui/container";
import { categories } from "@/data/categories";

export const metadata: Metadata = {
  title: "Kategoriler",
  description:
    "Beymert’in balon, doğum günü, baby shower, söz-nişan-düğün, hediyelik ve tuhafiye kategorilerini keşfedin.",
};

export default function CategoriesPage() {
  return (
    <main>
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
