
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

export interface StudentPortalContent {
  id: string;
  user_id: string;
  content_type: 'news' | 'announcement' | 'document' | 'alert';
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
  target_audience: string[];
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface StudentPortalMessage {
  id: string;
  user_id: string;
  title: string;
  content: string;
  message_type: 'info' | 'warning' | 'error' | 'success';
  priority: 'normal' | 'high' | 'urgent';
  target_students: string[];
  scheduled_for?: string;
  is_read: boolean;
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

  // Content Management Methods
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

  // Message Management Methods
  static async getPortalMessages(): Promise<StudentPortalMessage[]> {
    const { data, error } = await supabase
      .from('student_portal_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getStudentMessages(studentId: string): Promise<StudentPortalMessage[]> {
    const { data, error } = await supabase
      .from('student_portal_messages')
      .select('*')
      .contains('target_students', [studentId])
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async createPortalMessage(message: Omit<StudentPortalMessage, 'id' | 'created_at' | 'updated_at' | 'is_read'>): Promise<StudentPortalMessage> {
    const { data, error } = await supabase
      .from('student_portal_messages')
      .insert({ ...message, is_read: false })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updatePortalMessage(id: string, updates: Partial<StudentPortalMessage>): Promise<StudentPortalMessage> {
    const { data, error } = await supabase
      .from('student_portal_messages')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deletePortalMessage(id: string): Promise<void> {
    const { error } = await supabase
      .from('student_portal_messages')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async markMessageAsRead(messageId: string, studentId: string): Promise<void> {
    const { error } = await supabase
      .from('student_portal_messages')
      .update({ is_read: true })
      .eq('id', messageId);

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

  static subscribeToMessageChanges(callback: () => void) {
    return supabase
      .channel('student_portal_message_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'student_portal_messages' }, callback)
      .subscribe();
  }

  static subscribeToConfigChanges(callback: () => void) {
    return supabase
      .channel('student_portal_config_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'student_portal_config' }, callback)
      .subscribe();
  }

  private static generatePortalConfig(program: string, intakeDate?: string): any {
    // Program-specific configurations
    const programConfigs: Record<string, any> = {
      'Business Administration': {
        theme: {
          primary: '#2563eb',
          secondary: '#1e40af',
          accent: '#3b82f6'
        },
        timeline: {
          applicationDeadline: '2024-04-15',
          documentSubmission: '2024-05-01',
          finalDecision: '2024-06-01'
        },
        resources: [
          'Business Fundamentals Guide',
          'Career Planning Toolkit',
          'Industry Networking Events'
        ]
      },
      'Computer Science': {
        theme: {
          primary: '#059669',
          secondary: '#047857',
          accent: '#10b981'
        },
        timeline: {
          applicationDeadline: '2024-04-20',
          documentSubmission: '2024-05-05',
          finalDecision: '2024-06-05'
        },
        resources: [
          'Programming Fundamentals',
          'Tech Industry Guide',
          'Coding Bootcamp Prep'
        ]
      },
      'Nursing': {
        theme: {
          primary: '#dc2626',
          secondary: '#b91c1c',
          accent: '#ef4444'
        },
        timeline: {
          applicationDeadline: '2024-04-10',
          documentSubmission: '2024-04-25',
          finalDecision: '2024-05-25'
        },
        resources: [
          'Healthcare Fundamentals',
          'Clinical Skills Guide',
          'Medical Ethics Training'
        ]
      }
    };

    const defaultConfig = {
      theme: {
        primary: '#6366f1',
        secondary: '#4f46e5',
        accent: '#8b5cf6'
      },
      timeline: {
        applicationDeadline: '2024-05-01',
        documentSubmission: '2024-05-15',
        finalDecision: '2024-06-15'
      },
      resources: [
        'Student Handbook',
        'Academic Planning Guide',
        'Campus Resources'
      ]
    };

    const config = programConfigs[program] || defaultConfig;
    
    // Adjust timeline based on intake date if provided
    if (intakeDate) {
      const intake = new Date(intakeDate);
      const deadlines = {
        applicationDeadline: new Date(intake.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        documentSubmission: new Date(intake.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        finalDecision: new Date(intake.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
      config.timeline = deadlines;
    }

    return {
      ...config,
      welcomeMessage: `Welcome to your personalized ${program} portal!`,
      intakeDate,
      program,
      createdAt: new Date().toISOString()
    };
  }
}
