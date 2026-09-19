import Image from "next/image";

import type { ContentImage } from "@/types/media";

export function ContentImageView({
  image,
  sizes,
  priority = false,
  className = "",
}: {
  image: ContentImage;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      priority={priority}
      placeholder={image.blurDataURL ? "blur" : "empty"}
      blurDataURL={image.blurDataURL}
      className={`object-cover ${className}`}
      style={{ objectPosition: image.objectPosition ?? "center" }}
    />
  );
}
