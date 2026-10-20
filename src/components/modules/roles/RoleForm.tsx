"use client";

import { Loader2, Save, X } from "lucide-react";
import { useEffect, useState } from "react";

import { createRole, type Role, updateRole } from "@/services/roleService";
import { useTheme } from "@/lib/theme";

interface RoleFormProps {
  role?: Role | null;
  onSuccess?: (savedRole: Role) => void;
  onCancel?: () => void;
}

export default function RoleForm({ role, onSuccess, onCancel }: RoleFormProps) {
  const { primaryColor } = useTheme();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!role) {
      setName("");
      setDescription("");
      return;
    }

    setName(role.name ?? "");
    setDescription(role.description ?? "");
  }, [role]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      setError("Role name is required.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name: trimmedName,
        description: trimmedDescription || undefined,
      };

      const saved = role
        ? await updateRole(role.id, payload)
        : await createRole(payload);

      onSuccess?.(
        saved?.data ??
          saved ?? {
            id: Date.now(),
            name: trimmedName,
            description: trimmedDescription,
          },
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save role.");
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
    <form onSubmit={handleSubmit} className="space-y-5 p-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2
            id="role-form-heading"
            className="text-lg font-bold text-slate-900"
          >
            {role ? "Edit Role" : "Create Role"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {role ? "Update the selected role." : "Create a new system role."}
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          aria-label="Close form"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <label className="block space-y-2 text-sm text-slate-600">
        <span>Role name</span>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 outline-none"
          placeholder="e.g. Admin"
          {...focusHandlers}
        />
      </label>

      <label className="block space-y-2 text-sm text-slate-600">
        <span>Description</span>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={4}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 outline-none"
          placeholder="Describe the purpose of this role"
          {...focusHandlers}
        />
      </label>

      <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          style={{ backgroundColor: primaryColor }}
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? "Saving..." : role ? "Save Changes" : "Create Role"}
        </button>
      </div>
    </form>
  );
}
