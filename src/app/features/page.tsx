import ConstructionRealEstate from "@/components/features/ConstructionRealEstate";
import PropertiesContent from "@/components/features/PropertiesContent";
import Cta from "@/components/home/cta";
import LandOwners from "@/components/home/land-owners";
import ModuleGrid from "@/components/home/module-grid";
import { SiteShell } from "@/components/site/SiteNav";


export default function FeaturesPage() {
  return (
    <SiteShell>
      <ConstructionRealEstate />
      <ModuleGrid />
      <LandOwners />
      <PropertiesContent />
      <Cta />
    </SiteShell>
  );
}
