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
  invite_code text unique,
  created_at timestamptz not null default now()
);

-- Older projects created before invite_code existed -- safe to re-run.
alter table public.profiles add column if not exists invite_code text unique;

-- 2. Auto-create a profile row for every new auth user ------------
-- security definer + fixed search_path so the trigger can write to
-- public.profiles regardless of the RLS policies below. If the client
-- signed up with a coach's invite code (passed through as signUp's
-- options.data.invite_code), this looks up that coach and links the new
-- profile to them immediately -- entirely server-side, so it still works
-- even when email confirmation means the client has no session yet.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  invite_coach_id uuid;
begin
  if new.raw_user_meta_data ->> 'invite_code' is not null then
    select id into invite_coach_id
    from public.profiles
    where invite_code = new.raw_user_meta_data ->> 'invite_code'
      and role = 'coach'
    limit 1;
  end if;

  insert into public.profiles (id, full_name, email, role, coach_id)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.email,
    'client',
    invite_coach_id
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
