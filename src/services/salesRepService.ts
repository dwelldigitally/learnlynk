import { supabase } from '@/integrations/supabase/client';
import { LeadDocument } from './documentService';
import { PaymentService, Payment } from './paymentService';

export interface EntryRequirementThreshold {
  id: string;
  name: string;
  type: string;
  minimumGrade?: string;
  minimumScore?: number;
  yearsRequired?: number;
  alternatives?: string;
  linkedDocumentTemplates?: string[];
}

export interface PendingDocument extends LeadDocument {
  entryRequirement?: EntryRequirementThreshold;
}

export interface StudentWithMissingDocuments {
  id: string;
  master_record_id: string;
  first_name: string;
  last_name: string;
  email: string;
  program: string;
  programId?: string;
  campus?: string;
  application_deadline?: string;
  substage: string;
  priority: 'critical' | 'high' | 'normal';
  missingDocuments: string[];
  pendingDocuments: PendingDocument[];
  daysUntilDeadline?: number;
  entryRequirements?: EntryRequirementThreshold[];
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
   * Get leads with document status assigned to current sales rep
   * Uses leads table instead of applicants
   */
  async getAssignedStudentsWithMissingDocuments(userId: string): Promise<StudentWithMissingDocuments[]> {
    try {
      // Get leads assigned to this user
      const { data: leads, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .eq('assigned_to', userId)
        .in('status', ['new', 'contacted', 'qualified', 'nurturing']);

      if (leadsError) throw leadsError;
      if (!leads || leads.length === 0) return [];

      const studentsWithMissing: StudentWithMissingDocuments[] = [];

      for (const lead of leads) {
        // Get program info for entry requirements
        const programName = lead.program_interest?.[0];
        let entryRequirements: EntryRequirementThreshold[] = [];
        let programId: string | undefined;
        let campus: string | undefined;

        if (programName) {
          const { data: programData } = await supabase
            .from('programs')
            .select('id, entry_requirements')
            .eq('name', programName)
            .maybeSingle();

          if (programData) {
            programId = programData.id;
            
            // Parse entry requirements
            const rawRequirements = programData.entry_requirements as any[] || [];
            entryRequirements = rawRequirements.map((req: any) => ({
              id: req.id || req.name,
              name: req.name,
              type: req.type || 'document',
              minimumGrade: req.minimumGrade,
              minimumScore: req.minimumScore,
              yearsRequired: req.yearsRequired,
              alternatives: req.alternatives,
              linkedDocumentTemplates: req.linkedDocumentTemplates || []
            }));
          }
        }

        // Get documents for this lead
        const { data: documents } = await supabase
          .from('lead_documents')
          .select('*')
          .eq('lead_id', lead.id);

        const leadDocs = documents || [];
        
        // Find pending documents with their linked entry requirements
        const pendingDocs: PendingDocument[] = leadDocs
          .filter(doc => doc.admin_status === 'pending' || doc.admin_status === 'under-review')
          .map(doc => {
            // Find the linked entry requirement
            const linkedReq = entryRequirements.find(req => 
              req.id === doc.entry_requirement_id || 
              req.linkedDocumentTemplates?.includes(doc.requirement_id || '')
            );
            return {
              ...doc,
              entryRequirement: linkedReq
            };
          });

        // Find missing documents (entry requirements with linked docs that aren't uploaded)
        const uploadedDocNames = leadDocs.map(doc => doc.document_name?.toLowerCase());
        const uploadedReqIds = leadDocs.map(doc => doc.requirement_id);
        
        const missingDocs = entryRequirements
          .filter(req => req.linkedDocumentTemplates && req.linkedDocumentTemplates.length > 0)
          .filter(req => {
            // Check if any linked document template has been uploaded
            const hasUpload = req.linkedDocumentTemplates?.some(templateId => 
              uploadedReqIds.includes(templateId)
            );
            return !hasUpload;
          })
          .map(req => req.name);

        // Only include if there are missing or pending documents
        if (missingDocs.length > 0 || pendingDocs.length > 0) {
          // Calculate priority based on intake deadline
          let priority: 'critical' | 'high' | 'normal' = 'normal';
          let daysUntilDeadline: number | undefined;

          if (lead.preferred_intake_id) {
            const { data: intake } = await supabase
              .from('intakes')
              .select('application_deadline, start_date')
              .eq('id', lead.preferred_intake_id)
              .maybeSingle();

            if (intake?.application_deadline) {
              const deadline = new Date(intake.application_deadline);
              const now = new Date();
              daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
              
              if (daysUntilDeadline <= 7) priority = 'critical';
              else if (daysUntilDeadline <= 14) priority = 'high';
            }
          }

          studentsWithMissing.push({
            id: lead.id,
            master_record_id: lead.id, // For leads, id is the master_record_id
            first_name: lead.first_name,
            last_name: lead.last_name,
            email: lead.email,
            program: programName || 'No program',
            programId,
            campus,
            application_deadline: undefined,
            substage: lead.status,
            priority,
            missingDocuments: missingDocs,
            pendingDocuments: pendingDocs,
            daysUntilDeadline,
            entryRequirements
          });
        }
      }

      // Sort by priority: critical > high > normal
      return studentsWithMissing.sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, normal: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });

    } catch (error) {
      console.error('Error fetching leads with document status:', error);
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