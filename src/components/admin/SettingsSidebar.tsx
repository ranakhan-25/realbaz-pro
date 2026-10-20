"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  CircleUserRound,
  Cog,
  Monitor,
  ShieldCheck,
  Users,
  Wrench,
  X,
} from "lucide-react";

import type { SettingsKey } from "@/app/(private)/admin/settings/page";

interface SettingsSidebarProps {
  activeSetting: SettingsKey;
  onChange: (key: SettingsKey) => void;
  open: boolean;
  onClose: () => void;
}

const menuItems = [
  { key: "general" as SettingsKey, label: "General", icon: Cog },
  { key: "profile" as SettingsKey, label: "Profile", icon: CircleUserRound },
  { key: "security" as SettingsKey, label: "Security", icon: ShieldCheck },
  { key: "users" as SettingsKey, label: "Users & Roles", icon: Users },
  { key: "notifications" as SettingsKey, label: "Notifications", icon: Bell },
  { key: "appearance" as SettingsKey, label: "Appearance", icon: Monitor },
  { key: "system" as SettingsKey, label: "System", icon: Wrench },
];

export default function SettingsSidebar({
  activeSetting,
  onChange,
  open,
  onClose,
}: SettingsSidebarProps) {
  const handleSelect = (key: SettingsKey) => {
    onChange(key);
    onClose(); // mobile-e select korle drawer close hoye jabe
  };

  const backLink = (
    <Link
      href="/admin/dashboard"
      className="mb-4 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-primary/10 hover:text-primary"
    >
      <ArrowLeft className="h-4.5 w-4.5" />
      <span>Back to Dashboard</span>
    </Link>
  );

  const navContent = (
    <nav className="space-y-1">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const active = activeSetting === item.key;

        return (
          <button
            key={item.key}
            type="button"
            onClick={() => handleSelect(item.key)}
            className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
            }`}
          >
            <Icon className="h-4.5 w-4.5" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-card lg:block">
        <div className="sticky top-0 p-5">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Super Admin Settings</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your system settings
            </p>
          </div>
          {backLink}
          {navContent}
        </div>
      </aside>

      {/* Mobile drawer + overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          onClick={onClose}
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Drawer panel */}
        <div
          className={`absolute left-0 top-0 h-full w-72 max-w-[80%] transform overflow-y-auto border-r border-border bg-card p-5 shadow-xl transition-transform duration-300 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold">Super Admin Settings</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage your system settings
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {backLink}
          {navContent}
        </div>
      </div>
    </>
  );
}
