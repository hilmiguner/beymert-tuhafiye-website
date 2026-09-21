import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

import { GalleryExperience } from "@/components/gallery/gallery-experience";
import { Container, Section } from "@/components/ui/container";
import { galleryItems } from "@/data/gallery";

export const metadata: Metadata = buildPageMetadata({
  title: "Galeri",
  description: "Beymert’in parti konseptleri, balon düzenleri, özel gün detayları ve ürün kombinasyonlarından oluşan galeri vitrini.",
  path: "/galeri",
});

export default function GalleryPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <Section className="bt-brand-glow border-b border-border">
        <Container>
          <p className="bt-eyebrow text-primary">Beymert galerisi</p>
          <h1 className="bt-display bt-balance mt-4 max-w-4xl text-5xl leading-[0.95] font-semibold sm:text-6xl lg:text-7xl">
            Bir kutlamanın nasıl görünebileceğini keşfet.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            Konsept, balon, masa ve hediyelik detaylarını aynı vitrinde
            incele. Görsele dokunarak büyütebilir; ilgili ürün ve konseptlere
            doğrudan geçebilirsin.
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <GalleryExperience items={galleryItems} />
        </Container>
      </Section>
    </main>
  );
}
