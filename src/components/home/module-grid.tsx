"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  LandPlot,
  ClipboardList,
  UserRound,
  Users2,
  Receipt,
  Boxes,
  Wallet,
  Users,
  Package,
  Truck,
  HeadphonesIcon,
  BarChart3,
  FileSpreadsheet,
  Shield,
  FileText,
  Check,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/lib/language";
import { useTheme } from "@/lib/theme";
import { useRouter } from "next/navigation";

interface ModuleConfig {
  key: string;
  icon: LucideIcon;
  iconBg: string;
  iconFg: string;
  cardBg: string;
  hoverBorder: string;
}

const MODULES: ModuleConfig[] = [
  {
    key: "landAcquisition",
    icon: LandPlot,
    iconBg: "bg-orange-100 dark:bg-orange-950/60",
    iconFg: "text-orange-600 dark:text-orange-400",
    cardBg: "bg-orange-50 dark:bg-orange-950/30",
    hoverBorder: "hover:border-orange-400/80 dark:hover:border-orange-500/80",
  },
  {
    key: "projectManagement",
    icon: ClipboardList,
    iconBg: "bg-blue-100 dark:bg-blue-950/60",
    iconFg: "text-blue-600 dark:text-blue-400",
    cardBg: "bg-blue-50 dark:bg-blue-950/30",
    hoverBorder: "hover:border-blue-400/80 dark:hover:border-blue-500/80",
  },
  {
    key: "crm",
    icon: UserRound,
    iconBg: "bg-sky-100 dark:bg-sky-950/60",
    iconFg: "text-sky-600 dark:text-sky-400",
    cardBg: "bg-sky-50 dark:bg-sky-950/30",
    hoverBorder: "hover:border-sky-400/80 dark:hover:border-sky-500/80",
  },
  {
    key: "salesCustomer",
    icon: Users2,
    iconBg: "bg-teal-100 dark:bg-teal-950/60",
    iconFg: "text-teal-600 dark:text-teal-400",
    cardBg: "bg-teal-50 dark:bg-teal-950/30",
    hoverBorder: "hover:border-teal-400/80 dark:hover:border-teal-500/80",
  },
  {
    key: "creditRealization",
    icon: Receipt,
    iconBg: "bg-pink-100 dark:bg-pink-950/60",
    iconFg: "text-pink-600 dark:text-pink-400",
    cardBg: "bg-pink-50 dark:bg-pink-950/30",
    hoverBorder: "hover:border-pink-400/80 dark:hover:border-pink-500/80",
  },
  {
    key: "materialsProcurement",
    icon: Boxes,
    iconBg: "bg-green-100 dark:bg-green-950/60",
    iconFg: "text-green-600 dark:text-green-400",
    cardBg: "bg-green-50 dark:bg-green-950/30",
    hoverBorder: "hover:border-green-400/80 dark:hover:border-green-500/80",
  },
  {
    key: "accountsFinance",
    icon: Wallet,
    iconBg: "bg-amber-100 dark:bg-amber-950/60",
    iconFg: "text-amber-600 dark:text-amber-400",
    cardBg: "bg-amber-50 dark:bg-amber-950/30",
    hoverBorder: "hover:border-amber-400/80 dark:hover:border-amber-500/80",
  },
  {
    key: "hrPayroll",
    icon: Users,
    iconBg: "bg-purple-100 dark:bg-purple-950/60",
    iconFg: "text-purple-600 dark:text-purple-400",
    cardBg: "bg-purple-50 dark:bg-purple-950/30",
    hoverBorder: "hover:border-purple-400/80 dark:hover:border-purple-500/80",
  },
  {
    key: "inventory",
    icon: Package,
    iconBg: "bg-blue-100 dark:bg-blue-950/60",
    iconFg: "text-blue-600 dark:text-blue-400",
    cardBg: "bg-blue-50 dark:bg-blue-950/30",
    hoverBorder: "hover:border-blue-400/80 dark:hover:border-blue-500/80",
  },
  {
    key: "purchaseVendor",
    icon: Truck,
    iconBg: "bg-indigo-100 dark:bg-indigo-950/60",
    iconFg: "text-indigo-600 dark:text-indigo-400",
    cardBg: "bg-indigo-50 dark:bg-indigo-950/30",
    hoverBorder: "hover:border-indigo-400/80 dark:hover:border-indigo-500/80",
  },
  {
    key: "customerService",
    icon: HeadphonesIcon,
    iconBg: "bg-rose-100 dark:bg-rose-950/60",
    iconFg: "text-rose-600 dark:text-rose-400",
    cardBg: "bg-rose-50 dark:bg-rose-950/30",
    hoverBorder: "hover:border-rose-400/80 dark:hover:border-rose-500/80",
  },
  {
    key: "reportsAnalytics",
    icon: BarChart3,
    iconBg: "bg-violet-100 dark:bg-violet-950/60",
    iconFg: "text-violet-600 dark:text-violet-400",
    cardBg: "bg-violet-50 dark:bg-violet-950/30",
    hoverBorder: "hover:border-violet-400/80 dark:hover:border-violet-500/80",
  },
  {
    key: "boq",
    icon: FileSpreadsheet,
    iconBg: "bg-orange-100 dark:bg-orange-950/60",
    iconFg: "text-orange-600 dark:text-orange-400",
    cardBg: "bg-orange-50 dark:bg-orange-950/30",
    hoverBorder: "hover:border-orange-400/80 dark:hover:border-orange-500/80",
  },
  {
    key: "settingsSecurity",
    icon: Shield,
    iconBg: "bg-amber-100 dark:bg-amber-950/60",
    iconFg: "text-amber-600 dark:text-amber-400",
    cardBg: "bg-amber-50 dark:bg-amber-950/30",
    hoverBorder: "hover:border-amber-400/80 dark:hover:border-amber-500/80",
  },
  {
    key: "documentManagement",
    icon: FileText,
    iconBg: "bg-blue-100 dark:bg-blue-950/60",
    iconFg: "text-blue-600 dark:text-blue-400",
    cardBg: "bg-blue-50 dark:bg-blue-950/30",
    hoverBorder: "hover:border-blue-400/80 dark:hover:border-blue-500/80",
  },
];

const PREVIEW_COUNT = 6;
const FALLBACK_PRIMARY = "#2ed573";

export default function ModuleGrid() {
  const { t } = useLanguage();
  const router = useRouter();
  const visible = MODULES;
  const { primaryColor } = useTheme();
  const brandColor = primaryColor || FALLBACK_PRIMARY;

  return (
    <section className="bg-background px-5 py-5 sm:px-8 transition-colors">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="chip-kinetic"
            style={{
              color: brandColor,
              borderColor: `${brandColor}40`,
              backgroundColor: `${brandColor}12`,
            }}
          >
            {t("modules.eyebrow")}
          </motion.span>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {t("modules.title")}
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-3 font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground"
          >
            {t("modules.subtitle")}
          </motion.p>
        </div>

        <motion.div
          layout
          className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {visible.map((mod) => {
            const Icon = mod.icon;
            const title = t(`modules.${mod.key}.title`);
            const tagline = t(`modules.${mod.key}.tagline`);

            const bullets = [
              t(`modules.${mod.key}.bullet1`),
              t(`modules.${mod.key}.bullet2`),
              t(`modules.${mod.key}.bullet3`),
              t(`modules.${mod.key}.bullet4`),
            ].filter(Boolean);

            return (
              <motion.div
                key={mod.key}
                layout
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, scale: 1.03 }}
                className={`rounded-2xl border border-border p-6 shadow-sm transition-all duration-300 ${mod.cardBg} ${mod.hoverBorder}`}
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${mod.iconBg} ${mod.iconFg}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-[15px] font-semibold text-card-foreground">
                  {title}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">{tagline}</p>
                <ul className="mt-4 space-y-1.5">
                  {bullets.map((bullet, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs text-card-foreground/80"
                    >
                      <Check className="mt-0.5 h-3 w-3 shrink-0 text-gold" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="mt-10 text-center">
          <button
            onClick={() => router.push("/features")}
            className="rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 shadow-md"
            style={{ backgroundColor: brandColor }}
          >
            {t("modules.showMore")}
          </button>
        </div>
      </div>
    </section>
  );
}
