-- Create AI decision logs table for tracking all AI decisions with reasoning
CREATE TABLE public.ai_decision_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID,
  decision_type TEXT NOT NULL,
  recommended_action TEXT NOT NULL,
  confidence_score DECIMAL(3,2) NOT NULL,
  reasoning JSONB NOT NULL,
  contributing_factors JSONB NOT NULL,
  alternative_actions JSONB,
  executed BOOLEAN DEFAULT false,
  execution_result TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create AI logic configurations table for versioned AI rule modifications
CREATE TABLE public.ai_logic_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  configuration_data JSONB NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN DEFAULT false,
  natural_language_prompt TEXT,
  performance_metrics JSONB,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create AI scenario tests table for storing and replaying test scenarios
CREATE TABLE public.ai_scenario_tests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  scenario_data JSONB NOT NULL,
  expected_outcome JSONB,
  actual_outcome JSONB,
  configuration_id UUID REFERENCES public.ai_logic_configurations(id),
  test_status TEXT DEFAULT 'pending',
  execution_time_ms INTEGER,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create AI performance baselines table for tracking logic effectiveness
CREATE TABLE public.ai_performance_baselines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  configuration_id UUID REFERENCES public.ai_logic_configurations(id),
  metric_name TEXT NOT NULL,
  metric_value DECIMAL(10,4) NOT NULL,
  baseline_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  baseline_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  sample_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.ai_decision_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_logic_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_scenario_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_performance_baselines ENABLE ROW LEVEL SECURITY;

-- Create policies for ai_decision_logs
CREATE POLICY "Users can view all AI decision logs" 
ON public.ai_decision_logs 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create AI decision logs" 
ON public.ai_decision_logs 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update AI decision logs" 
ON public.ai_decision_logs 
FOR UPDATE 
USING (true);

-- Create policies for ai_logic_configurations
CREATE POLICY "Users can view AI logic configurations" 
ON public.ai_logic_configurations 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create AI logic configurations" 
ON public.ai_logic_configurations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update AI logic configurations" 
ON public.ai_logic_configurations 
FOR UPDATE 
USING (true);

-- Create policies for ai_scenario_tests
CREATE POLICY "Users can view AI scenario tests" 
ON public.ai_scenario_tests 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create AI scenario tests" 
ON public.ai_scenario_tests 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update AI scenario tests" 
ON public.ai_scenario_tests 
FOR UPDATE 
USING (true);

-- Create policies for ai_performance_baselines
CREATE POLICY "Users can view AI performance baselines" 
ON public.ai_performance_baselines 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create AI performance baselines" 
ON public.ai_performance_baselines 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_ai_tables_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_ai_decision_logs_updated_at
BEFORE UPDATE ON public.ai_decision_logs
FOR EACH ROW
EXECUTE FUNCTION public.update_ai_tables_updated_at();

CREATE TRIGGER update_ai_logic_configurations_updated_at
BEFORE UPDATE ON public.ai_logic_configurations
FOR EACH ROW
EXECUTE FUNCTION public.update_ai_tables_updated_at();

CREATE TRIGGER update_ai_scenario_tests_updated_at
BEFORE UPDATE ON public.ai_scenario_tests
FOR EACH ROW
EXECUTE FUNCTION public.update_ai_tables_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_ai_decision_logs_student_id ON public.ai_decision_logs(student_id);
CREATE INDEX idx_ai_decision_logs_decision_type ON public.ai_decision_logs(decision_type);
CREATE INDEX idx_ai_decision_logs_created_at ON public.ai_decision_logs(created_at);
CREATE INDEX idx_ai_logic_configurations_is_active ON public.ai_logic_configurations(is_active);
CREATE INDEX idx_ai_scenario_tests_configuration_id ON public.ai_scenario_tests(configuration_id);
CREATE INDEX idx_ai_performance_baselines_configuration_id ON public.ai_performance_baselines(configuration_id);