# Supabase

1. Supabase loyihasi oching, SQL Editor'da `migrations/0001_init.sql` ni ishga tushiring (keyingi migratsiyalar tartib bilan).
2. Faqat rivojlanish/sinov uchun: `seed.sql` (hamma qator `is_sample = true`).
3. Haqiqiy klub va imkoniyatlarni Table Editor yoki CSV import orqali kiriting. `is_sample` ni `false` qoldiring.

Kalitlar `.env` ga yoziladi (`.env.example` ga qarang). `SUPABASE_SERVICE_ROLE_KEY` ni hech qachon brauzerga bermang va commit qilmang.

## Imkoniyat CSV ustunlari

`title, type, organizer, closes_at, age_min, age_max, eligibility, region, official_url, verified_at`

- `type`: `scholarship | program | competition | internship | event`
- `closes_at`, `verified_at`: ISO sana (`2026-12-31T00:00:00Z`)
- `official_url`: rasmiy manba, `https://` bilan
