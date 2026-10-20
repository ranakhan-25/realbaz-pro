import { SiteShell } from "@/components/site/SiteNav";

import Hero from "@/components/home/Hero";
import Milestones from "@/components/home/milestones";
import SolutionsGrid from "@/components/home/solutions-grid";
import WhyRealBiz from "@/components/home/why-realbiz";
import ModuleGrid from "@/components/home/module-grid";
import LatestModules from "@/components/home/latest-modules";
import LandOwners from "@/components/home/land-owners";
import Agencies from "@/components/home/agencies";
import Process from "@/components/home/process";
import FeaturesPage from "@/components/home/Features";
import TestimonialCarousel from "@/components/home/testimonials";
import Faq from "@/components/home/faq";
import Cta from "@/components/home/cta";
import { RealEstateServices } from "@/components/home/RealEstateServices";
import { PricingClient } from "@/components/pricing/pricing-client";
import StorylineLegacy from "@/components/home/StorylineLegacy";
import JoinAsPartner from "@/components/home/JoinAsPartner";
import JoinAsBuyer from "@/components/home/JoinAsBuyer";

export default function HomePage() {
  return (
    <SiteShell>
      <main className="flex flex-col gap-y-6">
        <Hero />
        <Milestones />

        <SolutionsGrid />
        <WhyRealBiz />
        <StorylineLegacy/>
        
        <JoinAsPartner />
        <JoinAsBuyer />
        
        <ModuleGrid />
        <LatestModules />

        <Agencies />
        <RealEstateServices />

        <Process />
        <FeaturesPage />

        <TestimonialCarousel />

        <PricingClient/>
        <Cta />
      </main>
    </SiteShell>
  );
}