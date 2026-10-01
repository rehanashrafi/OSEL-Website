import type { ReactNode } from "react";
export function RevealText({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`block overflow-hidden pb-[0.12em] ${className}`}>
      <span data-reveal-line className="block">
        {children}
      </span>
    </span>
  );
}
