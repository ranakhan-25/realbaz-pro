import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5 text-center">
      <div className="max-w-md">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">404</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight">Page not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you were looking for does not exist or has moved.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
