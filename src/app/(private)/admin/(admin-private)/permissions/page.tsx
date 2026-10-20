/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
"use client";

import { useState, useEffect, useMemo } from "react";
import { useTheme } from "@/lib/theme";
import {
  Search,
  Shield,
  KeyRound,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronRight,
  Check,
  Save,
  Users,
  Filter,
} from "lucide-react";

// ডামি ডেটা - পারমিশন স্ট্রাকচার (মডিউল এবং ফিচার অনুযায়ী)
const DUMMY_MODULES = [
  {
    id: "m1",
    name: "Organization Management",
    code: "org",
    features: [
      { id: "f1", name: "Organizations List", code: "org.list" },
      { id: "f2", name: "Organization Details", code: "org.details" },
      { id: "f3", name: "Create Organization", code: "org.create" },
      { id: "f4", name: "Edit Organization", code: "org.edit" },
      { id: "f5", name: "Delete Organization", code: "org.delete" },
    ],
  },
  {
    id: "m2",
    name: "User Management",
    code: "user",
    features: [
      { id: "f6", name: "Users List", code: "user.list" },
      { id: "f7", name: "Create User", code: "user.create" },
      { id: "f8", name: "Edit User", code: "user.edit" },
      { id: "f9", name: "Assign Roles", code: "user.roles" },
    ],
  },
  {
    id: "m3",
    name: "System Settings",
    code: "system",
    features: [
      { id: "f10", name: "Web Settings", code: "system.web" },
      { id: "f11", name: "Audit Logs", code: "system.audit" },
      { id: "f12", name: "System Config", code: "system.config" },
    ],
  },
];

const ACTIONS = ["view", "create", "edit", "delete", "approve", "export"];

export default function PermissionsPage() {
  const { primaryColor } = useTheme();
  const brandColor = primaryColor || "#2ed573";

  const [isLoading, setIsLoading] = useState(true);
  const [isUsingDummy, setIsUsingDummy] = useState(false);

  // States for Matrix
  const [selectedRole, setSelectedRole] = useState("admin");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([
    "org.list.view",
    "org.details.view",
    "user.list.view",
    "user.create.create",
  ]);
  const [expandedModules, setExpandedModules] = useState<string[]>([
    "m1",
    "m2",
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // ডেটা ফেচ (API থাকলে)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // const res = await fetch("/api/permissions");
        // if (!res.ok) throw new Error();
        // const data = await res.json();
        // setModules(data);
        setTimeout(() => {
          setIsLoading(false);
          setIsUsingDummy(true);
        }, 600);
      } catch (error) {
        setIsLoading(false);
        setIsUsingDummy(true);
      }
    };
    fetchData();
  }, []);

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId],
    );
  };

  const togglePermission = (featureCode: string, action: string) => {
    const permString = `${featureCode}.${action}`;
    setSelectedPermissions((prev) =>
      prev.includes(permString)
        ? prev.filter((p) => p !== permString)
        : [...prev, permString],
    );
  };

  const isChecked = (featureCode: string, action: string) => {
    return selectedPermissions.includes(`${featureCode}.${action}`);
  };

  const toggleRow = (featureCode: string) => {
    const rowPerms = ACTIONS.map((action) => `${featureCode}.${action}`);
    const allSelected = rowPerms.every((p) => selectedPermissions.includes(p));

    if (allSelected) {
      setSelectedPermissions((prev) =>
        prev.filter((p) => !rowPerms.includes(p)),
      );
    } else {
      setSelectedPermissions((prev) => [...new Set([...prev, ...rowPerms])]);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // await fetch(`/api/roles/${selectedRole}/permissions`, { method: "PUT", body: JSON.stringify({ permissions: selectedPermissions }) });
      setTimeout(() => {
        alert(`Permissions saved for ${selectedRole} (Demo Mode)`);
        setIsSaving(false);
      }, 800);
    } catch (error) {
      alert("Failed to save");
      setIsSaving(false);
    }
  };

  // Filter Modules based on search
  const filteredModules = useMemo(() => {
    return DUMMY_MODULES.map((mod) => ({
      ...mod,
      features: mod.features.filter((f) =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    })).filter((mod) => mod.features.length > 0);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <KeyRound className="h-7 w-7" style={{ color: brandColor }} />
              Access Control Matrix
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Configure granular permissions for each role across all modules.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl text-white font-medium text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
            style={{ backgroundColor: brandColor }}
          >
            <Save className="h-4 w-4" />{" "}
            {isSaving ? "Saving..." : "Save Permissions"}
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

        {/* Toolbar: Role Selector & Search */}
        <div className="bg-white p-4 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="p-2 rounded-lg bg-gray-50 border border-gray-200">
              <Users className="h-5 w-5 text-gray-500" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                Select Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="font-semibold text-gray-900 text-sm bg-transparent border-none outline-none cursor-pointer focus:ring-0"
              >
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 transition-all"
              style={{ "--tw-ring-color": `${brandColor}40` } as any}
            />
          </div>
        </div>

        {/* Premium Matrix Table */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-1/3">
                    Module / Feature
                  </th>
                  {ACTIONS.map((action) => (
                    <th
                      key={action}
                      className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center capitalize"
                    >
                      {action}
                    </th>
                  ))}
                  <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
                    All
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-12 text-center text-gray-400"
                    >
                      Loading matrix...
                    </td>
                  </tr>
                ) : filteredModules.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No features found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredModules.map((module) => {
                    const isExpanded = expandedModules.includes(module.id);

                    return (
                      <tbody key={module.id} className="contents">
                        {/* Module Header */}
                        <tr
                          className="bg-gray-50/30 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100"
                          onClick={() => toggleModule(module.id)}
                        >
                          <td colSpan={8} className="px-6 py-3">
                            <div className="flex items-center gap-2">
                              <div className="p-1 rounded bg-white border border-gray-200 shadow-sm">
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4 text-gray-600" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-gray-600" />
                                )}
                              </div>
                              <span className="font-bold text-gray-800 text-sm">
                                {module.name}
                              </span>
                              <span className="text-[10px] text-gray-400 font-mono bg-gray-100 px-2 py-0.5 rounded ml-2">
                                {module.code}
                              </span>
                            </div>
                          </td>
                        </tr>

                        {/* Features */}
                        {isExpanded &&
                          module.features.map((feature) => {
                            const allChecked = ACTIONS.every((action) =>
                              isChecked(feature.code, action),
                            );

                            return (
                              <tr
                                key={feature.id}
                                className="hover:bg-gray-50/50 transition-colors group"
                              >
                                <td className="px-8 py-3 border-l-2 border-transparent group-hover:border-gray-300 transition-colors">
                                  <span className="text-sm text-gray-700 font-medium">
                                    {feature.name}
                                  </span>
                                  <span className="block text-[10px] text-gray-400 font-mono mt-0.5">
                                    {feature.code}
                                  </span>
                                </td>

                                {ACTIONS.map((action) => (
                                  <td
                                    key={action}
                                    className="px-4 py-3 text-center"
                                  >
                                    <label className="inline-flex items-center justify-center cursor-pointer p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                                      <input
                                        type="checkbox"
                                        checked={isChecked(
                                          feature.code,
                                          action,
                                        )}
                                        onChange={() =>
                                          togglePermission(feature.code, action)
                                        }
                                        className="w-4 h-4 rounded border-gray-300 transition-colors focus:ring-0 cursor-pointer"
                                        style={{ accentColor: brandColor }}
                                      />
                                    </label>
                                  </td>
                                ))}

                                {/* Row Toggle */}
                                <td className="px-4 py-3 text-center">
                                  <button
                                    onClick={() => toggleRow(feature.code)}
                                    className={`p-1.5 rounded-lg transition-colors border ${allChecked ? "text-white border-transparent shadow-sm" : "text-gray-400 border-gray-200 hover:bg-gray-100"}`}
                                    style={
                                      allChecked
                                        ? { backgroundColor: brandColor }
                                        : {}
                                    }
                                  >
                                    <Check className="h-3.5 w-3.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer info */}
          <div className="bg-gray-50 border-t border-gray-100 p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-sm text-gray-500 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <strong className="text-gray-900">
                {selectedPermissions.length}
              </strong>{" "}
              permissions selected for{" "}
              <strong className="text-gray-900 capitalize">
                {selectedRole}
              </strong>
            </span>
            <div className="flex gap-2 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <XCircle className="h-3 w-3" /> Unchecked = Denied
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
