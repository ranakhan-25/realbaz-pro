"use client";

import React from "react";

export interface StockItem {
  id: number;
  name: string;
  opening: number;
  in: number;
  out: number;
  unit: string;
  closing: number;
  closingAmount: number;
  company?: string;
  project?: string;
  site?: string;
  category?: string;
  brand?: string;
}

interface StockReportTableProps {
  stocks: StockItem[];
  paginatedStocks: StockItem[];
  currentPage: number;
  entriesPerPage: number;
  totalOpening: number;
  totalIn: number;
  totalOut: number;
  totalClosing: number;
  totalClosingAmount: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function StockReportTable({
  stocks,
  paginatedStocks,
  currentPage,
  entriesPerPage,
  totalOpening,
  totalIn,
  totalOut,
  totalClosing,
  totalClosingAmount,
  totalPages,
  onPageChange,
}: StockReportTableProps) {
  return (
    <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[var(--sidebar-foreground)] text-white font-semibold select-none whitespace-nowrap">
              <th className="py-3 px-3">ID</th>
              <th className="py-3 px-3">NAME</th>
              <th className="py-3 px-3 text-right">OPENING</th>
              <th className="py-3 px-3 text-right">IN</th>
              <th className="py-3 px-3 text-right">OUT</th>
              <th className="py-3 px-3">UNIT</th>
              <th className="py-3 px-3 text-right">CLOSING</th>
              <th className="py-3 px-3 text-right">CLOSING AMOUNT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedStocks.length > 0 ? (
              paginatedStocks.map((item, index) => (
                <tr
                  key={item.id}
                  className="hover:bg-muted/50 transition-colors whitespace-nowrap"
                >
                  <td className="py-3 px-3 font-medium">
                    {(currentPage - 1) * entriesPerPage + index + 1}
                  </td>
                  <td className="py-3 px-3 font-medium text-indigo-600 hover:underline cursor-pointer">
                    {item.name}
                  </td>
                  <td className="py-3 px-3 text-right text-muted-foreground">
                    {item.opening.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right text-muted-foreground">
                    {item.in.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right text-muted-foreground">
                    {item.out.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-muted-foreground">
                    {item.unit}
                  </td>
                  <td className="py-3 px-3 text-right text-muted-foreground">
                    {item.closing.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right font-medium">
                    {item.closingAmount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-8 text-muted-foreground"
                >
                  No data available in table
                </td>
              </tr>
            )}
          </tbody>
          {/* Total Row */}
          <tfoot>
            <tr className="bg-muted/30 font-bold border-t-2 border-border whitespace-nowrap">
              <td className="py-3 px-3">TOTAL</td>
              <td className="py-3 px-3"></td>
              <td className="py-3 px-3 text-right">
                {totalOpening.toLocaleString()}
              </td>
              <td className="py-3 px-3 text-right">
                {totalIn.toLocaleString()}
              </td>
              <td className="py-3 px-3 text-right">
                {totalOut.toLocaleString()}
              </td>
              <td className="py-3 px-3"></td>
              <td className="py-3 px-3 text-right">
                {totalClosing.toLocaleString()}
              </td>
              <td className="py-3 px-3 text-right">
                {totalClosingAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-border gap-4 text-xs text-muted-foreground">
        <div>
          Showing{" "}
          {stocks.length > 0 ? (currentPage - 1) * entriesPerPage + 1 : 0} to{" "}
          {Math.min(currentPage * entriesPerPage, stocks.length)} of{" "}
          {stocks.length} entries
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
