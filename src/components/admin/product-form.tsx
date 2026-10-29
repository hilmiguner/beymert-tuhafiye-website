import Link from "next/link";

import { RichTextEditor } from "@/components/admin/rich-text-editor";
import type { AdminCategoryOption } from "@/lib/category-hierarchy";
import type { Tables } from "@/types/database";

type Product = Tables<"products">;

type ProductFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  product?: Product;
  categories: AdminCategoryOption[];
  selectedCategoryIds?: readonly string[];
  error?: string;
  submitLabel: string;
};

const errorMessages: Record<string, string> = {
  invalid: "Lütfen zorunlu alanları ve sayısal değerleri kontrol edin.",
  categories:
    "Kategori seçimlerinden biri geçersiz. Kategorileri kontrol edip tekrar deneyin.",
  slug: "Bu URL adı başka bir ürün tarafından kullanılıyor.",
  save: "Ürün kaydedilemedi. Lütfen tekrar deneyin.",
};

const levelLabels = {
  1: "Ana",
  2: "Alt",
  3: "3. seviye",
} as const;

export function ProductForm({
  action,
  product,
  categories,
  selectedCategoryIds,
  error,
  submitLabel,
}: ProductFormProps) {
  const selected = new Set(
    selectedCategoryIds ??
      (product?.category_id ? [product.category_id] : []),
  );

  return (
    <form action={action} className="space-y-6">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}

      {error && errorMessages[error] ? (
        <div
          role="alert"
          className="rounded-control border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800"
        >
          {errorMessages[error]}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-extrabold">Ürün adı</span>
          <input
            name="name"
            required
            defaultValue={product?.name ?? ""}
            placeholder="Örn. Krom Balon Seti"
            className="min-h-12 w-full rounded-control border border-border bg-white px-4 outline-none transition focus:border-primary"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-extrabold">URL adı</span>
          <input
            name="slug"
            defaultValue={product?.slug ?? ""}
            placeholder="Boş bırakırsanız otomatik oluşturulur"
            spellCheck={false}
            className="min-h-12 w-full rounded-control border border-border bg-white px-4 font-mono text-sm outline-none transition focus:border-primary"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-extrabold">Yayın durumu</span>
          <select
            name="status"
            defaultValue={product?.status ?? "draft"}
            className="min-h-12 w-full rounded-control border border-border bg-white px-4 outline-none transition focus:border-primary"
          >
            <option value="draft">Taslak</option>
            <option value="published">Yayında</option>
            <option value="archived">Arşiv</option>
          </select>
        </label>

        <fieldset className="md:col-span-2">
          <legend className="text-sm font-extrabold">Kategoriler</legend>
          <p className="mt-2 text-xs leading-5 text-muted">
            Ürünü bir veya birden fazla kategoriye bağlayabilirsiniz.
            Kategoriler ana → alt → üçüncü seviye düzeninde gösterilir.
          </p>

          <div className="mt-3 max-h-80 overflow-y-auto rounded-control border border-border bg-white p-2">
            {categories.length > 0 ? (
              <div className="space-y-1">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex cursor-pointer items-start gap-3 rounded-control px-3 py-2.5 transition hover:bg-surface-muted"
                    style={{
                      paddingLeft: `${0.75 + (category.level - 1) * 1.25}rem`,
                    }}
                  >
                    <input
                      name="categoryIds"
                      value={category.id}
                      type="checkbox"
                      defaultChecked={selected.has(category.id)}
                      className="mt-0.5 size-4 shrink-0 accent-[var(--color-primary)]"
                    />
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-extrabold">
                          {category.name}
                        </span>
                        <span className="rounded-pill bg-surface-muted px-2 py-0.5 text-[0.65rem] font-bold text-muted">
                          {levelLabels[category.level]}
                        </span>
                      </span>
                      {category.level > 1 ? (
                        <span className="mt-0.5 block text-xs text-muted">
                          {category.path}
                        </span>
                      ) : null}
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="p-3 text-sm leading-6 text-muted">
                Henüz kategori yok. Ürünü kategorisiz kaydedebilir ve daha
                sonra kategori ekleyebilirsiniz.
              </p>
            )}
          </div>
        </fieldset>

        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-extrabold">Kısa açıklama</span>
          <input
            name="shortDescription"
            defaultValue={product?.short_description ?? ""}
            placeholder="Kartlarda gösterilecek kısa ürün özeti"
            className="min-h-12 w-full rounded-control border border-border bg-white px-4 outline-none transition focus:border-primary"
          />
        </label>

        <RichTextEditor
          name="descriptionRich"
          initialValue={product?.description_rich ?? null}
          initialText={product?.description ?? ""}
          label="Açıklama"
          placeholder="Ürün detaylarını biçimlendirebilir; başlık, kalın/italik metin ve listeler kullanabilirsiniz."
        />

        <label className="block">
          <span className="mb-2 block text-sm font-extrabold">Renkler</span>
          <input
            name="colors"
            defaultValue={product?.colors.join(", ") ?? ""}
            placeholder="Altın, Gümüş, Rose Gold"
            className="min-h-12 w-full rounded-control border border-border bg-white px-4 outline-none transition focus:border-primary"
          />
          <span className="mt-2 block text-xs leading-5 text-muted">
            Virgülle ayırın.
          </span>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-extrabold">Ölçü / ebat</span>
          <input
            name="dimensions"
            defaultValue={product?.dimensions ?? ""}
            placeholder="Örn. 30 cm"
            className="min-h-12 w-full rounded-control border border-border bg-white px-4 outline-none transition focus:border-primary"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-extrabold">Sıralama</span>
          <input
            name="sortOrder"
            type="number"
            min="0"
            step="1"
            defaultValue={product?.sort_order ?? 0}
            className="min-h-12 w-full rounded-control border border-border bg-white px-4 outline-none transition focus:border-primary"
          />
        </label>

        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-extrabold">
            WhatsApp mesajı
          </span>
          <input
            name="whatsappMessage"
            defaultValue={product?.whatsapp_message ?? ""}
            placeholder="Boşsa varsayılan ürün mesajı kullanılabilir."
            className="min-h-12 w-full rounded-control border border-border bg-white px-4 outline-none transition focus:border-primary"
          />
        </label>

        <label className="flex items-center gap-3 rounded-control border border-border bg-surface-muted p-4">
          <input
            name="featured"
            type="checkbox"
            defaultChecked={product?.featured ?? false}
            className="size-4 accent-[var(--color-primary)]"
          />
          <span className="text-sm font-extrabold">Öne çıkan ürün</span>
        </label>

        <label className="flex items-center gap-3 rounded-control border border-border bg-surface-muted p-4">
          <input
            name="newArrival"
            type="checkbox"
            defaultChecked={product?.new_arrival ?? false}
            className="size-4 accent-[var(--color-primary)]"
          />
          <span className="text-sm font-extrabold">Yeni ürün</span>
        </label>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-border pt-6">
        <button
          type="submit"
          className="min-h-11 rounded-control bg-primary px-5 font-extrabold text-white shadow-soft transition hover:bg-primary-hover"
        >
          {submitLabel}
        </button>
        <Link
          href="/admin/urunler"
          className="inline-flex min-h-11 items-center rounded-control border border-border bg-white px-5 font-extrabold hover:bg-surface-muted"
        >
          Vazgeç
        </Link>
      </div>
    </form>
  );
}
