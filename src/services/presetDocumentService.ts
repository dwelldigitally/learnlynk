import { supabase } from '@/integrations/supabase/client';

export interface PresetDocumentRequirement {
  id: string;
  name: string;
  description: string;
  required: boolean;
  programName: string;
}

export interface UploadedDocument {
  id: string;
  lead_id: string;
  session_id: string;
  requirement_id: string | null;
  document_name: string;
  file_path: string | null;
  file_size: number | null;
  document_type: string;
  upload_status: string | null;
  admin_status: string | null;
  admin_comments: string | null;
  admin_reviewed_by: string | null;
  admin_reviewed_at: string | null;
  metadata: any;
  ocr_text: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// Preset document requirements for each program
const PRESET_REQUIREMENTS: Record<string, PresetDocumentRequirement[]> = {
  'Master of Landscape Architecture': [
    {
      id: 'passport',
      name: 'Passport',
      description: 'Valid passport copy (all pages)',
      required: true,
      programName: 'Master of Landscape Architecture'
    },
    {
      id: 'transcript',
      name: 'Official Transcripts',
      description: 'Official transcripts from all post-secondary institutions',
      required: true,
      programName: 'Master of Landscape Architecture'
    },
    {
      id: 'portfolio',
      name: 'Portfolio',
      description: 'Design portfolio showcasing your creative work',
      required: true,
      programName: 'Master of Landscape Architecture'
    },
    {
      id: 'english_test',
      name: 'English Proficiency Test',
      description: 'IELTS, TOEFL, or equivalent test results',
      required: true,
      programName: 'Master of Landscape Architecture'
    },
    {
      id: 'statement_purpose',
      name: 'Statement of Purpose',
      description: 'Personal statement explaining your academic goals',
      required: true,
      programName: 'Master of Landscape Architecture'
    }
  ],
  'Health Care Assistant': [
    {
      id: 'passport',
      name: 'Passport',
      description: 'Valid passport copy (all pages)',
      required: true,
      programName: 'Health Care Assistant'
    },
    {
      id: 'high_school_diploma',
      name: 'High School Diploma',
      description: 'High school diploma or equivalent',
      required: true,
      programName: 'Health Care Assistant'
    },
    {
      id: 'english_test',
      name: 'English Proficiency Test',
      description: 'IELTS, TOEFL, or equivalent test results',
      required: true,
      programName: 'Health Care Assistant'
    },
    {
      id: 'immunization_records',
      name: 'Immunization Records',
      description: 'Complete immunization records',
      required: true,
      programName: 'Health Care Assistant'
    },
    {
      id: 'criminal_background_check',
      name: 'Criminal Background Check',
      description: 'Clear criminal background check',
      required: true,
      programName: 'Health Care Assistant'
    }
  ],
  'Computer Science': [
    {
      id: 'passport',
      name: 'Passport',
      description: 'Valid passport copy (all pages)',
      required: true,
      programName: 'Computer Science'
    },
    {
      id: 'transcript',
      name: 'Official Transcripts',
      description: 'Official transcripts from all post-secondary institutions',
      required: true,
      programName: 'Computer Science'
    },
    {
      id: 'english_test',
      name: 'English Proficiency Test',
      description: 'IELTS, TOEFL, or equivalent test results',
      required: true,
      programName: 'Computer Science'
    },
    {
      id: 'cv_resume',
      name: 'CV/Resume',
      description: 'Current curriculum vitae or resume',
      required: true,
      programName: 'Computer Science'
    },
    {
      id: 'statement_purpose',
      name: 'Statement of Purpose',
      description: 'Personal statement explaining your academic goals',
      required: true,
      programName: 'Computer Science'
    }
  ]
};

class PresetDocumentService {
  // Get preset requirements for a program
  getPresetRequirements(programName: string): PresetDocumentRequirement[] {
    return PRESET_REQUIREMENTS[programName] || [];
  }

  // Get all programs that have preset requirements
  getAvailablePrograms(): string[] {
    return Object.keys(PRESET_REQUIREMENTS);
  }

  // Get uploaded documents for a lead
  async getUploadedDocuments(leadId: string): Promise<UploadedDocument[]> {
    const { data, error } = await supabase
      .from('student_document_uploads')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Upload a document for a specific requirement
  async uploadDocument(
    leadId: string,
    file: File,
    requirementId: string,
    programName: string
  ): Promise<UploadedDocument> {
    // Generate unique file path
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${leadId}/${requirementId}_${timestamp}.${fileExtension}`;

    // Upload file to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('lead-documents')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Find the requirement details
    const requirement = this.getPresetRequirements(programName).find(r => r.id === requirementId);
    if (!requirement) throw new Error('Invalid requirement ID');

    // Create document record
    const { data, error } = await supabase
      .from('student_document_uploads')
      .insert({
        lead_id: leadId,
        session_id: 'admin-upload', // For admin uploads
        document_name: requirement.name,
        document_type: file.type,
        file_path: uploadData.path,
        file_size: file.size,
        requirement_id: requirementId,
        upload_status: 'uploaded',
        admin_status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Update document status (approve/reject)
  async updateDocumentStatus(
    documentId: string,
    status: string,
    comments?: string
  ): Promise<void> {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    
    const { error } = await supabase
      .from('student_document_uploads')
      .update({
        admin_status: status,
        admin_reviewed_by: userId,
        admin_reviewed_at: new Date().toISOString(),
        admin_comments: comments
      })
      .eq('id', documentId);

    if (error) throw error;
  }

  // Delete a document
  async deleteDocument(documentId: string): Promise<void> {
    // Get document info first
    const { data: doc, error: fetchError } = await supabase
      .from('student_document_uploads')
      .select('file_path')
      .eq('id', documentId)
      .single();

    if (fetchError) throw fetchError;

    // Delete from storage
    if (doc?.file_path) {
      await supabase.storage
        .from('lead-documents')
        .remove([doc.file_path]);
    }

    // Delete from database
    const { error } = await supabase
      .from('student_document_uploads')
      .delete()
      .eq('id', documentId);

    if (error) throw error;
  }

  // Get document URL for viewing
  async getDocumentUrl(filePath: string): Promise<string> {
    const { data } = await supabase.storage
      .from('lead-documents')
      .createSignedUrl(filePath, 3600); // 1 hour expiry

    return data?.signedUrl || '';
  }

  // Check if all required documents are approved for a program
  getDocumentProgress(programName: string, uploadedDocs: UploadedDocument[]): {
    total: number;
    uploaded: number;
    approved: number;
    pending: number;
    rejected: number;
    isComplete: boolean;
  } {
    const requirements = this.getPresetRequirements(programName);
    const requiredDocs = requirements.filter(req => req.required);
    
    const uploaded = uploadedDocs.length;
    const approved = uploadedDocs.filter(doc => doc.admin_status === 'approved').length;
    const pending = uploadedDocs.filter(doc => doc.admin_status === 'pending').length;
    const rejected = uploadedDocs.filter(doc => doc.admin_status === 'rejected').length;
    
    // Check if all required documents are approved
    const approvedRequirementIds = uploadedDocs
      .filter(doc => doc.admin_status === 'approved')
      .map(doc => doc.requirement_id);
    
    const allRequiredApproved = requiredDocs.every(req => 
      approvedRequirementIds.includes(req.id)
    );

    return {
      total: requiredDocs.length,
      uploaded,
      approved,
      pending,
      rejected,
      isComplete: allRequiredApproved
    };
  }
}

export const presetDocumentService = new PresetDocumentService();