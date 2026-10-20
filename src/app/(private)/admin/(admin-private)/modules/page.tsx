"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Boxes,
  Edit3,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "@/lib/theme";

const API_BASE_URL = "https://backend.garmentech.online/hrm/api/v1";

export interface ModuleItem {
  id: string;
  name: string;
  description: string;
}

interface ModulesResponse {
  success: boolean;
  data: ModuleItem[];
  timestamp: string;
  path: string;
  statusCode: number;
}

interface ModuleResponse {
  success: boolean;
  data: ModuleItem;
  timestamp: string;
  path: string;
  statusCode: number;
}

export default function ModuleManagementPage() {
  const { primaryColor } = useTheme();

  const [moduleList, setModuleList] = useState<ModuleItem[]>([]);
  const [search, setSearch] = useState("");
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<ModuleItem | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchModules = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/modules`, {
        method: "GET",
      });

      const result: ModulesResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error("Failed to fetch modules");
      }

      setModuleList(result.data);
    } catch (err) {
      console.warn(
        "Using demo module data because the API is unavailable:",
        err,
      );
      setModuleList([
        {
          id: "mod-1",
          name: "Admin",
          description: "System administration and user access.",
        },
        {
          id: "mod-2",
          name: "CRM",
          description: "Customer relationship and sales pipeline management.",
        },
        {
          id: "mod-3",
          name: "Inventory",
          description: "Stock, items, and purchase operations.",
        },
        {
          id: "mod-4",
          name: "Procurement",
          description: "Supplier and procurement workflow management.",
        },
      ]);
      setError("Using demo data because the backend is unavailable.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const filteredModules = useMemo(() => {
    const searchText = search.toLowerCase().trim();
    if (!searchText) return moduleList;

    return moduleList.filter(
      (module) =>
        module.name.toLowerCase().includes(searchText) ||
        module.description.toLowerCase().includes(searchText) ||
        module.id.toLowerCase().includes(searchText),
    );
  }, [moduleList, search]);

  const handleOpenAddModal = () => {
    setEditingModule(null);
    setFormData({ name: "", description: "" });
    setError("");
    setIsModalOpen(true);
  };

  const fetchSingleModule = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/modules/${id}`, {
        method: "GET",
      });

      const result: ModuleResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error("Failed to fetch module");
      }

      return result.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleOpenEditModal = async (module: ModuleItem) => {
    try {
      setSaving(true);
      setError("");

      let singleModule: ModuleItem | null = null;

      try {
        singleModule = await fetchSingleModule(module.id);
      } catch (detailError) {
        console.warn(
          "Falling back to table row data because full module details are unavailable:",
          detailError,
        );
      }

      const selectedModule = singleModule ?? module;

      setEditingModule(selectedModule);
      setFormData({
        name: selectedModule.name,
        description: selectedModule.description,
      });
      setIsModalOpen(true);
      setActiveDropdownId(null);

      if (!singleModule) {
        setError(
          "Couldn't load the full module details, so the form was opened with the available row data.",
        );
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load module details.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveModule = async (e: React.FormEvent) => {
    e.preventDefault();

    const moduleName = formData.name.trim();
    const moduleDescription = formData.description.trim();

    if (!moduleName) {
      setError("Module name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const isEditing = Boolean(editingModule);
      const url = isEditing
        ? `${API_BASE_URL}/modules/${editingModule!.id}`
        : `${API_BASE_URL}/modules`;
      const method = isEditing ? "PATCH" : "POST";

      const payload = {
        name: moduleName,
        description: moduleDescription,
      };

      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      let result: any = null;

      try {
        result = responseText ? JSON.parse(responseText) : null;
      } catch (parseError) {
        console.error("Response JSON parse error:", parseError);
        throw new Error(
          `Server returned an invalid response (${response.status}).`,
        );
      }

      if (!response.ok || !result?.success) {
        console.error("MODULE API ERROR:", JSON.stringify(result, null, 2));

        if (response.status === 401) {
          throw new Error(
            "Unauthorized. Your session may have expired. Please login again.",
          );
        }

        if (response.status === 403) {
          throw new Error(
            "You do not have permission to create or update modules.",
          );
        }

        if (response.status === 400) {
          const validationMessage =
            result?.message ||
            result?.error ||
            result?.errors?.[0]?.message ||
            "Invalid module data.";
          throw new Error(validationMessage);
        }

        throw new Error(
          result?.message ||
            result?.error ||
            result?.errors?.[0]?.message ||
            `Request failed with status ${response.status}.`,
        );
      }

      await fetchModules();
      setIsModalOpen(false);
      setEditingModule(null);
      setFormData({ name: "", description: "" });
      setError("");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save module.";
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteModule = async (id: string) => {
    const module = moduleList.find((item) => item.id === id);

    const confirmed = window.confirm(
      `Are you sure you want to delete "${module?.name || "this module"}"?`,
    );

    if (!confirmed) return;

    try {
      setSaving(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/modules/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error("Failed to delete module");
      }

      await fetchModules();
      setActiveDropdownId(null);
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      }
      setError("Failed to delete module.");
    } finally {
      setSaving(false);
    }
  };

  const focusHandlers = {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      e.currentTarget.style.borderColor = primaryColor;
      e.currentTarget.style.boxShadow = `0 0 0 3px ${primaryColor}20`;
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      e.currentTarget.style.borderColor = "";
      e.currentTarget.style.boxShadow = "";
    },
  };

  return (
    <div className="mx-auto max-w-[1600px] p-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end"
      >
        <div>
          <p
            className="mb-1 text-xs font-semibold uppercase tracking-[0.14em]"
            style={{ color: primaryColor }}
          >
            System Management
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Module Management
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage application modules and their system configuration.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
          style={{ backgroundColor: primaryColor }}
        >
          <Plus className="h-4 w-4" />
          Add Module
        </button>
      </motion.div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{
                backgroundColor: `${primaryColor}1A`,
                color: primaryColor,
              }}
            >
              <Boxes className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400">
                Total Modules
              </p>
              <p className="mt-0.5 text-xl font-bold text-slate-900">
                {moduleList.length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.07 }}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div>
            <p className="text-xs font-medium text-slate-400">API Status</p>
            <p className="mt-1 text-sm font-semibold text-emerald-600">
              Connected
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div>
            <p className="text-xs font-medium text-slate-400">Showing</p>
            <p className="mt-1 text-sm font-semibold text-slate-700">
              {filteredModules.length} modules
            </p>
          </div>
        </motion.div>
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
      >
        {/* Toolbar */}
        <div className="flex flex-col gap-4 border-b border-slate-100 p-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">System Modules</h2>
            <p className="mt-1 text-xs text-slate-400">
              Configure and manage platform modules.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search modules..."
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:bg-white"
              onFocus={(e) => {
                e.currentTarget.style.borderColor = primaryColor;
                e.currentTarget.style.boxShadow = `0 0 0 4px ${primaryColor}1A`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "";
                e.currentTarget.style.boxShadow = "";
              }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-left">
                {["ID", "Module", "Description", "Actions"].map((heading) => (
                  <th
                    key={heading}
                    className="px-5 py-4 text-[11px] font-semibold uppercase tracking-wide text-slate-400"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-10 text-center text-sm text-slate-400"
                  >
                    Loading modules...
                  </td>
                </tr>
              ) : filteredModules.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-10 text-center text-sm text-slate-400"
                  >
                    No modules found
                    {search ? ` matching "${search}"` : ""}.
                  </td>
                </tr>
              ) : (
                filteredModules.map((module, index) => (
                  <motion.tr
                    key={module.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.04 }}
                    className="transition hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-4">
                      <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        #{module.id}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-lg"
                          style={{
                            backgroundColor: `${primaryColor}1A`,
                            color: primaryColor,
                          }}
                        >
                          <Boxes className="h-4 w-4" />
                        </div>
                        <p className="text-sm font-semibold text-slate-800">
                          {module.name}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="max-w-xl truncate text-sm text-slate-500">
                        {module.description || "No description"}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <div className="relative flex items-center gap-1">
                        <button
                          type="button"
                          title="Edit"
                          disabled={saving}
                          onClick={() => handleOpenEditModal(module)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 disabled:opacity-50"
                          onMouseEnter={(e) => {
                            if (!saving) {
                              e.currentTarget.style.color = primaryColor;
                              e.currentTarget.style.backgroundColor = `${primaryColor}15`;
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = "";
                            e.currentTarget.style.backgroundColor = "";
                          }}
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>

                        <div className="relative">
                          <button
                            type="button"
                            title="More"
                            disabled={saving}
                            onClick={() =>
                              setActiveDropdownId(
                                activeDropdownId === module.id
                                  ? null
                                  : module.id,
                              )
                            }
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>

                          {activeDropdownId === module.id && (
                            <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(module)}
                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-slate-600 hover:bg-slate-50"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                                Edit Module
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteModule(module.id)}
                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-rose-600 hover:bg-rose-50"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete Module
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* CREATE / EDIT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !saving && setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-10 w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {editingModule ? "Edit Module" : "Add New Module"}
                  </h3>
                  {editingModule && (
                    <p className="mt-1 text-xs text-slate-400">
                      Module ID: #{editingModule.id}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSaveModule} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Module Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="e.g. HRMS"
                    className="mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none"
                    {...focusHandlers}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Brief description of the module..."
                    className="mt-1 w-full rounded-lg border border-slate-200 p-3 text-sm outline-none"
                    {...focusHandlers}
                  />
                </div>

                {editingModule && (
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs font-medium text-slate-500">
                      Update endpoint
                    </p>
                    <p className="mt-1 break-all font-mono text-xs text-slate-700">
                      PATCH /modules/{editingModule.id}
                    </p>
                  </div>
                )}

                <div className="mt-6 flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => setIsModalOpen(false)}
                    className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="h-10 rounded-lg px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {saving
                      ? "Saving..."
                      : editingModule
                        ? "Save Changes"
                        : "Create Module"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
