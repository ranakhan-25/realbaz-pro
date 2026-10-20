"use client";

import { CrmPageTemplate } from "@/components/crm/CrmPageTemplate";

export default function JunkLeadPage() {
  return (
    <CrmPageTemplate
      breadcrumb="CRM / Leads / Junk Leads"
      title="Junk & Inactive Leads"
      description="Review discarded, uncontactable, or low-intent client inquiries."
      apiEndpoint="/crm/leads"
      transformData={(leads: any[]) =>
        leads
          .filter((l) => l.status === "junk" || l.status === "inactive" || l.lead_score < 30)
          .map((l) => ({
            id: l.uuid || l.id,
            code: l.lead_code || `#${l.id}`,
            name: l.client_name,
            phone: l.phone,
            reason: l.notes || "Low engagement / uncontactable",
            score: l.lead_score ?? 0,
            status: l.status || "Junk",
          }))
      }
      columns={[
        { key: "code", label: "Lead Code" },
        { key: "name", label: "Client Name" },
        { key: "phone", label: "Phone" },
        { key: "reason", label: "Reason / Notes" },
        { key: "score", label: "Score" },
        { key: "status", label: "Status" },
      ]}
    />
  );
}
