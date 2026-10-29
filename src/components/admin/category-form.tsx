"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type {
  AdminCategoryOption,
  CategoryLevel,
} from "@/lib/category-hierarchy";
import type { Tables } from "@/types/database";

type Category = Tables<"categories">;

type CategoryFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  category?: Category;
  parentOptions: AdminCategoryOption[];
  currentLevel?: CategoryLevel;
  error?: string;
  submitLabel: string;
};

const errorMessages: Record<string, string> = {
  invalid: "Lütfen zorunlu alanları, kategori seviyesini ve sıralama değerini kontrol edin.",
  hierarchy:
    "Kategori hiyerarşisi geçersiz. En fazla üç seviye kullanılabilir ve bir kategori kendi alt kategorisine bağlanamaz.",
  slug: "Bu URL adı başka bir kategori tarafından kullanılıyor.",
  save: "Kategori kaydedilemedi. Lütfen tekrar deneyin.",
};

const levelLabels: Record<CategoryLevel, string> = {
  1: "Ana kategori",
  2: "Alt kategori",
  3: "Üçüncü seviye kategori",
};

export function CategoryForm({
  action,
  category,
  parentOptions,
  currentLevel = 1,
  error,
  submitLabel,
}: CategoryFormProps) {
  const [level, setLevel] = useState<CategoryLevel>(currentLevel);
  const [parentId, setParentId] = useState(category?.parent_id ?? "");

  const validParents = useMemo(
    () =>
      level === 1
        ? []
        : parentOptions.filter((option) => option.level === level - 1),
    [level, parentOptions],
  );

  const handleLevelChange = (value: string) => {
    const nextLevel = Number(value) as CategoryLevel;
    setLevel(nextLevel);

    if (
      nextLevel === 1 ||
      !parentOptions.some(
        (option) =>
          option.id === parentId && option.level === nextLevel - 1,
      )
    ) {
      setParentId("");
    }
  };

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
            placeholder="Örn. Lateks Balonlar"
            className="min-h-12 w-full rounded-control border border-border bg-white px-4 outline-none transition focus:border-primary"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-extrabold">
            Kategori seviyesi
          </span>
          <select
            name="level"
            value={level}
            onChange={(event) => handleLevelChange(event.target.value)}
            className="min-h-12 w-full rounded-control border border-border bg-white px-4 outline-none transition focus:border-primary"
          >
            <option value={1}>{levelLabels[1]}</option>
            <option value={2}>{levelLabels[2]}</option>
            <option value={3}>{levelLabels[3]}</option>
          </select>
          <span className="mt-2 block text-xs leading-5 text-muted">
            Ana kategori bağımsızdır. Alt ve üçüncü seviye kategoriler bir üst
            kategoriye bağlanır.
          </span>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-extrabold">
            Üst kategori
          </span>
          <select
            name="parentId"
            value={parentId}
            onChange={(event) => setParentId(event.target.value)}
            disabled={level === 1}
            required={level > 1}
            className="min-h-12 w-full rounded-control border border-border bg-white px-4 outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-muted"
          >
            <option value="">
              {level === 1 ? "Üst kategori yok" : "Üst kategori seçin"}
            </option>
            {validParents.map((option) => (
              <option key={option.id} value={option.id}>
                {option.path}
              </option>
            ))}
          </select>
          {level > 1 && validParents.length === 0 ? (
            <span className="mt-2 block text-xs font-semibold leading-5 text-amber-700">
              Bu seviye için uygun bir üst kategori bulunmuyor. Önce bir üst
              seviyeyi oluşturun.
            </span>
          ) : null}
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
            Örnek: lateks-balonlar
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
