"use client";

import AppearanceSettings from "@/components/admin/AppearanceSettings";
import GeneralSettings from "@/components/admin/GeneralSettings";
import NotificationSettings from "@/components/admin/NotificationSettings";
import ProfileSettings from "@/components/admin/ProfileSettings";
import SecuritySettings from "@/components/admin/SecuritySettings";
import SettingsSidebar from "@/components/admin/SettingsSidebar";
import SuperAdminTopbar from "@/components/admin/SuperAdminTopbar";
import SystemSettings from "@/components/admin/SystemSettings";
import UsersRolesSettings from "@/components/admin/UsersRolesSettings";
import { useState } from "react";

export type SettingsKey =
  | "general"
  | "profile"
  | "security"
  | "users"
  | "notifications"
  | "appearance"
  | "system";

export default function SettingsPage() {
  const [activeSetting, setActiveSetting] = useState<SettingsKey>("general");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderSettings = () => {
    switch (activeSetting) {
      case "general":
        return <GeneralSettings />;
      case "profile":
        return <ProfileSettings />;
      case "security":
        return <SecuritySettings />;
      case "users":
        return <UsersRolesSettings />;
      case "notifications":
        return <NotificationSettings />;
      case "appearance":
        return <AppearanceSettings />;
      case "system":
        return <SystemSettings />;
      default:
        return <GeneralSettings />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SuperAdminTopbar onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex min-h-screen">
        <SettingsSidebar
          activeSetting={activeSetting}
          onChange={setActiveSetting}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
            {renderSettings()}
          </div>
        </main>
      </div>
    </div>
  );
}
