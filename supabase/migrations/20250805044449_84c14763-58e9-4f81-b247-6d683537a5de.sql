-- Fix infinite recursion in team inbox policies by simplifying the logic

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Team members can view their team inboxes" ON team_inboxes;
DROP POLICY IF EXISTS "Team inbox admins can manage members" ON team_inbox_members;
DROP POLICY IF EXISTS "Team members can access team inbox emails" ON emails;

-- Create simpler, non-recursive policies for team_inboxes
CREATE POLICY "Users can view team inboxes they created" 
ON team_inboxes 
FOR SELECT 
USING (auth.uid() = created_by);

-- Create simpler policies for team_inbox_members without referencing team_inboxes
CREATE POLICY "Users can view their team memberships" 
ON team_inbox_members 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage team memberships they created" 
ON team_inbox_members 
FOR ALL 
USING (auth.uid() IN (
  SELECT created_by FROM team_inboxes WHERE id = team_inbox_members.team_inbox_id
));

-- Create simpler policy for emails without complex joins
CREATE POLICY "Users can access emails from team inboxes they belong to" 
ON emails 
FOR SELECT 
USING (
  team_inbox_id IS NOT NULL 
  AND auth.uid() IN (
    SELECT user_id FROM team_inbox_members WHERE team_inbox_id = emails.team_inbox_id
  )
);