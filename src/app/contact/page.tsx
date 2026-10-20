"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, MapPin, Phone, CheckCircle2 } from "lucide-react";
import { SiteShell } from "@/components/site/SiteNav";
import { useLanguage } from "@/lib/language";
import { AnimatedHeading } from "@/components/home/animated-heading";
import LocationMapSection from "@/components/contract/LocationMapSection";

const INFO_ITEMS = [
  {
    icon: MapPin,
    labelKey: "contact.addressLabel",
    valueKey: "H-417, R-7, Baridhara DOHS, Dhaka-1206",
  },
  {
    icon: Mail,
    labelKey: "contact.emailLabel",
    valueKey: "fleekbangladesh@gmail.com",
  },
  {
    icon: Phone,
    labelKey: "contact.phoneLabel",
    valueKey: "+8801897-621270",
  },
] as const;

function ContactContent() {
  const { t } = useLanguage();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;

    setIsSubmitting(true);

    // Fake submission
    setTimeout(() => {
      form.reset();
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <section className=" bg-background px-5 py-14 sm:px-8">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-14 lg:grid-cols-[1fr_1.2fr]">
        {/* Contact Information */}
        <div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="chip-kinetic"
          >
            {t("contact.eyebrow")}
          </motion.span>

          <AnimatedHeading
            text={t("contact.title")}
            as="h1"
            className="mt-5 font-[family-name:var(--font-serif)] text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl"
          />

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground"
          >
            {t("contact.description")}
          </motion.p>

          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.3,
                },
              },
            }}
            className="mt-10 space-y-5"
          >
            {INFO_ITEMS.map((item) => (
              <motion.div
                key={item.labelKey}
                variants={{
                  hidden: {
                    opacity: 0,
                    x: -12,
                  },
                  show: {
                    opacity: 1,
                    x: 0,
                    transition: {
                      duration: 0.4,
                    },
                  },
                }}
                className="flex items-start gap-3"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-gold">
                  <item.icon className="h-4 w-4" />
                </span>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {t(item.labelKey)}
                  </p>

                  <p className="mt-0.5 text-sm text-foreground">
                    {t(item.valueKey)}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Contact Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.15,
            ease: [0.16, 1, 0.3, 1],
          }}
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-card p-7 sm:p-9"
        >
          <AnimatePresence mode="wait">
            {isSubmitted ? (
              /* Success State */
              <motion.div
                key="success"
                initial={{
                  opacity: 0,
                  scale: 0.96,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.96,
                  y: -10,
                }}
                transition={{ duration: 0.3 }}
                className="flex min-h-[420px] flex-col items-center justify-center text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.1,
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                  }}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-accent"
                >
                  <CheckCircle2 className="h-7 w-7" />
                </motion.div>

                <h2 className="mt-5 font-[family-name:var(--font-serif)] text-2xl font-semibold text-foreground">
                  Message sent
                </h2>

                <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                  Thanks for reaching out. We&apos;ve received your message and
                  will get back to you soon.
                </p>

                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="mt-7 rounded-md border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              /* Form Fields */
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* Name */}
                  <label className="block">
                    <span className="text-xs font-medium text-muted-foreground">
                      {t("contact.form.name")}
                    </span>

                    <input
                      name="name"
                      type="text"
                      required
                      className="mt-1.5 w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent"
                    />
                  </label>

                  {/* Email */}
                  <label className="block">
                    <span className="text-xs font-medium text-muted-foreground">
                      {t("contact.form.email")}
                    </span>

                    <input
                      name="email"
                      type="email"
                      required
                      className="mt-1.5 w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent"
                    />
                  </label>
                </div>

                {/* Company */}
                <label className="mt-5 block">
                  <span className="text-xs font-medium text-muted-foreground">
                    {t("contact.form.company")}
                  </span>

                  <input
                    name="company"
                    type="text"
                    className="mt-1.5 w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent"
                  />
                </label>

                {/* Message */}
                <label className="mt-5 block">
                  <span className="text-xs font-medium text-muted-foreground">
                    {t("contact.form.message")}
                  </span>

                  <textarea
                    name="message"
                    rows={5}
                    required
                    className="mt-1.5 w-full resize-none rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent"
                  />
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-6 w-full rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                >
                  {isSubmitting ? "Sending..." : t("contact.form.submit")}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>
      </div>
    </section>
  );
}

export default function ContactPage() {
  return (
    <SiteShell>
      <ContactContent />
      <LocationMapSection/>
    </SiteShell>
  );
}
