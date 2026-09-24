export function FloatingWhatsappCta({
  whatsappUrl,
  shortName,
}: {
  whatsappUrl: string;
  shortName: string;
}) {
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      className="fixed right-4 bottom-4 z-40 inline-flex min-h-12 items-center gap-2 rounded-pill bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground shadow-lift transition-transform duration-[var(--bt-duration-normal)] hover:-translate-y-0.5 sm:right-6 sm:bottom-6"
      aria-label={`WhatsApp üzerinden ${shortName}'e yaz`}
    >
      <svg
        viewBox="0 0 24 24"
        className="size-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.3 9.3 0 0 1-3.8-.8L3 21l1.8-5a8.3 8.3 0 1 1 16.2-4.5Z" />
        <path d="M8.8 8.4c.2 2.8 2 4.7 4.8 5.4" />
      </svg>
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
