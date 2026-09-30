"use client";
import { gsap } from "./gsap";
export function animateHero(root: HTMLElement) {
  const media = gsap.matchMedia();
  media.add("(prefers-reduced-motion: no-preference)", () => {
    if (window.scrollY < 100) {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(root.querySelector("[data-hero-field]"), {
          opacity: 0,
          duration: 1.5,
        })
        .from(
          root.querySelector("[data-hero-plane]"),
          { opacity: 0, scale: 1.2, duration: 1.8 },
          0.1,
        )
        .fromTo(
          root.querySelector("[data-hero-scan]"),
          { yPercent: -500 },
          { yPercent: 1200, duration: 2.2, ease: "power1.inOut" },
          0.15,
        )
        .from(
          root.querySelector("[data-hero-intro]"),
          { opacity: 0, y: 12, duration: 0.8 },
          0.2,
        )
        .from(
          root.querySelectorAll("[data-hero-word]"),
          { yPercent: 110, rotate: 2, duration: 1.1, stagger: 0.12 },
          0.35,
        )
        .from(
          root.querySelectorAll("[data-hero-support]"),
          { opacity: 0, y: 16, duration: 0.8, stagger: 0.1 },
          0.9,
        );
    }
  });
  media.add(
    "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    () => {
      const plane = root.querySelector<HTMLElement>("[data-hero-plane]");
      const x = gsap.quickTo(plane, "x", { duration: 1.1, ease: "power3.out" });
      const y = gsap.quickTo(plane, "y", { duration: 1.1, ease: "power3.out" });
      const move = (event: PointerEvent) => {
        const rect = root.getBoundingClientRect();
        x((event.clientX / rect.width - 0.5) * 18);
        y(((event.clientY - rect.top) / rect.height - 0.5) * 12);
      };
      const leave = () => {
        x(0);
        y(0);
      };
      root.addEventListener("pointermove", move);
      root.addEventListener("pointerleave", leave);
      return () => {
        root.removeEventListener("pointermove", move);
        root.removeEventListener("pointerleave", leave);
      };
    },
  );
  return () => media.revert();
}
