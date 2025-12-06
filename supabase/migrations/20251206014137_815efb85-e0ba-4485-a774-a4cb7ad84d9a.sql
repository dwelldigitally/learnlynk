-- Drop the existing foreign key constraint if it exists
ALTER TABLE public.academic_journeys 
DROP CONSTRAINT IF EXISTS academic_journeys_program_id_fkey;

-- Add a new foreign key that references the programs table instead of master_programs
-- But first make program_id nullable
ALTER TABLE public.academic_journeys 
ALTER COLUMN program_id DROP NOT NULL;

-- Add foreign key to programs table (the one actually used in the app)
ALTER TABLE public.academic_journeys 
ADD CONSTRAINT academic_journeys_program_id_fkey 
FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE SET NULL;