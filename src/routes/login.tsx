import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { getSession, login } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — RealBiz" },
      {
        name: "description",
        content: "Sign in to your RealBiz workspace to manage projects, accounts, HRM and CRM.",
      },
      { property: "og:title", content: "Log in — RealBiz" },
      { property: "og:description", content: "Sign in to your RealBiz workspace." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (getSession()) navigate({ to: "/dashboard", replace: true });
  }, [navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@") || password.length < 4) {
      setError("Enter a valid email and a password of at least 4 characters.");
      return;
    }
    login(email);
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute -right-24 top-0 hidden h-[140%] w-[45%] -skew-x-12 bg-primary lg:block" />
      <div className="pointer-events-none absolute right-[42%] top-0 hidden h-[140%] w-16 -skew-x-12 bg-accent lg:block" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-5 sm:px-8">
        <div className="w-full max-w-md">
          <Logo />
          <h1 className="mt-10 font-display text-4xl font-bold leading-[0.95] tracking-tight">
            Welcome back.
            <br />
            <span className="text-accent">Open your deck.</span>
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Demo mode — any email and password (4+ characters) signs you in.
          </p>
          <form onSubmit={submit} className="mt-8 space-y-4">
            <div>
              <label
                htmlFor="email"
                className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-md border border-input bg-card px-3 py-2.5 text-sm outline-none transition focus:border-accent"
                placeholder="you@realbiz.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 w-full rounded-md border border-input bg-card px-3 py-2.5 text-sm outline-none transition focus:border-accent"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button
              type="submit"
              className="group inline-flex w-full items-center justify-center gap-3 rounded-md bg-accent px-6 py-3.5 font-bold text-accent-foreground transition hover:opacity-90"
            >
              <span className="inline-block -skew-x-12">Log in</span>
              <span className="transition group-hover:translate-x-1">→</span>
            </button>
          </form>
          <Link
            to="/"
            className="mt-6 inline-block text-sm font-semibold text-foreground/70 hover:text-foreground"
          >
            ← Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}
