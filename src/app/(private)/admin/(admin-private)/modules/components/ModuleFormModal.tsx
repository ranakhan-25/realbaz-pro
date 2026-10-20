/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
"use client";
import { useState } from "react";
import { useTheme } from "@/lib/theme";
import { LayoutGrid, Save } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: any) => void;
  moduleData: any;
}

export default function ModuleFormModal({
  isOpen,
  onClose,
  onSave,
  moduleData,
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
      name: formData.get("name"),
      code: formData.get("code"),
      icon: formData.get("icon"),
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
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <LayoutGrid className="h-5 w-5" style={{ color: brandColor }} />
            {moduleData ? "Edit Module" : "Create Module"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          <form id="module-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Module Name *
                </label>
                <input
                  name="name"
                  type="text"
                  defaultValue={moduleData?.name}
                  required
                  placeholder="e.g. Organization"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none transition-all"
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
                  defaultValue={moduleData?.code}
                  required
                  placeholder="e.g. organization"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none font-mono transition-all"
                  style={{ "--tw-ring-color": `${brandColor}40` } as any}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Icon (Lucide name)
                </label>
                <input
                  name="icon"
                  type="text"
                  defaultValue={moduleData?.icon || "Boxes"}
                  placeholder="e.g. Boxes, Users, Settings"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none font-mono transition-all"
                  style={{ "--tw-ring-color": `${brandColor}40` } as any}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Order No *
                </label>
                <input
                  name="order_no"
                  type="number"
                  defaultValue={moduleData?.order_no || 1}
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none transition-all"
                  style={{ "--tw-ring-color": `${brandColor}40` } as any}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Status
              </label>
              <select
                name="status"
                defaultValue={moduleData?.status || "active"}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none transition-all appearance-none"
                style={{ "--tw-ring-color": `${brandColor}40` } as any}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <input
                type="checkbox"
                name="is_core"
                id="is_core"
                defaultChecked={moduleData?.is_core}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <div className="flex flex-col">
                <label
                  htmlFor="is_core"
                  className="text-sm font-bold text-gray-700 cursor-pointer"
                >
                  Core Module
                </label>
                <span className="text-[10px] text-gray-500">
                  Core modules cannot be deleted.
                </span>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="module-form"
            className="px-5 py-2.5 text-white rounded-xl text-sm font-medium shadow-md transition-all hover:shadow-lg flex items-center gap-2 disabled:opacity-50"
            style={{ backgroundColor: brandColor }}
            disabled={isSubmitting}
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save Module"}
          </button>
        </div>
      </div>
    </div>
  );
}
