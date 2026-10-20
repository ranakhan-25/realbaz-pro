"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import {
  Boxes,
  Building,
  ChevronDown,
  ChevronRight,
  FileCog,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu as MenuIcon,
  Settings,
  ShieldCheck,
  User,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";

import { clearStoredTokens } from "@/lib/admin-auth/adminAuthStorage";
import { useTheme } from "@/lib/theme";

type AdminNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

type AdminNavGroup = {
  label: string;
  icon: LucideIcon;
  children: AdminNavItem[];
};

type AdminMenuItem = AdminNavItem | AdminNavGroup;

const menuGroups: AdminMenuItem[] = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "System Management",
    icon: Boxes,
    children: [
      {
        label: "Menu Management",
        href: "/admin/menus",
        icon: MenuIcon,
      },
      {
        label: "Web Management",
        href: "/admin/web-settings",
        icon: Settings,
      },
      {
        label: "User Organization",
        href: "/admin/organization",
        icon: User,
      },
    ],
  },
  {
    label: "Authentication",
    icon: ShieldCheck,
    children: [
      {
        label: "Users",
        href: "/admin/users",
        icon: Users,
      },
      {
        label: "Roles",
        href: "/admin/roles",
        icon: ShieldCheck,
      },
      {
        label: "Permissions",
        href: "/admin/permissions",
        icon: KeyRound,
      },
      {
        label: "Features",
        href: "/admin/features",
        icon: FileCog,
      },
      {
        label: "Modules",
        href: "/admin/modules",
        icon: Boxes,
      },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { primaryColor } = useTheme();

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "System Management": true,
    Authentication: true,
  });

  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const handleSignOut = () => {
    clearStoredTokens();
    setMobileOpen(false);
    router.replace("/admin/login");
  };

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* MOBILE TOP BAR */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm lg:hidden">
        <Link
          href="/admin/dashboard"
          className="flex min-w-0 items-center"
          aria-label="Go to dashboard"
        >
          <Image
            src={"/logo.svg"}
            alt="GarmenTek"
            width={150}
            height={50}
            priority
            className="h-auto max-h-10 w-[125px] object-contain object-left"
          />
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
          aria-expanded={mobileOpen}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95"
        >
          <MenuIcon size={21} strokeWidth={2} />
        </button>
      </header>

      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
            className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[2px] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <aside
        aria-label="Admin navigation"
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-[280px] max-w-[88vw] flex-col
          border-r border-slate-200
          bg-white
          shadow-xl shadow-slate-900/10
          transition-transform duration-300 ease-out
          lg:w-[250px]
          lg:translate-x-0
          lg:shadow-none
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* LOGO */}
        <div className="flex h-[68px] shrink-0 items-center justify-between border-b border-slate-200 px-4 sm:px-5">
          <Link
            href="/admin/dashboard"
            className="min-w-0 flex-1"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.015 }}
              className="origin-left"
            >
              <Image
                src={"/logo.svg"}
                alt="GarmenTek"
                width={300}
                height={200}
                priority
                className="h-auto max-h-[46px] w-[155px] object-contain object-left sm:w-[170px]"
              />
            </motion.div>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
            className="ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 active:scale-95 lg:hidden"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-2.5 py-3 sm:px-3 sm:py-4">
          <div className="space-y-1">
            {menuGroups.map((item, index) => {
              const Icon = item.icon;

              // ========== Single Link Item ==========
              if ("href" in item) {
                const active =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="block"
                    >
                      <motion.div
                        whileHover={{ x: active ? 0 : 2 }}
                        whileTap={{ scale: 0.985 }}
                        className="relative flex min-h-10 w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all"
                        style={
                          active
                            ? {
                                backgroundColor: primaryColor,
                                color: "#ffffff",
                                boxShadow: `0 1px 2px ${primaryColor}33`,
                              }
                            : { color: "#475569" }
                        }
                        onMouseEnter={(e) => {
                          if (!active) {
                            e.currentTarget.style.backgroundColor = `${primaryColor}0D`;
                            e.currentTarget.style.color = primaryColor;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!active) {
                            e.currentTarget.style.backgroundColor = "";
                            e.currentTarget.style.color = "#475569";
                          }
                        }}
                      >
                        <Icon
                          size={17}
                          className="shrink-0"
                          strokeWidth={active ? 2.2 : 1.8}
                        />
                        <span className="min-w-0 flex-1 truncate">
                          {item.label}
                        </span>
                        {active && (
                          <ChevronRight size={14} className="shrink-0" />
                        )}
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              }

              // ========== Group Item ==========
              const isOpen = openGroups[item.label];
              const childActive = item.children.some(
                (child) =>
                  pathname === child.href ||
                  pathname.startsWith(`${child.href}/`),
              );

              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <motion.button
                    type="button"
                    onClick={() => toggleGroup(item.label)}
                    whileTap={{ scale: 0.985 }}
                    aria-expanded={isOpen}
                    className="relative flex min-h-10 w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[13px] font-medium transition-all"
                    style={
                      childActive
                        ? {
                            backgroundColor: `${primaryColor}1A`,
                            color: primaryColor,
                          }
                        : { color: "#475569" }
                    }
                    onMouseEnter={(e) => {
                      if (!childActive) {
                        e.currentTarget.style.backgroundColor = `${primaryColor}0D`;
                        e.currentTarget.style.color = primaryColor;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!childActive) {
                        e.currentTarget.style.backgroundColor = "";
                        e.currentTarget.style.color = "#475569";
                      }
                    }}
                  >
                    <Icon
                      size={17}
                      className="shrink-0"
                      strokeWidth={childActive ? 2.2 : 1.8}
                    />
                    <span className="min-w-0 flex-1 truncate">
                      {item.label}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 0 : -90 }}
                      transition={{ duration: 0.18 }}
                      className="shrink-0"
                    >
                      <ChevronDown size={15} />
                    </motion.span>
                  </motion.button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div
                          className="ml-4 mt-1 space-y-1 border-l pl-2 sm:ml-5"
                          style={{ borderColor: `${primaryColor}33` }}
                        >
                          {item.children.map((child) => {
                            const ChildIcon = child.icon;
                            const active =
                              pathname === child.href ||
                              pathname.startsWith(`${child.href}/`);

                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={() => setMobileOpen(false)}
                                className="block"
                              >
                                <motion.div
                                  whileHover={{ x: active ? 0 : 2 }}
                                  whileTap={{ scale: 0.985 }}
                                  className="relative flex min-h-9 w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[12.5px] font-medium transition-all sm:px-3"
                                  style={
                                    active
                                      ? {
                                          backgroundColor: primaryColor,
                                          color: "#ffffff",
                                          boxShadow: `0 1px 2px ${primaryColor}33`,
                                        }
                                      : { color: "#64748B" }
                                  }
                                  onMouseEnter={(e) => {
                                    if (!active) {
                                      e.currentTarget.style.backgroundColor = `${primaryColor}0D`;
                                      e.currentTarget.style.color =
                                        primaryColor;
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!active) {
                                      e.currentTarget.style.backgroundColor =
                                        "";
                                      e.currentTarget.style.color = "#64748B";
                                    }
                                  }}
                                >
                                  <ChildIcon
                                    size={15}
                                    className="shrink-0"
                                    strokeWidth={active ? 2.1 : 1.7}
                                  />
                                  <span className="min-w-0 flex-1 truncate">
                                    {child.label}
                                  </span>
                                  {active && (
                                    <ChevronRight
                                      size={13}
                                      className="shrink-0"
                                    />
                                  )}
                                </motion.div>
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </nav>

        {/* BOTTOM ACTIONS */}
        <div className="shrink-0 border-t border-slate-200 bg-white p-2.5 pb-[max(12px,env(safe-area-inset-bottom))] sm:p-3">
          <Link
            href="/admin/settings"
            onClick={() => setMobileOpen(false)}
            className="block"
          >
            <motion.div
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.985 }}
              className="flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all"
              style={
                pathname.startsWith("/admin/settings")
                  ? {
                      backgroundColor: primaryColor,
                      color: "#ffffff",
                      boxShadow: `0 1px 2px ${primaryColor}33`,
                    }
                  : { color: "#475569" }
              }
              onMouseEnter={(e) => {
                if (!pathname.startsWith("/admin/settings")) {
                  e.currentTarget.style.backgroundColor = `${primaryColor}0D`;
                  e.currentTarget.style.color = primaryColor;
                }
              }}
              onMouseLeave={(e) => {
                if (!pathname.startsWith("/admin/settings")) {
                  e.currentTarget.style.backgroundColor = "";
                  e.currentTarget.style.color = "#475569";
                }
              }}
            >
              <Settings size={17} className="shrink-0" />
              <span className="min-w-0 truncate">Settings</span>
            </motion.div>
          </Link>

          <button
            type="button"
            onClick={handleSignOut}
            className="block w-full text-left"
          >
            <motion.div
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.985 }}
              className="mt-1 flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-slate-500 transition-colors hover:bg-red-50 hover:text-red-500"
            >
              <LogOut size={17} className="shrink-0" />
              <span className="min-w-0 truncate">Sign Out</span>
            </motion.div>
          </button>
        </div>
      </aside>
    </>
  );
}
