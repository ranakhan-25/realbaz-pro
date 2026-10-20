"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import { useLanguage } from "@/lib/language";

export function RealEstateServices() {
  const { t } = useLanguage();

  const features = [
    t("services.feature1"),
    t("services.feature2"),
    t("services.feature3"),
  ];

  return (
    <section className="bg-background px-5 py-10 pb-12 sm:px-8">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {/* Main Image: Modern Luxury Real Estate Architecture */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80"
              alt={t("services.imageAlt1")}
              fill
              sizes="(min-width: 1024px) 480px, 90vw"
              className="object-cover"
            />
          </div>

          {/* Floating Accent Image: High-End Interior / Villa */}
          <div className="absolute -bottom-8 -left-8 hidden aspect-square w-36 overflow-hidden rounded-xl border-4 border-background shadow-xl sm:block">
            <Image
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80"
              alt={t("services.imageAlt2")}
              fill
              sizes="144px"
              className="object-cover"
            />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="chip-kinetic">{t("services.subtitle")}</span>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {t("services.title")}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {t("services.description")}
          </p>

          <ul className="mt-6 space-y-3">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span className="text-sm text-foreground/80">{feature}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/properties"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            {t("services.explore")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
