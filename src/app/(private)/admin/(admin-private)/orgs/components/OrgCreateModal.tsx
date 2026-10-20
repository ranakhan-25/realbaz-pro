"use client";

import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (payload: any) => void;
}

export default function OrgCreateModal({ isOpen, onClose, onCreate }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      plan: formData.get("plan"),
      status: formData.get("status"),
      trial_ends_at: formData.get("trial_ends_at"),
    };
    onCreate(payload);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            Create New Organization
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
            id="create-org-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <section>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                Basic Info
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Name *
                  </label>
                  <input
                    name="name"
                    type="text"
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
                    required
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Email *
                  </label>
                  <input
                    name="email"
                    type="email"
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
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Address
                  </label>
                  <textarea
                    name="address"
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    rows={2}
                  ></textarea>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                Subscription
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Plan
                  </label>
                  <select
                    name="plan"
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
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="trial">Trial</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Trial Ends At
                  </label>
                  <input
                    name="trial_ends_at"
                    type="date"
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </section>
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
            form="create-org-form"
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Organization"}
          </button>
        </div>
      </div>
    </div>
  );
}
