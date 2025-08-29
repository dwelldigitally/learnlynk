import { supabase } from '@/integrations/supabase/client';

export interface ScanRequest {
  url: string;
  comprehensive?: boolean;
  specificUrls?: string[];
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
  urls_requested?: number;
  urls_successfully_scraped?: number;
}

export class WebsiteScannerService {
  static async scanWebsite(url: string, comprehensive: boolean = true): Promise<ScanResult> {
    try {
      console.log(`Starting website scan for: ${url}`);
      console.log('Attempting to call website-scanner edge function...');
      
      // First try a health check with timeout
      try {
        const healthPromise = supabase.functions.invoke('website-scanner', {
          body: { action: 'health' }
        });
        
        const healthTimeout = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Health check timeout')), 10000)
        );
        
        const healthCheck = await Promise.race([healthPromise, healthTimeout]);
        console.log('Health check response:', healthCheck);
      } catch (healthError) {
        console.warn('Health check failed:', healthError);
        // Continue anyway, the function might still work
      }
      
      // Main scan request with timeout and retry logic
      let lastError: any;
      const maxRetries = 2;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`Scan attempt ${attempt}/${maxRetries}`);
          
          const scanPromise = supabase.functions.invoke('website-scanner', {
            body: { url, comprehensive }
          });
          
          // 5 minute timeout for comprehensive scans, 2 minutes for basic scans
          const timeoutMs = comprehensive ? 5 * 60 * 1000 : 2 * 60 * 1000;
          const timeoutPromise = new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
          );
          
          const result = await Promise.race([scanPromise, timeoutPromise]);
          const { data, error } = result;

          console.log('Function call completed. Error:', error, 'Data:', data);

          if (error) {
            console.error('Supabase function error details:', {
              message: error.message,
              stack: error.stack,
              context: error.context,
              details: error.details
            });
            
            // Don't retry certain types of errors
            if (error.message?.includes('rate limit') || error.message?.includes('429')) {
              throw new Error('Firecrawl API rate limit reached. Please wait a few minutes and try again.');
            }
            
            lastError = error;
            continue; // Try again
          }

          if (!data?.success) {
            console.error('Scan failed with data:', data);
            const errorMessage = data?.error || 'Website scanning failed - unknown error';
            
            // Don't retry if it's a configuration error
            if (errorMessage.includes('API key') || errorMessage.includes('configuration')) {
              throw new Error(errorMessage);
            }
            
            lastError = new Error(errorMessage);
            continue; // Try again
          }

          console.log(`Successfully scanned ${data.pages_scanned} pages and found ${data.programs.length} programs`);
          return data as ScanResult;
          
        } catch (error: any) {
          lastError = error;
          
          if (error.message === 'Request timeout') {
            console.log(`Attempt ${attempt} timed out`);
            if (attempt < maxRetries) {
              console.log('Retrying with shorter timeout...');
              comprehensive = false; // Switch to non-comprehensive scan for retry
              continue;
            }
          }
          
          // Don't retry fetch errors on last attempt
          if (attempt === maxRetries) {
            break;
          }
          
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
      
      // If we get here, all attempts failed
      if (lastError?.message?.includes('Failed to fetch') || lastError?.message?.includes('Failed to send a request') || lastError?.message === 'Request timeout') {
        throw new Error('The website scanning request timed out. This usually happens with large websites. Please try with a smaller website or try again later.');
      }
      
      throw lastError || new Error('Website scanning failed after multiple attempts');
      
    } catch (error) {
      console.error('Website scanning error:', error);
      throw error;
    }
  }

  static async scanSpecificPages(urls: string[]): Promise<ScanResult> {
    try {
      console.log(`Starting selective scan for ${urls.length} specific URLs`);
      
      const { data, error } = await supabase.functions.invoke('website-scanner', {
        body: { specificUrls: urls }
      });

      if (error) {
        console.error('Selective scan error:', error);
        throw new Error(`Selective scan failed: ${error.message}`);
      }

      if (!data?.success) {
        const errorMessage = data?.error || 'Selective scanning failed';
        throw new Error(errorMessage);
      }

      console.log(`Successfully scanned ${data.pages_scanned} pages and found ${data.programs.length} programs`);
      return data as ScanResult;
      
    } catch (error) {
      console.error('Selective scan error:', error);
      throw error;
    }
  }

  static async discoverSiteStructure(url: string): Promise<{
    categories: Array<{
      id: string;
      label: string;
      description: string;
      pages: Array<{
        url: string;
        title: string;
        description: string;
        confidence: number;
      }>;
    }>;
  }> {
    try {
      console.log('Discovering site structure using real web scraping for:', url);
      
      const { data, error } = await supabase.functions.invoke('website-scanner', {
        body: { action: 'discover', url }
      });

      if (error) {
        console.error('Discovery error:', error);
        throw new Error(`Page discovery failed: ${error.message}`);
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Page discovery failed');
      }

      console.log('Discovered categories:', data.categories);
      return { categories: data.categories };
      
    } catch (error) {
      console.error('Site structure discovery error:', error);
      
      // Fallback to pattern-based discovery
      console.log('Using fallback pattern-based discovery');
      return await this.fallbackDiscovery(url);
    }
  }

  private static async fallbackDiscovery(url: string): Promise<{
    categories: Array<{
      id: string;
      label: string;
      description: string;
      pages: Array<{
        url: string;
        title: string;
        description: string;
        confidence: number;
      }>;
    }>;
  }> {
    const baseUrl = new URL(url).origin;
    
    // Common patterns for educational institutions
    const commonPaths = [
      // Programs
      { path: '/programs', category: 'programs', title: 'Academic Programs', description: 'Main programs page' },
      { path: '/academics', category: 'programs', title: 'Academics', description: 'Academic information' },
      { path: '/undergraduate', category: 'programs', title: 'Undergraduate Programs', description: 'Bachelor degree programs' },
      { path: '/graduate', category: 'programs', title: 'Graduate Programs', description: 'Master and PhD programs' },
      { path: '/courses', category: 'programs', title: 'Course Catalog', description: 'Individual course listings' },
      { path: '/degrees', category: 'programs', title: 'Degree Programs', description: 'Available degrees' },
      
      // Admissions
      { path: '/admissions', category: 'admissions', title: 'Admissions', description: 'Main admissions page' },
      { path: '/apply', category: 'admissions', title: 'Apply Now', description: 'Application process' },
      { path: '/requirements', category: 'admissions', title: 'Entry Requirements', description: 'Admission requirements' },
      { path: '/application', category: 'admissions', title: 'Application', description: 'How to apply' },
      
      // Fees
      { path: '/tuition', category: 'fees', title: 'Tuition & Fees', description: 'Cost information' },
      { path: '/fees', category: 'fees', title: 'Fees', description: 'Fee structure' },
      { path: '/financial-aid', category: 'fees', title: 'Financial Aid', description: 'Scholarships and aid' },
      { path: '/scholarships', category: 'fees', title: 'Scholarships', description: 'Available scholarships' },
      
      // Deadlines
      { path: '/deadlines', category: 'deadlines', title: 'Application Deadlines', description: 'When to apply' },
      { path: '/calendar', category: 'deadlines', title: 'Academic Calendar', description: 'Important dates' },
      { path: '/dates', category: 'deadlines', title: 'Important Dates', description: 'Key dates and deadlines' },
      
      // General
      { path: '/about', category: 'general', title: 'About Us', description: 'Institution information' },
      { path: '/contact', category: 'general', title: 'Contact', description: 'Contact information' }
    ];

    // Test which pages exist by making quick HEAD requests
    const existingPages = [];
    
    for (const pathInfo of commonPaths) {
      try {
        const testUrl = `${baseUrl}${pathInfo.path}`;
        const response = await fetch(testUrl, { method: 'HEAD' });
        
        if (response.ok) {
          existingPages.push({
            url: testUrl,
            title: pathInfo.title,
            description: pathInfo.description,
            category: pathInfo.category,
            confidence: response.status === 200 ? 65 : 50 // Lower confidence for fallback
          });
        }
      } catch {
        // Ignore errors for non-existent pages
      }
    }

    // Group by category
    const categoryMap = new Map();
    
    existingPages.forEach(page => {
      if (!categoryMap.has(page.category)) {
        categoryMap.set(page.category, []);
      }
      categoryMap.get(page.category).push(page);
    });

    // Create category structure
    const categories = [
      {
        id: 'programs',
        label: 'Academic Programs',
        description: 'Degree programs, courses, and curricula',
        pages: categoryMap.get('programs') || []
      },
      {
        id: 'admissions',
        label: 'Admissions Info',
        description: 'Requirements, processes, and applications',
        pages: categoryMap.get('admissions') || []
      },
      {
        id: 'fees',
        label: 'Fees & Tuition',
        description: 'Tuition costs and fee structures',
        pages: categoryMap.get('fees') || []
      },
      {
        id: 'deadlines',
        label: 'Dates & Deadlines',
        description: 'Application deadlines and intake dates',
        pages: categoryMap.get('deadlines') || []
      },
      {
        id: 'general',
        label: 'General Info',
        description: 'About us, contact, and general information',
        pages: categoryMap.get('general') || []
      }
    ].filter(cat => cat.pages.length > 0); // Only include categories with pages

    return { categories };
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