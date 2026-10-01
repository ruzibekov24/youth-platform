import assert from "node:assert/strict";
import { test } from "node:test";
import { hashToken, isWellFormedToken, newLoginToken } from "../lib/login-token.ts";
import { signSession, verifySession } from "../lib/session.ts";
import { ageGroupOf, sanitizeName } from "../lib/validate.ts";

const secret = "x".repeat(40);

test("session: imzolangan token qaytadan oʻqiladi, buzilgani rad etiladi", async () => {
  const jwt = await signSession("user-1", secret);
  assert.equal(await verifySession(jwt, secret), "user-1");
  assert.equal(await verifySession(jwt + "a", secret), null);
  assert.equal(await verifySession(jwt, "y".repeat(40)), null);
});

test("session: qisqa sir rad etiladi", async () => {
  await assert.rejects(() => signSession("u", "short"));
});

test("login token: format va hash", () => {
  const t = newLoginToken();
  assert.ok(isWellFormedToken(t));
  assert.notEqual(newLoginToken(), t);
  assert.equal(hashToken(t).length, 64);
  assert.ok(!isWellFormedToken("abc"));
});

test("sanitizeName", () => {
  assert.equal(sanitizeName("  Ilyos  "), "Ilyos");
  assert.equal(sanitizeName("Oʻktam"), "Oʻktam");
  assert.equal(sanitizeName("Анна-Мария"), "Анна-Мария");
  assert.equal(sanitizeName(""), null);
  assert.equal(sanitizeName("@user"), null);
  assert.equal(sanitizeName("+998901234567"), null);
  assert.equal(sanitizeName("t.me/abc"), null);
  assert.equal(sanitizeName("a".repeat(41)), null);
  assert.equal(sanitizeName("<b>x</b>"), null);
});

test("ageGroupOf", () => {
  assert.equal(ageGroupOf("13-15"), "under18");
  assert.equal(ageGroupOf("16-17"), "under18");
  assert.equal(ageGroupOf("18-25"), "adult");
});
