-- Create tenant_aircall_connections table for tenant-level Aircall API credentials
CREATE TABLE public.tenant_aircall_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  api_id TEXT NOT NULL,
  api_token_encrypted TEXT NOT NULL,
  webhook_url TEXT,
  webhook_secret TEXT,
  is_active BOOLEAN DEFAULT false,
  connection_status TEXT DEFAULT 'disconnected',
  last_sync_at TIMESTAMP WITH TIME ZONE,
  connected_at TIMESTAMP WITH TIME ZONE,
  connected_by UUID REFERENCES auth.users(id),
  auto_log_calls BOOLEAN DEFAULT true,
  auto_create_leads BOOLEAN DEFAULT true,
  call_recording_enabled BOOLEAN DEFAULT true,
  transcription_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tenant_id)
);

-- Create user_aircall_sessions table to track individual user logins in the CTI widget
CREATE TABLE public.user_aircall_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  aircall_user_id TEXT,
  aircall_user_email TEXT,
  aircall_user_name TEXT,
  is_logged_in BOOLEAN DEFAULT false,
  last_login_at TIMESTAMP WITH TIME ZONE,
  last_logout_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, tenant_id)
);

-- Add tenant_id to aircall_calls table for multi-tenant isolation
ALTER TABLE public.aircall_calls 
ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id);

-- Create index for tenant-based queries
CREATE INDEX IF NOT EXISTS idx_aircall_calls_tenant_id ON public.aircall_calls(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_aircall_connections_tenant_id ON public.tenant_aircall_connections(tenant_id);
CREATE INDEX IF NOT EXISTS idx_user_aircall_sessions_user_tenant ON public.user_aircall_sessions(user_id, tenant_id);

-- Enable RLS on new tables
ALTER TABLE public.tenant_aircall_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_aircall_sessions ENABLE ROW LEVEL SECURITY;

-- RLS policies for tenant_aircall_connections (tenant admins only)
CREATE POLICY "Tenant admins can manage aircall connections"
ON public.tenant_aircall_connections
FOR ALL
USING (tenant_id = current_tenant_id() AND is_tenant_admin())
WITH CHECK (tenant_id = current_tenant_id() AND is_tenant_admin());

CREATE POLICY "Tenant members can view aircall connections"
ON public.tenant_aircall_connections
FOR SELECT
USING (tenant_id = current_tenant_id());

-- RLS policies for user_aircall_sessions
CREATE POLICY "Users can manage their own aircall sessions"
ON public.user_aircall_sessions
FOR ALL
USING (user_id = auth.uid() AND tenant_id = current_tenant_id())
WITH CHECK (user_id = auth.uid() AND tenant_id = current_tenant_id());

CREATE POLICY "Tenant members can view all aircall sessions"
ON public.user_aircall_sessions
FOR SELECT
USING (tenant_id = current_tenant_id());

-- Update aircall_calls RLS to include tenant isolation
DROP POLICY IF EXISTS "Users can manage their own aircall calls" ON public.aircall_calls;

CREATE POLICY "Tenant members can view aircall calls"
ON public.aircall_calls
FOR SELECT
USING (tenant_id = current_tenant_id());

CREATE POLICY "Tenant members can insert aircall calls"
ON public.aircall_calls
FOR INSERT
WITH CHECK (tenant_id = current_tenant_id());

CREATE POLICY "Tenant members can update aircall calls"
ON public.aircall_calls
FOR UPDATE
USING (tenant_id = current_tenant_id());

-- Update timestamp trigger for new tables
CREATE TRIGGER update_tenant_aircall_connections_updated_at
BEFORE UPDATE ON public.tenant_aircall_connections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_aircall_sessions_updated_at
BEFORE UPDATE ON public.user_aircall_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();