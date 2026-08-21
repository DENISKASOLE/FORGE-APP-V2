-- FORGE coaching app schema
-- Run this in the Supabase SQL editor for your project.
-- Until these tables exist, the app falls back to sample data (see src/data/*.js)
-- so the UI keeps working end to end.

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'client' check (role in ('client', 'coach')),
  coach_id uuid references profiles(id),
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists programs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  current_week int not null default 1,
  total_weeks int not null default 12,
  created_at timestamptz not null default now()
);

create table if not exists workout_days (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references programs(id) on delete cascade,
  label text not null,
  name text not null,
  sort_order int not null default 0
);

create table if not exists exercise_blocks (
  id uuid primary key default gen_random_uuid(),
  workout_day_id uuid not null references workout_days(id) on delete cascade,
  label text not null,
  sort_order int not null default 0
);

create table if not exists exercises (
  id uuid primary key default gen_random_uuid(),
  block_id uuid not null references exercise_blocks(id) on delete cascade,
  name text not null,
  muscle_group text,
  target_sets int not null default 3,
  target_reps int not null default 10,
  target_weight numeric,
  tip text,
  sort_order int not null default 0
);

create table if not exists workout_logs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references profiles(id) on delete cascade,
  workout_day_id uuid references workout_days(id),
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  total_volume numeric,
  sets_completed int
);

create table if not exists set_logs (
  id uuid primary key default gen_random_uuid(),
  workout_log_id uuid not null references workout_logs(id) on delete cascade,
  exercise_id uuid not null references exercises(id),
  set_number int not null,
  reps int,
  weight numeric,
  completed boolean not null default false
);

create table if not exists nutrition_targets (
  client_id uuid primary key references profiles(id) on delete cascade,
  kcal int not null,
  protein_g int not null,
  carbs_g int not null,
  fat_g int not null
);

create table if not exists meals (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  logged_date date not null default current_date,
  sort_order int not null default 0
);

create table if not exists food_items (
  id uuid primary key default gen_random_uuid(),
  meal_id uuid not null references meals(id) on delete cascade,
  name text not null,
  emoji text,
  serving text,
  kcal int not null,
  protein_g int not null default 0,
  carbs_g int not null default 0,
  fat_g int not null default 0
);

create table if not exists saved_meals (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  kcal int not null,
  protein_g int not null default 0,
  carbs_g int not null default 0,
  fat_g int not null default 0
);

create table if not exists checkins (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references profiles(id) on delete cascade,
  week int not null,
  weight numeric,
  energy int,
  sleep int,
  stress int,
  nutrition_adherence int,
  notes text,
  photo_urls text[],
  status text not null default 'pending' check (status in ('pending', 'reviewed')),
  submitted_at timestamptz not null default now()
);

create table if not exists measurements (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references profiles(id) on delete cascade,
  label text not null,
  value numeric not null,
  recorded_at timestamptz not null default now()
);

create table if not exists personal_records (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references profiles(id) on delete cascade,
  lift text not null,
  best_weight numeric,
  best_reps int,
  recent_weight numeric,
  recent_reps int
);

create table if not exists alerts (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references profiles(id) on delete cascade,
  client_id uuid not null references profiles(id) on delete cascade,
  type text not null,
  detail text,
  severity text not null default 'muted',
  handled boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references profiles(id) on delete cascade,
  sender_id uuid not null references profiles(id),
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references profiles(id) on delete cascade,
  amount numeric not null,
  currency text not null default 'AED',
  status text not null default 'pending' check (status in ('paid', 'pending', 'overdue')),
  due_date date not null
);

alter table profiles enable row level security;
alter table programs enable row level security;
alter table workout_days enable row level security;
alter table exercise_blocks enable row level security;
alter table exercises enable row level security;
alter table workout_logs enable row level security;
alter table set_logs enable row level security;
alter table nutrition_targets enable row level security;
alter table meals enable row level security;
alter table food_items enable row level security;
alter table saved_meals enable row level security;
alter table checkins enable row level security;
alter table measurements enable row level security;
alter table personal_records enable row level security;
alter table alerts enable row level security;
alter table messages enable row level security;
alter table payments enable row level security;

-- Baseline RLS: a user can read/write their own rows, and a coach can read
-- rows belonging to clients whose profiles.coach_id points at them.
create policy "own profile" on profiles for select using (id = auth.uid() or coach_id = auth.uid());
create policy "update own profile" on profiles for update using (id = auth.uid());

create policy "own programs" on programs for all using (
  client_id = auth.uid() or client_id in (select id from profiles where coach_id = auth.uid())
);

create policy "own checkins" on checkins for all using (
  client_id = auth.uid() or client_id in (select id from profiles where coach_id = auth.uid())
);

create policy "own alerts" on alerts for all using (coach_id = auth.uid());

create policy "own payments" on payments for select using (
  client_id = auth.uid() or client_id in (select id from profiles where coach_id = auth.uid())
);

create policy "own messages" on messages for all using (
  client_id = auth.uid() or client_id in (select id from profiles where coach_id = auth.uid())
);
