"use client";

import { useLanguage } from "@/lib/language";
import { useTheme } from "@/lib/theme";
import { ArrowUpRight } from "lucide-react";

const FALLBACK_PRIMARY = "#D4A72C";

export default function JoinAsPartner() {
  const { t } = useLanguage();
  const { primaryColor, theme } = useTheme();

  const brandColor = primaryColor || FALLBACK_PRIMARY;
  const isDark = theme === "dark";

  return (
    <section
      className={`relative w-full overflow-hidden pb-16 transition-colors duration-300 ${
        isDark ? "bg-[#111315]" : "bg-[#f5f5f3]"
      }`}
    >
      {" "}
      <div className="mx-auto max-w-[1340px] px-5 sm:px-8 md:px-12 lg:px-16">
        {/* Main Grid Layout */}
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
          {/* =====================================
          LEFT SIDE: TITLE & TEXT
          ====================================== */}
          <div className="lg:col-span-5">
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
              {t("partner.title") || "Join Us as a Partner"}
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
              {t("partner.description") ||
                "Collaborate with us to build extraordinary real estate ventures. Whether you are looking to invest or partner on landmark developments, we provide the platform for enduring growth."}
            </p>
          </div>

          {/* =====================================
          RIGHT SIDE: CARDS GRID (TWO IMAGES)
          ====================================== */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8">
              {/* CARD 1: For Partners / City View */}
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
                ), url('https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1000&auto=format&fit=crop')`,
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
                    {t("partner.card1.title") || "For Partners"}
                  </h3>

                  <p
                    className="mt-2 text-xs leading-relaxed text-zinc-300 sm:text-sm"
                    style={{
                      fontFamily: "var(--font-inter), Arial, sans-serif",
                    }}
                  >
                    {t("partner.card1.desc") ||
                      "Engage with us to discover our exclusive projects and uncover the perfect property that aligns with your lifestyle and business aspirations."}
                  </p>
                </div>
              </div>

              {/* CARD 2: For Customers / Interior View */}
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
                ), url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop')`,
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
                    {t("partner.card2.title") || "For Customers"}
                  </h3>

                  <p
                    className="mt-2 text-xs leading-relaxed text-zinc-300 sm:text-sm"
                    style={{
                      fontFamily: "var(--font-inter), Arial, sans-serif",
                    }}
                  >
                    {t("partner.card2.desc") ||
                      "Engage with us to discover our exclusive projects and uncover the perfect property that aligns with your lifestyle and business aspirations."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
