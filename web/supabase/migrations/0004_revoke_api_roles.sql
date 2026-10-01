-- Qoʻshimcha himoya: RLS deny-all ustiga ommaviy API rollaridan (anon, authenticated) jadval huquqlari ham olinadi.
-- Server service_role orqali ishlaydi, shuning uchun bu hech narsani buzmaydi.
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    revoke all on all tables in schema public from anon, authenticated;
    revoke all on all sequences in schema public from anon, authenticated;
    revoke all on all functions in schema public from anon, authenticated;
    alter default privileges in schema public revoke all on tables from anon, authenticated;
    alter default privileges in schema public revoke all on functions from anon, authenticated;
  end if;
end $$;
