import { supabase } from '@/integrations/supabase/client';
import { MasterRequirement, VerificationStatus } from '@/types/requirement';

class RequirementVerificationService {
  /**
   * Verify if a document meets the requirement criteria
   */
  async verifyDocument(
    documentId: string,
    requirementId: string,
    extractedValue: string,
    verificationMethod: 'manual' | 'ai' | 'ocr' = 'manual',
    confidenceScore?: number
  ): Promise<any> {
    // Get the requirement details
    const { data: requirement, error: reqError } = await supabase
      .from('master_requirements')
      .select('*')
      .eq('id', requirementId)
      .single();

    if (reqError || !requirement) {
      throw new Error('Requirement not found');
    }

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Check if value meets requirement
    const meetsRequirement = this.compareWithRequirement(extractedValue, requirement as any);

    // Create verification record
    const { data, error } = await (supabase as any)
      .from('document_requirement_verifications')
      .insert({
        document_id: documentId,
        requirement_id: requirementId,
        extracted_value: extractedValue,
        meets_requirement: meetsRequirement,
        verification_method: verificationMethod,
        verified_by: user.id,
        verified_at: new Date().toISOString(),
        confidence_score: confidenceScore,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;

    // Update document status
    const status: VerificationStatus = meetsRequirement 
      ? 'meets_requirement' 
      : confidenceScore && confidenceScore < 80 
        ? 'manual_review_needed' 
        : 'below_requirement';

    await (supabase as any)
      .from('student_document_uploads')
      .update({
        requirement_verification_status: status,
        extracted_value: extractedValue,
        requirement_id: requirementId
      })
      .eq('id', documentId);

    return data;
  }

  /**
   * Compare extracted value with requirement
   */
  compareWithRequirement(extractedValue: string, requirement: MasterRequirement): boolean {
    const minValue = requirement.minimum_value;
    const maxValue = requirement.maximum_value;

    if (!minValue && !maxValue) return true;

    const numericValue = parseFloat(extractedValue);
    
    if (isNaN(numericValue)) {
      // For non-numeric values, do string comparison
      return true; // Manual review needed
    }

    let meets = true;
    
    if (minValue) {
      const min = parseFloat(minValue);
      if (!isNaN(min)) {
        meets = meets && numericValue >= min;
      }
    }

    if (maxValue) {
      const max = parseFloat(maxValue);
      if (!isNaN(max)) {
        meets = meets && numericValue <= max;
      }
    }

    return meets;
  }

  /**
   * Get all verifications for a document
   */
  async getDocumentVerifications(documentId: string): Promise<any[]> {
    const { data, error } = await (supabase as any)
      .from('document_requirement_verifications')
      .select('*')
      .eq('document_id', documentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Update verification status
   */
  async updateVerificationStatus(
    documentId: string,
    status: VerificationStatus,
    extractedValue?: string,
    notes?: string
  ): Promise<void> {
    const { error } = await (supabase as any)
      .from('student_document_uploads')
      .update({
        requirement_verification_status: status,
        extracted_value: extractedValue,
        requirement_notes: notes
      })
      .eq('id', documentId);

    if (error) throw error;
  }

  /**
   * Auto-extract value from document (placeholder for AI/OCR integration)
   */
  async autoExtractValue(documentId: string, documentType: string): Promise<{ value: string; confidence: number }> {
    // This is a placeholder for AI/OCR extraction
    // In a real implementation, this would call an AI service to extract values
    // For now, return null to indicate manual entry is needed
    return { value: '', confidence: 0 };
  }

  /**
   * Get program requirements with overrides
   */
  async getProgramRequirements(programId: string): Promise<any[]> {
    const { data, error } = await (supabase as any)
      .from('program_requirements')
      .select(`
        *,
        requirement:master_requirements(*)
      `)
      .eq('program_id', programId);

    if (error) throw error;
    return data || [];
  }
}

export const requirementVerificationService = new RequirementVerificationService();
