/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
"use client";
import { useState } from "react";
import { useTheme } from "@/lib/theme";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: any) => void;
  actionData: any;
  featureCode: string;
}

export default function ActionFormModal({
  isOpen,
  onClose,
  onSave,
  actionData,
  featureCode,
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
      code: formData.get("code"),
      name: formData.get("name"),
      label: formData.get("label"),
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
      <div className="relative bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col">
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">
            {actionData ? "Edit Action" : "Add Action"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
          >
            &times;
          </button>
        </div>
        <div className="p-6">
          <div className="mb-4 bg-gray-50 border border-gray-100 rounded-lg p-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Parent Feature
            </span>
            <span className="text-sm font-mono text-gray-700 font-medium">
              {featureCode}
            </span>
          </div>

          <form id="action-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Action Label *
              </label>
              <input
                name="label"
                type="text"
                defaultValue={actionData?.label}
                required
                placeholder="e.g. View"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none"
                style={{ "--tw-ring-color": `${brandColor}40` } as any}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Action Name *
              </label>
              <input
                name="name"
                type="text"
                defaultValue={actionData?.name}
                required
                placeholder="e.g. View Organization Details"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none"
                style={{ "--tw-ring-color": `${brandColor}40` } as any}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Action Code *
              </label>
              <select
                name="code"
                defaultValue={actionData?.code || "view"}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none font-mono"
                style={{ "--tw-ring-color": `${brandColor}40` } as any}
              >
                <option value="view">view</option>
                <option value="create">create</option>
                <option value="update">update</option>
                <option value="delete">delete</option>
                <option value="approve">approve</option>
                <option value="export">export</option>
              </select>
            </div>
          </form>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="action-form"
            className="px-4 py-2 text-white rounded-xl text-sm font-medium shadow-md transition-all hover:shadow-lg"
            style={{ backgroundColor: brandColor }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Action"}
          </button>
        </div>
      </div>
    </div>
  );
}
