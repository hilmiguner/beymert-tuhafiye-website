import type { Metadata } from "next";
import { AnimatedShowcaseSection } from "@/components/sections/animated-showcase-section";
import { CategoriesSection } from "@/components/sections/categories-section";
import { ConceptsSection } from "@/components/sections/concepts-section";
import { FeaturedProductsSection } from "@/components/sections/featured-products-section";
import { GalleryPreviewSection } from "@/components/sections/gallery-preview-section";
import { HomepageStoreSection } from "@/components/sections/homepage-store-section";
import { HeroSection } from "@/components/sections/hero-section";
import { TrustSection } from "@/components/sections/trust-section";
import { LocalSeoSection } from "@/components/sections/local-seo-section";
import { FinalCtaSection } from "@/components/sections/final-cta-section";
import { buildPageMetadata } from "@/lib/seo";
import { getStoreSettings, whatsappHref } from "@/lib/store-settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings();

  return buildPageMetadata({
    title: `Gemlik Parti Malzemeleri & Tuhafiye | ${settings.shortName}`,
    description:
      "Gemlik'te parti malzemeleri, helyumlu ve folyo balonlar, doğum günü, baby shower, cinsiyet partisi, söz-nişan-düğün ürünleri, hediyelikler ve tuhafiye seçenekleri.",
    path: "/",
    absoluteTitle: true,
  });
}

export default async function Home() {
  const settings = await getStoreSettings();
  const whatsappUrl = whatsappHref(settings);
  return (
    <main id="main-content" tabIndex={-1}>
      <HeroSection
        shortName={settings.shortName}
        locationLabel={settings.locationLabel}
        whatsappUrl={whatsappUrl}
      />
      <CategoriesSection />
      <ConceptsSection />
      <FeaturedProductsSection />
      <AnimatedShowcaseSection />
      <GalleryPreviewSection />
      <LocalSeoSection />
      <TrustSection />
      <HomepageStoreSection />
      <FinalCtaSection />
    </main>
  );
}
