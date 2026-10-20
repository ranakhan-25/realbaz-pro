"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { SiteShell } from "@/components/site/SiteNav";
import { useLanguage } from "@/lib/language";
import { AnimatedHeading } from "@/components/home/animated-heading";
import Milestones from "@/components/home/milestones";

const VALUE_KEYS = ["about.value1", "about.value2", "about.value3"] as const;

function AboutContent() {
  const { t } = useLanguage();

  return (
    <div>
      <section className="relative overflow-hidden bg-background px-5 py-14 sm:px-8 sm:py-20">
        <div className="pointer-events-none absolute -left-32 top-0 h-[360px] w-[360px] rounded-full bg-gold-soft" />
        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="chip-kinetic"
            >
              {t("about.eyebrow")}
            </motion.span>
            <AnimatedHeading
              text={t("about.title")}
              as="h1"
              className="mt-5 font-[family-name:var(--font-serif)] text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl"
            />
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className=" text-sm leading-relaxed text-muted-foreground"
            >
              {t("about.paragraph1")}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-4 text-sm leading-relaxed text-muted-foreground"
            >
              {t("about.paragraph2")}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative aspect-[16/14] overflow-hidden rounded-2xl"
          >
            <Image
              src="https://images.unsplash.com/photo-1758448617677-2f8bebc56d9e?q=80&w=2070&auto=format&fit=crop"
              alt="Modern building architecture"
              fill
              sizes="(min-width: 1024px) 480px, 90vw"
              className="object-cover transition-transform duration-700 hover:scale-105"
              priority
            />
          </motion.div>
        </div>
      </section>

      <Milestones />

      <section className="bg-background px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-[family-name:var(--font-serif)] text-2xl font-semibold text-foreground sm:text-3xl"
          >
            {t("about.missionTitle")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-sm leading-relaxed text-muted-foreground"
          >
            {t("about.missionText")}
          </motion.p>
        </div>
      </section>

      <section className="bg-secondary px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center font-[family-name:var(--font-serif)] text-2xl font-semibold text-foreground sm:text-3xl"
          >
            {t("about.valuesTitle")}
          </motion.h2>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={{
              hidden: {},
              show: {
                transition: { staggerChildren: 0.1 },
              },
            }}
            className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3"
          >
            {VALUE_KEYS.map((key, i) => (
              <motion.div
                key={key}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1],
                    },
                  },
                }}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  transition: {
                    duration: 0.25,
                    ease: [0.16, 1, 0.3, 1],
                  },
                }}
                whileTap={{ scale: 0.98 }}
                className="group rounded-2xl border border-border bg-card p-6 transition-colors duration-300 hover:border-gold/40 hover:shadow-lg"
              >
                <motion.span
                  className="block font-[family-name:var(--font-serif)] text-2xl font-semibold text-gold"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  {String(i + 1).padStart(2, "0")}
                </motion.span>

                <h3 className="mt-3 font-[family-name:var(--font-display)] text-base font-semibold text-foreground transition-colors duration-300 group-hover:text-gold">
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
    </div>
  );
}

export default function AboutPage() {
  return (
    <SiteShell>
      <AboutContent />
    </SiteShell>
  );
}
