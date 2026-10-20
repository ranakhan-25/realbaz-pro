"use client";

import { useLanguage } from "@/lib/language";
import { useTheme } from "@/lib/theme";
import { ArrowUpRight } from "lucide-react";

const FALLBACK_PRIMARY = "#D4A72C";

export default function JoinAsBuyer() {
  const { t } = useLanguage();
  const { primaryColor, theme } = useTheme();

  const brandColor = primaryColor || FALLBACK_PRIMARY;
  const isDark = theme === "dark";

  return (
    <section
      className={`relative w-full overflow-hidden transition-colors duration-300 ${
        isDark ? "bg-[#111315]" : "bg-[#f5f5f3]"
      }`}
    >
      {" "}
      <div className="mx-auto max-w-[1340px] px-5 sm:px-8 md:px-12 lg:px-16">
        {/* Main Grid Layout */}{" "}
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
          {/* =====================================
          LEFT SIDE: CARDS GRID (TWO IMAGES)
          ====================================== */}
          <div className="order-2 lg:col-span-7 lg:order-1">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8">
              {/* CARD 1: Luxury Living View */}
              <div className="group relative h-[420px] w-full overflow-hidden rounded-2xl bg-neutral-900 sm:h-[480px]">
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage: `linear-gradient(
                  to top,
                  rgba(0,0,0,0.85) 0%,
                  rgba(0,0,0,0.2) 50%,
                  rgba(0,0,0,0.1) 100%
                ), url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1000&auto=format&fit=crop')`,
                  }}
                />

                {/* Top-Right Arrow Icon */}
                <div className="absolute right-5 top-5 z-10">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 backdrop-blur-md transition-all duration-300 group-hover:scale-110"
                    style={{
                      color: "#fff",
                      backgroundColor: `${brandColor}33`,
                    }}
                  >
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                </div>

                {/* Bottom Content */}
                <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-8">
                  <h3
                    className="text-xl font-medium text-white sm:text-2xl"
                    style={{
                      fontFamily:
                        "var(--font-playfair), Playfair Display, Georgia, serif",
                    }}
                  >
                    {t("buyer.card1.title") || "Prime Locations"}
                  </h3>

                  <p
                    className="mt-2 text-xs leading-relaxed text-zinc-300 sm:text-sm"
                    style={{
                      fontFamily: "var(--font-inter), Arial, sans-serif",
                    }}
                  >
                    {t("buyer.card1.desc") ||
                      "Explore handpicked residential spaces situated in the most sought-after neighborhoods tailored for your comfort."}
                  </p>
                </div>
              </div>

              {/* CARD 2: Modern Interior View */}
              <div className="group relative h-[420px] w-full overflow-hidden rounded-2xl bg-neutral-900 sm:mt-12 sm:h-[480px]">
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage: `linear-gradient(
                  to top,
                  rgba(0,0,0,0.85) 0%,
                  rgba(0,0,0,0.2) 50%,
                  rgba(0,0,0,0.1) 100%
                ), url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1000&auto=format&fit=crop')`,
                  }}
                />

                {/* Top-Right Arrow Icon */}
                <div className="absolute right-5 top-5 z-10">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 backdrop-blur-md transition-all duration-300 group-hover:scale-110"
                    style={{
                      color: "#fff",
                      backgroundColor: `${brandColor}33`,
                    }}
                  >
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                </div>

                {/* Bottom Content */}
                <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-8">
                  <h3
                    className="text-xl font-medium text-white sm:text-2xl"
                    style={{
                      fontFamily:
                        "var(--font-playfair), Playfair Display, Georgia, serif",
                    }}
                  >
                    {t("buyer.card2.title") || "Exclusive Homes"}
                  </h3>

                  <p
                    className="mt-2 text-xs leading-relaxed text-zinc-300 sm:text-sm"
                    style={{
                      fontFamily: "var(--font-inter), Arial, sans-serif",
                    }}
                  >
                    {t("buyer.card2.desc") ||
                      "Uncover elegant architecture and contemporary designs built to elevate your everyday living standard."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================
          RIGHT SIDE: TITLE & TEXT
          ====================================== */}
          <div className="order-1 lg:col-span-5 lg:order-2 lg:pl-6">
            <h2
              className={`text-[42px]
            font-normal
            leading-[1.05]
            tracking-[-1px]
            sm:text-[52px]
            md:text-[62px]
            lg:text-[70px]
            font-[family-name:var(--font-script)]
            transition-colors duration-300
            ${isDark ? "text-white" : "text-[#171b20]"}`}
            >
              {t("buyer.title") || "Join Us as a Buyer"}
            </h2>

            <p
              className={`mt-6
            max-w-[420px]
            text-xs
            font-normal
            leading-[1.6]
            sm:text-sm
            md:text-[15px]
            transition-colors duration-300
            ${isDark ? "text-zinc-300" : "text-[#4a4e51]"}`}
              style={{
                fontFamily: "var(--font-inter), Arial, sans-serif",
              }}
            >
              {t("buyer.description") ||
                "Step into your dream property with confidence. Discover our curated collection of exceptional residential and commercial spaces designed to match your lifestyle and future aspirations."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
