import { HeroSection } from "@/components/sections/home/HeroSection";
import { ProductLaunchSection } from "@/components/sections/home/ProductLaunchSection";
import { WelcomeSection } from "@/components/sections/home/WelcomeSection";
import { WhyOselSection } from "@/components/sections/home/WhyOselSection";
import { ProductUniverseSection } from "@/components/sections/home/ProductUniverseSection";
import { ManufacturingStatementSection } from "@/components/sections/home/ManufacturingStatementSection";
import { ClienteleSection } from "@/components/sections/home/ClienteleSection";
import { JourneySection } from "@/components/sections/home/JourneySection";
import { ExperienceCTASection } from "@/components/sections/home/ExperienceCTASection";
import { HomeMotion } from "@/components/sections/home/HomeMotion";

export default function HomePage() {
  return <HomeMotion><HeroSection /><ProductLaunchSection /><WelcomeSection /><WhyOselSection /><ProductUniverseSection /><ManufacturingStatementSection /><ClienteleSection /><JourneySection /><ExperienceCTASection /></HomeMotion>;
}
