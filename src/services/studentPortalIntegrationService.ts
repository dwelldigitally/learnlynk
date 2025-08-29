import { supabase } from '@/integrations/supabase/client';

export interface StudentPortalSession {
  id: string;
  access_token: string;
  lead_id: string;
  student_name: string;
  email: string;
  last_activity: string;
  expires_at: string;
  is_active: boolean;
  session_data: any;
  created_at: string;
  updated_at: string;
}

export interface StudentDocumentUpload {
  id: string;
  lead_id: string;
  session_id: string;
  document_name: string;
  document_type: string;
  file_size?: number;
  file_path?: string;
  upload_status: string;
  admin_status: string;
  admin_reviewed_by?: string;
  admin_reviewed_at?: string;
  admin_comments?: string;
  requirement_id?: string;
  ocr_text?: string;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface StudentCommunication {
  id: string;
  lead_id: string;
  session_id?: string;
  sender_type: string;
  sender_id?: string;
  sender_name: string;
  recipient_type: string;
  recipient_id?: string;
  message_type: string;
  subject?: string;
  message: string;
  attachments: any;
  is_read: boolean;
  read_at?: string;
  priority: string;
  created_at: string;
  updated_at: string;
}

export interface StudentApplicationProgress {
  id: string;
  lead_id: string;
  session_id: string;
  stage: string;
  substage?: string;
  progress_percentage: number;
  status: string;
  requirements_completed: any;
  requirements_pending: any;
  next_steps?: string;
  estimated_completion?: string;
  admin_notes?: string;
  last_updated_by?: string;
  created_at: string;
  updated_at: string;
}

export interface StudentAcademicPlan {
  id: string;
  lead_id: string;
  session_id: string;
  program_name: string;
  intake_date?: string;
  academic_level?: string;
  course_selections: any;
  prerequisites_status: any;
  advisor_notes?: string;
  advisor_approved_by?: string;
  advisor_approved_at?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface StudentFeePayment {
  id: string;
  lead_id: string;
  session_id: string;
  payment_type: string;
  amount: number;
  currency: string;
  payment_method?: string;
  payment_reference?: string;
  payment_status: string;
  due_date?: string;
  paid_date?: string;
  admin_confirmed_by?: string;
  admin_confirmed_at?: string;
  payment_data: any;
  created_at: string;
  updated_at: string;
}

export interface StudentNotification {
  id: string;
  lead_id: string;
  session_id?: string;
  notification_type: string;
  title: string;
  message: string;
  action_url?: string;
  is_read: boolean;
  read_at?: string;
  priority: string;
  expires_at?: string;
  metadata: any;
  created_at: string;
}

export class StudentPortalIntegrationService {
  // Session Management
  static async getCurrentSession(accessToken: string): Promise<StudentPortalSession | null> {
    const { data, error } = await supabase
      .from('student_portal_sessions')
      .select('*')
      .eq('access_token', accessToken)
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error) {
      console.error('Error fetching session:', error);
      return null;
    }

    return data;
  }

  static async updateSessionActivity(sessionId: string): Promise<void> {
    const { error } = await supabase
      .from('student_portal_sessions')
      .update({ last_activity: new Date().toISOString() })
      .eq('id', sessionId);

    if (error) {
      console.error('Error updating session activity:', error);
    }
  }

  // Document Management
  static async getStudentDocuments(sessionId: string): Promise<StudentDocumentUpload[]> {
    const { data, error } = await supabase
      .from('student_document_uploads')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching documents:', error);
      return [];
    }

    return data || [];
  }

  static async uploadDocument(sessionId: string, leadId: string, documentData: {
    document_name: string;
    document_type: string;
    file_size?: number;
    file_path?: string;
    requirement_id?: string;
    metadata?: any;
  }): Promise<StudentDocumentUpload | null> {
    const { data, error } = await supabase
      .from('student_document_uploads')
      .insert({
        session_id: sessionId,
        lead_id: leadId,
        ...documentData,
        upload_status: 'uploaded',
        admin_status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Error uploading document:', error);
      return null;
    }

    return data;
  }

  // Communication Management
  static async getStudentCommunications(leadId: string): Promise<StudentCommunication[]> {
    const { data, error } = await supabase
      .from('student_portal_communications')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching communications:', error);
      return [];
    }

    return data || [];
  }

  static async sendMessage(leadId: string, sessionId: string, messageData: {
    message_type?: string;
    subject?: string;
    message: string;
    attachments?: any;
    priority?: string;
  }): Promise<StudentCommunication | null> {
    // Get session info from sessionId
    const { data: session } = await supabase
      .from('student_portal_sessions')
      .select('student_name')
      .eq('id', sessionId)
      .single();
    
    const studentName = session?.student_name || 'Student';

    const { data, error } = await supabase
      .from('student_portal_communications')
      .insert({
        lead_id: leadId,
        session_id: sessionId,
        sender_type: 'student',
        sender_name: studentName,
        recipient_type: 'admin',
        ...messageData
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      return null;
    }

    return data;
  }

  static async markMessageAsRead(messageId: string): Promise<void> {
    const { error } = await supabase
      .from('student_portal_communications')
      .update({ 
        is_read: true, 
        read_at: new Date().toISOString() 
      })
      .eq('id', messageId);

    if (error) {
      console.error('Error marking message as read:', error);
    }
  }

  // Application Progress
  static async getApplicationProgress(leadId: string): Promise<StudentApplicationProgress | null> {
    const { data, error } = await supabase
      .from('student_application_progress')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching application progress:', error);
      return null;
    }

    return data;
  }

  static async updateApplicationProgress(sessionId: string, leadId: string, progressData: {
    stage?: string;
    substage?: string;
    progress_percentage?: number;
    status?: string;
    requirements_completed?: any;
    requirements_pending?: any;
  }): Promise<StudentApplicationProgress | null> {
    const { data, error } = await supabase
      .from('student_application_progress')
      .upsert({
        session_id: sessionId,
        lead_id: leadId,
        stage: progressData.stage || 'DOCUMENT_APPROVAL',
        ...progressData
      })
      .select()
      .single();

    if (error) {
      console.error('Error updating application progress:', error);
      return null;
    }

    return data;
  }

  // Academic Planning
  static async getAcademicPlan(leadId: string): Promise<StudentAcademicPlan | null> {
    const { data, error } = await supabase
      .from('student_academic_plans')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching academic plan:', error);
      return null;
    }

    return data;
  }

  static async updateAcademicPlan(sessionId: string, leadId: string, planData: {
    program_name?: string;
    intake_date?: string;
    academic_level?: string;
    course_selections?: any;
    prerequisites_status?: any;
    status?: string;
  }): Promise<StudentAcademicPlan | null> {
    const { data, error } = await supabase
      .from('student_academic_plans')
      .upsert({
        session_id: sessionId,
        lead_id: leadId,
        program_name: planData.program_name || 'General Studies',
        ...planData
      })
      .select()
      .single();

    if (error) {
      console.error('Error updating academic plan:', error);
      return null;
    }

    return data;
  }

  // Fee Payments
  static async getStudentPayments(leadId: string): Promise<StudentFeePayment[]> {
    const { data, error } = await supabase
      .from('student_fee_payments')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching payments:', error);
      return [];
    }

    return data || [];
  }

  static async createPayment(sessionId: string, leadId: string, paymentData: {
    payment_type: string;
    amount: number;
    currency?: string;
    payment_method?: string;
    payment_reference?: string;
    due_date?: string;
    payment_data?: any;
  }): Promise<StudentFeePayment | null> {
    const { data, error } = await supabase
      .from('student_fee_payments')
      .insert({
        session_id: sessionId,
        lead_id: leadId,
        ...paymentData,
        payment_status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating payment:', error);
      return null;
    }

    return data;
  }

  // Notifications
  static async getStudentNotifications(leadId: string): Promise<StudentNotification[]> {
    const { data, error } = await supabase
      .from('student_portal_notifications')
      .select('*')
      .eq('lead_id', leadId)
      .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }

    return data || [];
  }

  static async markNotificationAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('student_portal_notifications')
      .update({ 
        is_read: true, 
        read_at: new Date().toISOString() 
      })
      .eq('id', notificationId);

    if (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  // Real-time subscriptions
  static subscribeToStudentData(leadId: string, callback: (payload: any) => void) {
    const channel = supabase
      .channel('student-portal-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'student_document_uploads',
          filter: `lead_id=eq.${leadId}`
        },
        callback
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'student_portal_communications',
          filter: `lead_id=eq.${leadId}`
        },
        callback
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'student_application_progress',
          filter: `lead_id=eq.${leadId}`
        },
        callback
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'student_portal_notifications',
          filter: `lead_id=eq.${leadId}`
        },
        callback
      )
      .subscribe();

    return channel;
  }
}