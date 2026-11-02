import {
  createColorAction,
  deleteColorAction,
  updateColorAction,
} from "@/app/admin/(protected)/renkler/actions";
import { DeleteColorButton } from "@/components/admin/delete-color-button";
import { colorGroupLabels } from "@/lib/product-options";
import { createClient } from "@/lib/supabase/server";
import type { ProductColorGroupKey } from "@/types/product";

const errorMessages: Record<string, string> = {
  invalid: "Renk adı, grup veya HEX değerini kontrol edin.",
  duplicate: "Bu renk zaten sistemde tanımlı.",
  save: "Renk kaydedilemedi. Lütfen tekrar deneyin.",
  delete: "Renk silinemedi. Lütfen tekrar deneyin.",
  "in-use": "Bu renk bir veya daha fazla üründe kullanılıyor. Ürünlerdeki renk ve varyant bağlantılarını kaldırmadan silinemez.",
};

const successMessages: Record<string, string> = {
  created: "Yeni renk kataloğa eklendi.",
  updated: "Renk bilgileri güncellendi.",
  deleted: "Kullanılmayan renk katalogdan silindi.",
};

export default async function AdminColorsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { error, success } = await searchParams;
  const supabase = await createClient();
  const [
    { data: colors, error: colorsError },
    { data: assignedColors, error: linksError },
    { data: colorVariants, error: variantsError },
  ] = await Promise.all([
    supabase
      .from("colors")
      .select("id, name, group_key, hex, is_active, sort_order")
      .order("sort_order")
      .order("name"),
    supabase.from("product_colors").select("color_id"),
    supabase.from("product_color_variants").select("color_id"),
  ]);

  const usageAvailable = !linksError && !variantsError;
  const usageCounts = new Map<string, number>();
  for (const row of assignedColors ?? []) {
    usageCounts.set(row.color_id, (usageCounts.get(row.color_id) ?? 0) + 1);
  }
  for (const row of colorVariants ?? []) {
    usageCounts.set(row.color_id, (usageCounts.get(row.color_id) ?? 0) + 1);
  }

  const groups = new Map<ProductColorGroupKey, NonNullable<typeof colors>>();
  for (const color of colors ?? []) {
    const key = color.group_key as ProductColorGroupKey;
    const current = groups.get(key) ?? [];
    current.push(color);
    groups.set(key, current);
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-border bg-white p-6 shadow-soft sm:p-8">
        <p className="bt-eyebrow text-primary">Ürün seçenekleri</p>
        <h1 className="bt-display mt-2 text-4xl font-semibold">Renk kataloğu</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
          Renk adını, grubunu ve HEX kodunu düzenleyebilirsiniz.
          Kullanılan renkler ürün bağlantılarını korumak için doğrudan silinmez;
          yalnız hiçbir ürüne bağlı olmayan renkler silinebilir.
        </p>

        {success && successMessages[success] ? (
          <div className="mt-5 rounded-control border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-900">
            {successMessages[success]}
          </div>
        ) : null}
        {error && errorMessages[error] ? (
          <div role="alert" className="mt-5 rounded-control border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">
            {errorMessages[error]}
          </div>
        ) : null}
        {colorsError ? (
          <p role="alert" className="mt-4 font-semibold text-red-700">
            Renk listesi okunamadı. Lütfen sayfayı yenileyin.
          </p>
        ) : null}

        <form
          action={createColorAction}
          className="mt-8 grid gap-4 border-t border-border pt-8 md:grid-cols-[1fr_1fr_0.7fr_auto]"
        >
          <label>
            <span className="mb-2 block text-sm font-extrabold">Renk adı</span>
            <input name="name" required placeholder="Örn. Şampanya Gold" className="min-h-11 w-full rounded-control border border-border bg-white px-4" />
          </label>
          <label>
            <span className="mb-2 block text-sm font-extrabold">Grup</span>
            <select name="groupKey" defaultValue="other" className="min-h-11 w-full rounded-control border border-border bg-white px-4">
              {Object.entries(colorGroupLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </label>
          <label>
            <span className="mb-2 block text-sm font-extrabold">HEX renk</span>
            <input name="hex" placeholder="#D4AF37" pattern="^#[0-9A-Fa-f]{6}$" className="min-h-11 w-full rounded-control border border-border bg-white px-4 font-mono" />
          </label>
          <button type="submit" className="min-h-11 self-end rounded-control bg-primary px-5 font-extrabold text-white">
            Renk Ekle
          </button>
        </form>
      </div>

      {[...groups.entries()].map(([groupKey, groupColors]) => (
        <div key={groupKey} className="rounded-card border border-border bg-white p-5 shadow-soft sm:p-6">
          <h2 className="text-lg font-extrabold">{colorGroupLabels[groupKey]}</h2>
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {groupColors.map((color) => {
              const count = usageCounts.get(color.id) ?? 0;
              const canDelete = usageAvailable && count === 0;
              return (
                <div key={color.id} className="rounded-control border border-border p-4">
                  <div className="flex items-center gap-3">
                    <span className="size-7 shrink-0 rounded-full border border-black/10 bg-surface-muted" style={color.hex ? { backgroundColor: color.hex } : undefined} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-extrabold">{color.name}</p>
                      <p className="text-xs text-muted">
                        {color.hex ?? "HEX tanımsız"}
                        {count > 0 ? " · Ürünlerde kullanılıyor" : ""}
                      </p>
                    </div>
                  </div>
                  <details className="mt-3 border-t border-border pt-3">
                    <summary className="cursor-pointer text-sm font-extrabold text-primary">Rengi düzenle</summary>
                    <form action={updateColorAction} className="mt-4 grid gap-3 sm:grid-cols-2">
                      <input type="hidden" name="id" value={color.id} />
                      <label className="sm:col-span-2">
                        <span className="mb-1 block text-xs font-extrabold">Renk adı</span>
                        <input name="name" required defaultValue={color.name} className="min-h-10 w-full rounded-control border border-border px-3 text-sm" />
                      </label>
                      <label>
                        <span className="mb-1 block text-xs font-extrabold">Grup</span>
                        <select name="groupKey" defaultValue={color.group_key} className="min-h-10 w-full rounded-control border border-border bg-white px-3 text-sm">
                          {Object.entries(colorGroupLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                        </select>
                      </label>
                      <label>
                        <span className="mb-1 block text-xs font-extrabold">HEX renk</span>
                        <input name="hex" defaultValue={color.hex ?? ""} pattern="^#[0-9A-Fa-f]{6}$" placeholder="#D4AF37" className="min-h-10 w-full rounded-control border border-border px-3 text-sm font-mono" />
                      </label>
                      <button type="submit" className="min-h-10 rounded-control bg-primary px-4 text-sm font-extrabold text-white sm:col-span-2">
                        Değişiklikleri Kaydet
                      </button>
                    </form>
                  </details>
                  <form action={deleteColorAction} className="mt-3 flex items-center gap-3 border-t border-border pt-3">
                    <input type="hidden" name="id" value={color.id} />
                    <DeleteColorButton name={color.name} disabled={!canDelete} />
                    {!canDelete ? (
                      <span className="text-xs text-muted">
                        {usageAvailable ? "Kullanılan renk silinemez." : "Kullanım durumu doğrulanamadı."}
                      </span>
                    ) : null}
                  </form>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
