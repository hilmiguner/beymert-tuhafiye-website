import Link from "next/link";

import { CategoryCard } from "@/components/categories/category-card";
import { Container, Section } from "@/components/ui/container";
import { categories } from "@/data/categories";

export function CategoriesSection() {
  return (
    <Section className="border-y border-border bg-surface">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="bt-eyebrow text-secondary">Beymert’te neler var?</p>
            <h2 className="bt-display bt-balance mt-3 text-4xl leading-tight font-semibold sm:text-5xl lg:text-6xl">
              Kutlamanı kategoriden başlayarak keşfet.
            </h2>
          </div>

          <div className="max-w-lg">
            <p className="leading-7 text-muted">
              Balondan özel gün hazırlıklarına, kişiye özel hediyeliklerden
              tuhafiye ürünlerine kadar Beymert’in ana ürün gruplarını incele.
            </p>
            <Link
              href="/kategoriler"
              className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-primary hover:text-primary-hover"
            >
              Tüm kategorileri gör
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className="bt-hide-scrollbar -mx-[var(--bt-gutter)] mt-9 overflow-x-auto px-[var(--bt-gutter)] pb-3 sm:mx-0 sm:overflow-visible sm:px-0 sm:pb-0">
          <div className="grid auto-cols-[minmax(16rem,82vw)] grid-flow-col gap-4 snap-x snap-mandatory sm:grid-flow-row sm:grid-cols-2 sm:auto-cols-auto lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
