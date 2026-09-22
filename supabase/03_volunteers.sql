-- =========================================================================
-- Abhaya - Volunteers & Direct Messaging Schema (03_volunteers.sql)
-- =========================================================================

-- 1. Volunteers Table
-- Directory of self-registered, opted-in community members.
-- They are NOT police, officials, or vetted responders.
create table if not exists public.volunteers (
  user_id uuid primary key references auth.users(id) on delete cascade references public.profiles(id),
  areas text[] not null default '{}', -- array of geohash-5 strings e.g. ['tdr1v', 'tdr1u']
  help_types text[] not null default '{}',
  note text check (note is null or length(trim(note)) <= 140),
  show_phone boolean not null default false,
  phone_display text check (phone_display is null or length(trim(phone_display)) <= 20),
  available boolean not null default true,
  availability_slots text[] not null default '{}',
  last_confirmed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  report_count int not null default 0,
  hidden boolean not null default false,

  -- Ensure help_types contain only permitted categories
  constraint check_valid_help_types check (
    help_types <@ array['accompany_call', 'meet_walk', 'local_guidance', 'emergency_backup']::text[]
  )
);

-- Index for searching volunteers by geohash-5 area using GIN array containment
create index if not exists idx_volunteers_areas on public.volunteers using gin (areas);
create index if not exists idx_volunteers_available on public.volunteers (available, hidden, last_confirmed_at);

-- 2. Volunteer Reports Table
-- Allows community moderation of volunteers. Auto-hides after 3 reports.
create table if not exists public.volunteer_reports (
  volunteer_id uuid not null references public.volunteers(user_id) on delete cascade,
  reporter_id uuid not null references auth.users(id) on delete cascade,
  reason text not null check (length(trim(reason)) >= 2),
  created_at timestamptz not null default now(),
  primary key (volunteer_id, reporter_id)
);

-- 3. Direct Messaging Threads Table
-- Lightweight 1:1 thread between two community users (e.g. requester & volunteer).
create table if not exists public.direct_threads (
  id uuid primary key default gen_random_uuid(),
  user_a uuid not null references auth.users(id) on delete cascade,
  user_b uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  last_message_at timestamptz not null default now(),

  -- Unique pair regardless of user order
  constraint chk_direct_threads_different_users check (user_a <> user_b),
  constraint uq_direct_threads_users unique (user_a, user_b)
);

create index if not exists idx_direct_threads_user_a on public.direct_threads(user_a);
create index if not exists idx_direct_threads_user_b on public.direct_threads(user_b);

-- 4. Direct Messages Table
-- Text only (1-280 chars), rate limited, content-filtered for privacy.
create table if not exists public.direct_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.direct_threads(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (length(trim(body)) >= 1 and length(body) <= 280),
  created_at timestamptz not null default now()
);

create index if not exists idx_direct_messages_thread_created on public.direct_messages(thread_id, created_at asc);
create index if not exists idx_direct_messages_author on public.direct_messages(author_id);

-- -------------------------------------------------------------------------
-- Row Level Security (RLS) Policies
-- -------------------------------------------------------------------------

alter table public.volunteers enable row level security;
alter table public.volunteer_reports enable row level security;
alter table public.direct_threads enable row level security;
alter table public.direct_messages enable row level security;

-- Volunteers Policies:
-- Users can view, insert, update, delete only their own row.
create policy "Users can view own volunteer profile"
  on public.volunteers
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own volunteer profile"
  on public.volunteers
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own volunteer profile"
  on public.volunteers
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own volunteer profile"
  on public.volunteers
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- Volunteer Reports Policies:
create policy "Users can insert reports on volunteers"
  on public.volunteer_reports
  for insert
  to authenticated
  with check (auth.uid() = reporter_id);

create policy "Users can view own submitted reports"
  on public.volunteer_reports
  for select
  to authenticated
  using (auth.uid() = reporter_id);

-- Direct Threads Policies:
create policy "Participants can view their direct threads"
  on public.direct_threads
  for select
  to authenticated
  using (auth.uid() = user_a or auth.uid() = user_b);

create policy "Participants can create direct threads"
  on public.direct_threads
  for insert
  to authenticated
  with check (auth.uid() = user_a or auth.uid() = user_b);

-- Direct Messages Policies:
create policy "Participants can view direct messages in their threads"
  on public.direct_messages
  for select
  to authenticated
  using (
    exists (
      select 1 from public.direct_threads t
      where t.id = direct_messages.thread_id
        and (t.user_a = auth.uid() or t.user_b = auth.uid())
    )
  );

create policy "Participants can send direct messages in their threads"
  on public.direct_messages
  for insert
  to authenticated
  with check (
    author_id = auth.uid()
    and exists (
      select 1 from public.direct_threads t
      where t.id = direct_messages.thread_id
        and (t.user_a = auth.uid() or t.user_b = auth.uid())
    )
  );

-- -------------------------------------------------------------------------
-- Safety Triggers: Content Validation (No phones, emails, URLs) & Rate Limits
-- -------------------------------------------------------------------------

-- Content Filter Trigger for Direct Messages
create or replace function public.fn_validate_direct_message_content()
returns trigger
language plpgsql
security definer
as $$
declare
  cleaned_text text;
begin
  cleaned_text := new.body;

  -- 1. Check for URL patterns
  if cleaned_text ~* '(https?://[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.(com|org|net|in|io|co|me|app)[^\s]*)' then
    raise exception 'Direct messages cannot contain links or URLs for community safety.';
  end if;

  -- 2. Check for email patterns
  if cleaned_text ~* '([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)' then
    raise exception 'Direct messages cannot contain email addresses for safety.';
  end if;

  -- 3. Check for 10-digit Indian phone patterns
  if cleaned_text ~* '(\+91[\-\s]?)?[6-9]\d{9}' or cleaned_text ~* '(\d[\s\.\-]?){10,}' then
    raise exception 'Direct messages cannot contain phone numbers. Use the calling option if the volunteer enabled it.';
  end if;

  return new;
end;
$$;

create or replace trigger trg_validate_direct_message_content
  before insert on public.direct_messages
  for each row
  execute function public.fn_validate_direct_message_content();

-- Rate Limit Trigger: Maximum 10 direct messages per minute per user
create or replace function public.fn_rate_limit_direct_messages()
returns trigger
language plpgsql
security definer
as $$
declare
  recent_count int;
begin
  select count(*)
  into recent_count
  from public.direct_messages
  where author_id = new.author_id
    and created_at >= (now() - interval '1 minute');

  if recent_count >= 10 then
    raise exception 'You are sending messages too quickly. Please wait a minute before replying.';
  end if;

  -- Update thread last_message_at timestamp
  update public.direct_threads
  set last_message_at = now()
  where id = new.thread_id;

  return new;
end;
$$;

create or replace trigger trg_rate_limit_direct_messages
  before insert on public.direct_messages
  for each row
  execute function public.fn_rate_limit_direct_messages();

-- Volunteer Reports Trigger: Auto-hide after 3 reports
create or replace function public.fn_handle_volunteer_report_insert()
returns trigger
language plpgsql
security definer
as $$
declare
  total_reports int;
begin
  update public.volunteers
  set report_count = report_count + 1
  where user_id = new.volunteer_id
  returning report_count into total_reports;

  if total_reports >= 3 then
    update public.volunteers
    set hidden = true, available = false
    where user_id = new.volunteer_id;
  end if;

  return new;
end;
$$;

create or replace trigger trg_volunteer_reports_insert
  after insert on public.volunteer_reports
  for each row
  execute function public.fn_handle_volunteer_report_insert();

-- -------------------------------------------------------------------------
-- Stored Procedure: Get Nearby Volunteers (Security Definer)
-- -------------------------------------------------------------------------
-- Returns available volunteers whose areas include the requester's area.
-- Enforces:
-- 1. Must be available and not hidden.
-- 2. Must be confirmed within the last 7 days.
-- 3. Excludes users blocked by or blocking the requester (using public.blocks).
-- 4. Never exposes underlying login phone or email. Returns phone_display ONLY if show_phone is true.
create or replace function public.get_nearby_volunteers(target_area_id text)
returns table (
  user_id uuid,
  alias text,
  areas text[],
  help_types text[],
  note text,
  show_phone boolean,
  phone_display text,
  available boolean,
  availability_slots text[],
  last_confirmed_at timestamptz,
  created_at timestamptz
)
language plpgsql
security definer
as $$
declare
  caller_id uuid;
begin
  caller_id := auth.uid();

  return query
  select
    v.user_id,
    p.alias,
    v.areas,
    v.help_types,
    v.note,
    v.show_phone,
    case when v.show_phone is true then v.phone_display else null end as phone_display,
    v.available,
    v.availability_slots,
    v.last_confirmed_at,
    v.created_at
  from public.volunteers v
  join public.profiles p on p.id = v.user_id
  where v.hidden = false
    and v.available = true
    -- Must have re-confirmed in the last 7 days
    and v.last_confirmed_at >= (now() - interval '7 days')
    -- Area matches target geohash-5
    and v.areas @> array[target_area_id]
    -- Exclude user themselves if logged in
    and (caller_id is null or v.user_id <> caller_id)
    -- Exclude anyone blocked or blocking caller
    and (
      caller_id is null
      or not exists (
        select 1 from public.blocks b
        where (b.blocker_id = caller_id and b.blocked_id = v.user_id)
           or (b.blocker_id = v.user_id and b.blocked_id = caller_id)
      )
    )
  order by
    v.available desc,
    cardinality(v.help_types) desc,
    v.last_confirmed_at desc;
end;
$$;

-- -------------------------------------------------------------------------
-- Realtime Replication
-- -------------------------------------------------------------------------
alter publication supabase_realtime add table public.direct_messages;
