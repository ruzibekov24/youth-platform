// Ishlatish: npm run bot:webhook  (.env.local kerak)
const { TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET, NEXT_PUBLIC_SITE_URL } = process.env;
if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_WEBHOOK_SECRET || !NEXT_PUBLIC_SITE_URL?.startsWith("https://")) {
  console.error("TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET va https:// NEXT_PUBLIC_SITE_URL kerak.");
  process.exit(1);
}
const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    url: `${NEXT_PUBLIC_SITE_URL}/api/telegram`,
    secret_token: TELEGRAM_WEBHOOK_SECRET,
    allowed_updates: ["message", "callback_query"],
  }),
});
console.log(await res.json());
