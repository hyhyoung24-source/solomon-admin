-- Add default_processing_dept_id to document_forms
ALTER TABLE public.document_forms
ADD COLUMN IF NOT EXISTS default_processing_dept_id uuid REFERENCES public.departments(id);

-- Update RLS if needed (already public read/write in migration_complete_seed but good to be safe)
-- Existing policies cover all columns so just adding column is fine.
