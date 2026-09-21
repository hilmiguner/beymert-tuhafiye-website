"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { BrandMark } from "@/components/brand/brand-mark";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { siteConfig, whatsappHref } from "@/config/site";

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block size-5" aria-hidden="true">
      <span
        className={`absolute left-0 top-[5px] h-0.5 w-5 rounded-full bg-current transition-transform duration-[var(--bt-duration-normal)] ${
          open ? "translate-y-[4px] rotate-45" : ""
        }`}
      />
      <span
        className={`absolute left-0 top-[9px] h-0.5 w-5 rounded-full bg-current transition-opacity duration-[var(--bt-duration-fast)] ${
          open ? "opacity-0" : "opacity-100"
        }`}
      />
      <span
        className={`absolute left-0 top-[13px] h-0.5 w-5 rounded-full bg-current transition-transform duration-[var(--bt-duration-normal)] ${
          open ? "-translate-y-[4px] -rotate-45" : ""
        }`}
      />
    </span>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [open]);

  const isCurrent = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-border/75 bg-background/88 backdrop-blur-xl">
      <Container>
        <div className="flex min-h-18 items-center justify-between gap-5 py-3">
          <BrandMark />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Ana navigasyon">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isCurrent(item.href) ? "page" : undefined}
                className={`rounded-control px-3 py-2 text-sm font-bold transition-colors duration-[var(--bt-duration-fast)] hover:bg-surface-muted hover:text-foreground ${
                  isCurrent(item.href)
                    ? "bg-surface-muted text-foreground"
                    : "text-muted"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            <ButtonLink
              href={whatsappHref()}
              target="_blank"
              rel="noreferrer"
              size="sm"
            >
              WhatsApp’tan Sor
            </ButtonLink>
          </div>

          <button
            type="button"
            aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-haspopup="true"
            onClick={() => setOpen((value) => !value)}
            className="grid size-11 place-items-center rounded-control border border-border bg-surface text-foreground lg:hidden"
          >
            <MenuIcon open={open} />
          </button>
        </div>

        <div
          id="mobile-navigation"
          aria-hidden={!open}
          inert={open ? undefined : true}
          className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-[var(--bt-duration-normal)] ease-[var(--bt-ease-standard)] lg:hidden ${
            open ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="min-h-0">
            <nav
              className="flex flex-col rounded-card border border-border bg-surface p-2 shadow-soft"
              aria-label="Mobil navigasyon"
            >
              {siteConfig.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={`rounded-control px-4 py-3 text-base font-extrabold transition-colors hover:bg-surface-muted ${
                    isCurrent(item.href) ? "bg-surface-muted text-foreground" : ""
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <ButtonLink
                href={whatsappHref()}
                target="_blank"
                rel="noreferrer"
                className="mt-2"
                onClick={() => setOpen(false)}
              >
                WhatsApp’tan Sor
              </ButtonLink>
            </nav>
          </div>
        </div>
      </Container>
    </header>
  );
}
