"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { common } from "@/data/common";

const TRAIL_COUNT = 5;

type Point = {
  x: number;
  y: number;
};

export function OselCursorFollower() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const canHover = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;

    if (!canHover) return;

    const items = Array.from(
      root.querySelectorAll<HTMLImageElement>(".osel-cursor-trail__item"),
    );

    if (!items.length) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let frameId = 0;
    let hasMoved = false;

    const positions: Point[] = items.map(() => ({
      x: mouseX,
      y: mouseY,
    }));

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      if (!hasMoved) {
        hasMoved = true;

        root.classList.add("is-visible");

        positions.forEach((position) => {
          position.x = mouseX;
          position.y = mouseY;
        });
      }
    };

    const handleMouseLeave = () => {
      root.classList.remove("is-visible");
    };

    const handleMouseEnter = () => {
      if (hasMoved) {
        root.classList.add("is-visible");
      }
    };

    const animate = () => {
      // Main logo follows the cursor.
      positions[0].x += (mouseX - positions[0].x) * 0.22;

      positions[0].y += (mouseY - positions[0].y) * 0.22;

      // Each logo follows the previous logo.
      for (let i = 1; i < positions.length; i++) {
        const previous = positions[i - 1];
        const current = positions[i];

        const followSpeed = Math.max(0.08, 0.17 - i * 0.012);

        current.x += (previous.x - current.x) * followSpeed;

        current.y += (previous.y - current.y) * followSpeed;
      }

      items.forEach((item, index) => {
        const point = positions[index];

        const scale = 1 - index * 0.055;

        item.style.transform = `
          translate3d(
            ${point.x - 12}px,
            ${point.y + 10}px,
            0
          )
          scale(${scale})
        `;
      });

      frameId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);

    document.documentElement.addEventListener("mouseleave", handleMouseLeave);

    document.documentElement.addEventListener("mouseenter", handleMouseEnter);

    animate();

    return () => {
      cancelAnimationFrame(frameId);

      window.removeEventListener("mousemove", handleMouseMove);

      document.documentElement.removeEventListener(
        "mouseleave",
        handleMouseLeave,
      );

      document.documentElement.removeEventListener(
        "mouseenter",
        handleMouseEnter,
      );
    };
  }, []);

  // No logo available.
  if (!common[0]) {
    return null;
  }

  return (
    <div ref={rootRef} className="osel-cursor-trail" aria-hidden="true">
      {Array.from({
        length: TRAIL_COUNT,
      }).map((_, index) => (
        <Image
          key={index}
          src={common[0].image}
          alt=""
          width={28}
          height={28}
          sizes="28px"
          draggable={false}
          priority
          className={`osel-cursor-trail__item osel-cursor-trail__item--${index}`}
        />
      ))}
    </div>
  );
}
