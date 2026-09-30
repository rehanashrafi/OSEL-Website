import { Button } from "@/components/ui/Button";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { pages } from "@/data/navigation";
export function JourneySection() {
  return <section data-reveal-section aria-labelledby="journey-title" className="site-container flex min-h-[85svh] flex-col items-center justify-center py-28 text-center"><SectionLabel number="07">Join us in our journey</SectionLabel><span aria-hidden="true" className="signal-point my-12" /><h2 id="journey-title" className="display-lg"><RevealText>Your next possibility.</RevealText><RevealText className="text-subdued">Our shared journey.</RevealText></h2><p data-reveal className="body-lg mx-auto mt-8 max-w-xl text-subdued">Explore innovative solutions for your business and everyday life. OSEL is your partner in technology and innovation.</p><div className="mt-10"><Button href={pages.distributor.href} variant="outline">Partner with OSEL</Button></div></section>;
}
