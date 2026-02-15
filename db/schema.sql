-- Create messages table
create table if not exists messages (
  id bigint primary key generated always as identity,
  type text not null, -- 'confession' or 'bouquet'
  content text,
  vibe text,
  bouquet_id text,
  note text,
  is_read boolean default false,
  sender_device text,
  sender_location text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table messages enable row level security;

-- Create Policy: Enable insert for everyone (anon)
create policy "Enable insert for anon users" 
on messages for insert 
to anon 
with check (true);

-- Create Policy: Enable select for everyone (anon) - FOR NOW (Secure later if needed)
-- Since we use client-side fetching in the admin panel which is also 'anon' technically unless we use auth.
create policy "Enable select for anon users" 
on messages for select 
to anon 
using (true);

-- Create Policy: Enable update for everyone (anon) - to mark as read
create policy "Enable update for anon users" 
on messages for update
to anon 
using (true);

-- Note: For a real secure app, we should use Supabase Auth and restrict select/update to authenticated users only.
-- But given the "hardcoded admin" requirement without detailed auth setup, this allows the app to function.
