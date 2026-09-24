import Link from "next/link";

export function PreviewBanner({
  editHref,
  label,
  status,
}: {
  editHref: string;
  label: string;
  status: string;
}) {
  return (
    <div className="border-b border-primary/20 bg-primary text-white">
      <div className="mx-auto flex max-w-[var(--bt-container)] flex-col gap-3 px-[var(--bt-gutter)] py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.12em]">
            CMS Önizleme
          </p>
          <p className="mt-1 text-sm font-semibold text-white/90">
            {label} · Durum: {status}. Bu sayfa yalnızca yetkili yöneticilere açıktır.
          </p>
        </div>
        <Link
          href={editHref}
          className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-control border border-white/30 bg-white px-4 text-sm font-extrabold text-primary transition hover:bg-white/90"
        >
          Düzenlemeye Dön
        </Link>
      </div>
    </div>
  );
}
