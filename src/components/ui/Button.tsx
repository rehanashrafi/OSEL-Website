import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost";
  className?: string;
} & (
  | { href: string; onClick?: () => void; disabled?: never; title?: string }
  | ({ href?: never } & ButtonHTMLAttributes<HTMLButtonElement>)
);
const variants = {
  primary: "bg-brand text-on-accent hover:bg-brand-hover",
  outline: "border border-line text-ink hover:bg-surface-hover",
  ghost: "text-ink hover:bg-surface",
};
export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const classes = `group inline-flex min-h-12 items-center justify-between gap-8 rounded-sm px-5 py-3 text-sm font-medium transition-colors disabled:opacity-60 ${variants[variant]} ${className}`;
  const content = (
    <>
      {children}
      <ArrowUpRight
        aria-hidden="true"
        size={17}
        className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-disabled:transform-none"
      />
    </>
  );
  if (props.href !== undefined)
    return (
      <Link
        href={props.href}
        onClick={props.onClick}
        title={props.title}
        className={classes}
      >
        {content}
      </Link>
    );
  return (
    <button type="button" {...props} className={classes}>
      {content}
    </button>
  );
}
