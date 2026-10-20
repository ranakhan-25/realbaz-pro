/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
"use client";
import { useState } from "react";
import { useTheme } from "@/lib/theme";

interface Props { isOpen: boolean; onClose: () => void; onCreate: (payload: any) => void; }

export default function RoleCreateModal({ isOpen, onClose, onCreate }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { primaryColor } = useTheme();
  const brandColor = primaryColor || "#2ed573";

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    onCreate({
      name: formData.get("name"),
      code: formData.get("code"),
      description: formData.get("description"),
      is_system: false, // By default false, only SA can set true (handled by backend)
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">Create New Role</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition-colors">&times;</button>
        </div>
        <div className="p-6">
          <form id="create-role-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Role Name *</label>
              <input name="name" type="text" required placeholder="e.g. Content Manager" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none" style={{ '--tw-ring-color': `${brandColor}40` } as any} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Code (Unique) *</label>
              <input name="code" type="text" required placeholder="e.g. content-manager" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none font-mono" style={{ '--tw-ring-color': `${brandColor}40` } as any} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
              <textarea name="description" rows={3} placeholder="What can this role do?" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none resize-none" style={{ '--tw-ring-color': `${brandColor}40` } as any}></textarea>
            </div>
          </form>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <button type="button" onClick={onClose} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100">Cancel</button>
          <button type="submit" form="create-role-form" className="px-5 py-2.5 text-white rounded-xl text-sm font-medium shadow-md transition-all hover:shadow-lg" style={{ backgroundColor: brandColor }} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Role"}
          </button>
        </div>
      </div>
    </div>
  );
}