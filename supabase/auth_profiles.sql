-- ============================================================
-- FORGE: Auth + Profiles feature slice
-- Paste this whole block into the Supabase SQL editor and run it.
-- Safe to re-run: table/trigger/policy creation is idempotent.
--
-- Run this BEFORE supabase/schema.sql -- the other domain tables
-- (programs, checkins, payments, etc.) reference profiles(id).
-- ============================================================

-- 1. Table -------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'client' check (role in ('coach', 'client')),
  full_name text,
  email text,
  coach_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- 2. Auto-create a profile row for every new auth user ------------
-- security definer + fixed search_path so the trigger can write to
-- public.profiles regardless of the RLS policies below.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.email,
    'client'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3. Row Level Security --------------------------------------------
alter table public.profiles enable row level security;

-- A user can read their own profile; a coach can read the profiles
-- of clients where coach_id points at them. Nobody else can read
-- anyone else's row.
drop policy if exists "profiles_select_own_or_coach" on public.profiles;
create policy "profiles_select_own_or_coach"
  on public.profiles
  for select
  using (
    id = auth.uid()
    or coach_id = auth.uid()
  );

-- A user can only update their own profile (coaches cannot edit
-- client rows through this policy).
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles
  for update
  using (id = auth.uid())
  with check (id = auth.uid());
