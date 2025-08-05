-- Create email management tables for Microsoft Outlook integration

-- Email accounts to link users with their Outlook accounts
CREATE TABLE email_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_address TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'microsoft',
  access_token_encrypted TEXT,
  refresh_token_encrypted TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  account_type TEXT NOT NULL DEFAULT 'individual', -- 'individual' or 'team'
  display_name TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Team inboxes for shared email management
CREATE TABLE team_inboxes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email_address TEXT NOT NULL,
  email_account_id UUID NOT NULL REFERENCES email_accounts(id) ON DELETE CASCADE,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Team inbox members
CREATE TABLE team_inbox_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_inbox_id UUID NOT NULL REFERENCES team_inboxes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member', -- 'admin', 'member', 'viewer'
  permissions JSONB DEFAULT '{}',
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(team_inbox_id, user_id)
);

-- Emails synced from Outlook
CREATE TABLE emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  microsoft_id TEXT NOT NULL, -- Microsoft Graph message ID
  email_account_id UUID NOT NULL REFERENCES email_accounts(id) ON DELETE CASCADE,
  team_inbox_id UUID REFERENCES team_inboxes(id),
  thread_id UUID, -- Self-referencing for threading
  
  -- Email content
  subject TEXT,
  body_content TEXT,
  body_preview TEXT,
  from_email TEXT NOT NULL,
  from_name TEXT,
  to_emails JSONB DEFAULT '[]', -- Array of email addresses
  cc_emails JSONB DEFAULT '[]',
  bcc_emails JSONB DEFAULT '[]',
  
  -- Timestamps
  sent_datetime TIMESTAMP WITH TIME ZONE,
  received_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  created_datetime TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Status and priority
  is_read BOOLEAN NOT NULL DEFAULT false,
  importance TEXT DEFAULT 'normal', -- 'low', 'normal', 'high'
  has_attachments BOOLEAN DEFAULT false,
  
  -- Lead scoring and AI
  lead_id UUID REFERENCES leads(id),
  ai_priority_score NUMERIC DEFAULT 0,
  ai_lead_match_confidence NUMERIC DEFAULT 0,
  ai_suggested_actions JSONB DEFAULT '[]',
  
  -- Assignment and management
  assigned_to UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'new', -- 'new', 'assigned', 'in_progress', 'replied', 'resolved'
  
  -- Microsoft metadata
  microsoft_metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Email attachments
CREATE TABLE email_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email_id UUID NOT NULL REFERENCES emails(id) ON DELETE CASCADE,
  microsoft_attachment_id TEXT,
  name TEXT NOT NULL,
  content_type TEXT,
  size_bytes INTEGER,
  content_bytes BYTEA, -- Store small attachments
  download_url TEXT, -- For large attachments
  is_inline BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Email drafts and AI responses
CREATE TABLE email_drafts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  original_email_id UUID REFERENCES emails(id),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  subject TEXT,
  body_content TEXT,
  to_emails JSONB DEFAULT '[]',
  cc_emails JSONB DEFAULT '[]',
  bcc_emails JSONB DEFAULT '[]',
  
  -- AI assistance
  is_ai_generated BOOLEAN DEFAULT false,
  ai_confidence_score NUMERIC DEFAULT 0,
  suggested_attachments JSONB DEFAULT '[]', -- Document IDs to suggest
  
  -- Status
  status TEXT DEFAULT 'draft', -- 'draft', 'scheduled', 'sent'
  scheduled_for TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Email analytics and tracking
CREATE TABLE email_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email_id UUID NOT NULL REFERENCES emails(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  
  -- Response metrics
  response_time_minutes INTEGER,
  first_response_at TIMESTAMP WITH TIME ZONE,
  resolution_time_minutes INTEGER,
  resolved_at TIMESTAMP WITH TIME ZONE,
  
  -- Lead conversion tracking
  lead_score_before NUMERIC,
  lead_score_after NUMERIC,
  conversion_action TEXT, -- 'application_started', 'application_completed', etc.
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_emails_microsoft_id ON emails(microsoft_id);
CREATE INDEX idx_emails_from_email ON emails(from_email);
CREATE INDEX idx_emails_received_datetime ON emails(received_datetime DESC);
CREATE INDEX idx_emails_lead_id ON emails(lead_id) WHERE lead_id IS NOT NULL;
CREATE INDEX idx_emails_ai_priority_score ON emails(ai_priority_score DESC);
CREATE INDEX idx_emails_assigned_to ON emails(assigned_to) WHERE assigned_to IS NOT NULL;
CREATE INDEX idx_emails_status ON emails(status);
CREATE INDEX idx_email_accounts_user_id ON email_accounts(user_id);
CREATE INDEX idx_team_inboxes_email_account ON team_inboxes(email_account_id);

-- Enable RLS
ALTER TABLE email_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_inboxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_inbox_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for email_accounts
CREATE POLICY "Users can manage their own email accounts" 
ON email_accounts FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for team_inboxes
CREATE POLICY "Team inbox creators can manage their inboxes" 
ON team_inboxes FOR ALL USING (auth.uid() = created_by);

CREATE POLICY "Team members can view their team inboxes" 
ON team_inboxes FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM team_inbox_members 
    WHERE team_inbox_id = team_inboxes.id 
    AND user_id = auth.uid()
  )
);

-- RLS Policies for team_inbox_members
CREATE POLICY "Team inbox admins can manage members" 
ON team_inbox_members FOR ALL USING (
  EXISTS (
    SELECT 1 FROM team_inboxes ti 
    WHERE ti.id = team_inbox_members.team_inbox_id 
    AND ti.created_by = auth.uid()
  )
);

CREATE POLICY "Users can view their own team memberships" 
ON team_inbox_members FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for emails
CREATE POLICY "Users can access emails from their accounts" 
ON emails FOR ALL USING (
  EXISTS (
    SELECT 1 FROM email_accounts ea 
    WHERE ea.id = emails.email_account_id 
    AND ea.user_id = auth.uid()
  )
);

CREATE POLICY "Team members can access team inbox emails" 
ON emails FOR SELECT USING (
  team_inbox_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM team_inbox_members tim 
    WHERE tim.team_inbox_id = emails.team_inbox_id 
    AND tim.user_id = auth.uid()
  )
);

-- RLS Policies for email_attachments
CREATE POLICY "Users can access attachments for their emails" 
ON email_attachments FOR ALL USING (
  EXISTS (
    SELECT 1 FROM emails e
    JOIN email_accounts ea ON e.email_account_id = ea.id
    WHERE e.id = email_attachments.email_id 
    AND ea.user_id = auth.uid()
  )
);

-- RLS Policies for email_drafts
CREATE POLICY "Users can manage their own email drafts" 
ON email_drafts FOR ALL USING (auth.uid() = created_by);

-- RLS Policies for email_analytics
CREATE POLICY "Users can view analytics for their handled emails" 
ON email_analytics FOR ALL USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_email_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_email_accounts_updated_at 
BEFORE UPDATE ON email_accounts 
FOR EACH ROW EXECUTE FUNCTION update_email_updated_at_column();

CREATE TRIGGER update_team_inboxes_updated_at 
BEFORE UPDATE ON team_inboxes 
FOR EACH ROW EXECUTE FUNCTION update_email_updated_at_column();

CREATE TRIGGER update_emails_updated_at 
BEFORE UPDATE ON emails 
FOR EACH ROW EXECUTE FUNCTION update_email_updated_at_column();

CREATE TRIGGER update_email_drafts_updated_at 
BEFORE UPDATE ON email_drafts 
FOR EACH ROW EXECUTE FUNCTION update_email_updated_at_column();