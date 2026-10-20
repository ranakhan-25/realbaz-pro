"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  Boxes,
  ChevronDown,
  ClipboardList,
  Eye,
  LayoutDashboard,
  MoreVertical,
  Pencil,
  PieChart,
  Search,
  ShoppingCart,
  Trash2,
  Truck,
  Users,
} from "lucide-react";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

/* ============================================================
   TYPES
============================================================ */

type Period = "Today" | "Weekly" | "Monthly" | "Yearly" | "All";

type QuickCardKey =
  | "customers"
  | "suppliers"
  | "materialReq"
  | "serviceReq"
  | "purchases"
  | "sales";

type QuickCardApiData = {
  value: number;
  changePercent: number;
  trend: number[];
};

type PendingApiItem = {
  project: string;
  contact: string;
  addedBy: string;
  date: string;
  reference: string;
  type: string;
};

type PurchaseVsConsumptionPoint = {
  label: string;
  purchase: number;
  consumption: number;
};

type OverflowMaterialRow = {
  sl: number;
  description: string;
  budgetQty: number;
  budgetAmount: number;
  issueQty: number;
  issueAmount: number;
  status: "Pending" | "Approved" | "Issued";
};

type DashboardApiResponse = {
  quickCards: Record<QuickCardKey, QuickCardApiData>;

  purchaseDonut: {
    currentLabel: string;
    previousLabel: string;
    currentPercent: number;
  };

  purchaseVsConsumption: PurchaseVsConsumptionPoint[];

  pendingItems: PendingApiItem[];

  overflowMaterial: OverflowMaterialRow[];
};

/* ============================================================
   CONSTANTS
============================================================ */

const QUICK_CARD_KEYS: QuickCardKey[] = [
  "customers",
  "suppliers",
  "materialReq",
  "serviceReq",
  "purchases",
  "sales",
];

const PERIOD_OPTIONS: Period[] = [
  "Today",
  "Weekly",
  "Monthly",
  "Yearly",
  "All",
];

/* ============================================================
   SAMPLE DATA
============================================================ */

const SAMPLE_QUICK_CARDS: Record<QuickCardKey, QuickCardApiData> = {
  customers: {
    value: 128,
    changePercent: 12,
    trend: [40, 45, 42, 50, 55, 52, 60, 58, 65, 70, 68, 75],
  },

  suppliers: {
    value: 54,
    changePercent: 6,
    trend: [30, 32, 35, 33, 38, 40, 42, 41, 45, 48, 47, 50],
  },

  materialReq: {
    value: 342,
    changePercent: -4,
    trend: [70, 68, 65, 66, 60, 58, 55, 57, 52, 50, 48, 45],
  },

  serviceReq: {
    value: 76,
    changePercent: 15,
    trend: [20, 25, 24, 30, 32, 35, 33, 40, 42, 45, 48, 52],
  },

  purchases: {
    value: 883342,
    changePercent: 18,
    trend: [30, 35, 32, 40, 45, 42, 50, 55, 52, 60, 58, 65],
  },

  sales: {
    value: 153310,
    changePercent: 24,
    trend: [25, 28, 30, 35, 33, 40, 45, 43, 50, 55, 58, 62],
  },
};

const SAMPLE_OVERFLOW_MATERIAL: OverflowMaterialRow[] = [
  {
    sl: 1,
    description: "Cement (OPC 52.5N)",
    budgetQty: 500,
    budgetAmount: 275000,
    issueQty: 560,
    issueAmount: 308000,
    status: "Issued",
  },

  {
    sl: 2,
    description: "MS Rod 20mm",
    budgetQty: 1200,
    budgetAmount: 912000,
    issueQty: 1340,
    issueAmount: 1018400,
    status: "Approved",
  },

  {
    sl: 3,
    description: "Bricks (1st Class)",
    budgetQty: 20000,
    budgetAmount: 240000,
    issueQty: 21500,
    issueAmount: 258000,
    status: "Pending",
  },

  {
    sl: 4,
    description: "Sand (Coarse)",
    budgetQty: 800,
    budgetAmount: 96000,
    issueQty: 850,
    issueAmount: 102000,
    status: "Issued",
  },
];

const SAMPLE_PENDING_ITEMS: PendingApiItem[] = [
  {
    project: "Sheba Eyecon Tower",
    contact: "Mr. Raju raz",
    addedBy: "Admin",
    date: "03-Sept-2026",
    reference: "SaleOffer-5154844",
    type: "Offer",
  },

  {
    project: "Lake Garden",
    contact: "Mr. Raju raz",
    addedBy: "Admin",
    date: "03-Sept-2026",
    reference: "SaleOffer-4181717",
    type: "Offer",
  },

  {
    project: "Sheba Eyecon Tower",
    contact: "Mr. Raju raz",
    addedBy: "Admin",
    date: "03-Sept-2026",
    reference: "SaleOffer-5669922",
    type: "Offer",
  },

  {
    project: "Sheba Eyecon Tower",
    contact: "Mr. Raju raz",
    addedBy: "Admin",
    date: "03-Sept-2026",
    reference: "SaleOffer-8597937",
    type: "Offer",
  },
];

const SAMPLE_PURCHASE_VS_CONSUMPTION: PurchaseVsConsumptionPoint[] = [
  {
    label: "Mar",
    purchase: 420000,
    consumption: 180000,
  },

  {
    label: "Apr",
    purchase: 510000,
    consumption: 240000,
  },

  {
    label: "May",
    purchase: 380000,
    consumption: 300000,
  },

  {
    label: "Jun",
    purchase: 620000,
    consumption: 260000,
  },

  {
    label: "Jul",
    purchase: 540000,
    consumption: 320000,
  },

  {
    label: "Aug",
    purchase: 700000,
    consumption: 410000,
  },
];

/* ============================================================
   DEFAULT DASHBOARD DATA
============================================================ */

function getDefaultDashboardData(): DashboardApiResponse {
  return {
    quickCards: QUICK_CARD_KEYS.reduce(
      (acc, key) => {
        acc[key] = SAMPLE_QUICK_CARDS[key];
        return acc;
      },
      {} as Record<QuickCardKey, QuickCardApiData>,
    ),

    purchaseDonut: {
      currentLabel: "This Month",
      previousLabel: "Last Month",
      currentPercent: 68,
    },

    purchaseVsConsumption: SAMPLE_PURCHASE_VS_CONSUMPTION,

    pendingItems: SAMPLE_PENDING_ITEMS,

    overflowMaterial: SAMPLE_OVERFLOW_MATERIAL,
  };
}

/* ============================================================
   API NORMALIZATION
============================================================ */

function normalizeDashboardResponse(
  raw: Partial<DashboardApiResponse> | null | undefined,
): DashboardApiResponse {
  const fallback = getDefaultDashboardData();

  if (!raw) {
    return fallback;
  }

  const quickCards = QUICK_CARD_KEYS.reduce(
    (acc, key) => {
      const item = raw.quickCards?.[key];
      const sample = fallback.quickCards[key];

      acc[key] = {
        value: typeof item?.value === "number" ? item.value : sample.value,

        changePercent:
          typeof item?.changePercent === "number"
            ? item.changePercent
            : sample.changePercent,

        trend:
          Array.isArray(item?.trend) && item.trend.length > 0
            ? item.trend.map((n) => (typeof n === "number" ? n : 0))
            : sample.trend,
      };

      return acc;
    },
    {} as Record<QuickCardKey, QuickCardApiData>,
  );

  return {
    quickCards,

    purchaseDonut: {
      currentLabel:
        raw.purchaseDonut?.currentLabel ?? fallback.purchaseDonut.currentLabel,

      previousLabel:
        raw.purchaseDonut?.previousLabel ??
        fallback.purchaseDonut.previousLabel,

      currentPercent:
        typeof raw.purchaseDonut?.currentPercent === "number"
          ? raw.purchaseDonut.currentPercent
          : fallback.purchaseDonut.currentPercent,
    },

    purchaseVsConsumption:
      Array.isArray(raw.purchaseVsConsumption) &&
      raw.purchaseVsConsumption.length > 0
        ? raw.purchaseVsConsumption.map((p) => ({
            label: p?.label ?? "",

            purchase: typeof p?.purchase === "number" ? p.purchase : 0,

            consumption: typeof p?.consumption === "number" ? p.consumption : 0,
          }))
        : fallback.purchaseVsConsumption,

    pendingItems: Array.isArray(raw.pendingItems)
      ? raw.pendingItems
      : fallback.pendingItems,

    overflowMaterial: Array.isArray(raw.overflowMaterial)
      ? raw.overflowMaterial.map((m: any, idx: number) => ({
          sl: typeof m?.sl === "number" ? m.sl : idx + 1,
          description: m?.description ?? m?.itemName ?? "Material",
          budgetQty:
            typeof m?.budgetQty === "number"
              ? m.budgetQty
              : typeof m?.excessQty === "number"
                ? m.excessQty
                : 0,
          budgetAmount: typeof m?.budgetAmount === "number" ? m.budgetAmount : 0,
          issueQty: typeof m?.issueQty === "number" ? m.issueQty : 0,
          issueAmount: typeof m?.issueAmount === "number" ? m.issueAmount : 0,
          status:
            m?.status === "Approved" || m?.status === "Issued" || m?.status === "Pending"
              ? m.status
              : "Pending",
        }))
      : fallback.overflowMaterial,
  };
}

/* ============================================================
   API CALL
============================================================ */

async function fetchDashboardData(
  period: Period,
  signal?: AbortSignal,
): Promise<DashboardApiResponse> {
  try {
    const response = await fetch(
      `/api/dashboard?period=${encodeURIComponent(period)}`,
      {
        signal,

        headers: {
          Accept: "application/json",
        },

        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error(`Dashboard API returned status ${response.status}`);
    }

    const json = await response.json();

    return normalizeDashboardResponse(json);
  } catch (error) {
    if ((error as Error).name === "AbortError") {
      throw error;
    }

    console.error("Failed to load dashboard data. Using fallback data.", error);

    return getDefaultDashboardData();
  }
}

/* ============================================================
   PERIOD THEME
============================================================ */

type Accent = {
  donutActive: string;
  donutRest: string;
  barPurchase: string;
  barConsumption: string;
  dotPurchase: string;
  dotConsumption: string;
};

const PERIOD_ACCENTS: Record<Period, Accent> = {
  Today: {
    donutActive: "#3b82f6",
    donutRest: "#bfdbfe",
    barPurchase: "bg-blue-500",
    barConsumption: "bg-sky-300",
    dotPurchase: "bg-blue-500",
    dotConsumption: "bg-sky-300",
  },

  Weekly: {
    donutActive: "#10b981",
    donutRest: "#a7f3d0",
    barPurchase: "bg-emerald-500",
    barConsumption: "bg-teal-300",
    dotPurchase: "bg-emerald-500",
    dotConsumption: "bg-teal-300",
  },

  Monthly: {
    donutActive: "#f97316",
    donutRest: "#fed7aa",
    barPurchase: "bg-orange-400",
    barConsumption: "bg-blue-500",
    dotPurchase: "bg-orange-400",
    dotConsumption: "bg-blue-500",
  },

  Yearly: {
    donutActive: "#8b5cf6",
    donutRest: "#ddd6fe",
    barPurchase: "bg-violet-500",
    barConsumption: "bg-fuchsia-300",
    dotPurchase: "bg-violet-500",
    dotConsumption: "bg-fuchsia-300",
  },

  All: {
    donutActive: "#64748b",
    donutRest: "#e2e8f0",
    barPurchase: "bg-slate-500",
    barConsumption: "bg-slate-300",
    dotPurchase: "bg-slate-500",
    dotConsumption: "bg-slate-300",
  },
};

const PERIOD_COMPARISON_LABEL: Record<Period, string> = {
  Today: "day",
  Weekly: "week",
  Monthly: "month",
  Yearly: "year",
  All: "period",
};

/* ============================================================
   QUICK CARD CONFIG
============================================================ */

type QuickCardConfig = {
  key: QuickCardKey;
  title: string;
  icon: React.ElementType;
  cardBg: string;
  iconBg: string;
  iconColor: string;
  sparklineColor: string;
  href: string;
};

const QUICK_CARDS_CONFIG: QuickCardConfig[] = [
  {
    key: "customers",
    title: "Customer's",
    icon: Users,
    cardBg: "bg-blue-50 dark:bg-blue-500/10",
    iconBg: "bg-blue-100 dark:bg-blue-500/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    sparklineColor: "#2563eb",
    href: "/dashboard/accounts/contract/customer-account",
  },

  {
    key: "suppliers",
    title: "Supplier's",
    icon: Truck,
    cardBg: "bg-cyan-50 dark:bg-cyan-500/10",
    iconBg: "bg-cyan-100 dark:bg-cyan-500/20",
    iconColor: "text-cyan-600 dark:text-cyan-400",
    sparklineColor: "#0891b2",
    href: "/dashboard/inventory/contracts/supplier-accounts",
  },

  {
    key: "materialReq",
    title: "Material Req.",
    icon: Boxes,
    cardBg: "bg-emerald-50 dark:bg-emerald-500/10",
    iconBg: "bg-emerald-100 dark:bg-emerald-500/20",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    sparklineColor: "#059669",
    href: "/dashboard/inventory/material-requisition",
  },

  {
    key: "serviceReq",
    title: "Service Req.",
    icon: ClipboardList,
    cardBg: "bg-fuchsia-50 dark:bg-fuchsia-500/10",
    iconBg: "bg-fuchsia-100 dark:bg-fuchsia-500/20",
    iconColor: "text-fuchsia-600 dark:text-fuchsia-400",
    sparklineColor: "#c026d3",
    href: "/dashboard/project/requisition/service-work-requisition",
  },

  {
    key: "purchases",
    title: "Purchases",
    icon: ShoppingCart,
    cardBg: "bg-orange-50 dark:bg-orange-500/10",
    iconBg: "bg-orange-100 dark:bg-orange-500/20",
    iconColor: "text-orange-600 dark:text-orange-400",
    sparklineColor: "#ea580c",
    href: "/dashboard/inventory/purchase/purchase-list",
  },

  {
    key: "sales",
    title: "Sales",
    icon: BarChart3,
    cardBg: "bg-sky-50 dark:bg-sky-500/10",
    iconBg: "bg-sky-100 dark:bg-sky-500/20",
    iconColor: "text-sky-600 dark:text-sky-400",
    sparklineColor: "#0284c7",
    href: "/dashboard/inventory/sales",
  },
];

/* ============================================================
   SPARKLINE
============================================================ */

function buildSparklinePaths(trend: number[], width = 100, height = 28) {
  const raw = trend.length > 0 ? trend : [0, 0];

  const values = raw.length > 1 ? raw : [raw[0], raw[0]];

  const max = Math.max(...values, 1);

  const min = Math.min(...values, 0);

  const range = max - min || 1;

  const step = width / (values.length - 1);

  const points = values.map((value, index) => ({
    x: index * step,

    y: height - ((value - min) / range) * (height - 4) - 2,
  }));

  let line = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;

  for (let index = 0; index < points.length - 1; index++) {
    const p0 = points[index === 0 ? index : index - 1];

    const p1 = points[index];

    const p2 = points[index + 1];

    const p3 = points[index + 2 < points.length ? index + 2 : index + 1];

    const cp1x = p1.x + (p2.x - p0.x) / 6;

    const cp1y = p1.y + (p2.y - p0.y) / 6;

    const cp2x = p2.x - (p3.x - p1.x) / 6;

    const cp2y = p2.y - (p3.y - p1.y) / 6;

    line += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(
      1,
    )} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }

  const area = `${line} L ${points[points.length - 1].x.toFixed(
    1,
  )} ${height} L ${points[0].x.toFixed(1)} ${height} Z`;

  return {
    line,
    area,
  };
}

/* ============================================================
   CARD HEADER
============================================================ */

function CardHeader({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  subtitle,
  action,
  onAction,
}: {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle?: string;
  action?: "menu" | "viewAll";
  onAction?: () => void;
}) {
  return (
    <div className="mb-4 flex items-start justify-between">
      <div className="flex items-center gap-2.5">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconBg}`}
        >
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>

          {subtitle && (
            <p className="text-[10px] text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>

      {action === "menu" && (
        <button
          type="button"
          onClick={onAction}
          className="text-muted-foreground transition hover:text-foreground"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      )}

      {action === "viewAll" && (
        <button
          type="button"
          onClick={onAction}
          className="flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
        >
          View All
          <ArrowUpRight className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

/* ============================================================
   QUICK CARD
============================================================ */

function QuickCardItem({
  config,
  data,
  periodLabel,
  isLoading,
  onNavigate,
}: {
  config: QuickCardConfig;
  data: QuickCardApiData;
  periodLabel: string;
  isLoading: boolean;
  onNavigate: (href: string) => void;
}) {
  const Icon = config.icon;

  const isPositive = data.changePercent >= 0;

  const gradientId = `spark-${config.key}`;

  const { line, area } = useMemo(
    () => buildSparklinePaths(data.trend),
    [data.trend],
  );

  return (
    <a
      href={config.href}
      onClick={(event) => {
        event.preventDefault();

        onNavigate(config.href);
      }}
      className={`
        group relative flex w-full cursor-pointer
        flex-col overflow-hidden rounded
        border border-border/60
        ${config.cardBg}
        p-4 text-left shadow-sm
        transition-all duration-200
        hover:-translate-y-0.5
        hover:shadow-lg
        focus:outline-none
        focus:ring-2
        focus:ring-ring
      `}
    >
      <div className="flex items-center justify-between">
        <div
          className={`
            flex h-10 w-10
            items-center justify-center
            rounded-full
            ${config.iconBg}
          `}
        >
          <Icon className={`h-5 w-5 ${config.iconColor}`} />
        </div>

        <span
          className={`
            flex items-center gap-0.5
            rounded-full px-1.5 py-0.5
            text-[10px] font-semibold
            ${
              isPositive
                ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
                : "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400"
            }
          `}
        >
          {isPositive ? (
            <ArrowUpRight className="h-3 w-3" />
          ) : (
            <ArrowDownRight className="h-3 w-3" />
          )}

          {isLoading ? "…" : `${Math.abs(data?.changePercent ?? 0)}%`}
        </span>
      </div>

      <div className="mt-3">
        <p className="text-[11px] font-medium text-muted-foreground">
          {config.title}
        </p>

        <p className="mt-0.5 text-2xl font-bold tracking-tight text-foreground">
          {isLoading ? "…" : (data?.value ?? 0).toLocaleString()}
        </p>

        <p className="mt-0.5 text-[10px] text-muted-foreground">
          vs last {periodLabel}
        </p>
      </div>

      <svg
        viewBox="0 0 100 28"
        preserveAspectRatio="none"
        className="mt-2 h-8 w-full"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor={config.sparklineColor}
              stopOpacity={0.35}
            />

            <stop
              offset="100%"
              stopColor={config.sparklineColor}
              stopOpacity={0}
            />
          </linearGradient>
        </defs>

        <path
          d={area}
          fill={`url(#${gradientId})`}
          opacity={isLoading ? 0.3 : 1}
        />

        <path
          d={line}
          fill="none"
          stroke={config.sparklineColor}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={isLoading ? 0.35 : 1}
        />
      </svg>

      <span
        className="
          pointer-events-none absolute right-3
          top-3 flex h-6 w-6
          items-center justify-center
          rounded-md bg-card/60
          text-muted-foreground
          opacity-0 transition-all
          duration-200
          group-hover:opacity-100
        "
      >
        <ArrowUpRight className="h-3 w-3" />
      </span>
    </a>
  );
}

/* ============================================================
   PURCHASE DONUT
============================================================ */

function PurchaseDonut({
  currentPercent,
  currentLabel,
  previousLabel,
  accent,
  isLoading,
}: {
  currentPercent: number;
  currentLabel: string;
  previousLabel: string;
  accent: Accent;
  isLoading: boolean;
}) {
  const safePercent = Math.min(Math.max(currentPercent, 0), 100);

  const previousPercent = 100 - safePercent;

  const size = 168;

  const strokeWidth = 16;

  const radius = (size - strokeWidth) / 2;

  const circumference = 2 * Math.PI * radius;

  const dashOffset =
    circumference - (isLoading ? 0 : safePercent / 100) * circumference;

  const gradientId = "purchase-donut-gradient";

  return (
    <div className="flex flex-col items-center py-2">
      <div
        className="relative"
        style={{
          width: size,
          height: size,
        }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop
                offset="0%"
                stopColor={accent.donutActive}
                stopOpacity={0.75}
              />

              <stop
                offset="100%"
                stopColor={accent.donutActive}
                stopOpacity={1}
              />
            </linearGradient>
          </defs>

          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={accent.donutRest}
            strokeWidth={strokeWidth}
          />

          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="transition-[stroke-dashoffset] duration-700 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-3xl font-bold text-foreground">
            {isLoading ? "…" : `${safePercent}%`}
          </p>

          <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">
            Purchase share
          </p>

          <p className="text-[9px] text-muted-foreground">Last 12 Months</p>
        </div>
      </div>

      <div className="mt-4 grid w-full grid-cols-2 gap-2">
        <div className="rounded-lg border border-border bg-background/60 px-3 py-2">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <span className={`h-2 w-2 rounded-full ${accent.dotPurchase}`} />

            {currentLabel}
          </div>

          <p className="mt-1 text-sm font-semibold text-foreground">
            {isLoading ? "…" : `${safePercent}%`}
          </p>
        </div>

        <div className="rounded-lg border border-border bg-background/60 px-3 py-2">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <span className={`h-2 w-2 rounded-full ${accent.dotConsumption}`} />

            {previousLabel}
          </div>

          <p className="mt-1 text-sm font-semibold text-foreground">
            {isLoading ? "…" : `${previousPercent}%`}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PURCHASE VS CONSUMPTION
============================================================ */

function PurchaseConsumptionChart({
  points,
  accent,
  isLoading,
}: {
  points: PurchaseVsConsumptionPoint[];
  accent: Accent;
  isLoading: boolean;
}) {
  const safePoints =
    points.length > 0
      ? points
      : [
          {
            label: "N/A",
            purchase: 0,
            consumption: 0,
          },
          {
            label: "N/A",
            purchase: 0,
            consumption: 0,
          },
        ];

  const maxValue = Math.max(
    ...safePoints.flatMap((point) => [point.purchase, point.consumption]),
    1,
  );

  const [hovered, setHovered] = useState<{
    idx: number;
    series: "purchase" | "consumption";
  } | null>(null);

  const yTicks = [1, 0.75, 0.5, 0.25, 0].map((factor) =>
    Math.round(maxValue * factor),
  );

  return (
    <div className="mt-3 w-full overflow-hidden">
      <div className="w-full overflow-x-auto pb-2">
        <div className="min-w-[340px]">
          <div className="flex h-44 gap-2">
            <div className="flex h-full w-12 shrink-0 flex-col justify-between pb-6 text-right text-[9px] text-muted-foreground">
              {yTicks.map((tick, index) => (
                <span key={index}>{tick.toLocaleString()}</span>
              ))}
            </div>

            <div className="relative flex flex-1 items-end gap-3 px-2 sm:gap-6">
              <div className="pointer-events-none absolute inset-x-0 bottom-6 top-0 flex flex-col justify-between">
                {yTicks.map((_, index) => (
                  <div
                    key={index}
                    className="border-t border-dashed border-border/70"
                  />
                ))}
              </div>

              {safePoints.map((point, index) => (
                <div
                  key={index}
                  className="relative z-10 flex h-full min-w-8 flex-1 items-end justify-center gap-1.5 pb-6 sm:gap-2"
                >
                  {/* Purchase */}

                  <div className="relative flex h-full w-4 flex-col justify-end sm:w-8">
                    {hovered?.idx === index &&
                      hovered.series === "purchase" && (
                        <div className="absolute -top-9 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-[10px] font-medium text-popover-foreground shadow-lg">
                          {point.label}: {(point.purchase ?? 0).toLocaleString()}
                        </div>
                      )}

                    <div
                      onMouseEnter={() =>
                        setHovered({
                          idx: index,
                          series: "purchase",
                        })
                      }
                      onMouseLeave={() => setHovered(null)}
                      className={`
                          w-full cursor-default
                          rounded-t-md
                          transition-all duration-500
                          ${accent.barPurchase}
                          ${
                            hovered?.idx === index &&
                            hovered.series === "purchase"
                              ? "opacity-75"
                              : ""
                          }
                        `}
                      style={{
                        height: `${
                          isLoading
                            ? 0
                            : Math.max(
                                (point.purchase / maxValue) * 100,
                                point.purchase > 0 ? 3 : 0,
                              )
                        }%`,
                      }}
                    />
                  </div>

                  {/* Consumption */}

                  <div className="relative flex h-full w-4 flex-col justify-end sm:w-8">
                    {hovered?.idx === index &&
                      hovered.series === "consumption" && (
                        <div className="absolute -top-9 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-[10px] font-medium text-popover-foreground shadow-lg">
                          {point.label}: {(point.consumption ?? 0).toLocaleString()}
                        </div>
                      )}

                    <div
                      onMouseEnter={() =>
                        setHovered({
                          idx: index,
                          series: "consumption",
                        })
                      }
                      onMouseLeave={() => setHovered(null)}
                      className={`
                          w-full cursor-default
                          rounded-t-md
                          transition-all duration-500
                          ${accent.barConsumption}
                          ${
                            hovered?.idx === index &&
                            hovered.series === "consumption"
                              ? "opacity-75"
                              : ""
                          }
                        `}
                      style={{
                        height: `${
                          isLoading
                            ? 0
                            : Math.max(
                                (point.consumption / maxValue) * 100,
                                point.consumption > 0 ? 3 : 0,
                              )
                        }%`,
                      }}
                    />
                  </div>

                  <span className="absolute bottom-0 left-1/2 w-full -translate-x-1/2 truncate text-center text-[9px] text-muted-foreground">
                    {point.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex justify-center gap-5 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <span className={`h-2 w-2 rounded-sm ${accent.dotPurchase}`} />
          Purchase
        </div>

        <div className="flex items-center gap-1">
          <span className={`h-2 w-2 rounded-sm ${accent.dotConsumption}`} />
          Consumption
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   STATUS BADGE
============================================================ */

function StatusBadge({ status }: { status: OverflowMaterialRow["status"] }) {
  const styles: Record<OverflowMaterialRow["status"], string> = {
    Issued:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",

    Approved:
      "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",

    Pending:
      "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
  };

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

/* ============================================================
   OVERFLOW MATERIAL TABLE
============================================================ */

function OverflowMaterialTable({
  rows,
  isLoading,
  onView,
  onUpdate,
  onDelete,
}: {
  rows: OverflowMaterialRow[];
  isLoading: boolean;
  onView: (row: OverflowMaterialRow) => void;
  onUpdate: (row: OverflowMaterialRow) => void;
  onDelete: (row: OverflowMaterialRow) => void;
}) {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] border-collapse">
          <thead>
            <tr className="bg-primary/10 text-[9px] uppercase text-muted-foreground">
              <th className="px-3 py-2 text-left">SL</th>

              <th className="px-3 py-2 text-left">Description</th>

              <th className="px-3 py-2 text-right">Budget Qty</th>

              <th className="px-3 py-2 text-right">Budget Amount</th>

              <th className="px-3 py-2 text-right">Issue Qty</th>

              <th className="px-3 py-2 text-right">Issue Amount</th>

              <th className="px-3 py-2 text-left">Status</th>

              <th className="px-3 py-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading && (
              <tr>
                <td
                  colSpan={8}
                  className="h-24 text-center text-xs text-muted-foreground"
                >
                  Loading…
                </td>
              </tr>
            )}

            {!isLoading && rows.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="h-24 text-center text-xs text-muted-foreground"
                >
                  No data available in table
                </td>
              </tr>
            )}

            {!isLoading &&
              rows.map((row) => (
                <tr
                  key={row.sl}
                  className="
                    border-b border-border/60
                    text-[11px]
                    last:border-none
                    hover:bg-muted/40
                  "
                >
                  <td className="px-3 py-2 text-foreground">{row.sl}</td>

                  <td className="px-3 py-2 font-medium text-foreground">
                    {row.description}
                  </td>

                  <td className="px-3 py-2 text-right text-muted-foreground">
                    {(row.budgetQty ?? 0).toLocaleString()}
                  </td>

                  <td className="px-3 py-2 text-right text-muted-foreground">
                    ৳{(row.budgetAmount ?? 0).toLocaleString()}
                  </td>

                  <td className="px-3 py-2 text-right text-muted-foreground">
                    {(row.issueQty ?? 0).toLocaleString()}
                  </td>

                  <td className="px-3 py-2 text-right text-muted-foreground">
                    ৳{(row.issueAmount ?? 0).toLocaleString()}
                  </td>

                  <td className="px-3 py-2">
                    <StatusBadge status={row.status} />
                  </td>

                  <td className="px-3 py-2">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        title="View"
                        onClick={() => onView(row)}
                        className="
                          flex h-7 w-7
                          items-center justify-center
                          rounded-md border
                          border-border
                          text-muted-foreground
                          transition
                          hover:border-primary/40
                          hover:bg-primary/10
                          hover:text-primary
                        "
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        title="Update"
                        onClick={() => onUpdate(row)}
                        className="
                          flex h-7 w-7
                          items-center justify-center
                          rounded-md border
                          border-border
                          text-muted-foreground
                          transition
                          hover:border-blue-400/40
                          hover:bg-blue-500/10
                          hover:text-blue-500
                        "
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        title="Delete"
                        onClick={() => onDelete(row)}
                        className="
                          flex h-7 w-7
                          items-center justify-center
                          rounded-md border
                          border-border
                          text-muted-foreground
                          transition
                          hover:border-red-400/40
                          hover:bg-red-500/10
                          hover:text-red-500
                        "
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center justify-between text-[9px] text-muted-foreground">
        <span>
          Showing {rows.length === 0 ? 0 : 1} to {rows.length} of {rows.length}{" "}
          entries
        </span>

        <div className="flex items-center gap-3">
          <button
            type="button"
            title="Previous"
            className="hover:text-foreground"
          >
            <ChevronDown className="h-3 w-3 rotate-90" />
          </button>

          <button type="button" title="Next" className="hover:text-foreground">
            <ChevronDown className="h-3 w-3 -rotate-90" />
          </button>
        </div>
      </div>
    </>
  );
}

/* ============================================================
   PENDING PANEL
============================================================ */

function PendingPanel({
  period,
  onPeriodChange,
  items,
  isLoading,
  onView,
  onUpdate,
  onDelete,
}: {
  period: Period;
  onPeriodChange: (period: Period) => void;
  items: PendingApiItem[];
  isLoading: boolean;
  onView: (item: PendingApiItem) => void;
  onUpdate: (item: PendingApiItem) => void;
  onDelete: (item: PendingApiItem) => void;
}) {
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return items;
    }

    return items.filter((item) =>
      [
        item.project,
        item.contact,
        item.addedBy,
        item.reference,
        item.type,
        item.date,
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [items, search]);

  return (
    <div className="flex h-full min-h-[580px] flex-col rounded-xl border border-border bg-card shadow-sm">
      {/* Header */}

      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-500/15">
              <Bell className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Pending Voucher/Invoice
              </h2>

              <p className="text-[10px] text-muted-foreground">
                Pending approval items
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => console.log("View all pending items")}
            className="flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
          >
            View All
            <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>

        {/* Period */}

        <div className="mt-4 flex items-center gap-1 rounded-lg bg-muted p-1">
          {PERIOD_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onPeriodChange(option)}
              className={`
                  flex-1 rounded-md
                  px-1 py-1.5
                  text-[9px] font-medium
                  transition
                  ${
                    option === period
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-background hover:text-foreground"
                  }
                `}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Search */}

        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search with Project/Code/Reference..."
            className="
              h-8 w-full rounded-md
              border border-input
              bg-background
              pl-8 pr-3
              text-[10px]
              text-foreground
              outline-none
              placeholder:text-muted-foreground
              focus:ring-2
              focus:ring-ring
            "
          />
        </div>
      </div>

      {/* Items */}

      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {isLoading && (
          <p className="p-4 text-center text-[10px] text-muted-foreground">
            Loading…
          </p>
        )}

        {!isLoading && filteredItems.length === 0 && (
          <p className="p-4 text-center text-[10px] text-muted-foreground">
            No pending items found.
          </p>
        )}

        {!isLoading &&
          filteredItems.map((item) => (
            <div
              key={item.reference}
              className="
                  group rounded-lg
                  border border-border
                  bg-background p-3
                  transition-all
                  hover:border-primary/40
                  hover:shadow-sm
                "
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <p className="text-[10px] font-semibold text-muted-foreground">
                    Reference
                  </p>

                  <p className="truncate text-[10px] text-foreground">
                    Project: <span className="font-medium">{item.project}</span>
                  </p>

                  <p className="text-[10px] text-muted-foreground">
                    Contact: {item.contact}
                  </p>

                  <p className="text-[10px] text-muted-foreground">
                    Added By: {item.addedBy}
                  </p>

                  <p className="text-[9px] text-muted-foreground">
                    {item.date}
                  </p>
                </div>

                <div className="flex shrink-0 flex-col items-end">
                  <span className="rounded bg-orange-100 px-2 py-1 text-[9px] font-semibold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                    {item.type}
                  </span>

                  <p className="mt-2 max-w-[120px] truncate text-[9px] font-medium text-muted-foreground">
                    {item.reference}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2">
                <p className="text-[9px] font-medium text-red-500">
                  Approval Layer has not been set yet.
                </p>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    title="View"
                    onClick={() => onView(item)}
                    className="
                        flex h-7 w-7
                        items-center
                        justify-center
                        rounded-md
                        border border-border
                        text-muted-foreground
                        transition
                        hover:border-primary/40
                        hover:bg-primary/10
                        hover:text-primary
                      "
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    title="Update"
                    onClick={() => onUpdate(item)}
                    className="
                        flex h-7 w-7
                        items-center
                        justify-center
                        rounded-md
                        border border-border
                        text-muted-foreground
                        transition
                        hover:border-blue-400/40
                        hover:bg-blue-500/10
                        hover:text-blue-500
                      "
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    title="Delete"
                    onClick={() => onDelete(item)}
                    className="
                        flex h-7 w-7
                        items-center
                        justify-center
                        rounded-md
                        border border-border
                        text-muted-foreground
                        transition
                        hover:border-red-400/40
                        hover:bg-red-500/10
                        hover:text-red-500
                      "
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Footer */}

      <div className="border-t border-border px-4 py-2">
        <div className="flex items-center justify-between text-[9px] text-muted-foreground">
          <span>
            Showing {filteredItems.length} of {items.length} entries
          </span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              title="Previous"
              className="hover:text-foreground"
            >
              <ChevronDown className="h-3 w-3 rotate-90" />
            </button>

            <button
              type="button"
              title="Next"
              className="hover:text-foreground"
            >
              <ChevronDown className="h-3 w-3 -rotate-90" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PERIOD DROPDOWN
============================================================ */

function PeriodDropdown({
  period,
  onChange,
}: {
  period: Period;
  onChange: (period: Period) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="
          flex items-center gap-2
          rounded-lg
          border border-input
          bg-card
          px-3 py-2
          text-xs font-medium
          text-foreground
          shadow-sm
          hover:bg-muted
        "
      >
        {period} view
        <ChevronDown
          className={`
            h-3.5 w-3.5
            text-muted-foreground
            transition-transform
            ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-1 w-36 overflow-hidden rounded-lg border border-border bg-popover shadow-lg">
          {PERIOD_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={`
                  block w-full
                  px-3 py-2
                  text-left text-xs
                  transition
                  ${
                    option === period
                      ? "bg-primary text-primary-foreground"
                      : "text-popover-foreground hover:bg-muted"
                  }
                `}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   MAIN DASHBOARD
============================================================ */

export default function InventoryDashboard() {
  const router = useRouter();

  const [period, setPeriod] = useState<Period>("Today");

  const [data, setData] = useState<DashboardApiResponse>(
    getDefaultDashboardData(),
  );

  /*
   * IMPORTANT:
   * false রাখছি যাতে initial sample data immediately show করে।
   */
  const [isLoading, setIsLoading] = useState(false);

  /* ==========================================================
     LOAD DATA
  ========================================================== */

  const loadData = useCallback(
    async (selectedPeriod: Period, signal?: AbortSignal) => {
      setIsLoading(true);

      try {
        const result = await fetchDashboardData(selectedPeriod, signal);

        /*
         * পুরোনো request abort হলে
         * data update করবে না।
         */
        if (!signal?.aborted) {
          setData(result);
        }
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Dashboard loading error:", error);

          if (!signal?.aborted) {
            setData(getDefaultDashboardData());
          }
        }
      } finally {
        /*
         * Abort হওয়ার পরে নতুন request-এর
         * loading state false করবে না।
         */
        if (!signal?.aborted) {
          setIsLoading(false);
        }
      }
    },
    [],
  );

  /* ==========================================================
     FETCH WHEN PERIOD CHANGES
  ========================================================== */

  useEffect(() => {
    const controller = new AbortController();

    loadData(period, controller.signal);

    return () => {
      controller.abort();
    };
  }, [period, loadData]);

  /* ==========================================================
     THEME
  ========================================================== */

  const accent = PERIOD_ACCENTS[period];

  const periodLabel = PERIOD_COMPARISON_LABEL[period];

  /* ==========================================================
     NAVIGATION
  ========================================================== */

  const handleNavigate = useCallback(
    (href: string) => {
      router.push(href);
    },
    [router],
  );

  /* ==========================================================
     PENDING ACTIONS
  ========================================================== */

  const handleViewPending = useCallback(
    (item: PendingApiItem) => {
      console.log("View pending item:", item);

      router.push(`/inventory/pending/${encodeURIComponent(item.reference)}`);
    },
    [router],
  );

  const handleUpdatePending = useCallback(
    (item: PendingApiItem) => {
      console.log("Update pending item:", item);

      router.push(
        `/inventory/pending/${encodeURIComponent(item.reference)}/edit`,
      );
    },
    [router],
  );

  const handleDeletePending = useCallback((item: PendingApiItem) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${item.reference}?`,
    );

    if (!confirmed) {
      return;
    }

    console.log("Delete pending item:", item);
  }, []);

  /* ==========================================================
     OVERFLOW MATERIAL ACTIONS
  ========================================================== */

  const handleViewOverflow = useCallback(
    (row: OverflowMaterialRow) => {
      console.log("View overflow material:", row);

      router.push("/dashboard/inventory/adjustment/material-usage");
    },
    [router],
  );

  const handleUpdateOverflow = useCallback(
    (row: OverflowMaterialRow) => {
      console.log("Update overflow material:", row);

      router.push("/dashboard/inventory/adjustment/material-usage");
    },
    [router],
  );

  const handleDeleteOverflow = useCallback((row: OverflowMaterialRow) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${row.description}"?`,
    );

    if (!confirmed) {
      return;
    }

    console.log("Delete overflow material:", row);
  }, []);

  /* ==========================================================
     HEADER ACTIONS
  ========================================================== */

  const handleViewAllOverflow = useCallback(() => {
    router.push("/dashboard/inventory/adjustment/material-usage");
  }, [router]);

  const handlePurchaseMenu = useCallback(() => {
    console.log("Purchase chart menu");
  }, []);

  const handleConsumptionMenu = useCallback(() => {
    console.log("Purchase vs Consumption menu");
  }, []);

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="space-y-5 p-2 md:p-3">
        {/* ====================================================
            PAGE HEADER
        ==================================================== */}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <LayoutDashboard className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-lg font-bold text-foreground">
                Inventory Dashboard
              </h1>

              <p className="text-[11px] text-muted-foreground">
                Overview of inventory activities and key metrics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <PeriodDropdown period={period} onChange={setPeriod} />
          </div>
        </div>

        {/* ====================================================
            QUICK CARDS
        ==================================================== */}

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {QUICK_CARDS_CONFIG.map((config) => (
            <QuickCardItem
              key={config.key}
              config={config}
              data={data.quickCards[config.key]}
              periodLabel={periodLabel}
              isLoading={isLoading}
              onNavigate={handleNavigate}
            />
          ))}
        </div>

        {/* ====================================================
            MAIN DASHBOARD
        ==================================================== */}

        <div className="space-y-5">
          {/* ==================================================
              CHARTS
          ================================================== */}

          <div className="grid gap-4 md:grid-cols-2">
            {/* Purchase */}

            <div className="rounded border border-border bg-card p-4 shadow-sm">
              <CardHeader
                icon={PieChart}
                iconBg="bg-orange-100 dark:bg-orange-500/15"
                iconColor="text-orange-600 dark:text-orange-400"
                title="Purchase"
                subtitle="Last 12 Months"
                action="menu"
                onAction={handlePurchaseMenu}
              />

              <PurchaseDonut
                currentPercent={data.purchaseDonut.currentPercent}
                currentLabel={data.purchaseDonut.currentLabel}
                previousLabel={data.purchaseDonut.previousLabel}
                accent={accent}
                isLoading={isLoading}
              />
            </div>

            {/* Purchase vs Consumption */}

            <div className="rounded border border-border bg-card p-4 shadow-sm">
              <CardHeader
                icon={BarChart3}
                iconBg="bg-sky-100 dark:bg-sky-500/15"
                iconColor="text-sky-600 dark:text-sky-400"
                title="Purchase vs Consumption"
                action="menu"
                onAction={handleConsumptionMenu}
              />

              <PurchaseConsumptionChart
                points={data.purchaseVsConsumption}
                accent={accent}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* ==================================================
              OVERFLOW MATERIAL
          ================================================== */}

          <div className="rounded border border-border bg-card p-4 shadow-sm">
            <CardHeader
              icon={Boxes}
              iconBg="bg-emerald-100 dark:bg-emerald-500/15"
              iconColor="text-emerald-600 dark:text-emerald-400"
              title="Overflow Material"
              action="viewAll"
              onAction={handleViewAllOverflow}
            />

            <OverflowMaterialTable
              rows={data.overflowMaterial}
              isLoading={isLoading}
              onView={handleViewOverflow}
              onUpdate={handleUpdateOverflow}
              onDelete={handleDeleteOverflow}
            />
          </div>
        </div>

        {/* ====================================================
            PENDING VOUCHER / INVOICE
        ==================================================== */}

        <section>
          <div className="min-w-0">
            <PendingPanel
              period={period}
              onPeriodChange={setPeriod}
              items={data.pendingItems}
              isLoading={isLoading}
              onView={handleViewPending}
              onUpdate={handleUpdatePending}
              onDelete={handleDeletePending}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
