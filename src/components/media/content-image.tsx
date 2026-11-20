import Image from "next/image";

import type { ContentImage } from "@/types/media";
import { cmsImageLoader, isPreoptimizedCmsImageUrl } from "@/lib/cms-image-paths";

export function ContentImageView({
  image,
  sizes,
  priority = false,
  className = "",
  fit = "cover",
}: {
  image: ContentImage;
  sizes: string;
  priority?: boolean;
  className?: string;
  fit?: "cover" | "contain";
}) {
  return (
    <Image
      src={image.src}
      loader={isPreoptimizedCmsImageUrl(image.src) ? cmsImageLoader : undefined}
      alt={image.alt}
      fill
      sizes={sizes}
      priority={priority}
      placeholder={image.blurDataURL ? "blur" : "empty"}
      blurDataURL={image.blurDataURL}
      className={`${fit === "contain" ? "object-contain" : "object-cover"} ${className}`}
      style={{ objectPosition: image.objectPosition ?? "center" }}
    />
  );
}
