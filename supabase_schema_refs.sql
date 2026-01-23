-- Create References Table
create table if not exists public.doc_references (
  id uuid default gen_random_uuid() primary key,
  document_id uuid references public.approval_documents(id) on delete cascade,
  user_id uuid references public.users(id),
  type text default 'reference', -- 'reference' or 'circulation'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.doc_references enable row level security;

create policy "Allow public access refs" on public.doc_references for all using (true);
