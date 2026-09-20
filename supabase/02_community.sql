-- =========================================================================
-- Abhaya - Community & Area-Based Nearby Schema (02_community.sql)
-- =========================================================================

-- 1. Areas Table
-- Cached geohash precision 5 cells (~5km x 5km) with reverse geocoded names.
create table if not exists public.areas (
  id text primary key, -- 5-character geohash string e.g. 'tdr1v'
  name text not null,
  center_lat double precision not null,
  center_lng double precision not null,
  sw_label text,
  ne_label text,
  created_at timestamptz default now()
);

-- RLS: Any signed-in user can select and insert, nobody can update
alter table public.areas enable row level security;

create policy "Signed in users can view areas"
  on public.areas
  for select
  to authenticated
  using (true);

create policy "Signed in users can insert areas"
  on public.areas
  for insert
  to authenticated
  with check (true);

-- 2. Messages Table
-- Area chat messages and public safety alerts.
-- Text only, maximum 280 characters.
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  area_id text not null references public.areas(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  author_alias text not null,
  kind text not null check (kind in ('chat', 'alert')),
  category text check (
    category is null or category in (
      'no_street_light',
      'dark_unsafe_stretch',
      'suspicious_activity',
      'harassment',
      'crowd_eve_teasing',
      'road_blocked',
      'unsafe_transport',
      'police_patrol_here',
      'safe_spot'
    )
  ),
  body text not null check (length(trim(body)) >= 1 and length(body) <= 280),
  pin_geohash text check (pin_geohash is null or length(pin_geohash) = 7),
  confirm_count int not null default 0,
  fixed_count int not null default 0,
  report_count int not null default 0,
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);

-- Index for fetching area feeds quickly by area and reverse chronological order
create index if not exists idx_messages_area_created
  on public.messages(area_id, created_at desc);

create index if not exists idx_messages_author
  on public.messages(author_id);

-- 3. Confirmations Table
-- Tracks "I see this too" and "It's fixed" community votes.
create table if not exists public.confirmations (
  message_id uuid not null references public.messages(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('confirm', 'fixed')),
  created_at timestamptz not null default now(),
  primary key (message_id, user_id, kind)
);

-- 4. Reports Table
-- Community moderation: a report needs a reason.
create table if not exists public.reports (
  message_id uuid not null references public.messages(id) on delete cascade,
  reporter_id uuid not null references auth.users(id) on delete cascade,
  reason text not null check (length(trim(reason)) >= 2),
  created_at timestamptz not null default now(),
  primary key (message_id, reporter_id)
);

-- 5. Blocks Table
-- User-level blocks: blocker hides blocked user's messages.
create table if not exists public.blocks (
  blocker_id uuid not null references auth.users(id) on delete cascade,
  blocked_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id)
);

-- -------------------------------------------------------------------------
-- Row Level Security (RLS) Policies
-- -------------------------------------------------------------------------

alter table public.messages enable row level security;
alter table public.confirmations enable row level security;
alter table public.reports enable row level security;
alter table public.blocks enable row level security;

-- Messages Policies
create policy "Users can view non-hidden messages"
  on public.messages
  for select
  to authenticated
  using (hidden = false or author_id = auth.uid());

create policy "Users can insert messages matching their own alias"
  on public.messages
  for insert
  to authenticated
  with check (
    author_id = auth.uid() and
    author_alias = (select alias from public.profiles where id = auth.uid())
  );

create policy "Users can delete own messages"
  on public.messages
  for delete
  to authenticated
  using (author_id = auth.uid());

-- Confirmations Policies
create policy "Users can view confirmations"
  on public.confirmations
  for select
  to authenticated
  using (true);

create policy "Users can add own confirmations"
  on public.confirmations
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Users can remove own confirmations"
  on public.confirmations
  for delete
  to authenticated
  using (user_id = auth.uid());

-- Reports Policies: insert only
create policy "Users can insert reports"
  on public.reports
  for insert
  to authenticated
  with check (reporter_id = auth.uid());

-- Blocks Policies: manage only your own
create policy "Users can view own blocks"
  on public.blocks
  for select
  to authenticated
  using (blocker_id = auth.uid());

create policy "Users can insert own blocks"
  on public.blocks
  for insert
  to authenticated
  with check (blocker_id = auth.uid());

create policy "Users can delete own blocks"
  on public.blocks
  for delete
  to authenticated
  using (blocker_id = auth.uid());

-- -------------------------------------------------------------------------
-- Safety Triggers & Rate Limiting
-- -------------------------------------------------------------------------

-- Content Filter & Privacy Guard:
-- Rejects phone numbers (10+ digits runs), emails, or URLs.
create or replace function public.fn_filter_message_content()
returns trigger
language plpgsql
security definer
as $$
begin
  -- 1. Check for 10 or more digits (phone numbers, even with spaces or hyphens)
  if new.body ~ '(\+?[0-9][\s\-\.\(\)]*){10,}' then
    raise exception 'For everyone''s safety, don''t share phone numbers or links here.';
  end if;

  -- 2. Check for email addresses
  if new.body ~* '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}' then
    raise exception 'For everyone''s safety, don''t share phone numbers or links here.';
  end if;

  -- 3. Check for URLs or web links
  if new.body ~* '(https?://|www\.[a-z0-9\-\.]+|[a-z0-9\-\.]+\.(com|org|net|in|co|io|app|gov|edu|me))\b' then
    raise exception 'For everyone''s safety, don''t share phone numbers or links here.';
  end if;

  return new;
end;
$$;

create or replace trigger trg_filter_message_content
  before insert on public.messages
  for each row
  execute function public.fn_filter_message_content();

-- Rate Limiting:
-- 1 message per 5 seconds, 30 messages per hour per user.
create or replace function public.fn_rate_limit_messages()
returns trigger
language plpgsql
security definer
as $$
declare
  last_msg_time timestamptz;
  hourly_count int;
begin
  -- Check 5-second interval
  select created_at into last_msg_time
  from public.messages
  where author_id = new.author_id
  order by created_at desc
  limit 1;

  if last_msg_time is not null and (now() - last_msg_time) < interval '5 seconds' then
    raise exception 'Please wait a moment before sending another message.';
  end if;

  -- Check 30 messages per hour
  select count(*) into hourly_count
  from public.messages
  where author_id = new.author_id
    and created_at >= (now() - interval '1 hour');

  if hourly_count >= 30 then
    raise exception 'Rate limit reached: maximum 30 messages per hour.';
  end if;

  return new;
end;
$$;

create or replace trigger trg_rate_limit_messages
  before insert on public.messages
  for each row
  execute function public.fn_rate_limit_messages();

-- -------------------------------------------------------------------------
-- Confirmation Counts Triggers (Security Definer)
-- -------------------------------------------------------------------------

create or replace function public.fn_handle_confirmation_change()
returns trigger
language plpgsql
security definer
as $$
begin
  if (TG_OP = 'INSERT') then
    if (new.kind = 'confirm') then
      update public.messages
      set confirm_count = confirm_count + 1
      where id = new.message_id;
    elsif (new.kind = 'fixed') then
      update public.messages
      set fixed_count = fixed_count + 1
      where id = new.message_id;
    end if;
    return new;
  elsif (TG_OP = 'DELETE') then
    if (old.kind = 'confirm') then
      update public.messages
      set confirm_count = greatest(0, confirm_count - 1)
      where id = old.message_id;
    elsif (old.kind = 'fixed') then
      update public.messages
      set fixed_count = greatest(0, fixed_count - 1)
      where id = old.message_id;
    end if;
    return old;
  end if;
  return null;
end;
$$;

create or replace trigger trg_confirmations_insert_delete
  after insert or delete on public.confirmations
  for each row
  execute function public.fn_handle_confirmation_change();

-- -------------------------------------------------------------------------
-- Reports Trigger: Auto-hide after 3 reports
-- -------------------------------------------------------------------------

create or replace function public.fn_handle_report_insert()
returns trigger
language plpgsql
security definer
as $$
declare
  total_reports int;
begin
  -- Increment report count and check if threshold reached
  update public.messages
  set report_count = report_count + 1
  where id = new.message_id
  returning report_count into total_reports;

  if total_reports >= 3 then
    update public.messages
    set hidden = true
    where id = new.message_id;
  end if;

  return new;
end;
$$;

create or replace trigger trg_reports_insert
  after insert on public.reports
  for each row
  execute function public.fn_handle_report_insert();

-- -------------------------------------------------------------------------
-- Realtime Replication
-- -------------------------------------------------------------------------

-- Add messages to realtime publication so clients receive live chats & alerts
alter publication supabase_realtime add table public.messages;

-- -------------------------------------------------------------------------
-- Delete User Community Data Function (Security Definer)
-- -------------------------------------------------------------------------

create or replace function public.delete_my_community_data()
returns void
language plpgsql
security definer
as $$
declare
  caller_id uuid;
begin
  caller_id := auth.uid();
  if caller_id is null then
    raise exception 'Not authenticated';
  end if;

  -- Delete all reports made by the user
  delete from public.reports where reporter_id = caller_id;

  -- Delete all blocks involving the user
  delete from public.blocks where blocker_id = caller_id or blocked_id = caller_id;

  -- Delete all confirmations by the user
  delete from public.confirmations where user_id = caller_id;

  -- Delete all messages posted by the user
  delete from public.messages where author_id = caller_id;

  -- Delete user profile
  delete from public.profiles where id = caller_id;
end;
$$;
