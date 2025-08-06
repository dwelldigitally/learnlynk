import { supabase } from '@/integrations/supabase/client';

export interface Form {
  id: string;
  name: string;
  description: string | null;
  config: any;
  status: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface FormSubmission {
  id: string;
  form_id: string;
  submission_data: any;
  submitted_at: string;
  ip_address?: string | null;
  user_agent?: string | null;
}

export type FormInsert = Omit<Form, 'id' | 'created_at' | 'updated_at' | 'user_id'>;

export class FormService {
  static async getForms(): Promise<Form[]> {
    const { data, error } = await supabase
      .from('forms')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async createForm(formData: FormInsert): Promise<Form> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('forms')
      .insert({
        ...formData,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateForm(id: string, updates: Partial<Form>): Promise<Form> {
    const { data, error } = await supabase
      .from('forms')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteForm(id: string): Promise<void> {
    const { error } = await supabase
      .from('forms')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async getFormSubmissions(formId: string): Promise<FormSubmission[]> {
    const { data, error } = await supabase
      .from('form_submissions')
      .select('*')
      .eq('form_id', formId)
      .order('submitted_at', { ascending: false });

    if (error) throw error;
    return (data || []) as FormSubmission[];
  }

  static async createFormSubmission(formId: string, submissionData: any): Promise<FormSubmission> {
    const { data, error } = await supabase
      .from('form_submissions')
      .insert({
        form_id: formId,
        submission_data: submissionData,
      })
      .select()
      .single();

    if (error) throw error;
    return data as FormSubmission;
  }

  static async getFormAnalytics() {
    const forms = await this.getForms();
    
    const { data: submissions } = await supabase
      .from('form_submissions')
      .select('form_id');

    const totalSubmissions = submissions?.length || 0;
    
    return {
      totalForms: forms.length,
      publishedForms: forms.filter(f => f.status === 'published').length,
      totalSubmissions,
    };
  }
}