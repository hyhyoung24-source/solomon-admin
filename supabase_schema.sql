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

-- Departments Table (Restored from previous sessions if missing or needed for reference)
create table if not exists public.departments (
  id text primary key,
  name text not null,
  parent_id text references public.departments(id),
  code text,
  sort_order integer,
  short_name text,
  is_active boolean default true,
  is_hr_linked boolean default false,
  is_visible boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Approval Documents Table
create table if not exists public.approval_documents (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text,
  writer_id uuid references public.users(id),
  dept_id text, -- link to dept
  status text not null default 'temp', -- 'temp', 'progress', 'approved', 'rejected'
  is_urgent boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Approval Lines Table
create table if not exists public.approval_lines (
  id uuid default gen_random_uuid() primary key,
  document_id uuid references public.approval_documents(id) on delete cascade,
  user_id uuid references public.users(id),
  status text not null default 'waiting', -- 'waiting', 'current', 'approved', 'rejected'
  step_order integer not null,
  comment text,
  received_at timestamp with time zone,
  action_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.departments enable row level security;
alter table public.approval_documents enable row level security;
alter table public.approval_lines enable row level security;

-- Policies for departments
create policy "Allow public read depts" on public.departments for select using (true);
create policy "Allow service role full access depts" on public.departments for all using (true);

-- Policies for approval_documents
-- Everyone can read for now (simplified)
create policy "Allow public read docs" on public.approval_documents for select using (true);
create policy "Allow public insert docs" on public.approval_documents for insert with check (true);
create policy "Allow public update docs" on public.approval_documents for update using (true);
create policy "Allow public delete docs" on public.approval_documents for delete using (true);

-- Policies for approval_lines
create policy "Allow public read lines" on public.approval_lines for select using (true);
create policy "Allow public insert lines" on public.approval_lines for insert with check (true);
create policy "Allow public update lines" on public.approval_lines for update using (true);
