"use client";

import { useEffect, useState } from "react";

import { useLanguage } from "@/lib/language";
import { useTheme } from "@/lib/theme";

interface Slide {
  image: string;
  alt: string;
}

const slides: Slide[] = [
  {
    image: "/assets/dashboard.png",
    alt: "Real estate building",
  },
  {
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    alt: "Modern building",
  },
  {
    image:
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=80",
    alt: "Construction project",
  },
];

const processItems = [
  {
    number: "01",
    title: "solutions.process.01.title",
    subtitle: "solutions.process.01.subtitle",
  },
  {
    number: "02",
    title: "solutions.process.02.title",
    subtitle: "solutions.process.02.subtitle",
  },
  {
    number: "03",
    title: "solutions.process.03.title",
    subtitle: "solutions.process.03.subtitle",
  },
  {
    number: "04",
    title: "solutions.process.04.title",
    subtitle: "solutions.process.04.subtitle",
  },
  {
    number: "05",
    title: "solutions.process.05.title",
    subtitle: "solutions.process.05.subtitle",
  },
  {
    number: "06",
    title: "solutions.process.06.title",
    subtitle: "solutions.process.06.subtitle",
  },
  {
    number: "07",
    title: "solutions.process.07.title",
    subtitle: "solutions.process.07.subtitle",
  },
  {
    number: "08",
    title: "solutions.process.08.title",
    subtitle: "solutions.process.08.subtitle",
  },
  {
    number: "09",
    title: "solutions.process.09.title",
    subtitle: "solutions.process.09.subtitle",
  },
  {
    number: "10",
    title: "solutions.process.10.title",
    subtitle: "solutions.process.10.subtitle",
  },
];

/**
 * Different background color for each process number.
 */
const processColors = [
  "#2ED573",
  "#1E90FF",
  "#FF6B6B",
  "#FFA502",
  "#9B59B6",
  "#00B894",
  "#E84393",
  "#6C5CE7",
  "#00CEC9",
  "#F39C12",
];

const FALLBACK_PRIMARY = "#2ed573";

export default function ConstructionRealEstate() {
  const { t } = useLanguage();
  const { primaryColor } = useTheme();

  const brandColor = primaryColor || FALLBACK_PRIMARY;

  const [currentSlide, setCurrentSlide] = useState(0);

  /**
   * ==============================
   * AUTO SLIDE
   * Every 5 seconds
   * ==============================
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  /**
   * ==============================
   * PREVIOUS SLIDE
   * ==============================
   */
  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  /**
   * ==============================
   * NEXT SLIDE
   * ==============================
   */
  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section
      className="w-full overflow-hidden py-8 md:py-12"
      style={{
        background: `linear-gradient(
          to bottom right,
          ${brandColor}08,
          #ffffff,
          ${brandColor}10
        )`,
      }}
    >
      <div className="mx-auto max-w-[1270px] px-4 md:px-8 lg:px-10">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1fr] lg:gap-10">
          {/* =====================================================
          {/* LEFT SIDE */}
          <div className="w-full">
            {/* Eyebrow */}
            <p className="mb-1.5 font-[var(--font-hind-siliguri)] text-xs font-medium text-gray-600 md:text-sm">
              {t("solutions.construction.eyebrow")}
            </p>

            {/* Title */}
            <h2 className="font-[var(--font-hind-siliguri)] text-[24px] font-bold leading-16 text-[#111827] sm:text-[28px] md:text-[32px] lg:text-[36px]">
              {t("solutions.construction.title")}
            </h2>

            {/* Subtitle */}
            <p className="mt-2 font-[var(--font-hind-siliguri)] text-xs leading-7 text-gray-700 md:text-sm md:leading-7">
              {t("solutions.construction.subtitle")}
            </p>

            {/* Description */}
            <p className="mt-2 max-w-xl font-[var(--font-hind-siliguri)] text-[9px] leading-5 text-gray-600 sm:text-[10px] sm:leading-5 md:text-xs md:leading-6">
              <span
                className="font-bold"
                style={{
                  color: brandColor,
                }}
              >
                {t("solutions.construction.brand")}
              </span>{" "}
              {t("solutions.construction.description")}
            </p>

            {/* PROCESS */}
            <div className="relative my-9 hidden sm:block">
              {/* Connecting horizontal line */}
              <div
                className="absolute left-[18px] right-[18px] top-[14px] h-px"
                style={{
                  backgroundColor: `${brandColor}50`,
                }}
              />

              <div className="relative grid grid-cols-5 gap-y-5 md:grid-cols-10 md:gap-1">
                {processItems.map((item, index) => {
                  const isEven = index % 2 === 1;

                  return (
                    <div
                      key={item.number}
                      className={`relative flex flex-col items-center ${
                        isEven ? "md:mt-6" : ""
                      }`}
                    >
                      {/* Number Circle */}
                      <div
                        className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold text-white shadow-sm transition-transform duration-300 hover:scale-110 md:h-8 md:w-8 md:text-[11px]"
                        style={{
                          backgroundColor:
                            processColors[index % processColors.length],
                        }}
                      >
                        {item.number}
                      </div>

                      {/* Vertical line */}
                      <div
                        className="h-4 w-px"
                        style={{
                          backgroundColor: `${brandColor}50`,
                        }}
                      />

                      {/* Label */}
                      <div className="text-center">
                        <p className="whitespace-nowrap font-[var(--font-hind-siliguri)] text-[6px] font-medium leading-tight text-gray-700 md:text-[7px]">
                          {t(item.title)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* BUTTONS */}
            <div className="mt-5 flex flex-wrap gap-2">
              {/* Demo Button */}
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-md px-3.5 py-2 font-[var(--font-hind-siliguri)] text-xs font-semibold text-white shadow-sm transition hover:scale-[1.02] hover:shadow-md"
                style={{
                  backgroundColor: brandColor,
                }}
              >
                <span>▣</span>
                {t("solutions.construction.demoButton")}
              </button>

              {/* Learn More Button */}
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-md border bg-white px-3.5 py-2 font-[var(--font-hind-siliguri)] text-xs font-semibold transition hover:opacity-90"
                style={{
                  borderColor: `${brandColor}60`,
                  color: brandColor,
                }}
              >
                <span>◷</span>
                {t("solutions.construction.learnMoreButton")}
              </button>
            </div>
          </div>

          {/* =====================================================
              RIGHT SIDE - IMAGE SLIDER
          ====================================================== */}
          <div className="relative w-full">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
              {/* =================================================
                  IMAGES
              ================================================== */}
              <div className="absolute inset-0">
                {slides.map((slide, index) => {
                  const isActive = index === currentSlide;

                  return (
                    <div
                      key={slide.image}
                      className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                        isActive
                          ? "translate-x-0 opacity-100"
                          : index < currentSlide
                            ? "-translate-x-full opacity-0"
                            : "translate-x-full opacity-0"
                      }`}
                    >
                      <img
                        src={slide.image}
                        alt={slide.alt}
                        className="h-full w-full object-cover"
                      />

                      {/* Image Overlay */}
                      <div className="absolute inset-0 bg-black/5" />
                    </div>
                  );
                })}
              </div>

              {/* =================================================
                  PREVIOUS BUTTON
              ================================================== */}
              <button
                type="button"
                onClick={goToPrevious}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-lg text-gray-700 shadow-sm backdrop-blur transition hover:scale-105 hover:bg-white md:left-3 md:h-10 md:w-10"
              >
                ‹
              </button>

              {/* =================================================
                  NEXT BUTTON
              ================================================== */}
              <button
                type="button"
                onClick={goToNext}
                aria-label="Next image"
                className="absolute right-2 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-lg text-gray-700 shadow-sm backdrop-blur transition hover:scale-105 hover:bg-white md:right-3 md:h-10 md:w-10"
              >
                ›
              </button>

              {/* =================================================
                  SLIDER DOTS
              ================================================== */}
              <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2">
                {slides.map((slide, index) => (
                  <button
                    key={slide.image}
                    type="button"
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentSlide === index ? "w-6" : "w-2 bg-white/60"
                    }`}
                    style={
                      currentSlide === index
                        ? {
                            backgroundColor: brandColor,
                          }
                        : undefined
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
