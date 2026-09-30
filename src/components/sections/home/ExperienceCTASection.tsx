import { Button } from "@/components/ui/Button";
import { RevealText } from "@/components/ui/RevealText";
import { pages } from "@/data/navigation";
export function ExperienceCTASection() {
  return <section data-cta data-reveal-section aria-labelledby="experience-title" className="relative isolate flex min-h-svh items-center overflow-hidden py-28"><div aria-hidden="true" data-cta-glow className="conversion-glow pointer-events-none absolute -z-10" /><div className="site-container"><p className="text-label mb-10 text-subdued">The next experience starts here</p><h2 id="experience-title" className="heading-xl md:display-xl uppercase"><RevealText>Ready to</RevealText><RevealText>elevate your</RevealText><RevealText className="text-subdued">experience?</RevealText></h2><div className="mt-12 flex flex-wrap gap-4"><Button href={pages.products.href}>Explore products</Button><Button href={pages.contact.href} variant="outline">Contact OSEL</Button></div><p className="body-sm mt-8 max-w-md text-muted">Discover our products and how they can help you achieve your goals.</p></div></section>;
}

