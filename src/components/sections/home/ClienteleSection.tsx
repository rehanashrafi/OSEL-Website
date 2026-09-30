"use client";
import { useState } from "react";
import Image from "next/image";
import { clients } from "@/data/clients";
import { SectionLabel } from "@/components/ui/SectionLabel";
export function ClienteleSection() {
  const [paused, setPaused] = useState(false);
  return (
    <section
      data-clientele
      data-paused={paused}
      aria-labelledby="clients-title"
      className="overflow-hidden border-y border-line bg-secondary py-20 md:py-28"
    >
      <div className="site-container mb-12 grid items-end gap-8 md:grid-cols-2">
        <div>
          <SectionLabel number="06">Connections built on trust</SectionLabel>
          <h2 id="clients-title" className="heading-lg mt-6">
            Impressive clientele
            <br />
            of Ösel.
          </h2>
        </div>
        <div>
          <p className="body-md max-w-lg text-subdued">
            Organizations and institutions across industries choose OSEL’s LED
            display solutions and hearing aids.
          </p>
          <button
            type="button"
            data-marquee-toggle
            aria-pressed={paused}
            onClick={() => setPaused((value) => !value)}
            className="animated-link mt-4 min-h-11 text-sm"
          >
            {paused ? "Resume logo movement" : "Pause logo movement"}
          </button>
        </div>
      </div>
      {[clients.slice(0, 4), clients.slice(4)].map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="logo-window overflow-hidden border-t border-line"
        >
          <div data-logo-track className="flex w-max">
            {[0, 1].map((copy) => (
              <ul
                key={copy}
                aria-hidden={copy === 1 ? true : undefined}
                className="flex shrink-0"
              >
                {row.map((client) => (
                  <li
                    key={client.slug}
                    className="logo-cell flex h-36 w-[45vw] shrink-0 items-center justify-center border-r border-line px-8 md:h-44 md:w-[25vw]"
                  >
                    <Image
                      src={client.image}
                      alt={copy === 0 ? client.name : ""}
                      width={160}
                      height={160}
                      sizes="160px"
                      className="h-28 w-28 object-contain grayscale transition-all hover:grayscale-0 md:h-36 md:w-36"
                    />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
