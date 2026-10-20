"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/lib/language";
import { AnimatedHeading } from "@/components/home/animated-heading";

const CATEGORIES = [
  {
    key: "construction",
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop",
  },
  {
    key: "readyBuilding",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
  },
  {
    key: "readyLand",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop",
  },
  {
    key: "readyFlat",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
  },
] as const;

export default function PropertiesContent() {
  const { t } = useLanguage();

  return (
    <div>
      <section className="bg-background px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="chip-kinetic"
          >
            {t("properties.eyebrow")}
          </motion.span>
          <AnimatedHeading
            text={t("properties.title")}
            as="h1"
            className="mt-4 font-[family-name:var(--font-serif)] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          />
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground"
          >
            {t("properties.description")}
          </motion.p>
        </div>
      </section>

      <section className="bg-secondary px-5 py-14 sm:px-8 sm:py-20">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } },
          }}
          className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2"
        >
          {CATEGORIES.map((cat) => (
            <motion.div
              key={cat.key}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              whileHover="hover"
              className="group relative overflow-hidden rounded-2xl border border-border"
            >
              <div className="relative aspect-[16/11]">
                <motion.div
                  variants={{ hover: { scale: 1.06 } }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={cat.image}
                    alt={t(`properties.${cat.key}.title`)}
                    fill
                    sizes="(min-width: 640px) 480px, 90vw"
                    className="object-cover"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />

                <motion.span
                  variants={{ hover: { rotate: 45 } }}
                  transition={{ duration: 0.3 }}
                  className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/50 text-white"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </motion.span>

                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="font-[family-name:var(--font-serif)] text-2xl font-semibold text-white">
                    {t(`properties.${cat.key}.title`)}
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/75">
                    {t(`properties.${cat.key}.description`)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="bg-background px-5 py-14 text-center sm:px-8 sm:py-20">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          {t("properties.cta")}
        </Link>
      </section>
    </div>
  );
}
