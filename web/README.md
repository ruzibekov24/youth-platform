# Yoshlar Base: web

Next.js 16 (App Router, TypeScript) + Tailwind v4.

## Ishga tushirish

```bash
npm install
npm run dev
```

Keyin http://localhost:3000 ni oching.

## Tuzilma

- `app/` — sahifalar (hozircha faqat landing)
- `components/landing/` — landing sahnalari, `scroll-engine.tsx` (scroll'ga bog'langan animatsiya, kutubxonasiz)
- `components/cards/` — UI kartalar (neytral rang + bitta brend rangi)
- `lib/strings.uz.ts` — barcha UI matnlari
- `public/brand/` — logo va 3D ikonkalar

Eslatma: CSS klass nomlarini Tailwind utility'lari bilan to'qnashtirmang (`ring`, `static`, `hidden` va h.k.).
