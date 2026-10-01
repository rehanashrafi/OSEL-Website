"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/animations/gsap";

const PIECES = 8;

export function OselPreloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const assemblyRef = useRef<HTMLDivElement>(null);
  const finalLogoRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const topCurtainRef = useRef<HTMLDivElement>(null);
  const bottomCurtainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const assembly = assemblyRef.current;
    const finalLogo = finalLogoRef.current;
    const tagline = taglineRef.current;
    const glow = glowRef.current;
    const sweep = sweepRef.current;
    const counter = counterRef.current;
    const progress = progressRef.current;
    const loading = loadingRef.current;
    const topCurtain = topCurtainRef.current;
    const bottomCurtain = bottomCurtainRef.current;

    if (
      !root ||
      !assembly ||
      !finalLogo ||
      !tagline ||
      !glow ||
      !sweep ||
      !counter ||
      !progress ||
      !loading ||
      !topCurtain ||
      !bottomCurtain
    ) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      root.style.display = "none";
      return;
    }

    const pieces = gsap.utils.toArray<HTMLElement>(
      assembly.querySelectorAll("[data-logo-piece]"),
    );

    const originalOverflow = document.body.style.overflow;

    document.documentElement.classList.add("osel-loading");
    document.body.style.overflow = "hidden";

    const progressState = { value: 0 };

    gsap.set(root, {
      autoAlpha: 1,
    });

    gsap.set(pieces, {
      opacity: 0,
      scale: 0.82,
      x: (index) => {
        const direction = index % 2 === 0 ? -1 : 1;
        return direction * gsap.utils.random(90, 260);
      },
      y: (index) => {
        const direction = index < PIECES / 2 ? -1 : 1;
        return direction * gsap.utils.random(60, 190);
      },
      rotation: () => gsap.utils.random(-140, 140),
      transformOrigin: "center center",
    });

    gsap.set(finalLogo, {
      opacity: 0,
      scale: 1,
    });

    gsap.set(tagline, {
      opacity: 0,
      y: 14,
    });

    gsap.set(glow, {
      opacity: 0,
      scale: 0.35,
    });

    gsap.set(sweep, {
      xPercent: -180,
      opacity: 0,
    });

    gsap.set(progress, {
      scaleX: 0,
      transformOrigin: "left center",
    });

    const tl = gsap.timeline({
      defaults: {
        ease: "power3.out",
      },
      onComplete: () => {
        document.body.style.overflow = originalOverflow;
        document.documentElement.classList.remove("osel-loading");
        root.style.display = "none";

        window.dispatchEvent(new Event("osel:intro-complete"));
      },
    });

    // Logo fragments enter from different directions.
    tl.to(pieces, {
      opacity: 1,
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      duration: 1.65,
      stagger: {
        each: 0.075,
        from: "random",
      },
      ease: "expo.inOut",
    })

      // Central gold energy appears while pieces assemble.
      .to(
        glow,
        {
          opacity: 0.75,
          scale: 1,
          duration: 0.85,
          ease: "power3.out",
        },
        "-=0.9",
      )

      // Pieces lock together.
      .to(
        pieces,
        {
          scale: 1.015,
          duration: 0.22,
          ease: "power2.out",
        },
        "-=0.18",
      )
      .to(pieces, {
        scale: 1,
        duration: 0.24,
      })

      // Replace fragmented logo with the clean original logo.
      .to(
        finalLogo,
        {
          opacity: 1,
          scale: 1,
          duration: 0.35,
          ease: "power2.out",
        },
        "-=0.3",
      )
      .to(
        assembly,
        {
          opacity: 0,
          duration: 0.22,
        },
        "<",
      )

      // Reveal tagline below the logo.
      .to(
        tagline,
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power3.out",
        },
        "-=0.05",
      )

      // Gold light sweeps across the finished logo.
      .to(
        sweep,
        {
          xPercent: 180,
          opacity: 1,
          duration: 0.95,
          ease: "power2.inOut",
        },
        "-=0.3",
      )
      .to(
        sweep,
        {
          opacity: 0,
          duration: 0.15,
        },
        "-=0.15",
      )

      // Bottom loader runs alongside the logo sequence.
      .to(
        progressState,
        {
          value: 100,
          duration: 3.5,
          ease: "power2.inOut",
          onUpdate: () => {
            counter.textContent = Math.round(progressState.value)
              .toString()
              .padStart(3, "0");
          },
        },
        0,
      )
      .to(
        progress,
        {
          scaleX: 1,
          duration: 3.5,
          ease: "power2.inOut",
        },
        0,
      )

      // Hold completed logo briefly.
      .to({}, { duration: 0.4 })

      // Logo moves toward the viewer before opening the website.
      .to(finalLogo, {
        scale: 1.08,
        opacity: 0,
        duration: 0.55,
        ease: "power3.in",
      })
      .to(
        tagline,
        {
          y: -8,
          opacity: 0,
          duration: 0.35,
          ease: "power2.in",
        },
        "<",
      )
      .to(
        glow,
        {
          scale: 2.4,
          opacity: 0,
          duration: 0.55,
          ease: "power3.in",
        },
        "<",
      )
      .to(
        loading,
        {
          y: 20,
          opacity: 0,
          duration: 0.35,
          ease: "power2.in",
        },
        "<",
      )

      // Cinematic horizontal opening.
      .to(
        topCurtain,
        {
          yPercent: -101,
          duration: 1,
          ease: "expo.inOut",
        },
        "-=0.05",
      )
      .to(
        bottomCurtain,
        {
          yPercent: 101,
          duration: 1,
          ease: "expo.inOut",
        },
        "<",
      )
      .to(
        root,
        {
          autoAlpha: 0,
          duration: 0.12,
        },
        "-=0.1",
      );

    return () => {
      tl.kill();
      document.body.style.overflow = originalOverflow;
      document.documentElement.classList.remove("osel-loading");
    };
  }, []);

  return (
    <div ref={rootRef} className="osel-intro" aria-hidden="true">
      <div
        ref={topCurtainRef}
        className="osel-intro__curtain osel-intro__curtain--top"
      />

      <div
        ref={bottomCurtainRef}
        className="osel-intro__curtain osel-intro__curtain--bottom"
      />

      <div className="osel-intro__noise" />
      <div className="osel-intro__vignette" />

      <div className="osel-intro__center">
        <div ref={glowRef} className="osel-intro__glow" />

        <div className="osel-intro__brand">
          <div ref={assemblyRef} className="osel-intro__assembly">
            {Array.from({ length: PIECES }).map((_, index) => (
              <div
                key={index}
                data-logo-piece
                className={`osel-intro__piece osel-intro__piece--${index + 1}`}
              >
                <Image
                  src="/assets/images/common/osel-logo.png"
                  alt=""
                  fill
                  priority
                  quality={100}
                  sizes="(max-width: 768px) 78vw, 600px"
                />
              </div>
            ))}
          </div>

          <div ref={finalLogoRef} className="osel-intro__final-logo">
            <Image
              src="/assets/images/common/osel-logo.png"
              alt=""
              fill
              priority
              quality={100}
              sizes="(max-width: 768px) 78vw, 600px"
            />

            <span ref={sweepRef} className="osel-intro__sweep" />
          </div>

          <p ref={taglineRef} className="osel-intro__tagline">
            Enlighten your senses
          </p>
        </div>
      </div>

      <div ref={loadingRef} className="osel-intro__loading">
        <div className="osel-intro__loading-meta">
          <span>LOADING EXPERIENCE</span>

          <span className="osel-intro__percentage">
            <span ref={counterRef}>000</span>
            <small>%</small>
          </span>
        </div>

        <div className="osel-intro__track">
          <div ref={progressRef} className="osel-intro__progress" />
        </div>
      </div>
    </div>
  );
}
