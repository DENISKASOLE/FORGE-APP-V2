-- ============================================================
-- FORGE: Programs + workouts (the core coaching loop)
-- Paste this whole block into the Supabase SQL editor and run it.
-- Safe to re-run: table/index/policy creation is idempotent.
-- Requires supabase/auth_profiles.sql AND supabase/exercises.sql to
-- already be applied (programs references profiles; program_exercises
-- and exercise_swaps reference exercises).
-- ============================================================

create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  coach_id uuid not null references public.profiles(id) on delete cascade,
  client_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.program_days (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs(id) on delete cascade,
  day_label text not null,
  sort_order int not null default 0
);

create table if not exists public.program_exercises (
  id uuid primary key default gen_random_uuid(),
  program_day_id uuid not null references public.program_days(id) on delete cascade,
  exercise_id uuid not null references public.exercises(id),
  block_label text,
  sets int not null default 3,
  reps int not null default 10,
  sort_order int not null default 0
);

-- Coach-approved swap alternates for a given program exercise. A client
-- may only swap to one of these, never to an arbitrary library exercise.
create table if not exists public.exercise_swaps (
  id uuid primary key default gen_random_uuid(),
  program_exercise_id uuid not null references public.program_exercises(id) on delete cascade,
  alternate_exercise_id uuid not null references public.exercises(id)
);

create table if not exists public.workout_logs (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  program_day_id uuid references public.program_days(id) on delete set null,
  performed_at timestamptz not null default now()
);

create table if not exists public.set_logs (
  id uuid primary key default gen_random_uuid(),
  workout_log_id uuid not null references public.workout_logs(id) on delete cascade,
  -- The exercise actually performed -- may differ from program_exercises.exercise_id
  -- if the client swapped to a coach-approved alternate for this session.
  exercise_id uuid not null references public.exercises(id),
  set_number int not null,
  weight numeric,
  reps int,
  rpe numeric
);

-- Older projects created before rpe existed -- safe to re-run.
alter table public.set_logs add column if not exists rpe numeric;

-- Indexes to support both normal lookups and the RLS join checks below.
create index if not exists programs_coach_id_idx on public.programs (coach_id);
create index if not exists programs_client_id_idx on public.programs (client_id);
create index if not exists program_days_program_id_idx on public.program_days (program_id);
create index if not exists program_exercises_program_day_id_idx on public.program_exercises (program_day_id);
create index if not exists program_exercises_exercise_id_idx on public.program_exercises (exercise_id);
create index if not exists exercise_swaps_program_exercise_id_idx on public.exercise_swaps (program_exercise_id);
create index if not exists workout_logs_client_id_idx on public.workout_logs (client_id);
create index if not exists workout_logs_program_day_id_idx on public.workout_logs (program_day_id);
create index if not exists set_logs_workout_log_id_idx on public.set_logs (workout_log_id);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.programs enable row level security;
alter table public.program_days enable row level security;
alter table public.program_exercises enable row level security;
alter table public.exercise_swaps enable row level security;
alter table public.workout_logs enable row level security;
alter table public.set_logs enable row level security;

-- programs: a coach reads/writes programs they own; a client can only
-- read the program assigned to them (never edit it).
drop policy if exists "programs_coach_all" on public.programs;
create policy "programs_coach_all"
  on public.programs
  for all
  to authenticated
  using (coach_id = auth.uid())
  with check (coach_id = auth.uid());

drop policy if exists "programs_client_read" on public.programs;
create policy "programs_client_read"
  on public.programs
  for select
  to authenticated
  using (client_id = auth.uid());

-- program_days: same split, checked via the parent program.
drop policy if exists "program_days_coach_all" on public.program_days;
create policy "program_days_coach_all"
  on public.program_days
  for all
  to authenticated
  using (exists (
    select 1 from public.programs p
    where p.id = program_days.program_id and p.coach_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.programs p
    where p.id = program_days.program_id and p.coach_id = auth.uid()
  ));

drop policy if exists "program_days_client_read" on public.program_days;
create policy "program_days_client_read"
  on public.program_days
  for select
  to authenticated
  using (exists (
    select 1 from public.programs p
    where p.id = program_days.program_id and p.client_id = auth.uid()
  ));

-- program_exercises: same split, checked via program_days -> programs.
drop policy if exists "program_exercises_coach_all" on public.program_exercises;
create policy "program_exercises_coach_all"
  on public.program_exercises
  for all
  to authenticated
  using (exists (
    select 1 from public.program_days d
    join public.programs p on p.id = d.program_id
    where d.id = program_exercises.program_day_id and p.coach_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.program_days d
    join public.programs p on p.id = d.program_id
    where d.id = program_exercises.program_day_id and p.coach_id = auth.uid()
  ));

drop policy if exists "program_exercises_client_read" on public.program_exercises;
create policy "program_exercises_client_read"
  on public.program_exercises
  for select
  to authenticated
  using (exists (
    select 1 from public.program_days d
    join public.programs p on p.id = d.program_id
    where d.id = program_exercises.program_day_id and p.client_id = auth.uid()
  ));

-- exercise_swaps: same split, checked via program_exercises -> program_days -> programs.
drop policy if exists "exercise_swaps_coach_all" on public.exercise_swaps;
create policy "exercise_swaps_coach_all"
  on public.exercise_swaps
  for all
  to authenticated
  using (exists (
    select 1 from public.program_exercises pe
    join public.program_days d on d.id = pe.program_day_id
    join public.programs p on p.id = d.program_id
    where pe.id = exercise_swaps.program_exercise_id and p.coach_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.program_exercises pe
    join public.program_days d on d.id = pe.program_day_id
    join public.programs p on p.id = d.program_id
    where pe.id = exercise_swaps.program_exercise_id and p.coach_id = auth.uid()
  ));

drop policy if exists "exercise_swaps_client_read" on public.exercise_swaps;
create policy "exercise_swaps_client_read"
  on public.exercise_swaps
  for select
  to authenticated
  using (exists (
    select 1 from public.program_exercises pe
    join public.program_days d on d.id = pe.program_day_id
    join public.programs p on p.id = d.program_id
    where pe.id = exercise_swaps.program_exercise_id and p.client_id = auth.uid()
  ));

-- workout_logs / set_logs: a client has full access to their own logs, and
-- so does their coach (coach can read logged sessions, see missed days,
-- edit/delete a logged set, and log a session on the client's behalf).
-- Nobody outside that pairing sees or touches either table.
drop policy if exists "workout_logs_own" on public.workout_logs;

drop policy if exists "workout_logs_client_own" on public.workout_logs;
create policy "workout_logs_client_own"
  on public.workout_logs
  for all
  to authenticated
  using (client_id = auth.uid())
  with check (client_id = auth.uid());

drop policy if exists "workout_logs_coach_access" on public.workout_logs;
create policy "workout_logs_coach_access"
  on public.workout_logs
  for all
  to authenticated
  using (client_id in (select id from public.profiles where coach_id = auth.uid()))
  with check (client_id in (select id from public.profiles where coach_id = auth.uid()));

drop policy if exists "set_logs_own" on public.set_logs;

drop policy if exists "set_logs_client_own" on public.set_logs;
create policy "set_logs_client_own"
  on public.set_logs
  for all
  to authenticated
  using (exists (
    select 1 from public.workout_logs w
    where w.id = set_logs.workout_log_id and w.client_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.workout_logs w
    where w.id = set_logs.workout_log_id and w.client_id = auth.uid()
  ));

drop policy if exists "set_logs_coach_access" on public.set_logs;
create policy "set_logs_coach_access"
  on public.set_logs
  for all
  to authenticated
  using (exists (
    select 1 from public.workout_logs w
    join public.profiles p on p.id = w.client_id
    where w.id = set_logs.workout_log_id and p.coach_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.workout_logs w
    join public.profiles p on p.id = w.client_id
    where w.id = set_logs.workout_log_id and p.coach_id = auth.uid()
  ));
