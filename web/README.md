# Yoshlar Base: web

Next.js (App Router) + Tailwind + Supabase + Telegram bot (grammY). Reja: `../PLAN.md`, qoidalar: `../CLAUDE.md`.

## Lokal ishga tushirish

```bash
cd web
npm install
cp .env.example .env.local   # qiymatlarni toʻldiring
npm run dev
npm test                     # sof mantiq testlari (node:test)
npm run lint && npm run build
```

Supabase sozlanmasa ham landing namunaviy (NAMUNA) kartalar bilan ochiladi; kirish va boshqa boʻlimlar uchun baza kerak.

## Sozlash tartibi

1. **Supabase**: loyiha oching, SQL Editor'da `supabase/migrations/0001_init.sql`, keyin `0002_miya_and_limits.sql`. Sinov uchun `supabase/seed.sql`. Batafsil: `supabase/README.md`.
2. **Telegram bot**: BotFather'da Base uchun alohida bot yarating. Token va username'ni `.env` ga yozing. Buyruqlar: `/start`, `/eslatma`.
3. **Sirlar**: `SESSION_SECRET` (kamida 32 belgi, `openssl rand -base64 48`), `TELEGRAM_WEBHOOK_SECRET`, `CRON_SECRET`.
4. **Vercel**: repo'ni ulang, Root Directory = `web`, `.env.example` dagi hamma oʻzgaruvchini qoʻying (`NEXT_PUBLIC_SITE_URL` = `https://domen`). `vercel.json` kunlik cron'ni (09:00 Toshkent) sozlaydi; Vercel `CRON_SECRET` ni `Authorization` sarlavhasida oʻzi yuboradi.
5. **Webhook**: deploydan keyin `npm run bot:webhook` (`.env.local` da `NEXT_PUBLIC_SITE_URL` https boʻlishi kerak).
6. **QR**: klub sessiyasi uchun `https://domen/qr/<checkin_code>` sahifasini sensorli doskada oching (`club_sessions.checkin_code`).

## Xavfsizlik qisqacha

- Bazaga faqat server (service role). RLS hamma jadvalda yoqilgan, policy yoʻq.
- Cookie: imzolangan httpOnly JWT, ichida faqat ichki user id.
- Yozish amallari `rate_hit` (bazada) orqali cheklanadi. Webhook va cron yashirin sir bilan himoyalangan.
- 18 yoshgacha va 18+ MIYA'da bir-biri bilan bogʻlanmaydi (server tomonida tekshiriladi).
