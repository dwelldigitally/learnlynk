import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SystemProperty, PropertyCategory, PropertyFormData } from '@/types/systemProperties';
import { toast } from 'sonner';

export function useSystemProperties(category?: PropertyCategory) {
  const queryClient = useQueryClient();

  const { data: properties = [], isLoading, error } = useQuery({
    queryKey: ['system-properties', category],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let query = supabase
        .from('system_properties' as any)
        .select('*')
        .eq('user_id', user.id)
        .order('order_index', { ascending: true });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as unknown as SystemProperty[];
    },
  });

  const createProperty = useMutation({
    mutationFn: async ({ category, data }: { category: PropertyCategory; data: PropertyFormData }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: result, error } = await supabase
        .from('system_properties' as any)
        .insert({
          user_id: user.id,
          category,
          ...data,
        })
        .select()
        .single();

      if (error) throw error;
      return result as unknown as SystemProperty;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-properties'] });
      toast.success('Property created successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to create property: ' + error.message);
    },
  });

  const updateProperty = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<PropertyFormData> }) => {
      const { data: result, error } = await supabase
        .from('system_properties' as any)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result as unknown as SystemProperty;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-properties'] });
      toast.success('Property updated successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to update property: ' + error.message);
    },
  });

  const deleteProperty = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('system_properties' as any)
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-properties'] });
      toast.success('Property deleted successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to delete property: ' + error.message);
    },
  });

  const reorderProperties = useMutation({
    mutationFn: async (reorderedProperties: { id: string; order_index: number }[]) => {
      const updates = reorderedProperties.map(({ id, order_index }) =>
        supabase
          .from('system_properties' as any)
          .update({ order_index })
          .eq('id', id)
      );

      await Promise.all(updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-properties'] });
      toast.success('Properties reordered successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to reorder properties: ' + error.message);
    },
  });

  return {
    properties,
    isLoading,
    error,
    createProperty,
    updateProperty,
    deleteProperty,
    reorderProperties,
  };
}
