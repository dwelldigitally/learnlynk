-- Create system_properties table for dropdown values (Program Levels, Categories, etc.)
CREATE TABLE public.system_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  category TEXT NOT NULL,
  property_key TEXT NOT NULL,
  property_label TEXT NOT NULL,
  property_description TEXT,
  color TEXT,
  icon TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_system BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, category, property_key)
);

-- Enable RLS
ALTER TABLE public.system_properties ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can manage their own system properties"
ON public.system_properties FOR ALL
USING (auth.uid() = user_id);

-- Add custom_data JSONB column to leads table
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS custom_data JSONB DEFAULT '{}';

-- Add custom_data JSONB column to applicants table
ALTER TABLE public.applicants ADD COLUMN IF NOT EXISTS custom_data JSONB DEFAULT '{}';

-- Add custom_data JSONB column to master_records table (for students)
ALTER TABLE public.master_records ADD COLUMN IF NOT EXISTS custom_data JSONB DEFAULT '{}';

-- Create updated_at trigger for system_properties
CREATE OR REPLACE FUNCTION public.update_system_properties_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_system_properties_updated_at
BEFORE UPDATE ON public.system_properties
FOR EACH ROW
EXECUTE FUNCTION public.update_system_properties_updated_at();

-- Create indexes for performance
CREATE INDEX idx_system_properties_user_category ON public.system_properties(user_id, category);
CREATE INDEX idx_system_properties_active ON public.system_properties(user_id, is_active);
CREATE INDEX idx_custom_fields_stage ON public.custom_fields(user_id, stage);