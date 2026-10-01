import Image from "next/image";
import { oselPillars } from "@/data/home";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function WhyOselSection() {
  return (
    <section
      data-pillar-section
      aria-labelledby="why-title"
      className="relative border-y border-line bg-secondary"
    >
      <div data-pillar-pin className="site-container py-24">
        <SectionLabel number="03">Why choose Ösel</SectionLabel>

        <h2 id="why-title" className="heading-md mt-6 text-subdued">
          The thinking behind the technology.
        </h2>

        <div data-pillar-stage className="relative mt-14">
          {oselPillars.map((pillar, index) => (
            <article
              data-pillar
              key={pillar.title}
              className="pillar-story grid items-center gap-10 border-t border-line py-12 lg:grid-cols-2 lg:gap-16"
            >
              <div>
                <p className="text-label mb-8 text-brand">
                  {String(index + 1).padStart(2, "0")} / 05
                </p>

                <h3 className="heading-xl max-w-xl">{pillar.title}</h3>

                <p className="body-lg mt-8 max-w-md text-subdued">
                  {pillar.description}
                </p>
              </div>

              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={pillar.image}
                  alt={pillar.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </article>
          ))}
        </div>

        <div
          data-pillar-progress-wrap
          className="mt-8 hidden items-center gap-5"
        >
          <span className="text-label text-muted">01</span>

          <div className="h-px flex-1 overflow-hidden bg-line">
            <div
              data-pillar-progress
              className="h-full origin-left scale-x-[0.2] bg-brand"
            />
          </div>

          <span className="text-label text-muted">05</span>
        </div>
      </div>
    </section>
  );
}
