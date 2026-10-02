// Kirgandan keyin qaytish yoʻli: faqat sayt ichidagi nisbiy yoʻl (open redirect yoʻq).
export const NEXT_COOKIE = "yb_next";

export function safeNextPath(v: unknown): string {
  if (typeof v !== "string") return "/";
  if (!v.startsWith("/") || v.startsWith("//") || v.includes("\\") || /[\u0000-\u001f]/.test(v)) {
    return "/";
  }
  return v.slice(0, 200);
}
