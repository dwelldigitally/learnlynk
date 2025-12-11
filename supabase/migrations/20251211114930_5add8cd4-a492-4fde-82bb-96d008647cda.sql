-- Create tenant_invitations table for tracking institution invitations
CREATE TABLE IF NOT EXISTS public.tenant_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '7 days'),
  accepted_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT valid_role CHECK (role IN ('admin', 'member', 'viewer'))
);

-- Create indexes
CREATE INDEX idx_tenant_invitations_tenant_id ON public.tenant_invitations(tenant_id);
CREATE INDEX idx_tenant_invitations_email ON public.tenant_invitations(email);
CREATE INDEX idx_tenant_invitations_token ON public.tenant_invitations(token);

-- Enable RLS
ALTER TABLE public.tenant_invitations ENABLE ROW LEVEL SECURITY;

-- RLS policies for tenant_invitations
CREATE POLICY "tenant_invitations_select"
ON public.tenant_invitations FOR SELECT
USING (
  tenant_id = public.current_tenant_id()
  OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

CREATE POLICY "tenant_invitations_insert"
ON public.tenant_invitations FOR INSERT
WITH CHECK (
  tenant_id = public.current_tenant_id()
  AND public.is_tenant_admin()
);

CREATE POLICY "tenant_invitations_update"
ON public.tenant_invitations FOR UPDATE
USING (
  tenant_id = public.current_tenant_id()
  OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

CREATE POLICY "tenant_invitations_delete"
ON public.tenant_invitations FOR DELETE
USING (
  tenant_id = public.current_tenant_id()
  AND public.is_tenant_admin()
);

-- Function to create a new tenant with owner
CREATE OR REPLACE FUNCTION public.create_tenant_with_owner(
  p_name TEXT,
  p_slug TEXT,
  p_owner_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tenant_id UUID;
BEGIN
  -- Create the tenant
  INSERT INTO public.tenants (name, slug, subscription_tier, subscription_status, is_active)
  VALUES (p_name, p_slug, 'free', 'active', true)
  RETURNING id INTO v_tenant_id;
  
  -- Add owner as tenant user
  INSERT INTO public.tenant_users (tenant_id, user_id, role, is_primary, status, accepted_at)
  VALUES (v_tenant_id, p_owner_id, 'owner', true, 'active', now());
  
  RETURN v_tenant_id;
END;
$$;

-- Function to accept tenant invitation
CREATE OR REPLACE FUNCTION public.accept_tenant_invitation(
  p_token TEXT,
  p_user_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invitation RECORD;
BEGIN
  -- Find and validate invitation
  SELECT * INTO v_invitation
  FROM public.tenant_invitations
  WHERE token = p_token
    AND accepted_at IS NULL
    AND expires_at > now();
  
  IF v_invitation IS NULL THEN
    RAISE EXCEPTION 'Invalid or expired invitation';
  END IF;
  
  -- Add user to tenant
  INSERT INTO public.tenant_users (tenant_id, user_id, role, is_primary, status, accepted_at)
  VALUES (v_invitation.tenant_id, p_user_id, v_invitation.role, true, 'active', now())
  ON CONFLICT (tenant_id, user_id) DO NOTHING;
  
  -- Mark invitation as accepted
  UPDATE public.tenant_invitations
  SET accepted_at = now()
  WHERE id = v_invitation.id;
  
  RETURN v_invitation.tenant_id;
END;
$$;

-- Function to generate slug from name
CREATE OR REPLACE FUNCTION public.generate_tenant_slug(p_name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_slug TEXT;
  v_count INTEGER := 0;
  v_base_slug TEXT;
BEGIN
  -- Convert to lowercase, replace spaces with hyphens, remove special chars
  v_base_slug := lower(regexp_replace(p_name, '[^a-zA-Z0-9\s]', '', 'g'));
  v_base_slug := regexp_replace(v_base_slug, '\s+', '-', 'g');
  v_slug := v_base_slug;
  
  -- Check for uniqueness and append number if needed
  WHILE EXISTS (SELECT 1 FROM public.tenants WHERE slug = v_slug) LOOP
    v_count := v_count + 1;
    v_slug := v_base_slug || '-' || v_count;
  END LOOP;
  
  RETURN v_slug;
END;
$$;