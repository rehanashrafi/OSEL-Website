"use client";
import { useRef } from "react";
import { ArrowDownRight } from "lucide-react";
import { useGSAP } from "@/animations/gsap";
import { animateHero } from "@/animations/heroAnimations";
import { Button } from "@/components/ui/Button";
import { pages } from "@/data/navigation";

export function HeroSection() {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => { if (root.current) return animateHero(root.current); }, { scope: root });
  return <section ref={root} id="home-hero" aria-labelledby="hero-title" className="cinematic-hero relative isolate flex min-h-svh flex-col overflow-hidden bg-canvas">
    <div aria-hidden="true" data-hero-field className="pixel-atmosphere pointer-events-none absolute inset-0" />
    <div aria-hidden="true" className="hero-perspective pointer-events-none absolute inset-0 overflow-hidden"><div data-hero-plane className="display-plane"><div className="display-plane-inner"><div data-hero-scan className="scan-line" /><span className="display-crosshair" /></div></div></div>
    <div data-hero-content className="site-container relative flex flex-1 flex-col justify-between gap-12 pb-9 pt-36 md:pt-40">
      <div data-hero-intro className="flex items-center justify-between gap-4"><p className="text-label flex items-center gap-3 text-subdued"><span className="h-1.5 w-1.5 bg-brand" />ÖSEL DEVICES / SIGHT. SOUND. PRECISION.</p><p className="text-label hidden text-muted md:block">Engineered in India</p></div>
      <h1 id="hero-title" className="hero-headline relative z-10"><span className="block overflow-hidden"><span data-hero-word className="block">ENGINEERING</span></span><span className="block overflow-hidden"><span data-hero-word className="block">WHAT THE WORLD</span></span><span className="block overflow-hidden"><span data-hero-word className="block">SEES<span className="text-brand">.</span></span></span></h1>
      <div className="grid items-end gap-10 border-t border-line pt-7 md:grid-cols-[1fr_1fr]">
        <div data-hero-support><p className="body-md mb-6 max-w-sm text-subdued">Display technology. Advanced manufacturing.<br />An original equipment manufacturer bringing innovation to sight and sound.</p><Button href={pages.led.href} variant="outline">Explore our displays</Button></div>
        <div data-hero-support className="flex items-end justify-between gap-6 md:justify-end md:gap-16"><span className="text-label text-muted">Greater Noida, India<br />Ösel Devices Limited</span><a href="#display-launches" className="group flex min-h-12 items-center gap-5 text-label text-subdued">Scroll to discover<ArrowDownRight size={22} aria-hidden="true" className="transition-transform group-hover:translate-y-1" /></a></div>
      </div>
    </div>
  </section>;
}
