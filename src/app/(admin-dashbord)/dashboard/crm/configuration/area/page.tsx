"use client";

import { CrmPageTemplate } from "@/components/crm/CrmPageTemplate";

export default function AreaPage() {
  return (
    <CrmPageTemplate
      breadcrumb="CRM / Configuration / Area"
      title="Areas & Locations"
      description="Manage geographical zones and development sectors for property mapping."
      addLabel="Add Area"
      apiEndpoint="/crm/master/areas"
      columns={[
        { key: "name", label: "Area Name" },
        { key: "city", label: "City" },
        { key: "zone", label: "Zone / Sector" },
      ]}
      createFields={[
        { key: "name", label: "Area Name", type: "text", required: true, placeholder: "e.g. Purbachal Sector 17" },
        { key: "city", label: "City", type: "text", defaultValue: "Dhaka", placeholder: "e.g. Dhaka" },
        { key: "zone", label: "Zone / Sector", type: "text", placeholder: "e.g. East Zone" },
      ]}
    />
  );
}
