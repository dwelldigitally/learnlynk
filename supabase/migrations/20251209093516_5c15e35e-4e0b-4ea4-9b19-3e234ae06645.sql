-- Create compliance report configurations table
CREATE TABLE public.compliance_report_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('ptiru_student', 'ptiru_program', 'dqab_institutional', 'dqab_compliance')),
  name TEXT NOT NULL,
  columns JSONB NOT NULL DEFAULT '[]',
  filters JSONB DEFAULT '[]',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, report_type, name)
);

-- Enable RLS
ALTER TABLE public.compliance_report_configs ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own compliance configs"
ON public.compliance_report_configs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own compliance configs"
ON public.compliance_report_configs FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own compliance configs"
ON public.compliance_report_configs FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own compliance configs"
ON public.compliance_report_configs FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_compliance_report_configs_updated_at
BEFORE UPDATE ON public.compliance_report_configs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();