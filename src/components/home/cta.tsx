"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/language";

export default function Cta() {
  const { t } = useLanguage();

  return (
    <section className="px-5 pb-12 sm:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-primary px-8 py-16 text-center sm:py-20 dark:border dark:border-border dark:bg-card"
      >
        <div className="pointer-events-none absolute -top-16 -left-16 h-56 w-56 rounded-full bg-accent/20 blur-3xl dark:bg-accent/10" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-accent/10 blur-3xl dark:bg-accent/5" />

        <div className="relative">
          <h2 className="mx-auto max-w-xl font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-primary-foreground sm:text-4xl dark:text-foreground">
            {t("cta.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-primary-foreground/70 dark:text-muted-foreground">
            {t("cta.description")}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/login"
              className="group inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5"
            >
              {t("cta.button")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/contact"
              className="rounded-md border border-primary-foreground/20 px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10 dark:border-border dark:text-foreground dark:hover:bg-secondary"
            >
              {t("cta.secondary")}
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}