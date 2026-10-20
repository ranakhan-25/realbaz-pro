/* eslint-disable prettier/prettier */
import type { Metadata } from "next";
import {
  Inter,
  JetBrains_Mono,
  Petit_Formal_Script,
  Playfair_Display,
  Space_Grotesk,
  Hind_Siliguri,
  Allura, // ১. এখানে Allura ইমপোর্ট করা হলো
} from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "@/lib/theme";
import { LanguageProvider } from "@/lib/language";
import { LayoutShell } from "@/components/layout-shell";
import FloatingContact from "@/components/home/floating-contact";
import { Toaster } from "react-hot-toast";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const petitFormalScript = Petit_Formal_Script({
  variable: "--font-petit-formal-script",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

// ২. এখানে Allura ফন্ট কনফিগার করা হলো
const allura = Allura({
  variable: "--font-allura",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

// Bangla Font
const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RealBiz Pro",
  description: "RealBiz Pro Enterprise Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${playfairDisplay.variable} ${petitFormalScript.variable} ${allura.variable} ${hindSiliguri.variable} h-full light`}
      suppressHydrationWarning
    >
      <body className="min-h-full antialiased" suppressHydrationWarning>
        <LanguageProvider>
          <ThemeProvider>
            <LayoutShell>
              {children}
              <FloatingContact />
            </LayoutShell>
            <Toaster position="top-right" />
            <SonnerToaster position="top-right" />
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
