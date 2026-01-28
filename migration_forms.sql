
-- Create document_forms table
create table if not exists public.document_forms (
  id uuid default gen_random_uuid() primary key,
  category text not null,
  title text not null,
  description text,
  form_id text unique not null,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.document_forms enable row level security;

-- Policies
create policy "Allow public read forms" on public.document_forms for select using (true);
create policy "Allow public insert forms" on public.document_forms for insert with check (true);
create policy "Allow public update forms" on public.document_forms for update using (true);
create policy "Allow public delete forms" on public.document_forms for delete using (true);

-- Seed Data (Upsert style to avoid dupes if run multiple times)
INSERT INTO public.document_forms (category, title, description, form_id, sort_order) VALUES
('기안서', '기안서', '일반적인 업무 기안을 위한 기본 양식입니다.', 'draft', 10),
('인감(계약)', '계약기안서', '계약 체결 및 관리를 위한 기안 양식입니다.', 'contract_draft', 10),
('인사', '채용기안서', '신규 채용을 위한 기안 양식입니다.', 'hire_draft', 10),
('인사', '인사기안서', '인사 이동 및 발령을 위한 기안 양식입니다.', 'hr_draft', 20),
('복리후생', '자기계발 지원신청서', '자기계발 비용 지원을 신청하는 양식입니다.', 'self_development', 10),
('복리후생', '경조금 신청서', '경조사 발생 시 지원금을 신청하는 양식입니다.', 'condolence', 20),
('복리후생', '연수보고서', '직무 연수 수행 후 결과를 보고하는 양식입니다.', 'training_report', 30),
('교육', '교육신청서', '외부/내부 교육 참가를 신청하는 양식입니다.', 'education_app', 10),
('교육', '도서구입신청서', '업무 관련 도서 구입을 신청하는 양식입니다.', 'book_purchase', 20),
('총무/구매', '카쉐어링 이용신청서', '업무용 차량 이용을 신청하는 양식입니다.', 'car_share', 10),
('총무/구매', '구매기안서', '비품/자재 구매를 품의하는 양식입니다.', 'purchase_draft', 20),
('총무/구매', '주차신청서', '주차권 발급 및 변경을 신청하는 양식입니다.', 'parking_app', 30),
('보안', '보안서약서', '보안 규정 준수를 서약하는 양식입니다.', 'security_pledge', 10)
ON CONFLICT (form_id) DO UPDATE SET
category = EXCLUDED.category,
title = EXCLUDED.title,
description = EXCLUDED.description;
