-- Add first_name and last_name columns to team_invitations table
ALTER TABLE team_invitations 
ADD COLUMN first_name text,
ADD COLUMN last_name text;