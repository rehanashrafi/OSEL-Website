"use client";
import { useRef } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { launchProducts } from "@/data/products";
import { pages } from "@/data/navigation";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function ProductLaunchSection() {
  const root = useRef<HTMLElement>(null);
  const step = (direction: number) => {
    const section = root.current;
    if (!section) return;
    const event = new CustomEvent("osel:product-step", {
      detail: direction,
      cancelable: true,
    });
    if (section.dispatchEvent(event)) {
      const viewport = section.querySelector<HTMLElement>(
        "[data-product-viewport]",
      );
      const card = section.querySelector<HTMLElement>("[data-product-card]");
      if (viewport && card)
        viewport.scrollBy({
          left: direction * (card.offsetWidth + 24),
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "instant"
            : "smooth",
        });
    }
  };
  return (
    <section
      ref={root}
      id="display-launches"
      aria-labelledby="launch-title"
      className="relative bg-secondary"
      data-product-section
    >
      <div data-product-pin className="overflow-hidden py-16 lg:py-20">
        <div className="site-container mb-10 flex flex-wrap items-end justify-between gap-8">
          <div>
            <SectionLabel number="01">The new display range</SectionLabel>
            <h2 id="launch-title" className="heading-xl mt-6">
              Nine ways to
              <br />
              <span className="text-subdued">change the view.</span>
            </h2>
          </div>
          <div className="flex items-center gap-8">
            <p className="text-label text-muted">
              <span data-product-index className="text-ink">
                01
              </span>{" "}
              / 09
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => step(-1)}
                aria-label="Previous display"
                className="flex h-12 w-12 items-center justify-center border border-line transition-colors hover:bg-surface-hover"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                onClick={() => step(1)}
                aria-label="Next display"
                className="flex h-12 w-12 items-center justify-center border border-line transition-colors hover:bg-surface-hover"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
        <div
          data-product-viewport
          data-native-scroll
          className="product-viewport overflow-x-auto overscroll-x-contain"
        >
          <div
            data-product-track
            className="product-track flex w-max gap-6 px-[var(--container-padding)]"
          >
            {launchProducts.map((product, index) => (
              <article
                key={product.slug}
                data-product-card
                className="product-slide relative flex shrink-0 flex-col overflow-hidden border border-line bg-canvas"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 70vw, 86vw"
                    // className="object-contain"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute left-6 top-5 font-mono text-sm text-media-label bg-media-label-bg px-2 py-1"
                  >
                    {String(index + 1).padStart(2, "0")} / ÖSEL
                  </span>
                </div>
                <div className="flex flex-1 flex-col justify-between gap-5 p-6 md:flex-row md:items-end md:p-8">
                  <div>
                    <h3 className="heading-lg">{product.name}</h3>
                    <p className="body-sm mt-3 max-w-xs text-subdued">
                      {product.description}
                    </p>
                  </div>
                  <Button
                    href={`${pages.led.href}/${product.slug}`}
                    variant="ghost"
                    className="shrink-0 self-start !px-0 md:self-end"
                  >
                    Explore product
                    <span className="sr-only">: {product.name}</span>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="site-container mt-8">
          <div className="h-px overflow-hidden bg-line">
            <div
              data-product-progress
              className="h-full w-full origin-left scale-x-[0.111] bg-brand"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
