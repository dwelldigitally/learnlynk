import { supabase } from '@/integrations/supabase/client';
import { DocumentRequirement } from '@/types/program';

export interface DocumentTemplate {
  id: string;
  name: string;
  description?: string;
  type: string;
  category: string;
  mandatory: boolean;
  accepted_formats: string[];
  max_size: number;
  stage: string;
  instructions?: string;
  examples?: string[];
  usage_count: number;
  is_system_template: boolean;
  applicable_programs: string[];
  user_id?: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentTemplateFormData {
  name: string;
  description?: string;
  type: string;
  category: string;
  mandatory: boolean;
  accepted_formats: string[];
  max_size: number;
  stage: string;
  instructions?: string;
  examples?: string[];
  applicable_programs: string[];
}

export class DocumentTemplateService {
  /**
   * Get all document templates with optional filtering
   */
  static async getTemplates(filters?: {
    category?: string;
    type?: string;
    mandatory?: boolean;
    stage?: string;
  }): Promise<DocumentTemplate[]> {
    let query = supabase
      .from('document_templates')
      .select('*')
      .order('usage_count', { ascending: false });

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.type) {
      query = query.eq('type', filters.type);
    }
    if (filters?.mandatory !== undefined) {
      query = query.eq('mandatory', filters.mandatory);
    }
    if (filters?.stage) {
      query = query.eq('stage', filters.stage);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  /**
   * Get templates by category
   */
  static async getTemplatesByCategory(category: string): Promise<DocumentTemplate[]> {
    const { data, error } = await supabase
      .from('document_templates')
      .select('*')
      .eq('category', category)
      .order('usage_count', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Search templates by name or description
   */
  static async searchTemplates(searchTerm: string): Promise<DocumentTemplate[]> {
    const { data, error } = await supabase
      .from('document_templates')
      .select('*')
      .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .order('usage_count', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Create a new document template
   */
  static async createTemplate(templateData: DocumentTemplateFormData): Promise<DocumentTemplate> {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('document_templates')
      .insert({
        ...templateData,
        user_id: user?.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Update an existing document template
   */
  static async updateTemplate(id: string, updates: Partial<DocumentTemplateFormData>): Promise<DocumentTemplate> {
    const { data, error } = await supabase
      .from('document_templates')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Delete a document template
   */
  static async deleteTemplate(id: string): Promise<void> {
    const { error } = await supabase
      .from('document_templates')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  /**
   * Increment usage count for a template
   */
  static async incrementUsage(id: string): Promise<void> {
    const { data, error } = await supabase
      .from('document_templates')
      .select('usage_count')
      .eq('id', id)
      .single();

    if (error) throw error;

    const { error: updateError } = await supabase
      .from('document_templates')
      .update({ usage_count: (data.usage_count || 0) + 1 })
      .eq('id', id);

    if (updateError) throw updateError;
  }

  /**
   * Get template statistics
   */
  static async getTemplateStats(): Promise<{
    totalTemplates: number;
    categoryCounts: Record<string, number>;
    mostUsed: DocumentTemplate[];
  }> {
    const templates = await this.getTemplates();
    
    const categoryCounts: Record<string, number> = {};
    templates.forEach(template => {
      categoryCounts[template.category] = (categoryCounts[template.category] || 0) + 1;
    });

    const mostUsed = templates
      .filter(t => t.usage_count > 0)
      .sort((a, b) => b.usage_count - a.usage_count)
      .slice(0, 5);

    return {
      totalTemplates: templates.length,
      categoryCounts,
      mostUsed
    };
  }

  /**
   * Convert template to DocumentRequirement format for program wizard
   */
  static templateToRequirement(template: DocumentTemplate): DocumentRequirement {
    return {
      id: template.id,
      name: template.name,
      description: template.description || '',
      mandatory: template.mandatory,
      acceptedFormats: template.accepted_formats,
      maxSize: template.max_size,
      stage: template.stage,
      order: 0, // Will be set by the wizard
      instructions: template.instructions,
      examples: template.examples
    };
  }

  /**
   * Add sample templates for demo purposes
   */
  static async addSampleTemplates(): Promise<void> {
    const sampleTemplates: Omit<DocumentTemplate, 'id' | 'created_at' | 'updated_at' | 'user_id'>[] = [
      // Academic Documents
      {
        name: 'Official Transcript',
        description: 'Official academic transcript from all previously attended institutions',
        type: 'academic',
        category: 'Academic Documents',
        mandatory: true,
        accepted_formats: ['pdf'],
        max_size: 10,
        stage: 'application',
        instructions: 'Must be sent directly from the institution or in a sealed envelope',
        examples: ['University transcript', 'College transcript', 'High school transcript'],
        usage_count: 0,
        is_system_template: true,
        applicable_programs: ['All Programs']
      },
      {
        name: 'High School Diploma',
        description: 'Copy of high school diploma or equivalent certification',
        type: 'academic',
        category: 'Academic Documents',
        mandatory: true,
        accepted_formats: ['pdf', 'jpg', 'png'],
        max_size: 5,
        stage: 'application',
        instructions: 'Must be notarized copy or official document',
        examples: ['High school diploma', 'GED certificate', 'Secondary school certificate'],
        usage_count: 0,
        is_system_template: true,
        applicable_programs: ['All Programs']
      },
      // Language Proficiency
      {
        name: 'IELTS Score Report',
        description: 'International English Language Testing System score report',
        type: 'language',
        category: 'Language Proficiency',
        mandatory: true,
        accepted_formats: ['pdf'],
        max_size: 5,
        stage: 'application',
        instructions: 'Minimum overall band score of 6.5 required. Test must be taken within 2 years.',
        examples: ['IELTS Academic', 'IELTS General Training'],
        usage_count: 0,
        is_system_template: true,
        applicable_programs: ['International Programs']
      },
      {
        name: 'TOEFL Score Report',
        description: 'Test of English as a Foreign Language score report',
        type: 'language',
        category: 'Language Proficiency',
        mandatory: false,
        accepted_formats: ['pdf'],
        max_size: 5,
        stage: 'application',
        instructions: 'Minimum score of 80 required. Test must be taken within 2 years.',
        examples: ['TOEFL iBT', 'TOEFL PBT'],
        usage_count: 0,
        is_system_template: true,
        applicable_programs: ['International Programs']
      },
      // Identity Documents
      {
        name: 'Government Issued ID',
        description: 'Valid government-issued photo identification',
        type: 'identity',
        category: 'Identity & Legal',
        mandatory: true,
        accepted_formats: ['pdf', 'jpg', 'png'],
        max_size: 5,
        stage: 'enrollment',
        instructions: 'Must be current and not expired. Both sides if applicable.',
        examples: ['Passport', 'Driver\'s license', 'National ID card'],
        usage_count: 0,
        is_system_template: true,
        applicable_programs: ['All Programs']
      },
      // Health Documents
      {
        name: 'Medical Clearance',
        description: 'Medical clearance form completed by licensed physician',
        type: 'health',
        category: 'Health & Safety',
        mandatory: true,
        accepted_formats: ['pdf'],
        max_size: 5,
        stage: 'pre-arrival',
        instructions: 'Must be completed within 6 months of program start date',
        examples: ['Physical examination form', 'Health clearance certificate'],
        usage_count: 0,
        is_system_template: true,
        applicable_programs: ['Healthcare Programs', 'Field Work Programs']
      },
      // Financial Documents
      {
        name: 'Bank Statement',
        description: 'Recent bank statement showing financial capacity',
        type: 'financial',
        category: 'Financial Documents',
        mandatory: false,
        accepted_formats: ['pdf'],
        max_size: 10,
        stage: 'application',
        instructions: 'Must be from the last 3 months and show sufficient funds for tuition and living expenses',
        examples: ['Personal bank statement', 'Savings account statement'],
        usage_count: 0,
        is_system_template: true,
        applicable_programs: ['International Programs']
      }
    ];

    for (const template of sampleTemplates) {
      await supabase
        .from('document_templates')
        .insert(template);
    }
  }
}