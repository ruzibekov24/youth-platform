-- Xavfsizlik sinovi. Bo'sh bazada migratsiyalardan keyin ishga tushiring:
--   psql ... -v ON_ERROR_STOP=1 -f supabase/tests/safety.sql
-- Har tekshiruv muvaffaqiyatsiz bo'lsa exception beradi.
begin;

-- Supabase'dagi kabi rollar (lokal Postgres'da yo'q bo'lsa yaratiladi).
do $$ begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon nologin; end if;
end $$;
grant usage on schema public to anon;
grant select, insert, update, delete on all tables in schema public to anon; -- eng yomon holat: faqat RLS himoya qiladi

-- Namunaviy ma'lumot
insert into users (id, telegram_id, first_name, age_range, region, onboarding_step)
  values ('00000000-0000-0000-0000-000000000001', 111, 'Test', '16-17', 'Samarqand', null);
insert into clubs (id, slug, name, description, organizer, schedule_text, is_sample)
  values ('00000000-0000-0000-0000-0000000000c1', 'c', 'C', 'd', 'o', 's', true);
insert into club_members (club_id, user_id) values ('00000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-000000000001');
insert into ideas (id, owner_id, title, problem, description, needed_roles, age_group)
  values ('00000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-000000000001', 'Gʻoya', 'Muammo matni uzun', 'Tavsif matni uzun', '{Dasturchi}', 'under18');
insert into events (user_id, type) values ('00000000-0000-0000-0000-000000000001', 'visit');
insert into login_tokens (token_hash, user_id, expires_at) values ('h', '00000000-0000-0000-0000-000000000001', now() + interval '1 hour');

-- 1) RLS deny-all: anon hech narsani ko'rmaydi va yoza olmaydi.
set local role anon;
do $$
declare t text; n int; tables text[] := array['users','login_tokens','clubs','club_members','club_sessions','club_attendance','opportunities','saved_opportunities','ideas','join_requests','events','reports','rate_limits'];
begin
  foreach t in array tables loop
    begin
      execute format('select count(*) from %I', t) into n;
      if n <> 0 then raise exception 'RLS ochiq: anon % dan % qator koradi', t, n; end if;
    exception when insufficient_privilege then null; -- huquq olib tashlangan: bu ham yaxshi
    end;
  end loop;
  begin
    insert into reports (entity_type, entity_id, reason) values ('club', gen_random_uuid(), 'x');
    raise exception 'RLS ochiq: anon reports ga yoza oldi';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;

-- 2) Akkauntni o'chirish: shaxsiy ma'lumot ketadi, events anonim qoladi.
delete from users where id = '00000000-0000-0000-0000-000000000001';
do $$ begin
  if exists (select 1 from club_members) then raise exception 'club_members qoldi'; end if;
  if exists (select 1 from ideas) then raise exception 'ideas qoldi'; end if;
  if exists (select 1 from login_tokens) then raise exception 'login_tokens qoldi'; end if;
  if (select count(*) from events where user_id is not null) <> 0 then raise exception 'events user_id anonim emas'; end if;
  if (select count(*) from events) <> 1 then raise exception 'events yoqolgan'; end if;
end $$;

-- 3) Yosh oralig'i faqat 3 ta qiymat; 13 dan kichik saqlanmaydi.
do $$ begin
  begin
    insert into users (telegram_id, age_range) values (222, '10-12');
    raise exception 'noto''g''ri age_range qabul qilindi';
  exception when check_violation then null;
  end;
end $$;

-- 4) Rate limit funksiyasi limitdan keyin rad etadi.
do $$ begin
  if not (rate_hit('t', 60, 1)) then raise exception 'birinchi urinish rad etildi'; end if;
  if rate_hit('t', 60, 1) then raise exception 'limit ishlamadi'; end if;
end $$;

rollback;
select 'safety.sql: hammasi OK' as natija;
