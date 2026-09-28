import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";

import { CategoryCard } from "@/components/categories/category-card";
import { Container, Section } from "@/components/ui/container";
import { getPublicCategories } from "@/lib/public-categories";
import { getStoreSettings } from "@/lib/store-settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings();

  return buildPageMetadata({
    title: "Gemlik Parti & Tuhafiye Kategorileri",
    description: `${settings.shortName}’in balon, doğum günü, baby shower, söz-nişan-düğün, hediyelik ve tuhafiye kategorilerini keşfedin.`,
    path: "/kategoriler",
  });
}

export default async function CategoriesPage() {
  const [categories, settings] = await Promise.all([
    getPublicCategories(),
    getStoreSettings(),
  ]);

  return (
    <main id="main-content" tabIndex={-1}>
      <Section className="bt-brand-glow border-b border-border">
        <Container>
          <p className="bt-eyebrow text-primary">Ürün grupları</p>
          <h1 className="bt-display bt-balance mt-4 max-w-4xl text-5xl leading-[0.95] font-semibold sm:text-6xl lg:text-7xl">
            Aradığın kutlama detayına buradan başla.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            {settings.shortName}’in ana ürün kategorilerini incele; detay sayfasından ürün
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

      <Section className="border-t border-border bg-surface-muted/35">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <p className="bt-eyebrow text-secondary">Gemlik’te ürün grupları</p>
              <h2 className="bt-display mt-3 text-4xl font-semibold sm:text-5xl">
                Kutlama ve tuhafiye ihtiyaçlarını konuya göre keşfet.
              </h2>
            </div>
            <div className="space-y-4 leading-7 text-muted">
              <p>
                Doğum günü, baby shower, cinsiyet partisi, söz-nişan-düğün ve
                benzeri özel günlerde ihtiyaç listesi etkinliğe göre değişir.
                Kategori sayfaları, ürünleri kullanım alanına göre daha hızlı
                karşılaştırabilmen için hazırlanmıştır.
              </p>
              <p>
                Balon ve kutlama ürünleri için{" "}
                <Link
                  href="/gemlik-parti-malzemeleri"
                  className="font-extrabold text-primary hover:text-primary-hover"
                >
                  Gemlik parti malzemeleri
                </Link>{" "}
                sayfasına; tül, kurdele ve tamamlayıcı tuhafiye ürünleri için{" "}
                <Link
                  href="/gemlik-tuhafiye"
                  className="font-extrabold text-primary hover:text-primary-hover"
                >
                  Gemlik tuhafiye
                </Link>{" "}
                sayfasına geçebilirsin.
              </p>
              <p>
                Ürün renkleri ve stoklar dönemsel olarak değişebildiği için,
                mağazaya gelmeden önce ilgilendiğin kategori veya ürünü
                WhatsApp üzerinden doğrulaman faydalı olur.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
