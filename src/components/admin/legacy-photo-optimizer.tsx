"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { cmsImageStoragePaths } from "@/lib/cms-image-paths";
import { removeCmsPhoto, uploadCmsPhoto } from "@/lib/cms-image-upload";
import { createClient } from "@/lib/supabase/client";

export type LegacyPhoto = {
  id: string;
  storage_path: string;
  mime_type: string;
};

export function LegacyPhotoOptimizer({
  initialAssets,
}: {
  initialAssets: readonly LegacyPhoto[];
}) {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const [assets, setAssets] = useState([...initialAssets]);
  const [busy, setBusy] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [message, setMessage] = useState<string | null>(null);

  async function migrate(asset: LegacyPhoto): Promise<void> {
    const { data } = supabase.storage
      .from("cms-media")
      .getPublicUrl(asset.storage_path);

    const response = await fetch(data.publicUrl, { cache: "force-cache" });
    if (!response.ok) {
      throw new Error(`Kaynak görsel indirilemedi (${response.status}).`);
    }

    const blob = await response.blob();
    const file = new File([blob], asset.storage_path.split("/").pop() ?? "photo.png", {
      type: asset.mime_type || blob.type || "image/png",
    });
    const directory = asset.storage_path.split("/").slice(0, -1).join("/");
    const replacement = await uploadCmsPhoto(supabase, file, directory);

    if (!replacement.preoptimized) {
      await removeCmsPhoto(supabase, replacement.storagePath);
      throw new Error("Tarayıcı bu dosyayı WebP biçimine dönüştüremedi.");
    }

    const { data: updated, error } = await supabase
      .from("media_assets")
      .update({
        storage_path: replacement.storagePath,
        mime_type: replacement.mimeType,
        width: replacement.width ?? null,
        height: replacement.height ?? null,
      })
      .eq("id", asset.id)
      .eq("storage_path", asset.storage_path)
      .select("id");

    if (error || !updated || updated.length !== 1) {
      // Another editor may have changed this asset. Do not touch the original.
      await removeCmsPhoto(supabase, replacement.storagePath);
      throw error ?? new Error("Görsel bu arada değiştirildi; yeniden deneyin.");
    }

    // The original PNG/JPEG is deliberately retained as a rollback source.
    // Deleting historical files requires a separate reviewed, backed-up operation.
    setAssets((current) => current.filter((item) => item.id !== asset.id));
    setCompleted((current) => current + 1);
  }

  async function migrateBatch() {
    if (busy || assets.length === 0) return;
    setBusy(true);
    setMessage(null);

    let migrated = 0;
    try {
      for (const asset of assets.slice(0, 10)) {
        await migrate(asset);
        migrated += 1;
      }
      setMessage(`${migrated} görsel optimize edildi. Eski dosyalar yedek olarak korundu.`);
      router.refresh();
    } catch (error) {
      setMessage(
        `${migrated} görsel dönüştürüldü; işlem durduruldu. ${error instanceof Error ? error.message : "Bir hata oluştu."}`,
      );
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-card border border-border bg-white p-5 shadow-soft sm:p-6">
        <h2 className="text-xl font-extrabold">Eski fotoğrafları kontrollü optimize et</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
          Bu işlem otomatik başlamaz. Her tıklamada en fazla 10 eski fotoğraf
          tarayıcıda üç WebP boyutuna çevrilir, Supabase&apos;e yüklenir ve medya
          kaydı yeni dosyaya yönlendirilir. Fotoğraf açıklamaları, ürün/konsept
          ilişkileri, kapak ve renk eşleştirmeleri değişmez.
        </p>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
          Eski orijinal dosyalar silinmez; bu nedenle depolama tüketimi geçici
          olarak artar. Depolama kotasını kontrol etmeden toplu işlem yapmayın.
          İşlem sırasında sayfayı kapatmayın.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <button
            type="button"
            disabled={busy || assets.length === 0}
            onClick={() => void migrateBatch()}
            className="min-h-11 rounded-control bg-primary px-5 text-sm font-extrabold text-white disabled:opacity-40"
          >
            {busy ? "Görseller işleniyor…" : "Sonraki 10 görseli optimize et"}
          </button>
          <span className="text-sm font-semibold text-muted">
            Bu oturumda: {completed} tamamlandı · {assets.length} eski kayıt kaldı
          </span>
        </div>
        {message ? (
          <p role="status" className="mt-4 rounded-control bg-surface-muted p-4 text-sm font-semibold">
            {message}
          </p>
        ) : null}
      </div>

      <p className="text-xs leading-6 text-muted">
        Bu ekranda yalnızca eski PNG/JPEG/AVIF/WebP dosyaları listelenir.
        Yeni <code>.cmsopt.webp</code> dosyaları tekrardan dönüştürülmez.
        Önceden optimize edilmiş görsellerin türevleri:
        <code> {cmsImageStoragePaths("ornek.cmsopt.webp").join(", ")}</code>
      </p>
    </div>
  );
}
