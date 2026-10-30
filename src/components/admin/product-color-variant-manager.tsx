"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import type {
  AdminColorOption,
  AdminSeriesOption,
} from "@/components/admin/product-color-selector";
import type { ProductMediaItem } from "@/components/admin/product-media-manager";
import { createClient } from "@/lib/supabase/client";
import type { Json } from "@/types/database";

export type AdminProductVariant = {
  colorId: string;
  seriesId: string | null;
  mediaId: string | null;
  mediaIds: string[];
  sortOrder: number;
};

type VariantState = {
  enabled: boolean;
  mediaIds: string[];
};

function variantKey(colorId: string, seriesId: string | null) {
  return `${colorId}::${seriesId ?? "none"}`;
}

function VariantPhotoChecklist({
  mediaItems,
  selectedIds,
  onToggle,
}: {
  mediaItems: ReadonlyArray<ProductMediaItem & { label: string; url: string }>;
  selectedIds: readonly string[];
  onToggle: (mediaId: string, selected: boolean) => void;
}) {
  if (mediaItems.length === 0) {
    return <p className="mt-3 text-xs text-muted">Önce bu ürüne fotoğraf yükleyin.</p>;
  }

  return (
    <fieldset className="mt-4 min-w-0">
      <legend className="text-xs font-extrabold text-muted">
        Bu seçenekte gösterilecek fotoğraflar ({selectedIds.length} seçili)
      </legend>
      <div className="mt-2 grid max-h-64 grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3">
        {mediaItems.map((media) => (
          <label
            key={media.mediaId}
            className="flex cursor-pointer flex-col gap-2 rounded-control border border-border bg-white p-2 text-xs"
          >
            <div className="flex items-center justify-between gap-1">
              <input
                type="checkbox"
                checked={selectedIds.includes(media.mediaId)}
                onChange={(event) => onToggle(media.mediaId, event.target.checked)}
                className="size-4 accent-[var(--color-primary)]"
              />
              {media.isCover ? <span className="text-[0.65rem] text-muted">Kapak</span> : null}
            </div>
            <div
              role="img"
              aria-label={media.altText}
              className="aspect-square w-full rounded-control bg-contain bg-center bg-no-repeat"
              style={{ backgroundImage: `url("${media.url}")` }}
            />
            <span className="line-clamp-2 font-semibold">{media.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function ProductColorVariantManager({
  productId,
  colors,
  series,
  mediaItems,
  initialVariants,
}: {
  productId: string;
  colors: readonly AdminColorOption[];
  series: readonly AdminSeriesOption[];
  mediaItems: readonly ProductMediaItem[];
  initialVariants: readonly AdminProductVariant[];
}) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const photoOptions = useMemo(() => mediaItems.map((item, index) => ({
    ...item,
    label: item.caption || `Fotoğraf ${index + 1}`,
    url: supabase.storage.from("cms-media").getPublicUrl(item.storagePath).data.publicUrl,
  })), [mediaItems, supabase]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [variants, setVariants] = useState<Map<string, VariantState>>(() => {
    const map = new Map<string, VariantState>();

    for (const variant of initialVariants) {
      map.set(variantKey(variant.colorId, variant.seriesId), {
        enabled: true,
        mediaIds: variant.mediaIds.length ? variant.mediaIds : (variant.mediaId ? [variant.mediaId] : []),
      });
    }

    if (series.length === 0) {
      for (const color of colors) {
        const key = variantKey(color.id, null);
        if (!map.has(key)) {
          map.set(key, { enabled: true, mediaIds: [] });
        }
      }
    }

    return map;
  });

  function updateVariant(
    colorId: string,
    seriesId: string | null,
    patch: Partial<VariantState>,
  ) {
    const key = variantKey(colorId, seriesId);
    setVariants((current) => {
      const next = new Map(current);
      next.set(key, {
        enabled: false,
        mediaIds: [],
        ...(next.get(key) ?? {}),
        ...patch,
      });
      return next;
    });
  }

  async function save() {
    setBusy(true);
    setMessage(null);

    try {
      const payload: Array<{
        color_id: string;
        series_id: string | null;
        media_ids: string[];
        sort_order: number;
      }> = [];

      let sortOrder = 0;

      if (series.length === 0) {
        for (const color of colors) {
          const state = variants.get(variantKey(color.id, null));
          payload.push({
            color_id: color.id,
            series_id: null,
            media_ids: state?.mediaIds ?? [],
            sort_order: sortOrder++,
          });
        }
      } else {
        for (const color of colors) {
          for (const item of series) {
            const state = variants.get(variantKey(color.id, item.id));
            if (!state?.enabled) continue;

            payload.push({
              color_id: color.id,
              series_id: item.id,
              media_ids: state.mediaIds,
              sort_order: sortOrder++,
            });
          }
        }
      }

      const { error } = await supabase.rpc("set_product_color_variants", {
        p_product_id: productId,
        p_variants: payload as unknown as Json,
      });

      if (error) throw error;

      setMessage(
        payload.length > 0
          ? "Geçerli renk-seri kombinasyonları kaydedildi."
          : "Bu ürün için geçerli renk-seri kombinasyonu bırakılmadı.",
      );
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Renk-seri kombinasyonları kaydedilemedi.",
      );
    } finally {
      setBusy(false);
    }
  }

  if (colors.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-extrabold">Renk ve seri kombinasyonları</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          Önce ürün formundan en az bir renk seçip değişiklikleri kaydedin.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-extrabold">Renk ve seri kombinasyonları</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
            Müşteriye yalnızca burada geçerli olarak işaretlediğiniz
            kombinasyonlar gösterilir. Her kombinasyona isterseniz ürüne
            yüklenmiş bir veya birden fazla fotoğraf bağlayabilirsiniz.
            Müşterinin renk seçimi yalnız bu eşleşmedeki fotoğrafları gösterir.
          </p>
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={() => void save()}
          className="min-h-11 shrink-0 rounded-control bg-primary px-5 text-sm font-extrabold text-white disabled:opacity-50"
        >
          {busy ? "Kaydediliyor…" : "Kombinasyonları Kaydet"}
        </button>
      </div>

      {message ? (
        <div className="mt-4 rounded-control bg-surface-muted p-3 text-sm font-semibold text-muted">
          {message}
        </div>
      ) : null}

      {series.length === 0 ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {colors.map((color) => {
            const state =
              variants.get(variantKey(color.id, null)) ??
              ({ enabled: true, mediaIds: [] } satisfies VariantState);

            return (
              <div
                key={color.id}
                className="rounded-card border border-border bg-white p-4"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="size-6 rounded-full border border-black/10 bg-surface-muted"
                    style={
                      color.hex ? { backgroundColor: color.hex } : undefined
                    }
                  />
                  <p className="font-extrabold">{color.name}</p>
                </div>
                <VariantPhotoChecklist
                  mediaItems={photoOptions}
                  selectedIds={state.mediaIds}
                  onToggle={(mediaId, checked) =>
                    updateVariant(color.id, null, {
                      enabled: true,
                      mediaIds: checked
                        ? [...state.mediaIds, mediaId]
                        : state.mediaIds.filter((id) => id !== mediaId),
                    })
                  }
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {colors.map((color) => (
            <section
              key={color.id}
              className="rounded-card border border-border bg-white p-4 sm:p-5"
            >
              <div className="flex items-center gap-3">
                <span
                  className="size-6 rounded-full border border-black/10 bg-surface-muted"
                  style={color.hex ? { backgroundColor: color.hex } : undefined}
                />
                <h3 className="font-extrabold">{color.name}</h3>
              </div>

              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                {series.map((item) => {
                  const key = variantKey(color.id, item.id);
                  const state =
                    variants.get(key) ??
                    ({ enabled: false, mediaIds: [] } satisfies VariantState);

                  return (
                    <div
                      key={item.id}
                      className={`rounded-control border p-3 ${
                        state.enabled
                          ? "border-primary/30 bg-primary/5"
                          : "border-border bg-surface-muted/30"
                      }`}
                    >
                      <label className="flex cursor-pointer items-center gap-3">
                        <input
                          type="checkbox"
                          checked={state.enabled}
                          onChange={(event) =>
                            updateVariant(color.id, item.id, {
                              enabled: event.target.checked,
                            })
                          }
                          className="size-4 accent-[var(--color-primary)]"
                        />
                        <span className="text-sm font-extrabold">
                          {item.name}
                        </span>
                      </label>

                      {state.enabled ? (
                        <VariantPhotoChecklist
                          mediaItems={photoOptions}
                          selectedIds={state.mediaIds}
                          onToggle={(mediaId, checked) =>
                            updateVariant(color.id, item.id, {
                              mediaIds: checked
                                ? [...state.mediaIds, mediaId]
                                : state.mediaIds.filter((id) => id !== mediaId),
                            })
                          }
                        />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
