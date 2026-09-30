"use client";
import { gsap } from "./gsap";

export function createMenuTimeline(panel: HTMLElement) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return gsap
    .timeline({ paused: true })
    .fromTo(
      panel,
      { opacity: 0, y: reduced ? 0 : -12 },
      { opacity: 1, y: 0, duration: reduced ? 0 : 0.3, ease: "power3.out" },
    )
    .fromTo(
      panel.querySelectorAll("[data-menu-item]"),
      { opacity: 0, y: reduced ? 0 : 16 },
      {
        opacity: 1,
        y: 0,
        duration: reduced ? 0 : 0.35,
        stagger: reduced ? 0 : 0.035,
        ease: "power3.out",
      },
      reduced ? 0 : 0.08,
    );
}
