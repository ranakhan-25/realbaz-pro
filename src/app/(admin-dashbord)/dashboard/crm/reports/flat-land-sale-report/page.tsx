import { CrmPageTemplate } from "@/components/crm/CrmPageTemplate";
import { crmPageData } from "@/lib/crm-dummy-data";

export default function Page() {
  return <CrmPageTemplate {...crmPageData["reports/flat-land-sale-report"]} />;
}
