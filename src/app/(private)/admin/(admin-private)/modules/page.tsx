/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
"use client";

import { useState, useEffect, useMemo } from "react";
import { useTheme } from "@/lib/theme";
import ModuleFormModal from "./components/ModuleFormModal";
import {
  Search,
  Plus,
  Boxes,
  Edit3,
  Trash2,
  Layers,
  LayoutGrid,
  CheckCircle2,
  XCircle,
  Shield,
} from "lucide-react";

const DUMMY_MODULES = [
  {
    uuid: "1",
    icon: "Building2",
    code: "organization",
    name: "Organization Management",
    order_no: 1,
    is_core: true,
    status: "active",
    features_count: 12,
  },
  {
    uuid: "2",
    icon: "Users",
    code: "users",
    name: "User Management",
    order_no: 2,
    is_core: true,
    status: "active",
    features_count: 8,
  },
  {
    uuid: "3",
    icon: "CreditCard",
    code: "billing",
    name: "Billing & Subscriptions",
    order_no: 3,
    is_core: false,
    status: "active",
    features_count: 5,
  },
  {
    uuid: "4",
    icon: "Settings",
    code: "settings",
    name: "System Settings",
    order_no: 4,
    is_core: true,
    status: "active",
    features_count: 4,
  },
  {
    uuid: "5",
    icon: "FileText",
    code: "reports",
    name: "Reports & Analytics",
    order_no: 5,
    is_core: false,
    status: "inactive",
    features_count: 0,
  },
];

export default function ModuleListPage() {
  const { primaryColor } = useTheme();
  const brandColor = primaryColor || "#2ed573";

  const [modules, setModules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingDummy, setIsUsingDummy] = useState(false);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<any>(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  // ফেচ ডেটা
  useEffect(() => {
    const fetchModules = async () => {
      try {
        // const res = await fetch("/api/modules");
        // if (!res.ok) throw new Error("API Error");
        // const data = await res.json();
        // setModules(data);
        setTimeout(() => {
          setModules(DUMMY_MODULES);
          setIsUsingDummy(true);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        setModules(DUMMY_MODULES);
        setIsUsingDummy(true);
        setIsLoading(false);
      }
    };
    fetchModules();
  }, []);

  // CRUD Operations
  const handleSave = async (payload: any) => {
    if (selectedModule) {
      // Update
      try {
        // await fetch(`/api/modules/${selectedModule.uuid}`, { method: "PUT", body: JSON.stringify(payload) });
        setModules((prev) =>
          prev.map((m) =>
            m.uuid === selectedModule.uuid ? { ...m, ...payload } : m,
          ),
        );
      } catch (error) {
        setModules((prev) =>
          prev.map((m) =>
            m.uuid === selectedModule.uuid ? { ...m, ...payload } : m,
          ),
        );
      }
    } else {
      // Create
      try {
        // await fetch("/api/modules", { method: "POST", body: JSON.stringify(payload) });
        const newModule = {
          ...payload,
          uuid: Date.now().toString(),
          features_count: 0,
        };
        setModules((prev) => [...prev, newModule]);
      } catch (error) {
        const newModule = {
          ...payload,
          uuid: Date.now().toString(),
          features_count: 0,
        };
        setModules((prev) => [...prev, newModule]);
      }
    }
    setIsModalOpen(false);
  };

  const handleDelete = (uuid: string, isCore: boolean) => {
    if (isCore) return alert("Core modules cannot be deleted.");
    if (
      !confirm(
        "Are you sure you want to delete this module? All its features will be removed.",
      )
    )
      return;
    setModules((prev) => prev.filter((m) => m.uuid !== uuid));
  };

  const handleEdit = (mod: any) => {
    setSelectedModule(mod);
    setIsModalOpen(true);
  };

  // Filter
  const filteredModules = useMemo(() => {
    return modules
      .filter(
        (m) =>
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.code.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      .sort((a, b) => a.order_no - b.order_no);
  }, [modules, searchQuery]);

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <Boxes className="h-7 w-7" style={{ color: brandColor }} />
              Module Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage core system modules and their associated features.
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedModule(null);
              setIsModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-xl text-white font-medium text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 whitespace-nowrap"
            style={{ backgroundColor: brandColor }}
          >
            <Plus className="h-4 w-4" /> Create Module
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
              placeholder="Search modules by name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 transition-all"
              style={{ "--tw-ring-color": `${brandColor}40` } as any}
            />
          </div>
        </div>

        {/* Premium Grid View */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-12 text-gray-400">
              Loading modules...
            </div>
          ) : filteredModules.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500 flex flex-col items-center">
              <Boxes className="h-12 w-12 text-gray-200 mb-3" />
              <p className="font-medium">No modules found.</p>
            </div>
          ) : (
            filteredModules.map((mod) => (
              <div
                key={mod.uuid}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col group hover:shadow-md transition-shadow relative overflow-hidden"
              >
                {/* Decorative Background Blob */}
                <div
                  className="absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-150"
                  style={{ backgroundColor: brandColor }}
                ></div>

                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 shadow-sm flex items-center justify-center">
                    {/* Dynamic Icon Placeholder */}
                    <Layers className="h-6 w-6" style={{ color: brandColor }} />
                  </div>

                  <div className="flex items-center gap-1.5">
                    {mod.is_core ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                        <Shield className="h-3 w-3" /> Core
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-50 px-2 py-1 rounded-md border border-gray-200">
                        Custom
                      </span>
                    )}
                  </div>
                </div>

                <div className="relative z-10 flex-1">
                  <h3 className="text-lg font-bold text-gray-900">
                    {mod.name}
                  </h3>
                  <p className="text-xs text-gray-400 font-mono mt-1">
                    Code: {mod.code}
                  </p>

                  <div className="flex items-center gap-2 mt-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        mod.status === "active"
                          ? "bg-green-50 text-green-700 border border-green-100"
                          : "bg-gray-100 text-gray-600 border border-gray-200"
                      }`}
                    >
                      {mod.status === "active" ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5" />
                      )}
                      {mod.status}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200">
                      <LayoutGrid className="h-3.5 w-3.5 text-gray-400" />{" "}
                      {mod.features_count} Features
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 relative z-10">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Order #{mod.order_no}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(mod)}
                      className="p-1.5 text-xs font-medium rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                      title="Edit Module"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(mod.uuid, mod.is_core)}
                      disabled={mod.is_core}
                      className="p-1.5 text-xs font-medium rounded-lg text-red-500 hover:bg-red-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                      title={
                        mod.is_core
                          ? "Cannot delete core module"
                          : "Delete Module"
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <ModuleFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        moduleData={selectedModule}
      />
    </div>
  );
}
