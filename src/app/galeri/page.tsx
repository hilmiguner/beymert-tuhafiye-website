import type { Metadata } from "next";

import { GalleryExperience } from "@/components/gallery/gallery-experience";
import { Container, Section } from "@/components/ui/container";
import { getPublicGalleryItems } from "@/lib/public-gallery";
import { buildPageMetadata } from "@/lib/seo";
import { getStoreSettings } from "@/lib/store-settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings();

  return buildPageMetadata({
    title: "Galeri",
    description: `${settings.shortName}’in parti konseptleri, balon düzenleri, özel gün detayları ve ürün kombinasyonlarından oluşan galeri vitrini.`,
    path: "/galeri",
  });
}

export default async function GalleryPage() {
  const [galleryItems, settings] = await Promise.all([
    getPublicGalleryItems(),
    getStoreSettings(),
  ]);

  return (
    <main id="main-content" tabIndex={-1}>
      <Section className="bt-brand-glow border-b border-border">
        <Container>
          <p className="bt-eyebrow text-primary">{settings.shortName} galerisi</p>
          <h1 className="bt-display bt-balance mt-4 max-w-4xl text-5xl leading-[0.95] font-semibold sm:text-6xl lg:text-7xl">
            Bir kutlamanın nasıl görünebileceğini keşfet.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            Konsept, balon, masa ve hediyelik detaylarını aynı vitrinde
            incele. Görsele dokunarak büyütebilir; ilgili kategori ve
            konseptlere doğrudan geçebilirsin.
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          {galleryItems.length > 0 ? (
            <GalleryExperience items={galleryItems} />
          ) : (
            <div className="rounded-[2rem] border border-border bg-surface p-8 text-center shadow-soft sm:p-12">
              <p className="bt-eyebrow text-primary">Galeri hazırlanıyor</p>
              <h2 className="bt-display mt-3 text-3xl font-semibold sm:text-4xl">
                Yeni kutlama görselleri yakında burada.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted sm:text-base">
                {settings.shortName}’in güncel organizasyon ve ürün fotoğrafları
                yayınlandıkça bu galeri otomatik olarak güncellenecek.
              </p>
            </div>
          )}
        </Container>
      </Section>
    </main>
  );
}
