// Faqat lokal ishlab chiqish: botni polling rejimida ishga tushiradi (webhook'ga public https kerak, localhost'da yo'q).
// Ishlatish: npm run bot:dev   (to'xtatish: Ctrl+C). Deploydan keyin: npm run bot:webhook
import { bot } from "../lib/bot.ts";

await bot.api.deleteWebhook();
console.log("Webhook o'chirildi. Bot polling rejimida ishlayapti…");
await bot.start({
  allowed_updates: ["message", "callback_query"],
  onStart: (me) => console.log(`@${me.username} tayyor`),
});
