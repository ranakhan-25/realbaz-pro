/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/lib/theme";
import Link from "next/link";
import PermissionMatrix from "../../components/PermissionMatrix";
import { ArrowLeft, ShieldCheck, Save } from "lucide-react";

export default function RolePermissionPage({
  params,
}: {
  params: { uuid: string };
}) {
  const { primaryColor } = useTheme();
  const brandColor = primaryColor || "#2ed573";

  const [roleName, setRoleName] = useState("Loading...");
  const [isSaving, setIsSaving] = useState(false);
  const [initialPerms, setInitialPerms] = useState<string[]>([]);

  // ডামি ডেটা ফেচ (আপনার রিয়েল API থেকে আসবে)
  useEffect(() => {
    // API call to fetch role details + current permissions
    setTimeout(() => {
      setRoleName("Admin"); // Dummy Name
      setInitialPerms(["org.view", "org.create", "user.view", "user.roles"]); // Dummy initial data
    }, 500);
  }, [params.uuid]);

  const handleSave = async (permissions: string[]) => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/roles/${params.uuid}/permissions`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permissions }),
      });
      if (!res.ok) throw new Error("Failed to save");
      alert("Permissions updated successfully!");
    } catch (error) {
      alert("API failed. Saved locally (Demo mode).");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/roles"
              className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                <ShieldCheck
                  className="h-6 w-6"
                  style={{ color: brandColor }}
                />
                Permissions: {roleName}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Configure granular access controls for this role.
              </p>
            </div>
          </div>
        </div>

        {/* Reusable Matrix Component */}
        <PermissionMatrix
          initialPermissions={initialPerms}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
