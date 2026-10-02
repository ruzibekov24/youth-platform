-- Namunaviy maʼlumot. HAMMASI is_sample = true: UI'da "NAMUNA" belgisi bilan chiqadi.
-- Haqiqiy klub va imkoniyatlar Supabase Studio yoki CSV import orqali kiritiladi (supabase/README.md).

insert into clubs (slug, name, description, organizer, schedule_text, is_sample) values
  ('namuna-speaking', 'Namuna: Speaking Club', 'Har hafta ingliz tilida erkin suhbat. Bu namunaviy klub.', 'Namuna tashkilot', 'Har shanba, 16:00', true),
  ('namuna-startup', 'Namuna: Startup guruhi', 'Gʻoyalarni birga muhokama qilamiz. Bu namunaviy klub.', 'Namuna tashkilot', 'Har yakshanba, 18:00', true);

insert into club_sessions (club_id, starts_at, place_or_link, topic)
select c.id, now() + interval '3 days', 'Namuna manzil', 'Namuna mavzu: oʻzingni tanishtir'
from clubs c where c.slug = 'namuna-speaking';

insert into club_sessions (club_id, starts_at, place_or_link, topic)
select c.id, now() + interval '10 days', 'Namuna manzil', 'Namuna mavzu: birinchi gʻoya'
from clubs c where c.slug = 'namuna-startup';

insert into opportunities
  (title, type, organizer, closes_at, age_min, age_max, eligibility, region, official_url, verified_at, is_sample)
values
  ('Namuna: yozgi dastur', 'program', 'Namuna tashkilot', now() + interval '60 days', 15, 18, 'Namuna: 9–11-sinf oʻquvchilari', 'Butun Oʻzbekiston', 'https://example.com/1', now(), true),
  ('Namuna: stipendiya', 'scholarship', 'Namuna tashkilot', now() + interval '30 days', 16, null, 'Namuna: yaxshi oʻzlashtiruvchi talabalar', 'Butun Oʻzbekiston', 'https://example.com/2', now(), true),
  ('Namuna: ilmiy tanlov', 'competition', 'Namuna tashkilot', now() + interval '5 days', 13, 17, 'Namuna: maktab oʻquvchilari', 'Toshkent', 'https://example.com/3', now(), true),
  ('Namuna: amaliyot dasturi', 'internship', 'Namuna tashkilot', now() + interval '45 days', 18, 25, 'Namuna: 1–3-kurs talabalari', 'Samarqand', 'https://example.com/4', now(), true),
  ('Namuna: yoshlar forumi', 'event', 'Namuna tashkilot', now() + interval '20 days', 14, 25, 'Namuna: hamma yoshlar', 'Butun Oʻzbekiston', 'https://example.com/5', now(), true),
  ('Namuna: grant tanlovi', 'competition', 'Namuna tashkilot', now() + interval '90 days', 16, 25, 'Namuna: jamoaviy loyihalar', 'Butun Oʻzbekiston', 'https://example.com/6', now(), true),
  ('Namuna: til kursi stipendiyasi', 'scholarship', 'Namuna tashkilot', null, 15, 22, 'Namuna: muddatsiz qabul', 'Butun Oʻzbekiston', 'https://example.com/7', now(), true),
  ('Namuna: yopilgan dastur', 'program', 'Namuna tashkilot', now() - interval '10 days', 15, 18, 'Namuna: muddati oʻtgan misol', 'Butun Oʻzbekiston', 'https://example.com/8', now() - interval '40 days', true);
