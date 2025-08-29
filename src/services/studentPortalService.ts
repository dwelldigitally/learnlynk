
import { supabase } from "@/integrations/supabase/client";

export interface StudentPortalData {
  student_name: string;
  email: string;
  phone?: string;
  country?: string;
  program: string;
  intake_date?: string;
  portal_config?: any;
}

export interface StudentPortal {
  id: string;
  student_name: string;
  email: string;
  phone?: string;
  country?: string;
  program: string;
  intake_date?: string;
  access_token: string;
  portal_config: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Align with actual student_portal_content table structure
export interface StudentPortalContent {
  id: string;
  user_id: string;
  content_type: string;
  title: string;
  description?: string;
  content?: string;
  image_url?: string;
  author?: string;
  read_time?: string;
  date?: string;
  time?: string;
  location?: string;
  event_type?: string;
  capacity?: number;
  registered_count: number;
  max_capacity?: number;
  is_published: boolean;
  target_audience: any;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface StudentPortalConfig {
  id: string;
  user_id: string;
  config_key: string;
  config_value: any;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export class StudentPortalService {
  static async createStudentPortal(data: StudentPortalData): Promise<StudentPortal> {
    // Generate portal configuration based on program
    const portalConfig = this.generatePortalConfig(data.program, data.intake_date);
    
    const { data: portal, error } = await supabase
      .from('student_portals')
      .insert({
        ...data,
        portal_config: portalConfig
      })
      .select()
      .single();

    if (error) throw error;
    return portal;
  }

  static async getPortalByToken(accessToken: string): Promise<StudentPortal | null> {
    const { data, error } = await supabase
      .from('student_portals')
      .select('*')
      .eq('access_token', accessToken)
      .eq('is_active', true)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async updatePortalConfig(id: string, config: any): Promise<void> {
    const { error } = await supabase
      .from('student_portals')
      .update({ portal_config: config })
      .eq('id', id);

    if (error) throw error;
  }

  static async getAllPortals(): Promise<StudentPortal[]> {
    const { data, error } = await supabase
      .from('student_portals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async deactivatePortal(id: string): Promise<void> {
    const { error } = await supabase
      .from('student_portals')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw error;
  }

  // Content Management Methods - using actual table structure
  static async getPortalContent(): Promise<StudentPortalContent[]> {
    const { data, error } = await supabase
      .from('student_portal_content')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getPublishedContent(): Promise<StudentPortalContent[]> {
    const { data, error } = await supabase
      .from('student_portal_content')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async createPortalContent(content: Omit<StudentPortalContent, 'id' | 'created_at' | 'updated_at'>): Promise<StudentPortalContent> {
    const { data, error } = await supabase
      .from('student_portal_content')
      .insert(content)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updatePortalContent(id: string, updates: Partial<StudentPortalContent>): Promise<StudentPortalContent> {
    const { data, error } = await supabase
      .from('student_portal_content')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deletePortalContent(id: string): Promise<void> {
    const { error } = await supabase
      .from('student_portal_content')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Configuration Management Methods
  static async getPortalConfig(): Promise<StudentPortalConfig[]> {
    const { data, error } = await supabase
      .from('student_portal_config')
      .select('*')
      .eq('is_active', true);

    if (error) throw error;
    return data || [];
  }

  static async createOrUpdatePortalConfig(config: Omit<StudentPortalConfig, 'id' | 'created_at' | 'updated_at'>): Promise<StudentPortalConfig> {
    const { data: existingConfig } = await supabase
      .from('student_portal_config')
      .select('*')
      .eq('config_key', config.config_key)
      .eq('user_id', config.user_id)
      .single();

    if (existingConfig) {
      const { data, error } = await supabase
        .from('student_portal_config')
        .update(config)
        .eq('id', existingConfig.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('student_portal_config')
        .insert(config)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }

  // Real-time Subscription Methods
  static subscribeToContentChanges(callback: () => void) {
    return supabase
      .channel('student_portal_content_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'student_portal_content' }, callback)
      .subscribe();
  }

  static subscribeToConfigChanges(callback: () => void) {
    return supabase
      .channel('student_portal_config_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'student_portal_config' }, callback)
      .subscribe();
  }

  private static generatePortalConfig(program: string, intakeDate?: string): any {
    // Simple default configuration to avoid encoding issues
    const config: any = {
      theme: {
        primary: "#6366f1",
        secondary: "#4f46e5", 
        accent: "#8b5cf6"
      },
      timeline: {
        applicationDeadline: "2024-05-01",
        documentSubmission: "2024-05-15",
        finalDecision: "2024-06-15"
      },
      resources: [
        "Student Handbook",
        "Academic Planning Guide", 
        "Campus Resources"
      ],
      welcomeMessage: `Welcome to your personalized ${program} portal!`,
      program: program
    };

    // Add intake date if provided
    if (intakeDate) {
      config.intakeDate = intakeDate;
    }

    return config;
  }
}
