-- Create Document References Table
create table if not exists public.doc_references (
  id uuid default gen_random_uuid() primary key,
  document_id uuid references public.approval_documents(id) on delete cascade,
  user_id uuid references public.users(id),
  type text not null, -- 'pre' (사전참조) or 'post' (사후참조)
  read_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Policies
alter table public.doc_references enable row level security;
create policy "Allow public read refs" on public.doc_references for select using (true);
create policy "Allow public insert refs" on public.doc_references for insert with check (true);
create policy "Allow public update refs" on public.doc_references for update using (true);
create policy "Allow public delete refs" on public.doc_references for delete using (true);
