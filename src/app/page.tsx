import type { Metadata } from "next";
import { AnimatedShowcaseSection } from "@/components/sections/animated-showcase-section";
import { CategoriesSection } from "@/components/sections/categories-section";
import { ConceptsSection } from "@/components/sections/concepts-section";
import { FeaturedProductsSection } from "@/components/sections/featured-products-section";
import { GalleryPreviewSection } from "@/components/sections/gallery-preview-section";
import { HomepageStoreSection } from "@/components/sections/homepage-store-section";
import { HeroSection } from "@/components/sections/hero-section";
import { TrustSection } from "@/components/sections/trust-section";
import { FinalCtaSection } from "@/components/sections/final-cta-section";
import { getStoreSettings } from "@/lib/public-content";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Beymert | Parti Malzemeleri & Tuhafiye Gemlik",
  description: "Gemlik'te parti malzemeleri, helyumlu ve folyo balonlar, doğum günü, baby shower, cinsiyet partisi, söz-nişan-düğün ürünleri, hediyelikler ve tuhafiye seçenekleri.",
  path: "/",
  absoluteTitle: true,
});

export default async function Home() {
  const settings = await getStoreSettings();

  return (
    <main id="main-content" tabIndex={-1}>
      <HeroSection settings={settings} />
      <CategoriesSection />
      <ConceptsSection />
      <FeaturedProductsSection />
      <AnimatedShowcaseSection />
      <GalleryPreviewSection />
      <TrustSection />
      <HomepageStoreSection />
      <FinalCtaSection />
    </main>
  );
}
