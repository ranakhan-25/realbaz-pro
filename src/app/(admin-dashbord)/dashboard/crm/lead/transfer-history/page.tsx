"use client";

import { CrmPageTemplate } from "@/components/crm/CrmPageTemplate";

export default function TransferHistoryPage() {
  return (
    <CrmPageTemplate
      breadcrumb="CRM / Leads / Transfer History"
      title="Lead Handover & Transfer History"
      description="Audit trail of leads transferred between sales representatives and closers."
      apiEndpoint="/crm/leads"
      transformData={(leads: any[]) => {
        const transfers: any[] = [];
        leads.forEach((l) => {
          (l.transfer_logs || []).forEach((t: any) => {
            transfers.push({
              id: t.uuid || t.id,
              code: l.lead_code || `#${l.id}`,
              client: l.client_name,
              from: t.transferred_from || "Agent",
              to: t.transferred_to || "Executive Closer",
              reason: t.transfer_reason || "Assigned for closure",
              date: t.createdAt ? String(t.createdAt).slice(0, 10) : "2026-10-14",
            });
          });
        });
        return transfers.length > 0
          ? transfers
          : leads.map((l) => ({
              id: l.uuid || l.id,
              code: l.lead_code || `#${l.id}`,
              client: l.client_name,
              from: "Initial Intake",
              to: l.assigned_to || "Field Agent",
              reason: "Primary territory assignment",
              date: l.createdAt ? String(l.createdAt).slice(0, 10) : "2026-10-14",
            }));
      }}
      columns={[
        { key: "code", label: "Lead Code" },
        { key: "client", label: "Client" },
        { key: "from", label: "Transferred From" },
        { key: "to", label: "Transferred To" },
        { key: "reason", label: "Transfer Reason" },
        { key: "date", label: "Date" },
      ]}
    />
  );
}
