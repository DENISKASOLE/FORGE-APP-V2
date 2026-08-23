-- ============================================================
-- FORGE: Progress (check-ins, weight history, measurements,
-- personal records, progress photos)
-- Paste this whole block into the Supabase SQL editor and run it.
-- Safe to re-run: table/index/policy/function creation is idempotent.
-- Requires supabase/auth_profiles.sql, supabase/exercises.sql, and
-- supabase/programs.sql to already be applied (personal records are
-- computed live from set_logs/workout_logs/exercises).
--
-- This supersedes the checkins/measurements/personal_records placeholders
-- in supabase/schema.sql: personal_records is dropped entirely (PRs are
-- computed live from real set_logs, never stored/duplicated), and
-- checkins drops the old `week` column (programs no longer track a week
-- number). If you already ran the old schema.sql placeholders, this file
-- is still safe to run -- it only adds/replaces, and the bottom of
-- schema.sql no longer creates these three tables.
-- ============================================================

create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  weight numeric,
  energy int,
  sleep int,
  stress int,
  nutrition_adherence int,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'reviewed')),
  submitted_at timestamptz not null default now()
);

create table if not exists public.measurements (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  label text not null,
  value numeric not null,
  recorded_at timestamptz not null default now()
);

-- Progress photos live here (not on checkins) so a client can add one any
-- time, not only during a weekly check-in.
create table if not exists public.progress_photos (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  storage_path text not null,
  taken_at date not null default current_date,
  created_at timestamptz not null default now()
);

create index if not exists checkins_client_id_idx on public.checkins (client_id);
create index if not exists measurements_client_id_idx on public.measurements (client_id);
create index if not exists progress_photos_client_id_idx on public.progress_photos (client_id);

alter table public.checkins enable row level security;
alter table public.measurements enable row level security;
alter table public.progress_photos enable row level security;

-- Client owns their own rows; their coach has full access too (review a
-- check-in, mark it reviewed, correct an entry) -- same shape as
-- workout_logs in supabase/programs.sql.
drop policy if exists "own checkins" on public.checkins;
drop policy if exists "checkins_client_own" on public.checkins;
create policy "checkins_client_own"
  on public.checkins
  for all
  to authenticated
  using (client_id = auth.uid())
  with check (client_id = auth.uid());

drop policy if exists "checkins_coach_access" on public.checkins;
create policy "checkins_coach_access"
  on public.checkins
  for all
  to authenticated
  using (client_id in (select id from public.profiles where coach_id = auth.uid()))
  with check (client_id in (select id from public.profiles where coach_id = auth.uid()));

drop policy if exists "measurements_client_own" on public.measurements;
create policy "measurements_client_own"
  on public.measurements
  for all
  to authenticated
  using (client_id = auth.uid())
  with check (client_id = auth.uid());

drop policy if exists "measurements_coach_read" on public.measurements;
create policy "measurements_coach_read"
  on public.measurements
  for select
  to authenticated
  using (client_id in (select id from public.profiles where coach_id = auth.uid()));

drop policy if exists "progress_photos_client_own" on public.progress_photos;
create policy "progress_photos_client_own"
  on public.progress_photos
  for all
  to authenticated
  using (client_id = auth.uid())
  with check (client_id = auth.uid());

drop policy if exists "progress_photos_coach_read" on public.progress_photos;
create policy "progress_photos_coach_read"
  on public.progress_photos
  for select
  to authenticated
  using (client_id in (select id from public.profiles where coach_id = auth.uid()));

-- ============================================================
-- Personal records -- computed live from set_logs, never stored.
-- For every exercise the client has ever logged a weighted set for:
-- the best set ever (highest weight, ties broken by higher reps) and
-- the best set from their most recent session for that exercise.
--
-- security definer because it reads across workout_logs/set_logs/
-- exercises on behalf of either the client themselves or their coach --
-- the explicit auth check below stands in for the RLS a normal query
-- would otherwise apply.
-- ============================================================

create or replace function public.get_personal_records(p_client_id uuid)
returns table (
  exercise_id uuid,
  exercise_name text,
  best_weight numeric,
  best_reps int,
  recent_weight numeric,
  recent_reps int
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if p_client_id <> auth.uid() and not exists (
    select 1 from public.profiles where id = p_client_id and coach_id = auth.uid()
  ) then
    raise exception 'not authorized';
  end if;

  return query
  with client_sets as (
    select sl.exercise_id, sl.weight, sl.reps, wl.performed_at
    from public.set_logs sl
    join public.workout_logs wl on wl.id = sl.workout_log_id
    where wl.client_id = p_client_id
      and sl.weight is not null and sl.weight > 0
  ),
  best as (
    select distinct on (exercise_id) exercise_id, weight as best_weight, reps as best_reps
    from client_sets
    order by exercise_id, weight desc, reps desc
  ),
  last_session as (
    select exercise_id, max(performed_at) as last_date
    from client_sets
    group by exercise_id
  ),
  recent as (
    select distinct on (cs.exercise_id) cs.exercise_id, cs.weight as recent_weight, cs.reps as recent_reps
    from client_sets cs
    join last_session ls on ls.exercise_id = cs.exercise_id and cs.performed_at = ls.last_date
    order by cs.exercise_id, cs.weight desc, cs.reps desc
  )
  select b.exercise_id, e.name, b.best_weight, b.best_reps, r.recent_weight, r.recent_reps
  from best b
  join recent r on r.exercise_id = b.exercise_id
  join public.exercises e on e.id = b.exercise_id
  order by b.best_weight desc;
end;
$$;

grant execute on function public.get_personal_records(uuid) to authenticated;

-- ============================================================
-- Storage: progress photos (private bucket, one folder per client --
-- object paths are "<client_id>/<filename>")
-- ============================================================

insert into storage.buckets (id, name, public)
values ('progress-photos', 'progress-photos', false)
on conflict (id) do nothing;

drop policy if exists "progress_photos_storage_client_own" on storage.objects;
create policy "progress_photos_storage_client_own"
  on storage.objects
  for all
  to authenticated
  using (bucket_id = 'progress-photos' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'progress-photos' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "progress_photos_storage_coach_read" on storage.objects;
create policy "progress_photos_storage_coach_read"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'progress-photos'
    and (storage.foldername(name))[1] in (select id::text from public.profiles where coach_id = auth.uid())
  );
