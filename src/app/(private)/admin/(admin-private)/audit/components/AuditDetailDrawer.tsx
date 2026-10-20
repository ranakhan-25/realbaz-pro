/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
"use client";
import { useTheme } from "@/lib/theme";
import { X, ArrowRight, Code2, AlertCircle } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  logData: any;
}

export default function AuditDetailDrawer({ isOpen, onClose, logData }: Props) {
  const { primaryColor } = useTheme();
  const brandColor = primaryColor || "#2ed573";

  if (!isOpen || !logData) return null;

  // JSON Pretty Printer
  const formatJson = (obj: any) => {
    if (!obj) return "null";
    return JSON.stringify(obj, null, 2);
  };

  return (
    <div className="fixed inset-0 z-[999] flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Drawer Panel */}
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Code2 className="h-5 w-5" style={{ color: brandColor }} />
              Audit Details
            </h2>
            <p className="text-xs text-gray-500 mt-1">ID: {logData.uuid}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Metadata Summary */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                Actor
              </span>
              <span className="text-sm font-medium text-gray-900">
                {logData.actor.name}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                Action
              </span>
              <span className="text-sm font-bold text-gray-900 uppercase">
                {logData.action}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                Entity
              </span>
              <span className="text-sm font-medium text-gray-900">
                {logData.entity} ({logData.entity_ref})
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                Timestamp
              </span>
              <span className="text-xs font-mono text-gray-700">
                {logData.at}
              </span>
            </div>
          </div>

          {/* JSON Diff Viewer */}
          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500" /> Data Changes
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Before JSON */}
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 bg-red-50 text-red-600 px-2 py-1 rounded w-fit border border-red-100">
                  Before
                </span>
                <pre className="flex-1 bg-gray-900 text-gray-300 p-4 rounded-xl text-xs font-mono overflow-auto border border-gray-800 shadow-inner h-64">
                  {formatJson(logData.before_json)}
                </pre>
              </div>

              {/* After JSON */}
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 bg-green-50 text-green-600 px-2 py-1 rounded w-fit border border-green-100">
                  After
                </span>
                <pre className="flex-1 bg-gray-900 text-green-400 p-4 rounded-xl text-xs font-mono overflow-auto border border-gray-800 shadow-inner h-64">
                  {formatJson(logData.after_json)}
                </pre>
              </div>
            </div>
          </div>

          {/* Network Info */}
          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-2">
              Network Info
            </h3>
            <div className="bg-white border border-gray-200 rounded-xl p-3 text-xs text-gray-600 font-mono">
              <p>
                <strong className="text-gray-900">IP:</strong> {logData.ip}
              </p>
              <p className="mt-1">
                <strong className="text-gray-900">UA:</strong>{" "}
                {logData.ua_short}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
