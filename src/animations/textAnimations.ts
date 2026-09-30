"use client";
import { gsap } from "./gsap";

export function revealSectionText(root: HTMLElement) {
  root
    .querySelectorAll<HTMLElement>("[data-reveal-section]")
    .forEach((section) => {
      const reveal = (
        selector: string,
        from: gsap.TweenVars,
        duration: number,
        stagger: number,
      ) => {
        const targets = section.querySelectorAll<HTMLElement>(selector);
        if (!targets.length) return;
        // Hydration, restored scroll and breakpoint changes must not hide content already seen.
        if (section.getBoundingClientRect().top <= window.innerHeight) return;
        gsap.fromTo(targets, from, {
          opacity: 1,
          visibility: "visible",
          y: 0,
          yPercent: 0,
          duration,
          stagger,
          ease: "power3.out",
          clearProps: "transform,opacity,visibility",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            once: true,
            // Finish skipped reveals on a fast scroll or a restored position after refresh.
            onLeave: (self) => {
              self.animation?.progress(1);
            },
            onRefresh: (self) => {
              if (self.scroll() >= self.start) self.animation?.progress(1);
            },
          },
        });
      };
      reveal("[data-reveal-line]", { yPercent: 110 }, 1, 0.1);
      reveal("[data-reveal]", { opacity: 0, y: 20 }, 0.8, 0.12);
      const line = section.querySelector("[data-editorial-line]");
      if (line)
        gsap.fromTo(
          line,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              end: "bottom 50%",
              scrub: 0.5,
            },
          },
        );
    });
}
