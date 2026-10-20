"use client";

import { CrmPageTemplate } from "@/components/crm/CrmPageTemplate";

export default function OffersPage() {
  return (
    <CrmPageTemplate
      breadcrumb="CRM / Configuration / Offers & Features"
      title="Property Features & Special Offers"
      description="Manage plot specifications, corner premiums, and special promotional offers."
      addLabel="Add Feature"
      apiEndpoint="/crm/master/features"
      columns={[
        { key: "name", label: "Feature / Offer Title" },
        { key: "code", label: "Code" },
        { key: "description", label: "Description" },
      ]}
      createFields={[
        { key: "name", label: "Feature / Offer Name", type: "text", required: true, placeholder: "e.g. Corner Plot Lake-Facing" },
        { key: "code", label: "Code", type: "text", placeholder: "e.g. CNR-LK" },
        { key: "description", label: "Description", type: "textarea", placeholder: "Special terms and features..." },
      ]}
    />
  );
}
