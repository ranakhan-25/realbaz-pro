"use client";

import React from "react";

export interface ItemHistory {
  id: number;
  date: string;
  invoiceNo: string;
  project: string;
  task: string;
  in: number;
  out: number;
  balance: number;
  unitCost: number;
  subTotal: number;
  category?: string;
  itemName?: string;
  site?: string;
}

interface ItemHistoryTableProps {
  items: ItemHistory[];
  paginatedItems: ItemHistory[];
  currentPage: number;
  entriesPerPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function ItemHistoryTable({
  items,
  paginatedItems,
  currentPage,
  entriesPerPage,
  totalPages,
  onPageChange,
}: ItemHistoryTableProps) {
  return (
    <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[var(--sidebar-foreground)] text-white font-semibold select-none whitespace-nowrap">
              <th className="py-3 px-3">ID</th>
              <th className="py-3 px-3">DATE</th>
              <th className="py-3 px-3">INVOICE NO</th>
              <th className="py-3 px-3">PROJECT</th>
              <th className="py-3 px-3">TASK</th>
              <th className="py-3 px-3 text-right">IN</th>
              <th className="py-3 px-3 text-right">OUT</th>
              <th className="py-3 px-3 text-right">BANANCE</th>
              <th className="py-3 px-3 text-right">UNIT COST</th>
              <th className="py-3 px-3 text-right">SUB TOTAL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedItems.length > 0 ? (
              paginatedItems.map((item, index) => (
                <tr key={item.id} className="hover:bg-muted/50 transition-colors whitespace-nowrap">
                  <td className="py-3 px-3 font-medium">{(currentPage - 1) * entriesPerPage + index + 1}</td>
                  <td className="py-3 px-3 text-muted-foreground">{item.date}</td>
                  <td className="py-3 px-3 text-indigo-600 hover:underline cursor-pointer">{item.invoiceNo}</td>
                  <td className="py-3 px-3 text-muted-foreground">{item.project}</td>
                  <td className="py-3 px-3 text-muted-foreground">{item.task}</td>
                  <td className="py-3 px-3 text-right text-muted-foreground">{item.in.toFixed(2)}</td>
                  <td className="py-3 px-3 text-right text-muted-foreground">{item.out.toFixed(2)}</td>
                  <td className="py-3 px-3 text-right text-muted-foreground">{item.balance.toFixed(2)}</td>
                  <td className="py-3 px-3 text-right text-muted-foreground">{item.unitCost.toFixed(2)}</td>
                  <td className="py-3 px-3 text-right font-medium">{item.subTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="text-center py-8 text-muted-foreground">
                  No data available in table
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-border gap-4 text-xs text-muted-foreground">
        <div>
          Showing {items.length > 0 ? (currentPage - 1) * entriesPerPage + 1 : 0} to{" "}
          {Math.min(currentPage * entriesPerPage, items.length)} of {items.length} entries
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded border border-border bg-card hover:bg-muted disabled:opacity-50 transition-colors"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`px-3 py-1.5 rounded font-medium transition-colors shadow-sm ${
                  currentPage === pageNum
                    ? "bg-[#4f46e5] text-white"
                    : "border border-border bg-card hover:bg-muted text-foreground"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1.5 rounded border border-border bg-card hover:bg-muted disabled:opacity-50 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}