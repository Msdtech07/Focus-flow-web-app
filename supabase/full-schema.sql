-- ============================================================
-- FocusFlow — Complete Supabase Schema
-- Run this in your Supabase SQL Editor to ensure everything exists
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- Enums ----------
do $$ begin
  create type app_plan as enum ('free','pro','team');
exception when duplicate_object then null; end $$;

do $$ begin
  create type task_status as enum ('todo','in_progress','done','archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type task_priority as enum ('low','medium','high','urgent');
exception when duplicate_object then null; end $$;

do $$ begin
  create type app_role as enum ('owner','admin','member','viewer');
exception when duplicate_object then null; end $$;

-- ---------- Profiles (mirrors auth.users) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default '',
  avatar_url text,
  plan app_plan not null default 'free',
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

create policy "profiles_self_select" on public.profiles
  for select to authenticated using (id = auth.uid());
create policy "profiles_self_update" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Tasks ----------
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) <= 200),
  description text check (char_length(description) <= 4000),
  priority task_priority not null default 'medium',
  category text not null default 'work',
  deadline timestamptz,
  due_date timestamptz,
  estimated_effort int not null default 30 check (estimated_effort between 1 and 1440),
  status task_status not null default 'todo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  rank_position integer,
  priority_score integer,
  completed_at timestamptz,
  ai_reason text
);
create index if not exists tasks_user_status_idx on public.tasks (user_id, status);
create index if not exists tasks_deadline_idx on public.tasks (deadline);

grant select, insert, update, delete on public.tasks to authenticated;
grant all on public.tasks to service_role;
alter table public.tasks enable row level security;
create policy "tasks_owner_all" on public.tasks
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------- Daily priorities (AI Top 3) ----------
create table if not exists public.daily_priorities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null default current_date,
  priority_one jsonb,
  priority_two jsonb,
  priority_three jsonb,
  generated_at timestamptz not null default now(),
  unique (user_id, date)
);
grant select, insert, update, delete on public.daily_priorities to authenticated;
grant all on public.daily_priorities to service_role;
alter table public.daily_priorities enable row level security;
create policy "daily_priorities_owner_all" on public.daily_priorities
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------- Reflections ----------
create table if not exists public.reflections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null default current_date,
  went_well text not null default '',
  didnt_go_well text not null default '',
  tomorrow_goals text not null default '',
  mood smallint not null check (mood between 1 and 5),
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.reflections to authenticated;
grant all on public.reflections to service_role;
alter table public.reflections enable row level security;
create policy "reflections_owner_all" on public.reflections
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------- Streaks ----------
create table if not exists public.streaks (
  user_id uuid primary key references auth.users(id) on delete cascade,
  current_streak int not null default 0,
  longest_streak int not null default 0,
  last_active_date date,
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.streaks to authenticated;
grant all on public.streaks to service_role;
alter table public.streaks enable row level security;
create policy "streaks_owner_all" on public.streaks
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------- Analytics snapshots ----------
create table if not exists public.analytics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null default current_date,
  productivity_score int not null default 0,
  focus_score int not null default 0,
  tasks_completed int not null default 0,
  completion_rate int not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, date)
);
grant select, insert, update on public.analytics to authenticated;
grant all on public.analytics to service_role;
alter table public.analytics enable row level security;
create policy "analytics_owner_select" on public.analytics
  for select to authenticated using (user_id = auth.uid());

-- ---------- Subscriptions (Razorpay) ----------
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan app_plan not null,
  status text not null default 'active',
  renewal_date timestamptz,
  razorpay_subscription_id text unique,
  razorpay_customer_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.subscriptions to authenticated;
grant all on public.subscriptions to service_role;
alter table public.subscriptions enable row level security;
create policy "subs_owner_select" on public.subscriptions
  for select to authenticated using (user_id = auth.uid());

-- ---------- Teams ----------
create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) <= 80),
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.teams to authenticated;
grant all on public.teams to service_role;
alter table public.teams enable row level security;

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null default 'member',
  created_at timestamptz not null default now(),
  unique (team_id, user_id)
);
grant select, insert, update, delete on public.team_members to authenticated;
grant all on public.team_members to service_role;
alter table public.team_members enable row level security;

-- Security-definer helper (avoids recursive RLS)
create or replace function public.is_team_member(p_team_id uuid, p_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.team_members where team_id = p_team_id and user_id = p_user_id);
$$;

create policy "teams_member_select" on public.teams
  for select to authenticated using (owner_id = auth.uid() or public.is_team_member(id, auth.uid()));
create policy "teams_owner_mutate" on public.teams
  for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "team_members_self_select" on public.team_members
  for select to authenticated using (user_id = auth.uid() or public.is_team_member(team_id, auth.uid()));
create policy "team_members_owner_mutate" on public.team_members
  for all to authenticated
  using (exists(select 1 from public.teams t where t.id = team_id and t.owner_id = auth.uid()))
  with check (exists(select 1 from public.teams t where t.id = team_id and t.owner_id = auth.uid()));

-- ---------- Audit log ----------
create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  event text not null,
  payload jsonb,
  created_at timestamptz not null default now()
);
grant insert on public.audit_log to authenticated;
grant all on public.audit_log to service_role;
alter table public.audit_log enable row level security;
create policy "audit_self_insert" on public.audit_log
  for insert to authenticated with check (user_id = auth.uid());

-- ---------- Update User Streak Function ----------
create or replace function public.update_user_streak(p_user_id uuid)
returns void
language plpgsql
security definer
as $$
declare
  v_last_active date;
  v_today date := current_date;
  v_current_streak integer;
  v_longest_streak integer;
begin
  -- Get user's current streak data
  select last_active_date, current_streak, longest_streak
  into v_last_active, v_current_streak, v_longest_streak
  from public.streaks
  where user_id = p_user_id;

  -- If no streak record exists, create one
  if v_last_active is null then
    insert into public.streaks (user_id, current_streak, longest_streak, last_active_date, updated_at)
    values (p_user_id, 1, 1, v_today, now());
    return;
  end if;

  -- If last active was yesterday, increment streak
  if v_last_active = v_today - 1 then
    v_current_streak := v_current_streak + 1;
    v_longest_streak := greatest(v_longest_streak, v_current_streak);

    update public.streaks
    set 
      current_streak = v_current_streak,
      longest_streak = v_longest_streak,
      last_active_date = v_today,
      updated_at = now()
    where user_id = p_user_id;
  -- If last active was not today, reset streak to 1
  elsif v_last_active != v_today then
    update public.streaks
    set 
      current_streak = 1,
      last_active_date = v_today,
      updated_at = now()
    where user_id = p_user_id;
  end if;
end;
$$;
