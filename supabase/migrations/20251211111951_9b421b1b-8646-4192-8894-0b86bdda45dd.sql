-- Phase 1: Foundation - Tenants Table & Helper Functions

-- Create tenants table
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  domain TEXT,
  logo_url TEXT,
  subscription_tier TEXT NOT NULL DEFAULT 'starter',
  subscription_status TEXT NOT NULL DEFAULT 'active',
  max_users INTEGER DEFAULT 50,
  max_leads INTEGER DEFAULT 10000,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  billing_email TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  trial_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create tenant_users junction table for user-tenant relationship
CREATE TABLE public.tenant_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  is_primary BOOLEAN NOT NULL DEFAULT false,
  invited_by UUID,
  invited_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, user_id)
);

-- Create indexes
CREATE INDEX idx_tenants_slug ON public.tenants(slug);
CREATE INDEX idx_tenants_is_active ON public.tenants(is_active);
CREATE INDEX idx_tenant_users_user_id ON public.tenant_users(user_id);
CREATE INDEX idx_tenant_users_tenant_id ON public.tenant_users(tenant_id);
CREATE INDEX idx_tenant_users_primary ON public.tenant_users(user_id, is_primary) WHERE is_primary = true;

-- Enable RLS
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_users ENABLE ROW LEVEL SECURITY;

-- Helper Functions

-- Function to get current tenant from JWT or tenant_users
CREATE OR REPLACE FUNCTION public.current_tenant_id()
RETURNS UUID AS $$
  SELECT COALESCE(
    (current_setting('request.jwt.claims', true)::json ->> 'tenant_id')::uuid,
    (SELECT tenant_id FROM public.tenant_users 
     WHERE user_id = auth.uid() 
     AND is_primary = true 
     LIMIT 1)
  );
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Function to get current user's role within tenant
CREATE OR REPLACE FUNCTION public.current_tenant_role()
RETURNS TEXT AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::json ->> 'tenant_role',
    (SELECT role FROM public.tenant_users 
     WHERE user_id = auth.uid() 
     AND tenant_id = public.current_tenant_id()
     LIMIT 1)
  );
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Function to check if user belongs to tenant
CREATE OR REPLACE FUNCTION public.user_belongs_to_tenant(check_tenant_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.tenant_users
    WHERE user_id = auth.uid()
    AND tenant_id = check_tenant_id
    AND status = 'active'
  );
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Function to check if user is tenant admin
CREATE OR REPLACE FUNCTION public.is_tenant_admin()
RETURNS BOOLEAN AS $$
  SELECT public.current_tenant_role() IN ('owner', 'admin');
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Function to check if user can access resource
CREATE OR REPLACE FUNCTION public.can_access_tenant_resource(resource_tenant_id UUID, resource_user_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
  SELECT 
    resource_tenant_id = public.current_tenant_id()
    AND (
      public.is_tenant_admin()
      OR resource_user_id IS NULL
      OR resource_user_id = auth.uid()
    );
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- RLS Policies for Tenant Tables

-- Tenants: Users can only see tenants they belong to
CREATE POLICY "Users can view their tenants"
ON public.tenants FOR SELECT
USING (
  id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid())
);

CREATE POLICY "Tenant admins can update their tenant"
ON public.tenants FOR UPDATE
USING (
  id = public.current_tenant_id() AND public.is_tenant_admin()
);

-- Tenant Users: Users can see members of their tenant
CREATE POLICY "Users can view tenant members"
ON public.tenant_users FOR SELECT
USING (
  tenant_id IN (SELECT tenant_id FROM public.tenant_users tu WHERE tu.user_id = auth.uid())
);

CREATE POLICY "Tenant admins can insert members"
ON public.tenant_users FOR INSERT
WITH CHECK (
  tenant_id = public.current_tenant_id() AND public.is_tenant_admin()
);

CREATE POLICY "Tenant admins can update members"
ON public.tenant_users FOR UPDATE
USING (
  tenant_id = public.current_tenant_id() AND public.is_tenant_admin()
);

CREATE POLICY "Tenant admins can delete members"
ON public.tenant_users FOR DELETE
USING (
  tenant_id = public.current_tenant_id() AND public.is_tenant_admin()
);

-- Create default tenant for existing data migration
INSERT INTO public.tenants (id, name, slug, subscription_tier, subscription_status)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Default Institution',
  'default',
  'enterprise',
  'active'
);