"use client";

import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";

import { createClient } from "@/lib/supabase/client";

export type ConceptMediaItem = {
  mediaId: string;
  storagePath: string;
  altText: string;
  sortOrder: number;
  isCover: boolean;
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

export function ConceptMediaManager({
  conceptId,
  conceptName,
  initialItems,
}: {
  conceptId: string;
  conceptName: string;
  initialItems: ConceptMediaItem[];
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState(
    [...initialItems].sort((a, b) => a.sortOrder - b.sortOrder),
  );
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const supabase = useMemo(() => createClient(), []);

  function publicUrl(path: string) {
    return supabase.storage.from("cms-media").getPublicUrl(path).data.publicUrl;
  }

  async function uploadFiles(files: FileList | null) {
    if (!files?.length) return;

    const selected = Array.from(files);
    const invalid = selected.find(
      (file) => !allowedTypes.has(file.type) || file.size > maxFileSize,
    );

    if (invalid) {
      setMessage(
        "Yalnızca JPEG, PNG, WebP veya AVIF yükleyin. Her dosya en fazla 8 MB olabilir.",
      );
      return;
    }

    setBusy(true);
    setMessage(null);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("Oturum doğrulanamadı.");
      }

      let nextOrder =
        items.reduce((max, item) => Math.max(max, item.sortOrder), -1) + 1;
      let shouldSetCover = items.length === 0;
      const uploadedItems: ConceptMediaItem[] = [];

      for (const [index, file] of selected.entries()) {
        const path =
          "concepts/" +
          conceptId +
          "/" +
          crypto.randomUUID() +
          "." +
          extensionFor(file);
        const altText =
          selected.length === 1
            ? conceptName + " görseli"
            : conceptName + " görseli " + (index + 1);

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
            created_by: user.id,
          })
          .select("id")
          .single();

        if (assetError || !asset) {
          await supabase.storage.from("cms-media").remove([path]);
          throw assetError ?? new Error("Medya kaydı oluşturulamadı.");
        }

        const { error: relationError } = await supabase
          .from("concept_media")
          .insert({
            concept_id: conceptId,
            media_id: asset.id,
            sort_order: nextOrder,
            is_cover: false,
          });

        if (relationError) {
          await supabase.from("media_assets").delete().eq("id", asset.id);
          await supabase.storage.from("cms-media").remove([path]);
          throw relationError;
        }

        if (shouldSetCover) {
          const { error: coverError } = await supabase.rpc("set_concept_cover", {
            p_concept_id: conceptId,
            p_media_id: asset.id,
          });

          if (coverError) {
            await supabase.from("media_assets").delete().eq("id", asset.id);
            await supabase.storage.from("cms-media").remove([path]);
            throw coverError;
          }
        }

        uploadedItems.push({
          mediaId: asset.id,
          storagePath: path,
          altText,
          sortOrder: nextOrder,
          isCover: shouldSetCover,
        });

        nextOrder += 1;
        shouldSetCover = false;
      }

      setItems((current) =>
        [...current, ...uploadedItems].sort(
          (a, b) => a.sortOrder - b.sortOrder,
        ),
      );
      setMessage("Fotoğraflar yüklendi.");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Fotoğraflar yüklenemedi.",
      );
    } finally {
      if (inputRef.current) inputRef.current.value = "";
      setBusy(false);
    }
  }

  async function persistOrder(nextItems: ConceptMediaItem[]) {
    const rows = nextItems.map((item, index) => ({
      concept_id: conceptId,
      media_id: item.mediaId,
      sort_order: index,
      is_cover: item.isCover,
    }));

    const { error } = await supabase.from("concept_media").upsert(rows);
    if (error) throw error;

    setItems(nextItems.map((item, index) => ({ ...item, sortOrder: index })));
    router.refresh();
  }

  async function move(mediaId: string, direction: -1 | 1) {
    const currentIndex = items.findIndex((item) => item.mediaId === mediaId);
    const targetIndex = currentIndex + direction;
    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= items.length) {
      return;
    }

    setBusy(true);
    setMessage(null);

    try {
      const next = [...items];
      [next[currentIndex], next[targetIndex]] = [
        next[targetIndex],
        next[currentIndex],
      ];
      await persistOrder(next);
    } catch {
      setMessage("Fotoğraf sırası güncellenemedi.");
    } finally {
      setBusy(false);
    }
  }

  async function setCover(mediaId: string) {
    setBusy(true);
    setMessage(null);

    try {
      const { error } = await supabase.rpc("set_concept_cover", {
        p_concept_id: conceptId,
        p_media_id: mediaId,
      });
      if (error) throw error;

      setItems((current) =>
        current.map((item) => ({
          ...item,
          isCover: item.mediaId === mediaId,
        })),
      );
      router.refresh();
    } catch {
      setMessage("Kapak fotoğrafı değiştirilemedi.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(item: ConceptMediaItem) {
    if (
      !window.confirm(
        "Bu fotoğrafı konseptten kalıcı olarak silmek istiyor musunuz?",
      )
    ) {
      return;
    }

    setBusy(true);
    setMessage(null);

    try {
      const remaining = items.filter(
        (candidate) => candidate.mediaId !== item.mediaId,
      );

      if (item.isCover && remaining.length > 0) {
        const { error: coverError } = await supabase.rpc("set_concept_cover", {
          p_concept_id: conceptId,
          p_media_id: remaining[0].mediaId,
        });
        if (coverError) throw coverError;
      }

      const { error: deleteError } = await supabase
        .from("media_assets")
        .delete()
        .eq("id", item.mediaId);
      if (deleteError) throw deleteError;

      await supabase.storage.from("cms-media").remove([item.storagePath]);

      const normalized = remaining.map((candidate, index) => ({
        ...candidate,
        isCover:
          item.isCover && remaining.length > 0
            ? candidate.mediaId === remaining[0].mediaId
            : candidate.isCover,
        sortOrder: index,
      }));

      if (normalized.length > 0) {
        await persistOrder(normalized);
      } else {
        setItems([]);
        router.refresh();
      }

      setMessage("Fotoğraf silindi.");
    } catch {
      setMessage("Fotoğraf silinemedi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-extrabold">Konsept fotoğrafları</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Birden fazla fotoğraf yükleyebilir, sırasını değiştirebilir ve kapak
            görselini seçebilirsiniz.
          </p>
        </div>

        <label className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-control border border-border bg-white px-5 font-extrabold transition hover:bg-surface-muted">
          {busy ? "İşleniyor…" : "+ Fotoğraf Yükle"}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            disabled={busy}
            onChange={(event) => void uploadFiles(event.target.files)}
            className="sr-only"
          />
        </label>
      </div>

      {message ? (
        <div className="mt-4 rounded-control bg-surface-muted p-3 text-sm font-semibold text-muted">
          {message}
        </div>
      ) : null}

      {items.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item, index) => (
            <article
              key={item.mediaId}
              className="overflow-hidden rounded-card border border-border bg-white"
            >
              <div
                role="img"
                aria-label={item.altText}
                className="aspect-[4/3] bg-cover bg-center"
                style={{
                  backgroundImage: 'url("' + publicUrl(item.storagePath) + '")',
                }}
              />
              <div className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-extrabold text-muted">
                    Fotoğraf {index + 1}
                  </span>
                  {item.isCover ? (
                    <span className="rounded-pill bg-primary px-2.5 py-1 text-[0.65rem] font-extrabold text-white">
                      Kapak
                    </span>
                  ) : null}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={busy || index === 0}
                    onClick={() => void move(item.mediaId, -1)}
                    className="rounded-control border border-border px-3 py-2 text-xs font-extrabold disabled:opacity-40"
                  >
                    ← Önce
                  </button>
                  <button
                    type="button"
                    disabled={busy || index === items.length - 1}
                    onClick={() => void move(item.mediaId, 1)}
                    className="rounded-control border border-border px-3 py-2 text-xs font-extrabold disabled:opacity-40"
                  >
                    Sonra →
                  </button>
                  {!item.isCover ? (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void setCover(item.mediaId)}
                      className="rounded-control border border-border px-3 py-2 text-xs font-extrabold text-primary disabled:opacity-40"
                    >
                      Kapak Yap
                    </button>
                  ) : null}
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void remove(item)}
                    className="rounded-control border border-red-200 px-3 py-2 text-xs font-extrabold text-red-700 disabled:opacity-40"
                  >
                    Sil
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-card border border-dashed border-border bg-surface-muted p-8 text-center">
          <p className="font-extrabold">Henüz konsept fotoğrafı yok.</p>
          <p className="mt-2 text-sm text-muted">
            İlk yüklenen fotoğraf otomatik olarak kapak görseli olur.
          </p>
        </div>
      )}
    </div>
  );
}
