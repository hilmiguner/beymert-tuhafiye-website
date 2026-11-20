import type { ImageLoaderProps } from "next/image";

const optimizedSuffix = ".cmsopt.webp";
const publicMediaSegment = "/storage/v1/object/public/cms-media/";

export function isPreoptimizedCmsImageUrl(src: string): boolean {
  try {
    const url = new URL(src);
    return (
      url.protocol === "https:" &&
      url.pathname.includes(publicMediaSegment) &&
      url.pathname.endsWith(optimizedSuffix)
    );
  } catch {
    return false;
  }
}

/**
 * A single immutable source path maps to two additional, pre-rendered WebP sizes.
 * The loader only runs for CMS files that were uploaded with this naming scheme.
 * It NEVER creates /_next/image requests or calls a transformation service.
 */
export function cmsImageLoader({ src, width }: ImageLoaderProps): string {
  if (!isPreoptimizedCmsImageUrl(src)) return src;

  const url = new URL(src);
  const suffix = width <= 640 ? ".cmsopt-640.webp" : ".cmsopt-1200.webp";
  if (width > 1200) return src;

  url.pathname = url.pathname.slice(0, -optimizedSuffix.length) + suffix;
  return url.toString();
}

export function cmsImageStoragePaths(storagePath: string): string[] {
  if (!storagePath.endsWith(optimizedSuffix)) return [storagePath];

  const base = storagePath.slice(0, -optimizedSuffix.length);
  return [
    storagePath,
    base + ".cmsopt-640.webp",
    base + ".cmsopt-1200.webp",
  ];
}
