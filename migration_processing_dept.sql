-- Add processing department related columns to approval_documents
ALTER TABLE public.approval_documents
ADD COLUMN IF NOT EXISTS processing_dept_id uuid REFERENCES public.departments(id),
ADD COLUMN IF NOT EXISTS processed_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS processed_by_user_id uuid REFERENCES public.users(id);

-- Ensure RLS allows the processing department to see the document
-- Usually policies are: owner, approvers. Now need: member of processing_dept_id.

CREATE POLICY "Allow processing dept to read" ON public.approval_documents
FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id FROM public.users 
    WHERE department_id = processing_dept_id
  )
);

CREATE POLICY "Allow processing dept to update status" ON public.approval_documents
FOR UPDATE
USING (
  auth.uid() IN (
    SELECT user_id FROM public.users 
    WHERE department_id = processing_dept_id
  )
  AND status = 'processing'
);
