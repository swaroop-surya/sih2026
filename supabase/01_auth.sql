-- =========================================================================
-- Abhaya - Supabase Auth & Profiles Schema (01_auth.sql)
-- =========================================================================

-- 1. Profiles Table
-- Stores user identity metadata for the community and personalized experience.
-- Real phone numbers and email addresses remain in auth.users and are never exposed.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  alias text unique not null,
  first_name text,
  language text default 'en',
  onboarded boolean default false,
  created_at timestamptz default now()
);

-- Index for alias lookup uniqueness
create index if not exists idx_profiles_alias on public.profiles(alias);

-- 2. Row Level Security (RLS)
-- Crucial Security Rule: Do NOT expose the profiles table to other users.
-- A user can select, insert, and update only their own row.
alter table public.profiles enable row level security;

-- Policy: Select own profile
create policy "Users can view own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

-- Policy: Insert own profile
create policy "Users can insert own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

-- Policy: Update own profile
create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Policy: Delete own profile
create policy "Users can delete own profile"
  on public.profiles
  for delete
  using (auth.uid() = id);

-- 3. Stored Procedure (RPC) to delete community data
-- Allows user to wipe their alias and community profile cleanly from the server.
create or replace function public.delete_user_community_data()
returns void
language plpgsql
security definer
as $$
declare
  current_user_id uuid;
begin
  current_user_id := auth.uid();
  if current_user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- Remove public profile data
  delete from public.profiles where id = current_user_id;

  -- In future community tables, user messages/contributions can also be cleared or anonymized here
end;
$$;
