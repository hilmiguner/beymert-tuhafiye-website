import Link from "next/link";

import { cn } from "@/lib/cn";

export function BrandMark({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-3 rounded-control focus-visible:outline-none",
        className,
      )}
      aria-label="Beymert ana sayfa"
    >
      <span
        aria-hidden="true"
        className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-sm font-black text-primary-foreground shadow-soft sm:size-11"
      >
        B
      </span>

      <span className="flex min-w-0 flex-col">
        <span className="bt-display truncate text-[1.55rem] leading-none font-semibold text-foreground">
          Beymert
        </span>
        {!compact && (
          <span className="mt-1 truncate text-[0.61rem] font-extrabold tracking-[0.13em] text-muted uppercase sm:text-[0.65rem]">
            Parti · Tuhafiye · Tasarım
          </span>
        )}
      </span>
    </Link>
  );
}
