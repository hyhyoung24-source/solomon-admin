-- Add related_doc_ids column to approval_documents table
-- This column will store an array of UUIDs (converted to text) of related documents
alter table public.approval_documents 
add column if not exists related_doc_ids text[];
