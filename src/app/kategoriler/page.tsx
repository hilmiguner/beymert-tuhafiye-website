import type { Metadata } from "next";
import Link from "next/link";

import { CategoryCard } from "@/components/categories/category-card";
import { Container, Section } from "@/components/ui/container";
import {
  getCategoryChildren,
  getTopLevelCategories,
} from "@/lib/category-hierarchy";
import { getPublicCategories } from "@/lib/public-categories";
import { buildPageMetadata } from "@/lib/seo";
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
  const topLevelCategories = getTopLevelCategories(categories);

  return (
    <main id="main-content" tabIndex={-1}>
      <Section className="bt-brand-glow border-b border-border">
        <Container>
          <p className="bt-eyebrow text-primary">Ürün grupları</p>
          <h1 className="bt-display bt-balance mt-4 max-w-4xl text-5xl leading-[0.95] font-semibold sm:text-6xl lg:text-7xl">
            Aradığın kutlama detayına buradan başla.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            {settings.shortName}’in ana kategorilerinden başlayıp alt
            kategorilere ilerleyebilir; aradığın ürün grubuna daha hızlı
            ulaşabilirsin.
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {topLevelCategories.map((category) => {
              const children = getCategoryChildren(categories, category.slug);

              return (
                <div key={category.slug} className="min-w-0">
                  <CategoryCard category={category} />

                  {children.length > 0 ? (
                    <div className="mt-3 rounded-card border border-border bg-surface-muted/35 p-4 shadow-soft">
                      <p className="text-xs font-black tracking-[0.12em] text-muted uppercase">
                        Alt kategoriler
                      </p>
                      <div className="mt-3 space-y-3">
                        {children.map((child) => {
                          const grandchildren = getCategoryChildren(
                            categories,
                            child.slug,
                          );

                          return (
                            <div key={child.slug}>
                              <Link
                                href={`/kategoriler/${child.slug}`}
                                className="inline-flex font-extrabold text-foreground transition-colors hover:text-primary"
                              >
                                {child.name} →
                              </Link>

                              {grandchildren.length > 0 ? (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {grandchildren.map((grandchild) => (
                                    <Link
                                      key={grandchild.slug}
                                      href={`/kategoriler/${grandchild.slug}`}
                                      className="rounded-pill border border-border bg-white px-3 py-1.5 text-xs font-bold text-muted transition-colors hover:border-primary/30 hover:text-primary"
                                    >
                                      {grandchild.name}
                                    </Link>
                                  ))}
                                </div>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section className="border-t border-border bg-surface-muted/35">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <p className="bt-eyebrow text-secondary">
                Gemlik’te ürün grupları
              </p>
              <h2 className="bt-display mt-3 text-4xl font-semibold sm:text-5xl">
                Kutlama ve tuhafiye ihtiyaçlarını konuya göre keşfet.
              </h2>
            </div>
            <div className="space-y-4 leading-7 text-muted">
              <p>
                Doğum günü, baby shower, cinsiyet partisi, söz-nişan-düğün ve
                benzeri özel günlerde ihtiyaç listesi etkinliğe göre değişir.
                Kategori ağacı, ürünleri ana gruptan daha spesifik alt gruplara
                doğru inceleyebilmen için hazırlanmıştır.
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
