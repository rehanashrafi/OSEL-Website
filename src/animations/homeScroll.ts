"use client";
import { gsap } from "./gsap";
import { loadScrollTrigger } from "./scrollTrigger";
import { revealSectionText } from "./textAnimations";
import { startSmoothScroll, scrollToPosition } from "./smoothScroll";

export async function setupHomeScroll(root: HTMLElement, signal?: AbortSignal) {
  const ScrollTrigger = await loadScrollTrigger();
  await document.fonts.ready;
  if (signal?.aborted || !ScrollTrigger || !root.isConnected) return () => {};
  const media = gsap.matchMedia();
  const disposers: Array<() => void> = [];
  let refreshFrame = 0;
  let disposed = false;
  const cleanup = () => {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(refreshFrame);
    disposers.forEach((dispose) => dispose());
    media.revert();
    root
      .querySelectorAll<HTMLElement>("[data-pinned]")
      .forEach((section) => delete section.dataset.pinned);
    delete root.dataset.motionReady;
  };
  try {
    const products = root.querySelector<HTMLElement>("[data-product-section]")!;
    const viewport = products.querySelector<HTMLElement>(
      "[data-product-viewport]",
    )!;
    const track = products.querySelector<HTMLElement>("[data-product-track]")!;
    const cards = Array.from(
      products.querySelectorAll<HTMLElement>("[data-product-card]"),
    );
    const counter = products.querySelector<HTMLElement>(
      "[data-product-index]",
    )!;
    const progress = products.querySelector<HTMLElement>(
      "[data-product-progress]",
    )!;
    const updateProductProgress = (value: number) => {
      counter.textContent = String(
        Math.round(value * (cards.length - 1)) + 1,
      ).padStart(2, "0");
      gsap.set(progress, {
        scaleX: (1 + value * (cards.length - 1)) / cards.length,
      });
    };
    const nativeProgress = () => {
      if (!products.dataset.pinned)
        updateProductProgress(
          viewport.scrollLeft /
            Math.max(1, viewport.scrollWidth - viewport.clientWidth),
        );
    };
    viewport.addEventListener("scroll", nativeProgress, { passive: true });
    disposers.push(() =>
      viewport.removeEventListener("scroll", nativeProgress),
    );

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const hero = root.querySelector<HTMLElement>("#home-hero")!;
      gsap.to(hero.querySelector("[data-hero-content]"), {
        y: () => (window.matchMedia("(max-width: 1023px)").matches ? -15 : -35),
        opacity: 0.25,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom 10%",
          scrub: 1,
        },
      });
      gsap.to(hero.querySelector("[data-hero-field]"), {
        scale: 0.88,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
      const factory = root.querySelector<HTMLElement>("[data-manufacturing]")!;
      gsap.fromTo(
        factory.querySelector("[data-factory-mask]"),
        { clipPath: "inset(12% 12% 12% 12%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: {
            trigger: factory,
            start: "top 65%",
            end: "center 35%",
            scrub: 1,
          },
        },
      );
      gsap.fromTo(
        factory.querySelector("[data-factory-image]"),
        { scale: 1.12 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: factory,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        },
      );
      const clients = root.querySelector<HTMLElement>("[data-clientele]")!;
      const loops = Array.from(
        clients.querySelectorAll<HTMLElement>("[data-logo-track]"),
      ).map((row, index) =>
        gsap.fromTo(
          row,
          { xPercent: index ? -50 : 0 },
          {
            xPercent: index ? 0 : -50,
            duration: 55,
            ease: "none",
            repeat: -1,
            paused: true,
          },
        ),
      );
      let visible = false;
      let hovering = false;
      let focused = false;
      const sync = () =>
        loops.forEach((loop) =>
          loop.paused(
            !visible ||
              hovering ||
              focused ||
              clients.dataset.paused === "true",
          ),
        );
      const enter = () => {
        hovering = true;
        sync();
      };
      const leave = () => {
        hovering = false;
        sync();
      };
      const focus = () => {
        focused = true;
        sync();
      };
      const blur = (event: FocusEvent) => {
        focused = clients.contains(event.relatedTarget as Node);
        sync();
      };
      clients.addEventListener("pointerenter", enter);
      clients.addEventListener("pointerleave", leave);
      clients.addEventListener("focusin", focus);
      clients.addEventListener("focusout", blur);
      const observer = new IntersectionObserver((entries) => {
        visible = entries[0].isIntersecting;
        sync();
      });
      observer.observe(clients);
      const paused = new MutationObserver(sync);
      paused.observe(clients, {
        attributes: true,
        attributeFilter: ["data-paused"],
      });
      ScrollTrigger.create({
        trigger: clients,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) =>
          loops.forEach((loop) =>
            loop.timeScale(
              1 + Math.min(Math.abs(self.getVelocity()) / 4000, 0.5),
            ),
          ),
      });
      return () => {
        observer.disconnect();
        paused.disconnect();
        clients.removeEventListener("pointerenter", enter);
        clients.removeEventListener("pointerleave", leave);
        clients.removeEventListener("focusin", focus);
        clients.removeEventListener("focusout", blur);
      };
    });

    media.add(
      {
        desktop: "(min-width: 1024px)",
        compact: "(max-width: 1023px)",
        tabletUp: "(min-width: 768px)",
        motion: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        if (!context.conditions?.motion) return;
        const desktop = Boolean(context.conditions.desktop);
        const headerOffset = () =>
          parseFloat(
            getComputedStyle(root).getPropertyValue(
              desktop ? "--header-height-compact" : "--header-height-mobile",
            ),
          );
        const setupProducts = () => {
          if (!context.conditions?.tabletUp) {
            nativeProgress();
            return () => {};
          }
          products.dataset.pinned = "true";
          viewport.scrollLeft = 0;
          const distance = () =>
            Math.max(0, track.scrollWidth - viewport.clientWidth);
          const productTween = gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              id: "home-products",
              refreshPriority: 2,
              trigger: products,
              pin: products.querySelector("[data-product-pin]"),
              start: () => `top ${headerOffset()}px`,
              end: () =>
                `+=${desktop ? Math.min(3000, window.innerHeight * 3.2) : Math.min(distance(), Math.max(1200, viewport.clientWidth * 4))}`,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => updateProductProgress(self.progress),
            },
          });
          const productTrigger = productTween.scrollTrigger!;
          const goTo = (index: number, immediate = false) => {
            const position =
              Math.max(0, Math.min(cards.length - 1, index)) /
              (cards.length - 1);
            scrollToPosition(
              productTrigger.start +
                position * (productTrigger.end - productTrigger.start),
              immediate,
            );
            if (immediate) {
              productTween.progress(position);
              ScrollTrigger.update();
            }
          };
          const step = (event: Event) => {
            event.preventDefault();
            goTo(
              Math.round(productTrigger.progress * (cards.length - 1)) +
                (event as CustomEvent<number>).detail,
            );
          };
          const focus = (event: FocusEvent) => {
            const target = (event.target as HTMLElement).closest<HTMLElement>(
              "[data-product-card]",
            );
            if (target) {
              viewport.scrollLeft = 0;
              goTo(cards.indexOf(target), true);
            }
          };
          products.addEventListener("osel:product-step", step);
          products.addEventListener("focusin", focus);
          cards.forEach((card) => {
            gsap.fromTo(
              card.querySelector("img"),
              { scale: 0.96 },
              {
                scale: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  containerAnimation: productTween,
                  start: "left right",
                  end: "center center",
                  scrub: true,
                },
              },
            );
          });
          return () => {
            delete products.dataset.pinned;
            products.removeEventListener("osel:product-step", step);
            products.removeEventListener("focusin", focus);
            viewport.scrollLeft = 0;
            updateProductProgress(0);
          };
        };
        const stopProducts = setupProducts();
        const pillars = root.querySelector<HTMLElement>(
          "[data-pillar-section]",
        )!;
        pillars.dataset.pinned = "true";
        const stories = Array.from(
          pillars.querySelectorAll<HTMLElement>("[data-pillar]"),
        );
        gsap.set(stories.slice(1), { opacity: 0, y: 28 });
        const storyTimeline = gsap.timeline({
          scrollTrigger: {
            id: "home-pillars",
            refreshPriority: 1,
            trigger: pillars,
            pin: pillars.querySelector("[data-pillar-pin]"),
            start: () => `top ${headerOffset()}px`,
            end: () =>
              `+=${desktop ? Math.min(2200, window.innerHeight * 2.3) : Math.max(1000, pillars.querySelector<HTMLElement>("[data-pillar-pin]")!.clientHeight * 1.8)}`,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        stories.slice(1).forEach((story, index) => {
          storyTimeline
            .to(
              stories[index],
              {
                opacity: 0,
                y: -24,
                duration: 0.3,
              },
              index + 0.7,
            )
            .to(
              story,
              {
                opacity: 1,
                y: 0,
                duration: 0.3,
              },
              index + 0.8,
            )
            .from(
              story.querySelector("[data-pillar-image]"),
              {
                opacity: 0,
                scale: 0.94,
                duration: 0.6,
                ease: "power2.out",
              },
              index + 0.7,
            );
        });
        // stories.slice(1).forEach((story, index) => {
        //   storyTimeline
        //     .to(
        //       stories[index],
        //       { opacity: 0, y: -24, duration: 0.3 },
        //       index + 0.7,
        //     )
        //     .to(story, { opacity: 1, y: 0, duration: 0.3 }, index + 0.8)
        //     .from(
        //       story.querySelector(".precision-orbit"),
        //       { rotate: -15, scale: 0.9, duration: 0.6 },
        //       index + 0.7,
        //     );
        // });
        storyTimeline.to({}, { duration: 0.5 });
        gsap.fromTo(
          pillars.querySelector("[data-pillar-progress]"),
          { scaleX: 0.2 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: pillars,
              start: () => storyTimeline.scrollTrigger!.start,
              end: () => storyTimeline.scrollTrigger!.end,
              scrub: true,
            },
          },
        );
        return () => {
          stopProducts();
          delete pillars.dataset.pinned;
        };
      },
    );

    media.add(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      () => {
        const stopSmooth = startSmoothScroll(ScrollTrigger);
        const cta = root.querySelector<HTMLElement>("[data-cta]")!;
        const glow = cta.querySelector<HTMLElement>("[data-cta-glow]");
        const x = gsap.quickTo(glow, "x", { duration: 1, ease: "power3.out" });
        const y = gsap.quickTo(glow, "y", { duration: 1, ease: "power3.out" });
        const move = (event: PointerEvent) => {
          const rect = cta.getBoundingClientRect();
          x((event.clientX / rect.width - 0.5) * 120);
          y(((event.clientY - rect.top) / rect.height - 0.5) * 80);
        };
        cta.addEventListener("pointermove", move);
        return () => {
          stopSmooth();
          cta.removeEventListener("pointermove", move);
        };
      },
    );
    // Pins must establish document geometry before any one-shot reveal captures its start.
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      revealSectionText(root);
    });
    const refresh = () => {
      if (disposed || signal?.aborted) return;
      cancelAnimationFrame(refreshFrame);
      refreshFrame = requestAnimationFrame(() => {
        if (!disposed && !signal?.aborted) ScrollTrigger.refresh();
      });
    };
    root.querySelectorAll("img").forEach((image) => {
      image.addEventListener("load", refresh);
      disposers.push(() => image.removeEventListener("load", refresh));
    });
    refresh();
    root.dataset.motionReady = "true";
    return cleanup;
  } catch (error) {
    cleanup();
    throw error;
  }
}
