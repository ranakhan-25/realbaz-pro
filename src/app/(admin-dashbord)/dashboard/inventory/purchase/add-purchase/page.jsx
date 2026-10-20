"use client";

import PurchaseForm from "@/components/inventory/PurchaseForm";
import { RouteBreadcrumb } from "@/components/ui/RouteBreadcrumb";
import { FiArrowLeft } from "react-icons/fi";

const PurchaseAccounts = () => {
  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 font-sans">
      {/* Top Header & Navigation Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <RouteBreadcrumb />
          <h1 className="text-xl font-bold mt-1">Purchase</h1>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Purchase List Button */}
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex items-center gap-2 bg-[#334155] hover:bg-[#1e293b] text-white px-4 py-2 rounded text-sm font-medium shadow-sm transition-all"
          >
            <FiArrowLeft className="text-base" />
            Purchase List
          </button>
        </div>
      </div>

      {/* Child Component for Purchase Form & Tables */}
      <PurchaseForm />
    </div>
  );
};

export default PurchaseAccounts;
