-- 4 haftalik muvaffaqiyat oʻlchovlari (PLAN.md, 1-boʻlim). Supabase SQL Editor'da ishga tushiring.
-- Telegram ID hech qayerda chiqarilmaydi.

select
  (select count(*) from users where onboarding_step is null)                       as royxatdan_otganlar,
  (select count(distinct e.user_id)
     from events e join users u on u.id = e.user_id
    where e.type = 'visit'
      and e.created_at >= u.created_at + interval '7 days'
      and e.created_at <  u.created_at + interval '14 days')                       as ikkinchi_haftada_qaytganlar,
  (select count(distinct user_id) from club_members)                               as klubga_qoshilganlar,
  (select count(*) from events where type = 'opportunity_apply')                   as apply_bosilishlari,
  (select count(*) from ideas where status = 'open')                               as tasdiqlangan_goyalar,
  (select count(*) from join_requests where status = 'accepted')                   as qabul_qilingan_sorovlar,
  (select count(*) from reports)                                                   as shikoyatlar;
