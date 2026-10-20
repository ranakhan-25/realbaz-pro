/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
"use client";

import { useState } from "react";
import { useTheme } from "@/lib/theme";
import { X, Save } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: any) => void;
  menuData: any;
  defaultParentId: string | null;
  allMenus: any[];
}

export default function MenuItemModal({
  isOpen,
  onClose,
  onSave,
  menuData,
  defaultParentId,
  allMenus,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { primaryColor } = useTheme();
  const brandColor = primaryColor || "#2ed573";

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    const payload = {
      ...(menuData?.id && { id: menuData.id }),
      title: formData.get("title"),
      url: formData.get("url"),
      icon: formData.get("icon"),
      parent_id:
        formData.get("parent_id") === "none" ? null : formData.get("parent_id"),
      order_no: Number(formData.get("order_no")),
      is_active: formData.get("is_active") === "true",
    };

    onSave(payload);
    setIsSubmitting(false);
    onClose();
  };

  const parentOptions = allMenus.filter((m) => m.id !== menuData?.id);

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col transform transition-all animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">
            {menuData ? "Edit Menu Item" : "Create Menu Item"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <form id="menu-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                name="title"
                type="text"
                defaultValue={menuData?.title || ""}
                required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 transition-all"
                style={
                  {
                    "--tw-ring-color": `${brandColor}40`,
                    borderColor: menuData ? undefined : "#e5e7eb",
                  } as any
                }
                placeholder="e.g. Home"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                URL / Path <span className="text-red-500">*</span>
              </label>
              <input
                name="url"
                type="text"
                defaultValue={menuData?.url || ""}
                required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:bg-white focus:outline-none focus:ring-2 transition-all"
                style={{ "--tw-ring-color": `${brandColor}40` } as any}
                placeholder="e.g. /about"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Icon
                </label>
                <input
                  name="icon"
                  type="text"
                  defaultValue={menuData?.icon || "Circle"}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono focus:bg-white focus:outline-none focus:ring-2 transition-all"
                  style={{ "--tw-ring-color": `${brandColor}40` } as any}
                  placeholder="Home"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Order No
                </label>
                <input
                  name="order_no"
                  type="number"
                  defaultValue={menuData?.order_no || 1}
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 transition-all"
                  style={{ "--tw-ring-color": `${brandColor}40` } as any}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Parent Menu
              </label>
              <select
                name="parent_id"
                defaultValue={menuData?.parent_id || defaultParentId || "none"}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 transition-all appearance-none"
                style={{ "--tw-ring-color": `${brandColor}40` } as any}
              >
                <option value="none">-- Top Level (No Parent) --</option>
                {parentOptions.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Status
              </label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="is_active"
                    value="true"
                    defaultChecked={menuData?.is_active !== false}
                    className="w-4 h-4 text-green-500 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="is_active"
                    value="false"
                    defaultChecked={menuData?.is_active === false}
                    className="w-4 h-4 text-red-500 focus:ring-red-500"
                  />
                  <span className="text-sm text-gray-700">Inactive</span>
                </label>
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
            form="menu-form"
            className="px-5 py-2.5 text-white rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50 flex items-center gap-2"
            style={{ backgroundColor: brandColor }}
            disabled={isSubmitting}
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save Item"}
          </button>
        </div>
      </div>
    </div>
  );
}
