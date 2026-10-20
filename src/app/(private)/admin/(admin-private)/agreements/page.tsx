/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
"use client";

import { useState, useEffect, useMemo } from "react";
import { useTheme } from "@/lib/theme";
import {
  Search,
  Plus,
  FileText,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ShieldCheck,
  PenTool,
  Trash2,
} from "lucide-react";
import AgreementCreateModal from "./components/AgreementCreateModal";

const DUMMY_AGREEMENTS = [
  {
    uuid: "1",
    title: "Terms of Service",
    version: "v1.2",
    content_url: "https://example.com/tos.pdf",
    required_at_signup: true,
    is_active: true,
    signed_count: 1250,
    updated_at: "2024-05-01",
  },
  {
    uuid: "2",
    title: "Privacy Policy",
    version: "v2.0",
    content_url: "https://example.com/privacy.pdf",
    required_at_signup: true,
    is_active: true,
    signed_count: 1250,
    updated_at: "2024-05-01",
  },
  {
    uuid: "3",
    title: "Data Processing Agreement",
    version: "v1.0",
    content_url: null,
    required_at_signup: false,
    is_active: false,
    signed_count: 45,
    updated_at: "2024-03-15",
  },
];

export default function AgreementListPage() {
  const { primaryColor } = useTheme();
  const brandColor = primaryColor || "#2ed573";

  const [agreements, setAgreements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingDummy, setIsUsingDummy] = useState(false);

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  // ফেচ ডেটা
  useEffect(() => {
    const fetchAgreements = async () => {
      try {
        // const res = await fetch("/api/agreements");
        // if (!res.ok) throw new Error("API Error");
        // const data = await res.json();
        // setAgreements(data);
        setTimeout(() => {
          setAgreements(DUMMY_AGREEMENTS);
          setIsUsingDummy(true);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        setAgreements(DUMMY_AGREEMENTS);
        setIsUsingDummy(true);
        setIsLoading(false);
      }
    };
    fetchAgreements();
  }, []);

  // Create
  const handleCreate = async (payload: any) => {
    try {
      // await fetch("/api/agreements", { method: "POST", body: JSON.stringify(payload) });
      const newAgreement = {
        ...payload,
        uuid: Date.now().toString(),
        signed_count: 0,
        updated_at: new Date().toISOString().split("T")[0],
      };
      setAgreements((prev) => [newAgreement, ...prev]);
    } catch (error) {
      const newAgreement = {
        ...payload,
        uuid: Date.now().toString(),
        signed_count: 0,
        updated_at: new Date().toISOString().split("T")[0],
      };
      setAgreements((prev) => [newAgreement, ...prev]);
    }
  };

  // Delete
  const handleDelete = (uuid: string) => {
    if (!confirm("Are you sure you want to delete this agreement?")) return;
    setAgreements((prev) => prev.filter((a) => a.uuid !== uuid));
  };

  // Toggle Status
  const toggleStatus = (uuid: string) => {
    setAgreements((prev) =>
      prev.map((a) =>
        a.uuid === uuid ? { ...a, is_active: !a.is_active } : a,
      ),
    );
  };

  // Filter
  const filteredAgreements = useMemo(() => {
    return agreements.filter(
      (a) =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.version.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [agreements, searchQuery]);

  return (
    <div className="min-h-screen bg-[#fafafa]  font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <FileText className="h-7 w-7" style={{ color: brandColor }} />
              Legal Agreements
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage Terms of Service, Privacy Policies, and other legal
              documents.
            </p>
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-5 py-2.5 rounded-xl text-white font-medium text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 whitespace-nowrap"
            style={{ backgroundColor: brandColor }}
          >
            <Plus className="h-4 w-4" /> Create Agreement
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

        {/* Search Toolbar */}
        <div className="bg-white p-4 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100 mb-8">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search agreements by title or version..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 transition-all"
              style={{ "--tw-ring-color": `${brandColor}40` } as any}
            />
          </div>
        </div>

        {/* Premium Table Layout */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-gray-50/80 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Agreement
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Signatures
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
                    Signup Req.
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Actions
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
                      Loading agreements...
                    </td>
                  </tr>
                ) : filteredAgreements.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-16 text-center flex flex-col items-center"
                    >
                      <FileText className="h-10 w-10 text-gray-200 mb-3" />
                      <p className="text-gray-500 font-medium">
                        No agreements found.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredAgreements.map((agreement) => (
                    <tr
                      key={agreement.uuid}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="p-2.5 rounded-xl border"
                            style={{
                              backgroundColor: `${brandColor}10`,
                              borderColor: `${brandColor}20`,
                            }}
                          >
                            <FileText
                              className="h-5 w-5"
                              style={{ color: brandColor }}
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900 text-sm">
                              {agreement.title}
                            </span>
                            <span className="text-xs text-gray-500 mt-0.5 font-mono">
                              Version {agreement.version}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <PenTool className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">
                            {agreement.signed_count || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {agreement.required_at_signup ? (
                          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-600">
                            <CheckCircle2 className="h-4 w-4" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 text-gray-400">
                            <XCircle className="h-4 w-4" />
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => toggleStatus(agreement.uuid)}
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border transition-colors ${
                            agreement.is_active
                              ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                              : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                          }`}
                        >
                          {agreement.is_active ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {agreement.content_url && (
                            <a
                              href={agreement.content_url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Document"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                          <button
                            onClick={() => handleDelete(agreement.uuid)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AgreementCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}
