// Faqat M2 landing uchun vaqtinchalik. M3 da baza (is_sample=true) bilan almashtiriladi.
import type { Club, Opportunity } from "./types";

export const sampleClubs: Club[] = [
  {
    id: "sample-club-1",
    slug: "namuna-speaking",
    name: "Namuna: Speaking Club",
    description: "Har hafta ingliz tilida erkin suhbat. Bu namunaviy karta.",
    organizer: "Namuna tashkilot",
    schedule_text: "Har shanba, 16:00",
    is_active: true,
    is_sample: true,
  },
  {
    id: "sample-club-2",
    slug: "namuna-startup",
    name: "Namuna: Startup guruhi",
    description: "Gʻoyalarni birga muhokama qilamiz. Bu namunaviy karta.",
    organizer: "Namuna tashkilot",
    schedule_text: "Har yakshanba, 18:00",
    is_active: true,
    is_sample: true,
  },
];

export const sampleOpportunities: Opportunity[] = [
  {
    id: "sample-opp-1",
    title: "Namuna: yozgi dastur",
    type: "program",
    organizer: "Namuna tashkilot",
    closes_at: "2027-03-01T00:00:00Z",
    age_min: 15,
    age_max: 18,
    eligibility: "Namuna matn",
    region: "Butun Oʻzbekiston",
    official_url: "https://example.com",
    verified_at: "2026-10-01T00:00:00Z",
    status: "active",
    is_sample: true,
  },
  {
    id: "sample-opp-2",
    title: "Namuna: stipendiya",
    type: "scholarship",
    organizer: "Namuna tashkilot",
    closes_at: "2027-01-15T00:00:00Z",
    age_min: 16,
    age_max: null,
    eligibility: "Namuna matn",
    region: "Butun Oʻzbekiston",
    official_url: "https://example.com",
    verified_at: "2026-10-01T00:00:00Z",
    status: "active",
    is_sample: true,
  },
];
