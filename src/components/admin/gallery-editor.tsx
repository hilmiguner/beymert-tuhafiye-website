"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import type { Database, Tables } from "@/types/database";

type GalleryItem = Tables<"gallery_items">;
type ContentStatus = Database["public"]["Enums"]["cms_content_status"];

type Option = {
  id: string;
  name: string;
};

type GalleryEditorProps = {
  item?: GalleryItem;
  media?: {
    id: string;
    storagePath: string;
    altText: string;
  };
  categories: Option[];
  concepts: Option[];
};

const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const maxFileSize = 8 * 1024 * 1024;

function extensionFor(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]+$/.test(fromName)) return fromName;

  return (
    {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/avif": "avif",
    }[file.type] ?? "bin"
  );
}

export function GalleryEditor({
  item,
  media,
  categories,
  concepts,
}: GalleryEditorProps) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const previewObjectUrlRef = useRef<string | null>(null);
  const supabase = useMemo(() => createClient(), []);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [previewPath, setPreviewPath] = useState(media?.storagePath ?? null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current);
      }
    };
  }, []);

  function updateLocalPreview(file?: File) {
    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current);
      previewObjectUrlRef.current = null;
    }

    if (!file) {
      setLocalPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    previewObjectUrlRef.current = objectUrl;
    setLocalPreviewUrl(objectUrl);
    setMessage(null);
  }

  function clearLocalPreview() {
    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current);
      previewObjectUrlRef.current = null;
    }

    setLocalPreviewUrl(null);
  }

  function publicUrl(path: string) {
    return supabase.storage.from("cms-media").getPublicUrl(path).data.publicUrl;
  }

  async function mediaIsUnused(mediaId: string) {
    const [
      { count: productUse },
      { count: conceptUse },
      { count: galleryUse },
      { count: categoryCoverUse },
      { count: conceptCoverUse },
    ] = await Promise.all([
      supabase
        .from("product_media")
        .select("*", { count: "exact", head: true })
        .eq("media_id", mediaId),
      supabase
        .from("concept_media")
        .select("*", { count: "exact", head: true })
        .eq("media_id", mediaId),
      supabase
        .from("gallery_items")
        .select("*", { count: "exact", head: true })
        .eq("media_id", mediaId),
      supabase
        .from("categories")
        .select("*", { count: "exact", head: true })
        .eq("cover_media_id", mediaId),
      supabase
        .from("concepts")
        .select("*", { count: "exact", head: true })
        .eq("cover_media_id", mediaId),
    ]);

    return (
      (productUse ?? 0) === 0 &&
      (conceptUse ?? 0) === 0 &&
      (galleryUse ?? 0) === 0 &&
      (categoryCoverUse ?? 0) === 0 &&
      (conceptCoverUse ?? 0) === 0
    );
  }

  async function cleanupMedia(mediaId: string, storagePath: string) {
    if (!(await mediaIsUnused(mediaId))) return;

    const { error: metadataError } = await supabase
      .from("media_assets")
      .delete()
      .eq("id", mediaId);

    if (!metadataError) {
      await supabase.storage.from("cms-media").remove([storagePath]);
    }
  }

  async function uploadMedia(file: File, altText: string, userId: string) {
    const path =
      "gallery/" +
      crypto.randomUUID() +
      "." +
      extensionFor(file);

    const { error: uploadError } = await supabase.storage
      .from("cms-media")
      .upload(path, file, {
        cacheControl: "31536000",
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data: asset, error: assetError } = await supabase
      .from("media_assets")
      .insert({
        storage_path: path,
        alt_text: altText,
        mime_type: file.type,
        created_by: userId,
      })
      .select("id")
      .single();

    if (assetError || !asset) {
      await supabase.storage.from("cms-media").remove([path]);
      throw assetError ?? new Error("Medya kaydı oluşturulamadı.");
    }

    return {
      id: asset.id,
      storagePath: path,
    };
  }

  async function onSubmit(formData: FormData) {
    setBusy(true);
    setMessage(null);

    let uploaded:
      | {
          id: string;
          storagePath: string;
        }
      | undefined;

    try {
      const title = String(formData.get("title") ?? "").trim();
      const description = String(formData.get("description") ?? "").trim();
      const categoryId =
        String(formData.get("categoryId") ?? "").trim() || null;
      const conceptId =
        String(formData.get("conceptId") ?? "").trim() || null;
      const status = String(formData.get("status") ?? "draft") as ContentStatus;
      const sortOrder = Number(formData.get("sortOrder") ?? 0);
      const altText =
        String(formData.get("altText") ?? "").trim() ||
        title ||
        "Beymert galeri görseli";
      const selectedFile = fileRef.current?.files?.[0];

      if (
        !["draft", "published", "archived"].includes(status) ||
        !Number.isInteger(sortOrder) ||
        sortOrder < 0
      ) {
        throw new Error("Lütfen form alanlarını kontrol edin.");
      }

      if (!item && !selectedFile) {
        throw new Error("Yeni galeri öğesi için bir görsel seçin.");
      }

      if (
        selectedFile &&
        (!allowedTypes.has(selectedFile.type) ||
          selectedFile.size > maxFileSize)
      ) {
        throw new Error(
          "Yalnızca JPEG, PNG, WebP veya AVIF yükleyin. Dosya en fazla 8 MB olabilir.",
        );
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("Oturum doğrulanamadı.");
      }

      if (selectedFile) {
        uploaded = await uploadMedia(selectedFile, altText, user.id);
      } else if (media) {
        const { error: altError } = await supabase
          .from("media_assets")
          .update({ alt_text: altText })
          .eq("id", media.id);

        if (altError) throw altError;
      }

      const nextMediaId = uploaded?.id ?? media?.id;

      if (!nextMediaId) {
        throw new Error("Galeri görseli bulunamadı.");
      }

      const nextPublishedAt =
        status === "published"
          ? item?.published_at ?? new Date().toISOString()
          : null;

      if (item) {
        const { error } = await supabase
          .from("gallery_items")
          .update({
            title,
            description,
            category_id: categoryId,
            concept_id: conceptId,
            media_id: nextMediaId,
            status,
            sort_order: sortOrder,
            published_at: nextPublishedAt,
          })
          .eq("id", item.id);

        if (error) throw error;

        if (
          uploaded &&
          media &&
          uploaded.id !== media.id
        ) {
          await cleanupMedia(media.id, media.storagePath);
        }

        setPreviewPath(uploaded?.storagePath ?? media?.storagePath ?? null);
        clearLocalPreview();
        if (fileRef.current) fileRef.current.value = "";
        setMessage("Galeri öğesi güncellendi.");
        router.refresh();
      } else {
        const { data: created, error } = await supabase
          .from("gallery_items")
          .insert({
            title,
            description,
            category_id: categoryId,
            concept_id: conceptId,
            media_id: nextMediaId,
            status,
            sort_order: sortOrder,
            published_at: nextPublishedAt,
          })
          .select("id")
          .single();

        if (error || !created) {
          throw error ?? new Error("Galeri öğesi oluşturulamadı.");
        }

        router.push("/admin/galeri/" + created.id + "?success=created");
        router.refresh();
      }
    } catch (error) {
      if (uploaded) {
        await supabase.from("media_assets").delete().eq("id", uploaded.id);
        await supabase.storage
          .from("cms-media")
          .remove([uploaded.storagePath]);
      }

      setMessage(
        error instanceof Error
          ? error.message
          : "Galeri öğesi kaydedilemedi.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <form action={(formData) => void onSubmit(formData)} className="space-y-6">
      {message ? (
        <div
          role="status"
          className="rounded-control bg-surface-muted p-4 text-sm font-semibold text-muted"
        >
          {message}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-extrabold">Başlık</span>
            <input
              name="title"
              defaultValue={item?.title ?? ""}
              placeholder="Örn. Pastel doğum günü masası"
              className="min-h-12 w-full rounded-control border border-border bg-white px-4 outline-none transition focus:border-primary"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-extrabold">Açıklama</span>
            <textarea
              name="description"
              rows={6}
              defaultValue={item?.description ?? ""}
              placeholder="Görseli ve kurulumu kısaca anlatın."
              className="w-full rounded-control border border-border bg-white px-4 py-3 leading-6 outline-none transition focus:border-primary"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-extrabold">Kategori</span>
            <select
              name="categoryId"
              defaultValue={item?.category_id ?? ""}
              className="min-h-12 w-full rounded-control border border-border bg-white px-4 outline-none transition focus:border-primary"
            >
              <option value="">Kategori yok</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-extrabold">Konsept</span>
            <select
              name="conceptId"
              defaultValue={item?.concept_id ?? ""}
              className="min-h-12 w-full rounded-control border border-border bg-white px-4 outline-none transition focus:border-primary"
            >
              <option value="">Konsept yok</option>
              {concepts.map((concept) => (
                <option key={concept.id} value={concept.id}>
                  {concept.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-extrabold">Yayın durumu</span>
            <select
              name="status"
              defaultValue={item?.status ?? "draft"}
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
              defaultValue={item?.sort_order ?? 0}
              className="min-h-12 w-full rounded-control border border-border bg-white px-4 outline-none transition focus:border-primary"
            />
          </label>

          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-extrabold">
              Görsel alt metni
            </span>
            <input
              name="altText"
              defaultValue={media?.altText ?? ""}
              placeholder="Erişilebilirlik için görseli kısaca tarif edin."
              className="min-h-12 w-full rounded-control border border-border bg-white px-4 outline-none transition focus:border-primary"
            />
          </label>
        </div>

        <div>
          <p className="mb-2 text-sm font-extrabold">Galeri görseli</p>
          <div className="overflow-hidden rounded-card border border-border bg-surface-muted">
            {localPreviewUrl || previewPath ? (
              <div
                role="img"
                aria-label={media?.altText ?? item?.title ?? "Galeri görseli"}
                className="aspect-[4/3] bg-cover bg-center"
                style={{
                  backgroundImage:
                    'url("' +
                    (localPreviewUrl ??
                      (previewPath ? publicUrl(previewPath) : "")) +
                    '")',
                }}
              />
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center p-6 text-center text-sm font-semibold text-muted">
                Henüz görsel seçilmedi.
              </div>
            )}
          </div>

          <label className="mt-3 flex min-h-11 cursor-pointer items-center justify-center rounded-control border border-border bg-white px-4 text-sm font-extrabold transition hover:bg-surface-muted">
            {item ? "Görseli Değiştir" : "Görsel Seç"}
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={(event) =>
                updateLocalPreview(event.target.files?.[0])
              }
              className="sr-only"
            />
          </label>
          <p className="mt-2 text-xs leading-5 text-muted">
            JPEG, PNG, WebP veya AVIF · en fazla 8 MB
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-border pt-6">
        <button
          type="submit"
          disabled={busy}
          className="min-h-11 rounded-control bg-primary px-5 font-extrabold text-white shadow-soft transition hover:bg-primary-hover disabled:opacity-50"
        >
          {busy
            ? "Kaydediliyor…"
            : item
              ? "Değişiklikleri Kaydet"
              : "Galeri Öğesi Oluştur"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/galeri")}
          className="min-h-11 rounded-control border border-border bg-white px-5 font-extrabold hover:bg-surface-muted"
        >
          Vazgeç
        </button>
      </div>
    </form>
  );
}
