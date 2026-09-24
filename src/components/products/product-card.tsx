import Link from "next/link";

import { ProductMedia } from "@/components/products/product-media";
import { getCategoryBySlug } from "@/data/categories";
import type { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }) {
  const categoryName =
    product.categoryName ??
    getCategoryBySlug(product.categorySlug)?.name ??
    "Beymert";

  return (
    <Link
      href={`/urunler/${product.slug}`}
      className="group block min-w-0 overflow-hidden rounded-card border border-border bg-surface shadow-soft transition-[transform,box-shadow,border-color] duration-[var(--bt-duration-normal)] hover:-translate-y-1 hover:border-primary/25 hover:shadow-lift active:scale-[0.985]"
    >
      <div className="relative overflow-hidden border-b border-border">
        <div className="transition-transform duration-[var(--bt-duration-slow)] ease-[var(--bt-ease-emphasized)] group-hover:scale-[1.025]">
          <ProductMedia product={product} />
        </div>

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {product.newArrival ? (
            <span className="rounded-pill bg-foreground px-2.5 py-1 text-[0.65rem] font-black tracking-[0.08em] text-white uppercase shadow-soft">
              Yeni
            </span>
          ) : null}
          {product.featured ? (
            <span className="rounded-pill bg-primary px-2.5 py-1 text-[0.65rem] font-black tracking-[0.08em] text-white uppercase shadow-soft">
              Öne çıkan
            </span>
          ) : null}
        </div>
      </div>

      <div className="p-5">
        <p className="bt-eyebrow text-muted">{categoryName}</p>
        <h3 className="bt-display mt-2 text-[1.7rem] leading-tight font-semibold">
          {product.name}
        </h3>
        <p className="mt-3 text-sm leading-6 text-muted">
          {product.shortDescription}
        </p>

        {product.colors.length > 0 ? (
          <div className="mt-4 flex items-center gap-2">
            {product.colors.slice(0, 4).map((color) => (
              <span
                key={color.name}
                title={color.name}
                className="size-5 rounded-full border-2 border-white shadow-[0_0_0_1px_var(--bt-border)]"
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
        ) : null}

        <span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold">
          Ürünü incele
          <span
            aria-hidden="true"
            className="transition-transform duration-[var(--bt-duration-normal)] group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
