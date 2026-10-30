"use client";

import { useMemo, useState } from "react";

import { ContentImageView } from "@/components/media/content-image";
import { ProductArtwork } from "@/components/products/product-artwork";
import { useProductVariantSelection } from "@/components/products/product-variant-context";
import { dedupeProductVariants } from "@/lib/product-options";
import type { ContentImage } from "@/types/media";
import type { Product, ProductColorVariant } from "@/types/product";

function uniqueByName(
  variants: readonly ProductColorVariant[],
  field: "colorName" | "seriesName",
) {
  const seen = new Set<string>();
  return variants.filter((variant) => {
    const value = variant[field];
    if (!value) return false;
    const key = value.toLocaleLowerCase("tr-TR");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function ProductVariantHero({ product }: { product: Product }) {
  const variants = useMemo(
    () => dedupeProductVariants(product.colorVariants ?? []),
    [product.colorVariants],
  );
  const { activeVariant, selectVariant } = useProductVariantSelection();
  const [lightboxImage, setLightboxImage] = useState<ContentImage | null>(null);

  const defaultImage = product.images?.[0];
  const selectedImages = activeVariant?.images ?? (activeVariant?.image ? [activeVariant.image] : []);
  const activeImage = activeVariant ? selectedImages[0] ?? defaultImage : defaultImage;
  const colorVariants = uniqueByName(variants, "colorName");
  const availableSeries = activeVariant
    ? uniqueByName(
        variants.filter(
          (variant) =>
            variant.colorName.toLocaleLowerCase("tr-TR") ===
            activeVariant.colorName.toLocaleLowerCase("tr-TR"),
        ),
        "seriesName",
      )
    : [];

  function selectColor(colorName: string) {
    const candidates = variants.filter(
      (variant) =>
        variant.colorName.toLocaleLowerCase("tr-TR") ===
        colorName.toLocaleLowerCase("tr-TR"),
    );

    const matchingSeries = activeVariant?.seriesName
      ? candidates.find(
          (variant) =>
            variant.seriesName?.toLocaleLowerCase("tr-TR") ===
            activeVariant.seriesName?.toLocaleLowerCase("tr-TR"),
        )
      : undefined;

    selectVariant(matchingSeries ?? candidates[0] ?? null);
  }

  function selectSeries(seriesName: string) {
    if (!activeVariant) return;

    const next = variants.find(
      (variant) =>
        variant.colorName.toLocaleLowerCase("tr-TR") ===
          activeVariant.colorName.toLocaleLowerCase("tr-TR") &&
        variant.seriesName?.toLocaleLowerCase("tr-TR") ===
          seriesName.toLocaleLowerCase("tr-TR"),
    );

    if (next) selectVariant(next);
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => activeImage && setLightboxImage(activeImage)}
        className="block w-full overflow-hidden rounded-[2rem] border border-white/80 bg-surface text-left shadow-lift"
        aria-label={
          activeImage
            ? `${product.name} görselini büyüt`
            : `${product.name} görseli`
        }
      >
        {activeImage ? (
          <div className="relative min-h-72 w-full overflow-hidden bg-surface-muted sm:min-h-96">
            <ContentImageView
              image={activeImage}
              fit="contain"
              priority
              sizes="(max-width: 1023px) 100vw, 45vw"
            />
          </div>
        ) : (
          <ProductArtwork product={product} variant="main" />
        )}
      </button>

      {activeVariant && selectedImages.length === 0 ? (
        <p className="mt-3 rounded-control border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-900">
          Bu renk ve seri için henüz fotoğraf eşleştirilmedi. Üstteki fotoğraf genel ürün görselidir.
        </p>
      ) : null}

      {colorVariants.length > 0 ? (
        <div className="mt-5 rounded-card border border-border bg-surface p-4 shadow-soft">
          <p className="text-xs font-black tracking-[0.08em] text-muted uppercase">
            Renk seç
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {colorVariants.map((variant) => {
              const selected =
                activeVariant?.colorName.toLocaleLowerCase("tr-TR") ===
                variant.colorName.toLocaleLowerCase("tr-TR");
              return (
                <button
                  key={`${variant.colorId}-${variant.colorName}`}
                  type="button"
                  onClick={() => selectColor(variant.colorName)}
                  aria-pressed={selected}
                  className={`flex items-center gap-2 rounded-pill border px-3 py-2 text-sm font-extrabold transition ${
                    selected
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-white text-foreground hover:border-primary/30"
                  }`}
                >
                  <span
                    className="size-5 rounded-full border border-black/10"
                    style={{ backgroundColor: variant.colorHex }}
                  />
                  {variant.colorName}
                </button>
              );
            })}
          </div>

          {activeVariant && availableSeries.length > 0 ? (
            <div className="mt-4 border-t border-border pt-4">
              <p className="text-xs font-black tracking-[0.08em] text-muted uppercase">
                Renk serisi
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {availableSeries.map((variant) => {
                  const seriesName = variant.seriesName!;
                  const selected =
                    activeVariant.seriesName?.toLocaleLowerCase("tr-TR") ===
                    seriesName.toLocaleLowerCase("tr-TR");
                  return (
                    <button
                      key={`${variant.seriesId ?? seriesName}-${seriesName}`}
                      type="button"
                      onClick={() => selectSeries(seriesName)}
                      aria-pressed={selected}
                      className={`rounded-pill border px-3 py-2 text-sm font-extrabold transition ${
                        selected
                          ? "border-primary bg-primary text-white"
                          : "border-border bg-white text-foreground hover:border-primary/30"
                      }`}
                    >
                      {seriesName}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {activeVariant ? (
            <p className="mt-4 text-xs font-semibold text-muted">
              Seçili seçenek: {activeVariant.colorName}
              {activeVariant.seriesName
                ? ` · ${activeVariant.seriesName}`
                : ""}
            </p>
          ) : (
            <p className="mt-4 text-xs text-muted">
              Bir renk seçtiğinizde varsa o seçeneğe bağlı ürün fotoğrafı
              yukarıda gösterilir.
            </p>
          )}
        </div>
      ) : product.colors.length > 0 &&
        (product.colorSeries?.length ?? 0) === 0 ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {product.colors.map((color) => (
            <span
              key={color.id ?? color.name}
              className="flex items-center gap-2 rounded-pill border border-border bg-surface px-3 py-2 text-sm font-extrabold"
            >
              <span
                className="size-5 rounded-full border border-black/10"
                style={{ backgroundColor: color.hex }}
              />
              {color.name}
            </span>
          ))}
        </div>
      ) : null}

      {lightboxImage ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name} büyük görsel`}
          onClick={() => setLightboxImage(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 rounded-full bg-white px-4 py-2 text-sm font-black text-foreground"
          >
            Kapat
          </button>
          <div
            className="relative h-[82vh] w-full max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            <ContentImageView
              image={lightboxImage}
              fit="contain"
              sizes="100vw"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
