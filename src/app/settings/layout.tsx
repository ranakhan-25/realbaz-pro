import type { Metadata } from "next";
import React from "react";
import Image from "next/image";
import { Topbar } from "@/components/crm/topbar";

export const metadata: Metadata = {
  title: "Settings | RealBiz CRM",
  description: "Configure system parameters, organization details, and security controls.",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-canvas/30 text-ink">

      <header className="sticky top-0 z-30 bg-surface/95 backdrop-blur-md border-b border-border shadow-xs">
        <div className="mx-auto px-4 flex items-center justify-between h-16 gap-4">
          
          <div className="flex items-center gap-3 shrink-0">
            <Image
              src="/logo.svg"
              alt="Company Logo"
              width={32}
              height={32}
              className="h-8 w-auto object-contain"
              priority
            />
          </div>

          <div className="flex-1">
            <Topbar />
          </div>

        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}