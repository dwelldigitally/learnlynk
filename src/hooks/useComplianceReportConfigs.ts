import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface ComplianceColumn {
  field: string;
  label: string;
  order: number;
  visible: boolean;
  width?: number;
}

export interface ComplianceReportConfig {
  id: string;
  user_id: string;
  report_type: 'ptiru_student' | 'ptiru_program' | 'dqab_institutional' | 'dqab_compliance';
  name: string;
  columns: ComplianceColumn[];
  filters: any[];
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export type ComplianceReportType = ComplianceReportConfig['report_type'];

export const DEFAULT_COLUMNS: Record<ComplianceReportType, ComplianceColumn[]> = {
  ptiru_student: [
    { field: 'institution_id', label: 'Institution ID', order: 0, visible: true },
    { field: 'student_id', label: 'Student ID', order: 1, visible: true },
    { field: 'first_name', label: 'First Name', order: 2, visible: true },
    { field: 'last_name', label: 'Last Name', order: 3, visible: true },
    { field: 'program', label: 'Program', order: 4, visible: true },
    { field: 'location', label: 'Location', order: 5, visible: true },
    { field: 'enrollment_date', label: 'Enrollment Date', order: 6, visible: true },
    { field: 'stage', label: 'Stage', order: 7, visible: true },
    { field: 'progress', label: 'Progress (%)', order: 8, visible: true },
    { field: 'delete_flag', label: 'Delete Flag', order: 9, visible: true },
  ],
  ptiru_program: [
    { field: 'program_name', label: 'Program Name', order: 0, visible: true },
    { field: 'duration', label: 'Duration', order: 1, visible: true },
    { field: 'total_intakes', label: 'Total Intakes', order: 2, visible: true },
    { field: 'status', label: 'Status', order: 3, visible: true },
  ],
  dqab_institutional: [
    { field: 'institution_name', label: 'Institution Name', order: 0, visible: true },
    { field: 'mission', label: 'Mission Statement', order: 1, visible: true },
    { field: 'location', label: 'Location', order: 2, visible: true },
    { field: 'total_programs', label: 'Total Programs', order: 3, visible: true },
  ],
  dqab_compliance: [
    { field: 'compliance_area', label: 'Compliance Area', order: 0, visible: true },
    { field: 'status', label: 'Status', order: 1, visible: true },
    { field: 'last_review', label: 'Last Review', order: 2, visible: true },
    { field: 'next_review', label: 'Next Review', order: 3, visible: true },
  ],
};

export const AVAILABLE_FIELDS: Record<ComplianceReportType, { field: string; label: string }[]> = {
  ptiru_student: [
    { field: 'institution_id', label: 'Institution ID' },
    { field: 'student_id', label: 'Student ID' },
    { field: 'first_name', label: 'First Name' },
    { field: 'last_name', label: 'Last Name' },
    { field: 'email', label: 'Email' },
    { field: 'program', label: 'Program' },
    { field: 'location', label: 'Location' },
    { field: 'enrollment_date', label: 'Enrollment Date' },
    { field: 'stage', label: 'Stage' },
    { field: 'progress', label: 'Progress (%)' },
    { field: 'delete_flag', label: 'Delete Flag' },
  ],
  ptiru_program: [
    { field: 'program_name', label: 'Program Name' },
    { field: 'duration', label: 'Duration' },
    { field: 'total_intakes', label: 'Total Intakes' },
    { field: 'status', label: 'Status' },
  ],
  dqab_institutional: [
    { field: 'institution_name', label: 'Institution Name' },
    { field: 'mission', label: 'Mission Statement' },
    { field: 'location', label: 'Location' },
    { field: 'total_programs', label: 'Total Programs' },
  ],
  dqab_compliance: [
    { field: 'compliance_area', label: 'Compliance Area' },
    { field: 'status', label: 'Status' },
    { field: 'last_review', label: 'Last Review' },
    { field: 'next_review', label: 'Next Review' },
    { field: 'notes', label: 'Notes' },
  ],
};

export function useComplianceReportConfigs(reportType?: ComplianceReportType) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: configs, isLoading } = useQuery({
    queryKey: ['compliance-report-configs', reportType],
    queryFn: async () => {
      let query = supabase
        .from('compliance_report_configs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (reportType) {
        query = query.eq('report_type', reportType);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      return (data || []).map(item => ({
        ...item,
        report_type: item.report_type as ComplianceReportType,
        columns: (Array.isArray(item.columns) ? item.columns : []) as unknown as ComplianceColumn[],
        filters: Array.isArray(item.filters) ? item.filters : [],
        is_default: item.is_default ?? false,
      })) as ComplianceReportConfig[];
    },
    enabled: !!user,
  });

  const createConfig = useMutation({
    mutationFn: async (config: Omit<ComplianceReportConfig, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('compliance_report_configs')
        .insert({
          report_type: config.report_type,
          name: config.name,
          columns: config.columns as any,
          filters: config.filters as any,
          is_default: config.is_default,
          user_id: user?.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compliance-report-configs'] });
      toast({ title: 'Configuration saved' });
    },
    onError: (error: any) => {
      toast({ title: 'Error saving configuration', description: error.message, variant: 'destructive' });
    },
  });

  const updateConfig = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ComplianceReportConfig> & { id: string }) => {
      const updateData: Record<string, any> = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.columns !== undefined) updateData.columns = updates.columns as any;
      if (updates.filters !== undefined) updateData.filters = updates.filters as any;
      if (updates.is_default !== undefined) updateData.is_default = updates.is_default;

      const { data, error } = await supabase
        .from('compliance_report_configs')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compliance-report-configs'] });
      toast({ title: 'Configuration updated' });
    },
    onError: (error: any) => {
      toast({ title: 'Error updating configuration', description: error.message, variant: 'destructive' });
    },
  });

  const deleteConfig = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('compliance_report_configs').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compliance-report-configs'] });
      toast({ title: 'Configuration deleted' });
    },
    onError: (error: any) => {
      toast({ title: 'Error deleting configuration', description: error.message, variant: 'destructive' });
    },
  });

  return { configs: configs || [], isLoading, createConfig, updateConfig, deleteConfig };
}
