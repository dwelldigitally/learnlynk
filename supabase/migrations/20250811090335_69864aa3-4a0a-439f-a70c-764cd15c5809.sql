-- Add missing auto_scoring_enabled column to lead_scoring_settings
ALTER TABLE public.lead_scoring_settings 
ADD COLUMN auto_scoring_enabled BOOLEAN NOT NULL DEFAULT true;

-- Rename columns in lead_scoring_rules to match component expectations
ALTER TABLE public.lead_scoring_rules 
RENAME COLUMN field_name TO field;

ALTER TABLE public.lead_scoring_rules 
RENAME COLUMN condition_type TO condition;

ALTER TABLE public.lead_scoring_rules 
RENAME COLUMN condition_value TO value;

ALTER TABLE public.lead_scoring_rules 
RENAME COLUMN score_points TO points;

ALTER TABLE public.lead_scoring_rules 
RENAME COLUMN is_active TO enabled;

ALTER TABLE public.lead_scoring_rules 
RENAME COLUMN priority TO order_index;