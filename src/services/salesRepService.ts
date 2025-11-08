import { supabase } from '@/integrations/supabase/client';
import { documentService, LeadDocument } from './documentService';
import { PaymentService, Payment } from './paymentService';

export interface StudentWithMissingDocuments {
  id: string;
  master_record_id: string;
  first_name: string;
  last_name: string;
  email: string;
  program: string;
  application_deadline?: string;
  substage: string;
  priority: 'critical' | 'high' | 'normal';
  missingDocuments: string[];
  pendingDocuments: LeadDocument[];
  daysUntilDeadline?: number;
}

export interface StudentPaymentPending {
  id: string;
  master_record_id: string;
  first_name: string;
  last_name: string;
  email: string;
  program: string;
  payment_status: string;
  outstanding_amount: number;
  days_since_approval: number;
  approved_at?: string;
}

export interface RecentPayment extends Payment {
  student_name: string;
  student_email: string;
}

class SalesRepService {
  /**
   * Get students with missing documents assigned to current sales rep
   */
  async getAssignedStudentsWithMissingDocuments(userId: string): Promise<StudentWithMissingDocuments[]> {
    try {
      // Get applicants assigned to this user
      const { data: applicants, error: applicantsError } = await supabase
        .from('applicants')
        .select(`
          id,
          master_record_id,
          program,
          application_deadline,
          substage,
          assigned_to,
          decision_date,
          master_records (
            id,
            first_name,
            last_name,
            email
          )
        `)
        .eq('assigned_to', userId)
        .in('substage', ['application_started', 'documents_submitted', 'under_review']);

      if (applicantsError) throw applicantsError;
      if (!applicants || applicants.length === 0) return [];

      const studentsWithMissing: StudentWithMissingDocuments[] = [];

      for (const applicant of applicants) {
        const masterRecord = applicant.master_records;
        if (!masterRecord) continue;

        // Get document requirements for the program
        const { data: programData, error: programError } = await supabase
          .from('programs')
          .select('document_requirements')
          .eq('name', applicant.program)
          .eq('user_id', userId)
          .maybeSingle();

        if (programError || !programData) continue;

        const requirements = (programData.document_requirements || []) as any[];
        const requiredDocs = requirements
          .filter(req => req.required)
          .map(req => req.name);

        // Get submitted documents
        const submittedDocs = await documentService.getLeadDocuments(masterRecord.id);
        const submittedDocNames = submittedDocs.map(doc => doc.document_name);
        const pendingDocs = submittedDocs.filter(doc => 
          doc.admin_status === 'pending' || doc.admin_status === 'under-review'
        );

        // Find missing documents
        const missingDocs = requiredDocs.filter(
          docName => !submittedDocNames.includes(docName)
        );

        // Only include if there are missing or pending documents
        if (missingDocs.length > 0 || pendingDocs.length > 0) {
          // Calculate priority based on deadline
          let priority: 'critical' | 'high' | 'normal' = 'normal';
          let daysUntilDeadline: number | undefined;

          if (applicant.application_deadline) {
            const deadline = new Date(applicant.application_deadline);
            const now = new Date();
            daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            
            if (daysUntilDeadline <= 7) priority = 'critical';
            else if (daysUntilDeadline <= 14) priority = 'high';
          }

          studentsWithMissing.push({
            id: applicant.id,
            master_record_id: masterRecord.id,
            first_name: masterRecord.first_name,
            last_name: masterRecord.last_name,
            email: masterRecord.email,
            program: applicant.program,
            application_deadline: applicant.application_deadline,
            substage: applicant.substage,
            priority,
            missingDocuments: missingDocs,
            pendingDocuments: pendingDocs,
            daysUntilDeadline
          });
        }
      }

      // Sort by priority: critical > high > normal
      return studentsWithMissing.sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, normal: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });

    } catch (error) {
      console.error('Error fetching students with missing documents:', error);
      throw error;
    }
  }

  /**
   * Get students pending payment assigned to current sales rep
   */
  async getPaymentPendingStudents(userId: string): Promise<StudentPaymentPending[]> {
    try {
      const { data: applicants, error } = await supabase
        .from('applicants')
        .select(`
          id,
          master_record_id,
          program,
          payment_status,
          payment_amount,
          decision_date,
          substage,
          master_records (
            id,
            first_name,
            last_name,
            email
          )
        `)
        .eq('assigned_to', userId)
        .eq('substage', 'approved')
        .neq('payment_status', 'completed');

      if (error) throw error;
      if (!applicants) return [];

      const students: StudentPaymentPending[] = [];

      for (const applicant of applicants) {
        const masterRecord = applicant.master_records;
        if (!masterRecord) continue;

        // Get payment info
        const payments = await PaymentService.getLeadPayments(masterRecord.id);
        const totalPaid = payments
          .filter(p => p.status === 'paid')
          .reduce((sum, p) => sum + Number(p.amount), 0);
        
        const totalDue = applicant.payment_amount || 0;
        const outstanding = totalDue - totalPaid;

        // Calculate days since approval
        const approvedAt = applicant.decision_date ? new Date(applicant.decision_date) : new Date();
        const daysSinceApproval = Math.floor(
          (Date.now() - approvedAt.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (outstanding > 0) {
          students.push({
            id: applicant.id,
            master_record_id: masterRecord.id,
            first_name: masterRecord.first_name,
            last_name: masterRecord.last_name,
            email: masterRecord.email,
            program: applicant.program,
            payment_status: applicant.payment_status,
            outstanding_amount: outstanding,
            days_since_approval: daysSinceApproval,
            approved_at: applicant.decision_date
          });
        }
      }

      // Sort by days since approval (oldest first)
      return students.sort((a, b) => b.days_since_approval - a.days_since_approval);

    } catch (error) {
      console.error('Error fetching payment pending students:', error);
      throw error;
    }
  }

  /**
   * Get recent payments for assigned students
   */
  async getRecentPaymentsForAssignedStudents(userId: string, days: number = 30): Promise<RecentPayment[]> {
    try {
      // Get all applicants assigned to user
      const { data: applicants, error: applicantsError } = await supabase
        .from('applicants')
        .select(`
          master_record_id,
          master_records (
            id,
            first_name,
            last_name,
            email
          )
        `)
        .eq('assigned_to', userId);

      if (applicantsError) throw applicantsError;
      if (!applicants || applicants.length === 0) return [];

      const leadIds = applicants
        .map(a => a.master_records?.id)
        .filter(Boolean) as string[];

      // Get payments for these leads
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .in('lead_id', leadIds)
        .gte('created_at', cutoffDate.toISOString())
        .order('created_at', { ascending: false });

      if (paymentsError) throw paymentsError;
      if (!payments) return [];

      // Enrich payments with student info
      const recentPayments: RecentPayment[] = payments.map(payment => {
        const applicant = applicants.find(a => a.master_records?.id === payment.lead_id);
        const masterRecord = applicant?.master_records;

        return {
          ...payment,
          student_name: masterRecord 
            ? `${masterRecord.first_name} ${masterRecord.last_name}` 
            : 'Unknown',
          student_email: masterRecord?.email || ''
        };
      });

      return recentPayments;

    } catch (error) {
      console.error('Error fetching recent payments:', error);
      throw error;
    }
  }

  /**
   * Send document reminder to student
   */
  async sendDocumentReminder(leadId: string, documentNames: string[]): Promise<void> {
    try {
      // This would typically call an edge function to send email
      // For now, we'll just log it
      console.log('Sending document reminder to lead:', leadId);
      console.log('Missing documents:', documentNames);
      
      // TODO: Implement actual email sending via edge function
      // await supabase.functions.invoke('send-document-reminder', {
      //   body: { lead_id: leadId, documents: documentNames }
      // });
      
    } catch (error) {
      console.error('Error sending document reminder:', error);
      throw error;
    }
  }
}

export const salesRepService = new SalesRepService();
