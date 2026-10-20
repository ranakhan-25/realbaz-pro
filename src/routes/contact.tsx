import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/site/SiteNav";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — RealBiz" },
      {
        name: "description",
        content: "Talk to the RealBiz team about a property, a project or a partnership.",
      },
      { property: "og:title", content: "Contact — RealBiz" },
      { property: "og:description", content: "Talk to the RealBiz team." },
    ],
  }),
  component: ContactPage,
});

const inputCls =
  "mt-1.5 w-full rounded-md border border-input bg-card px-3 py-2.5 text-sm outline-none transition focus:border-accent";

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <SiteShell>
      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2">
        <div>
          <span className="chip-kinetic">Contact</span>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Let's talk.
          </h1>
          <p className="mt-4 max-w-md text-foreground/70">
            Property enquiries, project partnerships or a dashboard demo — we reply within one
            business day.
          </p>
          <dl className="mt-8 space-y-3 text-sm">
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Office
              </dt>
              <dd className="mt-1">Gulshan Avenue, Dhaka 1212, Bangladesh</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Email
              </dt>
              <dd className="mt-1 font-mono">hello@realbiz.com</dd>
            </div>
          </dl>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="rounded-xl border border-border bg-card p-6"
        >
          {sent ? (
            <p className="font-display text-lg font-semibold">
              Thanks — we'll be in touch shortly.
            </p>
          ) : (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground"
                >
                  Name
                </label>
                <input id="name" required className={inputCls} />
              </div>
              <div>
                <label
                  htmlFor="cemail"
                  className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground"
                >
                  Email
                </label>
                <input id="cemail" type="email" required className={inputCls} />
              </div>
              <div>
                <label
                  htmlFor="msg"
                  className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground"
                >
                  Message
                </label>
                <textarea id="msg" rows={5} required className={inputCls} />
              </div>
              <button className="group inline-flex items-center gap-3 rounded-md bg-accent px-6 py-3 font-bold text-accent-foreground">
                <span className="inline-block -skew-x-12">Send message</span>
                <span className="transition group-hover:translate-x-1">→</span>
              </button>
            </div>
          )}
        </form>
      </section>
    </SiteShell>
  );
}
