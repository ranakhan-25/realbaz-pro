"use client";

import { CrmPageTemplate } from "@/components/crm/CrmPageTemplate";

export default function LeadStagePage() {
  return (
    <CrmPageTemplate
      breadcrumb="CRM / Configuration / Lead Stage"
      title="Pipeline Stages"
      description="Define the funnel lifecycle journey from initial inquiry through deal closure."
      addLabel="Add Stage"
      apiEndpoint="/crm/master/stages"
      columns={[
        { key: "name", label: "Stage Name" },
        { key: "order", label: "Pipeline Order" },
        { key: "color", label: "Color Badge" },
        { key: "status", label: "Status" },
      ]}
      createFields={[
        { key: "name", label: "Stage Name", type: "text", required: true, placeholder: "e.g. Negotiation" },
        { key: "order", label: "Funnel Order Number", type: "number", required: true, placeholder: "e.g. 3" },
        { key: "color", label: "Color Hex", type: "text", defaultValue: "#0000F2", placeholder: "#0000F2" },
      ]}
    />
  );
}
