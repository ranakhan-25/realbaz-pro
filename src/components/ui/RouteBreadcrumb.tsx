"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { usePathname } from "next/navigation";

const formatLabel = (value: string) => {
  return value.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

export function RouteBreadcrumb() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-1 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground "
    >
      <Link
        href="/dashboard"
        className="flex items-center gap-1 transition-colors hover:text-foreground"
      >
        <Home className="h-3 w-3" />
        Dashboard
      </Link>

      {segments
        .filter((segment) => segment !== "dashboard")
        .map((segment, index, filteredSegments) => {
          const href = "/dashboard/" + filteredSegments.slice(0, index + 1).join("/");

          const isLast = index === filteredSegments.length - 1;

          return (
            <React.Fragment key={`${segment}-${index}`}>
              <ChevronRight className="h-3 w-3" />

              {isLast ? (
                <span className="text-foreground">{formatLabel(segment)}</span>
              ) : (
                <Link href={href} className="transition-colors hover:text-foreground">
                  {formatLabel(segment)}
                </Link>
              )}
            </React.Fragment>
          );
        })}
    </nav>
  );
}
