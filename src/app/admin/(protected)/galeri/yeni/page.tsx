import { GalleryEditor } from "@/components/admin/gallery-editor";
import { createClient } from "@/lib/supabase/server";

export default async function NewGalleryItemPage() {
  const supabase = await createClient();

  const [{ data: categories }, { data: concepts }] = await Promise.all([
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

  return (
    <section>
      <div className="rounded-[2rem] border border-border bg-white p-6 shadow-soft sm:p-8">
        <p className="bt-eyebrow text-primary">Galeri</p>
        <h1 className="bt-display mt-2 text-4xl font-semibold">
          Yeni galeri öğesi
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Görseli, açıklamayı ve isteğe bağlı kategori/konsept ilişkisini tek adımda kaydedin.
        </p>

        <div className="mt-8 border-t border-border pt-8">
          <GalleryEditor
            categories={categories ?? []}
            concepts={concepts ?? []}
          />
        </div>
      </div>
    </section>
  );
}
