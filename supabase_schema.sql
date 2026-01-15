-- Create a simple users table
create table public.users (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  password text not null, -- Will store hashed password
  name text not null,
  dept_id text,
  position text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on Row Level Security (RLS) recommended but optional for simple custom auth
alter table public.users enable row level security;

-- Allow public read access (for login checks) - In production be more specific
create policy "Allow public read" on public.users for select using (true);
create policy "Allow public insert" on public.users for insert with check (true);
create policy "Allow public update" on public.users for update using (true);
