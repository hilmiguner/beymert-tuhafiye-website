import Link from "next/link";

import type { Tables } from "@/types/database";

type Concept = Tables<"concepts">;
type ProductOption = Pick<Tables<"products">, "id" | "name" | "status">;

type ConceptFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  concept?: Concept;
  products: ProductOption[];
  relatedProductIds?: string[];
  error?: string;
  submitLabel: string;
};

const errorMessages: Record<string, string> = {
  invalid: "Lütfen zorunlu alanları ve sıralama değerini kontrol edin.",
  slug: "Bu URL adı başka bir konsept tarafından kullanılıyor.",
  save: "Konsept kaydedilemedi. Lütfen tekrar deneyin.",
};

const statusLabels = {
  draft: "Taslak",
  published: "Yayında",
  archived: "Arşiv",
} as const;

export function ConceptForm({
  action,
  concept,
  products,
  relatedProductIds = [],
  error,
  submitLabel,
}: ConceptFormProps) {
  const selectedProducts = new Set(relatedProductIds);

  return (
    <form action={action} className="space-y-6">
      {concept ? <input type="hidden" name="id" value={concept.id} /> : null}

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
          <span className="mb-2 block text-sm font-extrabold">Konsept adı</span>
          <input
            name="name"
            required
            defaultValue={concept?.name ?? ""}
            placeholder="Örn. Unicorn Doğum Günü"
            className="min-h-12 w-full rounded-control border border-border bg-white px-4 outline-none transition focus:border-primary"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-extrabold">URL adı</span>
          <input
            name="slug"
            defaultValue={concept?.slug ?? ""}
            placeholder="Boş bırakırsanız otomatik oluşturulur"
            spellCheck={false}
            className="min-h-12 w-full rounded-control border border-border bg-white px-4 font-mono text-sm outline-none transition focus:border-primary"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-extrabold">Yayın durumu</span>
          <select
            name="status"
            defaultValue={concept?.status ?? "draft"}
            className="min-h-12 w-full rounded-control border border-border bg-white px-4 outline-none transition focus:border-primary"
          >
            <option value="draft">Taslak</option>
            <option value="published">Yayında</option>
            <option value="archived">Arşiv</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-extrabold">Sıralama</span>
          <input
            name="sortOrder"
            type="number"
            min="0"
            step="1"
            defaultValue={concept?.sort_order ?? 0}
            className="min-h-12 w-full rounded-control border border-border bg-white px-4 outline-none transition focus:border-primary"
          />
        </label>

        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-extrabold">Kısa açıklama</span>
          <input
            name="shortDescription"
            defaultValue={concept?.short_description ?? ""}
            placeholder="Kartlarda gösterilecek kısa konsept özeti"
            className="min-h-12 w-full rounded-control border border-border bg-white px-4 outline-none transition focus:border-primary"
          />
        </label>

        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-extrabold">Açıklama</span>
          <textarea
            name="description"
            rows={8}
            defaultValue={concept?.description ?? ""}
            placeholder="Konseptin atmosferini, kullanım alanlarını ve önerileri anlatın."
            className="w-full rounded-control border border-border bg-white px-4 py-3 leading-6 outline-none transition focus:border-primary"
          />
        </label>
      </div>

      <fieldset className="rounded-card border border-border p-5">
        <legend className="px-2 text-sm font-extrabold">İlgili ürünler</legend>
        <p className="mb-4 text-xs leading-5 text-muted">
          Konsept detayında önerilecek ürünleri seçin.
        </p>

        {products.length > 0 ? (
          <div className="grid max-h-72 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
            {products.map((product) => (
              <label
                key={product.id}
                className="flex items-center gap-3 rounded-control border border-border p-3"
              >
                <input
                  name="relatedProductIds"
                  type="checkbox"
                  value={product.id}
                  defaultChecked={selectedProducts.has(product.id)}
                  className="size-4 accent-[var(--color-primary)]"
                />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold">
                    {product.name}
                  </span>
                  <span className="text-xs text-muted">
                    {statusLabels[product.status]}
                  </span>
                </span>
              </label>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">
            Henüz ürün bulunmuyor. Ürünler oluşturulduğunda buradan bağlanabilir.
          </p>
        )}
      </fieldset>

      <div className="flex flex-wrap gap-3 border-t border-border pt-6">
        <button
          type="submit"
          className="min-h-11 rounded-control bg-primary px-5 font-extrabold text-white shadow-soft transition hover:bg-primary-hover"
        >
          {submitLabel}
        </button>
        <Link
          href="/admin/konseptler"
          className="inline-flex min-h-11 items-center rounded-control border border-border bg-white px-5 font-extrabold hover:bg-surface-muted"
        >
          Vazgeç
        </Link>
      </div>
    </form>
  );
}
