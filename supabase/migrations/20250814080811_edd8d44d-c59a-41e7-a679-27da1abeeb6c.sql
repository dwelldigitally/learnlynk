-- Create separate tables for Lead AI agents
ALTER TABLE ai_agents ADD COLUMN agent_type text DEFAULT 'lead';
ALTER TABLE ai_agents ADD COLUMN agent_category text DEFAULT 'lead';

-- Update existing agents to be categorized
UPDATE ai_agents 
SET agent_type = CASE 
  WHEN configuration->>'department' = 'registrar' THEN 'registrar'
  ELSE 'lead'
END,
agent_category = CASE 
  WHEN configuration->>'department' = 'registrar' THEN 'registrar'
  ELSE 'lead'
END;

-- Create indexes for better performance
CREATE INDEX idx_ai_agents_agent_type ON ai_agents(agent_type);
CREATE INDEX idx_ai_agents_user_agent_type ON ai_agents(user_id, agent_type);

-- Update RLS policies to consider agent_type
DROP POLICY IF EXISTS "Users can manage their own AI agents" ON ai_agents;
CREATE POLICY "Users can manage their own AI agents" 
ON ai_agents 
FOR ALL 
USING (auth.uid() = user_id);

-- Add comments for clarity
COMMENT ON COLUMN ai_agents.agent_type IS 'Type of AI agent: lead, registrar';
COMMENT ON COLUMN ai_agents.agent_category IS 'Category for UI grouping: lead, registrar';