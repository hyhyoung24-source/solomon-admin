-- 1. Create Tables
create table if not exists public.form_categories (
  id uuid default gen_random_uuid() primary key,
  name text unique not null,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.document_forms (
  id uuid default gen_random_uuid() primary key,
  category_id uuid references public.form_categories(id),
  category text, -- Legacy/Fallback
  title text not null,
  description text,
  form_id text unique not null,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Add default_processing_dept_id column if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'document_forms' AND column_name = 'default_processing_dept_id') THEN
        ALTER TABLE public.document_forms ADD COLUMN default_processing_dept_id text REFERENCES public.departments(id);
    END IF;
END $$;

-- 3. Enable RLS
alter table public.form_categories enable row level security;
alter table public.document_forms enable row level security;

-- Policies
create policy "Allow public read categories" on public.form_categories for select using (true);
create policy "Allow public insert categories" on public.form_categories for insert with check (true);
create policy "Allow public update categories" on public.form_categories for update using (true);
create policy "Allow public delete categories" on public.form_categories for delete using (true);

create policy "Allow public read forms" on public.document_forms for select using (true);
create policy "Allow public insert forms" on public.document_forms for insert with check (true);
create policy "Allow public update forms" on public.document_forms for update using (true);
create policy "Allow public delete forms" on public.document_forms for delete using (true);

-- 4. Seed Categories
INSERT INTO public.form_categories (name, sort_order) VALUES
('기안서', 10),
('인감(계약)', 20),
('인사', 30),
('복리후생', 40),
('교육', 50),
('총무/구매', 60),
('보안', 70),
('기타', 99)
ON CONFLICT (name) DO UPDATE SET sort_order = EXCLUDED.sort_order;

-- 5. Seed Forms
INSERT INTO public.document_forms (title, form_id, category, description, sort_order) VALUES
('기안서', 'draft', '기안서', '일반적인 업무 기안을 위한 기본 양식입니다.', 10),
('계약기안서', 'contract_draft', '인감(계약)', '계약 체결 및 관리를 위한 기안 양식입니다.', 10),
('채용기안서', 'hire_draft', '인사', '신규 채용을 위한 기안 양식입니다.', 10),
('인사기안서', 'hr_draft', '인사', '인사 이동 및 발령을 위한 기안 양식입니다.', 20),
('자기계발 지원신청서', 'self_development', '복리후생', '자기계발 비용 지원을 신청하는 양식입니다.', 10),
('경조금 신청서', 'condolence', '복리후생', '경조사 발생 시 지원금을 신청하는 양식입니다.', 20),
('연수보고서', 'training_report', '복리후생', '직무 연수 수행 후 결과를 보고하는 양식입니다.', 30),
('교육신청서', 'education_app', '교육', '외부/내부 교육 참가를 신청하는 양식입니다.', 10),
('도서구입신청서', 'book_purchase', '교육', '업무 관련 도서 구입을 신청하는 양식입니다.', 20),
('카쉐어링 이용신청서', 'car_share', '총무/구매', '업무용 차량 이용을 신청하는 양식입니다.', 10),
('구매기안서', 'purchase_draft', '총무/구매', '비품/자재 구매를 품의하는 양식입니다.', 20),
('주차신청서', 'parking_app', '총무/구매', '주차권 발급 및 변경을 신청하는 양식입니다.', 30),
('보안서약서', 'security_pledge', '보안', '보안 규정 준수를 서약하는 양식입니다.', 10)
ON CONFLICT (form_id) DO UPDATE SET 
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    sort_order = EXCLUDED.sort_order;

-- 6. Link Categories
UPDATE public.document_forms f
SET category_id = c.id
FROM public.form_categories c
WHERE f.category = c.name;
