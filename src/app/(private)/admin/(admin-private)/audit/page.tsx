/* eslint-disable @typescript-eslint/no-explicit-any *//* eslint-disable prettier/prettier */
"use client";

import { useState, useEffect, useMemo } from "react";
import { useTheme } from "@/lib/theme";
import AuditDetailDrawer from "./components/AuditDetailDrawer";
import {
  Search,
  Filter,
  History,
  Eye,
  Download,
  ChevronLeft,
  ChevronRight,
  Activity,
  Globe,
  Monitor,
} from "lucide-react";

const DUMMY_AUDITS = [
  {
    uuid: "1",
    at: "2024-05-20 10:45 AM",
    actor: { name: "John Doe", avatar: "JD" },
    action: "create",
    entity: "Organization",
    entity_ref: "Acme Corp",
    ip: "192.168.1.1",
    ua_short: "Chrome 120 / Win 10",
    before_json: null,
    after_json: { name: "Acme Corp", plan: "Pro" },
  },
  {
    uuid: "2",
    at: "2024-05-20 10:30 AM",
    actor: { name: "Jane Smith", avatar: "JS" },
    action: "update",
    entity: "User",
    entity_ref: "Mike Johnson",
    ip: "192.168.1.2",
    ua_short: "Safari 17 / macOS",
    before_json: { status: "active" },
    after_json: { status: "suspended" },
  },
  {
    uuid: "3",
    at: "2024-05-20 09:15 AM",
    actor: { name: "John Doe", avatar: "JD" },
    action: "delete",
    entity: "Plan",
    entity_ref: "Enterprise",
    ip: "192.168.1.1",
    ua_short: "Chrome 120 / Win 10",
    before_json: { name: "Enterprise", price: 199 },
    after_json: null,
  },
  {
    uuid: "4",
    at: "2024-05-19 14:20 PM",
    actor: { name: "System", avatar: "SY" },
    action: "login",
    entity: "Auth",
    entity_ref: "admin@example.com",
    ip: "10.0.0.1",
    ua_short: "API Client",
    before_json: null,
    after_json: { success: true },
  },
  {
    uuid: "5",
    at: "2024-05-19 11:00 AM",
    actor: { name: "Sarah Lee", avatar: "SL" },
    action: "update",
    entity: "Config",
    entity_ref: "app_name",
    ip: "192.168.1.5",
    ua_short: "Firefox 115 / Linux",
    before_json: { value: '"Old App"' },
    after_json: { value: '"New App"' },
  },
];

const ITEMS_PER_PAGE = 8;

export default function AuditLogPage() {
  const { primaryColor } = useTheme();
  const brandColor = primaryColor || "#2ed573";

  const [audits, setAudits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingDummy, setIsUsingDummy] = useState(false);

  // Drawer States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState<any>(null);

  // Search & Filter & Pagination States
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // ডেটা ফেচ
  useEffect(() => {
    const fetchAudits = async () => {
      try {
        // const res = await fetch("/api/audit");
        // if (!res.ok) throw new Error("API Error");
        // const data = await res.json();
        // setAudits(data);
        setTimeout(() => {
          setAudits(DUMMY_AUDITS);
          setIsUsingDummy(true);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        setAudits(DUMMY_AUDITS);
        setIsUsingDummy(true);
        setIsLoading(false);
      }
    };
    fetchAudits();
  }, []);

  // Filter Logic
  const filteredAudits = useMemo(() => {
    return audits.filter((a) => {
      const matchesSearch =
        a.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.entity_ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.actor.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesAction = actionFilter === "all" || a.action === actionFilter;

      return matchesSearch && matchesAction;
    });
  }, [audits, searchQuery, actionFilter]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredAudits.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedAudits = filteredAudits.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, actionFilter]);

  // Action Badge Color Helper
  const getActionBadge = (action: string) => {
    switch (action) {
      case "create":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "update":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "delete":
        return "bg-red-50 text-red-700 border-red-200";
      case "login":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <History className="h-7 w-7" style={{ color: brandColor }} />
              Audit Logs
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Track all system activities, changes, and security events.
            </p>
          </div>

          <button className="px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium text-sm flex items-center gap-2 shadow-sm hover:bg-gray-50 transition-all whitespace-nowrap">
            <Download className="h-4 w-4" /> Export CSV
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
              placeholder="Search by actor, entity or reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 transition-all"
              style={{ "--tw-ring-color": `${brandColor}40` } as any}
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Filter className="h-4 w-4" />
              <span>Action:</span>
            </div>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 appearance-none min-w-[130px]"
              style={{ "--tw-ring-color": `${brandColor}40` } as any}
            >
              <option value="all">All Actions</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
              <option value="login">Login</option>
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
                    Timestamp
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Actor
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Entity
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Context
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-gray-400"
                    >
                      Loading audit logs...
                    </td>
                  </tr>
                ) : paginatedAudits.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-16 text-center flex flex-col items-center"
                    >
                      <Activity className="h-10 w-10 text-gray-200 mb-3" />
                      <p className="text-gray-500 font-medium">
                        No audit logs found.
                      </p>
                    </td>
                  </tr>
                ) : (
                  paginatedAudits.map((log) => (
                    <tr
                      key={log.uuid}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100 whitespace-nowrap">
                          {log.at}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-8 w-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-sm"
                            style={{ backgroundColor: brandColor }}
                          >
                            {log.actor.avatar}
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {log.actor.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getActionBadge(log.action)}`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-700 font-medium">
                            {log.entity}
                          </span>
                          <span className="text-xs text-gray-400 mt-0.5">
                            {log.entity_ref}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 text-[11px] text-gray-500">
                          <span className="flex items-center gap-1.5">
                            <Globe className="h-3 w-3" /> {log.ip}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Monitor className="h-3 w-3" /> {log.ua_short}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedAudit(log);
                            setIsDrawerOpen(true);
                          }}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-1.5"
                          style={{ color: brandColor }}
                        >
                          <Eye className="h-3.5 w-3.5" /> View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!isLoading && filteredAudits.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-medium text-gray-900">
                  {startIndex + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium text-gray-900">
                  {Math.min(startIndex + ITEMS_PER_PAGE, filteredAudits.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-900">
                  {filteredAudits.length}
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

      <AuditDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        logData={selectedAudit}
      />
    </div>
  );
}
