"use client";

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
  sortOrder: number;
};

type VariantState = {
  enabled: boolean;
  mediaId: string;
};

function variantKey(colorId: string, seriesId: string | null) {
  return `${colorId}::${seriesId ?? "none"}`;
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
  const supabase = useMemo(() => createClient(), []);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [variants, setVariants] = useState<Map<string, VariantState>>(() => {
    const map = new Map<string, VariantState>();

    for (const variant of initialVariants) {
      map.set(variantKey(variant.colorId, variant.seriesId), {
        enabled: true,
        mediaId: variant.mediaId ?? "",
      });
    }

    if (series.length === 0) {
      for (const color of colors) {
        const key = variantKey(color.id, null);
        if (!map.has(key)) {
          map.set(key, { enabled: true, mediaId: "" });
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
        mediaId: "",
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
        media_id: string | null;
        sort_order: number;
      }> = [];

      let sortOrder = 0;

      if (series.length === 0) {
        for (const color of colors) {
          const state = variants.get(variantKey(color.id, null));
          payload.push({
            color_id: color.id,
            series_id: null,
            media_id: state?.mediaId || null,
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
              media_id: state.mediaId || null,
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
            yüklenmiş ayrı bir fotoğraf bağlayabilirsiniz.
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
              ({ enabled: true, mediaId: "" } satisfies VariantState);

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
                <label className="mt-4 block">
                  <span className="mb-2 block text-xs font-extrabold text-muted">
                    Bu renge ait ana görsel
                  </span>
                  <select
                    value={state.mediaId}
                    onChange={(event) =>
                      updateVariant(color.id, null, {
                        enabled: true,
                        mediaId: event.target.value,
                      })
                    }
                    className="min-h-11 w-full rounded-control border border-border bg-white px-3 text-sm"
                  >
                    <option value="">Varsayılan kapak fotoğrafı</option>
                    {mediaItems.map((media, index) => (
                      <option key={media.mediaId} value={media.mediaId}>
                        Fotoğraf {index + 1}
                        {media.caption ? ` — ${media.caption}` : ""}
                      </option>
                    ))}
                  </select>
                </label>
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
                    ({ enabled: false, mediaId: "" } satisfies VariantState);

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
                        <label className="mt-3 block">
                          <span className="mb-1.5 block text-xs font-bold text-muted">
                            Kombinasyon görseli
                          </span>
                          <select
                            value={state.mediaId}
                            onChange={(event) =>
                              updateVariant(color.id, item.id, {
                                mediaId: event.target.value,
                              })
                            }
                            className="min-h-10 w-full rounded-control border border-border bg-white px-3 text-xs"
                          >
                            <option value="">Varsayılan kapak fotoğrafı</option>
                            {mediaItems.map((media, index) => (
                              <option key={media.mediaId} value={media.mediaId}>
                                Fotoğraf {index + 1}
                                {media.caption ? ` — ${media.caption}` : ""}
                              </option>
                            ))}
                          </select>
                        </label>
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
