import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export function Container({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[var(--bt-container)] px-[var(--bt-gutter)]",
        className,
      )}
      {...props}
    />
  );
}

export function Section({
  className,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={cn("py-[var(--bt-section-space)]", className)}
      {...props}
    />
  );
}
