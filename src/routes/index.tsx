import { Link, createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteNav";
import { PropertyCard, PROPERTIES } from "@/components/site/PropertyCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RealBiz — Real Estate Operating System" },
      {
        name: "description",
        content:
          "RealBiz unifies projects, inventory, accounts, HRM and CRM for real estate developers in one command deck.",
      },
      { property: "og:title", content: "RealBiz — Real Estate Operating System" },
      {
        property: "og:description",
        content: "Projects, inventory, accounts, HRM and CRM for real estate developers — unified.",
      },
    ],
  }),
  component: HomePage,
});

const STATS = [
  { v: "1.42M", l: "sq ft under management" },
  { v: "38", l: "active projects" },
  { v: "৳ 2.6B", l: "revenue tracked" },
  { v: "99.2%", l: "on-time delivery" },
];

function HomePage() {
  return (
    <SiteShell>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-24 top-0 h-[140%] w-[55%] -skew-x-12 bg-primary" />
        <div className="pointer-events-none absolute right-[42%] top-0 hidden h-[140%] w-20 -skew-x-12 bg-accent md:block" />
        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/50 bg-accent/10 px-3 py-1">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em]">
                Live · Dhaka, BD
              </span>
            </div>
            <h1 className="mt-6 font-display text-5xl font-bold leading-[0.92] tracking-tight sm:text-6xl lg:text-7xl">
              Build the city.
              <br />
              <span className="text-accent">Own the outcome.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-foreground/70">
              RealBiz is the operating system for real estate — projects, inventory, accounts, HRM
              and CRM unified in one high-signal command deck.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/properties"
                className="group inline-flex items-center gap-3 rounded-md bg-accent px-6 py-3.5 font-bold text-accent-foreground"
              >
                <span className="inline-block -skew-x-12">Explore properties</span>
                <span className="transition group-hover:translate-x-1">→</span>
              </Link>
              <Link
                to="/login"
                className="rounded-md border border-foreground/20 px-6 py-3.5 font-semibold transition hover:bg-primary hover:text-primary-foreground"
              >
                Open dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-primary-foreground/10 px-5 sm:px-8 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.l} className="px-6 py-8">
              <div className="font-mono text-3xl text-accent">{s.v}</div>
              <div className="mt-1 text-sm text-primary-foreground/60">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl font-bold tracking-tight">Featured developments</h2>
          <Link to="/properties" className="nav-active hidden text-sm font-semibold sm:block">
            View all →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {PROPERTIES.map((p) => (
            <PropertyCard key={p.name} {...p} />
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
