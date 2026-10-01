-- MIYA: gʻoya tasdiqlanganda egasiga xabar berilganini belgilash.
alter table ideas add column approved_notified_at timestamptz;

-- Rate limit: serverless muhitda umumiy hisoblagich (ichki xotira ishonchsiz).
create table rate_limits (
  key text not null,
  window_start timestamptz not null,
  count int not null default 0,
  primary key (key, window_start)
);
alter table rate_limits enable row level security;

-- Qaytaradi: true = ruxsat, false = limitdan oshdi.
create or replace function rate_hit(p_key text, p_window_seconds int, p_limit int)
returns boolean
language plpgsql
set search_path = public
as $$
declare
  bucket timestamptz := to_timestamp(floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds);
  c int;
begin
  insert into rate_limits (key, window_start, count) values (p_key, bucket, 1)
  on conflict (key, window_start) do update set count = rate_limits.count + 1
  returning count into c;
  return c <= p_limit;
end;
$$;

do $$
begin
  -- Supabase'da: faqat service_role (server) chaqira oladi.
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke all on function rate_hit(text, int, int) from public, anon, authenticated;
    grant execute on function rate_hit(text, int, int) to service_role;
  end if;
end $$;
