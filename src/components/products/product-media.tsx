import { ContentImageView } from "@/components/media/content-image";
import { ProductArtwork } from "@/components/products/product-artwork";
import type { Product } from "@/types/product";

type ProductVariant = "main" | "detail" | "color";

const imageIndexByVariant: Record<ProductVariant, number> = {
  main: 0,
  detail: 1,
  color: 2,
};

export function ProductMedia({
  product,
  variant = "main",
  fill = false,
  priority = false,
}: {
  product: Product;
  variant?: ProductVariant;
  fill?: boolean;
  priority?: boolean;
}) {
  const images = product.images ?? [];
  const image =
    images[imageIndexByVariant[variant]] ??
    images[0];

  if (!image) {
    return <ProductArtwork product={product} variant={variant} />;
  }

  return (
    <div
      className={
        fill
          ? "relative h-full min-h-0 w-full overflow-hidden bg-surface-muted"
          : "relative min-h-60 w-full overflow-hidden bg-surface-muted"
      }
    >
      <ContentImageView
        image={image}
        priority={priority}
        sizes={
          fill
            ? "(max-width: 1023px) 100vw, 60vw"
            : "(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
        }
      />
    </div>
  );
}
