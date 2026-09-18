import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const baseStyles =
  "inline-flex min-h-11 items-center justify-center rounded-control font-extrabold transition-[transform,background-color,border-color,color,box-shadow] duration-[var(--bt-duration-normal)] ease-[var(--bt-ease-standard)] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-45 active:scale-[0.98]";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-soft hover:bg-primary-hover hover:shadow-lift",
  secondary:
    "bg-secondary text-secondary-foreground shadow-soft hover:bg-secondary-hover hover:shadow-lift",
  outline:
    "border border-border bg-surface text-foreground hover:border-primary/35 hover:bg-surface-muted",
  ghost: "text-foreground hover:bg-surface-muted",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm sm:text-base",
  lg: "px-6 py-3 text-base sm:px-7",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(baseStyles, variantStyles[variant], sizeStyles[size], className);
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonStyles({ variant, size, className })}
      {...props}
    />
  );
}

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <a
      className={buttonStyles({ variant, size, className })}
      {...props}
    />
  );
}
