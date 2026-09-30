"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ChevronDown } from "lucide-react";
import { primaryNavigation } from "@/data/navigation";
import { isNavigationActive } from "@/lib/navigation";
import { Brand } from "@/components/ui/Brand";
import { EnquiryButton } from "@/components/ui/EnquiryButton";
import { NavigationLink } from "@/components/ui/NavigationLink";
import { MegaMenu } from "./MegaMenu";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const activeTrigger = useRef<HTMLButtonElement | null>(null);
  const focusMenu = useRef(false);
  const item = primaryNavigation.find(entry => entry.id === openMenu);
  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const closeMenu = useCallback(() => setOpenMenu(null), []);
  useEffect(() => {
    const onScroll = () => { if (header.current) header.current.dataset.scrolled = String(window.scrollY > 24); };
    const onHistory = () => { closeMenu(); closeMobile(); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("popstate", onHistory);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("popstate", onHistory); };
  }, [closeMenu, closeMobile]);
  useEffect(() => {
    if (!item) return;
    if (focusMenu.current) {
      header.current?.querySelector<HTMLElement>(`#${item.id}-menu a`)?.focus();
      focusMenu.current = false;
    }
    const onPointer = (event: PointerEvent) => { if (!header.current?.contains(event.target as Node)) closeMenu(); };
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") { closeMenu(); activeTrigger.current?.focus(); } };
    const breakpoint = window.matchMedia("(min-width: 1280px)");
    const onBreakpoint = () => { if (!breakpoint.matches) closeMenu(); };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    breakpoint.addEventListener("change", onBreakpoint);
    return () => { document.removeEventListener("pointerdown", onPointer); document.removeEventListener("keydown", onKey); breakpoint.removeEventListener("change", onBreakpoint); };
  }, [item, closeMenu]);
  return <>
    <header ref={header} className="site-header fixed inset-x-0 top-0 z-[var(--z-header)] border-b border-transparent" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) closeMenu(); }}>
      <div className="site-container flex h-full items-center justify-between gap-4">
        <Brand onNavigate={closeMenu} />
        <nav aria-label="Primary" className="hidden h-full items-center gap-4 xl:flex">
          {primaryNavigation.map(entry => entry.groups ? <button key={entry.id} id={`${entry.id}-trigger`} type="button" aria-expanded={openMenu === entry.id} aria-controls={openMenu === entry.id ? `${entry.id}-menu` : undefined} data-active={isNavigationActive(pathname, entry)} onClick={event => { activeTrigger.current = event.currentTarget; setOpenMenu(value => value === entry.id ? null : entry.id); }} onKeyDown={event => {
            if (event.key === "ArrowDown") {
              event.preventDefault(); activeTrigger.current = event.currentTarget;
              if (openMenu === entry.id) header.current?.querySelector<HTMLElement>(`#${entry.id}-menu a`)?.focus();
              else { focusMenu.current = true; setOpenMenu(entry.id); }
            }
          }} className="animated-link flex min-h-11 items-center gap-1 whitespace-nowrap text-sm text-subdued data-[active=true]:text-ink data-[active=true]:underline data-[active=true]:decoration-brand data-[active=true]:underline-offset-8">{entry.label}<ChevronDown aria-hidden="true" size={12} className={`transition-transform ${openMenu === entry.id ? "rotate-180" : ""}`} /></button> : <NavigationLink key={entry.id} item={entry} onNavigate={closeMenu} className="text-sm" />)}
        </nav>
        <div className="flex items-center gap-2"><ThemeToggle /><div className="hidden xl:block"><EnquiryButton onNavigate={closeMenu} /></div>
        <button type="button" aria-label="Open navigation" aria-expanded={mobileOpen} aria-controls="mobile-navigation" onClick={() => { closeMenu(); setMobileOpen(true); }} className="group relative flex h-12 w-12 flex-col items-center justify-center gap-2 xl:hidden"><span className={`h-px w-6 bg-ink transition-transform ${mobileOpen ? "translate-y-[4.5px] rotate-45" : ""}`} /><span className={`h-px w-6 bg-ink transition-transform ${mobileOpen ? "-translate-y-[4.5px] -rotate-45" : ""}`} /></button></div>
      </div>
      {item && <MegaMenu key={item.id} item={item} onClose={closeMenu} />}
    </header>
    <MobileMenu open={mobileOpen} onClose={closeMobile} />
  </>;
}
