import Link from "next/link";
import { notFound } from "next/navigation";

import { deleteGalleryItemAction } from "@/app/admin/(protected)/galeri/actions";
import { GalleryEditor } from "@/components/admin/gallery-editor";
import { createClient } from "@/lib/supabase/server";

const successMessages: Record<string, string> = {
  created: "Galeri öğesi oluşturuldu.",
};

export default async function EditGalleryItemPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const { id } = await params;
  const { success, error } = await searchParams;
  const supabase = await createClient();

  const [
    { data: item, error: itemError },
    { data: categories },
    { data: concepts },
  ] = await Promise.all([
    supabase
      .from("gallery_items")
      .select("*, media_assets(id, storage_path, alt_text)")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("categories")
      .select("id, name")
      .order("sort_order")
      .order("name"),
    supabase
      .from("concepts")
      .select("id, name")
      .order("sort_order")
      .order("name"),
  ]);

  if (itemError || !item || !item.media_assets) {
    notFound();
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-border bg-white p-6 shadow-soft sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="bt-eyebrow text-primary">Galeri</p>
            <h1 className="bt-display mt-2 text-4xl font-semibold">
              {item.title || "Başlıksız galeri öğesi"}
            </h1>
          </div>
          <Link
            href={"/preview/galeri/" + item.id}
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

        {error ? (
          <div
            role="alert"
            className="mt-5 rounded-control border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800"
          >
            Galeri öğesi işlenirken bir hata oluştu.
          </div>
        ) : null}

        <div className="mt-8 border-t border-border pt-8">
          <GalleryEditor
            item={item}
            media={{
              id: item.media_assets.id,
              storagePath: item.media_assets.storage_path,
              altText: item.media_assets.alt_text,
            }}
            categories={categories ?? []}
            concepts={concepts ?? []}
          />
        </div>
      </div>

      <div className="rounded-card border border-red-200 bg-white p-6 shadow-soft">
        <h2 className="text-lg font-extrabold text-red-800">Tehlikeli alan</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Galeri öğesini silmek geri alınamaz. Görsel başka bir yerde
          kullanılmıyorsa medya kaydı ve Storage dosyası da temizlenir.
        </p>
        <form action={deleteGalleryItemAction} className="mt-4">
          <input type="hidden" name="id" value={item.id} />
          <button
            type="submit"
            className="min-h-11 rounded-control border border-red-300 bg-red-50 px-5 font-extrabold text-red-800 transition hover:bg-red-100"
          >
            Galeri Öğesini Sil
          </button>
        </form>
      </div>
    </section>
  );
}
