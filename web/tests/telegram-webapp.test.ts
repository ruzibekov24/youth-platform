import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { verifyInitData } from "../lib/telegram-webapp.ts";

const token = "123456:TEST-token";
const now = 1_800_000_000;

// Telegram qanday imzolasa, testda ham xuddi shunday imzolaymiz.
function sign(fields: Record<string, string>, botToken = token): string {
  const check = Object.keys(fields)
    .sort()
    .map((k) => `${k}=${fields[k]}`)
    .join("\n");
  const secret = createHmac("sha256", "WebAppData").update(botToken).digest();
  const hash = createHmac("sha256", secret).update(check).digest("hex");
  return new URLSearchParams({ ...fields, hash }).toString();
}

const base = { auth_date: String(now - 60), query_id: "AAE", user: JSON.stringify({ id: 42, first_name: "Ali" }) };

test("initData: to'g'ri imzo Telegram ID qaytaradi", () => {
  assert.deepEqual(verifyInitData(sign(base), token, now), { telegramId: 42 });
});

test("initData: o'zgartirilgan maydon rad etiladi", () => {
  const forged = sign(base).replace("%22id%22%3A42", "%22id%22%3A43");
  assert.equal(verifyInitData(forged, token, now), null);
});

test("initData: boshqa bot tokeni bilan imzolangani rad etiladi", () => {
  assert.equal(verifyInitData(sign(base, "999:other"), token, now), null);
});

test("initData: eskirgan (24 soatdan ortiq) rad etiladi", () => {
  assert.equal(verifyInitData(sign({ ...base, auth_date: String(now - 90_000) }), token, now), null);
});

test("initData: hash yoki user bo'lmasa rad etiladi", () => {
  assert.equal(verifyInitData("auth_date=1&user=%7B%7D", token, now), null);
  assert.equal(verifyInitData(sign({ auth_date: String(now) }), token, now), null);
});
