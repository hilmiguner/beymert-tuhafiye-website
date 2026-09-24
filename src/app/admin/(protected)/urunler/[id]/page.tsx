import { notFound } from "next/navigation";

import {
  deleteProductAction,
  updateProductAction,
} from "@/app/admin/(protected)/urunler/actions";
import { ProductForm } from "@/components/admin/product-form";
import {
  ProductMediaManager,
  type ProductMediaItem,
} from "@/components/admin/product-media-manager";
import { createClient } from "@/lib/supabase/server";

const successMessages: Record<string, string> = {
  created: "Ürün oluşturuldu. Şimdi fotoğraflarını ekleyebilirsiniz.",
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
    { data: relations, error: mediaError },
  ] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("categories")
      .select("id, name")
      .order("sort_order")
      .order("name"),
    supabase
      .from("product_media")
      .select(
        "media_id, sort_order, is_cover, media_assets(id, storage_path, alt_text)",
      )
      .eq("product_id", id)
      .order("sort_order"),
  ]);

  if (productError || !product) {
    notFound();
  }

  const mediaItems: ProductMediaItem[] = mediaError
    ? []
    : (relations ?? [])
        .filter((relation) => relation.media_assets)
        .map((relation) => ({
          mediaId: relation.media_id,
          storagePath: relation.media_assets!.storage_path,
          altText: relation.media_assets!.alt_text,
          sortOrder: relation.sort_order,
          isCover: relation.is_cover,
        }));

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-border bg-white p-6 shadow-soft sm:p-8">
        <p className="bt-eyebrow text-primary">Ürünler</p>
        <h1 className="bt-display mt-2 text-4xl font-semibold">{product.name}</h1>
        <p className="mt-2 font-mono text-xs text-muted">
          /urunler/{product.slug}
        </p>

        {success && successMessages[success] ? (
          <div className="mt-5 rounded-control border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-900">
            {successMessages[success]}
          </div>
        ) : null}

        <div className="mt-8 border-t border-border pt-8">
          <ProductForm
            action={updateProductAction}
            product={product}
            categories={categories ?? []}
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

      <div className="rounded-card border border-red-200 bg-white p-6 shadow-soft">
        <h2 className="text-lg font-extrabold text-red-800">Tehlikeli alan</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Ürünü silmek geri alınamaz. Ürün-medya ilişkileri kaldırılır. Medya
          dosyalarını önce fotoğraf yöneticisinden silmeniz önerilir.
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
