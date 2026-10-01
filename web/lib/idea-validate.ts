import { cleanText } from "./validate.ts";

export const MAX_PENDING_IDEAS = 3;

export type IdeaInput = {
  title: string;
  problem: string;
  description: string;
  needed_roles: string[];
};

// Gʻoya maydonlarini tozalaydi va uzunlikni tekshiradi. Notoʻgʻri boʻlsa null.
export function validateIdea(
  raw: { title: string; problem: string; description: string; roles: string[] },
  allowedRoles: readonly string[],
): IdeaInput | null {
  const title = cleanText(raw.title, 80).replace(/\n/g, " ");
  const problem = cleanText(raw.problem, 500);
  const description = cleanText(raw.description, 2000);
  if (title.length < 3 || problem.length < 10 || description.length < 10) return null;
  const needed_roles = [...new Set(raw.roles.filter((r) => allowedRoles.includes(r)))];
  if (needed_roles.length === 0) return null;
  return { title, problem, description, needed_roles };
}
