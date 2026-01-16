
-- Create departments table
CREATE TABLE IF NOT EXISTS public.departments (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    parent_id TEXT,
    code TEXT,
    sort_order INTEGER,
    short_name TEXT,
    is_active BOOLEAN DEFAULT true,
    is_hr_linked BOOLEAN DEFAULT true,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- Policies
-- Allow anyone to read (for now, or authenticated)
CREATE POLICY "Public read access" ON public.departments FOR SELECT USING (true);

-- Allow authenticated users (Admin) to insert/update/delete
CREATE POLICY "Authenticated full access" ON public.departments FOR ALL USING (auth.role() = 'authenticated');
