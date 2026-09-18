import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  tone?: "default" | "muted" | "accent";
};

const tones = {
  default: "bg-surface",
  muted: "bg-surface-muted",
  accent: "bg-accent-soft",
} as const;

export function Card({
  tone = "default",
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-border p-5 shadow-soft sm:p-6",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
