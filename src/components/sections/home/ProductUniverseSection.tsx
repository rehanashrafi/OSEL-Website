import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { pages } from "@/data/navigation";
export function ProductUniverseSection() {
  return (
    <section
      aria-labelledby="universe-title"
      data-universe
      className="relative overflow-hidden"
    >
      <div className="site-container pb-12 pt-24">
        <SectionLabel number="04">Explore our products</SectionLabel>
        <h2 id="universe-title" className="heading-xl mt-6">
          Two worlds.
          <br />
          <span className="text-subdued">One engineering mindset.</span>
        </h2>
      </div>
      <div className="universe-split">
        <article
          data-universe-panel
          className="universe-panel group relative isolate flex min-h-[650px] flex-col justify-between overflow-hidden border-y border-line p-[var(--container-padding)]"
        >
          <Image
            src="/assets/images/applications/indoor-led-atrium.webp"
            alt=""
            fill
            sizes="(min-width: 1024px) 65vw, 100vw"
            className="-z-20 object-cover opacity-40 transition-opacity group-hover:opacity-60"
          />
          <div className="universe-shade absolute inset-0 -z-10" />
          <p className="text-label text-subdued">01 / Visual technology</p>
          <div className="py-12">
            <p aria-hidden="true" className="display-lg">
              VISION<span className="text-brand">.</span>
            </p>
            <h3 className="heading-md mt-5">LED Display Screens</h3>
            <p className="body-md mt-5 max-w-sm text-subdued">
              Indoor and outdoor LED display screens designed to create
              captivating visual experiences.
            </p>
            <Button href={pages.led.href} variant="outline" className="mt-8">
              Explore displays
            </Button>
          </div>
          <div
            aria-hidden="true"
            className="pixel-field h-9 w-full opacity-70"
          />
        </article>
        <article
          data-universe-panel
          className="universe-panel group relative isolate flex min-h-[650px] flex-col justify-between overflow-hidden border-y border-line p-[var(--container-padding)]"
        >
          <Image
            src="/assets/images/home/hearing.webp"
            alt=""
            fill
            sizes="(min-width: 1024px) 65vw, 100vw"
            className="-z-20 object-cover opacity-20 grayscale transition-opacity group-hover:opacity-35"
          />
          <div className="universe-shade absolute inset-0 -z-10" />
          <p className="text-label text-subdued">02 / Hearing technology</p>
          <div className="py-12">
            <p aria-hidden="true" className="display-lg">
              SOUND<span className="text-brand">.</span>
            </p>
            <h3 className="heading-md mt-5">Hearing Aids</h3>
            <p className="body-md mt-5 max-w-sm text-subdued">
              Hearing devices tailored to individual needs, supporting clear
              sound and enhanced speech understanding.
            </p>
            <Button
              href={pages.hearing.href}
              variant="outline"
              className="mt-8"
            >
              Explore hearing aids
            </Button>
          </div>
          <div aria-hidden="true" className="wave-lines h-9 w-full" />
        </article>
      </div>
    </section>
  );
}
