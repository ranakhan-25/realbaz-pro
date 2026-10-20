"use client";

import { Menu } from "lucide-react";

interface SuperAdminTopbarProps {
  onMenuClick: () => void;
}

export default function SuperAdminTopbar({ onMenuClick }: SuperAdminTopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-card px-4 py-3 sm:px-6 lg:hidden">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
      >
        <Menu className="h-5 w-5" />
      </button>
      <h1 className="text-base font-semibold">Super Admin Settings</h1>
    </header>
  );
}