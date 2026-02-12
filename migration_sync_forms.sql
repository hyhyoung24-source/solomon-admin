-- Add all frontend forms to database
-- This script safely inserts missing forms based on the fallbackForms in write/page.tsx

-- 1. 기안서 (Already exists in seed, checking others)
INSERT INTO public.document_forms (title, form_id, category, description, sort_order)
VALUES ('기안서', 'draft', '기안서', '일반적인 업무 기안을 위한 기본 양식입니다.', 10)
ON CONFLICT (form_id) DO NOTHING;

-- 2. 인감(계약)
INSERT INTO public.document_forms (title, form_id, category, description, sort_order)
VALUES ('계약기안서', 'contract_draft', '인감(계약)', '계약 체결 및 관리를 위한 기안 양식입니다.', 10)
ON CONFLICT (form_id) DO NOTHING;

-- 3. 인사
INSERT INTO public.document_forms (title, form_id, category, description, sort_order)
VALUES ('채용기안서', 'hire_draft', '인사', '신규 채용을 위한 기안 양식입니다.', 10)
ON CONFLICT (form_id) DO NOTHING;

INSERT INTO public.document_forms (title, form_id, category, description, sort_order)
VALUES ('인사기안서', 'hr_draft', '인사', '인사 이동 및 발령을 위한 기안 양식입니다.', 20)
ON CONFLICT (form_id) DO NOTHING;

-- 4. 복리후생
INSERT INTO public.document_forms (title, form_id, category, description, sort_order)
VALUES ('자기계발 지원신청서', 'self_development', '복리후생', '자기계발 비용 지원을 신청하는 양식입니다.', 10)
ON CONFLICT (form_id) DO NOTHING;

INSERT INTO public.document_forms (title, form_id, category, description, sort_order)
VALUES ('경조금 신청서', 'condolence', '복리후생', '경조사 발생 시 지원금을 신청하는 양식입니다.', 20)
ON CONFLICT (form_id) DO NOTHING;

INSERT INTO public.document_forms (title, form_id, category, description, sort_order)
VALUES ('연수보고서', 'training_report', '복리후생', '직무 연수 수행 후 결과를 보고하는 양식입니다.', 30)
ON CONFLICT (form_id) DO NOTHING;

-- 5. 교육
INSERT INTO public.document_forms (title, form_id, category, description, sort_order)
VALUES ('교육신청서', 'education_app', '교육', '외부/내부 교육 참가를 신청하는 양식입니다.', 10)
ON CONFLICT (form_id) DO NOTHING;

INSERT INTO public.document_forms (title, form_id, category, description, sort_order)
VALUES ('도서구입신청서', 'book_purchase', '교육', '업무 관련 도서 구입을 신청하는 양식입니다.', 20)
ON CONFLICT (form_id) DO NOTHING;

-- 6. 총무/구매
INSERT INTO public.document_forms (title, form_id, category, description, sort_order)
VALUES ('카쉐어링 이용신청서', 'car_share', '총무/구매', '업무용 차량 이용을 신청하는 양식입니다.', 10)
ON CONFLICT (form_id) DO NOTHING;

INSERT INTO public.document_forms (title, form_id, category, description, sort_order)
VALUES ('구매기안서', 'purchase_draft', '총무/구매', '비품/자재 구매를 품의하는 양식입니다.', 20)
ON CONFLICT (form_id) DO NOTHING;

INSERT INTO public.document_forms (title, form_id, category, description, sort_order)
VALUES ('주차신청서', 'parking_app', '총무/구매', '주차권 발급 및 변경을 신청하는 양식입니다.', 30)
ON CONFLICT (form_id) DO NOTHING;

-- 7. 보안
INSERT INTO public.document_forms (title, form_id, category, description, sort_order)
VALUES ('보안서약서', 'security_pledge', '보안', '보안 규정 준수를 서약하는 양식입니다.', 10)
ON CONFLICT (form_id) DO NOTHING;

-- Link category_ids matching names
UPDATE public.document_forms f
SET category_id = c.id
FROM public.form_categories c
WHERE f.category = c.name
AND f.category_id IS NULL;
