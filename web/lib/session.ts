import { jwtVerify, SignJWT } from "jose";

export const SESSION_COOKIE = "yb_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

function key(secret = process.env.SESSION_SECRET) {
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET kamida 32 belgidan iborat boʻlishi kerak");
  }
  return new TextEncoder().encode(secret);
}

// JWT ichida faqat ichki user id (uuid) bor. Telegram ID hech qachon cookie'ga yozilmaydi.
export async function signSession(userId: string, secret?: string): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(key(secret));
}

export async function verifySession(token: string, secret?: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, key(secret), { algorithms: ["HS256"] });
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}
