import type { Metadata } from "next";
import Link from "next/link";

import { ProductCard } from "@/components/products/product-card";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/container";
import { getPublicProductsByCategory } from "@/lib/public-products";
import { buildPageMetadata } from "@/lib/seo";
import {
  directionsHref,
  getStoreSettings,
  whatsappHref,
} from "@/lib/store-settings";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Bursa Tuhafiye | Tül & Kurdele | Gemlik Beymert",
    description:
      "Bursa’da tuhafiye, tül ve kurdele arıyorsanız Gemlik’teki Beymert’in özel gün, paketleme ve süsleme için tamamlayıcı ürünlerini keşfedin.",
    path: "/bursa-tuhafiye",
  });
}

export default async function BursaNotionsPage() {
  const [settings, products] = await Promise.all([
    getStoreSettings(),
    getPublicProductsByCategory("tul-kurdele-tuhafiye"),
  ]);

  return (
    <main id="main-content" tabIndex={-1}>
      <BreadcrumbJsonLd
        items={[
          { name: "Ana Sayfa", path: "/" },
          { name: "Bursa Tuhafiye", path: "/bursa-tuhafiye" },
        ]}
      />

      <Section className="bt-brand-glow border-b border-border">
        <Container>
          <p className="bt-eyebrow text-primary">Bursa · Gemlik</p>
          <h1 className="bt-display bt-balance mt-4 max-w-5xl text-5xl leading-[0.95] font-semibold sm:text-6xl lg:text-7xl">
            Bursa tuhafiye aramalarında Gemlik’te tül ve kurdele seçenekleri.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-muted sm:text-lg">
            Bursa’nın Gemlik ilçesindeki {settings.shortName}; tül, saten
            kurdele ve özel gün hazırlıklarında kullanılan tamamlayıcı tuhafiye
            ürünlerini parti ve dekor ürünleriyle birlikte keşfetmeyi sağlar.
            Belirli bir renk veya kullanım amacı için ürün arıyorsan güncel
            seçenekleri mağazadan doğrulayabilirsin.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/kategoriler/tul-kurdele-tuhafiye">
              Tuhafiye Kategorisini İncele
            </ButtonLink>
            <ButtonLink
              href={whatsappHref(
                settings,
                "Merhaba, Bursa tuhafiye için tül ve kurdele ürünleri hakkında bilgi almak istiyorum.",
              )}
              target="_blank"
              rel="noreferrer"
              variant="outline"
            >
              Renk ve Stok Sor
            </ButtonLink>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              [
                "Tül",
                "Süsleme, paketleme ve özel gün hazırlıklarında kullanılabilecek farklı tül seçeneklerini mağazada karşılaştırabilirsin.",
              ],
              [
                "Saten kurdele",
                "Hediye sunumu, masa detayları ve dekoratif uygulamalar için kullanım amacına uygun kurdele seçeneklerini sorabilirsin.",
              ],
              [
                "Tamamlayıcı ürünler",
                "Tül ve kurdeleyi parti, balon, hediyelik ve masa dekoru ürünleriyle aynı hazırlık içinde planlayabilirsin.",
              ],
            ].map(([title, description]) => (
              <article
                key={title}
                className="rounded-card border border-border bg-surface p-6 shadow-soft"
              >
                <h2 className="bt-display text-3xl font-semibold">{title}</h2>
                <p className="mt-4 text-sm leading-7 text-muted sm:text-base">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="border-y border-border bg-surface-muted/35">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <p className="bt-eyebrow text-secondary">Doğru renk ve kullanım</p>
              <h2 className="bt-display mt-3 text-4xl font-semibold sm:text-5xl">
                Ürünü kullanım amacına göre değerlendir.
              </h2>
            </div>
            <div className="space-y-4 leading-7 text-muted">
              <p>
                Tül ve kurdelede renk tonu, genişlik ve doku kullanım alanına
                göre önem kazanır. Hediye paketleme ile nişan masası
                hazırlığında ihtiyaç duyulan ürün aynı olmayabilir.
              </p>
              <p>
                Ekrandaki renkler gerçek ürün tonundan farklı görünebildiği için
                hassas renk eşleşmelerinde mağazada karşılaştırma yapmak veya
                WhatsApp üzerinden güncel seçenekleri sormak daha doğru olur.
              </p>
              <p>
                Gemlik’e özel yerel içerik ve daha ayrıntılı bilgi için{" "}
                <Link
                  href="/gemlik-tuhafiye"
                  className="font-extrabold text-primary hover:text-primary-hover"
                >
                  Gemlik tuhafiye
                </Link>{" "}
                sayfasına geçebilirsin.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {products.length > 0 ? (
        <Section>
          <Container>
            <p className="bt-eyebrow text-primary">Güncel katalogdan</p>
            <h2 className="bt-display mt-3 text-4xl font-semibold sm:text-5xl">
              Yayındaki tuhafiye ürünleri.
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {products.slice(0, 4).map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </Container>
        </Section>
      ) : null}

      <Section className="border-t border-border bg-surface">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="bt-eyebrow text-primary">Gerçek mağaza konumu</p>
              <h2 className="bt-display mt-3 text-3xl font-semibold sm:text-4xl">
                {settings.shortName} · {settings.locationLabel}
              </h2>
              <p className="mt-4 max-w-2xl leading-7 text-muted">
                {settings.address}. Fiziksel mağazamız Bursa’nın Gemlik
                ilçesindedir; mağazaya gelmeden önce aradığın renk ve ürünü
                doğrulayabilirsin.
              </p>
            </div>
            <ButtonLink
              href={directionsHref(settings)}
              target="_blank"
              rel="noreferrer"
              variant="outline"
            >
              Yol Tarifi
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </main>
  );
}
