/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
"use client";
import { useState } from "react";
import { useTheme } from "@/lib/theme";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: any) => void;
  featureData: any;
}

export default function FeatureFormModal({
  isOpen,
  onClose,
  onSave,
  featureData,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { primaryColor } = useTheme();
  const brandColor = primaryColor || "#2ed573";

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    onSave({
      module: formData.get("module"),
      code: formData.get("code"),
      name: formData.get("name"),
      description: formData.get("description"),
      order_no: Number(formData.get("order_no")),
      is_core: formData.get("is_core") === "on",
      status: formData.get("status"),
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
          <h2 className="text-xl font-bold text-gray-900">
            {featureData ? "Edit Feature" : "Create Feature"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
          >
            &times;
          </button>
        </div>
        <div className="p-6">
          <form id="feature-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Module Name *
                </label>
                <input
                  name="module"
                  type="text"
                  defaultValue={featureData?.module}
                  required
                  placeholder="e.g. Organization"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none"
                  style={{ "--tw-ring-color": `${brandColor}40` } as any}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Code *
                </label>
                <input
                  name="code"
                  type="text"
                  defaultValue={featureData?.code}
                  required
                  placeholder="e.g. org.list"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none font-mono"
                  style={{ "--tw-ring-color": `${brandColor}40` } as any}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Feature Name *
              </label>
              <input
                name="name"
                type="text"
                defaultValue={featureData?.name}
                required
                placeholder="e.g. Organizations List"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none"
                style={{ "--tw-ring-color": `${brandColor}40` } as any}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Description
              </label>
              <textarea
                name="description"
                rows={2}
                defaultValue={featureData?.description}
                placeholder="Brief description..."
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none resize-none"
                style={{ "--tw-ring-color": `${brandColor}40` } as any}
              ></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Order No
                </label>
                <input
                  name="order_no"
                  type="number"
                  defaultValue={featureData?.order_no || 1}
                  required
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none"
                  style={{ "--tw-ring-color": `${brandColor}40` } as any}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Status
                </label>
                <select
                  name="status"
                  defaultValue={featureData?.status || "active"}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none"
                  style={{ "--tw-ring-color": `${brandColor}40` } as any}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                name="is_core"
                defaultChecked={featureData?.is_core}
                id="is_core"
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <label
                htmlFor="is_core"
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                Mark as Core Feature
              </label>
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
            form="feature-form"
            className="px-5 py-2.5 text-white rounded-xl text-sm font-medium shadow-md transition-all hover:shadow-lg"
            style={{ backgroundColor: brandColor }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Feature"}
          </button>
        </div>
      </div>
    </div>
  );
}
