-- Add missing columns to user_roles table
ALTER TABLE user_roles 
ADD COLUMN IF NOT EXISTS assigned_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMPTZ DEFAULT NOW();

-- Bootstrap current user as admin (bypassing RLS via migration)
INSERT INTO user_roles (user_id, role, assigned_by, assigned_at)
VALUES (
  '7a4165be-91e3-4fd9-b2da-19a4be0f2df1',
  'admin',
  '7a4165be-91e3-4fd9-b2da-19a4be0f2df1',
  NOW()
)
ON CONFLICT (user_id, role) DO NOTHING;