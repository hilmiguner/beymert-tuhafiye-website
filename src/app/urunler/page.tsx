import type { Metadata } from "next";

import { ProductCatalog } from "@/components/products/product-catalog";
import { Container, Section } from "@/components/ui/container";
import { categories } from "@/data/categories";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Ürünler",
  description:
    "Beymert’in parti malzemeleri, balon, özel gün, hediyelik ve tuhafiye ürünlerini keşfedin.",
};

export default function ProductsPage() {
  return (
    <main>
      <Section className="bt-brand-glow border-b border-border">
        <Container>
          <p className="bt-eyebrow text-primary">Ürün kataloğu</p>
          <h1 className="bt-display bt-balance mt-4 max-w-4xl text-5xl leading-[0.95] font-semibold sm:text-6xl lg:text-7xl">
            Kutlamanı tamamlayan detayları keşfet.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            Bu aşamada katalog örnek ürün verileriyle çalışıyor. Gerçek ürün
            fotoğrafları ve güncel mağaza envanteri içerik entegrasyonu
            aşamasında doğrulanacak.
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <ProductCatalog products={products} categories={categories} />
        </Container>
      </Section>
    </main>
  );
}
