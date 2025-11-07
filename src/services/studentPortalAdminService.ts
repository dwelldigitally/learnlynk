import { supabase } from "@/integrations/supabase/client";
import type {
  PortalBranding,
  PortalNavigation,
  PortalRole,
  CommunicationTemplate,
  ContentCategory,
  MediaLibraryItem,
} from "@/types/studentPortalAdmin";

/**
 * Student Portal Admin Service
 * Handles all administrative operations for the student portal
 */
export class StudentPortalAdminService {
  // ================== BRANDING ==================
  
  static async getBranding(): Promise<PortalBranding | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('student_portal_branding')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;
    
    // Convert JSON to proper types
    return {
      ...data,
      footer_links: (data.footer_links as any) || [],
      social_media_links: (data.social_media_links as any) || [],
    } as PortalBranding;
  }

  static async saveBranding(branding: Partial<PortalBranding>): Promise<PortalBranding> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const existing = await this.getBranding();

    if (existing) {
      const { data, error } = await supabase
        .from('student_portal_branding')
        .update(branding as any)
        .eq('id', existing.id)
        .select()
        .single();
      
      if (error) throw error;
      return {
        ...data,
        footer_links: (data.footer_links as any) || [],
        social_media_links: (data.social_media_links as any) || [],
      } as PortalBranding;
    } else {
      const { data, error } = await supabase
        .from('student_portal_branding')
        .insert({ ...branding, user_id: user.id } as any)
        .select()
        .single();
      
      if (error) throw error;
      return {
        ...data,
        footer_links: (data.footer_links as any) || [],
        social_media_links: (data.social_media_links as any) || [],
      } as PortalBranding;
    }
  }

  // ================== NAVIGATION ==================
  
  static async getNavigation(): Promise<PortalNavigation[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('student_portal_navigation')
      .select('*')
      .eq('user_id', user.id)
      .order('position');

    if (error) throw error;
    return (data || []).map(item => ({
      ...item,
      required_roles: (item.required_roles as any) || [],
      required_programs: (item.required_programs as any) || [],
      required_statuses: (item.required_statuses as any) || [],
      required_intakes: (item.required_intakes as any) || [],
    })) as PortalNavigation[];
  }

  static async createNavigationItem(item: Omit<PortalNavigation, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<PortalNavigation> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('student_portal_navigation')
      .insert({ ...item, user_id: user.id } as any)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      required_roles: (data.required_roles as any) || [],
      required_programs: (data.required_programs as any) || [],
      required_statuses: (data.required_statuses as any) || [],
      required_intakes: (data.required_intakes as any) || [],
    } as PortalNavigation;
  }

  static async updateNavigationItem(id: string, updates: Partial<PortalNavigation>): Promise<PortalNavigation> {
    const { data, error } = await supabase
      .from('student_portal_navigation')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      required_roles: (data.required_roles as any) || [],
      required_programs: (data.required_programs as any) || [],
      required_statuses: (data.required_statuses as any) || [],
      required_intakes: (data.required_intakes as any) || [],
    } as PortalNavigation;
  }

  static async deleteNavigationItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('student_portal_navigation')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async reorderNavigation(items: { id: string; position: number }[]): Promise<void> {
    const promises = items.map(({ id, position }) =>
      this.updateNavigationItem(id, { position })
    );
    await Promise.all(promises);
  }

  // ================== ROLES ==================
  
  static async getRoles(): Promise<PortalRole[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('student_portal_roles')
      .select('*')
      .eq('user_id', user.id)
      .order('priority');

    if (error) throw error;
    return (data || []).map(role => ({
      ...role,
      permissions: (role.permissions as any) || {},
      allowed_content_categories: (role.allowed_content_categories as any) || [],
      restricted_content_categories: (role.restricted_content_categories as any) || [],
      allowed_programs: (role.allowed_programs as any) || [],
      allowed_campuses: (role.allowed_campuses as any) || [],
    })) as PortalRole[];
  }

  static async createRole(role: Omit<PortalRole, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<PortalRole> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('student_portal_roles')
      .insert({ ...role, user_id: user.id } as any)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      permissions: (data.permissions as any) || {},
      allowed_content_categories: (data.allowed_content_categories as any) || [],
      restricted_content_categories: (data.restricted_content_categories as any) || [],
      allowed_programs: (data.allowed_programs as any) || [],
      allowed_campuses: (data.allowed_campuses as any) || [],
    } as PortalRole;
  }

  static async updateRole(id: string, updates: Partial<PortalRole>): Promise<PortalRole> {
    const { data, error } = await supabase
      .from('student_portal_roles')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      permissions: (data.permissions as any) || {},
      allowed_content_categories: (data.allowed_content_categories as any) || [],
      restricted_content_categories: (data.restricted_content_categories as any) || [],
      allowed_programs: (data.allowed_programs as any) || [],
      allowed_campuses: (data.allowed_campuses as any) || [],
    } as PortalRole;
  }

  static async deleteRole(id: string): Promise<void> {
    const { error } = await supabase
      .from('student_portal_roles')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // ================== COMMUNICATION TEMPLATES ==================
  
  static async getTemplates(): Promise<CommunicationTemplate[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('student_portal_communication_templates')
      .select('*')
      .eq('user_id', user.id)
      .order('template_name');

    if (error) throw error;
    return (data || []).map(template => ({
      ...template,
      available_variables: (template.available_variables as any) || [],
      trigger_conditions: (template.trigger_conditions as any) || {},
    })) as CommunicationTemplate[];
  }

  static async createTemplate(template: Omit<CommunicationTemplate, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'times_used' | 'last_used_at'>): Promise<CommunicationTemplate> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('student_portal_communication_templates')
      .insert({ ...template, user_id: user.id } as any)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      available_variables: (data.available_variables as any) || [],
      trigger_conditions: (data.trigger_conditions as any) || {},
    } as CommunicationTemplate;
  }

  static async updateTemplate(id: string, updates: Partial<CommunicationTemplate>): Promise<CommunicationTemplate> {
    const { data, error } = await supabase
      .from('student_portal_communication_templates')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      available_variables: (data.available_variables as any) || [],
      trigger_conditions: (data.trigger_conditions as any) || {},
    } as CommunicationTemplate;
  }

  static async deleteTemplate(id: string): Promise<void> {
    const { error } = await supabase
      .from('student_portal_communication_templates')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // ================== CONTENT CATEGORIES ==================
  
  static async getCategories(): Promise<ContentCategory[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('student_portal_content_categories')
      .select('*')
      .eq('user_id', user.id)
      .order('position');

    if (error) throw error;
    return (data || []).map(category => ({
      ...category,
      required_roles: (category.required_roles as any) || [],
    })) as ContentCategory[];
  }

  static async createCategory(category: Omit<ContentCategory, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<ContentCategory> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('student_portal_content_categories')
      .insert({ ...category, user_id: user.id } as any)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      required_roles: (data.required_roles as any) || [],
    } as ContentCategory;
  }

  static async updateCategory(id: string, updates: Partial<ContentCategory>): Promise<ContentCategory> {
    const { data, error } = await supabase
      .from('student_portal_content_categories')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      required_roles: (data.required_roles as any) || [],
    } as ContentCategory;
  }

  static async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from('student_portal_content_categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // ================== MEDIA LIBRARY ==================
  
  static async getMediaItems(folder: string = 'root'): Promise<MediaLibraryItem[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('student_portal_media_library')
      .select('*')
      .eq('user_id', user.id)
      .eq('folder', folder)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(media => ({
      ...media,
      tags: (media.tags as any) || [],
    })) as MediaLibraryItem[];
  }

  static async uploadMedia(
    file: File,
    folder: string = 'root',
    metadata: Partial<MediaLibraryItem> = {}
  ): Promise<MediaLibraryItem> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Upload file to Supabase Storage
    const fileName = `${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('portal-media')
      .upload(`${user.id}/${folder}/${fileName}`, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('portal-media')
      .getPublicUrl(uploadData.path);

    // Create media library record
    const fileType = file.type.startsWith('image') ? 'image' :
                    file.type.startsWith('video') ? 'video' :
                    file.type === 'application/pdf' ? 'pdf' : 'document';

    const { data, error } = await supabase
      .from('student_portal_media_library')
      .insert({
        user_id: user.id,
        file_name: file.name,
        file_type: fileType,
        file_size: file.size,
        file_url: publicUrl,
        mime_type: file.type,
        folder,
        ...metadata,
      } as any)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      tags: (data.tags as any) || [],
    } as MediaLibraryItem;
  }

  static async deleteMedia(id: string): Promise<void> {
    const { error } = await supabase
      .from('student_portal_media_library')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // ================== REAL-TIME SUBSCRIPTIONS ==================
  
  static subscribeToBrandingChanges(callback: (payload: any) => void) {
    return supabase
      .channel('branding-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'student_portal_branding',
        },
        callback
      )
      .subscribe();
  }

  static subscribeToNavigationChanges(callback: (payload: any) => void) {
    return supabase
      .channel('navigation-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'student_portal_navigation',
        },
        callback
      )
      .subscribe();
  }
}
