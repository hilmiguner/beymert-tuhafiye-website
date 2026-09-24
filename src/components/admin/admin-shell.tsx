import Link from "next/link";
import type { ReactNode } from "react";

import { logoutAction } from "@/app/admin/actions";
import type { CmsAdmin } from "@/lib/supabase/admin";

const sections = [
  { label: "Ürünler", href: "/admin/urunler", status: "Aktif" },
  { label: "Kategoriler", href: "/admin/kategoriler", status: "Aktif" },
  { label: "Konseptler", href: null, status: "Yakında" },
  { label: "Galeri", href: null, status: "Yakında" },
  { label: "Mağaza Bilgileri", href: null, status: "Yakında" },
] as const;

export function AdminShell({
  admin,
  children,
}: {
  admin: CmsAdmin;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8f3f5]">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div>
            <p className="font-extrabold text-foreground">Beymert CMS</p>
            <p className="text-xs text-muted">
              {admin.displayName ?? admin.email ?? "Yönetici"} · {admin.role}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-control px-4 py-2 text-sm font-extrabold text-muted hover:bg-surface-muted hover:text-foreground"
            >
              Siteyi Gör
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-control border border-border bg-white px-4 py-2 text-sm font-extrabold hover:bg-surface-muted"
              >
                Çıkış
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[90rem] gap-6 px-5 py-6 sm:px-8 lg:grid-cols-[15rem_1fr] lg:py-8">
        <aside className="rounded-card border border-border bg-white p-3 shadow-soft">
          <nav aria-label="Yönetim paneli">
            <Link
              href="/admin"
              className="block rounded-control px-4 py-3 text-sm font-extrabold text-foreground transition hover:bg-surface-muted"
            >
              Dashboard
            </Link>

            <div className="mt-2 space-y-1">
              {sections.map((section) =>
                section.href ? (
                  <Link
                    key={section.label}
                    href={section.href}
                    className="flex items-center justify-between rounded-control px-4 py-3 text-sm font-bold text-foreground transition hover:bg-surface-muted"
                  >
                    <span>{section.label}</span>
                    <span className="text-[0.65rem] font-extrabold uppercase tracking-wider text-primary">
                      {section.status}
                    </span>
                  </Link>
                ) : (
                  <div
                    key={section.label}
                    className="flex items-center justify-between rounded-control px-4 py-3 text-sm font-bold text-muted"
                  >
                    <span>{section.label}</span>
                    <span className="text-[0.65rem] font-extrabold uppercase tracking-wider text-primary">
                      {section.status}
                    </span>
                  </div>
                ),
              )}
            </div>
          </nav>
        </aside>

        <main>{children}</main>
      </div>
    </div>
  );
}
