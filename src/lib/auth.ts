/**
 * Lightweight demo session (browser-only). Swap for Lovable Cloud auth later.
 */
const KEY = "realbiz-session";

export type Session = { name: string; email: string };

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function login(email: string) {
  const name = email
    .split("@")[0]!
    .split(/[._-]/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
  const session: Session = { name: name || "User", email };
  window.localStorage.setItem(KEY, JSON.stringify(session));
  return session;
}

export function logout() {
  window.localStorage.removeItem(KEY);
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
