import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type CustomFieldStage = 'lead' | 'applicant' | 'student' | 'program';

export type CustomFieldType = 
  | 'text' 
  | 'number' 
  | 'email' 
  | 'phone' 
  | 'date' 
  | 'select' 
  | 'multi_select' 
  | 'checkbox' 
  | 'textarea' 
  | 'url';

export interface CustomField {
  id: string;
  user_id: string;
  stage: CustomFieldStage;
  field_name: string;
  field_label: string;
  field_type: CustomFieldType;
  field_options: any[] | null;
  is_required: boolean;
  is_enabled: boolean;
  order_index: number;
  validation_rules: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface CustomFieldFormData {
  stage: CustomFieldStage;
  field_name: string;
  field_label: string;
  field_type: CustomFieldType;
  field_options?: any[];
  is_required?: boolean;
  is_enabled?: boolean;
  order_index?: number;
  validation_rules?: Record<string, any>;
}

export function useCustomFields(stage?: CustomFieldStage) {
  const queryClient = useQueryClient();

  const { data: fields = [], isLoading, error } = useQuery({
    queryKey: ['custom-fields', stage],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let query = supabase
        .from('custom_fields')
        .select('*')
        .eq('user_id', user.id)
        .order('order_index', { ascending: true });

      if (stage) {
        query = query.eq('stage', stage);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as CustomField[];
    },
  });

  const createField = useMutation({
    mutationFn: async (formData: CustomFieldFormData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get max order_index for this stage
      const { data: existingFields } = await supabase
        .from('custom_fields')
        .select('order_index')
        .eq('user_id', user.id)
        .eq('stage', formData.stage)
        .order('order_index', { ascending: false })
        .limit(1);

      const maxOrder = existingFields?.[0]?.order_index ?? -1;

      const { data, error } = await supabase
        .from('custom_fields')
        .insert({
          user_id: user.id,
          ...formData,
          order_index: formData.order_index ?? maxOrder + 1,
          is_required: formData.is_required ?? false,
          is_enabled: formData.is_enabled ?? true,
        })
        .select()
        .single();

      if (error) throw error;
      return data as CustomField;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-fields'] });
      toast.success('Custom field created successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to create custom field: ' + error.message);
    },
  });

  const updateField = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CustomFieldFormData> }) => {
      const { data: result, error } = await supabase
        .from('custom_fields')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result as CustomField;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-fields'] });
      toast.success('Custom field updated successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to update custom field: ' + error.message);
    },
  });

  const deleteField = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('custom_fields')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-fields'] });
      toast.success('Custom field deleted successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to delete custom field: ' + error.message);
    },
  });

  const reorderFields = useMutation({
    mutationFn: async (reorderedFields: { id: string; order_index: number }[]) => {
      const updates = reorderedFields.map(({ id, order_index }) =>
        supabase
          .from('custom_fields')
          .update({ order_index })
          .eq('id', id)
      );

      await Promise.all(updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-fields'] });
      toast.success('Fields reordered successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to reorder fields: ' + error.message);
    },
  });

  const toggleEnabled = useMutation({
    mutationFn: async ({ id, is_enabled }: { id: string; is_enabled: boolean }) => {
      const { error } = await supabase
        .from('custom_fields')
        .update({ is_enabled })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-fields'] });
    },
    onError: (error: any) => {
      toast.error('Failed to toggle field: ' + error.message);
    },
  });

  return {
    fields,
    isLoading,
    error,
    createField,
    updateField,
    deleteField,
    reorderFields,
    toggleEnabled,
  };
}
