"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, ShieldCheck, Clock, CreditCard } from "lucide-react";
import { useLanguage } from "@/lib/language";
import { useTheme } from "@/lib/theme";

const FALLBACK_PRIMARY = "#2ed573";

export default function FeaturesPage() {
  const { t, tArray } = useLanguage();
  const items = tArray("features.list");
  const { primaryColor } = useTheme();
  const brandColor = primaryColor || FALLBACK_PRIMARY;

  return (
    <section className="bg-background px-5 pt-8 pb-4 sm:px-8 ">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-xl text-center"
        >
          <span
            className="chip-kinetic"
            style={{
              color: brandColor,
              borderColor: `${brandColor}40`,
              backgroundColor: `${brandColor}18`,
            }}
          >
            {t("features.subtitle")}
          </span>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {t("features.title")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t("features.description")}
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
          className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {items.map((item) => (
            <motion.div
              key={item.title}
              variants={{
                hidden: { opacity: 0, y: 18 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              whileHover="hover"
              className="group overflow-hidden rounded-2xl border border-border bg-card"
            >
              {item.image && (
                <div className="relative aspect-[16/10] overflow-hidden">
                  <motion.div
                    variants={{ hover: { scale: 1.05 } }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="360px"
                      className="object-cover"
                    />
                  </motion.div>
                </div>
              )}
              <div className="p-5">
                <h3 className="font-[family-name:var(--font-display)] text-base font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  {t("features.view")}
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row"
        >
          <Link
            href="/properties"
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            {t("features.viewAll")}
          </Link>
          <div className="flex flex-wrap items-center gap-5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" />
              {t("features.uptime")}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-accent" />
              {t("features.support")}
            </span>
            <span className="flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5 text-accent" />
              {t("features.noCard")}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
