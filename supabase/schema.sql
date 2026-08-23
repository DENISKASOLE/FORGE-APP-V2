-- FORGE coaching app schema
-- Run this in the Supabase SQL editor for your project.
-- Until these tables exist, the app falls back to sample data (see src/data/*.js)
-- so the UI keeps working end to end.
--
-- Run supabase/auth_profiles.sql, supabase/exercises.sql,
-- supabase/programs.sql, supabase/nutrition.sql, and supabase/progress.sql
-- FIRST -- profiles, the exercise library, programs/workouts, nutrition_
-- targets/meals/food_items/saved_meals, and checkins/measurements/
-- progress_photos/get_personal_records() all live there now (not in this
-- file).
-- Everything below assumes profiles already exists.

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

alter table alerts enable row level security;
alter table messages enable row level security;
alter table payments enable row level security;

-- Baseline RLS: a user can read/write their own rows, and a coach can read
-- rows belonging to clients whose profiles.coach_id points at them.
-- (profiles' own policies live in supabase/auth_profiles.sql; programs/
-- program_days/program_exercises/exercise_swaps/workout_logs/set_logs
-- policies live in supabase/programs.sql; checkins/measurements/
-- progress_photos policies live in supabase/progress.sql.)
create policy "own alerts" on alerts for all using (coach_id = auth.uid());

create policy "own payments" on payments for select using (
  client_id = auth.uid() or client_id in (select id from profiles where coach_id = auth.uid())
);

create policy "own messages" on messages for all using (
  client_id = auth.uid() or client_id in (select id from profiles where coach_id = auth.uid())
);
