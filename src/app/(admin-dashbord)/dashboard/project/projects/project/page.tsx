/* eslint-disable prettier/prettier */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5002"
).replace(/\/+$/, "");

const API_URL = `${BASE_URL}/realbizpro/api/v1/project`;

type Project = {
  id?: string | number;
  uuid?: string;
  code?: string;
  name?: string;
  projectType?: string | null;
  areaCategory?: string | null;
  location?: string | null;
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  contactPersonName?: string | null;
  contactPhone?: string | null;
  clientEmail?: string | null;
  contractorCompany?: string | null;
  projectManager?: string | null;
  totalBudget?: number | null;
  numberOfStoreys?: number | null;
  progressPercentage?: number;
  status?: string;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type ProjectForm = {
  code: string;
  name: string;
  projectType: string;
  areaCategory: string;
  location: string;
  description: string;
  startDate: string;
  endDate: string;
  contactPersonName: string;
  contactPhone: string;
  clientEmail: string;
  contractorCompany: string;
  projectManager: string;
  totalBudget: string;
  numberOfStoreys: string;
  progressPercentage: string;
  status: string;
};

// ==================== AUTO CODE GENERATOR ====================
function generateProjectCode(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(1 + Math.random() * 999);
  return `PRJ-${year}-${String(rand).padStart(3, "0")}`;
}

const EMPTY_FORM: ProjectForm = {
  code: generateProjectCode(),
  name: "",
  projectType: "",
  areaCategory: "",
  location: "",
  description: "",
  startDate: "",
  endDate: "",
  contactPersonName: "",
  contactPhone: "",
  clientEmail: "",
  contractorCompany: "",
  projectManager: "",
  totalBudget: "",
  numberOfStoreys: "",
  progressPercentage: "",
  status: "ACTIVE",
};

async function apiRequest<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  const text = await response.text();
  let result: unknown;

  if (text) {
    try {
      result = JSON.parse(text);
    } catch {
      result = text;
    }
  }

  if (!response.ok) {
    let message = `Request failed (${response.status})`;

    if (typeof result === "string" && result.trim()) {
      message = result;
    } else if (result && typeof result === "object") {
      const body = result as Record<string, unknown>;
      const serverMessage = body.message ?? body.error;

      message = Array.isArray(serverMessage)
        ? serverMessage.join(", ")
        : typeof serverMessage === "string"
          ? serverMessage
          : message;
    }

    throw new Error(message);
  }

  return result as T;
}

function normalizeProjects(response: unknown): Project[] {
  if (Array.isArray(response)) {
    return response as Project[];
  }

  if (!response || typeof response !== "object") {
    return [];
  }

  const object = response as Record<string, unknown>;

  for (const key of ["data", "projects", "items", "rows", "results"]) {
    const value = object[key];

    if (Array.isArray(value)) {
      return value as Project[];
    }

    if (value && typeof value === "object") {
      const nested = normalizeProjects(value);

      if (nested.length > 0) {
        return nested;
      }
    }
  }

  return [];
}

function getProjectUuid(project: Project): string | undefined {
  return typeof project.uuid === "string" && project.uuid.trim()
    ? project.uuid.trim()
    : undefined;
}

function dateForInput(value?: string | null): string {
  return value ? value.slice(0, 10) : "";
}

function statusClass(status?: string): string {
  switch ((status ?? "").toUpperCase()) {
    case "ACTIVE":
      return "bg-green-100 text-green-700";
    case "INACTIVE":
      return "bg-gray-100 text-gray-700";
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "COMPLETED":
      return "bg-blue-100 text-blue-700";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function escapeCsv(value: unknown): string {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

export default function ProjectsPage({
  initialStatusFilter = "ALL",
  heading = "Projects",
}: {
  initialStatusFilter?: string;
  heading?: string;
}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [form, setForm] = useState<ProjectForm>(EMPTY_FORM);

  // Load projects and exclude soft-deleted records.
  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiRequest<unknown>(
        `${API_URL}?page=1&limit=100`,
        { method: "GET" },
      );

      const loadedProjects = normalizeProjects(response);

      setProjects(loadedProjects.filter((project) => !project.deletedAt));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Projects load করতে সমস্যা হয়েছে।",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return projects.filter((project) => {
      const values = [
        project.code,
        project.name,
        project.projectType,
        project.areaCategory,
        project.location,
        project.contactPersonName,
        project.contactPhone,
        project.clientEmail,
        project.contractorCompany,
        project.projectManager,
        project.status,
      ];

      const matchesSearch =
        !query ||
        values.some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(query),
        );

      const matchesStatus =
        statusFilter === "ALL" ||
        (project.status ?? "").toUpperCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / pageSize));

  const currentPage = Math.min(page, totalPages);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * pageSize;

    return filteredProjects.slice(start, start + pageSize);
  }, [filteredProjects, currentPage, pageSize]);

  function updateForm<K extends keyof ProjectForm>(
    key: K,
    value: ProjectForm[K],
  ) {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function openCreateModal() {
    setEditingProject(null);
    // ✅ Modal open e notun auto code generate
    setForm({
      ...EMPTY_FORM,
      code: generateProjectCode(),
    });
    setError("");
    setSuccess("");
    setModalOpen(true);
  }

  function openEditModal(project: Project) {
    setEditingProject(project);

    setForm({
      code: project.code ?? "",
      name: project.name ?? "",
      projectType: project.projectType ?? "",
      areaCategory: project.areaCategory ?? "",
      location: project.location ?? "",
      description: project.description ?? "",
      startDate: dateForInput(project.startDate),
      endDate: dateForInput(project.endDate),
      contactPersonName: project.contactPersonName ?? "",
      contactPhone: project.contactPhone ?? "",
      clientEmail: project.clientEmail ?? "",
      contractorCompany: project.contractorCompany ?? "",
      projectManager: project.projectManager ?? "",
      totalBudget:
        project.totalBudget == null ? "" : String(project.totalBudget),
      numberOfStoreys:
        project.numberOfStoreys == null ? "" : String(project.numberOfStoreys),
      progressPercentage:
        project.progressPercentage == null
          ? ""
          : String(project.progressPercentage),
      status: (project.status ?? "ACTIVE").toUpperCase(),
    });

    setError("");
    setSuccess("");
    setModalOpen(true);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const code = form.code.trim();
    const name = form.name.trim();

    if (!code) {
      setError("Project code is required.");
      return;
    }

    if (!name) {
      setError("Project name is required.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      code,
      name,
      projectType: form.projectType.trim() || null,
      areaCategory: form.areaCategory.trim(),
      location: form.location.trim(),
      description: form.description.trim(),
      startDate: form.startDate || null,
      endDate: form.endDate || null,
      contactPersonName: form.contactPersonName.trim(),
      contactPhone: form.contactPhone.trim(),
      clientEmail: form.clientEmail.trim(),
      contractorCompany: form.contractorCompany.trim(),
      projectManager: form.projectManager.trim(),
      totalBudget: form.totalBudget.trim() ? Number(form.totalBudget) : null,
      numberOfStoreys: form.numberOfStoreys.trim()
        ? Number(form.numberOfStoreys)
        : null,
      progressPercentage: form.progressPercentage.trim()
        ? Number(form.progressPercentage)
        : null,
      status: form.status,
    };

    try {
      let url = API_URL;
      let method = "POST";

      if (editingProject) {
        const uuid = getProjectUuid(editingProject);

        if (!uuid) {
          throw new Error("Project UUID পাওয়া যায়নি।");
        }

        url = `${API_URL}/${encodeURIComponent(uuid)}`;
        method = "PATCH";
      }

      await apiRequest(url, {
        method,
        body: JSON.stringify(payload),
      });

      setModalOpen(false);
      setEditingProject(null);
      setForm(EMPTY_FORM);

      setSuccess(
        editingProject
          ? "Project successfully updated."
          : "Project successfully created.",
      );

      await loadProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Project save করা যায়নি।");
    } finally {
      setSaving(false);
    }
  }

  // Delete by UUID and update UI immediately.
  async function handleDelete() {
    if (!deleteTarget || deleting) return;

    const uuid = getProjectUuid(deleteTarget);

    if (!uuid) {
      setError("এই project-এর UUID response-এ পাওয়া যায়নি।");
      return;
    }

    setDeleting(true);
    setError("");
    setSuccess("");

    try {
      await apiRequest(`${API_URL}/${encodeURIComponent(uuid)}`, {
        method: "DELETE",
      });

      setProjects((previous) =>
        previous.filter((project) => getProjectUuid(project) !== uuid),
      );

      setDeleteTarget(null);
      setSuccess("Project successfully deleted.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Project delete করা যায়নি।",
      );
    } finally {
      setDeleting(false);
    }
  }

  function exportCsv() {
    const columns: (keyof Project)[] = [
      "code",
      "name",
      "projectType",
      "areaCategory",
      "location",
      "description",
      "startDate",
      "endDate",
      "contactPersonName",
      "contactPhone",
      "clientEmail",
      "contractorCompany",
      "projectManager",
      "totalBudget",
      "numberOfStoreys",
      "progressPercentage",
      "status",
    ];

    const rows = [
      columns.map(escapeCsv).join(","),
      ...filteredProjects.map((project) =>
        columns.map((column) => escapeCsv(project[column])).join(","),
      ),
    ];

    const blob = new Blob(["\uFEFF" + rows.join("\r\n")], {
      type: "text/csv;charset=utf-8;",
    });

    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = objectUrl;
    anchor.download = "projects.csv";
    anchor.click();

    URL.revokeObjectURL(objectUrl);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 text-gray-900 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold">{heading}</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage all your projects.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={exportCsv}
              disabled={!filteredProjects.length}
              className="rounded-lg border bg-white px-4 py-2 text-sm disabled:opacity-50"
            >
              Export CSV
            </button>

            <button
              type="button"
              onClick={() => void loadProjects()}
              disabled={loading}
              className="rounded-lg border bg-white px-4 py-2 text-sm disabled:opacity-50"
            >
              Refresh
            </button>

            <button
              type="button"
              onClick={openCreateModal}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              + Create Project
            </button>
          </div>
        </header>

        {success && (
          <div className="mb-4 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            <span>{success}</span>
            <button
              type="button"
              onClick={() => setSuccess("")}
              aria-label="Dismiss success message"
            >
              ×
            </button>
          </div>
        )}

        {error && !modalOpen && !deleteTarget && (
          <div className="mb-4 flex items-start justify-between rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        <section className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search projects..."
              className="rounded-lg border px-3 py-2 text-sm"
            />

            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setPage(1);
              }}
              className="rounded-lg border px-3 py-2 text-sm"
            >
              <option value="ALL">All statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            <select
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setPage(1);
              }}
              className="rounded-lg border px-3 py-2 text-sm"
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          </div>

          <p className="mb-3 text-sm text-gray-500">
            {loading ? "Loading..." : `${filteredProjects.length} project(s)`}
          </p>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-600">
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Area Category</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Contact Person</th>
                  <th className="px-4 py-3">Start Date</th>
                  <th className="px-4 py-3">Budget</th>
                  <th className="px-4 py-3">Storeys</th>
                  <th className="px-4 py-3">Progress</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={11} className="px-4 py-10 text-center">
                      Loading projects...
                    </td>
                  </tr>
                ) : paginatedProjects.length === 0 ? (
                  <tr>
                    <td
                      colSpan={11}
                      className="px-4 py-10 text-center text-gray-500"
                    >
                      No projects found.
                    </td>
                  </tr>
                ) : (
                  paginatedProjects.map((project, index) => (
                    <tr
                      key={project.uuid ?? String(project.id ?? index)}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 font-medium">
                        {project.code ?? "—"}
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-medium">{project.name ?? "—"}</div>
                        <div className="max-w-xs truncate text-xs text-gray-500">
                          {project.description ?? ""}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        {project.areaCategory ?? "—"}
                      </td>

                      <td className="px-4 py-3">{project.location ?? "—"}</td>

                      <td className="px-4 py-3">
                        {project.contactPersonName ?? "—"}
                      </td>

                      <td className="px-4 py-3">{project.startDate ?? "—"}</td>

                      <td className="px-4 py-3">
                        {project.totalBudget ?? "—"}
                      </td>

                      <td className="px-4 py-3">
                        {project.numberOfStoreys ?? "—"}
                      </td>

                      <td className="px-4 py-3">
                        {project.progressPercentage == null
                          ? "—"
                          : `${project.progressPercentage}%`}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(project.status)}`}
                        >
                          {project.status ?? "N/A"}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(project)}
                            className="rounded-md border px-3 py-1.5 text-xs hover:bg-gray-100"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setError("");
                              setSuccess("");
                              setDeleteTarget(project);
                            }}
                            className="rounded-md border border-red-200 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col justify-between gap-3 border-t pt-4 sm:flex-row sm:items-center">
            <p className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setPage((previous) => Math.max(1, previous - 1))}
                className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40"
              >
                Previous
              </button>

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() =>
                  setPage((previous) => Math.min(totalPages, previous + 1))
                }
                className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
          <div className="my-8 w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingProject ? "Edit Project" : "Create Project"}
              </h2>

              <button
                type="button"
                onClick={() => {
                  if (!saving) {
                    setModalOpen(false);
                    setEditingProject(null);
                    setError("");
                  }
                }}
                disabled={saving}
                className="text-2xl text-gray-500"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* ✅ Project Code — auto-generated, read-only */}
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Project Code *
                  </label>
                  <input
                    type="text"
                    value={form.code}
                    readOnly
                    className="w-full cursor-not-allowed rounded-lg border bg-gray-50 px-3 py-2 text-gray-700"
                    title="Auto-generated code"
                  />
                </div>

                {(
                  [
                    ["name", "Project Name *", true],
                    ["projectType", "Project Type", false],
                    ["areaCategory", "Area Category", false],
                    ["location", "Location", false],
                    ["startDate", "Start Date", false],
                    ["endDate", "End Date", false],
                    ["contactPersonName", "Contact Person", false],
                    ["contactPhone", "Contact Phone", false],
                    ["clientEmail", "Client Email", false],
                    ["contractorCompany", "Contractor Company", false],
                    ["projectManager", "Project Manager", false],
                  ] as [keyof ProjectForm, string, boolean][]
                ).map(([key, label, required]) => (
                  <div key={key}>
                    <label className="mb-1 block text-sm font-medium">
                      {label}
                    </label>

                    <input
                      type={
                        key === "startDate" || key === "endDate"
                          ? "date"
                          : key === "clientEmail"
                            ? "email"
                            : "text"
                      }
                      value={form[key]}
                      onChange={(event) => updateForm(key, event.target.value)}
                      required={required}
                      className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
                    />
                  </div>
                ))}

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Total Budget
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.totalBudget}
                    onChange={(event) =>
                      updateForm("totalBudget", event.target.value)
                    }
                    className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Number of Storeys
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.numberOfStoreys}
                    onChange={(event) =>
                      updateForm("numberOfStoreys", event.target.value)
                    }
                    className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Progress Percentage
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={form.progressPercentage}
                    onChange={(event) =>
                      updateForm("progressPercentage", event.target.value)
                    }
                    className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Status
                  </label>

                  <select
                    value={form.status}
                    onChange={(event) =>
                      updateForm("status", event.target.value)
                    }
                    className="w-full rounded-lg border px-3 py-2"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="PENDING">Pending</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="ON_HOLD">On Hold</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(event) =>
                    updateForm("description", event.target.value)
                  }
                  rows={3}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-3 border-t pt-4">
                <button
                  type="button"
                  onClick={() => {
                    if (!saving) {
                      setModalOpen(false);
                      setEditingProject(null);
                      setError("");
                    }
                  }}
                  disabled={saving}
                  className="rounded-lg border px-4 py-2 text-sm"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingProject
                      ? "Update Project"
                      : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold">Delete Project</h2>

            <p className="mt-3 text-sm text-gray-600">
              Delete <strong>{deleteTarget.name ?? "this project"}</strong>?
            </p>

            <p className="mt-2 break-all text-xs text-gray-500">
              UUID: {deleteTarget.uuid ?? "Missing"}
            </p>

            {error && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  if (!deleting) {
                    setDeleteTarget(null);
                    setError("");
                  }
                }}
                disabled={deleting}
                className="rounded-lg border px-4 py-2 text-sm"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
