"use client";

import React from "react";

export interface ItemHistoryItem {
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
}

interface ItemHistoryReportTableProps {
  data: ItemHistoryItem[];
  paginatedData: ItemHistoryItem[];
  currentPage: number;
  entriesPerPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function ItemHistoryReportTable({
  data,
  paginatedData,
  currentPage,
  entriesPerPage,
  totalPages,
  onPageChange,
}: ItemHistoryReportTableProps) {
  const startIndex =
    data.length > 0 ? (currentPage - 1) * entriesPerPage + 1 : 0;
  const endIndex = Math.min(currentPage * entriesPerPage, data.length);

  return (
    <div className="w-full space-y-4 relative z-0">
      {/* Table Container */}
      <div className="w-full max-h-[500px] overflow-y-auto overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-sm shadow-sm bg-white dark:bg-gray-900 relative z-10">
        <table className="w-full min-w-[850px] text-left border-collapse text-xs relative">
          <thead className="sticky top-0 z-20">
            <tr className="bg-[#6c5ce7] text-white font-semibold uppercase tracking-wider text-[11px] whitespace-nowrap shadow-sm">
              <th className="py-2.5 px-3 border-r border-indigo-400/30 text-center w-12 bg-[#6c5ce7]">
                ID
              </th>
              <th className="py-2.5 px-3 border-r border-indigo-400/30 text-center bg-[#6c5ce7]">
                DATE
              </th>
              <th className="py-2.5 px-3 border-r border-indigo-400/30 bg-[#6c5ce7]">
                INVOICE NO
              </th>
              <th className="py-2.5 px-3 border-r border-indigo-400/30 bg-[#6c5ce7]">
                PROJECT
              </th>
              <th className="py-2.5 px-3 border-r border-indigo-400/30 bg-[#6c5ce7]">
                TASK
              </th>
              <th className="py-2.5 px-3 border-r border-indigo-400/30 text-right bg-[#6c5ce7]">
                IN
              </th>
              <th className="py-2.5 px-3 border-r border-indigo-400/30 text-right bg-[#6c5ce7]">
                OUT
              </th>
              <th className="py-2.5 px-3 border-r border-indigo-400/30 text-right bg-[#6c5ce7]">
                BALANCE
              </th>
              <th className="py-2.5 px-3 border-r border-indigo-400/30 text-right bg-[#6c5ce7]">
                UNIT COST
              </th>
              <th className="py-2.5 px-3 text-right bg-[#6c5ce7]">SUB TOTAL</th>
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
                  <td className="py-2.5 px-3 border-r border-gray-200 dark:border-gray-800 text-center text-gray-600 dark:text-gray-400">
                    {item.date}
                  </td>
                  <td className="py-2.5 px-3 border-r border-gray-200 dark:border-gray-800 text-indigo-600 dark:text-indigo-400 font-medium hover:underline cursor-pointer">
                    {item.invoiceNo}
                  </td>
                  <td className="py-2.5 px-3 border-r border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300">
                    {item.project}
                  </td>
                  <td className="py-2.5 px-3 border-r border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300">
                    {item.task}
                  </td>
                  <td className="py-2.5 px-3 border-r border-gray-200 dark:border-gray-800 text-right text-gray-700 dark:text-gray-300">
                    {item.in.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 border-r border-gray-200 dark:border-gray-800 text-right text-gray-700 dark:text-gray-300">
                    {item.out.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 border-r border-gray-200 dark:border-gray-800 text-right text-gray-700 dark:text-gray-300">
                    {item.balance.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 border-r border-gray-200 dark:border-gray-800 text-right text-gray-700 dark:text-gray-300">
                    {item.unitCost.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-gray-700 dark:text-gray-300">
                    {item.subTotal.toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={10}
                  className="py-8 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900"
                >
                  No data available in table
                </td>
              </tr>
            )}
          </tbody>
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

          <div className="flex items-center gap-1 overflow-x-auto max-w-[250px] sm:max-w-none py-1">
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
