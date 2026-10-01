"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/animations/gsap";
import { loadScrollTrigger } from "@/animations/scrollTrigger";

const TEXT = "ÖSEL Devices";

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*+-<>?/[]{}";

type Particle = {
  x: number;
  y: number;

  targetX: number;
  targetY: number;

  scatterX: number;
  scatterY: number;

  explodeX: number;
  explodeY: number;

  vx: number;
  vy: number;

  char: string;

  nextCharChange: number;
  charSpeed: number;

  falling: boolean;

  floorY: number;

  rotation: number;
  rotationSpeed: number;
};

export function OselFooterReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const customCursor = cursorRef.current;

    if (!section || !canvas || !customCursor) {
      return;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    let disposed = false;
    let frameId = 0;

    let particles: Particle[] = [];

    let particleColor = "#000000";

    /*
     * Interaction states:
     *
     * 0 = Normal text
     * 1 = Exploded and frozen
     * 2 = Fallen on ground
     */
    let interactionStep = 0;

    let isExploding = false;
    let isExploded = false;
    let isFalling = false;
    let isRebuilding = false;

    let explosionTimeout: ReturnType<typeof setTimeout> | null = null;

    const mouse = {
      x: -1000,
      y: -1000,

      clientX: -1000,
      clientY: -1000,

      active: false,
    };

    const state = {
      progress: 0,
    };

    // =====================================================
    // THEME
    // =====================================================

    const updateThemeColors = () => {
      requestAnimationFrame(() => {
        if (disposed) {
          return;
        }

        const styles = getComputedStyle(document.documentElement);

        const newColor = styles.getPropertyValue("--text-primary").trim();

        if (newColor) {
          particleColor = newColor;
        }
      });
    };

    // =====================================================
    // RANDOM CHARACTER
    // =====================================================

    const getRandomCharacter = () => {
      return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
    };

    // =====================================================
    // CREATE PARTICLES
    // =====================================================

    const createParticles = () => {
      const width = section.clientWidth;
      const height = section.clientHeight;

      if (!width || !height) {
        return;
      }

      const tempCanvas = document.createElement("canvas");

      tempCanvas.width = width;
      tempCanvas.height = height;

      const tempCtx = tempCanvas.getContext("2d");

      if (!tempCtx) {
        return;
      }

      tempCtx.clearRect(0, 0, width, height);

      let fontSize = Math.min(width * 0.135, 210);

      if (width < 768) {
        fontSize = width * 0.13;
      }

      tempCtx.font = `900 ${fontSize}px "Inter", sans-serif`;

      tempCtx.textAlign = "center";
      tempCtx.textBaseline = "middle";

      /*
       * Mask color only.
       */
      tempCtx.fillStyle = "#ffffff";

      tempCtx.fillText(TEXT, width / 2, height / 2, width * 0.94);

      const imageData = tempCtx.getImageData(0, 0, width, height);

      const points: Array<{
        x: number;
        y: number;
      }> = [];

      const gap = width < 768 ? 7 : 9;

      for (let y = 0; y < height; y += gap) {
        for (let x = 0; x < width; x += gap) {
          const index = (y * width + x) * 4;

          const alpha = imageData.data[index + 3];

          if (alpha > 100) {
            points.push({
              x,
              y,
            });
          }
        }
      }

      const now = performance.now();

      particles = points.map((point) => ({
        x: Math.random() * width,

        y: Math.random() * height,

        scatterX: Math.random() * width,

        scatterY: Math.random() * height,

        targetX: point.x,
        targetY: point.y,

        /*
         * These are updated after
         * the first explosion.
         */
        explodeX: point.x,
        explodeY: point.y,

        vx: 0,
        vy: 0,

        char: getRandomCharacter(),

        nextCharChange: now + Math.random() * 200,

        charSpeed: 40 + Math.random() * 100,

        falling: false,

        floorY: height - 25 - Math.random() * 45,

        rotation: 0,

        rotationSpeed: (Math.random() - 0.5) * 0.15,
      }));
    };

    // =====================================================
    // RESIZE CANVAS
    // =====================================================

    const resizeCanvas = () => {
      const width = section.clientWidth;

      const height = section.clientHeight;

      if (!width || !height) {
        return;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);

      canvas.height = Math.round(height * dpr);

      canvas.style.width = `${width}px`;

      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      createParticles();
    };

    // =====================================================
    // CUSTOM CURSOR
    // =====================================================

    const showCustomCursor = () => {
      if (window.innerWidth <= 768) {
        return;
      }

      mouse.active = true;

      gsap.to(customCursor, {
        opacity: 1,
        scale: 1,

        duration: 0.2,

        overwrite: true,
      });
    };

    const hideCustomCursor = () => {
      mouse.active = false;

      mouse.x = -1000;
      mouse.y = -1000;

      gsap.to(customCursor, {
        opacity: 0,
        scale: 0.8,

        duration: 0.15,

        overwrite: true,
      });
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = section.getBoundingClientRect();

      mouse.clientX = event.clientX;

      mouse.clientY = event.clientY;

      mouse.x = event.clientX - rect.left;

      mouse.y = event.clientY - rect.top;

      showCustomCursor();

      gsap.to(customCursor, {
        x: event.clientX - 55,

        y: event.clientY - 55,

        duration: 0.12,

        ease: "power3.out",

        overwrite: true,
      });
    };

    const handleMouseEnter = () => {
      showCustomCursor();
    };

    const handleMouseLeave = () => {
      hideCustomCursor();
    };

    // =====================================================
    // CURSOR SCROLL FIX
    // =====================================================

    const checkCursorOnScroll = () => {
      if (mouse.clientX === -1000 || mouse.clientY === -1000) {
        return;
      }

      const elementUnderCursor = document.elementFromPoint(
        mouse.clientX,
        mouse.clientY,
      );

      if (!elementUnderCursor) {
        hideCustomCursor();
        return;
      }

      const isInsideSection =
        elementUnderCursor === section || section.contains(elementUnderCursor);

      if (isInsideSection) {
        const rect = section.getBoundingClientRect();

        mouse.x = mouse.clientX - rect.left;

        mouse.y = mouse.clientY - rect.top;

        showCustomCursor();
      } else {
        hideCustomCursor();
      }
    };

    // =====================================================
    // FIRST CLICK
    // EXPLODE AND FREEZE
    // =====================================================

    const explodeParticles = () => {
      if (isExploding || isExploded || isFalling || isRebuilding) {
        return;
      }

      isExploding = true;

      const width = section.clientWidth;

      const height = section.clientHeight;

      const centerX = width / 2;

      const centerY = height / 2;

      particles.forEach((particle) => {
        let dx = particle.x - centerX;

        let dy = particle.y - centerY;

        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance === 0) {
          distance = 1;
        }

        dx /= distance;
        dy /= distance;

        const randomAngle = (Math.random() - 0.5) * 1.25;

        const cos = Math.cos(randomAngle);

        const sin = Math.sin(randomAngle);

        const directionX = dx * cos - dy * sin;

        const directionY = dx * sin + dy * cos;

        const force = 10 + Math.random() * 18;

        particle.vx = directionX * force + (Math.random() - 0.5) * 6;

        particle.vy = directionY * force + (Math.random() - 0.5) * 6;
      });

      if (explosionTimeout) {
        clearTimeout(explosionTimeout);
      }

      /*
       * Freeze particles at the
       * exploded positions.
       */
      explosionTimeout = setTimeout(() => {
        isExploding = false;
        isExploded = true;

        particles.forEach((particle) => {
          particle.vx = 0;
          particle.vy = 0;

          /*
           * Save the current exploded
           * position as temporary home.
           */
          particle.explodeX = particle.x;

          particle.explodeY = particle.y;
        });
      }, 550);
    };

    // =====================================================
    // SECOND CLICK
    // FAST FALL FROM EXPLODED POSITIONS
    // =====================================================

    const dropParticles = () => {
      if (isFalling || isRebuilding || !isExploded) {
        return;
      }

      isExploding = false;
      isExploded = false;
      isFalling = true;

      if (explosionTimeout) {
        clearTimeout(explosionTimeout);

        explosionTimeout = null;
      }

      const height = section.clientHeight;

      particles.forEach((particle, index) => {
        particle.falling = true;

        /*
         * Keep slight sideways breakup.
         */
        particle.vx = (Math.random() - 0.5) * 3;

        /*
         * Immediate downward velocity.
         */
        particle.vy = 6 + Math.random() * 7;

        particle.rotationSpeed = (Math.random() - 0.5) * 0.25;

        /*
         * Uneven ground pile.
         */
        const pileHeight = Math.random() * 48;

        particle.floorY = height - 25 - pileHeight - (index % 3);
      });
    };

    // =====================================================
    // THIRD CLICK
    // REBUILD FROM GROUND
    // =====================================================

    const rebuildFromGround = () => {
      if (!isFalling || isRebuilding) {
        return;
      }

      isFalling = false;
      isExploding = false;
      isExploded = false;
      isRebuilding = true;

      interactionStep = 0;

      let completedParticles = 0;

      particles.forEach((particle) => {
        /*
         * Keep the exact ground position.
         */
        particle.falling = false;

        particle.vx = 0;
        particle.vy = 0;

        particle.rotationSpeed = 0;

        const delay = Math.random() * 0.4;

        const duration = 1.2 + Math.random() * 0.7;

        gsap.to(particle, {
          x: particle.targetX,

          y: particle.targetY,

          rotation: 0,

          duration,

          delay,

          ease: "power3.inOut",

          onUpdate: () => {
            particle.vx = 0;
            particle.vy = 0;
          },

          onComplete: () => {
            particle.x = particle.targetX;

            particle.y = particle.targetY;

            particle.vx = 0;
            particle.vy = 0;

            particle.rotation = 0;

            completedParticles++;

            if (completedParticles === particles.length) {
              isRebuilding = false;
            }
          },
        });
      });
    };

    // =====================================================
    // CLICK HANDLER
    // =====================================================

    const handleClick = () => {
      if (isRebuilding || isExploding) {
        return;
      }

      // First click
      if (interactionStep === 0) {
        interactionStep = 1;

        explodeParticles();

        return;
      }

      // Second click
      if (interactionStep === 1) {
        if (!isExploded) {
          return;
        }

        interactionStep = 2;

        dropParticles();

        return;
      }

      // Third click
      if (interactionStep === 2) {
        rebuildFromGround();
      }
    };

    // =====================================================
    // RENDER
    // =====================================================

    const render = () => {
      if (disposed) {
        return;
      }

      const width = section.clientWidth;

      const height = section.clientHeight;

      ctx.clearRect(0, 0, width, height);

      const progress = state.progress;

      const easedProgress = 1 - Math.pow(1 - progress, 3);

      ctx.textAlign = "center";

      ctx.textBaseline = "middle";

      ctx.font = width < 768 ? "6px monospace" : "8px monospace";

      ctx.fillStyle = particleColor;

      const now = performance.now();

      particles.forEach((particle) => {
        // =====================================
        // CHARACTER SCRAMBLE
        // =====================================

        if (!particle.falling && now >= particle.nextCharChange) {
          particle.char = getRandomCharacter();

          particle.nextCharChange = now + particle.charSpeed;
        }

        // =====================================
        // FALLING PHYSICS
        // =====================================

        if (particle.falling) {
          /*
           * Strong gravity for a
           * faster second-click fall.
           */
          particle.vy += 0.72;

          particle.vx *= 0.99;

          particle.x += particle.vx;

          particle.y += particle.vy;

          particle.rotation += particle.rotationSpeed;

          // -----------------------------------
          // GROUND
          // -----------------------------------

          if (particle.y >= particle.floorY) {
            particle.y = particle.floorY;

            /*
             * Very small bounce.
             */
            if (Math.abs(particle.vy) > 1.5) {
              particle.vy *= -0.07;
            } else {
              particle.vy = 0;
            }

            particle.vx *= 0.55;

            particle.rotationSpeed *= 0.5;

            if (Math.abs(particle.vx) < 0.03) {
              particle.vx = 0;
            }

            if (Math.abs(particle.rotationSpeed) < 0.002) {
              particle.rotationSpeed = 0;
            }
          }
        }

        // =====================================
        // NORMAL / EXPLODED PHYSICS
        // =====================================
        else if (!isRebuilding) {
          /*
           * Normal mode returns to text.
           *
           * Exploded mode returns to the
           * saved exploded position.
           */
          const baseX = isExploded
            ? particle.explodeX
            : particle.scatterX +
              (particle.targetX - particle.scatterX) * easedProgress;

          const baseY = isExploded
            ? particle.explodeY
            : particle.scatterY +
              (particle.targetY - particle.scatterY) * easedProgress;

          // =====================================
          // CURSOR REPULSION
          // =====================================

          if (mouse.active && !isExploding) {
            const dx = particle.x - mouse.x;

            const dy = particle.y - mouse.y;

            const distance = Math.sqrt(dx * dx + dy * dy);

            const radius = 140;

            if (distance < radius && distance > 0) {
              const force = (radius - distance) / radius;

              const angle = Math.atan2(dy, dx);

              particle.vx += Math.cos(angle) * force * 4;

              particle.vy += Math.sin(angle) * force * 4;
            }
          }

          // =====================================
          // SPRING
          // =====================================

          /*
           * No spring while the initial
           * explosion is happening.
           *
           * After freeze, spring points to
           * explodeX/explodeY instead.
           */
          const springStrength = isExploding ? 0 : isExploded ? 0.028 : 0.035;

          particle.vx += (baseX - particle.x) * springStrength;

          particle.vy += (baseY - particle.y) * springStrength;

          // =====================================
          // FRICTION
          // =====================================

          const friction = isExploding ? 0.93 : isExploded ? 0.84 : 0.84;

          particle.vx *= friction;

          particle.vy *= friction;

          particle.x += particle.vx;

          particle.y += particle.vy;
        }

        // =====================================
        // DRAW
        // =====================================

        ctx.save();

        ctx.translate(particle.x, particle.y);

        ctx.rotate(particle.rotation);

        if (particle.falling) {
          ctx.globalAlpha = 0.92;
        } else {
          ctx.globalAlpha = 0.45 + easedProgress * 0.55;
        }

        ctx.fillText(particle.char, 0, 0);

        ctx.restore();
      });

      ctx.globalAlpha = 1;

      frameId = requestAnimationFrame(render);
    };

    // =====================================================
    // THEME OBSERVER
    // =====================================================

    updateThemeColors();

    const themeObserver = new MutationObserver((mutations) => {
      const themeChanged = mutations.some(
        (mutation) =>
          mutation.type === "attributes" &&
          mutation.attributeName === "data-theme",
      );

      if (themeChanged) {
        updateThemeColors();
      }
    });

    themeObserver.observe(document.documentElement, {
      attributes: true,

      attributeFilter: ["data-theme"],
    });

    // =====================================================
    // INITIALIZE
    // =====================================================

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    window.addEventListener("scroll", checkCursorOnScroll, {
      passive: true,
    });

    section.addEventListener("mousemove", handleMouseMove);

    section.addEventListener("mouseenter", handleMouseEnter);

    section.addEventListener("mouseleave", handleMouseLeave);

    section.addEventListener("click", handleClick);

    render();

    // =====================================================
    // SCROLL FORMATION
    // =====================================================

    let scrollTween: gsap.core.Tween | undefined;

    void loadScrollTrigger().then((ScrollTrigger) => {
      if (disposed || !ScrollTrigger) {
        return;
      }

      scrollTween = gsap.to(state, {
        progress: 1,

        ease: "none",

        scrollTrigger: {
          trigger: section,

          start: "top bottom",

          end: "center center",

          scrub: 1.2,

          invalidateOnRefresh: true,
        },
      });

      ScrollTrigger.refresh();
    });

    // =====================================================
    // CLEANUP
    // =====================================================

    return () => {
      disposed = true;

      themeObserver.disconnect();

      cancelAnimationFrame(frameId);

      if (explosionTimeout) {
        clearTimeout(explosionTimeout);
      }

      particles.forEach((particle) => {
        gsap.killTweensOf(particle);
      });

      window.removeEventListener("resize", resizeCanvas);

      window.removeEventListener("scroll", checkCursorOnScroll);

      section.removeEventListener("mousemove", handleMouseMove);

      section.removeEventListener("mouseenter", handleMouseEnter);

      section.removeEventListener("mouseleave", handleMouseLeave);

      section.removeEventListener("click", handleClick);

      scrollTween?.scrollTrigger?.kill();

      scrollTween?.kill();

      gsap.killTweensOf(customCursor);

      gsap.killTweensOf(state);
    };
  }, []);

  return (
    <section ref={sectionRef} className="osel-footer-animation">
      <canvas
        ref={canvasRef}
        className="osel-footer-animation__canvas"
        aria-hidden="true"
      />

      <div
        ref={cursorRef}
        className="osel-footer-animation__cursor"
        aria-hidden="true"
      >
        Click to interact
      </div>

      <span className="sr-only">ÖSEL Devices</span>
    </section>
  );
}
