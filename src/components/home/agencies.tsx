"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Check, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/language";
import { useTheme } from "@/lib/theme";
import { AnimatedHeading } from "@/components/home/animated-heading";

const FALLBACK_PRIMARY = "#2ed573";

export default function Agencies() {
  const { t } = useLanguage();
  const { primaryColor } = useTheme();
  const brandColor = primaryColor || FALLBACK_PRIMARY;

  const points = [
    t("agency.point1"),
    t("agency.point2"),
    t("agency.point3"),
    t("agency.point4"),
  ];

  return (
    <section className="bg-secondary px-5 py-10 sm:px-8">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="chip-kinetic"
            style={{
              color: brandColor,
              borderColor: `${brandColor}40`,
              backgroundColor: `${brandColor}12`,
            }}
          >
            {t("agency.eyebrow")}
          </motion.span>

          <h2 className="mt-5 leading-[1.05]">
            <AnimatedHeading
              text={t("agency.titleLine1")}
              as="span"
              className="block font-[family-name:var(--font-serif)] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            />
            <motion.span
              initial={{ opacity: 0, y: 20, rotate: 2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="block font-[family-name:var(--font-script)] text-5xl leading-none text-gold sm:text-6xl"
            >
              {t("agency.titleAccent")}
            </motion.span>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground"
          >
            {t("agency.description")}
          </motion.p>

          <motion.ul
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08 } },
            }}
            className="mt-6 space-y-3"
          >
            {points.map((point) => (
              <motion.li
                key={point}
                variants={{
                  hidden: { opacity: 0, x: -12 },
                  show: { opacity: 1, x: 0, transition: { duration: 0.4 } },
                }}
                className="flex items-start gap-2.5"
              >
                <Check
                  className="mt-0.5 h-4 w-4 shrink-0"
                  style={{ color: brandColor }}
                />
                <span className="text-sm text-foreground/80">{point}</span>
              </motion.li>
            ))}
          </motion.ul>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Link
              href="/login"
              className="group mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              {t("agency.cta")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="relative aspect-[16/16] w-full overflow-hidden rounded-2xl sm:max-h-[360px]">
            <Image
              src="/assets/dashboard.png"
              alt="A modern real estate office environment"
              fill
              sizes="(min-width: 1024px) 480px, 90vw"
              className="object-cover"
            />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 16, x: -16 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="absolute -bottom-6 -left-6 hidden aspect-square w-32 overflow-hidden rounded-xl border-4 border-background shadow-xl sm:block"
          >
            <Image
              src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?q=80&w=400&auto=format&fit=crop"
              alt="Two real estate professionals shaking hands"
              fill
              sizes="128px"
              className="object-cover"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
