// Bot so'rovnomasi: haqiqiy grammY, soxta baza va soxta Telegram API.
import assert from "node:assert/strict";
import { mock, test } from "node:test";

type U = {
  id: string; telegram_id: number; first_name: string | null; age_range: string | null; region: string | null;
  interests: string[]; onboarding_step: string | null; reminders_enabled: boolean;
};
const users = new Map<number, U>();
const confirmed: string[] = [];
const attached: string[] = [];
const events: string[] = [];

const root = new URL("../lib/", import.meta.url);
mock.module("server-only", { namedExports: {} });
mock.module(new URL("users.ts", root).href, {
  namedExports: {
    findOrCreateByTelegramId: async (tg: number) => {
      if (!users.has(tg)) {
        users.set(tg, { id: `u${tg}`, telegram_id: tg, first_name: null, age_range: null, region: null, interests: [], onboarding_step: "name", reminders_enabled: true });
      }
      return structuredClone(users.get(tg)!);
    },
    getUserByTelegramId: async (tg: number) => (users.has(tg) ? structuredClone(users.get(tg)!) : null),
    updateUser: async (id: string, patch: Partial<U> & { telegram_username?: string | null }) => {
      for (const u of users.values()) if (u.id === id) Object.assign(u, patch);
    },
    deleteUser: async (id: string) => {
      for (const [k, u] of users) if (u.id === id) users.delete(k);
    },
  },
});
mock.module(new URL("login.ts", root).href, {
  namedExports: {
    attachToken: async (tok: string) => { attached.push(tok); return true; },
    confirmPendingTokens: async (id: string) => { confirmed.push(id); },
  },
});
mock.module(new URL("events.ts", root).href, { namedExports: { trackEvent: async (_u: string, type: string) => { events.push(type); } } });
mock.module(new URL("rate-limit.ts", root).href, { namedExports: { allow: async () => true } });

const { bot } = await import("../lib/bot.ts");
const sent: { method: string; payload: Record<string, unknown> }[] = [];
bot.api.config.use(async (_prev, method, payload) => {
  sent.push({ method, payload: payload as Record<string, unknown> });
  return { ok: true, result: true } as never;
});
bot.botInfo = { id: 1, is_bot: true, first_name: "b", username: "b", can_join_groups: true, can_read_all_group_messages: false, supports_inline_queries: false, can_connect_to_business: false, has_main_web_app: false } as never;

let uid = 0;
const from = (id: number) => ({ id, is_bot: false, first_name: "Ilyos" });
const chat = (id: number) => ({ id, type: "private" as const, first_name: "Ilyos" });
const msg = (id: number, text: string, entities?: unknown[]) =>
  bot.handleUpdate({ update_id: ++uid, message: { message_id: uid, date: 0, from: from(id), chat: chat(id), text, entities } } as never);
const press = (id: number, data: string) =>
  bot.handleUpdate({
    update_id: ++uid,
    callback_query: { id: String(uid), from: from(id), chat_instance: "c", data, message: { message_id: 1, date: 0, chat: chat(id), text: "x" } },
  } as never);
const start = (id: number, token = "") =>
  msg(id, `/start ${token}`.trim(), [{ type: "bot_command", offset: 0, length: 6 }]);
const texts = () => sent.filter((s) => s.method === "sendMessage").map((s) => String(s.payload.text));

test("to'liq so'rovnoma: ism -> yosh -> hudud -> qiziqish -> tasdiq", async () => {
  const tok = "A".repeat(32);
  await start(100, tok);
  assert.deepEqual(attached, [tok]);
  assert.match(texts().at(-1)!, /Ilyos/);
  assert.equal(users.get(100)!.onboarding_step, "name");

  await press(100, "name:tg");
  assert.equal(users.get(100)!.first_name, "Ilyos");
  assert.equal(users.get(100)!.onboarding_step, "age");

  await press(100, "age:16-17");
  assert.equal(users.get(100)!.age_range, "16-17");
  await press(100, "reg:11");
  assert.equal(users.get(100)!.region, "Samarqand");
  await press(100, "int:tech");
  await press(100, "int:art");
  await press(100, "int:art"); // qayta bosish = olib tashlash
  assert.deepEqual(users.get(100)!.interests, ["tech"]);
  assert.deepEqual(confirmed, []); // hali tasdiqlanmagan

  await press(100, "int:done");
  assert.equal(users.get(100)!.onboarding_step, null);
  assert.deepEqual(confirmed, ["u100"]);
  assert.ok(events.includes("signup"));
});

test("noto'g'ri bosqichdagi callback e'tiborsiz qoldiriladi", async () => {
  await start(101);
  await press(101, "reg:3"); // hali ism bosqichida
  assert.equal(users.get(101)!.region, null);
  assert.equal(users.get(101)!.onboarding_step, "name");
});

test("ism matn bilan: yaroqsiz rad etiladi, yaroqlisi qabul", async () => {
  await start(102);
  await msg(102, "+998901234567");
  assert.equal(users.get(102)!.onboarding_step, "name");
  assert.match(texts().at(-1)!, /harflardan/);
  await msg(102, "Oʻktam");
  assert.equal(users.get(102)!.first_name, "Oʻktam");
  assert.equal(users.get(102)!.onboarding_step, "age");
});

test("13 dan kichik: hech narsa saqlanmaydi", async () => {
  await start(103);
  await press(103, "name:tg");
  await press(103, "age:under13");
  assert.equal(users.has(103), false);
});

test("allaqachon ro'yxatdan o'tgan foydalanuvchi: token darhol tasdiqlanadi", async () => {
  users.set(104, { id: "u104", telegram_id: 104, first_name: "A", age_range: "18-25", region: "Andijon", interests: [], onboarding_step: null, reminders_enabled: true });
  attached.length = 0;
  await start(104, "B".repeat(32));
  assert.deepEqual(attached, ["B".repeat(32)]);
  assert.match(texts().at(-1)!, /Tayyor/);
});

test("/username: ixtiyoriy, tekshiriladi, olib tashlanadi", async () => {
  users.set(105, { id: "u105", telegram_id: 105, first_name: "A", age_range: "16-17", region: "Andijon", interests: [], onboarding_step: null, reminders_enabled: true });
  const cmd = (t: string) => msg(105, t, [{ type: "bot_command", offset: 0, length: 9 }]);
  await cmd("/username @bad");
  assert.match(texts().at(-1)!, /notoʻgʻri/);
  await cmd("/username @ilyos_01");
  assert.equal((users.get(105) as { telegram_username?: string }).telegram_username, "ilyos_01");
  await cmd("/username");
  assert.equal((users.get(105) as { telegram_username?: string | null }).telegram_username, null);
});
