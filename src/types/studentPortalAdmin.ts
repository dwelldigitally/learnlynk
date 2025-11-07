// Phase 1 Student Portal Admin Types
import type { Database } from '@/integrations/supabase/types';

type DBBranding = Database['public']['Tables']['student_portal_branding']['Row'];
type DBNavigation = Database['public']['Tables']['student_portal_navigation']['Row'];
type DBRole = Database['public']['Tables']['student_portal_roles']['Row'];
type DBTemplate = Database['public']['Tables']['student_portal_communication_templates']['Row'];
type DBCategory = Database['public']['Tables']['student_portal_content_categories']['Row'];
type DBMedia = Database['public']['Tables']['student_portal_media_library']['Row'];

export interface FooterLink {
  label: string;
  url: string;
}

export interface SocialMediaLink {
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube';
  url: string;
}

export interface PortalBranding extends Omit<DBBranding, 'footer_links' | 'social_media_links'> {
  footer_links: FooterLink[];
  social_media_links: SocialMediaLink[];
}

export interface PortalNavigation extends Omit<DBNavigation, 'required_roles' | 'required_programs' | 'required_statuses' | 'required_intakes'> {
  required_roles: string[];
  required_programs: string[];
  required_statuses: string[];
  required_intakes: string[];
}

export interface PortalRole extends Omit<DBRole, 'permissions' | 'allowed_content_categories' | 'restricted_content_categories' | 'allowed_programs' | 'allowed_campuses'> {
  permissions: {
    dashboard: boolean;
    applications: boolean;
    documents: boolean;
    payments: boolean;
    messages: boolean;
    academic_plan: boolean;
    career_services: boolean;
    events: boolean;
    news: boolean;
    campus_life: boolean;
    practicum: boolean;
  };
  allowed_content_categories: string[];
  restricted_content_categories: string[];
  allowed_programs: string[];
  allowed_campuses: string[];
}

export interface CommunicationTemplate extends Omit<DBTemplate, 'available_variables' | 'trigger_conditions'> {
  available_variables: string[];
  trigger_conditions: Record<string, any>;
}

export interface ContentCategory extends Omit<DBCategory, 'required_roles'> {
  required_roles: string[];
}

export interface MediaLibraryItem extends Omit<DBMedia, 'tags'> {
  tags: string[];
}
