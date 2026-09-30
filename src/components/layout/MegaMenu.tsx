"use client";
import { useEffect, useRef } from "react";
import { createMenuTimeline } from "@/animations/menuAnimations";
import { allProducts } from "@/data/navigation";
import type { PrimaryNavigationItem } from "@/types/navigation";
import { NavigationLink } from "@/components/ui/NavigationLink";
import { NavigationTree } from "@/components/ui/NavigationTree";

export function MegaMenu({ item, onClose }: { item: PrimaryNavigationItem; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!panel.current) return;
    const timeline = createMenuTimeline(panel.current);
    timeline.play();
    return () => { timeline.kill(); };
  }, [item.id]);
  return <div id={`${item.id}-menu`} aria-labelledby={`${item.id}-trigger`} ref={panel} className="absolute inset-x-0 top-full z-[var(--z-menu)] max-h-[calc(100dvh-var(--header-height))] overflow-y-auto overscroll-contain border-y border-line bg-secondary shadow-[var(--shadow-premium)]">
    <div className="site-container grid gap-10 py-10 lg:grid-cols-3">
      {item.groups?.map(group => <div key={group.label} data-menu-item><h2 className="text-label mb-4 text-muted">{group.label}</h2><NavigationTree items={group.items} onNavigate={onClose} /></div>)}
      {item.id === "products" && <div data-menu-item className="flex flex-col justify-between border-l border-line pl-10">
        <div aria-hidden="true" className="pixel-field flex h-32 items-center justify-center border border-line"><span className="text-5xl tracking-[-0.07em] text-ink">OSEL<span className="text-brand">.</span></span></div>
        <div className="mt-6"><p className="text-label mb-2 text-muted">The product collection</p><NavigationLink item={allProducts} onNavigate={onClose} /></div>
      </div>}
    </div>
  </div>;
}
