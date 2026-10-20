"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  createUser,
  getUserFormDropdowns,
  updateUser,
  type CreateUserPayload,
  type UpdateUserPayload,
  type User,
} from "@/services/userService";

interface UserFormProps {
  user?: User | null;
  onSuccess?: (user: User) => void;
  onCancel?: () => void;
}

interface FormValues {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  designationId: string;
  roleId: string;
  isActive: boolean;
  password: string;
}

interface DropdownItem {
  id: number | string;
  name: string;
}

const initialValues: FormValues = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  phone: "",
  designationId: "",
  roleId: "",
  isActive: true,
  password: "",
};

export default function UserForm({ user, onSuccess, onCancel }: UserFormProps) {
  const [form, setForm] = useState<FormValues>(initialValues);

  const [designations, setDesignations] = useState<DropdownItem[]>([]);
  const [roles, setRoles] = useState<DropdownItem[]>([]);

  const [loading, setLoading] = useState(false);
  const [dropdownLoading, setDropdownLoading] = useState(false);

  const isEdit = Boolean(user);

  // ------------------------------------------
  // Populate form when editing
  // ------------------------------------------
  useEffect(() => {
    if (!user) {
      setForm(initialValues);
      return;
    }

    setForm({
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      username: user.username ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",

      designationId:
        user.designationId !== undefined && user.designationId !== null
          ? String(user.designationId)
          : "",

      roleId:
        Array.isArray(user.roleIds) && user.roleIds.length > 0
          ? String(user.roleIds[0])
          : "",

      isActive: user.isActive ?? true,

      // Never populate existing password
      password: "",
    });
  }, [user]);

  // ------------------------------------------
  // Load dropdown data
  // ------------------------------------------
  useEffect(() => {
    let mounted = true;

    const loadDropdowns = async () => {
      try {
        setDropdownLoading(true);

        const data = await getUserFormDropdowns();

        if (!mounted) return;

        setDesignations(
          Array.isArray(data.designations) ? data.designations : [],
        );

        setRoles(Array.isArray(data.roles) ? data.roles : []);
      } catch (error) {
        console.error("Failed to load user form dropdowns:", error);

        if (mounted) {
          toast.error("Failed to load form data");
        }
      } finally {
        if (mounted) {
          setDropdownLoading(false);
        }
      }
    };

    loadDropdowns();

    return () => {
      mounted = false;
    };
  }, []);

  // ------------------------------------------
  // Handle input changes
  // ------------------------------------------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // ------------------------------------------
  // Submit
  // ------------------------------------------
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (!form.firstName.trim()) {
      toast.error("First name is required");
      return;
    }

    if (!form.lastName.trim()) {
      toast.error("Last name is required");
      return;
    }

    if (!form.username.trim()) {
      toast.error("Username is required");
      return;
    }

    if (!form.email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!isEdit && !form.password.trim()) {
      toast.error("Password is required");
      return;
    }

    if (form.password.trim() && form.password.trim().length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      // ----------------------------------------
      // Common payload
      // ----------------------------------------
      const basePayload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        username: form.username.trim(),
        email: form.email.trim(),

        phone: form.phone.trim() || undefined,

        isActive: form.isActive,

        designationId: form.designationId
          ? Number(form.designationId)
          : undefined,

        roleIds: form.roleId ? [Number(form.roleId)] : [],

        // This form is ONLY for System User
        userType: "system" as const,
      };

      let saved: User;

      // ----------------------------------------
      // UPDATE
      // ----------------------------------------
      if (user) {
        const updatePayload = {
          ...basePayload,

          ...(form.password.trim()
            ? {
                password: form.password.trim(),
              }
            : {}),
        } satisfies UpdateUserPayload;

        const identifier = String(user.uuid ?? user.id);

        saved = await updateUser(identifier, updatePayload);

        toast.success("System user updated successfully");
      }

      // ----------------------------------------
      // CREATE
      // ----------------------------------------
      else {
        const createPayload = {
          ...basePayload,
          password: form.password.trim(),
        } satisfies CreateUserPayload;

        saved = await createUser(createPayload);

        toast.success("System user created successfully");
      }

      // ----------------------------------------
      // Callback
      // ----------------------------------------
      onSuccess?.(saved);

      // Reset after create
      if (!isEdit) {
        setForm(initialValues);
      }
    } catch (error) {
      console.error("User save error:", error);

      const message =
        error instanceof Error ? error.message : "Failed to save system user";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* User Type */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          User Type
        </label>

        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
          <span className="text-sm font-medium text-gray-800">System User</span>
        </div>
      </div>

      {/* Name */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* First Name */}
        <div>
          <label
            htmlFor="firstName"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            First Name
          </label>

          <input
            id="firstName"
            name="firstName"
            type="text"
            value={form.firstName}
            onChange={handleChange}
            placeholder="Enter first name"
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
          />
        </div>

        {/* Last Name */}
        <div>
          <label
            htmlFor="lastName"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Last Name
          </label>

          <input
            id="lastName"
            name="lastName"
            type="text"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Enter last name"
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
          />
        </div>
      </div>

      {/* Username & Email */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Username */}
        <div>
          <label
            htmlFor="username"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Username
          </label>

          <input
            id="username"
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter username"
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter email address"
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
          />
        </div>
      </div>

      {/* Phone */}
      <div>
        <label
          htmlFor="phone"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Phone
        </label>

        <input
          id="phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          placeholder="Enter phone number"
          disabled={loading}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
        />
      </div>

      {/* Designation & Role */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Designation */}
        <div>
          <label
            htmlFor="designationId"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Designation
          </label>

          <select
            id="designationId"
            name="designationId"
            value={form.designationId}
            onChange={handleChange}
            disabled={dropdownLoading || loading}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
          >
            <option value="">
              {dropdownLoading ? "Loading..." : "Select designation"}
            </option>

            {designations.map((designation) => (
              <option key={designation.id} value={designation.id}>
                {designation.name}
              </option>
            ))}
          </select>
        </div>

        {/* Role */}
        <div>
          <label
            htmlFor="roleId"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Role
          </label>

          <select
            id="roleId"
            name="roleId"
            value={form.roleId}
            onChange={handleChange}
            disabled={dropdownLoading || loading}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
          >
            <option value="">
              {dropdownLoading ? "Loading..." : "Select role"}
            </option>

            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Password
          {isEdit && (
            <span className="ml-2 text-xs font-normal text-gray-500">
              Leave blank to keep current password
            </span>
          )}
        </label>

        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder={isEdit ? "Enter new password" : "Enter password"}
          disabled={loading}
          minLength={6}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
        />
      </div>

      {/* Active Status */}
      <div className="flex items-center gap-3">
        <input
          id="isActive"
          name="isActive"
          type="checkbox"
          checked={form.isActive}
          onChange={handleChange}
          disabled={loading}
          className="h-4 w-4 rounded border-gray-300"
        />

        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
          Active User
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-5">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Saving..." : isEdit ? "Update User" : "Create User"}
        </button>
      </div>
    </form>
  );
}
