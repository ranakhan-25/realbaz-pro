"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Check, HelpCircle, ChevronDown, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/language";
import { AnimatedHeading } from "@/components/home/animated-heading";

type Billing = "monthly" | "yearly";

export function PricingClient() {
  const { t } = useLanguage();
  const [billing, setBilling] = useState<Billing>("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const customPriceLabel = t("pricing.custom") || "Custom";

  const PLANS = [
    {
      name: t("pricing.starter.name"),
      monthly: "৳2900",
      yearly: "৳2900",
      yearlyNote: "$24/mo billed yearly",
      description: t("pricing.starter.description"),
      features: [
        t("pricing.starter.f1"),
        t("pricing.starter.f2"),
        t("pricing.starter.f3"),
        t("pricing.starter.f4"),
      ],
      cta: t("pricing.starter.cta"),
      highlighted: false,
    },
    {
      name: t("pricing.growth.name"),
      monthly: "৳7900",
      yearly: "৳7900",
      yearlyNote: t("pricing.growth.note"),
      description: t("pricing.growth.description"),
      features: [
        t("pricing.growth.f1"),
        t("pricing.growth.f2"),
        t("pricing.growth.f3"),
        t("pricing.growth.f4"),
        t("pricing.growth.f5"),
      ],
      cta: t("pricing.growth.cta"),
      highlighted: true,
    },
    {
      name: t("pricing.enterprise.name"),
      monthly: customPriceLabel,
      yearly: customPriceLabel,
      yearlyNote: t("pricing.enterprise.note"),
      description: t("pricing.enterprise.description"),
      features: [
        t("pricing.enterprise.f1"),
        t("pricing.enterprise.f2"),
        t("pricing.enterprise.f3"),
        t("pricing.enterprise.f4"),
        t("pricing.enterprise.f5"),
      ],
      cta: t("pricing.enterprise.cta"),
      highlighted: false,
    },
  ];

  const FAQS = [
    { question: t("pricing.faq1.q"), answer: t("pricing.faq1.a") },
    { question: t("pricing.faq2.q"), answer: t("pricing.faq2.a") },
    { question: t("pricing.faq3.q"), answer: t("pricing.faq3.a") },
  ];

  return (
    <div>
      <section className="bg-background px-5 py-8 transition-colors sm:px-8 ">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mx-auto max-w-2xl text-center"
          >
            <span className="chip-kinetic">{t("pricing.badge")}</span>
            <AnimatedHeading
              text={t("pricing.title")}
              className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            />
            <p className=" text-[15px]  text-muted-foreground">
              {t("pricing.description")}
            </p>
          </motion.div>

          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mt-8 flex items-center justify-center gap-3"
          >
            <div className="relative flex rounded-full border border-border bg-card p-1 shadow-xs">
              {(["monthly", "yearly"] as const).map((option) => (
                <button
                  key={option}
                  onClick={() => setBilling(option)}
                  className={`relative z-10 rounded-full px-5 py-2 text-[13px] font-medium capitalize transition-colors ${
                    billing === option
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {billing === option && (
                    <motion.span
                      layoutId="billing-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  {option === "monthly" ? t("pricing.monthly") : t("pricing.yearly")}
                </button>
              ))}
            </div>

            <AnimatePresence>
              {billing === "yearly" && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9, x: -5 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: -5 }}
                  className="inline-flex items-center gap-1 rounded-full border border-accent/40 bg-accent/20 px-2.5 py-1 text-[11px] font-semibold text-foreground"
                >
                  <Sparkles size={11} className="text-accent" /> {t("pricing.saveBadge")}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Pricing Cards */}
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {PLANS.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
                className={`relative flex flex-col rounded-2xl border bg-card p-7 transition-all ${
                  plan.highlighted
                    ? "border-accent shadow-xl ring-2 ring-accent/50 md:-translate-y-2"
                    : "border-border hover:border-muted-foreground/30"
                }`}
              >
                {plan.highlighted && (
                  <span className="chip-kinetic absolute -top-3 left-1/2 -translate-x-1/2 shadow-xs">
                    {t("pricing.popular")}
                  </span>
                )}
                <h2 className="font-display text-[17px] font-semibold text-foreground">
                  {plan.name}
                </h2>
                <p className="mt-1 text-[13px] text-muted-foreground">{plan.description}</p>

                <div className="mt-5 flex items-baseline gap-1">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={billing + plan.name}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.15 }}
                      className="font-body text-4xl font-semibold text-gold"
                    >
                      {billing === "monthly" ? plan.monthly : plan.yearly}
                    </motion.span>
                  </AnimatePresence>
                  {plan.monthly !== customPriceLabel && (
                    <span className="text-[13px] text-muted-foreground">
                      {billing === "monthly" ? t("pricing.perMonth") : t("pricing.perYear")}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[12px] text-muted-foreground/80">
                  {billing === "yearly" ? plan.yearlyNote : t("pricing.billedMonthly")}
                </p>

                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check size={15} className="mt-0.5 shrink-0 text-gold" />
                      <span className="text-[13.5px] text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Link
                    href="/login"
                    className={`mt-7 block w-full rounded-full px-5 py-2.5 text-center text-[13.5px] font-semibold transition-colors ${
                      plan.highlighted
                        ? "bg-accent text-accent-foreground hover:opacity-90"
                        : "border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — separate band, alternating background to match the rest of the site */}
      <section className="bg-secondary px-5 py-14 sm:px-8 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4 }}
          className="mx-auto max-w-2xl"
        >
          <h2 className="text-center font-display text-xl font-semibold text-foreground">
            {t("pricing.faqTitle")}
          </h2>
          <div className="mt-6 space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.question}
                  className="rounded-xl border border-border bg-card transition-colors hover:border-muted-foreground/30"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-3 p-4 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle size={16} className="shrink-0 text-gold" />
                      <span className="text-[13.5px] font-medium text-foreground">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      size={15}
                      className={`shrink-0 text-muted-foreground transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="px-4 pb-4 pl-11 text-[13px] leading-relaxed text-muted-foreground">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>
      </section>
    </div>
  );
}