"use client";

import { CrmPageTemplate } from "@/components/crm/CrmPageTemplate";

export default function CampaignPage() {
  return (
    <CrmPageTemplate
      breadcrumb="CRM / Configuration / Campaign"
      title="Marketing Campaigns"
      description="Monitor active and completed outreach campaigns with budget allocations."
      addLabel="Add Campaign"
      apiEndpoint="/crm/master/campaigns"
      columns={[
        { key: "name", label: "Campaign Name" },
        { key: "channel", label: "Channel" },
        { key: "budget", label: "Budget" },
        { key: "start", label: "Start Date" },
        { key: "end", label: "End Date" },
        { key: "status", label: "Status" },
      ]}
      createFields={[
        { key: "name", label: "Campaign Name", type: "text", required: true, placeholder: "e.g. Waterfront Plot Launch" },
        { key: "channel", label: "Marketing Channel", type: "text", placeholder: "e.g. Digital & Billboard" },
        { key: "budget", label: "Budget (BDT)", type: "number", placeholder: "e.g. 500000" },
        { key: "start_date", label: "Start Date", type: "date" },
        { key: "end_date", label: "End Date", type: "date" },
        { key: "description", label: "Description", type: "textarea", placeholder: "Campaign objectives..." },
      ]}
    />
  );
}
