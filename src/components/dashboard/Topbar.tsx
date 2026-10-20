"use client";

import { useRouter } from "next/navigation";
import {
  ChevronDown,
  LayoutGrid,
  LogOut,
  Menu,
  Moon,
  Search,
  Sun,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/Logo";
import { initials, logout, type Session } from "@/lib/auth";
import { useTheme } from "@/lib/theme";

const FALLBACK_PRIMARY = "#2ed573";

export function Topbar({
  session,
  onMenu,
  search,
  onSearch,
}: {
  session: Session;
  onMenu: () => void;
  search: string;
  onSearch: (v: string) => void;
}) {
  const { theme, toggle, primaryColor } = useTheme();
  const brandColor = primaryColor || FALLBACK_PRIMARY;

  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border bg-background px-4 sm:px-6">
      {/* Mobile menu */}
      <button
        type="button"
        onClick={onMenu}
        className="grid h-9 w-9 place-items-center rounded-md text-foreground/70 hover:bg-foreground/5 lg:hidden"
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      <Logo to="/dashboard" />

      {/* Search */}
      <div className="relative ml-2 hidden max-w-md flex-1 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search menu, projects, invoices, leads…"
          className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none transition"
          onFocus={(e) => {
            e.currentTarget.style.borderColor = brandColor;
            e.currentTarget.style.boxShadow = `0 0 0 3px ${brandColor}20`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "";
            e.currentTarget.style.boxShadow = "";
          }}
        />
      </div>

      {/* Actions */}
      <div className="ml-auto flex items-center gap-1.5">
        <button
          type="button"
          title="Extensions"
          aria-label="Extensions"
          className="grid h-9 w-9 place-items-center rounded-md text-foreground/70 transition hover:bg-foreground/5"
        >
          <LayoutGrid className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={toggle}
          title="Toggle theme"
          aria-label="Toggle theme"
          className="grid h-9 w-9 place-items-center rounded-md text-foreground/70 transition hover:bg-foreground/5"
        >
          {theme === "light" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </button>

        {/* User menu */}
        <div ref={ref} className="relative ml-1">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 rounded-md border border-border py-1 pl-1 pr-2.5 transition hover:bg-foreground/5"
          >
            <span
              className="grid size-7 place-items-center rounded text-xs font-bold text-white"
              style={{ backgroundColor: brandColor }}
            >
              {initials(session.name)}
            </span>
            <span className="hidden text-sm font-semibold sm:block">
              {session.name}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-md border border-border bg-popover shadow-lg">
              <div className="border-b border-border px-3 py-2.5">
                <div className="text-sm font-semibold">{session.name}</div>
                <div className="truncate text-xs text-muted-foreground">
                  {session.email}
                </div>
              </div>

              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-sm transition hover:bg-foreground/5"
              >
                <User className="h-4 w-4" /> Profile
              </button>

              <button
                type="button"
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive transition hover:bg-foreground/5"
              >
                <LogOut className="h-4 w-4" /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
