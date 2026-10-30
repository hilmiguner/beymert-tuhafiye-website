import Link from "next/link";
import { notFound } from "next/navigation";

import {
  deleteProductAction,
  updateProductAction,
} from "@/app/admin/(protected)/urunler/actions";
import {
  ProductColorVariantManager,
  type AdminProductVariant,
} from "@/components/admin/product-color-variant-manager";
import type {
  AdminColorOption,
  AdminSeriesOption,
} from "@/components/admin/product-color-selector";
import { ProductForm } from "@/components/admin/product-form";
import {
  ProductMediaManager,
  type ProductMediaItem,
} from "@/components/admin/product-media-manager";
import { buildAdminCategoryOptions } from "@/lib/category-hierarchy";
import { createClient } from "@/lib/supabase/server";

const successMessages: Record<string, string> = {
  created: "Ürün oluşturuldu. Şimdi fotoğraflarını ve renk seçeneklerini düzenleyebilirsiniz.",
  updated: "Ürün güncellendi.",
};

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { id } = await params;
  const { error, success } = await searchParams;
  const supabase = await createClient();

  const [
    { data: product, error: productError },
    { data: categories },
    { data: categoryRelations, error: categoryRelationsError },
    { data: colors },
    { data: series },
    { data: productColors },
    { data: productSeries },
    { data: variantRows },
    { data: mediaRelations, error: mediaError },
  ] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("categories")
      .select("id, name, parent_id, sort_order")
      .order("sort_order")
      .order("name"),
    supabase
      .from("product_categories")
      .select("category_id")
      .eq("product_id", id),
    supabase
      .from("colors")
      .select("id, name, hex, group_key, sort_order")
      .eq("is_active", true)
      .order("sort_order")
      .order("name"),
    supabase
      .from("color_series")
      .select("id, name, slug, sort_order")
      .eq("is_active", true)
      .order("sort_order"),
    supabase
      .from("product_colors")
      .select("color_id, sort_order")
      .eq("product_id", id)
      .order("sort_order"),
    supabase
      .from("product_color_series")
      .select("series_id, sort_order")
      .eq("product_id", id)
      .order("sort_order"),
    supabase
      .from("product_color_variants")
      .select("color_id, series_id, media_id, sort_order")
      .eq("product_id", id)
      .order("sort_order"),
    supabase
      .from("product_media")
      .select(
        "media_id, caption, sort_order, is_cover, media_assets(id, storage_path, alt_text)",
      )
      .eq("product_id", id)
      .order("sort_order"),
  ]);

  if (productError || !product) {
    notFound();
  }

  const categoryOptions = buildAdminCategoryOptions(categories ?? []);
  const selectedCategoryIds =
    !categoryRelationsError && (categoryRelations?.length ?? 0) > 0
      ? categoryRelations!.map((relation) => relation.category_id)
      : product.category_id
        ? [product.category_id]
        : [];

  const colorOptions: AdminColorOption[] = (colors ?? []).map((color) => ({
    id: color.id,
    name: color.name,
    hex: color.hex,
    groupKey: color.group_key as AdminColorOption["groupKey"],
  }));
  const seriesOptions: AdminSeriesOption[] = (series ?? []).map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
  }));

  const selectedColorIds = (productColors ?? []).map(
    (relation) => relation.color_id,
  );
  const selectedSeriesIds = (productSeries ?? []).map(
    (relation) => relation.series_id,
  );
  const colorById = new Map(colorOptions.map((color) => [color.id, color]));
  const seriesById = new Map(seriesOptions.map((item) => [item.id, item]));
  const selectedColors = selectedColorIds.flatMap((colorId) => {
    const color = colorById.get(colorId);
    return color ? [color] : [];
  });
  const selectedSeries = selectedSeriesIds.flatMap((seriesId) => {
    const item = seriesById.get(seriesId);
    return item ? [item] : [];
  });

  const mediaItems: ProductMediaItem[] = mediaError
    ? []
    : (mediaRelations ?? [])
        .filter((relation) => relation.media_assets)
        .map((relation) => ({
          mediaId: relation.media_id,
          storagePath: relation.media_assets!.storage_path,
          altText: relation.media_assets!.alt_text,
          caption: relation.caption,
          sortOrder: relation.sort_order,
          isCover: relation.is_cover,
        }));

  const initialVariants: AdminProductVariant[] = (variantRows ?? []).map(
    (variant) => ({
      colorId: variant.color_id,
      seriesId: variant.series_id,
      mediaId: variant.media_id,
      sortOrder: variant.sort_order,
    }),
  );

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-border bg-white p-6 shadow-soft sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="bt-eyebrow text-primary">Ürünler</p>
            <h1 className="bt-display mt-2 text-4xl font-semibold">
              {product.name}
            </h1>
            <p className="mt-2 font-mono text-xs text-muted">
              /urunler/{product.slug}
            </p>
          </div>
          <Link
            href={"/preview/urunler/" + product.id}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-control border border-border bg-white px-5 text-sm font-extrabold text-primary transition hover:bg-surface-muted"
          >
            Önizle ↗
          </Link>
        </div>

        {success && successMessages[success] ? (
          <div className="mt-5 rounded-control border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-900">
            {successMessages[success]}
          </div>
        ) : null}

        {categoryRelationsError ? (
          <div
            role="alert"
            className="mt-5 rounded-control border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900"
          >
            Çoklu kategori ilişkileri okunamadı. Mevcut ana kategori yedek
            olarak gösteriliyor.
          </div>
        ) : null}

        <div className="mt-8 border-t border-border pt-8">
          <ProductForm
            action={updateProductAction}
            product={product}
            categories={categoryOptions}
            selectedCategoryIds={selectedCategoryIds}
            colorOptions={colorOptions}
            seriesOptions={seriesOptions}
            selectedColorIds={selectedColorIds}
            selectedSeriesIds={selectedSeriesIds}
            error={error}
            submitLabel="Değişiklikleri Kaydet"
          />
        </div>
      </div>

      <div className="rounded-[2rem] border border-border bg-white p-6 shadow-soft sm:p-8">
        <ProductMediaManager
          productId={product.id}
          productName={product.name}
          initialItems={mediaItems}
        />
      </div>

      <div className="rounded-[2rem] border border-border bg-white p-6 shadow-soft sm:p-8">
        <ProductColorVariantManager
          productId={product.id}
          colors={selectedColors}
          series={selectedSeries}
          mediaItems={mediaItems}
          initialVariants={initialVariants}
        />
      </div>

      <div className="rounded-card border border-red-200 bg-white p-6 shadow-soft">
        <h2 className="text-lg font-extrabold text-red-800">Tehlikeli alan</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Ürünü silmek geri alınamaz. Ürün-kategori ve ürün-medya ilişkileri
          kaldırılır. Medya dosyalarını önce fotoğraf yöneticisinden silmeniz
          önerilir.
        </p>
        <form action={deleteProductAction} className="mt-4">
          <input type="hidden" name="id" value={product.id} />
          <button
            type="submit"
            className="min-h-11 rounded-control border border-red-300 bg-red-50 px-5 font-extrabold text-red-800 transition hover:bg-red-100"
          >
            Ürünü Sil
          </button>
        </form>
      </div>
    </section>
  );
}
