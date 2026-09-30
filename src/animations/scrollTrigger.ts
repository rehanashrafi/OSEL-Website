"use client";

import { gsap } from "./gsap";

// Load browser-only functionality only when explicitly requested on the client.
export async function loadScrollTrigger() {
  if (typeof window === "undefined") return undefined;

  const { ScrollTrigger } = await import("gsap/ScrollTrigger");
  gsap.registerPlugin(ScrollTrigger);
  return ScrollTrigger;
}
