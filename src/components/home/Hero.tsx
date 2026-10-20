"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/language";
import { useTheme } from "@/lib/theme";

const FALLBACK_PRIMARY = "#2ed573";

export default function Hero() {
  const { t, language } = useLanguage();
  const { primaryColor } = useTheme();
  const brandColor = primaryColor || FALLBACK_PRIMARY;

  const isBn = language === "bn";

  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute -right-40 top-10 h-[420px] w-[420px] rounded-full sm:-right-20 dark:opacity-30"
        style={{ backgroundColor: `${brandColor}18` }}
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:pt-24">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="chip-kinetic"
            style={{
              color: brandColor,
              borderColor: `${brandColor}40`,
              backgroundColor: `${brandColor}12`,
            }}
          >
            {t("legacy.eyebrow")}
          </motion.span>

          <h1 className="mt-6 leading-[1.05]">
            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="block font-[family-name:var(--font-serif)] text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem]"
            >
              {t("legacy.titleLine1")}
            </motion.span>

            <motion.span
              initial={{ opacity: 0, y: 24, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={`block font-[family-name:var(--font-script)] text-6xl leading-none sm:text-7xl lg:text-8xl ${
                isBn ? "mt-8" : ""
              }`}
              style={{ color: brandColor }}
            >
              {t("legacy.titleAccent")}
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="mt-8 max-w-xl text-sm leading-relaxed text-muted-foreground"
          >
            {t("legacy.paragraph1")}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground"
          >
            {t("legacy.paragraph2")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-9 flex flex-wrap items-center gap-6"
          >
            <Link
              href="/about"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-foreground"
            >
              {t("legacy.cta")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center rounded-md px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:opacity-90"
              style={{ backgroundColor: brandColor }}
            >
              {t("hero.cta")}
            </Link>
          </motion.div>
        </div>

        {/* Right: layered visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="relative aspect-[16/11] max-h-[380px] w-full overflow-hidden rounded-2xl bg-secondary shadow-2xl sm:max-h-[420px]">
            <Image
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
              alt={t("hero.dashboardAlt")}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16, x: -16 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -bottom-8 -left-8 hidden aspect-square w-40 overflow-hidden rounded-xl border-4 border-background shadow-xl sm:block"
          >
            <Image
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80"
              alt=""
              fill
              sizes="160px"
              className="object-cover"
            />
          </motion.div>

          <motion.span
            initial={{ opacity: 0, rotate: -8, scale: 0.9 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.75 }}
            className="absolute -top-5 right-4 flex h-20 w-20 flex-col items-center justify-center rounded-full border bg-background text-center shadow-sm"
            style={{ borderColor: `${brandColor}66` }}
          >
            <span
              className="font-[family-name:var(--font-serif)] text-xl font-semibold"
              style={{ color: brandColor }}
            >
              {t("milestones.founded")}
            </span>
            <span className="font-[family-name:var(--font-mono)] text-[8px] uppercase tracking-wide text-muted-foreground">
              modules
            </span>
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
}
