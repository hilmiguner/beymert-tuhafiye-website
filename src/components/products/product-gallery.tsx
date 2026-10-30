"use client";

import { useEffect, useState } from "react";

import { ContentImageView } from "@/components/media/content-image";
import type { ContentImage } from "@/types/media";

export function ProductGallery({
  images,
  productName,
}: {
  images: readonly ContentImage[];
  productName: string;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeIndex === null) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowLeft") {
        setActiveIndex((current) =>
          current === null
            ? null
            : (current - 1 + images.length) % images.length,
        );
      }
      if (event.key === "ArrowRight") {
        setActiveIndex((current) =>
          current === null ? null : (current + 1) % images.length,
        );
      }
    }

    document.addEventListener("keydown", onKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [activeIndex, images.length]);

  if (images.length === 0) return null;

  const activeImage =
    activeIndex === null ? null : images[activeIndex] ?? null;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {images.map((image, index) => (
          <figure
            key={`${image.mediaId ?? image.src}-${index}`}
            className={`overflow-hidden rounded-card border border-border bg-surface shadow-soft ${
              index === 0 ? "sm:col-span-2" : ""
            }`}
          >
            <button
              type="button"
              onClick={() => setActiveIndex(index)}
              className="block w-full cursor-zoom-in"
              aria-label={`${productName} fotoğraf ${index + 1} görselini büyüt`}
            >
              <div
                className={`relative w-full overflow-hidden bg-surface-muted ${
                  index === 0 ? "min-h-80 sm:min-h-[26rem]" : "min-h-64"
                }`}
              >
                <ContentImageView
                  image={image}
                  fit="contain"
                  sizes={
                    index === 0
                      ? "(max-width: 639px) 100vw, 70vw"
                      : "(max-width: 639px) 100vw, 35vw"
                  }
                />
              </div>
            </button>
            {image.caption ? (
              <figcaption className="border-t border-border px-4 py-3 text-sm font-semibold text-muted">
                {image.caption}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>

      {activeImage && activeIndex !== null ? (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${productName} fotoğraf galerisi`}
          onClick={() => setActiveIndex(null)}
        >
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            className="absolute top-4 right-4 z-10 rounded-full bg-white px-4 py-2 text-sm font-black text-foreground"
          >
            Kapat
          </button>

          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveIndex(
                    (activeIndex - 1 + images.length) % images.length,
                  );
                }}
                className="absolute left-3 z-10 rounded-full bg-white/95 px-4 py-3 text-xl font-black text-foreground sm:left-6"
                aria-label="Önceki fotoğraf"
              >
                ←
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveIndex((activeIndex + 1) % images.length);
                }}
                className="absolute right-3 z-10 rounded-full bg-white/95 px-4 py-3 text-xl font-black text-foreground sm:right-6"
                aria-label="Sonraki fotoğraf"
              >
                →
              </button>
            </>
          ) : null}

          <div
            className="flex h-[88vh] w-full max-w-6xl flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative min-h-0 flex-1">
              <ContentImageView
                image={activeImage}
                fit="contain"
                sizes="100vw"
              />
            </div>
            {activeImage.caption ? (
              <p className="mx-auto mt-3 max-w-3xl rounded-pill bg-white px-4 py-2 text-center text-sm font-semibold text-foreground">
                {activeImage.caption}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
