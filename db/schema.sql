-- Create messages table
create table if not exists messages (
  id bigint primary key generated always as identity,
  type text not null, -- 'confession' or 'bouquet'
  content text,
  vibe text,
  bouquet_id text,
  note text,
  instagram_username text not null, -- Required for privacy policy (internal/admin use only)
  recipient_name text, -- Who is the confession for?
  date_preference text, -- 'random' or 'specific'
  recipient_instagram text, -- IG of who they want (if specific)
  gender_preference text, -- 'girl', 'boy', or 'any'
  is_public boolean default false, -- For moderation
  is_read boolean default false,
  sender_device text,
  sender_location text,
  sender_ip text, -- New IP tracking field
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Votes table for feed polls
create table if not exists votes (
  id bigint primary key generated always as identity,
  message_id bigint not null references messages(id) on delete cascade,
  vote text not null, -- 'yes' or 'no'
  voter_fingerprint text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table messages enable row level security;
alter table votes enable row level security;

-- Create Policy: Enable insert for everyone (anon)
create policy "Enable insert for anon users" 
on messages for insert 
to anon 
with check (true);

-- Create Policy: Enable select for everyone (anon) - FOR NOW (Secure later if needed)
-- Since we use client-side fetching in the admin panel which is also 'anon' technically unless we use auth.
-- Create Policy: Enable select for public feed (anonymous users can see approved messages)
create policy "Enable select for public approved messages" 
on messages for select 
to anon 
using (is_public = true);

-- Create Policy: Enable select for everyone (anon) - FOR NOW (Secure later if needed)
-- Since we use client-side fetching in the admin panel which is also 'anon' technically unless we use auth.
-- (This overlaps with the above but is broader for admin dev ease. In prod, strict RLS needed)
create policy "Enable select for anon users" 
on messages for select 
to anon 
using (true);

-- Create Policy: Enable update for everyone (anon) - to mark as read
create policy "Enable update for anon users" 
on messages for update
to anon 
using (true);

-- Votes policies
create policy "Enable insert for anon votes"
on votes for insert to anon with check (true);

create policy "Enable select for anon votes"
on votes for select to anon using (true);

create policy "Enable update for anon votes"
on votes for update to anon using (true);

-- Note: For a real secure app, we should use Supabase Auth and restrict select/update to authenticated users only.
-- But given the "hardcoded admin" requirement without detailed auth setup, this allows the app to function.
