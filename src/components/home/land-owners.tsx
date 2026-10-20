"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Check, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/language";
import { AnimatedHeading } from "@/components/home/animated-heading";

export default function LandOwners() {
  const { t } = useLanguage();
  const points = [
    t("landowner.point1"),
    t("landowner.point2"),
    t("landowner.point3"),
    t("landowner.point4"),
  ];

  return (
    <section className="bg-background px-5 py-10 sm:px-8 ">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative order-2 lg:order-1"
        >
          {/* Main Land Plot Image */}
          <div className="relative aspect-[16/16] w-full overflow-hidden rounded-2xl sm:max-h-[360px]">
            <Image
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
              alt="Land parcel ready for real estate development"
              fill
              sizes="(min-width: 1024px) 480px, 90vw"
              className="object-cover"
            />
          </div>

          {/* Secondary Thumbnail Image */}
          <motion.div
            initial={{ opacity: 0, y: 16, x: 16 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="absolute -right-4 -top-4 hidden aspect-square w-24 overflow-hidden rounded-xl border-4 border-secondary shadow-xl sm:block"
          >
            <Image
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80"
              alt="Architectural development planning"
              fill
              sizes="96px"
              className="object-cover"
            />
          </motion.div>
        </motion.div>

        <div className="order-1 lg:order-2">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="chip-kinetic"
          >
            {t("landowner.eyebrow")}
          </motion.span>

          <h2 className="mt-4 leading-[1.05]">
            <AnimatedHeading
              text={t("landowner.titleLine1")}
              as="span"
              className="block font-[family-name:var(--font-serif)] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            />
            <motion.span
              initial={{ opacity: 0, y: 20, rotate: -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="block font-[family-name:var(--font-script)] text-5xl leading-none text-gold sm:text-6xl"
            >
              {t("landowner.titleAccent")}
            </motion.span>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground"
          >
            {t("landowner.description")}
          </motion.p>

          <motion.ul
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
            className="mt-4 space-y-2.5"
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
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span className="text-sm text-foreground/80">{point}</span>
              </motion.li>
            ))}
          </motion.ul>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mt-6"
          >
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              {t("landowner.cta")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}