import { ButtonLink } from "@/components/ui/button";

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="rounded-card border border-dashed border-border bg-surface-muted/55 px-6 py-10 text-center sm:px-10 sm:py-14">
      <span
        aria-hidden="true"
        className="mx-auto grid size-12 place-items-center rounded-full bg-surface text-xl font-black text-primary shadow-soft"
      >
        B
      </span>
      <h2 className="bt-display mt-5 text-3xl font-semibold sm:text-4xl">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-xl leading-7 text-muted">
        {description}
      </p>
      {actionHref && actionLabel ? (
        <div className="mt-6">
          <ButtonLink href={actionHref} variant="outline">
            {actionLabel}
          </ButtonLink>
        </div>
      ) : null}
    </div>
  );
}
