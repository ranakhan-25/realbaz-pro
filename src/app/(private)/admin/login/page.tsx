"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { loginAdminSession } from "@/lib/admin-auth/adminAuthApi";
import {
  getStoredAccessToken,
  setStoredTokens,
} from "@/lib/admin-auth/adminAuthStorage";
import { SiteShell } from "@/components/site/SiteNav";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=90",
    badge: "REALBIZ OS",
    title: "Command center for high-performance teams.",
    description:
      "Streamline your pipeline, analyze operational metrics, and scale growth securely from a unified workspace.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1400&q=90",
    badge: "SMART OPERATIONS",
    title: "Manage your entire business from one place.",
    description:
      "Connect sales, projects, finance, customers, vendors, and daily operations in one powerful workspace.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=90",
    badge: "BUSINESS INTELLIGENCE",
    title: "Make smarter decisions with real-time insights.",
    description:
      "Monitor business performance, analyze costs, track cash flow, and turn your data into actionable decisions.",
  },
];

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currentSlide, setCurrentSlide] = useState(0);

  // Existing authentication functionality
  useEffect(() => {
    if (getStoredAccessToken()) {
      router.replace("/admin/dashboard");
    }
  }, [router]);

  // Auto image/text slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Existing login functionality
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.includes("@") || password.length < 4) {
      setError("Enter a valid email and a password of at least 4 characters.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const session = await loginAdminSession(email, password);

      setStoredTokens(
        session.accessToken ?? session.token,
        session.refreshToken,
      );

      router.replace("/admin/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Admin login failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const slide = slides[currentSlide];

  return (
    <SiteShell>
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-8 text-zinc-900 sm:px-6 lg:px-8">
        {/* Main Container */}
        <div className="w-full max-w-6xl overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm lg:grid lg:grid-cols-2">
          {/* ===================================================== */}
          {/* LEFT SIDE - FULL IMAGE SLIDER                        */}
          {/* ===================================================== */}

          <div className="relative hidden min-h-[680px] overflow-hidden lg:block">
            {/* Sliding Image */}
            <AnimatePresence initial={false} mode="sync">
              <motion.div
                key={currentSlide}
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="absolute inset-0"
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="h-full w-full object-cover"
                />

                {/* Image Overlay */}
                <div className="absolute inset-0 bg-black/35" />

                {/* Bottom Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10" />
              </motion.div>
            </AnimatePresence>

            {/* Top Header */}
            <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between p-8">
              {/* Dynamic Badge */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`badge-${currentSlide}`}
                  initial={{
                    opacity: 0,
                    x: 30,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: -20,
                  }}
                  transition={{ duration: 0.4 }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md"
                >
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  {slide.badge}
                </motion.div>
              </AnimatePresence>

              {/* Back Button */}
              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-black/20 px-3.5 py-2 text-xs font-medium text-white backdrop-blur-md transition hover:bg-white hover:text-zinc-900"
              >
                ← Back
              </button>
            </div>

            {/* Bottom Content */}
            <div className="absolute inset-x-0 bottom-0 z-30 p-8 sm:p-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{
                    opacity: 0,
                    x: 60,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: -40,
                  }}
                  transition={{
                    duration: 0.55,
                    delay: 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="max-w-xl"
                >
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">
                    RealBiz Admin Platform
                  </p>

                  <h2 className="font-sans text-3xl font-semibold leading-tight tracking-tight text-white xl:text-4xl">
                    {slide.title}
                  </h2>

                  <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/75">
                    {slide.description}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Slider Indicators */}
              <div className="mt-8 flex items-center gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className="group py-2"
                  >
                    <span
                      className={`block h-1 rounded-full transition-all duration-500 ${
                        currentSlide === index
                          ? "w-10 bg-white"
                          : "w-4 bg-white/35 group-hover:bg-white/60"
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Footer Metadata */}
              <div className="mt-7 flex items-center justify-between border-t border-white/15 pt-5 text-[10px] uppercase tracking-wider text-white/50">
                <span>Enterprise Grade Security</span>
                <span>RealBiz Admin Portal</span>
              </div>
            </div>
          </div>

          {/* ===================================================== */}
          {/* RIGHT SIDE - LOGIN FORM                               */}
          {/* ===================================================== */}

          <div className="flex min-h-[680px] flex-col justify-center bg-white p-8 sm:p-12">
            <div className="mx-auto w-full max-w-md">
              {/* Form Header */}
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
                  Welcome back
                </h1>

                <p className="text-sm text-zinc-600">
                  Enter your credentials to access your admin dashboard.
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={submit} className="mt-8 space-y-4">
                {/* Email */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="text-xs font-medium uppercase tracking-wider text-zinc-500"
                  >
                    Work Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 disabled:cursor-not-allowed disabled:bg-zinc-50"
                    placeholder="you@realbiz.com"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="password"
                    className="text-xs font-medium uppercase tracking-wider text-zinc-500"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 disabled:cursor-not-allowed disabled:bg-zinc-50"
                    placeholder="••••••••"
                  />
                </div>

                {/* Error */}
                {error ? (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600"
                  >
                    {error}
                  </motion.div>
                ) : null}

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-zinc-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span>
                    {isSubmitting ? "Logging in..." : "Sign In to Admin"}
                  </span>

                  {!isSubmitting && (
                    <span className="transition group-hover:translate-x-1">
                      →
                    </span>
                  )}
                </button>
              </form>

              {/* Bottom Links */}
              <div className="mt-8 flex items-center justify-between border-t border-zinc-200 pt-6">
                <Link
                  href="/"
                  className="text-xs font-medium text-zinc-600 transition hover:text-zinc-950"
                >
                  ← Return to main site
                </Link>

                <span className="text-xs text-zinc-400">Admin Portal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
