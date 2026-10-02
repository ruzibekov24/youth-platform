-- Bot orqali moderatsiya: shikoyat ko'rib chiqilganini belgilash (admin panel yo'q).
-- hidden = obyekt yashirildi, dismissed = shikoyat asossiz deb topildi.
alter table reports add column resolved_at timestamptz;
alter table reports add column resolution text check (resolution in ('hidden', 'dismissed'));
create index reports_open_idx on reports (created_at desc) where resolved_at is null;
