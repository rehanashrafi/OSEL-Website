"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActiveRoute } from "@/lib/navigation";
import type { NavigationItem } from "@/types/navigation";

export function NavigationLink({
  item,
  className = "",
  onNavigate,
}: {
  item: NavigationItem;
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  if (!item.href)
    return (
      <span
        aria-disabled="true"
        title="Coming soon"
        className={`inline-flex min-h-11 items-center text-subdued ${className}`}
      >
        {item.label}
        <span className="sr-only"> (coming soon)</span>
      </span>
    );
  const active = isActiveRoute(pathname, item.href, true);
  const classes = `animated-link inline-flex min-h-11 items-center transition-colors hover:text-ink ${active ? "text-ink underline decoration-brand underline-offset-8" : "text-subdued"} ${className}`;
  if (!item.href.startsWith("/") || item.href.startsWith("//"))
    return (
      <a href={item.href} onClick={onNavigate} className={classes}>
        {item.label}
      </a>
    );
  return (
    <Link
      href={item.href}
      onNavigate={onNavigate}
      aria-current={active ? "page" : undefined}
      className={classes}
    >
      {item.label}
    </Link>
  );
}
