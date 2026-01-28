
-- 1. Create form_categories table
create table if not exists public.form_categories (
  id uuid default gen_random_uuid() primary key,
  name text unique not null,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for categories
alter table public.form_categories enable row level security;
create policy "Allow public read categories" on public.form_categories for select using (true);
create policy "Allow public insert categories" on public.form_categories for insert with check (true);
create policy "Allow public update categories" on public.form_categories for update using (true);
create policy "Allow public delete categories" on public.form_categories for delete using (true);

-- 2. Modify document_forms table
-- Add category_id
alter table public.document_forms add column if not exists category_id uuid references public.form_categories(id);

-- 3. Migrate existing data
-- Insert distinct categories from document_forms to form_categories
insert into public.form_categories (name, sort_order)
select distinct category, 0 
from public.document_forms 
where category is not null
on conflict (name) do nothing;

-- Update sort_order for known categories
update public.form_categories set sort_order = 10 where name = '기안서';
update public.form_categories set sort_order = 20 where name = '인감(계약)';
update public.form_categories set sort_order = 30 where name = '인사';
update public.form_categories set sort_order = 40 where name = '복리후생';
update public.form_categories set sort_order = 50 where name = '교육';
update public.form_categories set sort_order = 60 where name = '총무/구매';
update public.form_categories set sort_order = 70 where name = '보안';
update public.form_categories set sort_order = 99 where name = '기타';

-- Link document_forms to form_categories
update public.document_forms df
set category_id = fc.id
from public.form_categories fc
where df.category = fc.name;

-- Note: We will keep the 'category' text column in document_forms for now as a fallback/cache 
-- but primary logic should use category_id. Or we can drop it later.
