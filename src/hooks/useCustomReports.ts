import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SavedReport, ReportConfig, FilterCondition, ChartConfig } from '@/types/reports';
import { toast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';

// Helper to convert DB row to SavedReport
function mapDbToSavedReport(row: any): SavedReport {
  return {
    id: row.id,
    user_id: row.user_id,
    name: row.name,
    description: row.description,
    dataSource: row.data_source,
    selectedFields: row.selected_fields as string[],
    filters: row.filters as FilterCondition[],
    visualizationType: row.visualization_type,
    chartConfig: row.chart_config as ChartConfig,
    is_favorite: row.is_favorite,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export function useCustomReports() {
  const queryClient = useQueryClient();

  const { data: reports, isLoading, error } = useQuery({
    queryKey: ['custom-reports'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('custom_reports')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(mapDbToSavedReport);
    },
  });

  const createReport = useMutation({
    mutationFn: async (config: ReportConfig) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('custom_reports')
        .insert({
          user_id: user.id,
          name: config.name,
          description: config.description || null,
          data_source: config.dataSource,
          selected_fields: config.selectedFields as unknown as Json,
          filters: config.filters as unknown as Json,
          visualization_type: config.visualizationType,
          chart_config: config.chartConfig as unknown as Json,
        })
        .select()
        .single();

      if (error) throw error;
      return mapDbToSavedReport(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-reports'] });
      toast({ title: 'Report saved successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Failed to save report', description: error.message, variant: 'destructive' });
    },
  });

  const updateReport = useMutation({
    mutationFn: async ({ id, config }: { id: string; config: Partial<ReportConfig> }) => {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (config.name !== undefined) updateData.name = config.name;
      if (config.description !== undefined) updateData.description = config.description;
      if (config.dataSource !== undefined) updateData.data_source = config.dataSource;
      if (config.selectedFields !== undefined) updateData.selected_fields = config.selectedFields;
      if (config.filters !== undefined) updateData.filters = config.filters;
      if (config.visualizationType !== undefined) updateData.visualization_type = config.visualizationType;
      if (config.chartConfig !== undefined) updateData.chart_config = config.chartConfig;

      const { data, error } = await supabase
        .from('custom_reports')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return mapDbToSavedReport(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-reports'] });
      toast({ title: 'Report updated' });
    },
  });

  const deleteReport = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('custom_reports')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-reports'] });
      toast({ title: 'Report deleted' });
    },
  });

  const toggleFavorite = useMutation({
    mutationFn: async ({ id, isFavorite }: { id: string; isFavorite: boolean }) => {
      const { error } = await supabase
        .from('custom_reports')
        .update({ is_favorite: isFavorite })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-reports'] });
    },
  });

  return {
    reports: reports || [],
    isLoading,
    error,
    createReport,
    updateReport,
    deleteReport,
    toggleFavorite,
  };
}
