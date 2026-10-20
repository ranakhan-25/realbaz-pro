import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteNav";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — RealBiz" },
      {
        name: "description",
        content:
          "RealBiz builds and operates real estate with one integrated system for projects, finance and people.",
      },
      { property: "og:title", content: "About — RealBiz" },
      {
        property: "og:description",
        content: "One integrated system for projects, finance and people.",
      },
    ],
  }),
  component: AboutPage,
});

const PILLARS = [
  [
    "Projects",
    "Sites, contracts, investments, shares and billing tracked from ground-break to handover.",
  ],
  ["Finance", "Vouchers, ledgers, bank reconciliation and credit realisation in one book."],
  ["People", "HRM, attendance, payroll and KPI for every team on every site."],
  ["Sales", "CRM leads, calls, visits and flat/land sales with collection reports."],
];

function AboutPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <span className="chip-kinetic">About</span>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold leading-[0.95] tracking-tight sm:text-5xl">
          Built for operators, <span className="text-accent">not just owners.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-foreground/70">
          RealBiz is a Dhaka-based developer running residential, commercial and mixed-use projects
          on a single operating system — so every requisition, voucher and sale is visible the
          moment it happens.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {PILLARS.map(([t, d]) => (
            <div key={t} className="rounded-xl border border-border bg-card p-6">
              <div className="font-display text-xl font-semibold">{t}</div>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
