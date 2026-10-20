"use client";

import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  Sun,
  Moon,
  Grid3x3,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  FolderKanban,
  Boxes,
  Calculator,
  Users,
  Target,
  CreditCard,
  Landmark,
  ShoppingCart,
  LayoutGrid,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavbarProps } from "@/types/navber";
import { useTheme } from "@/lib/theme-provider";

const projectRoutes = [
  {
    label: "Projects",
    href: "/projects",
    icon: FolderKanban,
    color: "text-indigo-600 bg-indigo-50",
  },
  {
    label: "Inventory",
    href: "/inventory",
    icon: Boxes,
    color: "text-blue-600 bg-blue-50",
  },
  {
    label: "Accounts",
    href: "/accounts",
    icon: Calculator,
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    label: "Hrm",
    href: "/hrm",
    icon: Users,
    color: "text-amber-600 bg-amber-50",
  },
  {
    label: "CRM",
    href: "/crm",
    icon: Target,
    color: "text-rose-600 bg-rose-50",
  },
  {
    label: "Credit Realization (CR)",
    href: "/cr",
    icon: CreditCard,
    color: "text-violet-600 bg-violet-50",
  },
  {
    label: "Lams",
    href: "/lams",
    icon: Landmark,
    color: "text-cyan-600 bg-cyan-50",
  },
  {
    label: "Procurement",
    href: "/procurement",
    icon: ShoppingCart,
    color: "text-orange-600 bg-orange-50",
  },
  {
    label: "All",
    href: "/all",
    icon: LayoutGrid,
    color: "text-slate-600 bg-slate-100",
  },
];

const Navbar = ({
  user = {
    name: "Herry",
    role: "Super Admin",
    avatarUrl: "https://i.pravatar.cc/150?img=12",
  },
  hasNotification = true,
  onSearch,
}: NavbarProps) => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="flex items-center justify-between w-full h-[76px] px-8 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      {/* Middle: Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            aria-label="Search"
            placeholder="Search modules, projects, contacts..."
            onChange={(e) => onSearch?.(e.target.value)}
            className="w-full h-11 pl-10 pr-20 bg-gray-50/70 hover:bg-gray-50 focus:bg-white border border-gray-200/80 focus:border-gray-300 rounded-2xl text-sm placeholder:text-gray-400 outline-none transition-colors"
          />
          <kbd className="absolute right-3 px-2 py-1 text-[10px] font-medium text-gray-400 bg-white border border-gray-200 rounded-md shadow-sm pointer-events-none">
            Ctrl + K
          </kbd>
        </div>
      </div>

      {/* Right: Icons + Profile */}
      <div className="flex items-center gap-2">
        {/* Projects Menu Dropdown (Left of Sun toggle button) */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-50/90 hover:bg-gray-100 border border-gray-200/80 text-sm font-medium text-gray-700 transition-colors outline-none cursor-pointer">
            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600">
              <FolderKanban className="w-3.5 h-3.5" />
            </div>
            <span className="font-medium text-[13.5px]">Projects</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-64 rounded-2xl p-1.5 shadow-xl  bg-white z-50"
          >
            <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Project Modules
            </div>
            <div className="space-y-0.5">
              {projectRoutes.map((item) => {
                const Icon = item.icon;
                return (
                  <DropdownMenuItem
                    key={item.href}
                    className="p-0 rounded-xl cursor-pointer   transition-colors group"
                  >
                    <Link
                      href={item.href}
                      className="flex items-center gap-2.5 px-3 py-2 w-full text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors"
                    >
                      <div
                        className={`flex items-center justify-center w-7 h-7 rounded-lg ${item.color} transition-colors`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span>{item.label}</span>
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Dark/Light mode toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle light or dark theme"
          className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors cursor-pointer"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-amber-500" />
          ) : (
            <Moon className="w-5 h-5 text-slate-600" />
          )}
        </button>

        <button
          type="button"
          className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
        >
          <Grid3x3 className="w-5 h-5" />
        </button>

        <div className="relative flex items-center">
          <button
            type="button"
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
          >
            <Bell className="w-5 h-5" />
          </button>
          {hasNotification && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
          )}
        </div>

        <div className="w-px h-8 bg-gray-200 mx-2" />

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2.5 pl-1 pr-2.5 py-1.5 rounded-2xl hover:bg-gray-100 transition-colors outline-none cursor-pointer">
            <Avatar className="w-9 h-9 ring-2 ring-white shadow-sm">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <ChevronDown className="w-4 h-4 text-gray-400 ml-1" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-56 rounded-2xl p-1.5 shadow-xl border border-gray-100 bg-white z-50"
          >
            <div className="flex items-center gap-3 px-3 py-3 mb-1 border-b border-gray-100">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold text-gray-900">
                  {user.name}
                </span>
                <span className="text-[11px] text-gray-400">{user.role}</span>
              </div>
            </div>

            <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-700 cursor-pointer hover:bg-gray-50 focus:bg-gray-50">
              <User className="w-4 h-4 text-gray-500" />
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-700 cursor-pointer hover:bg-gray-50 focus:bg-gray-50">
              <Settings className="w-4 h-4 text-gray-500" />
              User Management
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50 hover:bg-red-50">
              <LogOut className="w-4 h-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navbar;
