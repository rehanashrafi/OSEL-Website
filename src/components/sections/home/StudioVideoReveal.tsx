"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/animations/gsap";
import { loadScrollTrigger } from "@/animations/scrollTrigger";
import Image from "next/image";

export function StudioVideoReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const image = imageRef.current;
    const videoWrap = videoWrapRef.current;
    const video = videoRef.current;

    if (!section || !stage || !image || !videoWrap || !video) {
      return;
    }

    let disposed = false;
    let timeline: gsap.core.Timeline | undefined;
    let mm: gsap.MatchMedia | undefined;

    void loadScrollTrigger().then((ScrollTrigger) => {
      if (disposed || !ScrollTrigger) {
        return;
      }

      mm = gsap.matchMedia();

      // ==========================================
      // DESKTOP
      // ==========================================

      mm.add("(min-width: 769px)", () => {
        gsap.set(videoWrap, {
          scale: 1.55,
          x: 0,
          y: 0,
          transformOrigin: "center center",
        });

        gsap.set(image, {
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1,
        });

        timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=180%",
            scrub: 1.2,
            pin: stage,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,

            onEnter: () => {
              void video.play().catch(() => undefined);
            },

            onEnterBack: () => {
              void video.play().catch(() => undefined);
            },
          },
        });

        // Video final transform:
        // translate3d(0px, 0px, 0px) scale(0.4977, 0.4977)
        timeline.to(
          videoWrap,
          {
            x: 0,
            y: 0,
            scale: 0.48,
            duration: 1,
            ease: "none",
          },
          0,
        );

        // Background final transform:
        // translate(0px, 80px)
        timeline.to(
          image,
          {
            x: 0,
            y: 80,
            duration: 1,
            ease: "none",
          },
          0,
        );

        return () => {
          timeline?.scrollTrigger?.kill();
          timeline?.kill();
        };
      });

      // mm.add("(min-width: 769px)", () => {
      //   /*
      //    * Video starts large enough to completely
      //    * cover the background image.
      //    */
      //   gsap.set(videoWrap, {
      //     scale: 1.55,
      //     transformOrigin: "center center",
      //   });

      //   gsap.set(image, {
      //     scale: 1,
      //     opacity: 1,
      //   });

      //   timeline = gsap.timeline({
      //     scrollTrigger: {
      //       trigger: section,

      //       /*
      //        * Pin immediately when the section
      //        * reaches the viewport.
      //        */
      //       start: "top top",

      //       /*
      //        * More scroll distance gives the
      //        * scale animation enough time.
      //        */
      //       end: "+=180%",

      //       scrub: 1.2,

      //       pin: stage,

      //       pinSpacing: true,

      //       anticipatePin: 1,

      //       invalidateOnRefresh: true,

      //       onEnter: () => {
      //         void video.play().catch(() => undefined);
      //       },

      //       onEnterBack: () => {
      //         void video.play().catch(() => undefined);
      //       },
      //     },
      //   });

      //   /*
      //    * DOWN:
      //    * Fullscreen/covering video -> small video.
      //    *
      //    * UP:
      //    * Small video -> fullscreen/covering video.
      //    */
      //   timeline.to(
      //     videoWrap,
      //     {
      //       scale: 0.35,

      //       ease: "none",

      //       duration: 1,
      //     },
      //     0,
      //   );

      //   return () => {
      //     timeline?.scrollTrigger?.kill();
      //     timeline?.kill();
      //   };
      // });

      // ==========================================
      // MOBILE
      // ==========================================

      mm.add("(max-width: 768px)", () => {
        gsap.set(videoWrap, {
          scale: 1.25,
          transformOrigin: "center center",
        });

        timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,

            start: "top top",

            end: "+=120%",

            scrub: 1,

            pin: stage,

            pinSpacing: true,

            anticipatePin: 1,

            invalidateOnRefresh: true,
          },
        });

        timeline.to(videoWrap, {
          scale: 0.55,
          ease: "none",
        });

        return () => {
          timeline?.scrollTrigger?.kill();
          timeline?.kill();
        };
      });

      ScrollTrigger.refresh();
    });

    return () => {
      disposed = true;

      timeline?.scrollTrigger?.kill();
      timeline?.kill();

      mm?.revert();

      gsap.killTweensOf(videoWrap);
      gsap.killTweensOf(image);
    };
  }, []);

  const toggleSound = () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const nextMuted = !muted;

    video.muted = nextMuted;

    setMuted(nextMuted);

    if (!nextMuted) {
      void video.play().catch(() => undefined);
    }
  };

  return (
    <section ref={sectionRef} className="studio-video-reveal">
      <div ref={stageRef} className="studio-video-reveal__stage">
        {/* Background image */}
        <Image
          ref={imageRef}
          src="/assets/images/home/studio.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="studio-video-reveal__background"
        />

        {/* Video */}
        <div ref={videoWrapRef} className="studio-video-reveal__video-wrap">
          <video
            ref={videoRef}
            src="https://noth-in.b-cdn.net/NOTHIN_MANIFESTE_CLEAN.mp4"
            className="studio-video-reveal__video"
            autoPlay
            loop
            muted={muted}
            playsInline
            preload="auto"
            crossOrigin="anonymous"
          />

          {/* Transparent frame over the video */}
          <Image
            src="https://cdn.prod.website-files.com/6a0c501c42b9751b78a9d1a7/6a281a4f86f15756a04aa88e_test-cadre-transparent.webp"
            alt=""
            fill
            priority
            sizes="(min-width: 769px) 90vw, 94vw"
            className="studio-video-reveal__frame"
          />
        </div>

        <button
          type="button"
          className="studio-video-reveal__sound"
          onClick={toggleSound}
          aria-label={muted ? "Enable sound" : "Mute sound"}
        >
          <span>Sound</span>

          <span
            className={`studio-video-reveal__toggle ${
              !muted ? "studio-video-reveal__toggle--active" : ""
            }`}
          >
            <span className="studio-video-reveal__toggle-dot" />
          </span>
        </button>
      </div>
    </section>
  );
}
