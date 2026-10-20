"use client";

import { CrmPageTemplate } from "@/components/crm/CrmPageTemplate";

export default function LeadListPage() {
  return (
    <CrmPageTemplate
      breadcrumb="CRM / Leads / Lead Directory"
      title="Lead Management Directory"
      description="Manage potential clients, track lifecycle stages, and monitor sales representative assignments."
      addLabel="Register New Lead"
      apiEndpoint="/crm/leads"
      transformData={(leads: any[]) =>
        leads.map((l) => ({
          id: l.uuid || l.id,
          code: l.lead_code || `#${l.id}`,
          name: l.client_name,
          phone: l.phone,
          category: l.lead_category?.name || "General",
          stage: l.lead_stage?.name || "Initial Inquiry",
          assigned_to: l.assigned_to || "Unassigned",
          priority: (l.priority || "Medium").toUpperCase(),
          score: l.lead_score ?? 0,
          status: l.status || "Active",
        }))
      }
      columns={[
        { key: "code", label: "Lead Code" },
        { key: "name", label: "Client Name" },
        { key: "phone", label: "Phone" },
        { key: "category", label: "Category" },
        { key: "stage", label: "Current Stage" },
        { key: "assigned_to", label: "Assigned Agent" },
        { key: "priority", label: "Priority" },
        { key: "score", label: "Score" },
      ]}
      createFields={[
        { key: "lead_code", label: "Lead Code", type: "text", required: true, placeholder: "e.g. LEAD-2026-001" },
        { key: "client_name", label: "Client Full Name", type: "text", required: true, placeholder: "e.g. Dr. Tariqul Islam" },
        { key: "phone", label: "Primary Phone", type: "text", required: true, placeholder: "+88017XXXXXXXX" },
        { key: "email", label: "Email Address", type: "text", placeholder: "client@example.com" },
        { key: "designation", label: "Designation", type: "text", placeholder: "e.g. Managing Director" },
        { key: "organization", label: "Organization", type: "text", placeholder: "e.g. Apex Hospital" },
        { key: "assigned_to", label: "Assign To Agent ID", type: "text", placeholder: "e.g. USR-AGENT-01" },
        {
          key: "priority",
          label: "Priority Level",
          type: "select",
          defaultValue: "high",
          options: [
            { label: "Low", value: "low" },
            { label: "Medium", value: "medium" },
            { label: "High", value: "high" },
            { label: "Urgent", value: "urgent" },
          ],
        },
        { key: "lead_score", label: "Initial Score (0-100)", type: "number", defaultValue: 75 },
        { key: "notes", label: "Inquiry Remarks", type: "textarea", placeholder: "Property interest notes..." },
      ]}
    />
  );
}
