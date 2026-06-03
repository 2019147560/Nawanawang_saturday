ALTER TABLE public.program_details
ADD COLUMN IF NOT EXISTS purpose text,
ADD COLUMN IF NOT EXISTS view_count bigint;
