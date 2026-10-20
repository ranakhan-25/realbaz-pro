"use client";

import { useLanguage } from "@/lib/language";
import { useTheme } from "@/lib/theme";

const FALLBACK_PRIMARY = "#D4A72C";

export default function StorylineLegacy() {
  const { t } = useLanguage();
  const { primaryColor, theme } = useTheme();

  const brandColor = primaryColor || FALLBACK_PRIMARY;
  const isDark = theme === "dark";

  return (
    <section
      className={`relative w-full overflow-hidden py-16 transition-colors duration-300 md:pb-20 lg:pb-24 ${
        isDark ? "bg-[#111315]" : "bg-[#f5f5f3]"
      }`}
    >
      {" "}
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 md:px-12 lg:px-16">
        {" "}
        <div className="relative">
          {/* =========================================
          TOP TITLE & SCRIPT WORD
          ========================================== */}
          <div className="relative z-20 text-center">
            {/* Main Title */}
            <h2
              className={`mb-10
            font-[Playfair_Display,Georgia,serif]
            text-[42px]
            font-normal
            leading-[0.95]
            tracking-[-1px]
            sm:text-[54px]
            md:text-[66px]
            lg:text-[78px]
            transition-colors duration-300
            ${isDark ? "text-white" : "text-[#171b20]"}`}
            >
              {t("storyline.title")}
            </h2>

            {/* Script Word */}
            <div
              className="
            relative
            -mt-3
            ml-[110px]
            inline-block
            sm:ml-[160px]
            md:-mt-6
            md:ml-[220px]
            lg:ml-[280px]
          "
            >
              <span
                className="
              text-[56px]
              font-normal
              leading-none
              sm:text-[72px]
              md:text-[88px]
              lg:text-[102px]
            "
                style={{
                  color: brandColor,
                  fontFamily: "'Allura', cursive",
                }}
              >
                {t("storyline.legacy")}
              </span>
            </div>
          </div>

          {/* =========================================
          CONTENT AREA
          ========================================== */}
          <div className="relative mt-8 md:mt-10 lg:mt-12">
            {/* =====================================
            LARGE CIRCLE BEHIND RIGHT TEXT
            ====================================== */}
            <div
              className="
            absolute
            left-1/2
            top-1/2
            z-0
            h-[300px]
            w-[300px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            opacity-90
            sm:h-[360px]
            sm:w-[360px]
            md:h-[410px]
            md:w-[410px]
            lg:h-[460px]
            lg:w-[460px]
          "
              style={{
                backgroundColor: `${brandColor}18`,
              }}
            />

            {/* =====================================
            TEXT GRID (TWO COLUMNS)
            ====================================== */}
            <div
              className="
            relative
            z-10
            grid
            items-center
            gap-8
            md:grid-cols-2
            md:gap-12
            lg:gap-20
          "
            >
              {/* ===================================
              LEFT TEXT
              ==================================== */}
              <div className="max-w-[390px] md:justify-self-end lg:max-w-[430px]">
                <p
                  className={`font-[Arial,sans-serif]
                text-[11px]
                font-medium
                leading-[1.55]
                sm:text-xs
                md:text-[13px]
                lg:text-[14px]
                transition-colors duration-300
                ${isDark ? "text-zinc-200" : "text-[#25282b]"}`}
                >
                  {t("storyline.description")}
                </p>
              </div>

              {/* ===================================
              RIGHT TEXT
              ==================================== */}
              <div className="max-w-[400px] md:justify-self-start lg:max-w-[430px]">
                <p
                  className={`font-[Arial,sans-serif]
                text-[10px]
                font-normal
                leading-[1.55]
                sm:text-[11px]
                md:text-xs
                lg:text-[13px]
                transition-colors duration-300
                ${isDark ? "text-zinc-300" : "text-[#3d4042]"}`}
                >
                  {t("storyline.content")}
                </p>
              </div>
            </div>
          </div>

          {/* =========================================
          BOTTOM DECORATIVE LINE
          ========================================== */}
          <div className="mx-auto mt-10 flex max-w-[500px] items-center justify-center gap-3 md:mt-14">
            <span
              className="h-px w-10 opacity-40"
              style={{
                backgroundColor: brandColor,
              }}
            />

            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                backgroundColor: brandColor,
              }}
            />

            <span
              className="h-px w-10 opacity-40"
              style={{
                backgroundColor: brandColor,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
