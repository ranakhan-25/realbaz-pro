"use client";

import React from "react";

export interface MaterialItem {
  id: number;
  description: string;
  budgetQty: number;
  budgetAmount: number;
  purchaseQty: number;
  purchaseAmount: number;
  issueQty: number;
  issueAmount: number;
  stockQty: number;
  stockAmount: number;
  availableQty: number;
  availableAmount: number;
  status: string;
}

interface MaterialComparisonTableProps {
  data: MaterialItem[];
  paginatedData: MaterialItem[];
  currentPage: number;
  entriesPerPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totals: {
    budgetQty: number;
    budgetAmount: number;
    purchaseQty: number;
    purchaseAmount: number;
    issueQty: number;
    issueAmount: number;
    stockQty: number;
    stockAmount: number;
    availableQty: number;
    availableAmount: number;
  };
}

export default function MaterialComparisonTable({
  data,
  paginatedData,
  currentPage,
  entriesPerPage,
  totalPages,
  onPageChange,
  totals,
}: MaterialComparisonTableProps) {
  const startIndex =
    data.length > 0 ? (currentPage - 1) * entriesPerPage + 1 : 0;
  const endIndex = Math.min(currentPage * entriesPerPage, data.length);

  return (
    <div className="w-full space-y-4 relative z-0">
      {/* Table Container */}
      <div className="w-full max-h-[550px] overflow-y-auto overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-sm shadow-sm bg-white dark:bg-gray-900 relative z-10">
        <table className="w-full min-w-[1300px] text-left border-collapse text-xs relative">
          <thead className="sticky top-0 z-20">
            <tr className="bg-[#6c5ce7] text-white font-semibold uppercase tracking-wider text-[11px] whitespace-nowrap shadow-sm">
              <th className="py-2.5 px-3 border-r border-indigo-400/30 text-center w-12 bg-[#6c5ce7]">
                SL
              </th>
              <th className="py-2.5 px-3 border-r border-indigo-400/30 bg-[#6c5ce7]">
                DESCRIPTION
              </th>
              <th className="py-2.5 px-3 border-r border-indigo-400/30 text-right bg-[#6c5ce7]">
                BUDGET QTY
              </th>
              <th className="py-2.5 px-3 border-r border-indigo-400/30 text-right bg-[#6c5ce7]">
                BUDGET AMOUNT
              </th>
              <th className="py-2.5 px-3 border-r border-indigo-400/30 text-right bg-[#6c5ce7]">
                PURCHASE QTY
              </th>
              <th className="py-2.5 px-3 border-r border-indigo-400/30 text-right bg-[#6c5ce7]">
                PURCHASE AMOUNT
              </th>
              <th className="py-2.5 px-3 border-r border-indigo-400/30 text-right bg-[#6c5ce7]">
                ISSUE QTY
              </th>
              <th className="py-2.5 px-3 border-r border-indigo-400/30 text-right bg-[#6c5ce7]">
                ISSUE AMOUNT
              </th>
              <th className="py-2.5 px-3 border-r border-indigo-400/30 text-right bg-[#6c5ce7]">
                STOCK QTY
              </th>
              <th className="py-2.5 px-3 border-r border-indigo-400/30 text-right bg-[#6c5ce7]">
                STOCK AMOUNT
              </th>
              <th className="py-2.5 px-3 border-r border-indigo-400/30 text-right bg-[#6c5ce7]">
                AVAILABLE QTY
              </th>
              <th className="py-2.5 px-3 border-r border-indigo-400/30 text-right bg-[#6c5ce7]">
                AVAILABLE AMOUNT
              </th>
              <th className="py-2.5 px-3 text-center bg-[#6c5ce7]">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors whitespace-nowrap"
                >
                  <td className="py-2.5 px-3 border-r border-gray-200 dark:border-gray-800 text-center font-medium text-gray-700 dark:text-gray-300">
                    {(currentPage - 1) * entriesPerPage + index + 1}
                  </td>
                  <td className="py-2.5 px-3 border-r border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 font-medium">
                    {item.description}
                  </td>
                  <td className="py-2.5 px-3 border-r border-gray-200 dark:border-gray-800 text-right text-gray-700 dark:text-gray-300">
                    {item.budgetQty.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 border-r border-gray-200 dark:border-gray-800 text-right text-gray-700 dark:text-gray-300">
                    {item.budgetAmount.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 border-r border-gray-200 dark:border-gray-800 text-right text-gray-700 dark:text-gray-300">
                    {item.purchaseQty.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 border-r border-gray-200 dark:border-gray-800 text-right text-gray-700 dark:text-gray-300">
                    {item.purchaseAmount.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 border-r border-gray-200 dark:border-gray-800 text-right text-gray-700 dark:text-gray-300">
                    {item.issueQty.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 border-r border-gray-200 dark:border-gray-800 text-right text-gray-700 dark:text-gray-300">
                    {item.issueAmount.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 border-r border-gray-200 dark:border-gray-800 text-right text-gray-700 dark:text-gray-300">
                    {item.stockQty.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 border-r border-gray-200 dark:border-gray-800 text-right text-gray-700 dark:text-gray-300">
                    {item.stockAmount.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 border-r border-gray-200 dark:border-gray-800 text-right text-gray-700 dark:text-gray-300">
                    {item.availableQty.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 border-r border-gray-200 dark:border-gray-800 text-right text-gray-700 dark:text-gray-300">
                    {item.availableAmount.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-center font-semibold text-gray-800 dark:text-gray-200">
                    {item.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={13}
                  className="py-8 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900"
                >
                  No data available in table
                </td>
              </tr>
            )}
          </tbody>

          {/* Table Footer Totals */}
          {paginatedData.length > 0 && (
            <tfoot className="bg-gray-50 dark:bg-gray-800/90 font-bold text-gray-800 dark:text-gray-100 border-t-2 border-gray-200 dark:border-gray-700">
              <tr>
                <td
                  colSpan={2}
                  className="py-2.5 px-3 border-r border-gray-200 dark:border-gray-700"
                >
                  TOTAL:
                </td>
                <td className="py-2.5 px-3 border-r border-gray-200 dark:border-gray-700 text-right">
                  {totals.budgetQty.toLocaleString()}
                </td>
                <td className="py-2.5 px-3 border-r border-gray-200 dark:border-gray-700 text-right">
                  {totals.budgetAmount.toLocaleString()}
                </td>
                <td className="py-2.5 px-3 border-r border-gray-200 dark:border-gray-700 text-right">
                  {totals.purchaseQty.toLocaleString()}
                </td>
                <td className="py-2.5 px-3 border-r border-gray-200 dark:border-gray-700 text-right">
                  {totals.purchaseAmount.toLocaleString()}
                </td>
                <td className="py-2.5 px-3 border-r border-gray-200 dark:border-gray-700 text-right">
                  {totals.issueQty.toLocaleString()}
                </td>
                <td className="py-2.5 px-3 border-r border-gray-200 dark:border-gray-700 text-right">
                  {totals.issueAmount.toLocaleString()}
                </td>
                <td className="py-2.5 px-3 border-r border-gray-200 dark:border-gray-700 text-right">
                  {totals.stockQty.toLocaleString()}
                </td>
                <td className="py-2.5 px-3 border-r border-gray-200 dark:border-gray-700 text-right">
                  {totals.stockAmount.toLocaleString()}
                </td>
                <td className="py-2.5 px-3 border-r border-gray-200 dark:border-gray-700 text-right">
                  {totals.availableQty.toLocaleString()}
                </td>
                <td className="py-2.5 px-3 border-r border-gray-200 dark:border-gray-700 text-right">
                  {totals.availableAmount.toLocaleString()}
                </td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-gray-500 dark:text-gray-400 relative z-10">
        <div className="text-center sm:text-left">
          Showing {startIndex} to {endIndex} of {data.length} entries
        </div>

        <div className="flex items-center gap-1 flex-wrap justify-center">
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          <div className="flex items-center gap-1 overflow-x-auto max-w-[280px] sm:max-w-none py-1">
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`px-3 py-1.5 rounded font-medium transition-colors shrink-0 ${
                    currentPage === pageNum
                      ? "bg-[#6c5ce7] text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1.5 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
