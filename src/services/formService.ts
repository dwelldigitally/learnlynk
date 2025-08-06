import { supabase } from '@/integrations/supabase/client';
import type { FormConfig } from '@/types/formBuilder';

export interface Form {
  id: string;
  name: string;
  description: string;
  config: FormConfig;
  status: 'draft' | 'published' | 'archived';
  user_id: string;
  created_at: string;
  updated_at: string;
  submissions_count?: number;
}

export type FormInsert = Omit<Form, 'id' | 'created_at' | 'updated_at' | 'user_id'>;

export class FormService {
  // For now, we'll use localStorage as forms table doesn't exist
  // In production, this would use a proper database table
  
  static async getForms(): Promise<Form[]> {
    try {
      const formsData = localStorage.getItem('forms');
      if (!formsData) return [];
      
      const forms = JSON.parse(formsData);
      return Array.isArray(forms) ? forms : [];
    } catch (error) {
      console.error('Error getting forms:', error);
      return [];
    }
  }

  static async createForm(formData: FormInsert): Promise<Form> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const newForm: Form = {
      id: crypto.randomUUID(),
      ...formData,
      user_id: user.user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      submissions_count: 0,
    };

    const forms = await this.getForms();
    forms.push(newForm);
    localStorage.setItem('forms', JSON.stringify(forms));

    return newForm;
  }

  static async updateForm(id: string, updates: Partial<Form>): Promise<Form> {
    const forms = await this.getForms();
    const formIndex = forms.findIndex(f => f.id === id);
    
    if (formIndex === -1) {
      throw new Error('Form not found');
    }

    forms[formIndex] = {
      ...forms[formIndex],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    localStorage.setItem('forms', JSON.stringify(forms));
    return forms[formIndex];
  }

  static async deleteForm(id: string): Promise<void> {
    const forms = await this.getForms();
    const filteredForms = forms.filter(f => f.id !== id);
    localStorage.setItem('forms', JSON.stringify(filteredForms));
  }

  static async getFormAnalytics() {
    const forms = await this.getForms();
    
    return {
      totalForms: forms.length,
      publishedForms: forms.filter(f => f.status === 'published').length,
      totalSubmissions: forms.reduce((sum, f) => sum + (f.submissions_count || 0), 0),
    };
  }
}