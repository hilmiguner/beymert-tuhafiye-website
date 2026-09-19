"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { GalleryArtwork } from "@/components/gallery/gallery-artwork";
import { getCategoryBySlug } from "@/data/categories";
import { getConceptBySlug } from "@/data/concepts";
import { getProductBySlug } from "@/data/products";
import type { GalleryItem } from "@/types/gallery";

function RelationLinks({ item }: { item: GalleryItem }) {
  const category = item.categorySlug
    ? getCategoryBySlug(item.categorySlug)
    : undefined;
  const concept = item.conceptSlug
    ? getConceptBySlug(item.conceptSlug)
    : undefined;
  const product = item.productSlug
    ? getProductBySlug(item.productSlug)
    : undefined;

  return (
    <div className="flex flex-wrap gap-2">
      {concept ? (
        <Link
          href={`/konseptler/${concept.slug}`}
          className="rounded-pill border border-border bg-background px-3 py-1.5 text-xs font-extrabold text-muted transition-colors hover:border-primary/30 hover:text-primary"
        >
          {concept.name}
        </Link>
      ) : null}
      {category ? (
        <Link
          href={`/kategoriler/${category.slug}`}
          className="rounded-pill border border-border bg-background px-3 py-1.5 text-xs font-extrabold text-muted transition-colors hover:border-primary/30 hover:text-primary"
        >
          {category.name}
        </Link>
      ) : null}
      {product ? (
        <Link
          href={`/urunler/${product.slug}`}
          className="rounded-pill border border-border bg-background px-3 py-1.5 text-xs font-extrabold text-muted transition-colors hover:border-primary/30 hover:text-primary"
        >
          Ürünü incele
        </Link>
      ) : null}
    </div>
  );
}

export function GalleryExperience({
  items,
}: {
  items: readonly GalleryItem[];
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((current) =>
          current === null ? null : (current + 1) % items.length,
        );
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((current) =>
          current === null
            ? null
            : (current - 1 + items.length) % items.length,
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, items.length]);

  const activeItem = activeIndex === null ? null : items[activeIndex];

  const showPrevious = () => {
    setActiveIndex((current) =>
      current === null
        ? null
        : (current - 1 + items.length) % items.length,
    );
  };

  const showNext = () => {
    setActiveIndex((current) =>
      current === null ? null : (current + 1) % items.length,
    );
  };

  return (
    <>
      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
        {items.map((item, index) => (
          <motion.article
            key={item.id}
            className="mb-5 break-inside-avoid overflow-hidden rounded-card border border-border bg-surface shadow-soft"
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{
              duration: reducedMotion ? 0 : 0.42,
              ease: [0.2, 0.8, 0.2, 1],
            }}
          >
            <button
              type="button"
              onClick={() => setActiveIndex(index)}
              className="group relative block w-full overflow-hidden text-left"
              aria-label={`${item.title} görselini büyüt`}
            >
              <div className="transition-transform duration-[var(--bt-duration-slow)] ease-[var(--bt-ease-emphasized)] group-hover:scale-[1.018]">
                <GalleryArtwork item={item} />
              </div>
              <span className="absolute left-3 top-3 rounded-pill border border-white/75 bg-white/78 px-3 py-1.5 text-[0.68rem] font-black tracking-[0.08em] text-foreground uppercase shadow-soft backdrop-blur-sm">
                Büyüt
              </span>
            </button>

            <div className="p-5">
              <h2 className="bt-display text-2xl leading-tight font-semibold">
                {item.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                {item.description}
              </p>
              <div className="mt-4">
                <RelationLinks item={item} />
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <AnimatePresence>
        {activeItem && activeIndex !== null ? (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1d1318]/88 p-3 backdrop-blur-md sm:p-6"
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.2 }}
            onClick={() => setActiveIndex(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={activeItem.title}
              className="relative grid max-h-[calc(100svh-1.5rem)] w-full max-w-6xl overflow-hidden rounded-[1.75rem] border border-white/12 bg-background shadow-[0_32px_120px_rgb(0_0_0_/_0.45)] lg:grid-cols-[1.2fr_0.8fr]"
              initial={
                reducedMotion
                  ? false
                  : { opacity: 0, scale: 0.97, y: 12 }
              }
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 8 }}
              transition={{
                duration: reducedMotion ? 0 : 0.26,
                ease: [0.2, 0.8, 0.2, 1],
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <motion.div
                className="relative min-h-0 overflow-hidden bg-surface-muted"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.22}
                onDragEnd={(_, info) => {
                  const shouldNavigate =
                    Math.abs(info.offset.x) > 55 ||
                    Math.abs(info.velocity.x) > 500;

                  if (!shouldNavigate) {
                    return;
                  }

                  if (info.offset.x > 0) {
                    showPrevious();
                  } else {
                    showNext();
                  }
                }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeItem.id}
                    className="h-full"
                    initial={
                      reducedMotion ? false : { opacity: 0, x: 22 }
                    }
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -22 }}
                    transition={{ duration: reducedMotion ? 0 : 0.2 }}
                  >
                    <GalleryArtwork item={activeItem} />
                  </motion.div>
                </AnimatePresence>

                <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 sm:inset-x-5 sm:bottom-5">
                  <button
                    type="button"
                    onClick={showPrevious}
                    className="grid size-11 place-items-center rounded-full border border-white/75 bg-white/88 text-lg font-black shadow-soft backdrop-blur-sm transition-transform active:scale-95"
                    aria-label="Önceki görsel"
                  >
                    ←
                  </button>
                  <span className="rounded-pill border border-white/75 bg-white/88 px-3 py-1.5 text-xs font-extrabold text-muted shadow-soft backdrop-blur-sm">
                    {activeIndex + 1} / {items.length}
                  </span>
                  <button
                    type="button"
                    onClick={showNext}
                    className="grid size-11 place-items-center rounded-full border border-white/75 bg-white/88 text-lg font-black shadow-soft backdrop-blur-sm transition-transform active:scale-95"
                    aria-label="Sonraki görsel"
                  >
                    →
                  </button>
                </div>
              </motion.div>

              <div className="relative max-h-[42svh] overflow-y-auto p-5 sm:p-7 lg:max-h-none lg:p-9">
                <button
                  type="button"
                  onClick={() => setActiveIndex(null)}
                  className="absolute right-4 top-4 grid size-10 place-items-center rounded-full border border-border bg-surface text-lg font-black shadow-soft transition-transform active:scale-95"
                  aria-label="Galeriyi kapat"
                >
                  ×
                </button>

                <p className="bt-eyebrow pr-12 text-primary">
                  Beymert galerisi
                </p>
                <h2 className="bt-display mt-3 pr-10 text-4xl leading-tight font-semibold">
                  {activeItem.title}
                </h2>
                <p className="mt-4 leading-7 text-muted">
                  {activeItem.description}
                </p>

                <div className="mt-6">
                  <p className="mb-3 text-xs font-black tracking-[0.1em] text-muted uppercase">
                    İlgili içerikler
                  </p>
                  <RelationLinks item={activeItem} />
                </div>

                <p className="mt-7 text-xs leading-5 text-muted">
                  Bu aşamadaki galeri görselleri temsili geliştirme
                  görselleridir. Gerçek Beymert kurulum fotoğrafları içerik
                  entegrasyonu aşamasında eklenecek.
                </p>

                <p className="mt-5 text-xs font-bold text-muted lg:hidden">
                  Sonraki veya önceki görsel için yatay kaydırabilirsin.
                </p>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
