/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
"use client";

import { useState, useEffect, useMemo } from "react";
import { useTheme } from "@/lib/theme";
import {
  Search,
  Filter,
  Gauge,
  Download,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

const DUMMY_USAGE = [
  {
    uuid: "1",
    org: "Acme Corp",
    metric: "Active Users",
    used: 5,
    limit: 10,
    period: "Monthly",
  },
  {
    uuid: "2",
    org: "Acme Corp",
    metric: "Storage (GB)",
    used: 45,
    limit: 50,
    period: "Current",
  },
  {
    uuid: "3",
    org: "Acme Corp",
    metric: "API Requests",
    used: 8500,
    limit: 10000,
    period: "Monthly",
  },
  {
    uuid: "4",
    org: "Beta LLC",
    metric: "Active Users",
    used: 20,
    limit: 20,
    period: "Monthly",
  },
  {
    uuid: "5",
    org: "Beta LLC",
    metric: "Storage (GB)",
    used: 8,
    limit: 10,
    period: "Current",
  },
  {
    uuid: "6",
    org: "Gamma Inc",
    metric: "Projects",
    used: 3,
    limit: 50,
    period: "Current",
  },
  {
    uuid: "7",
    org: "Delta Co",
    metric: "Active Users",
    used: 85,
    limit: 100,
    period: "Monthly",
  },
];

const ITEMS_PER_PAGE = 8;

export default function UsageListPage() {
  const { primaryColor } = useTheme();
  const brandColor = primaryColor || "#2ed573";

  const [usageData, setUsageData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingDummy, setIsUsingDummy] = useState(false);

  // Search & Filter & Pagination States
  const [searchQuery, setSearchQuery] = useState("");
  const [metricFilter, setMetricFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // ডেটা ফেচ
  useEffect(() => {
    const fetchUsage = async () => {
      try {
        // const res = await fetch("/api/usage");
        // if (!res.ok) throw new Error("API Error");
        // const data = await res.json();
        // setUsageData(data);
        setTimeout(() => {
          setUsageData(DUMMY_USAGE);
          setIsUsingDummy(true);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        setUsageData(DUMMY_USAGE);
        setIsUsingDummy(true);
        setIsLoading(false);
      }
    };
    fetchUsage();
  }, []);

  // Extract unique metrics for filter
  const metrics = useMemo(() => {
    return Array.from(new Set(usageData.map((u) => u.metric)));
  }, [usageData]);

  // Filter Logic
  const filteredUsage = useMemo(() => {
    return usageData.filter((u) => {
      const matchesSearch = u.org
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesMetric = metricFilter === "all" || u.metric === metricFilter;
      return matchesSearch && matchesMetric;
    });
  }, [usageData, searchQuery, metricFilter]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredUsage.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsage = filteredUsage.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, metricFilter]);

  // Progress Bar Calculator
  const getProgress = (used: number, limit: number) => {
    const percentage = Math.min((used / limit) * 100, 100);
    let color = brandColor; // Default Green
    if (percentage >= 90)
      color = "#ef4444"; // Red
    else if (percentage >= 75) color = "#f59e0b"; // Amber

    return { percentage, color };
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <Gauge className="h-7 w-7" style={{ color: brandColor }} />
              Usage & Limits
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Monitor organization resource consumption and plan limits.
            </p>
          </div>

          <button className="px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium text-sm flex items-center gap-2 shadow-sm hover:bg-gray-50 transition-all whitespace-nowrap">
            <Download className="h-4 w-4" /> Export Report
          </button>
        </div>

        {isUsingDummy && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl mb-6 text-sm flex items-center gap-3 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>
              API is offline. Showing <strong>Demo Data</strong>.
            </span>
          </div>
        )}

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by organization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 transition-all"
              style={{ "--tw-ring-color": `${brandColor}40` } as any}
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Filter className="h-4 w-4" />
              <span>Metric:</span>
            </div>
            <select
              value={metricFilter}
              onChange={(e) => setMetricFilter(e.target.value)}
              className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 appearance-none min-w-[150px]"
              style={{ "--tw-ring-color": `${brandColor}40` } as any}
            >
              <option value="all">All Metrics</option>
              {metrics.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Premium Table Layout */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-gray-50/80 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Metric
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-1/3">
                    Usage Progress
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Period
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-gray-400"
                    >
                      Loading usage data...
                    </td>
                  </tr>
                ) : paginatedUsage.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-16 text-center flex flex-col items-center"
                    >
                      <Gauge className="h-10 w-10 text-gray-200 mb-3" />
                      <p className="text-gray-500 font-medium">
                        No usage data found.
                      </p>
                    </td>
                  </tr>
                ) : (
                  paginatedUsage.map((row) => {
                    const { percentage, color } = getProgress(
                      row.used,
                      row.limit,
                    );
                    const isLimitReached = row.used >= row.limit;

                    return (
                      <tr
                        key={row.uuid}
                        className="hover:bg-gray-50/50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-900 text-sm">
                            {row.org}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-700 font-medium">
                            {row.metric}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between text-xs text-gray-500 font-medium">
                              <span>
                                {row.used.toLocaleString()} /{" "}
                                {row.limit.toLocaleString()}
                              </span>
                              <span>{percentage.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden border border-gray-200/50">
                              <div
                                className="h-full rounded-full transition-all duration-500 ease-out"
                                style={{
                                  width: `${percentage}%`,
                                  backgroundColor: color,
                                }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                            {row.period}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {isLimitReached ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200">
                              <AlertTriangle className="h-3 w-3" /> Limit
                              Reached
                            </span>
                          ) : percentage >= 75 ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                              <AlertTriangle className="h-3 w-3" /> Nearing
                              Limit
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-700 border border-green-200">
                              <CheckCircle2 className="h-3 w-3" /> Healthy
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!isLoading && filteredUsage.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-medium text-gray-900">
                  {startIndex + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium text-gray-900">
                  {Math.min(startIndex + ITEMS_PER_PAGE, filteredUsage.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-900">
                  {filteredUsage.length}
                </span>{" "}
                entries
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === i + 1 ? "text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"}`}
                      style={
                        currentPage === i + 1
                          ? { backgroundColor: brandColor }
                          : {}
                      }
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
