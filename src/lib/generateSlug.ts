export function generateSlug(text: string): string {
  if (!text) return "";
  const slug = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug ? `/${slug}` : "";
}
