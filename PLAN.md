# Yoshlar Base: MVP rejasi (v1)

Sana: 2026-10-01. Holat: tasdiqlash uchun qoralama.

## 1. MVP maqsadi

Bitta savolga javob topamiz: **yoshlar Base'ga qaytib keladimi va u yerdan real harakatga o'tadimi?** (klubga qatnashish, ariza topshirish, jamoaga qo'shilish)

**4 haftalik muvaffaqiyat o'lchovi:**
- 50 ta ro'yxatdan o'tgan foydalanuvchi
- Ulardan 20 tasi 2-haftada qaytgan
- Kamida 1 ta klubga qo'shilgan foydalanuvchilar
- Opportunities'da rasmiy havolaga "Apply" bosilishlari
- MIYA doskasida kamida 3 ta g'oya va kamida 1 ta qabul qilingan so'rov

Sayt ichida o'tkazilgan vaqt o'lchov emas.

## 2. Birinchi auditoriya (faraz, tasdiqlanishi kerak)

Maqsadli maktab o'quvchilari, 15-18 yosh, O'zbekiston. Til: o'zbekcha (lotin).

Birinchi kirish yo'llari:
- Going to Harvard Telegram kanali va Starter Pack boti (bot Base'ga eshik bo'ladi)
- Haftalik Speaking Club (sensorli doskada QR bilan qo'shilish)
- Startuperlar guruhi (MIYA doskasining birinchi g'oyalari va texnik odamlari)
- Yaqin atrofdagilar: birinchi 5-10 test foydalanuvchi

## 3. Besh bo'lim

| Bo'lim | v1 da nima |
|---|---|
| **Home** | Shaxsiy "Bugun": keyingi klub sessiyasi, saqlangan imkoniyatlar, yangi g'oyalar |
| **Clubs** | Real klublar: tavsif, jadval, qo'shilish, sessiyaga qatnashish (QR orqali tasdiqlanadi) |
| **Opportunities** | 30-50 ta qo'lda tekshirilgan imkoniyat: filtr, saqlash, rasmiy havolaga o'tish |
| **MIYA** | G'oya doskasi: g'oya qo'yish, kerakli rollar, "qo'shilaman" so'rovi, g'oya egasi qabul qiladi |
| **Profile** | "Men nimalar qildim": klub, qatnashgan sessiyalar, g'oyalar, jamoalar. Avtomatik to'ladi |

**Tsikl:** Klub -> yangi odam -> g'oya -> jamoa -> profil.

Eslatma: imkoniyatning "Ariza oxirgi kuni" maydoni bor, chunki har bir ariza muddatli. Bu faqat ma'lumot maydoni, bo'limning markazi emas.

## 4. Foydalanuvchi yo'li

1. **Landing.** Bitta bosh jumla, uchta qisqa qator (Clubs, Imkoniyatlar, MIYA), yaqin sessiyalar/imkoniyatlardan 3-4 ta haqiqiy karta. Ikki tugma: asosiy **Imkoniyatlarni ko'rish**, ikkinchi darajali **Telegram orqali kirish**.
2. **Mehmon (login-siz).** Hammasini ko'radi: klublar, imkoniyatlar, tasdiqlangan g'oyalar. "Saqlash", "Qo'shilish", "G'oya qo'yish" bosganda kirish taklif qilinadi (foyda ko'ringan paytda).
3. **Kirish.** Saytdagi tugma Telegram botni ochadi (`/start`), bot so'rovnoma o'tkazadi, tasdiqlanadi va sayt sessiyani ochadi.
4. **Home.** "Bugun" sahifasi: kelayotgan klub sessiyasi, saqlangan imkoniyatlar, qiziqishga mos yangi g'oyalar.
5. **Qaytish sababi.** Telegram eslatma: klub sessiyasi kuni va saqlangan imkoniyat yopilishiga 3 kun qolganda.
6. **Profil va sozlamalar.** Eslatmalarni boshqarish, akkauntni o'chirish.

## 5. Akkaunt va xavfsizlik

Foydalanuvchilar 13-17 yosh bo'lishi mumkin. Xavfsizlik dizayn darajasida.

**Akkaunt = Telegram ID.** Parol, email va **telefon raqami yo'q**. Telegram o'zi telefon bilan tasdiqlagan, spamdan himoya uchun u yetadi.

**Bot so'rovnomasi (4 savol):**
1. Ismingiz (Telegram'dagi ism taklif qilinadi, laqab ham mumkin)
2. Yosh oralig'i: 13-15, 16-17, 18-25
3. Hudud
4. Qiziqishlar (tugmalar bilan, bir nechtasini tanlash mumkin)

**Saqlanmaydi:** tug'ilgan sana, familiya, telefon, rasm, email.

**Qoidalar:**
- Ochiq profil yo'q, foydalanuvchilar bir-biriga yoza olmaydi.
- MIYA'da aloqa faqat g'oya egasi "qabul qildim" desa ochiladi. **18 yoshgacha bo'lganlar 18+ bilan bog'lanmaydi**, faqat o'z yosh guruhi ichida.
- G'oyalar ko'rinishidan oldin moderatsiyadan o'tadi.
- Har joyda "Xabar berish" tugmasi bor.
- "Akkauntni o'chirish" ma'lumotni haqiqatan o'chiradi.
- Telegram ID hech qachon ochiq sahifalarda ko'rinmaydi.

**Ochiq huquqiy savol (sizda):** O'zbekistonda shaxsiy ma'lumot to'plash (rozilik) va serverlar joylashuvi bo'yicha talablar. Supabase/Vercel xorijda joylashgan. Ommaviy ishga tushirishdan oldin yurist bilan tekshiring. Shu sababli ma'lumot minimal saqlanadi.

## 6. Ma'lumotlar modeli (qisqa)

| Jadval | Asosiy maydonlar |
|---|---|
| `users` | id, telegram_id, first_name, age_range, region, interests[], created_at, deleted_at |
| `login_tokens` | token, user_id, confirmed_at, expires_at |
| `clubs` | id, slug, name, description, organizer, schedule_text, is_active |
| `club_members` | club_id, user_id, joined_at |
| `club_sessions` | id, club_id, starts_at, place_or_link, topic, checkin_code |
| `club_attendance` | session_id, user_id, checked_in_at |
| `opportunities` | id, title, type, organizer, closes_at, age_min, age_max, eligibility, region, official_url, verified_at, status, is_sample |
| `saved_opportunities` | user_id, opportunity_id |
| `ideas` | id, owner_id, title, problem, description, needed_roles[], status (pending/open/closed), age_group |
| `join_requests` | id, idea_id, user_id, role, message, status (pending/accepted/declined) |
| `events` | id, user_id (null mumkin), type, entity_type, entity_id, created_at |
| `reports` | id, entity_type, entity_id, reason, created_at |

**Profil** alohida jadval emas: `club_attendance`, `club_members`, `ideas`, `join_requests` dan avtomatik yig'iladi.

## 7. Texnik yo'nalish

- Next.js (App Router, TypeScript) + Tailwind, Vercel'da. Kod `web/` papkasida.
- Supabase (Postgres). Bazaga faqat server orqali (service role) murojaat qilinadi, brauzer bazaga to'g'ridan-to'g'ri kirmaydi. RLS qo'shimcha himoya sifatida yoqiladi.
- Telegram bot (grammY), Next.js ichida webhook. Eslatmalar Vercel Cron bilan, kuniga bir marta.
- Sessiya: imzolangan httpOnly cookie (JWT).
- Admin panel yozilmaydi: ma'lumot Supabase Studio yoki Google Sheet'dan CSV import orqali kiritiladi.

## 8. Qurish bosqichlari (Claude Code uchun)

Har bosqich tugagach: ilova build bo'ladi, lint o'tadi, mezonlar bajariladi, commit qilinadi. Keyin keyingisiga o'tiladi.

| # | Bosqich | Tugash mezoni |
|---|---|---|
| **M0** | **Setup.** `web/` papka, Next.js + Tailwind, Supabase loyihasi, `.env.example`, `CLAUDE.md` joyida | `npm run dev` ishlaydi, bo'sh sahifa ochiladi |
| **M1** | **Dizayn poydevori.** Rang, shrift, bo'shliq, 6-8 komponent (tugma, karta, badge, input, filtr), `strings.uz.ts` | Komponentlar sahifasi (galereya) telefon va kompyuterda toza ko'rinadi |
| **M2** | **Landing.** Bosh jumla, 3 qator, namunaviy kartalar (NAMUNA belgisi bilan), 2 tugma | Telefonda tez ochiladi, asosiy tugma aniq ko'rinadi |
| **M3** | **Baza.** Sxema, RLS deny-all, seed (hammasi `is_sample`) | Jadvallar bor, seed yuklanadi, UI'da NAMUNA ko'rinadi |
| **M4** | **Telegram akkaunt.** Bot, `/start` so'rovnoma, login deep link, sessiya, "Kirish/Chiqish", akkauntni o'chirish | Yangi odam bot orqali kiradi va saytda ismi ko'rinadi; o'chirsa ma'lumot yo'qoladi |
| **M5** | **Home + Profile.** "Bugun" sahifasi, avtomatik profil | Kirgan foydalanuvchi o'z sahifasini ko'radi, bo'sh holat (empty state) chiroyli |
| **M6** | **Clubs.** Klublar ro'yxati, klub sahifasi, qo'shilish, sessiyalar, QR check-in, sessiya kuni Telegram eslatma | Foydalanuvchi qo'shiladi, sessiyada QR skanerlaydi, profilda "qatnashdi" ko'rinadi |
| **M7** | **Opportunities.** Ro'yxat, filtrlar, detail, saqlash, rasmiy havolaga o'tish (`events` ga yoziladi), yopilganlar avtomatik belgilanadi, "Xato/eskirgan" tugmasi, saqlanganlar uchun eslatma | 30+ imkoniyat kiritilgan, "Apply" bosilishi hisoblanadi |
| **M8** | **MIYA doskasi.** G'oya qo'yish (moderatsiya), g'oyalar ro'yxati, "qo'shilaman" so'rovi, egasi qabul/rad, xavfsiz aloqa (yosh guruhi qoidasi bilan) | G'oya moderatsiyadan o'tadi, so'rov yuboriladi, qabul qilinsa bot ikkala tomonga xabar beradi |
| **M9** | **Xavfsizlik va ishga tushirish.** Rate limit, input tekshiruvi, report ishlashi, analitika (`events`), Vercel deploy, domen, webhook | Real foydalanuvchilarga ochishga tayyor |

Tartib sababi: poydevor -> Clubs (tez real foyda) -> Opportunities -> MIYA.

## 9. v1 da yo'q

Challenges, O'yingoh, Services/freelance, to'lov, AI, umumiy chat va DM, ochiq profil, follower hisoblagichi, reklama, telefon raqami, email/parol, alohida admin panel.

Sabablar: Challenge'ning oddiy versiyasi "soxta belgilash" bo'lib qoladi (falsafamizga zid). O'yingoh activity tracking talab qiladi, bu voyaga yetmaganlar uchun xavfli. Qolganlari auditoriya paydo bo'lgandan keyin.

## 10. Ochiq savollar

1. **Segment:** maqsadli maktab o'quvchilari, 15-18 yosh, to'g'rimi?
2. **Auditoriya hajmi:** kanalda va klubda nechta odam bor?
3. **Yuridik:** shaxsiy ma'lumot va server joylashuvi talablari.
4. **Bot nomi va domen:** Base uchun alohida bot kerak (Starter Pack boti bilan aralashmasin) va domen nomi.
5. **Brend:** logo va asosiy rang hali yo'q. M1 da vaqtinchalik rang olinadi, logo keyin.
6. **Kontent:** 30+ imkoniyat va birinchi klub ma'lumotlarini kim va qachon yig'adi?

## 11. Claude Code bilan ishlash

1. `youth-platform` repo'sida `web/` ochiladi, `CLAUDE.md` va `PLAN.md` repo ildiziga qo'yiladi.
2. Claude Code'ga birinchi so'rov: *"CLAUDE.md va PLAN.md ni o'qi, so'ng faqat M0 ni bajar. Tugagach to'xta va natijani ayt."*
3. Har bosqichdan keyin natijani ko'rib chiqing va keyingisiga ruxsat bering.
4. Parametrlar (`.env`): Supabase, Telegram bot tokeni (BotFather'dan), sessiya sirri. Qiymatlarni hech qachon repo'ga commit qilmang.
