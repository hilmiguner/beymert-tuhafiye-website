import { AnimatedShowcaseSection } from "@/components/sections/animated-showcase-section";
import { CategoriesSection } from "@/components/sections/categories-section";
import { ConceptsSection } from "@/components/sections/concepts-section";
import { FeaturedProductsSection } from "@/components/sections/featured-products-section";
import { GalleryPreviewSection } from "@/components/sections/gallery-preview-section";
import { HeroSection } from "@/components/sections/hero-section";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <CategoriesSection />
      <ConceptsSection />
      <FeaturedProductsSection />
      <AnimatedShowcaseSection />
      <GalleryPreviewSection />
    </main>
  );
}
