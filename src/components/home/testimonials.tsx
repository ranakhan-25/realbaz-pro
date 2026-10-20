"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Quote } from "lucide-react";
import { useLanguage } from "@/lib/language";
import { useTheme } from "@/lib/theme";

const FALLBACK_PRIMARY = "#2ed573";

export default function TestimonialCarousel() {
  const { t, tArray } = useLanguage();
  const { primaryColor } = useTheme();
  const brandColor = primaryColor || FALLBACK_PRIMARY;

  const items = tArray("testimonials.list");
  const [active, setActive] = useState(0);
  const current = items[active];

  if (!current) return null;

  return (
    <section
      className="px-5 py-10 sm:px-8"
      style={{
        backgroundColor: `${brandColor}12`, // halka primary
      }}
    >
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.15em] text-muted-foreground">
            {t("testimonials.subtitle")}
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {t("testimonials.title")}
          </h2>
        </motion.div>

        <div className="relative mt-12 rounded-2xl border border-border bg-card px-6 py-10 sm:px-12 sm:py-14">
          <Quote className="mx-auto h-8 w-8" style={{ color: brandColor }} />

          <AnimatePresence mode="wait">
            <motion.blockquote
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="mt-6 text-center"
            >
              <p className="font-[family-name:var(--font-display)] text-xl font-medium leading-snug text-foreground sm:text-2xl">
                &ldquo;{current.description}&rdquo;
              </p>
              <p className="mt-6 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.1em] text-muted-foreground">
                {current.title}
              </p>
            </motion.blockquote>
          </AnimatePresence>

          <div className="mt-8 flex justify-center gap-2">
            {items.map((item, i) => (
              <button
                key={item.title}
                onClick={() => setActive(i)}
                aria-label={`Show testimonial ${i + 1}`}
                className="relative h-2 rounded-full bg-border"
                style={{ width: active === i ? 24 : 8 }}
              >
                {active === i && (
                  <motion.span
                    layoutId="testimonial-dot"
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: brandColor }}
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
