import { createColorAction } from "@/app/admin/(protected)/renkler/actions";
import { colorGroupLabels } from "@/lib/product-options";
import { createClient } from "@/lib/supabase/server";
import type { ProductColorGroupKey } from "@/types/product";

const errorMessages: Record<string, string> = {
  invalid: "Renk adı, grup veya HEX değerini kontrol edin.",
  duplicate: "Bu renk zaten sistemde tanımlı.",
  save: "Renk kaydedilemedi. Lütfen tekrar deneyin.",
};

export default async function AdminColorsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { error, success } = await searchParams;
  const supabase = await createClient();
  const { data: colors } = await supabase
    .from("colors")
    .select("id, name, group_key, hex, is_active, sort_order")
    .order("sort_order")
    .order("name");

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
          Ürünlerde kullanılan renkler burada bir kez tanımlanır. Aynı isimli
          renk ikinci kez eklenemez; ürün formları bu katalogdan seçim yapar.
        </p>

        {success === "created" ? (
          <div className="mt-5 rounded-control border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-900">
            Yeni renk kataloğa eklendi.
          </div>
        ) : null}

        {error && errorMessages[error] ? (
          <div className="mt-5 rounded-control border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">
            {errorMessages[error]}
          </div>
        ) : null}

        <form
          action={createColorAction}
          className="mt-8 grid gap-4 border-t border-border pt-8 md:grid-cols-[1fr_1fr_0.7fr_auto]"
        >
          <label>
            <span className="mb-2 block text-sm font-extrabold">Renk adı</span>
            <input
              name="name"
              required
              placeholder="Örn. Şampanya Gold"
              className="min-h-11 w-full rounded-control border border-border bg-white px-4"
            />
          </label>

          <label>
            <span className="mb-2 block text-sm font-extrabold">Grup</span>
            <select
              name="groupKey"
              defaultValue="other"
              className="min-h-11 w-full rounded-control border border-border bg-white px-4"
            >
              {Object.entries(colorGroupLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-2 block text-sm font-extrabold">HEX renk</span>
            <input
              name="hex"
              placeholder="#D4AF37"
              pattern="^#[0-9A-Fa-f]{6}$"
              className="min-h-11 w-full rounded-control border border-border bg-white px-4 font-mono"
            />
          </label>

          <button
            type="submit"
            className="min-h-11 self-end rounded-control bg-primary px-5 font-extrabold text-white"
          >
            Renk Ekle
          </button>
        </form>
      </div>

      {[...groups.entries()].map(([groupKey, groupColors]) => (
        <div
          key={groupKey}
          className="rounded-card border border-border bg-white p-5 shadow-soft sm:p-6"
        >
          <h2 className="text-lg font-extrabold">
            {colorGroupLabels[groupKey]}
          </h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {groupColors.map((color) => (
              <div
                key={color.id}
                className="flex items-center gap-3 rounded-control border border-border p-3"
              >
                <span
                  className="size-7 shrink-0 rounded-full border border-black/10 bg-surface-muted"
                  style={color.hex ? { backgroundColor: color.hex } : undefined}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold">{color.name}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {color.hex ?? "HEX tanımsız"}
                    {!color.is_active ? " · Pasif" : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
