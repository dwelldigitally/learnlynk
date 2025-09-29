import { useMutation } from '@tanstack/react-query';
import { PracticumReportService } from '@/services/practicumReportService';
import { useToast } from '@/hooks/use-toast';

export interface GenerateBatchReportParams {
  batchId: string;
  format: 'csv' | 'excel';
}

export const usePracticumReports = () => {
  const { toast } = useToast();

  const generateBatchReport = useMutation({
    mutationFn: async ({ batchId, format }: GenerateBatchReportParams) => {
      // Validate batch first
      const validation = await PracticumReportService.validateBatchForReporting(batchId);
      
      if (!validation.isValid) {
        throw new Error('No students found in this batch');
      }

      // Generate the report
      await PracticumReportService.generateBatchStudentReport(batchId, format);
      
      return validation.studentCount;
    },
    onSuccess: (studentCount, { format }) => {
      toast({
        title: "Report Generated Successfully",
        description: `Practicum report for ${studentCount} students has been downloaded as ${format.toUpperCase()} file.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Report Generation Failed",
        description: error.message || "Failed to generate practicum report. Please try again.",
        variant: "destructive",
      });
    },
  });

  const validateBatch = useMutation({
    mutationFn: async (batchId: string) => {
      return await PracticumReportService.validateBatchForReporting(batchId);
    },
    onError: (error: Error) => {
      toast({
        title: "Validation Failed",
        description: error.message || "Failed to validate batch data.",
        variant: "destructive",
      });
    },
  });

  return {
    generateBatchReport,
    validateBatch,
    isGenerating: generateBatchReport.isPending,
    isValidating: validateBatch.isPending,
  };
};