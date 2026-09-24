import Link from "next/link";

import type { Tables } from "@/types/database";

type Category = Tables<"categories">;

type CategoryFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  category?: Category;
  error?: string;
  submitLabel: string;
};

const errorMessages: Record<string, string> = {
  invalid: "Lütfen zorunlu alanları ve sıralama değerini kontrol edin.",
  slug: "Bu URL adı başka bir kategori tarafından kullanılıyor.",
  save: "Kategori kaydedilemedi. Lütfen tekrar deneyin.",
};

export function CategoryForm({
  action,
  category,
  error,
  submitLabel,
}: CategoryFormProps) {
  return (
    <form action={action} className="space-y-6">
      {category ? <input type="hidden" name="id" value={category.id} /> : null}

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
          <span className="mb-2 block text-sm font-extrabold">Kategori adı</span>
          <input
            name="name"
            required
            defaultValue={category?.name ?? ""}
            placeholder="Örn. Balonlar"
            className="min-h-12 w-full rounded-control border border-border bg-white px-4 outline-none transition focus:border-primary"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-extrabold">URL adı</span>
          <input
            name="slug"
            defaultValue={category?.slug ?? ""}
            placeholder="Boş bırakırsanız otomatik oluşturulur"
            spellCheck={false}
            className="min-h-12 w-full rounded-control border border-border bg-white px-4 font-mono text-sm outline-none transition focus:border-primary"
          />
          <span className="mt-2 block text-xs leading-5 text-muted">
            Örnek: balonlar-ve-suslemeler
          </span>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-extrabold">Yayın durumu</span>
          <select
            name="status"
            defaultValue={category?.status ?? "draft"}
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
            defaultValue={category?.sort_order ?? 0}
            className="min-h-12 w-full rounded-control border border-border bg-white px-4 outline-none transition focus:border-primary"
          />
        </label>

        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-extrabold">Açıklama</span>
          <textarea
            name="description"
            rows={6}
            defaultValue={category?.description ?? ""}
            placeholder="Bu kategoride hangi ürünlerin bulunduğunu kısa ve anlaşılır biçimde anlatın."
            className="w-full rounded-control border border-border bg-white px-4 py-3 leading-6 outline-none transition focus:border-primary"
          />
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
          href="/admin/kategoriler"
          className="inline-flex min-h-11 items-center rounded-control border border-border bg-white px-5 font-extrabold hover:bg-surface-muted"
        >
          Vazgeç
        </Link>
      </div>
    </form>
  );
}
