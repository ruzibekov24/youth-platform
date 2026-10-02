// NAMUNA ma'lumotlar. Hammasi is_sample: true, UI'da "NAMUNA" belgisi bilan ko'rinadi.
// M3 dan boshlab Supabase'dagi haqiqiy jadvallar bilan almashtiriladi (PLAN.md, 6-bo'lim).
import type { TileName } from "@/components/ui/tile";

export type AgeGroup = "13-15" | "16-17" | "18-25";

export type Session = { id: string; date: string; time: string; topic: string; place: string };

export type Club = {
  slug: string;
  name: string;
  tile: TileName;
  description: string;
  organizer: string;
  schedule: string;
  region: string;
  place: string;
  members: number;
  next: Session;
  past: Session[];
  is_sample: true;
};

export type OpportunityType = "Stipendiya" | "Dastur" | "Tanlov" | "Volontyorlik" | "Amaliyot";

export type Opportunity = {
  id: string;
  title: string;
  type: OpportunityType;
  organizer: string;
  closes_at: string; // ISO sana
  age_min: number;
  age_max: number;
  eligibility: string;
  region: string;
  official_url: string;
  verified_at: string;
  summary: string;
  is_sample: true;
};

export type Role = { name: string; filled: boolean };

export type Idea = {
  id: string;
  title: string;
  problem: string;
  description: string;
  roles: Role[];
  age_group: AgeGroup;
  created_at: string;
  is_sample: true;
};

export type Activity = {
  id: string;
  kind: "attended" | "joined_club" | "idea" | "team";
  title: string;
  detail: string;
  date: string;
};

export const clubs: Club[] = [
  {
    slug: "speaking-club",
    name: "Speaking Club",
    tile: "mic",
    description:
      "Har hafta ingliz tilida erkin suhbat. Mavzu oldindan e'lon qilinadi, kichik guruhlarda gaplashamiz, oxirida qisqa xulosa.",
    organizer: "Klub tashkilotchisi (namuna)",
    schedule: "Har juma · 18:00",
    region: "Toshkent",
    place: "Chilonzor, 3-xona",
    members: 24,
    next: { id: "s-next", date: "2026-10-02", time: "18:00 – 19:30", topic: "Kelajakdagi kasblar", place: "Chilonzor, 3-xona" },
    past: [
      { id: "s3", date: "2026-09-25", time: "18:00", topic: "Sevimli kitob", place: "Chilonzor, 3-xona" },
      { id: "s2", date: "2026-09-18", time: "18:00", topic: "Sayohat", place: "Chilonzor, 3-xona" },
      { id: "s1", date: "2026-09-11", time: "18:00", topic: "Tanishuv", place: "Chilonzor, 3-xona" },
    ],
    is_sample: true,
  },
  {
    slug: "startup-uchrashuv",
    name: "Startuperlar uchrashuvi",
    tile: "bulb",
    description:
      "G'oyasi bor yoki jamoaga qo'shilmoqchi bo'lganlar uchun oylik uchrashuv. Har kim 2 daqiqada g'oyasini aytadi, keyin MIYA doskasiga qo'yamiz.",
    organizer: "Klub tashkilotchisi (namuna)",
    schedule: "Har oyning 2-shanbasi · 15:00",
    region: "Toshkent",
    place: "Yunusobod, kutubxona zali",
    members: 41,
    next: { id: "u-next", date: "2026-10-10", time: "15:00 – 17:00", topic: "G'oyadan prototipgacha", place: "Yunusobod, kutubxona zali" },
    past: [{ id: "u1", date: "2026-09-12", time: "15:00", topic: "Birinchi uchrashuv", place: "Yunusobod, kutubxona zali" }],
    is_sample: true,
  },
  {
    slug: "kitob-klubi",
    name: "Kitob klubi",
    tile: "cap",
    description: "Oyda bitta kitob o'qiymiz va muhokama qilamiz. Kitobni birga tanlaymiz.",
    organizer: "Klub tashkilotchisi (namuna)",
    schedule: "Har ikki haftada, yakshanba · 11:00",
    region: "Samarqand",
    place: "Markaziy kutubxona",
    members: 15,
    next: { id: "k-next", date: "2026-10-04", time: "11:00 – 12:30", topic: "\"Kecha va kunduz\", 1-qism", place: "Markaziy kutubxona" },
    past: [],
    is_sample: true,
  },
];

export const opportunities: Opportunity[] = [
  {
    id: "yozgi-it-maktabi",
    title: "Yozgi IT maktabi",
    type: "Dastur",
    organizer: "Tashkilot nomi (namuna)",
    closes_at: "2026-11-30",
    age_min: 16,
    age_max: 18,
    eligibility: "9–11-sinf o'quvchilari, dasturlashga qiziqish. Tajriba shart emas.",
    region: "Butun O'zbekiston",
    official_url: "https://example.org",
    verified_at: "2026-10-01",
    summary: "3 haftalik bepul dastur: web asoslari, kichik jamoaviy loyiha va mentorlar bilan uchrashuv.",
    is_sample: true,
  },
  {
    id: "yoshlar-stipendiyasi",
    title: "Iqtidorli yoshlar stipendiyasi",
    type: "Stipendiya",
    organizer: "Tashkilot nomi (namuna)",
    closes_at: "2026-10-14",
    age_min: 16,
    age_max: 25,
    eligibility: "Litsey yoki OTM talabasi, fan olimpiadasi yoki loyiha natijasi bor.",
    region: "Butun O'zbekiston",
    official_url: "https://example.org",
    verified_at: "2026-09-29",
    summary: "Bir yillik oylik stipendiya va yozgi amaliyotga yo'llanma.",
    is_sample: true,
  },
  {
    id: "eko-tanlov",
    title: "Ekologik loyihalar tanlovi",
    type: "Tanlov",
    organizer: "Tashkilot nomi (namuna)",
    closes_at: "2026-12-15",
    age_min: 13,
    age_max: 17,
    eligibility: "2–4 kishilik maktab jamoalari. Loyiha shahar yoki mahalla muammosini hal qilishi kerak.",
    region: "Toshkent, Samarqand",
    official_url: "https://example.org",
    verified_at: "2026-09-30",
    summary: "G'olib jamoalar loyihani amalga oshirish uchun grant va mentor oladi.",
    is_sample: true,
  },
  {
    id: "kutubxona-volontyor",
    title: "Kutubxonada volontyorlik",
    type: "Volontyorlik",
    organizer: "Tashkilot nomi (namuna)",
    closes_at: "2026-10-20",
    age_min: 15,
    age_max: 25,
    eligibility: "Haftasiga 4 soat vaqt. Bolalar bilan ishlashni yoqtirish.",
    region: "Samarqand",
    official_url: "https://example.org",
    verified_at: "2026-09-27",
    summary: "Bolalar uchun o'qish soatlarini o'tkazishga yordam berish. Sertifikat beriladi.",
    is_sample: true,
  },
  {
    id: "dizayn-amaliyot",
    title: "Dizayn studiyasida amaliyot",
    type: "Amaliyot",
    organizer: "Tashkilot nomi (namuna)",
    closes_at: "2026-09-20",
    age_min: 18,
    age_max: 25,
    eligibility: "Portfolio (3 ta ish). Figma bilan tanish bo'lish.",
    region: "Toshkent",
    official_url: "https://example.org",
    verified_at: "2026-09-10",
    summary: "2 oylik to'langan amaliyot, haftasiga 3 kun ofisda.",
    is_sample: true,
  },
];

export const ideas: Idea[] = [
  {
    id: "kitob-almashish-boti",
    title: "Maktab uchun kitob almashish boti",
    problem: "Kitoblar javonda turibdi, o'qimoqchilar esa topa olmaydi.",
    description:
      "Telegram bot: kimda qaysi kitob borligini yozib qo'yasan, boshqalar so'rov yuboradi, maktabda almashasizlar. Birinchi bosqichda bitta maktab.",
    roles: [
      { name: "Dasturchi", filled: true },
      { name: "Dizayner", filled: false },
      { name: "Maktab bilan aloqa", filled: false },
    ],
    age_group: "16-17",
    created_at: "2026-09-28",
    is_sample: true,
  },
  {
    id: "mahalla-tozalash",
    title: "Mahalla tozalash kunlari xaritasi",
    problem: "Tozalash tadbirlari bor, lekin qachon va qayerda ekanini hech kim bilmaydi.",
    description: "Oddiy sahifa: tadbirlar xaritada, qo'shilish tugmasi va eslatma. Avval bitta tuman uchun.",
    roles: [
      { name: "Dasturchi", filled: false },
      { name: "Tashkilotchi", filled: true },
    ],
    age_group: "16-17",
    created_at: "2026-09-25",
    is_sample: true,
  },
  {
    id: "matematika-videolar",
    title: "5 daqiqalik matematika videolari",
    problem: "Darsda tushunmagan mavzuni qayta ko'radigan qisqa, o'zbekcha video yo'q.",
    description: "Har hafta 2 ta qisqa video. Ssenariy, montaj va ovoz uchun odam kerak.",
    roles: [
      { name: "Montajchi", filled: false },
      { name: "Ssenariy muallifi", filled: true },
      { name: "Diktor", filled: false },
    ],
    age_group: "13-15",
    created_at: "2026-09-21",
    is_sample: true,
  },
];

export const me = {
  name: "Aziz",
  age_group: "16-17" as AgeGroup,
  region: "Toshkent",
  interests: ["Dasturlash", "Ingliz tili", "Startaplar"],
  saved: ["yoshlar-stipendiyasi", "yozgi-it-maktabi"],
  clubs: ["speaking-club"],
  stats: { sessions: 6, clubs: 1, teams: 1 },
  activity: [
    { id: "a1", kind: "attended", title: "Speaking Club", detail: "Sessiyada qatnashdi · QR bilan", date: "2026-09-25" },
    { id: "a2", kind: "team", title: "Kitob almashish boti", detail: "Jamoaga qabul qilindi · Dasturchi", date: "2026-09-29" },
    { id: "a3", kind: "attended", title: "Speaking Club", detail: "Sessiyada qatnashdi · QR bilan", date: "2026-09-18" },
    { id: "a4", kind: "joined_club", title: "Speaking Club", detail: "Klubga qo'shildi", date: "2026-09-10" },
  ] as Activity[],
  is_sample: true as const,
};

// ---------- Yordamchi funksiyalar ----------

const MONTHS = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"];

export function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return `${d.getDate()}-${MONTHS[d.getMonth()]}`;
}

export function daysLeft(iso: string, now = new Date()) {
  const end = new Date(iso + "T23:59:59");
  return Math.ceil((end.getTime() - now.getTime()) / 86_400_000);
}

export const isClosed = (o: Opportunity, now = new Date()) => daysLeft(o.closes_at, now) < 0;

export const getClub = (slug: string) => clubs.find((c) => c.slug === slug);
export const getOpportunity = (id: string) => opportunities.find((o) => o.id === id);
export const getIdea = (id: string) => ideas.find((i) => i.id === id);
