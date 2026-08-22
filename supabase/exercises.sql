-- ============================================================
-- FORGE: Exercise library
-- Paste this whole block into the Supabase SQL editor and run it,
-- then run supabase/exercises_seed.sql to populate it.
-- Safe to re-run: table/index/policy creation is idempotent.
-- Requires supabase/auth_profiles.sql to already be applied (the
-- profiles table and is_coach() below depend on it).
-- ============================================================

create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  muscle_group text not null,
  equipment text,
  instructions text,
  media_url text,
  is_custom boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Keeps the seed script idempotent and stops two library (non-custom)
-- rows from accidentally sharing a name. Custom exercises are exempt,
-- so a coach's own "Bench Press" variant never collides with the
-- library's seeded one.
create unique index if not exists exercises_library_name_uidx
  on public.exercises (name)
  where is_custom = false;

create index if not exists exercises_muscle_group_idx on public.exercises (muscle_group);
create index if not exists exercises_equipment_idx on public.exercises (equipment);

-- Reusable "is this user a coach?" check, read against the caller's own
-- profiles row (safe under profiles' own RLS -- see auth_profiles.sql).
create or replace function public.is_coach()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'coach'
  );
$$;

alter table public.exercises enable row level security;

-- Any authenticated user (coach or client) can read the whole library.
drop policy if exists "exercises_select_authenticated" on public.exercises;
create policy "exercises_select_authenticated"
  on public.exercises
  for select
  to authenticated
  using (true);

-- Only coaches can add exercises.
drop policy if exists "exercises_insert_coach" on public.exercises;
create policy "exercises_insert_coach"
  on public.exercises
  for insert
  to authenticated
  with check (public.is_coach());

-- Only coaches can edit exercises (library or custom).
drop policy if exists "exercises_update_coach" on public.exercises;
create policy "exercises_update_coach"
  on public.exercises
  for update
  to authenticated
  using (public.is_coach())
  with check (public.is_coach());

-- Seeded library rows (is_custom = false) can never be deleted, even by
-- a coach -- only a coach's own custom rows can be removed.
drop policy if exists "exercises_delete_custom_coach" on public.exercises;
create policy "exercises_delete_custom_coach"
  on public.exercises
  for delete
  to authenticated
  using (public.is_coach() and is_custom = true);
