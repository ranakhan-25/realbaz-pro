"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { useLanguage } from "@/lib/language";

const PLANS = [
  { key: "pricing.starter.name", price: "$29", highlighted: false },
  { key: "pricing.growth.name", price: "$79", highlighted: true },
  { key: "pricing.enterprise.name", price: null, highlighted: false },
] as const;

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function PricingSection() {
  const { t } = useLanguage();

  return (
    <section className="bg-background px-5 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-xl text-center"
        >
          <span className="chip-kinetic">{t("pricing.subtitle")}</span>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {t("pricing.title")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t("pricing.description")}
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3"
        >
          {PLANS.map((plan) => (
            <motion.div
              key={plan.key}
              variants={item}
              whileHover={{ y: -4 }}
              className={`relative rounded-2xl border p-6 transition-shadow ${
                plan.highlighted
                  ? "border-accent bg-card shadow-lg shadow-accent/20"
                  : "border-border bg-card"
              }`}
            >
              {plan.highlighted && (
                <span className="chip-kinetic absolute -top-3 left-6">
                  {t("pricing.popular")}
                </span>
              )}
              <p className="text-sm font-semibold text-foreground">{t(plan.key)}</p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-[family-name:var(--font-display)] text-3xl font-semibold text-foreground">
                  {plan.price ?? t("pricing.custom")}
                </span>
                {plan.price && (
                  <span className="text-xs text-muted-foreground">
                    {t("pricing.perMonth")}
                  </span>
                )}
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <Check className="h-3.5 w-3.5 text-accent" />
                <span>14-day free trial</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-10 flex justify-center"
        >
          <Link
            href="/pricing"
            className="group inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            {t("pricing.cta")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
