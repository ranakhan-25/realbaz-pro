"use client";
import { useState } from "react";
import { useTheme } from "@/lib/theme";
import { Shield } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userData: any;
  onAssign: (uuid: string, roles: string[]) => void;
}

// এখানে আপনার সিস্টেমের সব রোলের লিস্ট থাকবে (API থেকে আনতে পারেন)
const AVAILABLE_ROLES = ["Super Admin", "Admin", "Manager", "Editor", "Viewer"];

export default function UserRoleAssignModal({
  isOpen,
  onClose,
  userData,
  onAssign,
}: Props) {
  const { primaryColor } = useTheme();
  const brandColor = primaryColor || "#2ed573";

  const [selectedRoles, setSelectedRoles] = useState<string[]>(
    userData?.roles || [],
  );

  if (!isOpen || !userData) return null;

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  };

  const handleSave = () => {
    onAssign(userData.uuid, selectedRoles);
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
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-5 w-5" style={{ color: brandColor }} /> Assign
            Roles
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:bg-gray-200 rounded-full"
          >
            &times;
          </button>
        </div>

        <div className="p-6 space-y-3">
          <p className="text-sm text-gray-500 mb-4">
            Select roles for <strong>{userData.name}</strong>:
          </p>
          {AVAILABLE_ROLES.map((role) => (
            <label
              key={role}
              className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedRoles.includes(role)}
                onChange={() => toggleRole(role)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">{role}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-white rounded-xl text-sm font-medium shadow-sm hover:shadow-md"
            style={{ backgroundColor: brandColor }}
          >
            Save Roles
          </button>
        </div>
      </div>
    </div>
  );
}
