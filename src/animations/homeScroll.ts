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

        const pillarPin =
          pillars.querySelector<HTMLElement>("[data-pillar-pin]")!;

        const stories = Array.from(
          pillars.querySelectorAll<HTMLElement>("[data-pillar]"),
        );

        gsap.set(stories.slice(1), {
          opacity: 0,
          y: 28,
        });

        const storyTimeline = gsap.timeline({
          scrollTrigger: {
            id: "home-pillars",
            trigger: pillars,
            pin: pillarPin,
            start: () => `top ${headerOffset()}px`,
            end: () =>
              `+=${
                desktop
                  ? Math.max(3600, window.innerHeight * 4.4)
                  : Math.max(2200, pillarPin.clientHeight * 2.7)
              }`,
            scrub: 1.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        stories.slice(1).forEach((story, index) => {
          const currentStory = stories[index];

          const currentPage = currentStory.querySelector<HTMLElement>(
            "[data-pillar-image]",
          );

          const currentShadow =
            currentStory.querySelector<HTMLElement>("[data-page-shadow]");

          const currentHighlight = currentStory.querySelector<HTMLElement>(
            "[data-page-highlight]",
          );

          const nextPage = story.querySelector<HTMLElement>(
            "[data-pillar-image]",
          );

          const nextImage =
            story.querySelector<HTMLElement>("[data-pillar-next]");

          const position = index * 1.55 + 0.6;

          if (nextImage) {
            gsap.set(nextImage, {
              opacity: 0,
              scale: 1.045,
              filter: "brightness(0.62)",
            });
          }

          if (nextPage) {
            gsap.set(nextPage, {
              opacity: 0,
              rotateX: 0,
              yPercent: 0,
              scaleY: 1,
              z: 0,
              transformOrigin: "50% 0%",
            });
          }

          // Reveal the next image gradually under the folding page.
          if (nextImage) {
            storyTimeline.fromTo(
              nextImage,
              {
                opacity: 0,
                scale: 1.045,
                filter: "brightness(0.62)",
              },
              {
                opacity: 1,
                scale: 1,
                filter: "brightness(1)",
                duration: 1.05,
                ease: "none",
                immediateRender: false,
              },
              position + 0.05,
            );
          }

          // Build the shadow while the page starts bending.
          if (currentShadow) {
            storyTimeline.to(
              currentShadow,
              {
                opacity: 0.82,
                duration: 0.4,
                ease: "power1.in",
              },
              position,
            );
          }

          // Add a highlight around the folding edge.
          if (currentHighlight) {
            storyTimeline.to(
              currentHighlight,
              {
                opacity: 0.8,
                duration: 0.38,
                ease: "power1.out",
              },
              position + 0.04,
            );
          }

          if (currentPage) {
            // Start bending from the top hinge.
            storyTimeline.to(
              currentPage,
              {
                rotateX: -52,
                yPercent: -1,
                z: 70,
                scaleY: 0.99,
                duration: 0.38,
                ease: "power1.in",
                transformOrigin: "50% 0%",
              },
              position,
            );

            // Pull the page toward the viewer.
            storyTimeline.to(
              currentPage,
              {
                rotateX: -118,
                yPercent: -2.5,
                z: 155,
                scaleY: 0.84,
                duration: 0.42,
                ease: "power1.inOut",
              },
              position + 0.3,
            );

            // Continue folding toward the top.
            storyTimeline.to(
              currentPage,
              {
                rotateX: -162,
                yPercent: -4.5,
                z: 90,
                scaleY: 0.44,
                duration: 0.36,
                ease: "power2.inOut",
              },
              position + 0.65,
            );

            // Collapse the page into the top edge.
            storyTimeline.to(
              currentPage,
              {
                rotateX: -179,
                yPercent: -6,
                z: 20,
                scaleY: 0.025,
                opacity: 0,
                duration: 0.3,
                ease: "power3.in",
              },
              position + 0.92,
            );
          }

          // Bring the next story in while the previous page is folding.
          storyTimeline.to(
            story,
            {
              opacity: 1,
              y: 0,
              duration: 0.55,
              ease: "power2.out",
            },
            position + 0.58,
          );

          // Move the old story away near the end of the fold.
          storyTimeline.to(
            currentStory,
            {
              opacity: 0,
              y: -20,
              duration: 0.34,
              ease: "power2.in",
            },
            position + 0.84,
          );

          // Make the revealed image the new active calendar page.
          if (nextPage) {
            storyTimeline.set(
              nextPage,
              {
                opacity: 1,
                rotateX: 0,
                yPercent: 0,
                scaleY: 1,
                z: 0,
                transformOrigin: "50% 0%",
              },
              position + 1.18,
            );
          }

          // Remove the temporary reveal layer after the transition.
          if (nextImage) {
            storyTimeline.set(
              nextImage,
              {
                opacity: 0,
              },
              position + 1.2,
            );
          }
        });

        // Final page should also fold away before the section unpins.
        const lastStory = stories[stories.length - 1];

        const lastPage = lastStory?.querySelector<HTMLElement>(
          "[data-pillar-image]",
        );

        const lastShadow =
          lastStory?.querySelector<HTMLElement>("[data-page-shadow]");

        const lastHighlight = lastStory?.querySelector<HTMLElement>(
          "[data-page-highlight]",
        );

        if (lastStory && lastPage) {
          const finalPosition = (stories.length - 1) * 1.55 + 0.9;

          if (lastShadow) {
            storyTimeline.to(
              lastShadow,
              {
                opacity: 0.85,
                duration: 0.38,
                ease: "power1.in",
              },
              finalPosition,
            );
          }

          if (lastHighlight) {
            storyTimeline.to(
              lastHighlight,
              {
                opacity: 0.9,
                duration: 0.35,
                ease: "power1.out",
              },
              finalPosition,
            );
          }

          // Start the final calendar fold.
          storyTimeline.to(
            lastPage,
            {
              rotateX: -52,
              yPercent: -1,
              z: 75,
              scaleY: 0.99,
              duration: 0.38,
              ease: "power1.in",
              transformOrigin: "50% 0%",
            },
            finalPosition,
          );

          // Strong middle bend.
          storyTimeline.to(
            lastPage,
            {
              rotateX: -118,
              yPercent: -2.5,
              z: 160,
              scaleY: 0.84,
              duration: 0.42,
              ease: "power1.inOut",
            },
            finalPosition + 0.3,
          );

          // Fold toward the top edge.
          storyTimeline.to(
            lastPage,
            {
              rotateX: -162,
              yPercent: -4.5,
              z: 90,
              scaleY: 0.44,
              duration: 0.36,
              ease: "power2.inOut",
            },
            finalPosition + 0.65,
          );

          // Fully collapse the final page.
          storyTimeline.to(
            lastPage,
            {
              rotateX: -179,
              yPercent: -6,
              z: 20,
              scaleY: 0.025,
              opacity: 0,
              duration: 0.3,
              ease: "power3.in",
            },
            finalPosition + 0.92,
          );

          // Exit the final content at the same time.
          storyTimeline.to(
            lastStory,
            {
              opacity: 0,
              y: -18,
              duration: 0.25,
              ease: "power2.in",
            },
            finalPosition + 0.86,
          );
        }

        // Progress follows the complete pillar timeline.
        gsap.fromTo(
          pillars.querySelector("[data-pillar-progress]"),
          {
            scaleX: 0.2,
          },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: pillars,
              start: () => storyTimeline.scrollTrigger!.start,
              end: () => storyTimeline.scrollTrigger!.end,
              scrub: 1.6,
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
