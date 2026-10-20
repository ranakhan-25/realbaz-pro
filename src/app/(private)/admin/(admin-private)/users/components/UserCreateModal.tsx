/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
"use client";
import { useState } from "react";
import { useTheme } from "@/lib/theme";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (payload: any) => void;
}

export default function UserCreateModal({ isOpen, onClose, onCreate }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { primaryColor } = useTheme();
  const brandColor = primaryColor || "#2ed573";

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    const roles = formData.get("roles")
      ? (formData.get("roles") as string).split(",").map((r) => r.trim())
      : [];

    onCreate({
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      roles: roles,
      status: formData.get("status"),
      mfa: formData.get("mfa") === "on",
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">Create New User</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
          >
            &times;
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <form
            id="create-user-form"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Full Name *
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none"
                  style={{ "--tw-ring-color": `${brandColor}40` } as any}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Email *
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none"
                  style={{ "--tw-ring-color": `${brandColor}40` } as any}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Phone
              </label>
              <input
                name="phone"
                type="text"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none"
                style={{ "--tw-ring-color": `${brandColor}40` } as any}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Roles (Comma separated)
              </label>
              <input
                name="roles"
                type="text"
                placeholder="e.g. Admin, Editor"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none"
                style={{ "--tw-ring-color": `${brandColor}40` } as any}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Status
                </label>
                <select
                  name="status"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none"
                  style={{ "--tw-ring-color": `${brandColor}40` } as any}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="space-y-1 flex flex-col justify-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="mfa"
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 font-medium">
                    Enable MFA
                  </span>
                </label>
              </div>
            </div>
          </form>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-user-form"
            className="px-5 py-2.5 text-white rounded-xl text-sm font-medium shadow-md transition-all hover:shadow-lg"
            style={{ backgroundColor: brandColor }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create User"}
          </button>
        </div>
      </div>
    </div>
  );
}
