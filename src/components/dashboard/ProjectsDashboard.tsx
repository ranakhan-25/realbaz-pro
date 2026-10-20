// "use client";

// import React from "react";
// import Link from "next/link";

// import {
//   BarChart,
//   Bar,
//   AreaChart,
//   Area,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// import {
//   FolderKanban,
//   ListChecks,
//   ShieldCheck,
//   AlertTriangle,
//   TrendingUp,
//   TrendingDown,
//   Calendar,
//   Users,
//   ArrowUpRight,
//   Sparkles,
//   Layers,
//   Activity,
// } from "lucide-react";

// // =====================================================
// // Types
// // =====================================================

// interface Project {
//   id: number;
//   name: string;
//   status: "On Track" | "At Risk" | "In Trouble";
//   progress: number;
//   duration: string;
//   membersCount: number;
//   totalTasks: number;
//   completedTasks: number;
//   budgetProgress: number;
//   href: string;
// }

// interface DashboardData {
//   totalProjects: number;
//   totalTasks: number;
//   completedProjects: number;
//   pendingProjects: number;
//   runningProjects: number;
//   materialRequisitions: number;
//   serviceRequisitions: number;
//   unsoldFlatLand: number;

//   projectStats: {
//     month: string;
//     projects: number;
//   }[];

//   projectStatus: {
//     name: string;
//     value: number;
//   }[];

//   recentProjects: Project[];
// }

// // =====================================================
// // Dashboard Data
// // =====================================================

// const dashboardData: DashboardData = {
//   totalProjects: 4,
//   totalTasks: 50,
//   completedProjects: 4,
//   pendingProjects: 0,
//   runningProjects: 4,
//   materialRequisitions: 0,
//   serviceRequisitions: 0,
//   unsoldFlatLand: 0,

//   projectStats: [
//     {
//       month: "Rifat Eyecon City",
//       projects: 0,
//     },
//     {
//       month: "Hena Heights",
//       projects: 0,
//     },
//     {
//       month: "Sheba Eyecon Tower",
//       projects: 2,
//     },
//     {
//       month: "Estern 19",
//       projects: 0,
//     },
//   ],

//   projectStatus: [
//     {
//       name: "On Track",
//       value: 4,
//     },
//     {
//       name: "At Risk",
//       value: 0,
//     },
//     {
//       name: "In Trouble",
//       value: 0,
//     },
//   ],

//   recentProjects: [
//     {
//       id: 1,
//       name: "Rifat Eyecon City",
//       status: "On Track",
//       progress: 0,
//       duration: "51 Months",
//       membersCount: 3,
//       totalTasks: 1,
//       completedTasks: 0,
//       budgetProgress: 0,
//       href: "/dashboard/project/dashboard/rifat",
//     },

//     {
//       id: 2,
//       name: "Hena Heights",
//       status: "On Track",
//       progress: 0,
//       duration: "15 Months",
//       membersCount: 1,
//       totalTasks: 1,
//       completedTasks: 0,
//       budgetProgress: 0,
//       href: "/dashboard/project/dashboard/hena-heights",
//     },

//     {
//       id: 3,
//       name: "Sheba Eyecon Tower",
//       status: "On Track",
//       progress: 0,
//       duration: "0 Months",
//       membersCount: 0,
//       totalTasks: 1,
//       completedTasks: 0,
//       budgetProgress: 0,
//       href: "/dashboard/project/dashboard/sheba",
//     },

//     {
//       id: 4,
//       name: "Estern 19",
//       status: "On Track",
//       progress: 0,
//       duration: "0 Months",
//       membersCount: 1,
//       totalTasks: 1,
//       completedTasks: 0,
//       budgetProgress: 0,
//       href: "/dashboard/project/dashboard/estern",
//     },
//   ],
// };

// // =====================================================
// // Chart Colors
// // =====================================================

// const statusColors = [
//   "#3b82f6",
//   "#f59e0b",
//   "#ef4444",
// ];

// // =====================================================
// // Custom Tooltip
// // =====================================================

// function CustomTooltip({
//   active,
//   payload,
//   label,
// }: {
//   active?: boolean;
//   payload?: {
//     value: number;
//     name: string;
//     color: string;
//   }[];
//   label?: string;
// }) {
//   if (!active || !payload || !payload.length) {
//     return null;
//   }

//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-2xl">
//       {label && (
//         <p className="mb-1 text-xs font-semibold text-slate-400">
//           {label}
//         </p>
//       )}

//       {payload.map((item, index) => (
//         <p
//           key={index}
//           className="mt-1 flex items-center gap-2 text-sm font-bold text-slate-900"
//         >
//           <span
//             className="inline-block h-2 w-2 rounded-full"
//             style={{
//               backgroundColor: item.color,
//             }}
//           />

//           {item.value}
//         </p>
//       ))}
//     </div>
//   );
// }

// // =====================================================
// // Dashboard Page
// // =====================================================

// const DashboardPage = () => {
//   const data = dashboardData;

//   // ===================================================
//   // Top Statistics
//   // ===================================================

//   const stats = [
//     {
//       id: 1,
//       title: "Total Projects",
//       value: data.totalProjects,
//       description: "Running currently",
//       href: "/dashboard/project/dashboard/totalprojects",
//       trend: "+12%",
//       isPositive: true,
//       icon: FolderKanban,
//       miniChartType: "area" as const,
//       gradient: "from-blue-600 via-indigo-600 to-violet-700",
//       bgGlow: "bg-blue-500/15",
//       chartData: [
//         { v: 2 },
//         { v: 4 },
//         { v: 3 },
//         { v: 5 },
//         { v: 4 },
//       ],
//     },

//     {
//       id: 2,
//       title: "Running Project",
//       value: data.runningProjects,
//       description: "Currently in progress",
//       href: "/dashboard/project/dashboard/running",
//       trend: "+0%",
//       isPositive: true,
//       icon: Activity,
//       miniChartType: "area" as const,
//       gradient: "from-teal-600 via-cyan-600 to-sky-700",
//       bgGlow: "bg-teal-500/15",
//       chartData: [
//         { v: 3 },
//         { v: 4 },
//         { v: 5 },
//         { v: 4 },
//         { v: 6 },
//       ],
//     },

//     {
//       id: 3,
//       title: "Material Req.",
//       value: data.materialRequisitions,
//       description: "Pending requisitions",
//       href: "/dashboard/project/dashboard/material-requisition",
//       trend: "0.0%",
//       isPositive: false,
//       icon: ListChecks,
//       miniChartType: "bar" as const,
//       gradient: "from-emerald-600 via-green-600 to-teal-700",
//       bgGlow: "bg-emerald-500/15",
//       chartData: [
//         { v: 0 },
//         { v: 0 },
//         { v: 0 },
//         { v: 0 },
//         { v: 0 },
//       ],
//     },

//     {
//       id: 4,
//       title: "Service Req.",
//       value: data.serviceRequisitions,
//       description: "Pending service requests",
//       href: "/dashboard/project/dashboard/service-work-requisition",
//       trend: "0.0%",
//       isPositive: false,
//       icon: ShieldCheck,
//       miniChartType: "bar" as const,
//       gradient: "from-fuchsia-600 via-pink-600 to-rose-700",
//       bgGlow: "bg-fuchsia-500/15",
//       chartData: [
//         { v: 0 },
//         { v: 0 },
//         { v: 0 },
//         { v: 0 },
//         { v: 0 },
//       ],
//     },

//     {
//       id: 5,
//       title: "Task",
//       value: data.totalTasks,
//       description: "Across all projects",
//       href: "/dashboard/project/dashboard/",
//       trend: "+8.4%",
//       isPositive: true,
//       icon: ListChecks,
//       miniChartType: "bar" as const,
//       gradient: "from-orange-600 via-red-600 to-rose-700",
//       bgGlow: "bg-orange-500/15",
//       chartData: [
//         { v: 10 },
//         { v: 25 },
//         { v: 18 },
//         { v: 35 },
//         { v: 50 },
//       ],
//     },

//     {
//       id: 6,
//       title: "Unsold Flat/Land",
//       value: data.unsoldFlatLand,
//       description: "Available inventory",
//       href: "/dashboard/project/dashboard/flat-land",
//       trend: "0.0%",
//       isPositive: false,
//       icon: AlertTriangle,
//       miniChartType: "bar" as const,
//       gradient: "from-blue-500 via-sky-600 to-indigo-700",
//       bgGlow: "bg-blue-500/15",
//       chartData: [
//         { v: 0 },
//         { v: 0 },
//         { v: 0 },
//         { v: 0 },
//         { v: 0 },
//       ],
//     },
//   ];

//   // ===================================================
//   // Render
//   // ===================================================

//   return (
//     <div className="min-h-screen bg-slate-50 p-4 font-sans text-slate-900 sm:p-6 lg:p-8">

//       {/* =================================================
//           Header
//       ================================================= */}

//       <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

//         <div>
//           <div className="mb-3 flex items-center gap-2">
//             <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-blue-600">
//               <Sparkles className="h-3.5 w-3.5" />
//               Enterprise Workspace
//             </span>
//           </div>

//           <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
//             Project Dashboard
//           </h1>

//           <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-500">
//             Real-time analytics, portfolio status, and workflow metrics.
//           </p>
//         </div>

//         <div>
//           <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-emerald-600 shadow-sm">
//             <span className="relative flex h-2.5 w-2.5">
//               <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
//               <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
//             </span>

//             All Systems Optimized
//           </div>
//         </div>
//       </div>

//       {/* =================================================
//           Statistics Cards
//       ================================================= */}

//       <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">

//         {stats.map((item) => {
//           const Icon = item.icon;

//           return (
//             <Link
//               key={item.id}
//               href={item.href}
//               className="group block"
//             >
//               <div className="relative min-h-[215px] overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10">

//                 {/* Background Glow */}

//                 <div
//                   className={`absolute -right-12 -top-12 h-36 w-36 rounded-full ${item.bgGlow} blur-3xl transition-transform duration-500 group-hover:scale-150`}
//                 />

//                 {/* Content */}

//                 <div className="relative z-10 flex items-start justify-between gap-3">

//                   <div className="min-w-0">
//                     <p className="truncate text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
//                       {item.title}
//                     </p>

//                     <div className="mt-3 flex flex-wrap items-center gap-2">
//                       <h3 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
//                         {item.value}
//                       </h3>

//                       <span
//                         className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${
//                           item.isPositive
//                             ? "border border-emerald-200 bg-emerald-50 text-emerald-600"
//                             : "border border-slate-200 bg-slate-50 text-slate-400"
//                         }`}
//                       >
//                         {item.isPositive ? (
//                           <TrendingUp className="h-3 w-3" />
//                         ) : (
//                           <TrendingDown className="h-3 w-3" />
//                         )}

//                         {item.trend}
//                       </span>
//                     </div>

//                     <p className="mt-2 text-xs font-medium text-slate-400">
//                       {item.description}
//                     </p>
//                   </div>

//                   {/* Icon */}

//                   <div
//                     className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
//                   >
//                     <Icon className="h-6 w-6 stroke-[2.2]" />
//                   </div>
//                 </div>

//                 {/* Mini Chart */}

//                 <div className="relative mt-6 h-[48px] w-full">
//                   <ResponsiveContainer
//                     width="100%"
//                     height="100%"
//                   >
//                     {item.miniChartType === "area" ? (
//                       <AreaChart data={item.chartData}>
//                         <defs>
//                           <linearGradient
//                             id={`grad-${item.id}`}
//                             x1="0"
//                             y1="0"
//                             x2="0"
//                             y2="1"
//                           >
//                             <stop
//                               offset="0%"
//                               stopColor="#38BDF8"
//                               stopOpacity={0.45}
//                             />

//                             <stop
//                               offset="100%"
//                               stopColor="#38BDF8"
//                               stopOpacity={0.02}
//                             />
//                           </linearGradient>
//                         </defs>

//                         <Area
//                           type="monotone"
//                           dataKey="v"
//                           stroke="#38BDF8"
//                           strokeWidth={2}
//                           fill={`url(#grad-${item.id})`}
//                         />
//                       </AreaChart>
//                     ) : (
//                       <BarChart data={item.chartData}>
//                         <Bar
//                           dataKey="v"
//                           fill="#38BDF8"
//                           radius={[4, 4, 0, 0]}
//                         />
//                       </BarChart>
//                     )}
//                   </ResponsiveContainer>
//                 </div>
//               </div>
//             </Link>
//           );
//         })}
//       </div>

//       {/* =================================================
//           Main Charts
//       ================================================= */}

//       <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">

//         {/* =================================================
//             Project Portfolio Overview
//         ================================================= */}

//         <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:col-span-2">

//           <div className="mb-6">
//             <div className="flex items-center gap-2">
//               <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
//                 <Activity className="h-4 w-4" />
//               </div>

//               <div>
//                 <h2 className="text-base font-bold text-slate-900">
//                   Project Portfolio Overview
//                 </h2>

//                 <p className="text-xs text-slate-400">
//                   Active workflow velocity and distribution timeline
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="h-[280px] sm:h-[320px]">
//             <ResponsiveContainer
//               width="100%"
//               height="100%"
//             >
//               <AreaChart data={data.projectStats}>
//                 <defs>
//                   <linearGradient
//                     id="colorProjects"
//                     x1="0"
//                     y1="0"
//                     x2="0"
//                     y2="1"
//                   >
//                     <stop
//                       offset="5%"
//                       stopColor="#38BDF8"
//                       stopOpacity={0.45}
//                     />

//                     <stop
//                       offset="95%"
//                       stopColor="#38BDF8"
//                       stopOpacity={0.03}
//                     />
//                   </linearGradient>
//                 </defs>

//                 <CartesianGrid
//                   strokeDasharray="3 3"
//                   stroke="#e2e8f0"
//                   vertical={false}
//                 />

//                 <XAxis
//                   dataKey="month"
//                   tick={{
//                     fill: "#94a3b8",
//                     fontSize: 10,
//                     fontWeight: 500,
//                   }}
//                   angle={-15}
//                   textAnchor="end"
//                   height={55}
//                   interval={0}
//                   axisLine={{
//                     stroke: "#e2e8f0",
//                   }}
//                   tickLine={false}
//                 />

//                 <YAxis
//                   tick={{
//                     fill: "#94a3b8",
//                     fontSize: 11,
//                   }}
//                   axisLine={false}
//                   tickLine={false}
//                 />

//                 <Tooltip
//                   content={<CustomTooltip />}
//                 />

//                 <Area
//                   type="monotone"
//                   dataKey="projects"
//                   stroke="#38BDF8"
//                   strokeWidth={3}
//                   fill="url(#colorProjects)"
//                   dot={{
//                     r: 4,
//                     fill: "#38BDF8",
//                     strokeWidth: 2,
//                     stroke: "#fff",
//                   }}
//                   activeDot={{
//                     r: 6,
//                     fill: "#0EA5E9",
//                   }}
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* =================================================
//             Portfolio Health
//         ================================================= */}

//         <div className="flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

//           <div>
//             <div className="flex items-center gap-2">
//               <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
//                 <Layers className="h-4 w-4" />
//               </div>

//               <div>
//                 <h2 className="text-base font-bold text-slate-900">
//                   Portfolio Health
//                 </h2>

//                 <p className="text-xs text-slate-400">
//                   Current status distribution
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Pie */}

//           <div className="relative my-4 h-[210px]">
//             <ResponsiveContainer
//               width="100%"
//               height="100%"
//             >
//               <PieChart>
//                 <Pie
//                   data={data.projectStatus}
//                   dataKey="value"
//                   nameKey="name"
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={58}
//                   outerRadius={80}
//                   paddingAngle={4}
//                   cornerRadius={6}
//                   stroke="none"
//                 >
//                   {data.projectStatus.map((_, index) => (
//                     <Cell
//                       key={`cell-${index}`}
//                       fill={statusColors[index]}
//                     />
//                   ))}
//                 </Pie>

//                 <Tooltip
//                   content={<CustomTooltip />}
//                 />
//               </PieChart>
//             </ResponsiveContainer>

//             {/* Center */}

//             <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
//               <span className="text-3xl font-black text-slate-900">
//                 {data.totalProjects}
//               </span>

//               <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
//                 Active
//               </span>
//             </div>
//           </div>

//           {/* Legend */}

//           <div className="space-y-2.5 border-t border-slate-100 pt-4">
//             {data.projectStatus.map((status, index) => (
//               <div
//                 key={status.name}
//                 className="flex items-center justify-between"
//               >
//                 <span className="flex items-center gap-2 text-xs font-semibold text-slate-500">
//                   <span
//                     className="h-2.5 w-2.5 rounded-full"
//                     style={{
//                       backgroundColor: statusColors[index],
//                     }}
//                   />

//                   {status.name}
//                 </span>

//                 <span className="font-mono text-sm font-bold text-slate-900">
//                   {status.value}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* =================================================
//           Working & Financial Progress
//       ================================================= */}

//       <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

//         <div className="mb-6">
//           <h2 className="text-base font-bold text-slate-900">
//             Working &amp; Financial Progress
//           </h2>

//           <p className="mt-1 text-xs text-slate-400">
//             Financial distribution across active projects
//           </p>
//         </div>

//         <div className="h-[260px] sm:h-[300px]">
//           <ResponsiveContainer
//             width="100%"
//             height="100%"
//           >
//             <BarChart
//               data={data.projectStats}
//               barSize={32}
//             >
//               <defs>
//                 <linearGradient
//                   id="colorBar"
//                   x1="0"
//                   y1="0"
//                   x2="0"
//                   y2="1"
//                 >
//                   <stop
//                     offset="0%"
//                     stopColor="#38BDF8"
//                   />

//                   <stop
//                     offset="100%"
//                     stopColor="#2563EB"
//                   />
//                 </linearGradient>
//               </defs>

//               <CartesianGrid
//                 strokeDasharray="3 3"
//                 stroke="#e2e8f0"
//                 vertical={false}
//               />

//               <XAxis
//                 dataKey="month"
//                 tick={{
//                   fill: "#94a3b8",
//                   fontSize: 10,
//                   fontWeight: 500,
//                 }}
//                 angle={-15}
//                 textAnchor="end"
//                 height={55}
//                 interval={0}
//                 axisLine={{
//                   stroke: "#e2e8f0",
//                 }}
//                 tickLine={false}
//               />

//               <YAxis
//                 tick={{
//                   fill: "#94a3b8",
//                   fontSize: 11,
//                 }}
//                 axisLine={false}
//                 tickLine={false}
//               />

//               <Tooltip
//                 content={<CustomTooltip />}
//                 cursor={{
//                   fill: "#F0F9FF",
//                 }}
//               />

//               <Bar
//                 dataKey="projects"
//                 fill="url(#colorBar)"
//                 radius={[7, 7, 0, 0]}
//               />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* =================================================
//           Recent Projects
//       ================================================= */}

//       <div className="mt-8">

//         {/* Section Header */}

//         <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
//           <div>
//             <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
//               Recent Projects Portfolio
//             </h2>

//             <p className="mt-1 text-xs text-slate-400">
//               Interactive project cards with project insights
//             </p>
//           </div>

//           <span className="text-xs font-semibold text-slate-400">
//             {data.recentProjects.length} Projects
//           </span>
//         </div>

//         {/* Project Cards */}

//         <div className="grid grid-cols-1 gap-4">

//           {data.recentProjects.map((project) => (
//             <Link
//               key={project.id}
//               href={project.href}
//               className="group relative block overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 sm:p-5"
//             >

//               {/* Left Ribbon */}

//               <div className="absolute bottom-0 left-0 top-0 hidden w-11 items-center justify-center bg-gradient-to-b from-blue-600 via-indigo-600 to-violet-700 sm:flex">
//                 <span className="rotate-180 text-[10px] font-bold uppercase tracking-[0.14em] text-white [writing-mode:vertical-lr]">
//                   {project.status}
//                 </span>
//               </div>

//               {/* Mobile Status */}

//               <div className="mb-4 flex sm:hidden">
//                 <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-600">
//                   {project.status}
//                 </span>
//               </div>

//               {/* Card Content */}

//               <div className="grid w-full grid-cols-1 gap-5 sm:pl-2 lg:grid-cols-12">

//                 {/* =================================================
//                     Project Info
//                 ================================================= */}

//                 <div className="space-y-4 lg:col-span-5">

//                   <div>
//                     <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 transition-colors group-hover:text-blue-600 sm:text-lg">
//                       {project.name}

//                       <ArrowUpRight className="h-4 w-4 shrink-0 text-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
//                     </h3>
//                   </div>

//                   {/* Progress */}

//                   <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

//                     {/* Complete */}

//                     <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
//                       <div className="mb-2 flex items-center justify-between gap-2">
//                         <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
//                           % Complete
//                         </span>

//                         <span className="text-xs font-bold text-slate-800">
//                           {project.progress.toFixed(2)}%
//                         </span>
//                       </div>

//                       <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
//                         <div
//                           className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
//                           style={{
//                             width: `${project.progress}%`,
//                           }}
//                         />
//                       </div>
//                     </div>

//                     {/* Budget */}

//                     <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
//                       <div className="mb-2 flex items-center justify-between gap-2">
//                         <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
//                           Project Budget
//                         </span>

//                         <span className="text-xs font-bold text-slate-800">
//                           {project.budgetProgress}%
//                         </span>
//                       </div>

//                       <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
//                         <div
//                           className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
//                           style={{
//                             width: `${project.budgetProgress}%`,
//                           }}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* =================================================
//                     Duration & Members
//                 ================================================= */}

//                 <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1 lg:border-l lg:border-r lg:border-slate-100 lg:px-5">

//                   {/* Duration */}

//                   <div className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-3">
//                     <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
//                       <Calendar className="h-4 w-4" />
//                     </div>

//                     <div className="min-w-0">
//                       <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
//                         Duration
//                       </p>

//                       <p className="mt-0.5 truncate text-xs font-bold text-slate-800">
//                         {project.duration}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Members */}

//                   <div className="flex items-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-3">
//                     <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
//                       <Users className="h-4 w-4" />
//                     </div>

//                     <div>
//                       <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
//                         Team Members
//                       </p>

//                       <p className="mt-0.5 text-xs font-bold text-slate-800">
//                         {project.membersCount} Member
//                         {project.membersCount !== 1 ? "s" : ""}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* =================================================
//                     Tasks
//                 ================================================= */}

//                 <div className="grid grid-cols-2 gap-3 lg:col-span-3 lg:self-center">

//                   {/* Total */}

//                   <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-4 text-center transition-colors group-hover:border-sky-200">
//                     <p className="text-[9px] font-bold uppercase tracking-wider text-sky-500 sm:text-[10px]">
//                       Total Tasks
//                     </p>

//                     <p className="mt-1 text-2xl font-black text-slate-900">
//                       {project.totalTasks}
//                     </p>
//                   </div>

//                   {/* Completed */}

//                   <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-center transition-colors group-hover:border-emerald-200">
//                     <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-500 sm:text-[10px]">
//                       Completed
//                     </p>

//                     <p className="mt-1 text-2xl font-black text-slate-900">
//                       {project.completedTasks}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Bottom Hover Line */}

//               <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 transition-all duration-500 group-hover:w-full" />
//             </Link>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;


"use client";

import React from "react";
import Link from "next/link";

import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  FolderKanban,
  ListChecks,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  ArrowUpRight,
  Sparkles,
  Layers,
  Activity,
} from "lucide-react";

// =====================================================
// TYPES
// =====================================================

interface Project {
  id: number;
  name: string;
  status: "On Track" | "At Risk" | "In Trouble";
  progress: number;
  duration: string;
  membersCount: number;
  totalTasks: number;
  completedTasks: number;
  budgetProgress: number;
  href: string;
}

interface DashboardData {
  totalProjects: number;
  totalTasks: number;
  completedProjects: number;
  pendingProjects: number;
  runningProjects: number;
  materialRequisitions: number;
  serviceRequisitions: number;
  unsoldFlatLand: number;

  projectStats: {
    month: string;
    projects: number;
  }[];

  projectStatus: {
    name: string;
    value: number;
  }[];

  recentProjects: Project[];
}

// =====================================================
// DASHBOARD DATA
// =====================================================

const dashboardData: DashboardData = {
  totalProjects: 6,

  totalTasks: 50,

  completedProjects: 4,

  pendingProjects: 0,

  runningProjects: 6,

  materialRequisitions: 0,

  serviceRequisitions: 0,

  unsoldFlatLand: 0,

  // ===================================================
  // PROJECT CHART DATA
  // ===================================================

  projectStats: [
    {
      month: "Rifat Eyecon City",
      projects: 0,
    },
    {
      month: "Hena Heights",
      projects: 0,
    },
    {
      month: "Sheba Eyecon Tower",
      projects: 2,
    },
    {
      month: "Estern 19",
      projects: 0,
    },
    {
      month: "Lake Garden",
      projects: 1,
    },
    {
      month: "Head Office",
      projects: 1,
    },
  ],

  // ===================================================
  // PROJECT STATUS
  // ===================================================

  projectStatus: [
    {
      name: "On Track",
      value: 6,
    },
    {
      name: "At Risk",
      value: 0,
    },
    {
      name: "In Trouble",
      value: 0,
    },
  ],

  // ===================================================
  // RECENT PROJECTS
  // ===================================================

  recentProjects: [
    {
      id: 1,
      name: "Rifat Eyecon City",
      status: "On Track",
      progress: 0,
      duration: "51 Months",
      membersCount: 3,
      totalTasks: 1,
      completedTasks: 0,
      budgetProgress: 0,
      href: "/dashboard/project/dashboard/rifat",
    },

    {
      id: 2,
      name: "Hena Heights",
      status: "On Track",
      progress: 0,
      duration: "15 Months",
      membersCount: 1,
      totalTasks: 1,
      completedTasks: 0,
      budgetProgress: 0,
      href: "/dashboard/project/dashboard/hena-heights",
    },

    {
      id: 3,
      name: "Sheba Eyecon Tower",
      status: "On Track",
      progress: 0,
      duration: "0 Months",
      membersCount: 0,
      totalTasks: 1,
      completedTasks: 0,
      budgetProgress: 0,
      href: "/dashboard/project/dashboard/sheba",
    },

    {
      id: 4,
      name: "Estern 19",
      status: "On Track",
      progress: 0,
      duration: "0 Months",
      membersCount: 1,
      totalTasks: 1,
      completedTasks: 0,
      budgetProgress: 0,
      href: "/dashboard/project/dashboard/estern",
    },

    // =================================================
    // LAKE GARDEN
    // =================================================

    {
      id: 5,
      name: "Lake Garden",
      status: "On Track",
      progress: 0,
      duration: "0 Months",
      membersCount: 1,
      totalTasks: 1,
      completedTasks: 0,
      budgetProgress: 0.01,
      href: "/dashboard/project/dashboard/lake-garden",
    },

    // =================================================
    // HEAD OFFICE
    // =================================================

    {
      id: 6,
      name: "Head Office",
      status: "On Track",
      progress: 0,
      duration: "0 Months",
      membersCount: 1,
      totalTasks: 1,
      completedTasks: 0,
      budgetProgress: 0,
      href: "/dashboard/project/dashboard/head-office",
    },
  ],
};

// =====================================================
// CHART COLORS
// =====================================================

const statusColors = [
  "#22c55e",
  "#f59e0b",
  "#ef4444",
];

// =====================================================
// CUSTOM TOOLTIP
// =====================================================

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: {
    value: number;
    name: string;
    color: string;
  }[];
  label?: string;
}) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xl">
      {label && (
        <p className="mb-2 text-xs font-semibold text-slate-400">
          {label}
        </p>
      )}

      {payload.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-2 text-sm font-bold text-slate-800"
        >
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{
              backgroundColor: item.color,
            }}
          />

          <span>{item.value}</span>
        </div>
      ))}
    </div>
  );
}

// =====================================================
// DASHBOARD PAGE
// =====================================================

const DashboardPage = () => {
  const data = dashboardData;

  // ===================================================
  // STATISTICS
  // ===================================================

  const stats = [
    {
      id: 1,
      title: "Total Projects",
      value: data.totalProjects,
      description: "Running currently",
      href: "/dashboard/project/dashboard/totalprojects",
      trend: "+12%",
      isPositive: true,
      icon: FolderKanban,
      miniChartType: "area" as const,
      gradient: "from-blue-600 via-indigo-600 to-violet-700",
      bgGlow: "bg-blue-500/15",

      chartData: [
        { v: 2 },
        { v: 4 },
        { v: 3 },
        { v: 5 },
        { v: 4 },
      ],
    },

    {
      id: 2,
      title: "Running Project",
      value: data.runningProjects,
      description: "Currently in progress",
      href: "/dashboard/project/dashboard/running",
      trend: "+0%",
      isPositive: true,
      icon: Activity,
      miniChartType: "area" as const,
      gradient: "from-teal-600 via-cyan-600 to-sky-700",
      bgGlow: "bg-teal-500/15",

      chartData: [
        { v: 3 },
        { v: 4 },
        { v: 5 },
        { v: 4 },
        { v: 6 },
      ],
    },

    {
      id: 3,
      title: "Material Req.",
      value: data.materialRequisitions,
      description: "Pending requisitions",
      href: "/dashboard/project/dashboard/material-requisition",
      trend: "0.0%",
      isPositive: false,
      icon: ListChecks,
      miniChartType: "bar" as const,
      gradient: "from-emerald-600 via-green-600 to-teal-700",
      bgGlow: "bg-emerald-500/15",

      chartData: [
        { v: 0 },
        { v: 0 },
        { v: 0 },
        { v: 0 },
        { v: 0 },
      ],
    },

    {
      id: 4,
      title: "Service Req.",
      value: data.serviceRequisitions,
      description: "Pending service requests",
      href: "/dashboard/project/dashboard/service-work-requisition",
      trend: "0.0%",
      isPositive: false,
      icon: ShieldCheck,
      miniChartType: "bar" as const,
      gradient: "from-fuchsia-600 via-pink-600 to-rose-700",
      bgGlow: "bg-fuchsia-500/15",

      chartData: [
        { v: 0 },
        { v: 0 },
        { v: 0 },
        { v: 0 },
        { v: 0 },
      ],
    },

    {
      id: 5,
      title: "Task",
      value: data.totalTasks,
      description: "Across all projects",
      href: "/dashboard/project/dashboard/",
      trend: "+8.4%",
      isPositive: true,
      icon: ListChecks,
      miniChartType: "bar" as const,
      gradient: "from-orange-600 via-red-600 to-rose-700",
      bgGlow: "bg-orange-500/15",

      chartData: [
        { v: 10 },
        { v: 25 },
        { v: 18 },
        { v: 35 },
        { v: 50 },
      ],
    },

    {
      id: 6,
      title: "Unsold Flat/Land",
      value: data.unsoldFlatLand,
      description: "Available inventory",
      href: "/dashboard/project/dashboard/flat-land",
      trend: "0.0%",
      isPositive: false,
      icon: AlertTriangle,
      miniChartType: "bar" as const,
      gradient: "from-blue-500 via-sky-600 to-indigo-700",
      bgGlow: "bg-blue-500/15",

      chartData: [
        { v: 0 },
        { v: 0 },
        { v: 0 },
        { v: 0 },
        { v: 0 },
      ],
    },
  ];

  // ===================================================
  // RETURN
  // ===================================================

  return (
    <main className="min-h-screen px-4 pb-4">

      {/* =================================================
          HEADER
      ================================================= */}

      <section className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-blue-600">
            <Sparkles className="h-3.5 w-3.5" />

            Enterprise Workspace
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Project Dashboard
          </h1>

          <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-500">
            Real-time analytics, project performance, portfolio
            status, and workflow metrics.
          </p>
        </div>

        <div>
          <div className="inline-flex items-center gap-2 rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-xs font-bold text-emerald-600 shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />

              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>

            All Systems Optimized
          </div>
        </div>
      </section>

      {/* =================================================
          STATISTICS CARDS
      ================================================= */}

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">

        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              href={item.href}
              className="group block"
            >
              <div className="relative min-h-[215px] overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10">

                {/* Glow */}

                <div
                  className={`absolute -right-10 -top-10 h-32 w-32 rounded-full ${item.bgGlow} blur-3xl transition-transform duration-500 group-hover:scale-150`}
                />

                {/* Top */}

                <div className="relative z-10 flex items-start justify-between gap-3">

                  <div className="min-w-0">

                    <p className="truncate text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                      {item.title}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">

                      <h3 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                        {item.value}
                      </h3>

                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${
                          item.isPositive
                            ? "border border-emerald-100 bg-emerald-50 text-emerald-600"
                            : "border border-slate-200 bg-slate-50 text-slate-400"
                        }`}
                      >
                        {item.isPositive ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}

                        {item.trend}
                      </span>
                    </div>

                    <p className="mt-2 text-xs font-medium text-slate-400">
                      {item.description}
                    </p>
                  </div>

                  {/* Icon */}

                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
                  >
                    <Icon className="h-6 w-6 stroke-[2.2]" />
                  </div>
                </div>

                {/* Mini Chart */}

                <div className="relative mt-6 h-12 w-full">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    {item.miniChartType === "area" ? (
                      <AreaChart data={item.chartData}>

                        <defs>
                          <linearGradient
                            id={`miniGradient-${item.id}`}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#38BDF8"
                              stopOpacity={0.45}
                            />

                            <stop
                              offset="100%"
                              stopColor="#38BDF8"
                              stopOpacity={0.02}
                            />
                          </linearGradient>
                        </defs>

                        <Area
                          type="monotone"
                          dataKey="v"
                          stroke="#38BDF8"
                          strokeWidth={2}
                          fill={`url(#miniGradient-${item.id})`}
                        />
                      </AreaChart>
                    ) : (
                      <BarChart data={item.chartData}>
                        <Bar
                          dataKey="v"
                          fill="#38BDF8"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>
            </Link>
          );
        })}
      </section>

      {/* =================================================
          MAIN CHARTS
      ================================================= */}

      <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* =================================================
            PROJECT PORTFOLIO OVERVIEW
        ================================================= */}

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:col-span-2">

          {/* Header */}

          <div className="mb-6 flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Activity className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900">
                Project Portfolio Overview
              </h2>

              <p className="mt-0.5 text-xs text-slate-400">
                Active workflow velocity and distribution
              </p>
            </div>
          </div>

          {/* Chart */}

          <div className="h-[280px] sm:h-[320px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <AreaChart data={data.projectStats}>

                <defs>
                  <linearGradient
                    id="portfolioGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#38BDF8"
                      stopOpacity={0.45}
                    />

                    <stop
                      offset="95%"
                      stopColor="#38BDF8"
                      stopOpacity={0.03}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  tick={{
                    fill: "#94a3b8",
                    fontSize: 10,
                    fontWeight: 500,
                  }}
                  angle={-15}
                  textAnchor="end"
                  height={55}
                  interval={0}
                  axisLine={{
                    stroke: "#e2e8f0",
                  }}
                  tickLine={false}
                />

                <YAxis
                  tick={{
                    fill: "#94a3b8",
                    fontSize: 11,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  content={<CustomTooltip />}
                />

                <Area
                  type="monotone"
                  dataKey="projects"
                  stroke="#38BDF8"
                  strokeWidth={3}
                  fill="url(#portfolioGradient)"
                  dot={{
                    r: 4,
                    fill: "#38BDF8",
                    strokeWidth: 2,
                    stroke: "#ffffff",
                  }}
                  activeDot={{
                    r: 6,
                    fill: "#0EA5E9",
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* =================================================
            PORTFOLIO HEALTH
        ================================================= */}

        <div className="flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

          {/* Header */}

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Layers className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900">
                Portfolio Health
              </h2>

              <p className="mt-0.5 text-xs text-slate-400">
                Current status distribution
              </p>
            </div>
          </div>

          {/* Pie Chart */}

          <div className="relative my-5 h-[210px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>

                <Pie
                  data={data.projectStatus}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={80}
                  paddingAngle={4}
                  cornerRadius={6}
                  stroke="none"
                >
                  {data.projectStatus.map((_, index) => (
                    <Cell
                      key={`status-cell-${index}`}
                      fill={statusColors[index]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  content={<CustomTooltip />}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Value */}

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">

              <span className="text-3xl font-black text-slate-900">
                {data.totalProjects}
              </span>

              <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Active
              </span>
            </div>
          </div>

          {/* Legend */}

          <div className="space-y-2.5 border-t border-slate-100 pt-4">

            {data.projectStatus.map((status, index) => (
              <div
                key={status.name}
                className="flex items-center justify-between"
              >

                <span className="flex items-center gap-2 text-xs font-semibold text-slate-500">

                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor: statusColors[index],
                    }}
                  />

                  {status.name}
                </span>

                <span className="font-mono text-sm font-bold text-slate-900">
                  {status.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================================================
          WORKING & FINANCIAL PROGRESS
      ================================================= */}

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

        {/* Header */}

        <div className="mb-6">

          <h2 className="text-base font-bold text-slate-900">
            Working &amp; Financial Progress
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Financial distribution across active projects
          </p>
        </div>

        {/* Chart */}

        <div className="h-[260px] sm:h-[300px]">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={data.projectStats}
              barSize={32}
            >

              <defs>
                <linearGradient
                  id="financialGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#38BDF8"
                  />

                  <stop
                    offset="100%"
                    stopColor="#2563EB"
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                tick={{
                  fill: "#94a3b8",
                  fontSize: 10,
                  fontWeight: 500,
                }}
                angle={-15}
                textAnchor="end"
                height={55}
                interval={0}
                axisLine={{
                  stroke: "#e2e8f0",
                }}
                tickLine={false}
              />

              <YAxis
                tick={{
                  fill: "#94a3b8",
                  fontSize: 11,
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  fill: "#f0f9ff",
                }}
              />

              <Bar
                dataKey="projects"
                fill="url(#financialGradient)"
                radius={[7, 7, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* =================================================
          RECENT PROJECTS
      ================================================= */}

      <section className="mt-8">

        {/* Section Header */}

        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
              Recent Projects Portfolio
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Interactive project cards with project insights
            </p>
          </div>

          <span className="text-xs font-semibold text-slate-400">
            {data.recentProjects.length} Projects
          </span>
        </div>

        {/* =================================================
            PROJECT LIST
        ================================================= */}

        <div className="grid grid-cols-1 gap-4">

          {data.recentProjects.map((project) => (
            <Link
              key={project.id}
              href={project.href}
              className="group relative block overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 sm:p-5"
            >

              {/* =================================================
                  DESKTOP STATUS RIBBON
              ================================================= */}

              <div className="absolute bottom-0 left-0 top-0 hidden w-11 items-center justify-center bg-gradient-to-b from-green-500 via-green-600 to-emerald-700 sm:flex">

                <span className="rotate-180 text-[10px] font-bold uppercase tracking-[0.14em] text-white [writing-mode:vertical-lr]">
                  {project.status}
                </span>
              </div>

              {/* =================================================
                  MOBILE STATUS
              ================================================= */}

              <div className="mb-4 flex sm:hidden">

                <span className="rounded-full border border-green-100 bg-green-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-green-600">
                  {project.status}
                </span>
              </div>

              {/* =================================================
                  CONTENT
              ================================================= */}

              <div className="grid w-full grid-cols-1 gap-5 sm:pl-2 lg:grid-cols-12">

                {/* =================================================
                    PROJECT INFO
                ================================================= */}

                <div className="space-y-4 lg:col-span-5">

                  {/* Project Name */}

                  <div>
                    <h3 className="flex items-center gap-2 pl-10 text-base font-bold text-blue-600 transition-colors group-hover:text-blue-700 sm:text-lg">

                      {project.name}

                      <ArrowUpRight className="h-4 w-4 shrink-0 text-blue-500 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </h3>
                  </div>

                  {/* Progress Cards */}

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                    {/* Complete */}

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">

                      <div className="mb-2 flex items-center justify-between gap-2">

                        <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          % Complete
                        </span>

                        <span className="text-xs font-bold text-slate-800">
                          {project.progress.toFixed(2)}%
                        </span>
                      </div>

                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">

                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                          style={{
                            width: `${project.progress}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Budget */}

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">

                      <div className="mb-2 flex items-center justify-between gap-2">

                        <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Project Budget
                        </span>

                        <span className="text-xs font-bold text-slate-800">
                          {project.budgetProgress}%
                        </span>
                      </div>

                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">

                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
                          style={{
                            width: `${project.budgetProgress}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* =================================================
                    DURATION + MEMBERS
                ================================================= */}

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1 lg:border-l lg:border-r lg:border-slate-100 lg:px-5">

                  {/* Duration */}

                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 transition-all duration-300 group-hover:border-blue-100 group-hover:bg-blue-50/50">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500 text-white shadow-md shadow-green-500/20">

                      <Calendar className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">

                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Duration
                      </p>

                      <p className="mt-0.5 truncate text-xs font-bold text-slate-800">
                        {project.duration}
                      </p>
                    </div>
                  </div>

                  {/* Members */}

                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 transition-all duration-300 group-hover:border-blue-100 group-hover:bg-blue-50/50">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500 text-white shadow-md shadow-green-500/20">

                      <Users className="h-4 w-4" />
                    </div>

                    <div>

                      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        Team Members
                      </p>

                      <p className="mt-0.5 text-xs font-bold text-slate-800">
                        {project.membersCount} Member
                        {project.membersCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </div>

                {/* =================================================
                    TASKS
                ================================================= */}

                <div className="grid grid-cols-2 gap-3 lg:col-span-3 lg:self-center">

                  {/* Total Tasks */}

                  <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-4 text-center transition-all duration-300 group-hover:border-sky-200">

                    <p className="text-[9px] font-bold uppercase tracking-wider text-sky-500 sm:text-[10px]">
                      Total Tasks
                    </p>

                    <p className="mt-1 text-2xl font-black text-slate-900">
                      {project.totalTasks}
                    </p>
                  </div>

                  {/* Completed */}

                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-center transition-all duration-300 group-hover:border-emerald-200">

                    <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-500 sm:text-[10px]">
                      Completed
                    </p>

                    <p className="mt-1 text-2xl font-black text-slate-900">
                      {project.completedTasks}
                    </p>
                  </div>
                </div>
              </div>

              {/* =================================================
                  HOVER LINE
              ================================================= */}

              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 transition-all duration-500 group-hover:w-full" />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
};

export default DashboardPage;