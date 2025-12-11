-- Fix infinite recursion in tenant_users RLS policies
-- The issue: policies on tenant_users were querying tenant_users, causing infinite recursion

-- Step 1: Create SECURITY DEFINER helper function to safely get user's tenant IDs
-- This bypasses RLS entirely, breaking the recursion chain
CREATE OR REPLACE FUNCTION public.get_user_tenant_ids()
RETURNS SETOF uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT tenant_id FROM public.tenant_users 
  WHERE user_id = auth.uid() AND status = 'active';
$$;

-- Step 2: Drop existing problematic policies on tenant_users
DROP POLICY IF EXISTS "Users can view tenant members" ON tenant_users;
DROP POLICY IF EXISTS "Users can view own memberships" ON tenant_users;
DROP POLICY IF EXISTS "Users can view tenant members via function" ON tenant_users;

-- Step 3: Create new non-recursive SELECT policy on tenant_users
-- Users can see their own rows OR rows in tenants they belong to (via SECURITY DEFINER function)
CREATE POLICY "Users can view tenant members"
ON tenant_users FOR SELECT
USING (
  user_id = auth.uid() 
  OR tenant_id IN (SELECT public.get_user_tenant_ids())
);

-- Step 4: Drop and recreate tenants SELECT policy to use the helper function
DROP POLICY IF EXISTS "Users can view their tenants" ON tenants;

CREATE POLICY "Users can view their tenants"
ON tenants FOR SELECT
USING (id IN (SELECT public.get_user_tenant_ids()));