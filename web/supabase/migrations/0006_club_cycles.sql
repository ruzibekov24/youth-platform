-- Klub tsikli (pilot): oʻrinlar, boshlanish sanasi, davomiylik, yosh guruhi; sessiya turi (oddiy yoki Demo Day).
-- Hammasi ixtiyoriy ustunlar: mavjud klublar oldingidek ishlayveradi.

alter table clubs
  add column if not exists seats int check (seats between 2 and 200),
  add column if not exists min_to_start int not null default 5 check (min_to_start between 1 and 50),
  add column if not exists cycle_weeks int check (cycle_weeks between 1 and 26),
  add column if not exists starts_on date,
  add column if not exists age_group text check (age_group in ('under18', 'adult'));

alter table club_sessions
  add column if not exists kind text not null default 'regular' check (kind in ('regular', 'demo'));

-- Atomik qoʻshilish: oʻrinlar soni tekshiriladi (ikki kishi bir vaqtda oxirgi oʻrinni ololmaydi).
-- Natija: ok | already | full | missing
create or replace function join_club(p_club uuid, p_user uuid) returns text
language plpgsql
set search_path = public
as $$
declare
  v_seats int;
  v_count int;
begin
  select seats into v_seats from clubs where id = p_club and is_active for update;
  if not found then
    return 'missing';
  end if;
  if exists (select 1 from club_members where club_id = p_club and user_id = p_user) then
    return 'already';
  end if;
  if v_seats is not null then
    select count(*) into v_count from club_members where club_id = p_club;
    if v_count >= v_seats then
      return 'full';
    end if;
  end if;
  insert into club_members (club_id, user_id) values (p_club, p_user);
  return 'ok';
end;
$$;

revoke all on function join_club(uuid, uuid) from public;
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke all on function join_club(uuid, uuid) from anon, authenticated;
  end if;
end $$;
