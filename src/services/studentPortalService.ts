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
}