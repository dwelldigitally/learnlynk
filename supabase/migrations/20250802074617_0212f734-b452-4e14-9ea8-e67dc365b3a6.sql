-- Add user_id columns to tables that need user-specific data filtering
ALTER TABLE leads ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Update RLS policies for leads to be user-specific
DROP POLICY IF EXISTS "Authenticated users can view leads" ON leads;
DROP POLICY IF EXISTS "Authenticated users can manage leads" ON leads;

CREATE POLICY "Users can view their own leads" 
ON leads FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own leads" 
ON leads FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own leads" 
ON leads FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own leads" 
ON leads FOR DELETE 
USING (auth.uid() = user_id);

-- Update lead_activities table to be user-specific via leads table
DROP POLICY IF EXISTS "Authenticated users can view lead activities" ON lead_activities;
DROP POLICY IF EXISTS "Authenticated users can manage lead activities" ON lead_activities;

CREATE POLICY "Users can view activities for their own leads" 
ON lead_activities FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM leads 
    WHERE leads.id = lead_activities.lead_id 
    AND leads.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create activities for their own leads" 
ON lead_activities FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM leads 
    WHERE leads.id = lead_activities.lead_id 
    AND leads.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update activities for their own leads" 
ON lead_activities FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM leads 
    WHERE leads.id = lead_activities.lead_id 
    AND leads.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete activities for their own leads" 
ON lead_activities FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM leads 
    WHERE leads.id = lead_activities.lead_id 
    AND leads.user_id = auth.uid()
  )
);