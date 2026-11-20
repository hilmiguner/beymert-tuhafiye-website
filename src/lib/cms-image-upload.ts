"use client";

import type { createClient } from "@/lib/supabase/client";
import { cmsImageStoragePaths } from "@/lib/cms-image-paths";

type Client = ReturnType<typeof createClient>;

const sizes = [
  { width: 640, quality: 0.84, suffix: ".cmsopt-640.webp" },
  { width: 1200, quality: 0.89, suffix: ".cmsopt-1200.webp" },
  { width: 2000, quality: 0.94, suffix: ".cmsopt.webp" },
] as const;

function originalExtension(file: File) {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext && /^(png|jpe?g|webp|avif)$/.test(ext)) return ext;
  const mimeExt: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
    "image/avif": "avif",
  };
  return mimeExt[file.type] ?? "bin";
}

async function encodeWebp(
  source: ImageBitmap,
  maxSide: number,
  quality: number,
): Promise<{ blob: Blob; width: number; height: number }> {
  const scale = Math.min(1, maxSide / Math.max(source.width, source.height));
  const width = Math.max(1, Math.round(source.width * scale));
  const height = Math.max(1, Math.round(source.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  try {
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) throw new Error("Canvas 2D is unavailable.");
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(source, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", quality),
    );
    if (!blob || blob.type !== "image/webp" || blob.size === 0) {
      throw new Error("This browser cannot encode WebP images.");
    }
    return { blob, width, height };
  } finally {
    canvas.width = 0;
    canvas.height = 0;
  }
}

type UploadPart = {
  path: string;
  data: Blob;
  mime: string;
};

async function prepareCmsPhoto(
  file: File,
  directory: string,
): Promise<{
  storagePath: string;
  parts: UploadPart[];
  width?: number;
  height?: number;
  preoptimized: boolean;
}> {
  const id = crypto.randomUUID();
  const fallbackPath = `${directory}/${id}.${originalExtension(file)}`;
  const fallback = {
    storagePath: fallbackPath,
    parts: [{ path: fallbackPath, data: file, mime: file.type }],
    preoptimized: false,
  };

  // A decoder/encoder is not universal (e.g. older mobile browsers).
  // Keep upload support intact instead of rejecting otherwise valid photos.
  if (typeof createImageBitmap !== "function" || typeof document === "undefined") {
    return fallback;
  }

  let image: ImageBitmap | undefined;
  try {
    image = await createImageBitmap(file, { imageOrientation: "from-image" });
    if (
      image.width < 1 ||
      image.height < 1 ||
      image.width * image.height > 36_000_000
    ) {
      return fallback;
    }

    const root = `${directory}/${id}`;
    const versions: UploadPart[] = [];
    let fullWidth = 0;
    let fullHeight = 0;

    for (const size of sizes) {
      const result = await encodeWebp(image, size.width, size.quality);
      const path = root + size.suffix;
      versions.push({ path, data: result.blob, mime: "image/webp" });
      if (size.width === 2000) {
        fullWidth = result.width;
        fullHeight = result.height;
      }
    }

    return {
      storagePath: root + ".cmsopt.webp",
      parts: versions,
      width: fullWidth,
      height: fullHeight,
      preoptimized: true,
    };
  } catch {
    // Avoid breaking uploads if a browser does not decode/encode a format.
    return fallback;
  } finally {
    image?.close();
  }
}

export async function uploadCmsPhoto(
  supabase: Client,
  file: File,
  directory: string,
): Promise<{
  storagePath: string;
  mimeType: string;
  width?: number;
  height?: number;
  preoptimized: boolean;
}> {
  const prepared = await prepareCmsPhoto(file, directory);
  const bucket = supabase.storage.from("cms-media");
  const uploaded: string[] = [];

  try {
    for (const part of prepared.parts) {
      const { error } = await bucket.upload(part.path, part.data, {
        cacheControl: "31536000",
        contentType: part.mime,
        upsert: false,
      });
      if (error) throw error;
      uploaded.push(part.path);
    }
  } catch (error) {
    if (uploaded.length) await bucket.remove(uploaded);
    throw error;
  }

  return {
    storagePath: prepared.storagePath,
    mimeType: prepared.preoptimized ? "image/webp" : file.type,
    width: prepared.width,
    height: prepared.height,
    preoptimized: prepared.preoptimized,
  };
}

export async function removeCmsPhoto(
  supabase: Client,
  storagePath: string,
) {
  return supabase.storage
    .from("cms-media")
    .remove(cmsImageStoragePaths(storagePath));
}
