"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";

import { ProductCard } from "@/components/products/product-card";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

export function ProductCatalog({
  products,
  categories,
}: {
  products: readonly Product[];
  categories: readonly Category[];
}) {
  const [categorySlug, setCategorySlug] = useState("all");
  const reducedMotion = useReducedMotion();

  const visibleProducts = useMemo(
    () =>
      categorySlug === "all"
        ? products
        : products.filter((product) => product.categorySlug === categorySlug),
    [categorySlug, products],
  );

  return (
    <>
      <div
        className="bt-hide-scrollbar -mx-[var(--bt-gutter)] flex gap-2 overflow-x-auto px-[var(--bt-gutter)] pb-3 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
        role="group"
        aria-label="Ürünleri kategoriye göre filtrele"
      >
        <button
          type="button"
          onClick={() => setCategorySlug("all")}
          aria-pressed={categorySlug === "all"}
          className={`shrink-0 rounded-pill border px-4 py-2.5 text-sm font-extrabold transition-colors ${
            categorySlug === "all"
              ? "border-primary bg-primary text-white"
              : "border-border bg-surface text-muted hover:text-foreground"
          }`}
        >
          Tümü
        </button>
        {categories.map((category) => (
          <button
            key={category.slug}
            type="button"
            onClick={() => setCategorySlug(category.slug)}
            aria-pressed={categorySlug === category.slug}
            className={`shrink-0 rounded-pill border px-4 py-2.5 text-sm font-extrabold transition-colors ${
              categorySlug === category.slug
                ? "border-primary bg-primary text-white"
                : "border-border bg-surface text-muted hover:text-foreground"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <motion.div layout className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {visibleProducts.map((product) => (
            <motion.div
              layout
              key={product.slug}
              initial={reducedMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 8, scale: 0.98 }}
              transition={{
                duration: reducedMotion ? 0 : 0.24,
                ease: [0.2, 0.8, 0.2, 1],
              }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {visibleProducts.length === 0 ? (
        <div className="mt-8 rounded-card border border-dashed border-border bg-surface-muted/55 p-8 text-center text-muted">
          Bu filtre için henüz örnek ürün bulunmuyor.
        </div>
      ) : null}
    </>
  );
}
