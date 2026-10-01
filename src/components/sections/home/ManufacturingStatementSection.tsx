import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealText } from "@/components/ui/RevealText";
import { pages } from "@/data/navigation";
export function ManufacturingStatementSection() {
  return (
    <section
      data-manufacturing
      aria-labelledby="manufacturing-title"
      className="relative overflow-hidden py-28 md:py-40"
    >
      <div className="site-container relative z-10" data-reveal-section>
        <SectionLabel number="05">Greater Noida, India</SectionLabel>
        <h2
          id="manufacturing-title"
          className="heading-xl md:display-lg mb-12 mt-8 uppercase"
        >
          <RevealText>Built with precision.</RevealText>
          <RevealText className="text-subdued">Manufactured</RevealText>
          <RevealText className="text-subdued">for impact.</RevealText>
        </h2>
      </div>
      <div
        data-factory-mask
        className="relative aspect-[4/3] overflow-hidden md:aspect-[2.4/1]"
      >
        <Image
          data-factory-image
          src="/assets/images/applications/led-manufacturing-quality-inspection.webp"
          alt="Illustrative LED display module assembly and quality inspection scene"
          fill
          sizes="100vw"
          className="object-cover grayscale"
        />
        <div className="absolute inset-0 bg-canvas/20" />
      </div>
      <div className="site-container mt-10 flex flex-wrap items-center justify-between gap-8">
        <p className="body-md max-w-lg text-subdued">
          Advanced technology and a state-of-the-art facility. Our commitment to
          quality and precision takes shape in Greater Noida.
        </p>
        <Button href={pages.manufacturing.href} variant="outline">
          Inside our manufacturing
        </Button>
      </div>
    </section>
  );
}
