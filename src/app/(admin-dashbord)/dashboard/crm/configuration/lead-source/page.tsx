"use client";

import { CrmPageTemplate } from "@/components/crm/CrmPageTemplate";

export default function LeadSourcePage() {
  return (
    <CrmPageTemplate
      breadcrumb="CRM / Configuration / Lead Source"
      title="Lead Acquisition Sources"
      description="Track the marketing and outreach channels where inquiries originate."
      addLabel="Add Source"
      apiEndpoint="/crm/master/sources"
      columns={[
        { key: "name", label: "Source Name" },
        { key: "code", label: "Code" },
        { key: "status", label: "Status" },
      ]}
      createFields={[
        { key: "name", label: "Source Name", type: "text", required: true, placeholder: "e.g. Property Expo 2026" },
        { key: "code", label: "Code", type: "text", placeholder: "e.g. EXPO-26" },
      ]}
    />
  );
}
