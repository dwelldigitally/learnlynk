import { supabase } from '@/integrations/supabase/client';

export interface ScanRequest {
  url: string;
  comprehensive?: boolean;
}

export interface DetectedProgram {
  name: string;
  code?: string;
  description: string;
  type: string;
  duration: string;
  delivery_method: string;
  campus: string[];
  entry_requirements: Array<{
    type: string;
    title: string;
    description: string;
    mandatory: boolean;
  }>;
  document_requirements: Array<{
    name: string;
    description: string;
    mandatory: boolean;
    accepted_formats: string[];
  }>;
  fee_structure: {
    domestic_fees: Array<{
      type: string;
      amount: number;
      currency: string;
      description?: string;
    }>;
    international_fees: Array<{
      type: string;
      amount: number;
      currency: string;
      description?: string;
    }>;
  };
  intake_dates: string[];
  application_deadline?: string;
  category: string;
  status: string;
  url?: string;
}

export interface DetectedForm {
  title: string;
  description: string;
  fields: Array<{
    id: string;
    label: string;
    type: string;
    required: boolean;
    options?: Array<{ label: string; value: string }>;
    validation?: any[];
  }>;
  program_association?: string;
  url?: string;
}

export interface InstitutionData {
  name: string;
  description: string;
  website: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  logo_url?: string;
  primary_color?: string;
  founded_year?: number;
  employee_count?: number;
}

export interface ScanResult {
  institution: InstitutionData;
  programs: DetectedProgram[];
  applicationForms: DetectedForm[];
  success: boolean;
  pages_scanned: number;
  total_content_length: number;
  error?: string;
}

export class WebsiteScannerService {
  static async scanWebsite(url: string, comprehensive: boolean = true): Promise<ScanResult> {
    try {
      console.log(`Starting website scan for: ${url}`);
      
      const { data, error } = await supabase.functions.invoke('website-scanner', {
        body: { url, comprehensive },
        headers: {
          'x-request-timeout': '300' // 5 minutes timeout for comprehensive scans
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Website scanning failed: ${error.message || JSON.stringify(error)}`);
      }

      if (!data?.success) {
        console.error('Scan failed with data:', data);
        throw new Error(data?.error || 'Website scanning failed - unknown error');
      }

      console.log(`Successfully scanned ${data.pages_scanned} pages and found ${data.programs.length} programs`);
      
      return data as ScanResult;
    } catch (error) {
      console.error('Website scanning error:', error);
      
      // Extract more meaningful error messages
      let errorMessage = error.message;
      if (errorMessage.includes('FunctionsHttpError') || errorMessage.includes('non-2xx status code')) {
        errorMessage = 'Website scanning service is having issues. Please check your Firecrawl API key configuration or try again later.';
      }
      
      throw new Error(errorMessage);
    }
  }

  static async analyzeContent(content: Array<{
    url: string;
    title: string;
    content: string;
    extracted?: any;
  }>): Promise<{
    institution: InstitutionData;
    programs: DetectedProgram[];
    forms: DetectedForm[];
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-content-analyzer', {
        body: {
          content,
          analysis_type: 'educational_institution',
          extract_programs: true,
          extract_forms: true
        }
      });

      if (error) {
        throw new Error(`Content analysis failed: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Content analysis error:', error);
      throw error;
    }
  }

  static mapDetectedProgramToFormData(program: DetectedProgram): any {
    return {
      name: program.name,
      code: program.code || '',
      description: program.description,
      shortDescription: program.description.substring(0, 200),
      type: program.type === 'degree' ? 'degree' : 
            program.type === 'diploma' ? 'diploma' : 'certificate',
      duration: program.duration,
      campus: program.campus,
      deliveryMethod: program.delivery_method === 'online' ? 'online' :
                     program.delivery_method === 'hybrid' ? 'hybrid' : 'in-person',
      status: program.status === 'active' ? 'active' : 'draft',
      category: program.category,
      tags: [],
      color: '#3B82F6', // Default blue
      entryRequirements: program.entry_requirements.map(req => ({
        type: req.type,
        title: req.title,
        description: req.description,
        mandatory: req.mandatory,
        details: req.description
      })),
      documentRequirements: program.document_requirements.map(doc => ({
        name: doc.name,
        description: doc.description,
        mandatory: doc.mandatory,
        acceptedFormats: doc.accepted_formats,
        maxSize: 10, // 10MB default
        stage: 'application',
        order: 1
      })),
      feeStructure: {
        domesticFees: program.fee_structure.domestic_fees.map(fee => ({
          type: fee.type,
          amount: fee.amount,
          currency: fee.currency,
          required: true,
          description: fee.description
        })),
        internationalFees: program.fee_structure.international_fees.map(fee => ({
          type: fee.type,
          amount: fee.amount,
          currency: fee.currency,
          required: true,
          description: fee.description
        })),
        paymentPlans: [],
        scholarships: []
      },
      intakes: program.intake_dates.map(date => ({
        date: date,
        capacity: 50, // Default capacity
        enrolled: 0,
        status: 'open',
        applicationDeadline: program.application_deadline || date,
        studyMode: 'full-time',
        deliveryMethod: program.delivery_method,
        campusLocation: program.campus[0] || 'Main Campus',
        notifications: []
      })),
      customQuestions: []
    };
  }

  static mapDetectedFormToFormConfig(form: DetectedForm): any {
    return {
      title: form.title,
      description: form.description,
      fields: form.fields.map(field => ({
        id: field.id,
        label: field.label,
        type: this.mapFieldType(field.type),
        required: field.required,
        options: field.options || [],
        validation: field.validation || []
      })),
      sections: [],
      submitButtonText: 'Submit Application',
      multiStep: false,
      showProgress: true,
      theme: 'modern'
    };
  }

  private static mapFieldType(htmlType: string): string {
    const typeMap: Record<string, string> = {
      'text': 'text',
      'email': 'email',
      'tel': 'tel',
      'phone': 'tel',
      'number': 'number',
      'textarea': 'textarea',
      'select': 'select',
      'radio': 'radio',
      'checkbox': 'checkbox',
      'multi-select': 'multi-select',
      'date': 'date',
      'file': 'file',
      'url': 'url',
      'color': 'color'
    };

    return typeMap[htmlType.toLowerCase()] || 'text';
  }
}