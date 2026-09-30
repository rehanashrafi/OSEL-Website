"use client";
import Lenis from "lenis";
import { gsap } from "./gsap";
import type { ScrollTrigger } from "gsap/ScrollTrigger";
let active: Lenis | undefined;
export function startSmoothScroll(trigger: typeof ScrollTrigger) {
  if (active) return () => {};
  const lenis = new Lenis({
    autoRaf: false,
    lerp: 0.12,
    anchors: true,
    prevent: (node) =>
      Boolean(node.closest("dialog, header, [data-native-scroll]")),
  });
  active = lenis;
  const tick = (time: number) => lenis.raf(time * 1000);
  lenis.on("scroll", trigger.update);
  gsap.ticker.add(tick);
  const syncModal = () => {
    if (document.body.style.position === "fixed") lenis.stop();
    else lenis.start();
  };
  const observer = new MutationObserver(syncModal);
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ["style"],
  });
  syncModal();
  return () => {
    observer.disconnect();
    gsap.ticker.remove(tick);
    lenis.off("scroll", trigger.update);
    lenis.destroy();
    if (active === lenis) active = undefined;
  };
}
export function scrollToPosition(position: number, immediate = false) {
  if (active) active.scrollTo(position, { immediate });
  else
    window.scrollTo({
      top: position,
      behavior: immediate ? "instant" : "smooth",
    });
}
