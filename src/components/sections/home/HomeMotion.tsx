"use client";
import { useEffect, useRef, type ReactNode } from "react";
export function HomeMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const controller = new AbortController();
    let cleanup: (() => void) | undefined;
    // Cancel before either async boundary can create a second animation context.
    void import("@/animations/homeScroll")
      .then(async ({ setupHomeScroll }) => {
        if (controller.signal.aborted) return;
        const teardown = await setupHomeScroll(element, controller.signal);
        if (controller.signal.aborted) teardown();
        else cleanup = teardown;
      })
      .catch(() => {
        // Animation is progressive enhancement; setup rolls back to the server-visible layout.
        if (!controller.signal.aborted)
          element.dataset.motionReady = "fallback";
      });
    return () => {
      controller.abort();
      cleanup?.();
    };
  }, []);
  return (
    <div ref={root} data-home className="home-experience">
      {children}
    </div>
  );
}
