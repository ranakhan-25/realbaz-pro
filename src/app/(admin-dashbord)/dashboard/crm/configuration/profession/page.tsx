"use client";

import { CrmPageTemplate } from "@/components/crm/CrmPageTemplate";

export default function ProfessionPage() {
  return (
    <CrmPageTemplate
      breadcrumb="CRM / Configuration / Profession"
      title="Client Professions"
      description="Categorize lead profiles by occupational sector."
      addLabel="Add Profession"
      apiEndpoint="/crm/master/professions"
      columns={[
        { key: "name", label: "Profession Title" },
        { key: "description", label: "Description" },
        { key: "status", label: "Status" },
      ]}
      createFields={[
        { key: "name", label: "Profession Title", type: "text", required: true, placeholder: "e.g. Senior Medical Consultant" },
        { key: "description", label: "Description", type: "textarea", placeholder: "Sector notes..." },
      ]}
    />
  );
}
