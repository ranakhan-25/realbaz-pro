/* eslint-disable prettier/prettier */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/lib/theme";
import {
  ArrowLeft,
  Mail,
  Phone,
  Shield,
  Activity,
  LayoutDashboard,
} from "lucide-react";

export default function UserDetailPage({
  params,
}: {
  params: { uuid: string };
}) {
  const [activeTab, setActiveTab] = useState("profile");
  const { primaryColor } = useTheme();
  const brandColor = primaryColor || "#2ed573";

  const tabs = [
    { id: "profile", label: "Profile", icon: LayoutDashboard },
    { id: "roles", label: "Roles & Permissions", icon: Shield },
    { id: "activity", label: "Activity Log", icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] p-6 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Link
            href="/admin/users"
            className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
            <p className="text-sm text-gray-500 font-mono">
              UUID: {params.uuid}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header Banner */}
          <div
            className="h-32 w-full"
            style={{ backgroundColor: `${brandColor}15` }}
          ></div>

          <div className="px-8 pb-8">
            <div className="flex justify-between items-end -mt-12 mb-6">
              <div
                className="h-24 w-24 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg border-4 border-white"
                style={{ backgroundColor: brandColor }}
              >
                JD {/* Dynamic Initials */}
              </div>
              <div className="flex gap-2 mb-2">
                <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-bold uppercase tracking-wider">
                  Active
                </span>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-bold uppercase tracking-wider">
                  Admin
                </span>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900">John Doe</h2>
            <div className="flex gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Mail className="h-4 w-4" /> john@example.com
              </span>
              <span className="flex items-center gap-1">
                <Phone className="h-4 w-4" /> +1234567890
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-gray-100 px-8">
            <nav className="flex space-x-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 flex items-center gap-2 text-sm font-medium border-b-2 transition-colors ${
                      isActive
                        ? "border-current"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                    style={
                      isActive
                        ? { color: brandColor, borderColor: brandColor }
                        : {}
                    }
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8 bg-gray-50/30">
            {activeTab === "profile" && (
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Full Name
                  </h3>
                  <p className="text-sm font-medium text-gray-900">John Doe</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Email Address
                  </h3>
                  <p className="text-sm font-medium text-gray-900">
                    john@example.com
                  </p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    MFA Status
                  </h3>
                  <p className="text-sm font-medium text-green-600">Enabled</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Last Login
                  </h3>
                  <p className="text-sm font-medium text-gray-900">
                    2024-05-20 10:30 AM
                  </p>
                </div>
              </div>
            )}

            {activeTab === "roles" && (
              <div className="text-center py-10 text-gray-500">
                <Shield className="h-10 w-10 mx-auto text-gray-300 mb-3" />
                <p>Permission Matrix will be displayed here.</p>
              </div>
            )}

            {activeTab === "activity" && (
              <div className="text-center py-10 text-gray-500">
                <Activity className="h-10 w-10 mx-auto text-gray-300 mb-3" />
                <p>User activity logs will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
