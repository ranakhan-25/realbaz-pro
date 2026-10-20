"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language";
import { Logo } from "./Logo";
import { MapPin, Phone, Mail } from "lucide-react";

export function SiteFooter() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Copyright / Intro */}
          <div className="lg:col-span-1 flex flex-col items-start">
            <Logo />
            <p className="mt-3 text-xs text-muted-foreground max-w-xs">
              {t("footer.copyright").replace("{year}", year.toString())}
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <nav className="space-y-2">
              <Link
                href="/features"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
              >
                Features
              </Link>
              <Link
                href="/about"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <nav className="space-y-2">
              <Link
                href="/careers"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
              >
                Careers
              </Link>
              <Link
                href="/blog"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
              >
                Blog
              </Link>
              <Link
                href="/press"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors block"
              >
                Press
              </Link>
            </nav>
          </div>

          {/* Bangladesh Address & Contact Info (Updated from images) */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">
              Bangladesh Contact
            </h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-foreground mb-1">
                  Bangladesh Address:
                </p>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                  <span>H-417, R-7, Baridhara DOHS, Dhaka-1206</span>
                </div>
              </div>

              <div className="pt-1">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-primary" />
                  <a
                    href="tel:+8801897621270"
                    className="hover:text-foreground transition-colors"
                  >
                    +8801897-621270
                  </a>
                </div>
              </div>

              <div className="flex flex-col space-y-1 pt-1">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0 text-primary" />
                  <a
                    href="mailto:fleekbangladesh@gmail.com"
                    className="hover:text-foreground transition-colors break-all"
                  >
                    fleekbangladesh@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2 pl-6">
                  <a
                    href="mailto:info@fleek.com.bd"
                    className="hover:text-foreground transition-colors"
                  >
                    info@fleek.com.bd
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Socials */}
        <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {t("footer.copyright").replace("{year}", year.toString())}
          </p>
          <div className="flex items-center gap-6">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Twitter"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
