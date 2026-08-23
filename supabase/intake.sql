-- ============================================================
-- FORGE: Client intake form
-- Paste this whole block into the Supabase SQL editor and run it.
-- Safe to re-run: table/index/policy creation is idempotent.
-- Requires supabase/auth_profiles.sql to already be applied.
-- ============================================================

-- One row per client, filled in once at signup and never duplicated
-- (client_id is unique). submitted_at is null until the client finishes
-- the wizard and hits Submit -- that's what the "complete your intake"
-- banner on the client's Today screen checks.
create table if not exists public.intake_forms (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null unique references public.profiles(id) on delete cascade,

  -- Section 1 -- About You
  full_name text,
  date_of_birth date,
  gender text,
  phone text,
  email text,
  city_timezone text,
  height text,
  current_weight text,
  occupation text,

  -- Section 2 -- Your Goals
  primary_goal text,
  change_one_thing text,
  target_outcome text,
  ideal_timeline text,
  tried_before text,
  success_definition text,

  -- Section 3 -- Training History
  experience_level text,
  training_duration text,
  current_training text,
  likes_dislikes text,
  days_per_week int,
  session_length text,
  preferred_time text,

  -- Section 4 -- Access & Equipment
  training_location text,
  equipment_access text,
  equipment_limitations text,

  -- Section 5 -- Injuries & Health
  injuries text,
  pain_movements text,
  medical_conditions text,
  medications text,
  doctor_cleared boolean,
  pregnant_postpartum text,

  -- Section 6 -- Nutrition
  typical_day_eating text,
  meals_per_day int,
  cook_or_eat_out text,
  allergies text,
  dietary_preference text,
  refused_foods text,
  alcohol_frequency text,
  water_intake text,
  wants_nutrition_coaching boolean,

  -- Section 7 -- Lifestyle & Recovery
  average_sleep text,
  sleep_quality text,
  stress_level text,
  lifestyle_obstacle text,

  -- Section 8 -- Accountability
  communication_preference text,
  checkin_frequency text,
  coaching_style text,
  additional_notes text,

  -- Section 9 -- Agreement
  agreement_confirmed boolean not null default false,
  photo_consent boolean not null default false,

  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists intake_forms_client_id_idx on public.intake_forms (client_id);

alter table public.intake_forms enable row level security;

-- Client owns their own row (fill it in, resubmit later if needed).
-- Coach can read their clients' answers but never edit them -- it's the
-- client's own account of themselves.
drop policy if exists "intake_forms_client_own" on public.intake_forms;
create policy "intake_forms_client_own"
  on public.intake_forms
  for all
  to authenticated
  using (client_id = auth.uid())
  with check (client_id = auth.uid());

drop policy if exists "intake_forms_coach_read" on public.intake_forms;
create policy "intake_forms_coach_read"
  on public.intake_forms
  for select
  to authenticated
  using (client_id in (select id from public.profiles where coach_id = auth.uid()));
