"use client";

import { motion } from "motion/react";
import { useLanguage } from "@/lib/language";
import { useTheme } from "@/lib/theme";

const STEPS = ["process.step1", "process.step2", "process.step3", "process.step4"] as const;
const FALLBACK_PRIMARY = "#2ed573";

export default function Process() {
  const { t } = useLanguage();
  const { primaryColor } = useTheme();
  const brandColor = primaryColor || FALLBACK_PRIMARY;

  return (
    <section
      className="px-5 py-10 sm:px-8"
      style={{
        backgroundColor: `${brandColor}12`, // halka primary
      }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="chip-kinetic"
            style={{
              color: brandColor,
              borderColor: `${brandColor}40`,
              backgroundColor: `${brandColor}18`,
            }}
          >
            {t("process.eyebrow")}
          </motion.span>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {t("process.title")}
          </h2>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.12 } },
          }}
          className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {STEPS.map((key, i) => (
            <motion.div
              key={key}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              className="relative"
            >
              <span className="font-[family-name:var(--font-serif)] text-4xl font-semibold text-gold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-[family-name:var(--font-display)] text-base font-semibold text-foreground">
                {t(`${key}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t(`${key}.description`)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}