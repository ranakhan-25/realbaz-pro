"use client";

import { CrmPageTemplate } from "@/components/crm/CrmPageTemplate";

export default function LeadCategoryPage() {
  return (
    <CrmPageTemplate
      breadcrumb="CRM / Configuration / Lead Category"
      title="Lead Categories"
      description="Classify client profiles by investment scale and target property segment."
      addLabel="Add Category"
      apiEndpoint="/crm/master/categories"
      columns={[
        { key: "name", label: "Category Name" },
        { key: "code", label: "Code" },
        { key: "description", label: "Description" },
        { key: "status", label: "Status" },
      ]}
      createFields={[
        { key: "name", label: "Category Name", type: "text", required: true, placeholder: "e.g. VIP Investor" },
        { key: "code", label: "Category Code", type: "text", placeholder: "e.g. CAT-VIP" },
        { key: "description", label: "Description", type: "textarea", placeholder: "Target demographic notes..." },
      ]}
    />
  );
}
