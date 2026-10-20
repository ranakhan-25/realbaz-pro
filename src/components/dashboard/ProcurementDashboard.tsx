"use client";

import { useState } from "react";
import { PackageSearch } from "lucide-react";

import { ProcurementPeriod } from "@/types/procurement";
import ProcurementFilters from "../procurement/ProcurementFilters";
import ProcurementStats from "../procurement/ProcurementStats";
import OverflowMaterialTable from "../procurement/OverflowMaterialTable";
import PendingVoucherList from "../procurement/PendingVoucherList";

export default function ProcurementDashboard() {
  const [period, setPeriod] = useState<ProcurementPeriod>("today");

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-blue-100 p-3 text-blue-600">
              <PackageSearch size={32} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
                Procurement Dashboard
              </h1>

              <p className="text-sm text-slate-500">
                Manage requisition, purchase and material workflow
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <ProcurementFilters period={period} setPeriod={setPeriod} />

        {/* Stats */}
        <ProcurementStats />

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(350px,1fr)]">
          <div>
            <OverflowMaterialTable />
          </div>

          <div>
            <PendingVoucherList />
          </div>
        </div>
      </div>
    </main>
  );
}
