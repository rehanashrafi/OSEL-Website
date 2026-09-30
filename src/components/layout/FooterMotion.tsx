"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { revealFooter } from "@/animations/revealAnimations";
export function FooterMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => { if (root.current) return revealFooter(root.current); }, []);
  return <div ref={root}>{children}</div>;
}
