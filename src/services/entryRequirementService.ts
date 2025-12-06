import { supabase } from '@/integrations/supabase/client';

export interface LinkedDocument {
  id: string;
  document_name: string;
  status: string;
  admin_status: string | null;
  file_path: string | null;
}

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
  // Joined data - document linked via entry_requirement_id
  linked_document?: LinkedDocument | null;
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
    // Fetch requirements
    const { data: requirements, error: reqError } = await supabase
      .from('lead_entry_requirements')
      .select('*')
      .eq('lead_id', leadId)
      .order('requirement_type', { ascending: true });

    if (reqError) {
      console.error('Error fetching lead entry requirements:', reqError);
      throw reqError;
    }

    if (!requirements || requirements.length === 0) {
      return [];
    }

    // Fetch documents for this lead that have entry_requirement_id set
    const { data: documents, error: docError } = await supabase
      .from('lead_documents')
      .select('id, document_name, status, admin_status, file_path, entry_requirement_id')
      .eq('lead_id', leadId)
      .not('entry_requirement_id', 'is', null);

    if (docError) {
      console.error('Error fetching lead documents:', docError);
      // Continue without documents
    }

    // Create a map of entry_requirement_id -> document
    const docMap = new Map<string, LinkedDocument>();
    if (documents) {
      for (const doc of documents) {
        if (doc.entry_requirement_id) {
          docMap.set(doc.entry_requirement_id, {
            id: doc.id,
            document_name: doc.document_name,
            status: doc.status,
            admin_status: doc.admin_status,
            file_path: doc.file_path,
          });
        }
      }
    }

    // Merge requirements with their linked documents
    const result: LeadEntryRequirement[] = requirements.map((req) => {
      const linkedDoc = docMap.get(req.entry_requirement_id) || null;
      
      // Determine effective status based on linked document
      let effectiveStatus = req.status;
      if (linkedDoc && req.status === 'pending') {
        // Sync requirement status with document status
        if (linkedDoc.admin_status === 'approved') {
          effectiveStatus = 'auto_approved';
        } else if (linkedDoc.admin_status === 'rejected') {
          effectiveStatus = 'rejected';
        }
      }

      return {
        ...req,
        status: effectiveStatus,
        linked_document: linkedDoc,
        linked_document_id: linkedDoc?.id || null, // For backward compatibility
      } as LeadEntryRequirement;
    });

    return result;
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
    notes?: string,
    alsoApproveDocument: boolean = true
  ): Promise<void> {
    // Fetch the requirement to get entry_requirement_id and lead_id
    const { data: requirement, error: fetchError } = await supabase
      .from('lead_entry_requirements')
      .select('entry_requirement_id, lead_id')
      .eq('id', requirementId)
      .single();

    if (fetchError) {
      console.error('Error fetching requirement:', fetchError);
      throw fetchError;
    }

    // Update the requirement
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

    // Also approve linked document if requested
    if (alsoApproveDocument && requirement) {
      await supabase
        .from('lead_documents')
        .update({
          admin_status: 'approved',
          approved_at: new Date().toISOString(),
          approved_by: userId,
        })
        .eq('lead_id', requirement.lead_id)
        .eq('entry_requirement_id', requirement.entry_requirement_id);
    }
  }

  async rejectRequirement(
    requirementId: string, 
    userId: string, 
    reason: string,
    alsoRejectDocument: boolean = true
  ): Promise<void> {
    // Fetch the requirement to get entry_requirement_id and lead_id
    const { data: requirement, error: fetchError } = await supabase
      .from('lead_entry_requirements')
      .select('entry_requirement_id, lead_id')
      .eq('id', requirementId)
      .single();

    if (fetchError) {
      console.error('Error fetching requirement:', fetchError);
      throw fetchError;
    }

    // Update the requirement
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

    // Also reject linked document if requested
    if (alsoRejectDocument && requirement) {
      await supabase
        .from('lead_documents')
        .update({
          admin_status: 'rejected',
          rejection_reason: reason,
        })
        .eq('lead_id', requirement.lead_id)
        .eq('entry_requirement_id', requirement.entry_requirement_id);
    }
  }

  async approveDocumentAndRequirement(
    documentId: string, 
    userId: string, 
    notes?: string
  ): Promise<void> {
    // Fetch the document to get entry_requirement_id and lead_id
    const { data: document, error: docError } = await supabase
      .from('lead_documents')
      .select('entry_requirement_id, lead_id')
      .eq('id', documentId)
      .single();

    if (docError || !document) {
      console.error('Error fetching document:', docError);
      return;
    }

    // Approve the document
    await supabase
      .from('lead_documents')
      .update({
        admin_status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: userId,
        notes: notes || null,
      })
      .eq('id', documentId);

    // Find and auto-approve linked requirement
    if (document.entry_requirement_id) {
      await supabase
        .from('lead_entry_requirements')
        .update({
          status: 'auto_approved',
          approved_at: new Date().toISOString(),
          approved_by: userId,
          notes: notes || 'Auto-approved: Linked document was approved',
          updated_at: new Date().toISOString(),
        })
        .eq('lead_id', document.lead_id)
        .eq('entry_requirement_id', document.entry_requirement_id);
    }
  }

  async rejectDocumentAndRequirement(
    documentId: string, 
    userId: string, 
    reason: string
  ): Promise<void> {
    // Fetch the document to get entry_requirement_id and lead_id
    const { data: document, error: docError } = await supabase
      .from('lead_documents')
      .select('entry_requirement_id, lead_id')
      .eq('id', documentId)
      .single();

    if (docError || !document) {
      console.error('Error fetching document:', docError);
      return;
    }

    // Reject the document
    await supabase
      .from('lead_documents')
      .update({
        admin_status: 'rejected',
        rejection_reason: reason,
      })
      .eq('id', documentId);

    // Find and reject linked requirement
    if (document.entry_requirement_id) {
      await supabase
        .from('lead_entry_requirements')
        .update({
          status: 'rejected',
          approved_by: userId,
          notes: reason,
          updated_at: new Date().toISOString(),
        })
        .eq('lead_id', document.lead_id)
        .eq('entry_requirement_id', document.entry_requirement_id);
    }
  }

  // Keep for backward compatibility but recommend using approveDocumentAndRequirement
  async autoApproveFromDocument(documentId: string, userId: string): Promise<void> {
    await this.approveDocumentAndRequirement(documentId, userId);
  }

  async linkDocumentToRequirement(
    requirementId: string, 
    documentId: string
  ): Promise<void> {
    // Get the requirement's entry_requirement_id
    const { data: requirement } = await supabase
      .from('lead_entry_requirements')
      .select('entry_requirement_id')
      .eq('id', requirementId)
      .single();

    if (!requirement) {
      throw new Error('Requirement not found');
    }

    // Update the document's entry_requirement_id
    const { error } = await supabase
      .from('lead_documents')
      .update({ entry_requirement_id: requirement.entry_requirement_id })
      .eq('id', documentId);

    if (error) {
      console.error('Error linking document to requirement:', error);
      throw error;
    }
  }

  async unlinkDocument(requirementId: string): Promise<void> {
    // Get the requirement's entry_requirement_id and lead_id
    const { data: requirement } = await supabase
      .from('lead_entry_requirements')
      .select('entry_requirement_id, lead_id')
      .eq('id', requirementId)
      .single();

    if (!requirement) {
      throw new Error('Requirement not found');
    }

    // Clear entry_requirement_id from linked documents
    const { error } = await supabase
      .from('lead_documents')
      .update({ entry_requirement_id: null })
      .eq('lead_id', requirement.lead_id)
      .eq('entry_requirement_id', requirement.entry_requirement_id);

    if (error) {
      console.error('Error unlinking document:', error);
      throw error;
    }
  }

  async getRequirementProgress(leadId: string): Promise<{ approved: number; total: number; percentage: number }> {
    // Get requirements with their effective status (considering linked documents)
    const requirements = await this.getLeadRequirements(leadId);

    const mandatoryRequirements = requirements.filter(r => r.is_mandatory);
    const approvedCount = mandatoryRequirements.filter(
      r => r.status === 'approved' || r.status === 'auto_approved'
    ).length;
    const total = mandatoryRequirements.length;
    const percentage = total > 0 ? Math.round((approvedCount / total) * 100) : 0;

    return { approved: approvedCount, total, percentage };
  }
}

export const entryRequirementService = new EntryRequirementService();
