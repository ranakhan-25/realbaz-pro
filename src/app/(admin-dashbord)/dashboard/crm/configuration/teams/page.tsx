"use client";

import { CrmPageTemplate } from "@/components/crm/CrmPageTemplate";

export default function TeamsPage() {
  return (
    <CrmPageTemplate
      breadcrumb="CRM / Configuration / Teams"
      title="Sales Teams"
      description="Organize sales forces into specialized regional and project squads."
      addLabel="Add Team"
      apiEndpoint="/crm/master/teams"
      columns={[
        { key: "team", label: "Team Name" },
        { key: "department", label: "Department" },
        { key: "lead", label: "Team Lead ID" },
        { key: "status", label: "Status" },
      ]}
      createFields={[
        { key: "name", label: "Team Name", type: "text", required: true, placeholder: "e.g. Alpha Closers Force" },
        { key: "department", label: "Department", type: "text", defaultValue: "Property Sales", placeholder: "e.g. Direct Sales" },
        { key: "leader_id", label: "Team Leader User ID", type: "text", placeholder: "e.g. USR-001" },
      ]}
    />
  );
}
