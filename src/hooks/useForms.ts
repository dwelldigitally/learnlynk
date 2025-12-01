import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FormService, Form, FormInsert } from '@/services/formService';
import { toast } from 'sonner';

export function useForms() {
  return useQuery({
    queryKey: ['forms'],
    queryFn: () => FormService.getForms(),
  });
}

export function useForm(formId: string | null) {
  return useQuery({
    queryKey: ['forms', formId],
    queryFn: async () => {
      if (!formId) return null;
      const forms = await FormService.getForms();
      return forms.find(f => f.id === formId) || null;
    },
    enabled: !!formId,
  });
}

export function useCreateForm() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (formData: FormInsert) => FormService.createForm(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
      toast.success('Form created successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to create form: ' + error.message);
    },
  });
}

export function useUpdateForm() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Form> }) => 
      FormService.updateForm(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
      toast.success('Form updated successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to update form: ' + error.message);
    },
  });
}

export function useDeleteForm() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => FormService.deleteForm(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
      toast.success('Form deleted successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to delete form: ' + error.message);
    },
  });
}

export function useFormSubmissions(formId: string) {
  return useQuery({
    queryKey: ['form-submissions', formId],
    queryFn: () => FormService.getFormSubmissions(formId),
    enabled: !!formId,
  });
}

export function useFormAnalytics() {
  return useQuery({
    queryKey: ['form-analytics'],
    queryFn: () => FormService.getFormAnalytics(),
  });
}
