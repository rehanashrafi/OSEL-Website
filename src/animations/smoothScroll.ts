// "use client";
// import Lenis from "lenis";
// import { gsap } from "./gsap";
// import type { ScrollTrigger } from "gsap/ScrollTrigger";
// let active: Lenis | undefined;
// export function startSmoothScroll(trigger: typeof ScrollTrigger) {
//   if (active) return () => {};
//   const lenis = new Lenis({
//     autoRaf: false,
//     lerp: 0.12,
//     anchors: true,
//     prevent: (node) =>
//       Boolean(node.closest("dialog, header, [data-native-scroll]")),
//   });
//   active = lenis;
//   const tick = (time: number) => lenis.raf(time * 1000);
//   lenis.on("scroll", trigger.update);
//   gsap.ticker.add(tick);
//   const syncModal = () => {
//     if (document.body.style.position === "fixed") lenis.stop();
//     else lenis.start();
//   };
//   const observer = new MutationObserver(syncModal);
//   observer.observe(document.body, {
//     attributes: true,
//     attributeFilter: ["style"],
//   });
//   syncModal();
//   return () => {
//     observer.disconnect();
//     gsap.ticker.remove(tick);
//     lenis.off("scroll", trigger.update);
//     lenis.destroy();
//     if (active === lenis) active = undefined;
//   };
// }
// export function scrollToPosition(position: number, immediate = false) {
//   if (active) active.scrollTo(position, { immediate });
//   else
//     window.scrollTo({
//       top: position,
//       behavior: immediate ? "instant" : "smooth",
//     });
// }

"use client";

import Lenis from "lenis";
import { gsap } from "./gsap";
import type { ScrollTrigger } from "gsap/ScrollTrigger";

let active: Lenis | undefined;

export function startSmoothScroll(trigger: typeof ScrollTrigger) {
  if (active) return () => {};

  const lenis = new Lenis({
    autoRaf: false,

    // Smooth and controlled scrolling
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),

    // Keep wheel movement controlled even during aggressive scrolling
    wheelMultiplier: 0.8,
    touchMultiplier: 1,

    smoothWheel: true,
    syncTouch: false,
    anchors: true,

    prevent: (node) =>
      Boolean(node.closest("dialog, header, [data-native-scroll]")),
  });

  active = lenis;

  // Sync Lenis with the GSAP ticker
  const tick = (time: number) => {
    lenis.raf(time * 1000);
  };

  lenis.on("scroll", trigger.update);
  gsap.ticker.add(tick);

  // Prevent GSAP lag compensation from fighting smooth scrolling
  gsap.ticker.lagSmoothing(0);

  const syncModal = () => {
    if (document.body.style.position === "fixed") {
      lenis.stop();
      return;
    }

    lenis.start();
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

    if (active === lenis) {
      active = undefined;
    }
  };
}

export function scrollToPosition(position: number, immediate = false) {
  if (active) {
    active.scrollTo(position, {
      immediate,
      duration: immediate ? 0 : 1,
    });

    return;
  }

  window.scrollTo({
    top: position,
    behavior: immediate ? "instant" : "smooth",
  });
}
