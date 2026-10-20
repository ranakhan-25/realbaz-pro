"use client";

import { motion } from "framer-motion";
import {
  Edit3,
  Eye,
  Filter,
  KeyRound,
  Loader2,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import type { FormEvent, ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  createFeature,
  deleteFeature,
  getFeature,
  getFeatures,
  updateFeature,
  type Feature,
} from "@/services/featureService";
import { useTheme } from "@/lib/theme";

export default function FeaturesPage() {
  const { primaryColor } = useTheme();

  const [features, setFeatures] = useState<Feature[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [moduleId, setModuleId] = useState("all");

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [viewOpen, setViewOpen] = useState(false);
  const [viewFeature, setViewFeature] = useState<Feature | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);

  const [featureToDelete, setFeatureToDelete] = useState<Feature | null>(null);

  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const [menuId, setMenuId] = useState<number | string | null>(null);

  const menuRootRef = useRef<HTMLDivElement | null>(null);

  const loadRequestIdRef = useRef(0);
  const viewRequestIdRef = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [moduleId]);

  const loadFeatures = useCallback(async () => {
    const requestId = ++loadRequestIdRef.current;

    try {
      setLoading(true);
      setError("");

      const response = await getFeatures({
        page,
        limit,
        search: search || undefined,
        moduleId: moduleId === "all" ? undefined : Number(moduleId),
      });

      if (requestId !== loadRequestIdRef.current) return;

      setFeatures(Array.isArray(response?.data) ? response.data : []);
      setTotal(response?.meta?.total ?? 0);
      setTotalPages(Math.max(1, response?.meta?.totalPages ?? 1));
    } catch (err) {
      if (requestId !== loadRequestIdRef.current) return;

      setError(err instanceof Error ? err.message : "Failed to load features.");
      setFeatures([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      if (requestId === loadRequestIdRef.current) {
        setLoading(false);
      }
    }
  }, [page, limit, search, moduleId]);

  useEffect(() => {
    loadFeatures();
  }, [loadFeatures]);

  useEffect(() => {
    if (menuId === null) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRootRef.current?.contains(event.target as Node)) {
        setMenuId(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuId(null);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuId]);

  const openView = async (feature: Feature) => {
    const requestId = ++viewRequestIdRef.current;

    setMenuId(null);
    setViewOpen(true);
    setViewLoading(true);
    setViewError("");
    setViewFeature(null);

    try {
      const data = await getFeature(feature.id);
      if (requestId !== viewRequestIdRef.current) return;
      setViewFeature(data);
    } catch (err) {
      if (requestId !== viewRequestIdRef.current) return;
      setViewFeature(feature);
      setViewError(
        err instanceof Error
          ? err.message
          : "Couldn't load full details — showing cached data.",
      );
    } finally {
      if (requestId === viewRequestIdRef.current) {
        setViewLoading(false);
      }
    }
  };

  const openCreate = () => {
    setEditingFeature(null);
    setShowForm(true);
  };

  const openEdit = (feature: Feature) => {
    setMenuId(null);
    setEditingFeature(feature);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingFeature(null);
    loadFeatures();
  };

  const requestDelete = (feature: Feature) => {
    setMenuId(null);
    setDeleteError("");
    setFeatureToDelete(feature);
  };

  const confirmDelete = async () => {
    if (!featureToDelete) return;

    setDeletingId(featureToDelete.id);
    setDeleteError("");

    try {
      await deleteFeature(featureToDelete.id);
      setFeatureToDelete(null);

      if (features.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        await loadFeatures();
      }
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Failed to delete feature.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-[1600px]">
      {/* HEADER */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Feature Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage system features and their module associations.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-white transition hover:opacity-90"
          style={{ backgroundColor: primaryColor }}
        >
          <Plus className="h-4 w-4" />
          Add Feature
        </button>
      </div>

      {/* CARD */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* FILTERS */}
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search features..."
              aria-label="Search features"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:bg-white"
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

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={moduleId}
              onChange={(e) => setModuleId(e.target.value)}
              aria-label="Filter by module"
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none"
              onFocus={(e) => {
                e.currentTarget.style.borderColor = primaryColor;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "";
              }}
            >
              <option value="all">All Modules</option>
              <option value="1">Module 1</option>
              <option value="2">Module 2</option>
              <option value="3">Module 3</option>
            </select>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div
            role="alert"
            className="m-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
          >
            {error}
          </div>
        )}

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-left">
                {[
                  "Feature",
                  "Description",
                  "Module",
                  "Module ID",
                  "Created",
                  "Actions",
                ].map((head) => (
                  <th
                    key={head}
                    scope="col"
                    className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <Loader2
                      className="mx-auto h-6 w-6 animate-spin"
                      style={{ color: primaryColor }}
                    />
                    <p className="mt-2 text-sm text-slate-400">
                      Loading features...
                    </p>
                  </td>
                </tr>
              ) : features.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <KeyRound className="mx-auto h-8 w-8 text-slate-300" />
                    <p className="mt-2 text-sm font-medium text-slate-500">
                      No features found.
                    </p>
                  </td>
                </tr>
              ) : (
                features.map((feature, index) => (
                  <motion.tr
                    key={feature.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                          style={{
                            backgroundColor: `${primaryColor}1A`,
                            color: primaryColor,
                          }}
                        >
                          <KeyRound className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {feature.name}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-400">
                            ID: {feature.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="max-w-sm truncate text-sm text-slate-500">
                        {feature.description || "—"}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className="rounded-lg px-2.5 py-1 text-xs font-medium"
                        style={{
                          backgroundColor: `${primaryColor}1A`,
                          color: primaryColor,
                        }}
                      >
                        {feature.module?.name || "Module"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-500">
                      {feature.moduleId}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-500">
                      {formatDate(feature.createdAt)}
                    </td>

                    <td className="relative px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openView(feature)}
                          title="View"
                          aria-label={`View ${feature.name}`}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100"
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = primaryColor;
                            e.currentTarget.style.backgroundColor = `${primaryColor}15`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = "";
                            e.currentTarget.style.backgroundColor = "";
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => openEdit(feature)}
                          title="Edit"
                          aria-label={`Edit ${feature.name}`}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100"
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = primaryColor;
                            e.currentTarget.style.backgroundColor = `${primaryColor}15`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = "";
                            e.currentTarget.style.backgroundColor = "";
                          }}
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => requestDelete(feature)}
                          disabled={deletingId === feature.id}
                          title="Delete"
                          aria-label={`Delete ${feature.name}`}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {deletingId === feature.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {!loading && total > 0 && (
          <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {(page - 1) * limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-700">
                {Math.min(page * limit, total)}
              </span>{" "}
              of <span className="font-semibold text-slate-700">{total}</span>{" "}
              features
            </p>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((current) => current - 1)}
                aria-label="Previous page"
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1)
                .filter(
                  (item) =>
                    item === 1 ||
                    item === totalPages ||
                    Math.abs(item - page) <= 1,
                )
                .map((item, index, array) => (
                  <div key={item} className="flex items-center gap-1">
                    {index > 0 && array[index - 1] !== item - 1 && (
                      <span className="px-1 text-slate-400">...</span>
                    )}

                    <button
                      type="button"
                      onClick={() => setPage(item)}
                      aria-current={page === item ? "page" : undefined}
                      aria-label={`Page ${item}`}
                      className={`h-9 min-w-9 rounded-lg px-2 text-sm font-medium transition ${
                        page === item
                          ? "text-white"
                          : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                      style={
                        page === item
                          ? { backgroundColor: primaryColor }
                          : undefined
                      }
                    >
                      {item}
                    </button>
                  </div>
                ))}

              <button
                type="button"
                disabled={page === totalPages}
                onClick={() => setPage((current) => current + 1)}
                aria-label="Next page"
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* VIEW MODAL */}
      {viewOpen && (
        <Modal
          onClose={() => setViewOpen(false)}
          labelledBy="feature-view-heading"
        >
          <div className="p-6">
            <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2
                  id="feature-view-heading"
                  className="text-lg font-bold text-slate-900"
                >
                  Feature Details
                </h2>
                <p className="text-sm text-slate-500">
                  Complete feature information
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewOpen(false)}
                aria-label="Close"
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {viewLoading ? (
              <div className="py-12 text-center">
                <Loader2
                  className="mx-auto h-6 w-6 animate-spin"
                  style={{ color: primaryColor }}
                />
              </div>
            ) : viewFeature ? (
              <>
                {viewError && (
                  <p
                    role="alert"
                    className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-700"
                  >
                    {viewError}
                  </p>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <Detail label="ID" value={viewFeature.id} />
                  <Detail label="Name" value={viewFeature.name} />
                  <Detail label="Description" value={viewFeature.description} />
                  <Detail label="Module" value={viewFeature.module?.name} />
                  <Detail label="Module ID" value={viewFeature.moduleId} />
                  <Detail
                    label="Created"
                    value={formatDate(viewFeature.createdAt)}
                  />
                  <Detail
                    label="Updated"
                    value={formatDate(viewFeature.updatedAt)}
                  />
                  <Detail label="UUID" value={viewFeature.uuid} />
                </div>
              </>
            ) : null}
          </div>
        </Modal>
      )}

      {/* CREATE / EDIT MODAL */}
      {showForm && (
        <Modal
          onClose={() => {
            setShowForm(false);
            setEditingFeature(null);
          }}
          labelledBy="feature-form-heading"
          maxWidthClass="max-w-4xl"
        >
          <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <h2
                id="feature-form-heading"
                className="text-lg font-bold text-slate-900"
              >
                {editingFeature ? "Edit Feature" : "Create Feature"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {editingFeature
                  ? "Update this feature's details."
                  : "Add a new feature to a module."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingFeature(null);
              }}
              aria-label="Close"
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6">
            <FeatureForm
              feature={editingFeature}
              onCancel={() => {
                setShowForm(false);
                setEditingFeature(null);
              }}
              onSuccess={handleFormSuccess}
            />
          </div>
        </Modal>
      )}

      {/* DELETE CONFIRM */}
      {featureToDelete && (
        <Modal
          onClose={() => (deletingId ? undefined : setFeatureToDelete(null))}
          labelledBy="delete-feature-heading"
          maxWidthClass="max-w-md"
        >
          <div className="space-y-4 p-6">
            <h2
              id="delete-feature-heading"
              className="text-lg font-bold text-slate-900"
            >
              Delete feature?
            </h2>
            <p className="text-sm text-slate-500">
              This will permanently remove{" "}
              <span className="font-semibold text-slate-700">
                {featureToDelete.name}
              </span>
              . Any permissions tied to it may be affected. This action cannot
              be undone.
            </p>
            {deleteError && (
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600"
              >
                {deleteError}
              </p>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setFeatureToDelete(null)}
                disabled={deletingId !== null}
                className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deletingId !== null}
                className="flex h-10 items-center gap-2 rounded-xl bg-red-500 px-4 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingId !== null && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ================= FORM ================= */

function FeatureForm({
  feature,
  onCancel,
  onSuccess,
}: {
  feature: Feature | null;
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const { primaryColor } = useTheme();

  const [name, setName] = useState(feature?.name ?? "");
  const [description, setDescription] = useState(feature?.description ?? "");
  const [moduleId, setModuleId] = useState(
    feature?.moduleId !== undefined ? String(feature.moduleId) : "",
  );
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!name.trim() || !moduleId.trim()) {
      setFormError("Name and module are required.");
      return;
    }

    setSaving(true);
    setFormError("");

    try {
      const payload = {
        name: name.trim(),
        description: description.trim() || undefined,
        moduleId: Number(moduleId),
      };

      if (feature) {
        await updateFeature(feature.id, payload);
      } else {
        await createFeature(payload);
      }

      onSuccess();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to save feature.",
      );
    } finally {
      setSaving(false);
    }
  };

  const focusHandlers = {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      e.currentTarget.style.borderColor = primaryColor;
      e.currentTarget.style.boxShadow = `0 0 0 4px ${primaryColor}1A`;
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      e.currentTarget.style.borderColor = "";
      e.currentTarget.style.boxShadow = "";
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600"
        >
          {formError}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="feature-name"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500"
          >
            Name
          </label>
          <input
            id="feature-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none"
            {...focusHandlers}
          />
        </div>

        <div>
          <label
            htmlFor="feature-module"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500"
          >
            Module ID
          </label>
          <input
            id="feature-module"
            type="number"
            value={moduleId}
            onChange={(e) => setModuleId(e.target.value)}
            required
            className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none"
            {...focusHandlers}
          />
          <p className="mt-1 text-xs text-slate-400">
            Placeholder until a real module picker is wired up.
          </p>
        </div>
      </div>

      <div>
        <label
          htmlFor="feature-description"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500"
        >
          Description
        </label>
        <textarea
          id="feature-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none"
          {...focusHandlers}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          style={{ backgroundColor: primaryColor }}
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {feature ? "Save Changes" : "Create Feature"}
        </button>
      </div>
    </form>
  );
}

/* ================= DETAIL ================= */

function Detail({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-semibold text-slate-700">
        {value === undefined || value === null || value === "" ? "—" : value}
      </p>
    </div>
  );
}

/* ================= MODAL ================= */

function Modal({
  children,
  onClose,
  labelledBy,
  maxWidthClass = "max-w-2xl",
}: {
  children: ReactNode;
  onClose: () => void;
  labelledBy?: string;
  maxWidthClass?: string;
}) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        onMouseDown={(event) => event.stopPropagation()}
        className={`max-h-[90vh] w-full ${maxWidthClass} overflow-y-auto rounded-2xl bg-white shadow-2xl`}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ================= DATE ================= */

function formatDate(date?: string) {
  if (!date) return "—";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
