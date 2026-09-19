import { ConceptMedia } from "@/components/concepts/concept-media";
import { ContentImageView } from "@/components/media/content-image";
import { ProductMedia } from "@/components/products/product-media";
import { getConceptBySlug } from "@/data/concepts";
import { getProductBySlug } from "@/data/products";
import type { GalleryItem } from "@/types/gallery";

const aspectClasses = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
  wide: "aspect-[16/10]",
} as const;

export function GalleryArtwork({
  item,
  fill = false,
}: {
  item: GalleryItem;
  fill?: boolean;
}) {
  const frameClass = fill
    ? "relative h-full w-full overflow-hidden bg-surface-muted"
    : `relative w-full overflow-hidden bg-surface-muted ${aspectClasses[item.aspect]}`;

  if (item.image) {
    return (
      <div className={frameClass}>
        <ContentImageView
          image={item.image}
          sizes={fill ? "100vw" : "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"}
        />
      </div>
    );
  }

  if (item.source.kind === "product") {
    const product = getProductBySlug(item.source.slug);

    if (!product) {
      return null;
    }

    return (
      <div className={frameClass}>
        <ProductMedia
          product={product}
          variant={item.source.variant}
          fill
        />
      </div>
    );
  }

  const concept = getConceptBySlug(item.source.slug);

  if (!concept) {
    return null;
  }

  const scene = concept.gallery.find(
    (itemScene) => itemScene.variant === item.source.variant,
  );

  return (
    <div className={frameClass}>
      <ConceptMedia concept={concept} scene={scene} fill />
      {!scene?.image && !concept.coverImage ? (
        <span className="absolute bottom-3 right-3 rounded-pill border border-white/80 bg-white/80 px-2.5 py-1 text-[0.62rem] font-extrabold tracking-[0.1em] text-muted uppercase backdrop-blur-sm">
          Temsili görsel
        </span>
      ) : null}
    </div>
  );
}
