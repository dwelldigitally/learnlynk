-- AI Scoring Training Data - stores historical lead snapshots with outcomes
CREATE TABLE ai_scoring_training_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  features JSONB NOT NULL DEFAULT '{}',
  outcome TEXT CHECK (outcome IN ('converted', 'lost', 'pending')),
  outcome_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- AI Scoring Models - stores trained model parameters per tenant
CREATE TABLE ai_scoring_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  model_version INTEGER DEFAULT 1,
  feature_weights JSONB DEFAULT '{}',
  performance_metrics JSONB DEFAULT '{}',
  training_sample_size INTEGER DEFAULT 0,
  last_trained_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_active_model_per_tenant UNIQUE (tenant_id, is_active) DEFERRABLE INITIALLY DEFERRED
);

-- Lead AI Score History - tracks score changes over time
CREATE TABLE lead_ai_score_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  ai_score NUMERIC NOT NULL,
  score_breakdown JSONB DEFAULT '{}',
  model_version INTEGER,
  calculated_at TIMESTAMPTZ DEFAULT now()
);

-- AI Scoring Predictions - tracks prediction accuracy
CREATE TABLE ai_scoring_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  predicted_score NUMERIC NOT NULL,
  predicted_at TIMESTAMPTZ DEFAULT now(),
  actual_outcome TEXT,
  outcome_date TIMESTAMPTZ,
  was_accurate BOOLEAN
);

-- Create indexes for performance
CREATE INDEX idx_ai_scoring_training_tenant ON ai_scoring_training_data(tenant_id);
CREATE INDEX idx_ai_scoring_training_outcome ON ai_scoring_training_data(outcome);
CREATE INDEX idx_ai_scoring_models_tenant ON ai_scoring_models(tenant_id);
CREATE INDEX idx_lead_ai_score_history_lead ON lead_ai_score_history(lead_id);
CREATE INDEX idx_lead_ai_score_history_tenant ON lead_ai_score_history(tenant_id);
CREATE INDEX idx_ai_scoring_predictions_tenant ON ai_scoring_predictions(tenant_id);
CREATE INDEX idx_ai_scoring_predictions_lead ON ai_scoring_predictions(lead_id);

-- Enable RLS
ALTER TABLE ai_scoring_training_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_scoring_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_ai_score_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_scoring_predictions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ai_scoring_training_data
CREATE POLICY "Tenant members can view training data"
  ON ai_scoring_training_data FOR SELECT
  USING (tenant_id = current_tenant_id());

CREATE POLICY "Tenant members can insert training data"
  ON ai_scoring_training_data FOR INSERT
  WITH CHECK (tenant_id = current_tenant_id());

CREATE POLICY "System can manage training data"
  ON ai_scoring_training_data FOR ALL
  USING (true);

-- RLS Policies for ai_scoring_models
CREATE POLICY "Tenant members can view their models"
  ON ai_scoring_models FOR SELECT
  USING (tenant_id = current_tenant_id());

CREATE POLICY "System can manage models"
  ON ai_scoring_models FOR ALL
  USING (true);

-- RLS Policies for lead_ai_score_history
CREATE POLICY "Tenant members can view score history"
  ON lead_ai_score_history FOR SELECT
  USING (tenant_id = current_tenant_id());

CREATE POLICY "System can insert score history"
  ON lead_ai_score_history FOR INSERT
  WITH CHECK (true);

-- RLS Policies for ai_scoring_predictions
CREATE POLICY "Tenant members can view predictions"
  ON ai_scoring_predictions FOR SELECT
  USING (tenant_id = current_tenant_id());

CREATE POLICY "System can manage predictions"
  ON ai_scoring_predictions FOR ALL
  USING (true);

-- Add ai_score_breakdown column to leads table if not exists
ALTER TABLE leads ADD COLUMN IF NOT EXISTS ai_score_breakdown JSONB DEFAULT '{}';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS ai_score_updated_at TIMESTAMPTZ;