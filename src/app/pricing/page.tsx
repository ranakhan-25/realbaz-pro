import { PricingClient } from "@/components/pricing/pricing-client";
import { SiteShell } from "@/components/site/SiteNav";

export default function PricingPage() {
  return (
    <SiteShell>
      <PricingClient />
    </SiteShell>
  );
}