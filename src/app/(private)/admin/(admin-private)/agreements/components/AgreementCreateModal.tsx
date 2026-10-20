/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
"use client";
import { useState } from "react";
import { useTheme } from "@/lib/theme";
import { FileText, UploadCloud, Save, CheckCircle2 } from "lucide-react";

interface Props { 
  isOpen: boolean; 
  onClose: () => void; 
  onCreate: (payload: any) => void; 
}

export default function AgreementCreateModal({ isOpen, onClose, onCreate }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { primaryColor } = useTheme();
  const brandColor = primaryColor || "#2ed573";

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    // Real world: handle file upload here to get content_url
    onCreate({
      title: formData.get("title"),
      version: formData.get("version"),
      content_url: formData.get("content_url") || null,
      content_html: formData.get("content_html"),
      required_at_signup: formData.get("required_at_signup") === "on",
      is_active: formData.get("is_active") === "on",
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="h-5 w-5" style={{ color: brandColor }} />
            Create New Agreement
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          <form id="agreement-form" onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Agreement Title *</label>
                <input 
                  name="title" 
                  type="text" 
                  required 
                  placeholder="e.g. Terms of Service" 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none transition-all" 
                  style={{ '--tw-ring-color': `${brandColor}40` } as any} 
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Version *</label>
                <input 
                  name="version" 
                  type="text" 
                  required 
                  placeholder="e.g. v1.0" 
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none font-mono transition-all" 
                  style={{ '--tw-ring-color': `${brandColor}40` } as any} 
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Document URL (PDF/Doc)</label>
              <div className="relative">
                <UploadCloud className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                  name="content_url" 
                  type="url" 
                  placeholder="https://example.com/terms.pdf" 
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none transition-all" 
                  style={{ '--tw-ring-color': `${brandColor}40` } as any} 
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Or Paste HTML Content</label>
              <textarea 
                name="content_html" 
                rows={4} 
                placeholder="<h1>Terms of Service</h1><p>...</p>" 
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 outline-none resize-none font-mono" 
                style={{ '--tw-ring-color': `${brandColor}40` } as any}
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="flex items-start gap-3">
                <input 
                  type="checkbox" 
                  name="required_at_signup" 
                  id="required_at_signup" 
                  className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer" 
                />
                <div className="flex flex-col">
                  <label htmlFor="required_at_signup" className="text-sm font-bold text-gray-700 cursor-pointer">Required at Signup</label>
                  <span className="text-[10px] text-gray-500 leading-tight mt-0.5">Users must agree to this before creating an account.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <input 
                  type="checkbox" 
                  name="is_active" 
                  id="is_active" 
                  defaultChecked
                  className="mt-1 w-4 h-4 rounded text-green-600 focus:ring-green-500 cursor-pointer" 
                />
                <div className="flex flex-col">
                  <label htmlFor="is_active" className="text-sm font-bold text-gray-700 cursor-pointer">Active</label>
                  <span className="text-[10px] text-gray-500 leading-tight mt-0.5">If unchecked, this agreement will be hidden.</span>
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <button type="button" onClick={onClose} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
            Cancel
          </button>
          <button 
            type="submit" 
            form="agreement-form" 
            className="px-5 py-2.5 text-white rounded-xl text-sm font-medium shadow-md transition-all hover:shadow-lg flex items-center gap-2 disabled:opacity-50" 
            style={{ backgroundColor: brandColor }} 
            disabled={isSubmitting}
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save Agreement"}
          </button>
        </div>

      </div>
    </div>
  );
}