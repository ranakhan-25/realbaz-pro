"use client";

import React from "react";

export interface PurchaseItem {
  id: number;
  date: string;
  invoiceNo: string;
  supplierName: string;
  category: string;
  itemName: string;
  quantity: number;
  price: number;
  subTotal: number;
  project: string;
}

interface PurchaseDetailsTableProps {
  purchases: PurchaseItem[];
  paginatedPurchases: PurchaseItem[];
  currentPage: number;
  entriesPerPage: number;
  totalQuantity: number;
  totalSubTotal: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PurchaseDetailsTable({
  purchases,
  paginatedPurchases,
  currentPage,
  entriesPerPage,
  totalQuantity,
  totalSubTotal,
  totalPages,
  onPageChange,
}: PurchaseDetailsTableProps) {
  return (
    <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[var(--sidebar-foreground)] text-white font-semibold select-none whitespace-nowrap">
              <th className="py-3 px-3">ID</th>
              <th className="py-3 px-3">DATE</th>
              <th className="py-3 px-3">INVOICE NO</th>
              <th className="py-3 px-3">SUPPLIER NAME</th>
              <th className="py-3 px-3">CATEGORY</th>
              <th className="py-3 px-3">ITEM NAME</th>
              <th className="py-3 px-3">QUANTITY</th>
              <th className="py-3 px-3">PRICE</th>
              <th className="py-3 px-3">SUB TOTAL</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedPurchases.length > 0 ? (
              paginatedPurchases.map((item, index) => (
                <tr key={item.id} className="hover:bg-muted/50 transition-colors whitespace-nowrap">
                  <td className="py-3 px-3 font-medium">
                    {(currentPage - 1) * entriesPerPage + index + 1}
                  </td>
                  <td className="py-3 px-3 text-muted-foreground">{item.date}</td>
                  <td className="py-3 px-3 font-medium text-indigo-600">{item.invoiceNo}</td>
                  <td className="py-3 px-3 text-muted-foreground">{item.supplierName}</td>
                  <td className="py-3 px-3 text-muted-foreground">{item.category}</td>
                  <td className="py-3 px-3 text-muted-foreground">{item.itemName}</td>
                  <td className="py-3 px-3">{item.quantity.toLocaleString()}</td>
                  <td className="py-3 px-3">{item.price.toLocaleString()}</td>
                  <td className="py-3 px-3 font-medium">{item.subTotal.toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center py-8 text-muted-foreground">
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
              <td className="py-3 px-3"></td>
              <td className="py-3 px-3"></td>
              <td className="py-3 px-3"></td>
              <td className="py-3 px-3"></td>
              <td className="py-3 px-3">{totalQuantity.toLocaleString()}</td>
              <td className="py-3 px-3"></td>
              <td className="py-3 px-3">{totalSubTotal.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-border gap-4 text-xs text-muted-foreground">
        <div>
          Showing {purchases.length > 0 ? (currentPage - 1) * entriesPerPage + 1 : 0} to{" "}
          {Math.min(currentPage * entriesPerPage, purchases.length)} of {purchases.length} entries
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded border border-border bg-card hover:bg-muted disabled:opacity-50 transition-colors"
          >
            Previous
          </button>
          <span className="px-3 py-1.5 bg-[var(--sidebar-foreground, #6366f1)] text-white rounded font-medium">
            {currentPage}
          </span>
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
