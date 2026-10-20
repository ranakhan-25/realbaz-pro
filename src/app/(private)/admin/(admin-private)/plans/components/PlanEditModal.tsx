/* eslint-disable @typescript-eslint/no-explicit-any */ /* eslint-disable prettier/prettier */
"use client";

import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  planData: any;
  onUpdate: (uuid: string, payload: any) => void;
}

export default function PlanEditModal({
  isOpen,
  onClose,
  planData,
  onUpdate,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !planData) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name"),
      code: formData.get("code"),
      monthly_price: Number(formData.get("monthly_price")),
      yearly_price: Number(formData.get("yearly_price")),
      user_limit: Number(formData.get("user_limit")),
      project_limit: Number(formData.get("project_limit")),
      storage_gb: Number(formData.get("storage_gb")),
      status: formData.get("status"),
    };
    onUpdate(planData.uuid, payload);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            Edit Plan: {planData.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form
            id="edit-plan-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Plan Name *
                </label>
                <input
                  name="name"
                  type="text"
                  defaultValue={planData.name}
                  required
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Code * (Read-only)
                </label>
                <input
                  name="code"
                  type="text"
                  defaultValue={planData.code}
                  readOnly
                  className="w-full border p-2 rounded bg-gray-100 text-gray-500 cursor-not-allowed outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Monthly Price ($) *
                </label>
                <input
                  name="monthly_price"
                  type="number"
                  min="0"
                  defaultValue={planData.monthly_price}
                  required
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Yearly Price ($) *
                </label>
                <input
                  name="yearly_price"
                  type="number"
                  min="0"
                  defaultValue={planData.yearly_price}
                  required
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  User Limit *
                </label>
                <input
                  name="user_limit"
                  type="number"
                  min="1"
                  defaultValue={planData.user_limit}
                  required
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Project Limit *
                </label>
                <input
                  name="project_limit"
                  type="number"
                  min="1"
                  defaultValue={planData.project_limit}
                  required
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Storage (GB) *
                </label>
                <input
                  name="storage_gb"
                  type="number"
                  min="1"
                  defaultValue={planData.storage_gb}
                  required
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  defaultValue={planData.status || "active"}
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </form>
        </div>

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
            form="edit-plan-form"
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
