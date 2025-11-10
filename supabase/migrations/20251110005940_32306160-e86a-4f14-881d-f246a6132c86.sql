-- Create user_roles table if not exists
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'team_lead', 'advisor', 'finance_officer', 'registrar', 'viewer')),
  assigned_by UUID,
  assigned_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Everyone can view user roles" ON public.user_roles FOR SELECT USING (true);
CREATE POLICY "Admins can manage user roles" ON public.user_roles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Create permissions table
CREATE TABLE IF NOT EXISTS public.permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  permission_name TEXT NOT NULL UNIQUE,
  permission_description TEXT,
  category TEXT CHECK (category IN ('leads', 'students', 'financial', 'system', 'team')),
  risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create role_permissions table
CREATE TABLE IF NOT EXISTS public.role_permissions (
  role TEXT NOT NULL CHECK (role IN ('admin', 'team_lead', 'advisor', 'finance_officer', 'registrar', 'viewer')),
  permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role, permission_id)
);

-- Create user_permissions table
CREATE TABLE IF NOT EXISTS public.user_permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  granted_by UUID,
  granted_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, permission_id)
);

-- Create team_hierarchy table
CREATE TABLE IF NOT EXISTS public.team_hierarchy (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('team', 'department', 'individual')),
  parent_id UUID REFERENCES public.team_hierarchy(id) ON DELETE CASCADE,
  manager_id UUID,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_hierarchy ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Everyone can view permissions" ON public.permissions FOR SELECT USING (true);
CREATE POLICY "Everyone can view role permissions" ON public.role_permissions FOR SELECT USING (true);
CREATE POLICY "Everyone can view team hierarchy" ON public.team_hierarchy FOR SELECT USING (true);
CREATE POLICY "Users can view their own permissions" ON public.user_permissions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Everyone can view all user permissions" ON public.user_permissions FOR SELECT USING (true);