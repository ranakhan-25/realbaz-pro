"use client";

import { CrmPageTemplate } from "@/components/crm/CrmPageTemplate";

export default function SalesPipelineFunnelReportPage() {
  return (
    <CrmPageTemplate
      breadcrumb="CRM / Reports / Sales Funnel Pipeline"
      title="Sales Pipeline Funnel Analytics"
      description="Stage-by-stage distribution and overall conversion velocity across the sales lifecycle."
      apiEndpoint="/crm/reports/lead-funnel"
      transformData={(funnelData: any) => {
        const raw = Array.isArray(funnelData) ? funnelData[0] : funnelData;
        const stages = raw?.stage_distribution || [];
        const total = raw?.total_leads || 0;

        return stages.map((st: any) => ({
          id: st.stage_id,
          stage: st.stage_name || `Stage #${st.stage_id}`,
          count: st.count || 0,
          share: total > 0 ? `${Math.round(((st.count || 0) / total) * 100)}%` : "0%",
          rate: raw?.conversion_rate || "0.00%",
        }));
      }}
      columns={[
        { key: "stage", label: "Pipeline Stage" },
        { key: "count", label: "Active Lead Count" },
        { key: "share", label: "Share of Total Leads" },
        { key: "rate", label: "Overall Conversion Rate" },
      ]}
    />
  );
}
