-- Add second_processing_dept_id to document_forms
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'document_forms' AND column_name = 'second_processing_dept_id') THEN
        ALTER TABLE public.document_forms ADD COLUMN second_processing_dept_id text REFERENCES public.departments(id);
    END IF;
END $$;

-- Add second_processing_dept_id to approval_documents
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'approval_documents' AND column_name = 'second_processing_dept_id') THEN
        ALTER TABLE public.approval_documents ADD COLUMN second_processing_dept_id text REFERENCES public.departments(id);
    END IF;
END $$;
