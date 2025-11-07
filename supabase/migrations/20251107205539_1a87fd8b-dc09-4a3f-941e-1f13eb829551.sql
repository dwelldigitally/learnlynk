-- Phase 1: Student Portal Admin Configuration Tables

-- 1. Portal Branding Configuration
CREATE TABLE IF NOT EXISTS public.student_portal_branding (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Logo & Images
  logo_url TEXT,
  favicon_url TEXT,
  hero_image_url TEXT,
  login_background_url TEXT,
  
  -- Color Scheme (HSL format)
  primary_color TEXT DEFAULT 'var(--primary)',
  secondary_color TEXT DEFAULT 'var(--secondary)',
  accent_color TEXT DEFAULT 'var(--accent)',
  background_color TEXT DEFAULT 'var(--background)',
  foreground_color TEXT DEFAULT 'var(--foreground)',
  
  -- Typography
  font_family_heading TEXT DEFAULT 'system-ui',
  font_family_body TEXT DEFAULT 'system-ui',
  font_size_base TEXT DEFAULT '16px',
  
  -- Custom CSS
  custom_css TEXT,
  
  -- Layout
  layout_template TEXT DEFAULT 'default',
  sidebar_position TEXT DEFAULT 'left',
  
  -- Footer
  footer_text TEXT,
  footer_links JSONB DEFAULT '[]',
  social_media_links JSONB DEFAULT '[]',
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Portal Navigation Menu
CREATE TABLE IF NOT EXISTS public.student_portal_navigation (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Menu Item Details
  label TEXT NOT NULL,
  icon TEXT,
  path TEXT,
  external_url TEXT,
  parent_id UUID REFERENCES public.student_portal_navigation(id) ON DELETE CASCADE,
  
  -- Display Settings
  position INTEGER NOT NULL DEFAULT 0,
  is_enabled BOOLEAN DEFAULT true,
  is_visible BOOLEAN DEFAULT true,
  
  -- Access Control
  required_roles JSONB DEFAULT '[]',
  required_programs JSONB DEFAULT '[]',
  required_statuses JSONB DEFAULT '[]',
  required_intakes JSONB DEFAULT '[]',
  
  -- Additional Settings
  badge_text TEXT,
  badge_color TEXT,
  description TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Role-Based Access Control
CREATE TABLE IF NOT EXISTS public.student_portal_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Role Definition
  role_name TEXT NOT NULL,
  role_description TEXT,
  role_type TEXT DEFAULT 'custom', -- custom, applicant, enrolled, alumni
  
  -- Access Permissions (feature toggles)
  permissions JSONB DEFAULT '{
    "dashboard": true,
    "applications": true,
    "documents": true,
    "payments": true,
    "messages": true,
    "academic_plan": true,
    "career_services": true,
    "events": true,
    "news": true,
    "campus_life": true,
    "practicum": false
  }',
  
  -- Content Access
  allowed_content_categories JSONB DEFAULT '[]',
  restricted_content_categories JSONB DEFAULT '[]',
  
  -- Program/Campus Access
  allowed_programs JSONB DEFAULT '[]',
  allowed_campuses JSONB DEFAULT '[]',
  
  -- Priority & Status
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  priority INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(user_id, role_name)
);

-- 4. Communication Templates
CREATE TABLE IF NOT EXISTS public.student_portal_communication_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Template Details
  template_name TEXT NOT NULL,
  template_type TEXT NOT NULL, -- email, sms, portal_message, push_notification
  template_category TEXT, -- welcome, document_request, payment_reminder, etc.
  
  -- Content
  subject TEXT,
  body TEXT NOT NULL,
  html_body TEXT,
  
  -- Variables & Personalization
  available_variables JSONB DEFAULT '["student_name", "student_email", "program_name", "intake", "due_date"]',
  
  -- Automation Settings
  is_automated BOOLEAN DEFAULT false,
  trigger_event TEXT, -- document_uploaded, payment_received, etc.
  trigger_conditions JSONB DEFAULT '{}',
  
  -- Scheduling
  send_time TEXT, -- immediate, scheduled, delay
  delay_minutes INTEGER,
  scheduled_time TIME,
  
  -- Status & Priority
  is_active BOOLEAN DEFAULT true,
  priority TEXT DEFAULT 'normal', -- urgent, high, normal, low
  
  -- Tracking
  times_used INTEGER DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(user_id, template_name)
);

-- 5. Content Categories for Advanced CMS
CREATE TABLE IF NOT EXISTS public.student_portal_content_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  category_name TEXT NOT NULL,
  category_slug TEXT NOT NULL,
  category_description TEXT,
  parent_category_id UUID REFERENCES public.student_portal_content_categories(id) ON DELETE CASCADE,
  
  -- Display Settings
  icon TEXT,
  color TEXT,
  position INTEGER DEFAULT 0,
  
  -- Access Control
  is_public BOOLEAN DEFAULT true,
  required_roles JSONB DEFAULT '[]',
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(user_id, category_slug)
);

-- 6. Media Library
CREATE TABLE IF NOT EXISTS public.student_portal_media_library (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- File Details
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL, -- image, video, pdf, document
  file_size INTEGER,
  file_url TEXT NOT NULL,
  mime_type TEXT,
  
  -- Organization
  folder TEXT DEFAULT 'root',
  tags JSONB DEFAULT '[]',
  category TEXT,
  
  -- Metadata
  alt_text TEXT,
  caption TEXT,
  description TEXT,
  
  -- Dimensions (for images/videos)
  width INTEGER,
  height INTEGER,
  duration INTEGER, -- for videos in seconds
  
  -- Usage Tracking
  times_used INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.student_portal_branding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_portal_navigation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_portal_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_portal_communication_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_portal_content_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_portal_media_library ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Branding
CREATE POLICY "Users can view their branding" ON public.student_portal_branding
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their branding" ON public.student_portal_branding
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their branding" ON public.student_portal_branding
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their branding" ON public.student_portal_branding
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Navigation
CREATE POLICY "Users can view their navigation" ON public.student_portal_navigation
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their navigation" ON public.student_portal_navigation
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their navigation" ON public.student_portal_navigation
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their navigation" ON public.student_portal_navigation
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Roles
CREATE POLICY "Users can view their roles" ON public.student_portal_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their roles" ON public.student_portal_roles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their roles" ON public.student_portal_roles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their roles" ON public.student_portal_roles
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Communication Templates
CREATE POLICY "Users can view their templates" ON public.student_portal_communication_templates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their templates" ON public.student_portal_communication_templates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their templates" ON public.student_portal_communication_templates
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their templates" ON public.student_portal_communication_templates
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Content Categories
CREATE POLICY "Users can view their categories" ON public.student_portal_content_categories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their categories" ON public.student_portal_content_categories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their categories" ON public.student_portal_content_categories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their categories" ON public.student_portal_content_categories
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Media Library
CREATE POLICY "Users can view their media" ON public.student_portal_media_library
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their media" ON public.student_portal_media_library
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their media" ON public.student_portal_media_library
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their media" ON public.student_portal_media_library
  FOR DELETE USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_student_portal_branding_updated_at
  BEFORE UPDATE ON public.student_portal_branding
  FOR EACH ROW
  EXECUTE FUNCTION public.update_student_portal_updated_at();

CREATE TRIGGER update_student_portal_navigation_updated_at
  BEFORE UPDATE ON public.student_portal_navigation
  FOR EACH ROW
  EXECUTE FUNCTION public.update_student_portal_updated_at();

CREATE TRIGGER update_student_portal_roles_updated_at
  BEFORE UPDATE ON public.student_portal_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_student_portal_updated_at();

CREATE TRIGGER update_student_portal_communication_templates_updated_at
  BEFORE UPDATE ON public.student_portal_communication_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_student_portal_updated_at();

CREATE TRIGGER update_student_portal_content_categories_updated_at
  BEFORE UPDATE ON public.student_portal_content_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_student_portal_updated_at();

CREATE TRIGGER update_student_portal_media_library_updated_at
  BEFORE UPDATE ON public.student_portal_media_library
  FOR EACH ROW
  EXECUTE FUNCTION public.update_student_portal_updated_at();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_navigation_parent_id ON public.student_portal_navigation(parent_id);
CREATE INDEX IF NOT EXISTS idx_navigation_position ON public.student_portal_navigation(position);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON public.student_portal_content_categories(parent_category_id);
CREATE INDEX IF NOT EXISTS idx_media_folder ON public.student_portal_media_library(folder);
CREATE INDEX IF NOT EXISTS idx_templates_type ON public.student_portal_communication_templates(template_type);
CREATE INDEX IF NOT EXISTS idx_templates_category ON public.student_portal_communication_templates(template_category);