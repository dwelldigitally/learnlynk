import { supabase } from '@/integrations/supabase/client';

export interface LeadEntryRequirement {
  id: string;
  lead_id: string;
  entry_requirement_id: string;
  requirement_title: string;
  requirement_type: string;
  requirement_description: string | null;
  is_mandatory: boolean;
  threshold_data: {
    minimum_grade?: string;
    minimum_score?: number;
    years_required?: number;
    description?: string;
    alternatives?: string[];
    linked_document_templates?: string[];
  };
  status: 'pending' | 'approved' | 'rejected' | 'auto_approved';
  approved_at: string | null;
  approved_by: string | null;
  notes: string | null;
  linked_document_id: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  // Joined data
  linked_document?: {
    id: string;
    file_name: string;
    status: string;
    file_url: string | null;
  } | null;
  approver?: {
    full_name: string;
  } | null;
}

export interface ProgramEntryRequirement {
  id: string;
  title: string;
  type: string;
  description: string;
  mandatory: boolean;
  minimum_grade?: string;
  minimum_score?: number;
  years_required?: number;
  alternatives?: string[];
  linked_document_templates?: string[];
}

class EntryRequirementService {
  async getLeadRequirements(leadId: string): Promise<LeadEntryRequirement[]> {
    const { data, error } = await supabase
      .from('lead_entry_requirements')
      .select(`
        *,
        linked_document:lead_documents(id, file_name, status, file_url),
        approver:profiles!approved_by(full_name)
      `)
      .eq('lead_id', leadId)
      .order('requirement_type', { ascending: true });

    if (error) {
      console.error('Error fetching lead entry requirements:', error);
      throw error;
    }

    return (data || []) as unknown as LeadEntryRequirement[];
  }

  async initializeRequirements(
    leadId: string, 
    programName: string, 
    userId: string
  ): Promise<void> {
    // First check if requirements already exist for this lead
    const { data: existing } = await supabase
      .from('lead_entry_requirements')
      .select('id')
      .eq('lead_id', leadId)
      .limit(1);

    if (existing && existing.length > 0) {
      console.log('Requirements already initialized for this lead');
      return;
    }

    // Fetch program's entry requirements
    const { data: programs } = await supabase
      .from('programs')
      .select('entry_requirements')
      .eq('name', programName)
      .limit(1);

    if (!programs || programs.length === 0) {
      console.log('No program found for:', programName);
      return;
    }

    const rawRequirements = programs[0].entry_requirements;
    const entryRequirements = (Array.isArray(rawRequirements) ? rawRequirements : []) as unknown as ProgramEntryRequirement[];
    if (entryRequirements.length === 0) {
      console.log('No entry requirements configured for program');
      return;
    }

    // Create lead_entry_requirements records
    const requirementsToInsert = entryRequirements.map((req) => ({
      lead_id: leadId,
      entry_requirement_id: req.id,
      requirement_title: req.title,
      requirement_type: req.type || 'other',
      requirement_description: req.description,
      is_mandatory: req.mandatory !== false,
      threshold_data: {
        minimum_grade: req.minimum_grade,
        minimum_score: req.minimum_score,
        years_required: req.years_required,
        description: req.description,
        alternatives: req.alternatives,
        linked_document_templates: req.linked_document_templates,
      },
      status: 'pending',
      user_id: userId,
    }));

    const { error } = await supabase
      .from('lead_entry_requirements')
      .insert(requirementsToInsert);

    if (error) {
      console.error('Error initializing requirements:', error);
      throw error;
    }
  }

  async approveRequirement(
    requirementId: string, 
    userId: string, 
    notes?: string
  ): Promise<void> {
    const { error } = await supabase
      .from('lead_entry_requirements')
      .update({
        status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: userId,
        notes: notes || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', requirementId);

    if (error) {
      console.error('Error approving requirement:', error);
      throw error;
    }
  }

  async rejectRequirement(
    requirementId: string, 
    userId: string, 
    reason: string
  ): Promise<void> {
    const { error } = await supabase
      .from('lead_entry_requirements')
      .update({
        status: 'rejected',
        approved_at: null,
        approved_by: userId,
        notes: reason,
        updated_at: new Date().toISOString(),
      })
      .eq('id', requirementId);

    if (error) {
      console.error('Error rejecting requirement:', error);
      throw error;
    }
  }

  async autoApproveFromDocument(documentId: string, userId: string): Promise<void> {
    // Find the requirement linked to this document
    const { data: requirements, error: findError } = await supabase
      .from('lead_entry_requirements')
      .select('id')
      .eq('linked_document_id', documentId)
      .eq('status', 'pending');

    if (findError) {
      console.error('Error finding linked requirement:', findError);
      return;
    }

    if (!requirements || requirements.length === 0) {
      return; // No linked requirement found
    }

    // Auto-approve each linked requirement
    for (const req of requirements) {
      const { error } = await supabase
        .from('lead_entry_requirements')
        .update({
          status: 'auto_approved',
          approved_at: new Date().toISOString(),
          approved_by: userId,
          notes: 'Auto-approved: Linked document was approved',
          updated_at: new Date().toISOString(),
        })
        .eq('id', req.id);

      if (error) {
        console.error('Error auto-approving requirement:', error);
      }
    }
  }

  async linkDocumentToRequirement(
    requirementId: string, 
    documentId: string
  ): Promise<void> {
    const { error } = await supabase
      .from('lead_entry_requirements')
      .update({
        linked_document_id: documentId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', requirementId);

    if (error) {
      console.error('Error linking document to requirement:', error);
      throw error;
    }
  }

  async unlinkDocument(requirementId: string): Promise<void> {
    const { error } = await supabase
      .from('lead_entry_requirements')
      .update({
        linked_document_id: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', requirementId);

    if (error) {
      console.error('Error unlinking document:', error);
      throw error;
    }
  }

  async getRequirementProgress(leadId: string): Promise<{ approved: number; total: number; percentage: number }> {
    const { data, error } = await supabase
      .from('lead_entry_requirements')
      .select('status, is_mandatory')
      .eq('lead_id', leadId);

    if (error || !data) {
      return { approved: 0, total: 0, percentage: 0 };
    }

    const mandatoryRequirements = data.filter(r => r.is_mandatory);
    const approvedCount = mandatoryRequirements.filter(
      r => r.status === 'approved' || r.status === 'auto_approved'
    ).length;
    const total = mandatoryRequirements.length;
    const percentage = total > 0 ? Math.round((approvedCount / total) * 100) : 0;

    return { approved: approvedCount, total, percentage };
  }
}

export const entryRequirementService = new EntryRequirementService();
