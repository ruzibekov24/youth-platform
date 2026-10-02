// Barcha UI matnlari shu yerda. Keyin rus tili uchun strings.ru.ts qo'shiladi.
export const t = {
  meta: {
    title: "Yoshlar Base",
    description:
      "Yoshlar uchun digital home: klublar, tekshirilgan imkoniyatlar va g'oyadan jamoagacha.",
  },
  brand: "Yoshlar Base",
  sample: "NAMUNA",
  nav: {
    links: [
      { href: "#makonlar", label: "Makonlar" },
      { href: "#yol", label: "Qanday ishlaydi" },
      { href: "#xavfsizlik", label: "Xavfsizlik" },
    ],
    login: "Kirish",
  },
  hero: {
    title: "Yoshlarning o'z makoni",
    titleMuted: "qiziqishdan haqiqiy ishgacha",
    lead: "Klubga qo'shiling, ishonchli imkoniyatlarni toping, g'oyangizdan jamoa yig'ing. Qilganlaringiz profilingizda o'zi to'planadi.",
    primary: "Imkoniyatlarni ko'rish",
    secondary: "Telegram orqali kirish",
  },
  orbit: {
    line1: "Real ishga olib",
    line2: "boradigan",
    mark: "uchta makon",
    text: "Klublar, tekshirilgan imkoniyatlar va g'oyalar doskasi. Ilovada vaqt o'tkazish uchun emas, tashqariga chiqib ish qilish uchun.",
    cta: "Makonlarni ko'rish",
  },
  spaces: {
    pill: "Makonlar",
    line1: "Hammasi haqiqiy.",
    line2: "Hammasi tekshirilgan.",
  },
  flow: {
    line1: "Bitta harakat",
    line2: "keyingisini ochadi",
    text: "Klubdan boshlang. Qolganlari o'zi keladi.",
    root: "Real harakat",
    leaves: [
      { title: "Klubga qatnash", text: "QR bilan tasdiqlanadi" },
      { title: "Ariza topshir", text: "Rasmiy havola orqali" },
      { title: "G'oya qo'y", text: "Moderatsiyadan o'tadi" },
      { title: "Jamoa bo'l", text: "Qabul qilinsa aloqa ochiladi" },
    ],
  },
  safety: {
    pill: "Xavfsizlik",
    line1: "Ko'pchiligimiz",
    mark: "13-17",
    line2: "yoshdamiz.",
    items: [
      { title: "Telefon yo'q", text: "Faqat Telegram orqali kirasiz. Email va parol so'ralmaydi." },
      { title: "Ochiq profil yo'q", text: "Hech kim sizni qidirib topa olmaydi." },
      { title: "Yosh guruhi", text: "18 yoshgacha bo'lganlar 18+ bilan bog'lanmaydi." },
      { title: "To'liq o'chirish", text: "Akkaunt va ma'lumotlar bir bosishda o'chadi." },
    ],
    finTitle: "Birinchi qadamni bugun qiling",
    cta: "Telegram orqali boshlash",
    ctaSecondary: "Imkoniyatlarni ko'rish",
    finNote: "Parol, email va telefon raqami kerak emas.",
  },
  footer: "Yoshlar uchun digital home",
  cards: {
    today: {
      title: "Bugun",
      rows: [
        { title: "Speaking Club", sub: "18:00", progress: 60 },
        { title: "Ariza topshirish", sub: "30-noyabrgacha", progress: 30 },
      ],
    },
    reminders: {
      title: "Eslatmalar",
      label: "Bugungi sessiya",
      name: "Speaking Club",
      time: "18:00 – 19:30",
    },
    telegram: {
      title: "Telegram orqali kirish",
      items: ["Telegram", "Kalendar", "Eslatma"],
    },
    note: "Juma 18:00 — Speaking Club. QR tayyor bo'lsin!",
    club: {
      title: "Speaking Club",
      when: "Juma · 18:00",
      join: "Qo'shilish",
      attended: "Qatnashdim",
      qr: "QR ✓",
      caption: "Klublar",
      text: "Real uchrashuvlar. Sessiyada QR skanerlaysiz, qatnashganingiz profilga yoziladi.",
    },
    opportunity: {
      title: "Namunaviy dastur",
      type: "Stipendiya",
      age: "16–18 yosh",
      deadlineLabel: "Ariza oxirgi kuni:",
      deadline: "30-noyabr",
      link: "Rasmiy havola ↗",
      verified: "✓ Tekshirilgan",
      caption: "Imkoniyatlar",
      text: "Qo'lda tekshirilgan dasturlar: muddat, shartlar va rasmiy manba bilan.",
    },
    idea: {
      title: "Namunaviy g'oya",
      roles: ["Dizayner", "Dasturchi"],
      join: "Qo'shilaman",
      caption: "MIYA",
      text: "G'oyangizni qo'ying, kerakli odamlarni toping va jamoa bo'ling.",
    },
  },
} as const;
