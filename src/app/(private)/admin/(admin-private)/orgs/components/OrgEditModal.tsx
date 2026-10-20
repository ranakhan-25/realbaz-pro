"use client";

import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  orgData: any;
  onUpdate: (uuid: string, payload: any) => void;
}

export default function OrgEditModal({
  isOpen,
  onClose,
  orgData,
  onUpdate,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !orgData) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      plan: formData.get("plan"),
      status: formData.get("status"),
    };
    onUpdate(orgData.uuid, payload);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            Edit Organization: {orgData.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="p-6 overflow-y-auto">
          <form
            id="edit-org-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Name *
                </label>
                <input
                  name="name"
                  type="text"
                  defaultValue={orgData.name}
                  required
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Slug *
                </label>
                <input
                  name="slug"
                  type="text"
                  defaultValue={orgData.slug}
                  required
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Email *
                </label>
                <input
                  name="email"
                  type="email"
                  defaultValue={orgData.email}
                  required
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Phone
                </label>
                <input
                  name="phone"
                  type="text"
                  defaultValue={orgData.phone || ""}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Plan
                </label>
                <select
                  name="plan"
                  defaultValue={orgData.plan || ""}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Basic">Basic</option>
                  <option value="Pro">Pro</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  defaultValue={orgData.status || "active"}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="trial">Trial</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 border rounded-md hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-org-form"
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
