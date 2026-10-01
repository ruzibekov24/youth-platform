import "server-only";
import { db } from "./db";
import { hashToken, isWellFormedToken, LOGIN_TTL_MS, newLoginToken } from "./login-token";

export async function createLoginToken(): Promise<string> {
  const token = newLoginToken();
  const r = await db().from("login_tokens").insert({
    token_hash: hashToken(token),
    expires_at: new Date(Date.now() + LOGIN_TTL_MS).toISOString(),
  });
  if (r.error) throw r.error;
  return token;
}

export type LoginStatus = "pending" | "ready" | "expired";

export async function getLoginStatus(token: string): Promise<LoginStatus> {
  if (!isWellFormedToken(token)) return "expired";
  const r = await db()
    .from("login_tokens")
    .select("confirmed_at, consumed_at, expires_at")
    .eq("token_hash", hashToken(token))
    .maybeSingle();
  if (r.error) throw r.error;
  const row = r.data;
  if (!row || row.consumed_at || new Date(row.expires_at) < new Date()) return "expired";
  return row.confirmed_at ? "ready" : "pending";
}

// Bot /start <token> yuborganda: token foydalanuvchiga bogʻlanadi.
// Savollar tugagan boʻlsa darhol tasdiqlanadi.
export async function attachToken(
  token: string,
  userId: string,
  confirmNow: boolean,
): Promise<boolean> {
  if (!isWellFormedToken(token)) return false;
  const r = await db()
    .from("login_tokens")
    .update({
      user_id: userId,
      confirmed_at: confirmNow ? new Date().toISOString() : null,
    })
    .eq("token_hash", hashToken(token))
    .is("consumed_at", null)
    .is("user_id", null)
    .gt("expires_at", new Date().toISOString())
    .select("token_hash");
  if (r.error) throw r.error;
  return (r.data?.length ?? 0) > 0;
}

// Savollar tugagach, shu foydalanuvchining kutayotgan tokenlari tasdiqlanadi.
export async function confirmPendingTokens(userId: string): Promise<void> {
  const r = await db()
    .from("login_tokens")
    .update({ confirmed_at: new Date().toISOString() })
    .eq("user_id", userId)
    .is("confirmed_at", null)
    .is("consumed_at", null)
    .gt("expires_at", new Date().toISOString());
  if (r.error) throw r.error;
}

// Token bir martalik: faqat tasdiqlangan va hali ishlatilmagan token user_id qaytaradi.
export async function consumeToken(token: string): Promise<string | null> {
  if (!isWellFormedToken(token)) return null;
  const r = await db()
    .from("login_tokens")
    .update({ consumed_at: new Date().toISOString() })
    .eq("token_hash", hashToken(token))
    .not("confirmed_at", "is", null)
    .is("consumed_at", null)
    .gt("expires_at", new Date().toISOString())
    .select("user_id");
  if (r.error) throw r.error;
  return r.data?.[0]?.user_id ?? null;
}
