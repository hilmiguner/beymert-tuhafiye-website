import { ConceptArtwork } from "@/components/concepts/concept-artwork";
import { ProductArtwork } from "@/components/products/product-artwork";
import { getConceptBySlug } from "@/data/concepts";
import { getProductBySlug } from "@/data/products";
import type { GalleryItem } from "@/types/gallery";

const aspectClasses = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
  wide: "aspect-[16/10]",
} as const;

export function GalleryArtwork({ item }: { item: GalleryItem }) {
  if (item.source.kind === "product") {
    const product = getProductBySlug(item.source.slug);

    if (!product) {
      return null;
    }

    return (
      <div
        className={`relative w-full overflow-hidden bg-surface-muted ${aspectClasses[item.aspect]}`}
      >
        <ProductArtwork product={product} variant={item.source.variant} />
      </div>
    );
  }

  const concept = getConceptBySlug(item.source.slug);

  if (!concept) {
    return null;
  }

  return (
    <div
      className={`relative w-full overflow-hidden bg-surface-muted ${aspectClasses[item.aspect]}`}
    >
      <ConceptArtwork
        motif={concept.motif}
        primary={concept.colors.primary}
        secondary={concept.colors.secondary}
        background={concept.colors.background}
        foreground={concept.colors.foreground}
        variant={item.source.variant}
      />
      <span className="absolute bottom-3 right-3 rounded-pill border border-white/80 bg-white/80 px-2.5 py-1 text-[0.62rem] font-extrabold tracking-[0.1em] text-muted uppercase backdrop-blur-sm">
        Temsili görsel
      </span>
    </div>
  );
}
