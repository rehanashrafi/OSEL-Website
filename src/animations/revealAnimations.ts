"use client";
import { gsap } from "./gsap";
import { loadScrollTrigger } from "./scrollTrigger";

export function revealFooter(root: HTMLElement) {
  let disposed = false;
  const media = gsap.matchMedia();
  void loadScrollTrigger().then((plugin) => {
    if (disposed || !plugin) return;
    media.add("(prefers-reduced-motion: no-preference)", () => {
      root
        .querySelectorAll<HTMLElement>("[data-footer-reveal]")
        .forEach((element) => {
          gsap.from(element, {
            y: 24,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 96%", once: true },
          });
        });
    });
  });
  return () => {
    disposed = true;
    media.revert();
  };
}
