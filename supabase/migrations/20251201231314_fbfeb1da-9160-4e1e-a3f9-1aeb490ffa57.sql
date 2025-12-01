-- Create team invitations table
CREATE TABLE public.team_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  invited_by UUID REFERENCES auth.users(id),
  invite_token UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
  personal_message TEXT,
  status TEXT DEFAULT 'pending',
  expires_at TIMESTAMPTZ DEFAULT (now() + interval '7 days'),
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  CONSTRAINT valid_status CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),
  CONSTRAINT valid_role CHECK (role IN ('admin', 'team_lead', 'advisor', 'finance_officer', 'registrar', 'viewer'))
);

-- Enable RLS
ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;

-- Admins and team leads can manage invitations
CREATE POLICY "Admins and team leads can manage invitations" 
  ON public.team_invitations
  FOR ALL TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'team_lead')
  );

-- Anyone can view their own pending invitation by token (for signup flow)
CREATE POLICY "Users can view invitations by token"
  ON public.team_invitations
  FOR SELECT TO anon, authenticated
  USING (status = 'pending' AND expires_at > now());

-- Indexes for performance
CREATE INDEX idx_team_invitations_email ON public.team_invitations(email);
CREATE INDEX idx_team_invitations_token ON public.team_invitations(invite_token);
CREATE INDEX idx_team_invitations_status ON public.team_invitations(status);

-- Trigger for updated_at
CREATE TRIGGER update_team_invitations_updated_at
  BEFORE UPDATE ON public.team_invitations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();