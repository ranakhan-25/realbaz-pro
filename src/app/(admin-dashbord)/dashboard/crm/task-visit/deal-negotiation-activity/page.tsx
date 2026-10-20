"use client";

import { CrmPageTemplate } from "@/components/crm/CrmPageTemplate";

export default function DealNegotiationActivityPage() {
  return (
    <CrmPageTemplate
      breadcrumb="CRM / Tasks & Visits / Deal Negotiations"
      title="Deal Price Negotiations"
      description="Review client price offers, special payment schedules, and executive board discount approvals."
      addLabel="Initiate Negotiation"
      apiEndpoint="/crm/negotiations"
      transformData={(negotiations: any[]) =>
        negotiations.map((n) => ({
          id: n.uuid || n.id,
          property: n.property_id || "Prime Plot",
          offer: `${Number(n.offer_price || 0).toLocaleString()} BDT`,
          agreed: `${Number(n.agreed_price || 0).toLocaleString()} BDT`,
          discount: `${Number(n.discount_amount || 0).toLocaleString()} BDT`,
          status: (n.approval_status || "Pending").toUpperCase(),
          approvedBy: n.approved_by || "Pending Director Review",
        }))
      }
      columns={[
        { key: "property", label: "Property Identifier" },
        { key: "offer", label: "Client Offer" },
        { key: "agreed", label: "Agreed Price" },
        { key: "discount", label: "Discount Granted" },
        { key: "status", label: "Approval Status" },
        { key: "approvedBy", label: "Approved By" },
      ]}
      createFields={[
        { key: "property_id", label: "Property Identifier", type: "text", required: true, placeholder: "e.g. PLOT-SEC17-4A" },
        { key: "offer_price", label: "Client Offer Price (BDT)", type: "number", required: true, placeholder: "9000000" },
        { key: "agreed_price", label: "Agreed Sale Price (BDT)", type: "number", required: true, placeholder: "8600000" },
        { key: "discount_amount", label: "Special Discount (BDT)", type: "number", defaultValue: 0 },
        { key: "special_terms", label: "Negotiation Terms", type: "textarea", placeholder: "Custom installment terms..." },
      ]}
    />
  );
}
