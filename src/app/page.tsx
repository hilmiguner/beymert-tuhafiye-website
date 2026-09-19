import { CategoriesSection } from "@/components/sections/categories-section";
import { ConceptsSection } from "@/components/sections/concepts-section";
import { FeaturedProductsSection } from "@/components/sections/featured-products-section";
import { HeroSection } from "@/components/sections/hero-section";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <CategoriesSection />
      <ConceptsSection />
      <FeaturedProductsSection />
    </main>
  );
}
