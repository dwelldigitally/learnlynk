-- Add missing columns to programs table for complete wizard data persistence
ALTER TABLE public.programs 
ADD COLUMN IF NOT EXISTS courses JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS journey_config JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS practicum_config JSONB DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.programs.courses IS 'Array of course objects with id, title, description, hours, modality, order';
COMMENT ON COLUMN public.programs.journey_config IS 'Journey configuration: mode (master/copy/custom), domestic/international settings';
COMMENT ON COLUMN public.programs.practicum_config IS 'Practicum configuration: enabled, duration_weeks, total_hours_required, document_requirements, assigned_sites';