-- ============================================================
-- FORGE: Nutrition (targets + food diary)
-- Paste this whole block into the Supabase SQL editor and run it.
-- Safe to re-run: table/policy creation is idempotent.
-- Requires supabase/auth_profiles.sql to already be applied.
-- Supersedes the placeholder nutrition_targets/meals/food_items/
-- saved_meals table definitions that used to live in schema.sql.
-- ============================================================

create table if not exists public.nutrition_targets (
  client_id uuid primary key references public.profiles(id) on delete cascade,
  kcal int not null default 2000,
  protein_g int not null default 150,
  carbs_g int not null default 200,
  fat_g int not null default 60,
  updated_at timestamptz not null default now()
);

-- One row per (client, meal name, day) -- e.g. "Breakfast" on 2026-08-24.
-- The client app always logs against the same 4 fixed meal names
-- (Breakfast/Lunch/Dinner/Snacks); a row is created lazily the first time
-- food is added to that meal on a given day.
create table if not exists public.meals (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  logged_date date not null default current_date,
  sort_order int not null default 0,
  unique (client_id, name, logged_date)
);

create table if not exists public.food_items (
  id uuid primary key default gen_random_uuid(),
  meal_id uuid not null references public.meals(id) on delete cascade,
  name text not null,
  emoji text,
  serving text,
  kcal int not null default 0,
  protein_g int not null default 0,
  carbs_g int not null default 0,
  fat_g int not null default 0,
  created_at timestamptz not null default now()
);

-- A client's own reusable meal shortcuts (e.g. "Post-Workout Shake"),
-- private to them -- not shared across clients or visible to the coach.
create table if not exists public.saved_meals (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  kcal int not null default 0,
  protein_g int not null default 0,
  carbs_g int not null default 0,
  fat_g int not null default 0
);

create index if not exists meals_client_date_idx on public.meals (client_id, logged_date);
create index if not exists food_items_meal_id_idx on public.food_items (meal_id);
create index if not exists saved_meals_client_id_idx on public.saved_meals (client_id);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.nutrition_targets enable row level security;
alter table public.meals enable row level security;
alter table public.food_items enable row level security;
alter table public.saved_meals enable row level security;

-- nutrition_targets: the coach sets/reads it for their clients; the
-- client can only read their own (never edit -- the coach sets targets).
drop policy if exists "nutrition_targets_coach_all" on public.nutrition_targets;
create policy "nutrition_targets_coach_all"
  on public.nutrition_targets
  for all
  to authenticated
  using (client_id in (select id from public.profiles where coach_id = auth.uid()))
  with check (client_id in (select id from public.profiles where coach_id = auth.uid()));

drop policy if exists "nutrition_targets_client_read" on public.nutrition_targets;
create policy "nutrition_targets_client_read"
  on public.nutrition_targets
  for select
  to authenticated
  using (client_id = auth.uid());

-- meals: the client owns their own food diary; the coach can read it
-- (to review adherence) but not edit what a client logged.
drop policy if exists "meals_client_own" on public.meals;
create policy "meals_client_own"
  on public.meals
  for all
  to authenticated
  using (client_id = auth.uid())
  with check (client_id = auth.uid());

drop policy if exists "meals_coach_read" on public.meals;
create policy "meals_coach_read"
  on public.meals
  for select
  to authenticated
  using (client_id in (select id from public.profiles where coach_id = auth.uid()));

-- food_items: same split, checked via the parent meal.
drop policy if exists "food_items_client_own" on public.food_items;
create policy "food_items_client_own"
  on public.food_items
  for all
  to authenticated
  using (exists (
    select 1 from public.meals m
    where m.id = food_items.meal_id and m.client_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.meals m
    where m.id = food_items.meal_id and m.client_id = auth.uid()
  ));

drop policy if exists "food_items_coach_read" on public.food_items;
create policy "food_items_coach_read"
  on public.food_items
  for select
  to authenticated
  using (exists (
    select 1 from public.meals m
    join public.profiles p on p.id = m.client_id
    where m.id = food_items.meal_id and p.coach_id = auth.uid()
  ));

-- saved_meals: fully client-private -- not even the coach can see these.
drop policy if exists "saved_meals_client_own" on public.saved_meals;
create policy "saved_meals_client_own"
  on public.saved_meals
  for all
  to authenticated
  using (client_id = auth.uid())
  with check (client_id = auth.uid());
