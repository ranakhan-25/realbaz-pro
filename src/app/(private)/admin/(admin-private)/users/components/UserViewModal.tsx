/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
"use client";
import { useTheme } from "@/lib/theme";
import { Mail, Phone, ShieldCheck, Clock } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userData: any;
}

export default function UserViewModal({ isOpen, onClose, userData }: Props) {
  const { primaryColor } = useTheme();
  const brandColor = primaryColor || "#2ed573";

  if (!isOpen || !userData) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        <div
          className="h-24 w-full"
          style={{ backgroundColor: `${brandColor}20` }}
        ></div>

        <div className="px-6 pb-6">
          <div className="flex justify-between items-end -mt-10 mb-4">
            <div
              className="h-20 w-20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg border-4 border-white"
              style={{ backgroundColor: brandColor }}
            >
              {userData.avatar || userData.name.substring(0, 2).toUpperCase()}
            </div>
            <button
              onClick={onClose}
              className="mb-2 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
            >
              &times;
            </button>
          </div>

          <h2 className="text-2xl font-bold text-gray-900">{userData.name}</h2>

          <div className="flex flex-wrap gap-2 mt-2 mb-6">
            {userData.roles?.map((role: string) => (
              <span
                key={role}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-bold uppercase tracking-wider border border-gray-200"
              >
                {role}
              </span>
            ))}
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3 text-gray-600">
              <Mail className="h-4 w-4 text-gray-400" />
              <span>{userData.email}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Phone className="h-4 w-4 text-gray-400" />
              <span>{userData.phone || "No phone provided"}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <ShieldCheck className="h-4 w-4 text-gray-400" />
              <span>
                MFA:{" "}
                {userData.mfa ? (
                  <span className="text-green-600 font-medium">Enabled</span>
                ) : (
                  "Disabled"
                )}
              </span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Clock className="h-4 w-4 text-gray-400" />
              <span>Last login: {userData.last_login_at || "Never"}</span>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
