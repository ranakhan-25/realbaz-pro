"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "motion/react";
import { useLanguage } from "@/lib/language";
import { useTheme } from "@/lib/theme"; // adjust path if needed

const STAT_VALUES = [1240, 8600, 320, 24, 9, 99.9] as const;
const STAT_KEYS = [
  "milestones.stat1",
  "milestones.stat2",
  "milestones.stat3",
  "milestones.stat4",
  "milestones.stat5",
  "milestones.stat6",
] as const;

// Helper to convert English digits to Bangla numerals
function toBanglaNumerals(numStr: string): string {
  const enToBnMap: Record<string, string> = {
    "0": "০",
    "1": "১",
    "2": "২",
    "3": "৩",
    "4": "৪",
    "5": "৫",
    "6": "৬",
    "7": "৭",
    "8": "৮",
    "9": "৯",
    ".": ".",
  };
  return numStr.replace(/[0-9.]/g, (char) => enToBnMap[char] || char);
}

function Counter({
  value,
  decimals = 0,
  isBangla = false,
}: {
  value: number;
  decimals?: number;
  isBangla?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => {
    const formatted = v.toFixed(decimals);
    return isBangla ? toBanglaNumerals(formatted) : formatted;
  });

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(motionValue, value, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [isInView, value, motionValue]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

export default function Milestones() {
  const { t, language } = useLanguage();
  const { primaryColor } = useTheme();
  const isBangla = language === "bn";

  return (
    <section
      className="px-5 py-14 sm:px-8 sm:py-20"
      style={{
        backgroundColor: primaryColor
          ? `${primaryColor}15` // halka / light version (low opacity)
          : undefined,
      }}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[minmax(0,280px)_1px_1fr] lg:items-center lg:gap-12">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
            {t("stats.subtitle")}
          </p>
          <p className="mt-2 font-script text-6xl font-semibold tracking-tight text-gold sm:text-7xl">
            {t("milestones.founded")}
          </p>
          <p className="mt-3 max-w-[220px] text-sm leading-relaxed text-muted-foreground">
            {t("milestones.tagline")}
          </p>
        </motion.div>

        <div className="hidden h-32 w-px bg-border lg:block" />

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
          className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3"
        >
          {STAT_KEYS.map((key, i) => (
            <motion.div
              key={key}
              variants={{
                hidden: { opacity: 0, y: 14 },
                show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}
            >
              <p className="font-script text-3xl font-semibold tabular-nums text-gold sm:text-4xl">
                <Counter
                  value={STAT_VALUES[i]}
                  decimals={STAT_VALUES[i] % 1 !== 0 ? 1 : 0}
                  isBangla={isBangla}
                />
                {STAT_VALUES[i] >= 100 && Number.isInteger(STAT_VALUES[i])
                  ? "+"
                  : ""}
              </p>
              <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                {t(key)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
