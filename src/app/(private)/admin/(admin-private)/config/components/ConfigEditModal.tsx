"use client";
import { useState } from "react";
import { useTheme } from "@/lib/theme";
import { Save, AlertTriangle, Key } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: any) => void;
  configData: any;
}

export default function ConfigEditModal({
  isOpen,
  onClose,
  onSave,
  configData,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { primaryColor } = useTheme();
  const brandColor = primaryColor || "#2ed573";

  if (!isOpen || !configData) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    onSave({
      value_json: formData.get("value_json"),
      category: formData.get("category"),
      is_secret: formData.get("is_secret") === "on",
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
            <Key className="h-5 w-5" style={{ color: brandColor }} />
            Edit Configuration
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
        <div className="p-6">
          <div className="mb-5 bg-gray-50 border border-gray-200 rounded-xl p-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Configuration Key
            </span>
            <span className="font-mono text-sm font-bold text-gray-800">
              {configData.key}
            </span>
          </div>

          <form id="config-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase flex justify-between">
                <span>Value (JSON) *</span>
                <span className="text-[10px] text-gray-400 normal-case font-normal">
                  Must be valid JSON
                </span>
              </label>
              <textarea
                name="value_json"
                rows={4}
                defaultValue={configData.value_json}
                required
                className="w-full px-4 py-3 bg-gray-900 text-green-400 border border-gray-700 rounded-xl text-sm focus:ring-2 outline-none resize-none font-mono shadow-inner"
                style={{ "--tw-ring-color": `${brandColor}80` } as any}
                spellCheck={false}
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Category *
                </label>
                <select
                  name="category"
                  defaultValue={configData.category}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none appearance-none"
                  style={{ "--tw-ring-color": `${brandColor}40` } as any}
                >
                  <option value="General">General</option>
                  <option value="Payment">Payment</option>
                  <option value="Storage">Storage</option>
                  <option value="System">System</option>
                  <option value="Mail">Mail</option>
                </select>
              </div>
              <div className="space-y-1 flex flex-col justify-end pb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_secret"
                    defaultChecked={configData.is_secret}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 cursor-pointer"
                  />
                  <span className="text-sm font-bold text-gray-700">
                    Mark as Secret
                  </span>
                </label>
              </div>
            </div>

            {configData.is_secret && (
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-start gap-3 mt-2">
                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  This value is currently masked. Changing a secret key might
                  break active integrations (e.g., Payment gateways or Storage).
                  Proceed with caution.
                </p>
              </div>
            )}
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
            form="config-form"
            className="px-5 py-2.5 text-white rounded-xl text-sm font-medium shadow-md transition-all hover:shadow-lg flex items-center gap-2 disabled:opacity-50"
            style={{ backgroundColor: brandColor }}
            disabled={isSubmitting}
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? "Updating..." : "Update Config"}
          </button>
        </div>
      </div>
    </div>
  );
}
