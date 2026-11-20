import { LegacyPhotoOptimizer } from "@/components/admin/legacy-photo-optimizer";
import { requireCmsAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export default async function AdminImageOptimizationPage() {
  await requireCmsAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media_assets")
    .select("id, storage_path, mime_type")
    .order("created_at");

  const legacy = (data ?? []).filter(
    (asset) => !asset.storage_path.endsWith(".cmsopt.webp"),
  );

  return (
    <section className="space-y-6">
      <div>
        <p className="bt-eyebrow text-primary">Medya bakımı</p>
        <h1 className="bt-display mt-2 text-4xl font-semibold">
          Görsel Optimizasyonu
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
          Yeni yüklenen fotoğraflar artık önceden optimize ediliyor.
          Eski fotoğrafları ise yalnızca yöneticinin açık işlemiyle taşırız.
        </p>
      </div>
      {error ? (
        <p role="alert" className="rounded-control border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          Fotoğraf envanteri okunamadı. Verileri değiştirmeden işlemi durdurduk.
        </p>
      ) : (
        <LegacyPhotoOptimizer initialAssets={legacy} />
      )}
    </section>
  );
}
