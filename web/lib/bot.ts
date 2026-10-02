import "server-only";
import { Bot, InlineKeyboard, webhookCallback } from "grammy";
import { attachToken, confirmPendingTokens } from "./login.ts";
import { trackEvent } from "./events.ts";
import { allow } from "./rate-limit.ts";
import { INTERESTS, REGIONS, t } from "./strings.uz.ts";
import { findOrCreateByTelegramId, getUserByTelegramId, deleteUser, updateUser, type UserRow } from "./users.ts";
import { AGE_RANGES, isAgeRange, parseUsername, sanitizeName } from "./validate.ts";

export const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN ?? "missing");
const T = t.bot;

// Har bir Telegram foydalanuvchisi uchun: daqiqada 30 ta yangilanish.
bot.use(async (ctx, next) => {
  if (!ctx.from) return;
  if (!(await allow(`bot:${ctx.from.id}`, 60, 30))) return;
  await next();
});

function ageKeyboard() {
  const kb = new InlineKeyboard();
  for (const a of AGE_RANGES) kb.text(a, `age:${a}`);
  return kb.row().text(T.under13, "age:under13");
}

function regionKeyboard() {
  const kb = new InlineKeyboard();
  REGIONS.forEach((r, i) => {
    kb.text(r, `reg:${i}`);
    if (i % 2 === 1) kb.row();
  });
  return kb;
}

function interestsKeyboard(selected: string[]) {
  const kb = new InlineKeyboard();
  INTERESTS.forEach((it, i) => {
    kb.text(`${selected.includes(it.key) ? "✓ " : ""}${it.label}`, `int:${it.key}`);
    if (i % 2 === 1) kb.row();
  });
  return kb.row().text(T.interestsDone, "int:done");
}

async function askStep(chatId: number, user: UserRow, suggestedName: string) {
  switch (user.onboarding_step) {
    case "name":
      await bot.api.sendMessage(chatId, T.askName(suggestedName), {
        reply_markup: new InlineKeyboard().text(T.chooseName(suggestedName), "name:tg"),
      });
      break;
    case "age":
      await bot.api.sendMessage(chatId, T.askAge, { reply_markup: ageKeyboard() });
      break;
    case "region":
      await bot.api.sendMessage(chatId, T.askRegion, { reply_markup: regionKeyboard() });
      break;
    case "interests":
      await bot.api.sendMessage(chatId, T.askInterests, {
        reply_markup: interestsKeyboard(user.interests),
      });
      break;
  }
}

// Telegramdagi ism taklif sifatida koʻrsatiladi; familiya olinmaydi.
function suggestedNameOf(first: string | undefined): string {
  return (first && sanitizeName(first)) || "Doʻst";
}

bot.command("start", async (ctx) => {
  if (ctx.chat.type !== "private" || !ctx.from) {
    await ctx.reply(T.privateOnly);
    return;
  }
  const token = ctx.match.trim();
  const user = await findOrCreateByTelegramId(ctx.from.id);
  const done = user.onboarding_step === null;

  if (token) {
    const ok = await attachToken(token, user.id, done);
    if (!ok) {
      await ctx.reply(T.expiredLogin);
      if (done) return;
    }
  }
  if (done) {
    await ctx.reply(token ? T.done : T.welcomeBack);
    return;
  }
  if (!token) await ctx.reply(T.welcomeNoToken);
  await askStep(ctx.chat.id, user, suggestedNameOf(ctx.from.first_name));
});

bot.command("username", async (ctx) => {
  if (ctx.chat.type !== "private" || !ctx.from) return;
  const user = await getUserByTelegramId(ctx.from.id);
  if (!user || user.onboarding_step) return;
  const arg = ctx.match.trim();
  if (!arg) {
    if (user.telegram_username) {
      await updateUser(user.id, { telegram_username: null });
      await ctx.reply(T.usernameRemoved);
    } else {
      await ctx.reply(T.usernameHelp);
    }
    return;
  }
  const name = parseUsername(arg);
  if (!name) {
    await ctx.reply(T.usernameBad);
    return;
  }
  await updateUser(user.id, { telegram_username: name });
  await ctx.reply(T.usernameSet(name));
});

bot.command("eslatma", async (ctx) => {
  if (!ctx.from) return;
  const user = await getUserByTelegramId(ctx.from.id);
  if (!user || user.onboarding_step) return;
  const next = !user.reminders_enabled;
  await updateUser(user.id, { reminders_enabled: next });
  await ctx.reply(next ? T.remindersOn : T.remindersOff);
});

// Ism matn bilan yoziladi (laqab).
bot.on("message:text", async (ctx) => {
  if (ctx.chat.type !== "private" || !ctx.from) return;
  const user = await getUserByTelegramId(ctx.from.id);
  if (!user || user.onboarding_step !== "name") return;
  const name = sanitizeName(ctx.message.text);
  if (!name) {
    await ctx.reply(T.badName);
    return;
  }
  await updateUser(user.id, { first_name: name, onboarding_step: "age" });
  await ctx.reply(T.askAge, { reply_markup: ageKeyboard() });
});

bot.on("callback_query:data", async (ctx) => {
  await ctx.answerCallbackQuery();
  const from = ctx.from;
  const chatId = ctx.chat?.id;
  if (!chatId) return;
  const user = await getUserByTelegramId(from.id);
  if (!user || user.onboarding_step === null) return;
  const [kind, value] = ctx.callbackQuery.data.split(":");

  if (kind === "name" && user.onboarding_step === "name") {
    await updateUser(user.id, {
      first_name: suggestedNameOf(from.first_name),
      onboarding_step: "age",
    });
    await bot.api.sendMessage(chatId, T.askAge, { reply_markup: ageKeyboard() });
  } else if (kind === "age" && user.onboarding_step === "age") {
    if (value === "under13") {
      // 13 dan kichiklar uchun hech narsa saqlanmaydi.
      await deleteUser(user.id);
      await bot.api.sendMessage(chatId, T.tooYoung);
      return;
    }
    if (!isAgeRange(value)) return;
    await updateUser(user.id, { age_range: value, onboarding_step: "region" });
    await bot.api.sendMessage(chatId, T.askRegion, { reply_markup: regionKeyboard() });
  } else if (kind === "reg" && user.onboarding_step === "region") {
    const region = REGIONS[Number(value)];
    if (!region) return;
    await updateUser(user.id, { region, onboarding_step: "interests" });
    await bot.api.sendMessage(chatId, T.askInterests, { reply_markup: interestsKeyboard([]) });
  } else if (kind === "int" && user.onboarding_step === "interests") {
    if (value === "done") {
      await updateUser(user.id, { onboarding_step: null });
      await confirmPendingTokens(user.id);
      await trackEvent(user.id, "signup");
      await bot.api.sendMessage(chatId, T.done);
      return;
    }
    if (!INTERESTS.some((i) => i.key === value)) return;
    const interests = user.interests.includes(value)
      ? user.interests.filter((k) => k !== value)
      : [...user.interests, value];
    await updateUser(user.id, { interests });
    await ctx.editMessageReplyMarkup({ reply_markup: interestsKeyboard(interests) });
  } else {
    await bot.api.sendMessage(chatId, T.useButtons);
  }
});

export function sendTelegram(telegramId: number, text: string, html = false) {
  return bot.api.sendMessage(telegramId, text, html ? { parse_mode: "HTML" } : undefined);
}

// Webhook handler birinchi so'rovda yaratiladi: modul yuklanishida yaratilsa, lokal polling (npm run bot:dev) ishlamaydi.
let webhook: ((req: Request) => Promise<Response>) | null = null;
export function handleUpdate(req: Request): Promise<Response> {
  webhook ??= webhookCallback(bot, "std/http", { secretToken: process.env.TELEGRAM_WEBHOOK_SECRET });
  return webhook(req);
}
