"use client";
import { useCallback, useEffect, useRef } from "react";
import { createMenuTimeline } from "@/animations/menuAnimations";
import { primaryNavigation, socialNavigation } from "@/data/navigation";
import { usePathname } from "next/navigation";
import { isNavigationActive } from "@/lib/navigation";
import { NavigationTree } from "@/components/ui/NavigationTree";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Brand } from "@/components/ui/Brand";
import { EnquiryButton } from "@/components/ui/EnquiryButton";
import { NavigationLink } from "@/components/ui/NavigationLink";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const timeline = useRef<ReturnType<typeof createMenuTimeline> | null>(null);
  const closing = useRef(false);
  const requestClose = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    if (timeline.current && timeline.current.time() > 0 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      timeline.current.eventCallback("onReverseComplete", onClose).timeScale(1.7).reverse();
    } else onClose();
  }, [onClose]);
  useEffect(() => {
    const element = dialog.current;
    if (!open || !element) return;
    closing.current = false;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const scrollY = window.scrollY;
    const saved = { position: document.body.style.position, top: document.body.style.top, width: document.body.style.width, overflow: document.body.style.overflow };
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    element.showModal();
    closeButton.current?.focus();
    timeline.current = createMenuTimeline(element);
    timeline.current.play();
    const breakpoint = window.matchMedia("(min-width: 1280px)");
    const onBreakpoint = () => { if (breakpoint.matches) onClose(); };
    breakpoint.addEventListener("change", onBreakpoint);
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => { if (motion.matches) { if (closing.current) onClose(); else timeline.current?.progress(1); } };
    motion.addEventListener("change", onMotion);
    return () => {
      timeline.current?.kill();
      timeline.current = null;
      element.close();
      Object.assign(document.body.style, saved);
      window.scrollTo(0, scrollY);
      previousFocus?.focus({ preventScroll: true });
      breakpoint.removeEventListener("change", onBreakpoint);
      motion.removeEventListener("change", onMotion);
    };
  }, [open, onClose]);
  return <dialog ref={dialog} id="mobile-navigation" aria-labelledby="mobile-navigation-title" className="mobile-dialog z-[var(--z-modal)]" onCancel={event => { event.preventDefault(); requestClose(); }}>
    <div className="site-container flex min-h-full flex-col pb-8">
      <div className="flex h-[var(--header-height-mobile)] shrink-0 items-center justify-between"><Brand onNavigate={onClose} /><div className="flex items-center gap-2"><ThemeToggle /><button ref={closeButton} onClick={requestClose} aria-label="Close navigation" className="relative flex h-12 w-12 items-center justify-center"><span className="absolute h-px w-6 rotate-45 bg-ink" /><span className="absolute h-px w-6 -rotate-45 bg-ink" /></button></div></div>
      <nav aria-label="Mobile" className="flex-1 pb-8 pt-8"><h2 id="mobile-navigation-title" className="text-label mb-6 text-muted">Navigation</h2>
        <ul>{primaryNavigation.map(item => <li key={item.id} data-menu-item className="border-b border-line py-3">
          {item.groups ? <details><summary data-active={isNavigationActive(pathname, item)} className="heading-lg cursor-pointer py-2 data-[active=true]:underline data-[active=true]:decoration-brand data-[active=true]:underline-offset-8">{item.label}</summary><div className="grid gap-6 py-5 sm:grid-cols-2">{item.groups.map(group => <div key={group.label}><h3 className="text-label mb-3 text-muted">{group.label}</h3><NavigationTree items={group.items} onNavigate={onClose} /></div>)}</div></details> : <NavigationLink item={item} onNavigate={onClose} className="heading-lg w-full py-2" />}
        </li>)}</ul>
      </nav>
      <div data-menu-item className="flex flex-wrap items-end justify-between gap-6"><div><EnquiryButton onNavigate={onClose} /></div><div className="text-label text-muted">OSEL Devices Limited</div></div>
      {socialNavigation.length > 0 && <div className="mt-6 flex flex-wrap gap-x-5">{socialNavigation.map(item => <NavigationLink key={item.label} item={item} onNavigate={onClose} />)}</div>}
    </div>
  </dialog>;
}

