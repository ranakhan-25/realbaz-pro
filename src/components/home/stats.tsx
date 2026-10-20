"use client";

import { motion } from "motion/react";
import { useLanguage } from "@/lib/language";

const STATS = [
  { value: "3,400+", key: "stats.label1" },
  { value: "180+", key: "stats.label2" },
  { value: "24", key: "stats.label3" },
  { value: "99.9%", key: "stats.label4" },
] as const;

export default function Stats() {
  const { t } = useLanguage();

  return (
    <section className="border-y border-border bg-secondary px-5 py-14 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center text-sm font-medium text-muted-foreground"
        >
          {t("stats.title")}
        </motion.p>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
          className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-4"
        >
          {STATS.map((stat) => (
            <motion.div
              key={stat.key}
              variants={{
                hidden: { opacity: 0, y: 14 },
                show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="text-center"
            >
              <p className="font-[family-name:var(--font-display)] text-3xl font-semibold text-foreground sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1.5 text-xs text-muted-foreground">{t(stat.key)}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}