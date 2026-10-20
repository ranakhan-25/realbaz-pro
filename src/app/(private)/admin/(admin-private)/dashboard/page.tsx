"use client";

import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  Boxes,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileKey2,
  KeyRound,
  Menu,
  MoreHorizontal,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";
import { useTheme } from "@/lib/theme";

const stats = [
  {
    title: "Total Users",
    value: "1,248",
    change: "+12.5%",
    icon: Users,
    color: "#1D6BB2",
    bg: "bg-blue-50",
    text: "text-blue-600",
    bar: "bg-blue-500",
  },
  {
    title: "Active Users",
    value: "1,182",
    change: "+8.2%",
    icon: UserCheck,
    color: "#10B981",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    bar: "bg-emerald-500",
  },
  {
    title: "Total Roles",
    value: "18",
    change: "+3",
    icon: ShieldCheck,
    color: "#8B5CF6",
    bg: "bg-violet-50",
    text: "text-violet-600",
    bar: "bg-violet-500",
  },
  {
    title: "Permissions",
    value: "96",
    change: "+8",
    icon: FileKey2,
    color: "#F59E0B",
    bg: "bg-amber-50",
    text: "text-amber-600",
    bar: "bg-amber-500",
  },
];

const activities = [
  {
    title: "New user created",
    description: "Rahim Ahmed was added as HR Manager",
    time: "5 min ago",
    icon: UserPlus,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Role updated",
    description: "HR Manager permissions were updated",
    time: "24 min ago",
    icon: ShieldCheck,
    color: "bg-violet-100 text-violet-600",
  },
  {
    title: "Permission added",
    description: "Employee salary.view permission created",
    time: "1 hour ago",
    icon: KeyRound,
    color: "bg-amber-100 text-amber-600",
  },
  {
    title: "Module activated",
    description: "Payroll module was activated",
    time: "2 hours ago",
    icon: Boxes,
    color: "bg-emerald-100 text-emerald-600",
  },
];

const activityData = [
  { day: "Mon", value: 42 },
  { day: "Tue", value: 68 },
  { day: "Wed", value: 51 },
  { day: "Thu", value: 78 },
  { day: "Fri", value: 63 },
  { day: "Sat", value: 91 },
  { day: "Sun", value: 74 },
];

const roleData = [
  { name: "Admin", value: 82, color: "#1D6BB2" },
  { name: "HR", value: 68, color: "#10B981" },
  { name: "Manager", value: 57, color: "#8B5CF6" },
  { name: "Employee", value: 43, color: "#F59E0B" },
  { name: "Auditor", value: 31, color: "#EF4444" },
];

const quickActions = [
  {
    label: "Users",
    description: "Manage users",
    icon: Users,
    href: "/admin/users",
    color: "bg-blue-100 text-blue-600 group-hover:bg-blue-600",
  },
  {
    label: "Roles",
    description: "Manage roles",
    icon: ShieldCheck,
    href: "/admin/roles",
    color: "bg-violet-100 text-violet-600 group-hover:bg-violet-600",
  },
  {
    label: "Permissions",
    description: "Manage access",
    icon: KeyRound,
    href: "/admin/permissions",
    color: "bg-amber-100 text-amber-600 group-hover:bg-amber-600",
  },
  {
    label: "Modules",
    description: "Manage modules",
    icon: Boxes,
    href: "/admin/modules",
    color: "bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600",
  },
];

function ActivityChart({ primaryColor }: { primaryColor: string }) {
  const width = 760;
  const height = 240;
  const paddingX = 24;
  const paddingTop = 16;
  const paddingBottom = 28;
  const max = 100;

  const points = activityData.map((item, index) => {
    const x =
      paddingX + (index / (activityData.length - 1)) * (width - paddingX * 2);
    const y =
      paddingTop +
      (1 - item.value / max) * (height - paddingTop - paddingBottom);
    return { x, y, value: item.value, day: item.day };
  });

  const linePath = points
    .map((point, index) =>
      index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`,
    )
    .join(" ");

  const areaPath = `${linePath}
    L ${points[points.length - 1].x} ${height - paddingBottom}
    L ${points[0].x} ${height - paddingBottom}
    Z`;

  return (
    <div className="relative h-[240px] w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-full w-full overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="activityArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={primaryColor} stopOpacity="0.18" />
            <stop offset="100%" stopColor={primaryColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0, 25, 50, 75, 100].map((value) => {
          const y =
            paddingTop +
            (1 - value / max) * (height - paddingTop - paddingBottom);
          return (
            <g key={value}>
              <line
                x1={paddingX}
                x2={width - paddingX}
                y1={y}
                y2={y}
                stroke="#f1f5f9"
                strokeDasharray="4 6"
              />
              <text x={4} y={y + 3} fontSize="10" fill="#94a3b8">
                {value}
              </text>
            </g>
          );
        })}

        <motion.path
          d={areaPath}
          fill="url(#activityArea)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />

        <motion.path
          d={linePath}
          fill="none"
          stroke={primaryColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
        />

        {points.map((point, index) => (
          <motion.circle
            key={point.day}
            cx={point.x}
            cy={point.y}
            r="4.5"
            fill="#fff"
            stroke={primaryColor}
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.45 + index * 0.07 }}
          />
        ))}
      </svg>

      <div className="absolute bottom-0 left-6 right-2 flex justify-between">
        {activityData.map((item) => (
          <span
            key={item.day}
            className="text-[10px] font-medium text-slate-400"
          >
            {item.day}
          </span>
        ))}
      </div>
    </div>
  );
}

function DonutChart({ primaryColor }: { primaryColor: string }) {
  return (
    <div className="relative mx-auto h-44 w-44">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(${primaryColor} 0deg 300deg, #10B981 300deg 330deg, #8B5CF6 330deg 348deg, #F59E0B 348deg 360deg)`,
        }}
      />
      <div className="absolute inset-[16px] flex flex-col items-center justify-center rounded-full bg-white shadow-inner">
        <span className="text-2xl font-bold tracking-tight text-slate-900">
          1,248
        </span>
        <span className="mt-0.5 text-[10px] text-slate-400">Total Users</span>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { primaryColor } = useTheme();

  return (
    <main className="mx-auto w-full max-w-[1600px] space-y-6">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <div className="mb-1.5 flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: primaryColor }}
            />
            <p
              className="text-[11px] font-bold uppercase tracking-[0.18em]"
              style={{ color: primaryColor }}
            >
              Super Administration
            </p>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Monitor and manage your GarmenTek platform.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50/80 px-3.5 py-1.5 text-xs font-medium text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          All systems operational
        </div>
      </motion.div>

      {/* STATS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07, duration: 0.35 }}
              whileHover={{ y: -2 }}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md"
            >
              <div
                className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-[0.07] transition-transform duration-500 group-hover:scale-150"
                style={{ backgroundColor: stat.color }}
              />

              <div className="relative flex items-start justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg} ${stat.text} transition-all`}
                >
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <span className="flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                  <ArrowUpRight className="h-3 w-3" />
                  {stat.change}
                </span>
              </div>

              <p className="relative mt-4 text-xs font-medium text-slate-500">
                {stat.title}
              </p>
              <h2 className="relative mt-0.5 text-2xl font-bold tracking-tight text-slate-900">
                {stat.value}
              </h2>

              <div className="mt-3 h-1 overflow-hidden rounded-full bg-slate-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${55 + index * 10}%` }}
                  transition={{ delay: 0.4 + index * 0.08, duration: 0.6 }}
                  className={`h-full rounded-full ${stat.bar}`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* CHART ROW */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.7fr_1fr]">
        {/* User Activity */}
        <motion.section
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">
                  User Activity
                </h2>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-600">
                  +18.4%
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-400">
                User registrations over the last 7 days
              </p>
            </div>

            <select
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-500 outline-none"
              style={
                {
                  // focus border via CSS variable if needed
                }
              }
            >
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>

          <div className="mt-5 flex items-center gap-6">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">
                Total activity
              </p>
              <p className="mt-0.5 text-xl font-bold text-slate-900">475</p>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">
                Peak
              </p>
              <p className="mt-0.5 text-xl font-bold text-slate-900">91</p>
            </div>
            <div className="h-8 w-px bg-slate-200" />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">
                Avg / day
              </p>
              <p
                className="mt-0.5 text-xl font-bold"
                style={{ color: primaryColor }}
              >
                67.8
              </p>
            </div>
          </div>

          <div className="mt-4">
            <ActivityChart primaryColor={primaryColor} />
          </div>
        </motion.section>

        {/* User Distribution */}
        <motion.section
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                User Distribution
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                Current account status
              </p>
            </div>
            <button
              type="button"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4">
            <DonutChart primaryColor={primaryColor} />
          </div>

          <div className="mt-3 space-y-1.5">
            {[
              ["Active", "1,182", primaryColor],
              ["Inactive", "42", "#34D399"],
              ["Pending", "18", "#A78BFA"],
              ["Suspended", "6", "#FBBF24"],
            ].map(([label, value, dot]) => (
              <div
                key={label as string}
                className="flex items-center justify-between rounded-lg px-3 py-2 transition hover:bg-slate-50"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: dot as string }}
                  />
                  <span className="text-[11px] font-medium text-slate-500">
                    {label as string}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-800">
                  {value as string}
                </span>
              </div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* ANALYTICS ROW */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.4fr_1fr]">
        {/* Role Activity */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Role Activity
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                User distribution by role
              </p>
            </div>
            <button
              type="button"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-6 grid grid-cols-5 gap-3">
            {roleData.map((item, index) => (
              <div key={item.name} className="flex flex-col">
                <div className="flex h-36 items-end justify-center rounded-xl bg-slate-50/80 p-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${item.value}%` }}
                    transition={{ delay: 0.4 + index * 0.07, duration: 0.6 }}
                    className="w-full max-w-[36px] rounded-t-lg"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
                <p className="mt-2 text-center text-[10px] font-semibold text-slate-600">
                  {item.name}
                </p>
                <p className="mt-0.5 text-center text-[10px] text-slate-400">
                  {item.value}%
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* System Health */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                System Health
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                Platform service status
              </p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[9px] font-bold text-emerald-600">
                Healthy
              </span>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            {[
              ["Authentication", "Operational", true],
              ["Authorization", "Operational", true],
              ["User Management", "Operational", true],
              ["Database", "Operational", true],
              ["Background Jobs", "Degraded", false],
            ].map(([label, status, good]) => (
              <div
                key={label as string}
                className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2.5"
              >
                <div className="flex items-center gap-2.5">
                  {good ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-amber-500" />
                  )}
                  <span className="text-[11px] font-medium text-slate-600">
                    {label as string}
                  </span>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                    good
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-amber-50 text-amber-600"
                  }`}
                >
                  {status as string}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{
                backgroundColor: `${primaryColor}1A`,
                color: primaryColor,
              }}
            >
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400">System uptime</p>
              <p className="text-sm font-bold text-slate-900">99.98%</p>
            </div>
          </div>
        </motion.section>
      </div>

      {/* BOTTOM ROW */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.4fr_1fr]">
        {/* Recent Activity */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Recent Activity
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                Latest administrative actions
              </p>
            </div>
            <button
              type="button"
              className="flex items-center gap-1 text-xs font-semibold hover:underline"
              style={{ color: primaryColor }}
            >
              View all
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-4 divide-y divide-slate-100">
            {activities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <motion.div
                  key={activity.title}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.06 }}
                  className="flex items-center gap-3.5 py-3.5"
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${activity.color}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-800">
                      {activity.title}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-slate-400">
                      {activity.description}
                    </p>
                  </div>
                  <span className="flex shrink-0 items-center gap-1 text-[10px] text-slate-400">
                    <Clock3 className="h-3 w-3" />
                    {activity.time}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Quick Actions */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
        >
          <div>
            <h2 className="text-sm font-bold text-slate-900">Quick Actions</h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Frequently used administration tools
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <a
                  key={action.label}
                  href={action.href}
                  className="group rounded-xl border border-slate-200 p-4 transition-all hover:border-slate-300 hover:shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg transition group-hover:text-white ${action.color}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 text-slate-300 transition group-hover:text-slate-500" />
                  </div>
                  <p className="mt-3 text-xs font-bold text-slate-700">
                    {action.label}
                  </p>
                  <p className="mt-0.5 text-[10px] text-slate-400">
                    {action.description}
                  </p>
                </a>
              );
            })}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              ["12", "Modules", Boxes, "text-blue-500"],
              ["48", "Menus", Menu, "text-violet-500"],
              ["96", "Keys", FileKey2, "text-amber-500"],
            ].map(([value, label, Icon, color]) => {
              const MiniIcon = Icon as typeof Boxes;
              return (
                <div
                  key={label as string}
                  className="rounded-xl bg-slate-50 p-3 text-center"
                >
                  <MiniIcon className={`mx-auto h-4 w-4 ${color as string}`} />
                  <p className="mt-1.5 text-sm font-bold text-slate-800">
                    {value as string}
                  </p>
                  <p className="text-[9px] text-slate-400">{label as string}</p>
                </div>
              );
            })}
          </div>
        </motion.section>
      </div>
    </main>
  );
}
