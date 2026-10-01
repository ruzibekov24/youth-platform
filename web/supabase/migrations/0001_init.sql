-- Yoshlar Base: boshlangʻich sxema (PLAN.md, 6-boʻlim).
-- Bazaga faqat server (service role) murojaat qiladi. RLS yoqilgan, policy yoʻq = deny-all.

create extension if not exists pgcrypto;

-- Foydalanuvchilar: faqat minimal maʼlumot. Telefon, email, familiya, rasm, tugʻilgan sana SAQLANMAYDI.
create table users (
  id uuid primary key default gen_random_uuid(),
  telegram_id bigint not null unique,
  first_name text check (char_length(first_name) between 1 and 40),
  age_range text check (age_range in ('13-15', '16-17', '18-25')),
  region text check (char_length(region) <= 60),
  interests text[] not null default '{}',
  onboarding_step text check (onboarding_step in ('name', 'age', 'region', 'interests')),
  reminders_enabled boolean not null default true,
  created_at timestamptz not null default now()
);

-- Telegram orqali kirish: sayt token yaratadi, bot tasdiqlaydi, sayt sessiya ochadi.
create table login_tokens (
  token_hash text primary key,
  user_id uuid references users(id) on delete cascade,
  confirmed_at timestamptz,
  consumed_at timestamptz,
  expires_at timestamptz not null
);
create index login_tokens_expires_idx on login_tokens (expires_at);

create table clubs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null,
  organizer text not null,
  schedule_text text not null,
  is_active boolean not null default true,
  is_sample boolean not null default false
);

create table club_members (
  club_id uuid not null references clubs(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (club_id, user_id)
);

create table club_sessions (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references clubs(id) on delete cascade,
  starts_at timestamptz not null,
  place_or_link text not null,
  topic text not null,
  checkin_code text not null default encode(gen_random_bytes(9), 'hex'),
  reminder_sent_at timestamptz
);
create index club_sessions_starts_idx on club_sessions (starts_at);

create table club_attendance (
  session_id uuid not null references club_sessions(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  checked_in_at timestamptz not null default now(),
  primary key (session_id, user_id)
);

create table opportunities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null check (type in ('scholarship', 'program', 'competition', 'internship', 'event')),
  organizer text not null,
  closes_at timestamptz,
  age_min int check (age_min between 5 and 30),
  age_max int check (age_max between 5 and 30),
  eligibility text not null,
  region text not null,
  official_url text not null check (official_url ~ '^https?://'),
  verified_at timestamptz not null,
  status text not null default 'active' check (status in ('active', 'hidden')),
  is_sample boolean not null default false
);
create index opportunities_closes_idx on opportunities (closes_at);

create table saved_opportunities (
  user_id uuid not null references users(id) on delete cascade,
  opportunity_id uuid not null references opportunities(id) on delete cascade,
  saved_at timestamptz not null default now(),
  reminder_sent_at timestamptz,
  primary key (user_id, opportunity_id)
);

-- MIYA gʻoyalari: pending -> open (moderatsiyadan keyin).
create table ideas (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references users(id) on delete cascade,
  title text not null check (char_length(title) between 3 and 80),
  problem text not null check (char_length(problem) between 10 and 500),
  description text not null check (char_length(description) between 10 and 2000),
  needed_roles text[] not null default '{}',
  status text not null default 'pending' check (status in ('pending', 'open', 'closed')),
  age_group text not null check (age_group in ('under18', 'adult')),
  created_at timestamptz not null default now()
);
create index ideas_status_idx on ideas (status, created_at desc);

create table join_requests (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid not null references ideas(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  role text not null check (char_length(role) between 1 and 60),
  message text not null check (char_length(message) <= 500),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz not null default now(),
  unique (idea_id, user_id)
);

-- Analitika: user_id akkaunt oʻchirilganda anonimlashadi.
create table events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  type text not null,
  entity_type text,
  entity_id text,
  created_at timestamptz not null default now()
);
create index events_type_idx on events (type, created_at desc);

create table reports (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in ('opportunity', 'club', 'idea')),
  entity_id uuid not null,
  reason text not null check (char_length(reason) between 1 and 500),
  created_at timestamptz not null default now()
);

-- RLS: hamma jadvalda yoqilgan, policy yoʻq (deny-all). Service role RLS'ni chetlab oʻtadi.
alter table users enable row level security;
alter table login_tokens enable row level security;
alter table clubs enable row level security;
alter table club_members enable row level security;
alter table club_sessions enable row level security;
alter table club_attendance enable row level security;
alter table opportunities enable row level security;
alter table saved_opportunities enable row level security;
alter table ideas enable row level security;
alter table join_requests enable row level security;
alter table events enable row level security;
alter table reports enable row level security;
