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

import { safeNextPath } from "../lib/next-path.ts";

test("safeNextPath: faqat ichki yoʻllar", () => {
  assert.equal(safeNextPath("/klublar/x"), "/klublar/x");
  assert.equal(safeNextPath("//evil.com"), "/");
  assert.equal(safeNextPath("https://evil.com"), "/");
  assert.equal(safeNextPath("/\\evil.com"), "/");
  assert.equal(safeNextPath(undefined), "/");
});

import { checkinOpen } from "../lib/checkin.ts";

test("checkinOpen oynasi", () => {
  const start = "2026-10-10T10:00:00Z";
  assert.equal(checkinOpen(start, new Date("2026-10-10T09:00:00Z")), false);
  assert.equal(checkinOpen(start, new Date("2026-10-10T09:45:00Z")), true);
  assert.equal(checkinOpen(start, new Date("2026-10-10T13:59:00Z")), true);
  assert.equal(checkinOpen(start, new Date("2026-10-10T14:30:00Z")), false);
});

import { tashkentDayEnd } from "../lib/time.ts";

test("tashkentDayEnd", () => {
  // 04:00 UTC = 09:00 Toshkent; kun tugashi = 19:00 UTC.
  assert.equal(tashkentDayEnd(new Date("2026-10-10T04:00:00Z")).toISOString(), "2026-10-10T19:00:00.000Z");
  // 20:00 UTC = 01:00 Toshkent keyingi kun.
  assert.equal(tashkentDayEnd(new Date("2026-10-10T20:00:00Z")).toISOString(), "2026-10-11T19:00:00.000Z");
});

import { matchesFilters, sortOpportunities } from "../lib/opp-filter.ts";
import type { Opportunity } from "../lib/types.ts";

const base: Opportunity = {
  id: "1", title: "x", type: "program", organizer: "o", closes_at: null, age_min: null, age_max: null,
  eligibility: "", region: "Toshkent", official_url: "https://a.b", verified_at: "2026-01-01T00:00:00Z",
  status: "active", is_sample: true,
};

test("opp filtr: yosh oraligʻi kesishishi", () => {
  const o = { ...base, age_min: 15, age_max: 18 };
  assert.equal(matchesFilters(o, { age: "13-15" }), true);
  assert.equal(matchesFilters(o, { age: "16-17" }), true);
  assert.equal(matchesFilters(o, { age: "18-25" }), true);
  assert.equal(matchesFilters({ ...base, age_min: 18 }, { age: "13-15" }), false);
  assert.equal(matchesFilters({ ...base, age_max: 17 }, { age: "18-25" }), false);
  assert.equal(matchesFilters(base, { type: "event" }), false);
  assert.equal(matchesFilters(base, { region: "Toshkent" }), true);
});

test("opp saralash: ochiqlar oldin, yopilganlar oxirida", () => {
  const now = new Date("2026-10-10T00:00:00Z");
  const closed = { ...base, id: "c", closes_at: "2026-10-01T00:00:00Z" };
  const soon = { ...base, id: "s", closes_at: "2026-10-12T00:00:00Z" };
  const later = { ...base, id: "l", closes_at: "2026-12-01T00:00:00Z" };
  const none = { ...base, id: "n", closes_at: null };
  assert.deepEqual(sortOpportunities([closed, none, later, soon], now).map((o) => o.id), ["s", "l", "n", "c"]);
});

import { validateIdea } from "../lib/idea-validate.ts";

test("validateIdea", () => {
  const roles = ["Dasturchi", "Dizayner"];
  const ok = { title: "  Ilova  ", problem: "Muammo matni uzun", description: "Tavsif matni uzun", roles: ["Dasturchi", "Hacker", "Dasturchi"] };
  assert.deepEqual(validateIdea(ok, roles), {
    title: "Ilova", problem: "Muammo matni uzun", description: "Tavsif matni uzun", needed_roles: ["Dasturchi"],
  });
  assert.equal(validateIdea({ ...ok, title: "ab" }, roles), null);
  assert.equal(validateIdea({ ...ok, roles: ["Hacker"] }, roles), null);
  assert.equal(validateIdea({ ...ok, problem: "qisqa" }, roles), null);
});

import { parseUsername } from "../lib/validate.ts";

test("parseUsername", () => {
  assert.equal(parseUsername("@ilyos_01"), "ilyos_01");
  assert.equal(parseUsername(" ilyos "), "ilyos");
  assert.equal(parseUsername("abc"), null);
  assert.equal(parseUsername("1abcde"), null);
  assert.equal(parseUsername("a b c d e"), null);
});
