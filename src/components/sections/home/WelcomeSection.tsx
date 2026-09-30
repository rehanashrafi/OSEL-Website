import { companyIntroduction } from "@/data/home";
import { pages } from "@/data/navigation";
import { Button } from "@/components/ui/Button";
import { RevealText } from "@/components/ui/RevealText";
import { SectionLabel } from "@/components/ui/SectionLabel";
export function WelcomeSection() {
  return <section className="site-container relative grid gap-14 py-28 md:py-40 lg:grid-cols-[1.3fr_1fr]" aria-labelledby="welcome-title" data-reveal-section>
    <div><SectionLabel number="02">Welcome to Ösel</SectionLabel><h2 id="welcome-title" className="heading-xl mt-10 uppercase"><RevealText>Where innovation</RevealText><RevealText>meets</RevealText><RevealText className="text-subdued">ingenuity.</RevealText></h2></div>
    <div className="relative border-l border-line pl-8 lg:mt-20 lg:pl-12"><span data-editorial-line aria-hidden="true" className="absolute inset-y-0 left-0 w-px origin-top bg-brand" /><div className="space-y-6">{companyIntroduction.map((paragraph, index) => <p key={paragraph} data-reveal className={index === 0 ? "body-lg" : "body-md text-subdued"}>{paragraph}</p>)}</div><div className="mt-10"><Button href={pages.about.href} variant="outline">Discover OSEL</Button></div></div>
  </section>;
}
