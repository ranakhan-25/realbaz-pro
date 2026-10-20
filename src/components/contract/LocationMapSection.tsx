"use client";

import { useLanguage } from "@/lib/language";
import { useTheme } from "@/lib/theme";
import { MapPin, Building2, Phone, Mail } from "lucide-react";

const FALLBACK_PRIMARY = "#D4A72C";

export default function LocationMapSection() {
  const { t } = useLanguage();
  const { primaryColor, theme } = useTheme();

  const brandColor = primaryColor || FALLBACK_PRIMARY;
  const isDark = theme === "dark";

  // Baridhara DOHS coordinates / embed query
  const addressQuery = "House 417, Road 7, Baridhara DOHS, Dhaka 1206";

  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    addressQuery,
  )}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <section
      className={`relative w-full overflow-hidden pb-16 transition-colors duration-300 md:pb-24 lg:pb-28 ${
        isDark ? "bg-[#111315]" : "bg-[#f5f5f3]"
      }`}
    >
      {" "}
      <div className="mx-auto max-w-[1340px] px-5 sm:px-8 md:px-12 lg:px-16">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <span
            className="text-xs font-semibold uppercase tracking-widest"
            style={{
              color: brandColor,
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            {t("location.subtitle") || "Our Location"}
          </span>

          <h2
            className={`mt-2 text-[36px] font-normal leading-tight tracking-[-1px] transition-colors duration-300 sm:text-[44px] md:text-[52px] ${
              isDark ? "text-white" : "text-[#171b20]"
            }`}
            style={{
              fontFamily:
                "var(--font-playfair), Playfair Display, Georgia, serif",
            }}
          >
            {t("location.title") || "Visit Our Bangladesh Office"}
          </h2>
        </div>

        {/* Main Card Container */}
        <div
          className={`grid grid-cols-1 overflow-hidden rounded-3xl shadow-xl transition-colors duration-300 lg:grid-cols-12 ${
            isDark ? "bg-[#1a1d20]" : "bg-white"
          }`}
        >
          {/* LEFT SIDE: Address & Details */}
          <div className="flex flex-col justify-between p-8 sm:p-10 lg:col-span-5 lg:p-12">
            <div>
              <div
                className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium"
                style={{
                  backgroundColor: `${brandColor}15`,
                  color: brandColor,
                  fontFamily: "var(--font-inter), sans-serif",
                }}
              >
                <Building2 className="h-4 w-4" />
                <span>Bangladesh Address</span>
              </div>

              <h3
                className={`text-2xl font-medium transition-colors duration-300 sm:text-3xl ${
                  isDark ? "text-white" : "text-[#171b20]"
                }`}
                style={{
                  fontFamily:
                    "var(--font-playfair), Playfair Display, Georgia, serif",
                }}
              >
                RealBiz Pro HQ
              </h3>

              {/* Exact Address Box */}
              <div
                className={`mt-6 flex items-start gap-4 rounded-2xl border p-5 transition-colors duration-300 ${
                  isDark
                    ? "border-white/10 bg-[#22262a]"
                    : "border-neutral-200/60 bg-[#f9f9f8]"
                }`}
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-md"
                  style={{
                    backgroundColor: brandColor,
                  }}
                >
                  <MapPin className="h-5 w-5" />
                </div>

                <div>
                  <h4
                    className={`text-sm font-semibold transition-colors duration-300 ${
                      isDark ? "text-white" : "text-neutral-900"
                    }`}
                  >
                    Baridhara DOHS Office
                  </h4>

                  <p
                    className={`mt-1 text-sm leading-relaxed transition-colors duration-300 ${
                      isDark ? "text-zinc-300" : "text-neutral-600"
                    }`}
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                    }}
                  >
                    House-417, Road-7
                    <br />
                    Baridhara DOHS, Dhaka-1206
                    <br />
                    Bangladesh
                  </p>
                </div>
              </div>
            </div>

            {/* Action / Direction Button */}
            <div
              className={`mt-8 border-t pt-6 transition-colors duration-300 ${
                isDark ? "border-white/10" : "border-neutral-100"
              }`}
            >
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(
                  addressQuery,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:opacity-90"
                style={{
                  backgroundColor: brandColor,
                  fontFamily: "var(--font-inter), sans-serif",
                }}
              >
                <MapPin className="h-4 w-4" />
                <span>Get Directions on Google Maps</span>
              </a>
            </div>
          </div>

          {/* RIGHT SIDE: Interactive Google Map */}
          <div className="relative min-h-[350px] w-full bg-neutral-200 lg:col-span-7 lg:min-h-[450px]">
            <iframe
              title="Baridhara DOHS Office Map"
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full grayscale-[25%] contrast-[105%]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
