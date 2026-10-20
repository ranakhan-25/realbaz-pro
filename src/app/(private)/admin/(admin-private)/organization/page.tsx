/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useTheme } from "@/lib/theme";
import {
  Search,
  Filter,
  Building2,
  Mail,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  MoreHorizontal,
  Eye,
  Edit3,
  Trash2,
  X,
  Save,
  Plus,
  Globe,
  Briefcase,
} from "lucide-react";

// ডামি ডেটা
const DUMMY_ORGS = [
  {
    uuid: "1",
    name: "Acme Corp",
    slug: "acme-corp",
    email: "admin@acme.com",
    billing_email: "billing@acme.com",
    phone: "+1234567890",
    website: "https://acme.com",
    industry: "Technology",
    country: "USA",
    tax_id: "US123456",
    status: "active",
    plan: "Pro",
    joined_at: "2024-01-15",
  },
  {
    uuid: "2",
    name: "Beta LLC",
    slug: "beta-llc",
    email: "info@beta.com",
    billing_email: "accounts@beta.com",
    phone: "+0987654321",
    website: "https://beta.com",
    industry: "Finance",
    country: "UK",
    tax_id: "UK987654",
    status: "trial",
    plan: "Basic",
    joined_at: "2024-02-10",
  },
  {
    uuid: "3",
    name: "Gamma Inc",
    slug: "gamma-inc",
    email: "contact@gamma.com",
    billing_email: "billing@gamma.com",
    phone: "+1122334455",
    website: "https://gamma.io",
    industry: "Healthcare",
    country: "Canada",
    tax_id: "CA555666",
    status: "suspended",
    plan: "Enterprise",
    joined_at: "2024-03-05",
  },
];

const ITEMS_PER_PAGE = 5;

export default function OrganizationManagementPage() {
  const { primaryColor } = useTheme();
  const brandColor = primaryColor || "#2ed573";

  const [orgs, setOrgs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingDummy, setIsUsingDummy] = useState(false);

  // Search, Filter & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Dropdown State
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<any>(null);

  // ফেচ ডেটা
  useEffect(() => {
    setTimeout(() => {
      setOrgs(DUMMY_ORGS);
      setIsUsingDummy(true);
      setIsLoading(false);
    }, 500);
  }, []);

  // ক্লিক আউটসাইড -> ড্রপডাউন বন্ধ
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdownId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Action Handler
  const handleAction = (action: string, org: any) => {
    setSelectedOrg(org);
    setOpenDropdownId(null);
    if (action === "view") setIsViewModalOpen(true);
    if (action === "edit") setIsEditModalOpen(true);
    if (action === "delete") {
      if (confirm(`Delete ${org.name}?`)) {
        setOrgs((prev) => prev.filter((o) => o.uuid !== org.uuid));
      }
    }
  };

  // Create Organization
  const handleCreateOrg = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newOrg = {
      uuid: Date.now().toString(),
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      email: formData.get("email") as string,
      billing_email: formData.get("billing_email") as string,
      phone: formData.get("phone") as string,
      website: formData.get("website") as string,
      industry: formData.get("industry") as string,
      country: formData.get("country") as string,
      tax_id: formData.get("tax_id") as string,
      status: formData.get("status") as string,
      plan: formData.get("plan") as string,
      joined_at: new Date().toISOString().split("T")[0],
    };
    setOrgs((prev) => [newOrg, ...prev]);
    setIsCreateModalOpen(false);
  };

  // Update Organization
  const handleUpdateOrg = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedData = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      email: formData.get("email"),
      billing_email: formData.get("billing_email"),
      phone: formData.get("phone"),
      website: formData.get("website"),
      industry: formData.get("industry"),
      country: formData.get("country"),
      tax_id: formData.get("tax_id"),
      status: formData.get("status"),
      plan: formData.get("plan"),
    };
    setOrgs((prev) =>
      prev.map((o) =>
        o.uuid === selectedOrg.uuid ? { ...o, ...updatedData } : o,
      ),
    );
    setIsEditModalOpen(false);
  };

  // Filter Logic
  const filteredOrgs = useMemo(() => {
    return orgs.filter((o) => {
      const matchesSearch =
        o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orgs, searchQuery, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredOrgs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrgs = filteredOrgs.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <Building2 className="h-7 w-7" style={{ color: brandColor }} />{" "}
              Organizations
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage SaaS clients, their billing details, and subscription
              plans.
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-2.5 rounded-xl text-white font-medium text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 whitespace-nowrap"
            style={{ backgroundColor: brandColor }}
          >
            <Plus className="h-4 w-4" /> Create Organization
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
        <div className="bg-white p-4 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100 mb-6 flex flex-col xl:flex-row gap-4 justify-between items-center">
          <div className="relative w-full xl:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 transition-all"
              style={{ "--tw-ring-color": `${brandColor}40` } as any}
            />
          </div>
          <div className="flex items-center gap-3 w-full xl:w-auto">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Filter className="h-4 w-4" />
              <span>Filters:</span>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 appearance-none min-w-[120px]"
              style={{ "--tw-ring-color": `${brandColor}40` } as any}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="trial">Trial</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-visible">
          <div className="overflow-x-auto min-h-[300px]">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="bg-gray-50/80 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                    Organization
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                    Industry
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                    Plan
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">
                    Actions
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
                      Loading organizations...
                    </td>
                  </tr>
                ) : (
                  paginatedOrgs.map((org) => (
                    <tr
                      key={org.uuid}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm"
                            style={{ backgroundColor: brandColor }}
                          >
                            {org.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900 text-sm">
                              {org.name}
                            </span>
                            <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                              <Globe className="h-3 w-3" />{" "}
                              {org.website || org.slug}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-700">
                            {org.email}
                          </span>
                          <span className="text-xs text-gray-400 mt-0.5">
                            {org.phone}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                          {org.industry || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="text-xs font-bold uppercase tracking-wider"
                          style={{ color: brandColor }}
                        >
                          {org.plan}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${org.status === "active" ? "bg-green-50 text-green-700 border border-green-200" : org.status === "trial" ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-red-50 text-red-700 border border-red-200"}`}
                        >
                          {org.status === "active" ? (
                            <UserCheck className="h-3 w-3 mr-1" />
                          ) : org.status === "suspended" ? (
                            <UserX className="h-3 w-3 mr-1" />
                          ) : null}{" "}
                          {org.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right relative">
                        <button
                          onClick={() =>
                            setOpenDropdownId(
                              openDropdownId === org.uuid ? null : org.uuid,
                            )
                          }
                          className={`p-2 rounded-lg transition-colors ${openDropdownId === org.uuid ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-900 hover:bg-gray-100"}`}
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                        {openDropdownId === org.uuid && (
                          <div
                            ref={dropdownRef}
                            className="absolute right-6 top-12 z-50 w-40 bg-white border border-gray-100 rounded-xl shadow-xl py-1 animate-in fade-in zoom-in-95 duration-100"
                          >
                            <button
                              onClick={() => handleAction("view", org)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Eye className="h-4 w-4 text-gray-400" /> View
                              Details
                            </button>
                            <button
                              onClick={() => handleAction("edit", org)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Edit3 className="h-4 w-4 text-gray-400" /> Edit
                              Org
                            </button>
                            <div className="h-px bg-gray-100 my-1"></div>
                            <button
                              onClick={() => handleAction("delete", org)}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" /> Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ================= MODALS ================= */}

      {/* 1. Create Organization Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsCreateModalOpen(false)}
          ></div>
          <div className="relative bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Building2 className="h-5 w-5" style={{ color: brandColor }} />{" "}
                Create New Organization
              </h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-200 text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <form
                id="create-org-form"
                onSubmit={handleCreateOrg}
                className="space-y-5"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Organization Name *
                    </label>
                    <input
                      name="name"
                      type="text"
                      required
                      placeholder="Acme Corp"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none"
                      style={{ "--tw-ring-color": `${brandColor}40` } as any}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Slug *
                    </label>
                    <input
                      name="slug"
                      type="text"
                      required
                      placeholder="acme-corp"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none font-mono"
                      style={{ "--tw-ring-color": `${brandColor}40` } as any}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Primary Email *
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="admin@acme.com"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none"
                      style={{ "--tw-ring-color": `${brandColor}40` } as any}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Billing Email
                    </label>
                    <input
                      name="billing_email"
                      type="email"
                      placeholder="billing@acme.com"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none"
                      style={{ "--tw-ring-color": `${brandColor}40` } as any}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Phone
                    </label>
                    <input
                      name="phone"
                      type="text"
                      placeholder="+1 234 567 890"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none"
                      style={{ "--tw-ring-color": `${brandColor}40` } as any}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Website URL
                    </label>
                    <input
                      name="website"
                      type="url"
                      placeholder="https://acme.com"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none"
                      style={{ "--tw-ring-color": `${brandColor}40` } as any}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Industry
                    </label>
                    <select
                      name="industry"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none appearance-none"
                      style={{ "--tw-ring-color": `${brandColor}40` } as any}
                    >
                      <option value="Technology">Technology</option>
                      <option value="Finance">Finance</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Education">Education</option>
                      <option value="Retail">Retail</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Country
                    </label>
                    <input
                      name="country"
                      type="text"
                      placeholder="USA"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none"
                      style={{ "--tw-ring-color": `${brandColor}40` } as any}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Tax ID / VAT
                    </label>
                    <input
                      name="tax_id"
                      type="text"
                      placeholder="US123456"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none font-mono"
                      style={{ "--tw-ring-color": `${brandColor}40` } as any}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Plan *
                    </label>
                    <select
                      name="plan"
                      required
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none appearance-none"
                      style={{ "--tw-ring-color": `${brandColor}40` } as any}
                    >
                      <option value="Basic">Basic</option>
                      <option value="Pro">Pro</option>
                      <option value="Enterprise">Enterprise</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Status
                  </label>
                  <select
                    name="status"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none appearance-none"
                    style={{ "--tw-ring-color": `${brandColor}40` } as any}
                  >
                    <option value="active">Active</option>
                    <option value="trial">Trial</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="create-org-form"
                className="px-5 py-2.5 text-white rounded-xl text-sm font-medium shadow-md flex items-center gap-2"
                style={{ backgroundColor: brandColor }}
              >
                <Plus className="h-4 w-4" /> Create Organization
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. View Organization Modal */}
      {isViewModalOpen && selectedOrg && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsViewModalOpen(false)}
          ></div>
          <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div
              className="h-24 w-full"
              style={{ backgroundColor: `${brandColor}20` }}
            ></div>
            <div className="px-6 pb-6">
              <div className="flex justify-between items-end -mt-10 mb-4">
                <div
                  className="h-20 w-20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg border-4 border-white"
                  style={{ backgroundColor: brandColor }}
                >
                  {selectedOrg.name.substring(0, 2).toUpperCase()}
                </div>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="mb-2 p-2 rounded-full hover:bg-gray-100 text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedOrg.name}
              </h2>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <Globe className="h-4 w-4" /> {selectedOrg.website || "N/A"}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    Primary Email
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {selectedOrg.email}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    Billing Email
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {selectedOrg.billing_email || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    Industry
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {selectedOrg.industry}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    Country
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {selectedOrg.country}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    Tax ID
                  </span>
                  <span className="text-sm font-mono font-medium text-gray-900">
                    {selectedOrg.tax_id || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    Plan
                  </span>
                  <span
                    className="text-sm font-bold uppercase"
                    style={{ color: brandColor }}
                  >
                    {selectedOrg.plan}
                  </span>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-end">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Edit Organization Modal */}
      {isEditModalOpen && selectedOrg && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsEditModalOpen(false)}
          ></div>
          <div className="relative bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">
                Edit: {selectedOrg.name}
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-200 text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form
                id="edit-org-form"
                onSubmit={handleUpdateOrg}
                className="space-y-5"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Organization Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      defaultValue={selectedOrg.name}
                      required
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none"
                      style={{ "--tw-ring-color": `${brandColor}40` } as any}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Slug (Read-only)
                    </label>
                    <input
                      name="slug"
                      type="text"
                      defaultValue={selectedOrg.slug}
                      readOnly
                      className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed font-mono"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Primary Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      defaultValue={selectedOrg.email}
                      required
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none"
                      style={{ "--tw-ring-color": `${brandColor}40` } as any}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Billing Email
                    </label>
                    <input
                      name="billing_email"
                      type="email"
                      defaultValue={selectedOrg.billing_email}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none"
                      style={{ "--tw-ring-color": `${brandColor}40` } as any}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Phone
                    </label>
                    <input
                      name="phone"
                      type="text"
                      defaultValue={selectedOrg.phone}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none"
                      style={{ "--tw-ring-color": `${brandColor}40` } as any}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Website URL
                    </label>
                    <input
                      name="website"
                      type="url"
                      defaultValue={selectedOrg.website}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none"
                      style={{ "--tw-ring-color": `${brandColor}40` } as any}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Industry
                    </label>
                    <select
                      name="industry"
                      defaultValue={selectedOrg.industry}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none appearance-none"
                      style={{ "--tw-ring-color": `${brandColor}40` } as any}
                    >
                      <option value="Technology">Technology</option>
                      <option value="Finance">Finance</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Education">Education</option>
                      <option value="Retail">Retail</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Country
                    </label>
                    <input
                      name="country"
                      type="text"
                      defaultValue={selectedOrg.country}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none"
                      style={{ "--tw-ring-color": `${brandColor}40` } as any}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Tax ID / VAT
                    </label>
                    <input
                      name="tax_id"
                      type="text"
                      defaultValue={selectedOrg.tax_id}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none font-mono"
                      style={{ "--tw-ring-color": `${brandColor}40` } as any}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Plan
                    </label>
                    <select
                      name="plan"
                      defaultValue={selectedOrg.plan}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none appearance-none"
                      style={{ "--tw-ring-color": `${brandColor}40` } as any}
                    >
                      <option value="Basic">Basic</option>
                      <option value="Pro">Pro</option>
                      <option value="Enterprise">Enterprise</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Status
                  </label>
                  <select
                    name="status"
                    defaultValue={selectedOrg.status}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none appearance-none"
                    style={{ "--tw-ring-color": `${brandColor}40` } as any}
                  >
                    <option value="active">Active</option>
                    <option value="trial">Trial</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="edit-org-form"
                className="px-5 py-2.5 text-white rounded-xl text-sm font-medium shadow-md flex items-center gap-2"
                style={{ backgroundColor: brandColor }}
              >
                <Save className="h-4 w-4" /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
