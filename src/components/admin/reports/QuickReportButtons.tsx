import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2, TrendingUp, FileText, BarChart3, Calendar, Shield, Building } from 'lucide-react';
import { ReportService } from '@/services/reportService';
import { useToast } from '@/hooks/use-toast';

interface QuickReportButtonsProps {
  onOpenBuilder: (preset?: string) => void;
}

export function QuickReportButtons({ onOpenBuilder }: QuickReportButtonsProps) {
  const [isGenerating, setIsGenerating] = React.useState<string | null>(null);
  const { toast } = useToast();

  const handleDownloadReport = async (reportType: string, generator: () => Promise<void>) => {
    setIsGenerating(reportType);
    try {
      await generator();
      toast({
        title: "Report Generated",
        description: `${reportType} has been downloaded successfully.`,
      });
    } catch (error) {
      console.error(`Error generating ${reportType}:`, error);
      toast({
        title: "Error",
        description: `Failed to generate ${reportType}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(null);
    }
  };

  const quickReports = [
    { id: 'lead-conversion', label: 'Lead Conversion', icon: TrendingUp, color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
    { id: 'enrollment', label: 'Enrollment', icon: FileText, color: 'bg-green-500/10 text-green-600 dark:text-green-400' },
    { id: 'financial', label: 'Financial Summary', icon: BarChart3, color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
    { id: 'program-perf', label: 'Program Performance', icon: Calendar, color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' },
  ];

  const complianceReports = [
    { 
      id: 'ptiru-student', 
      label: 'PTIRU Student', 
      icon: Shield, 
      generator: ReportService.generatePTIRUStudentReport,
      format: 'CSV'
    },
    { 
      id: 'ptiru-program', 
      label: 'PTIRU Program', 
      icon: Shield, 
      generator: ReportService.generatePTIRUProgramReport,
      format: 'PDF'
    },
    { 
      id: 'dqab-institutional', 
      label: 'DQAB Institutional', 
      icon: Building, 
      generator: ReportService.generateDQABInstitutionalReport,
      format: 'PDF'
    },
    { 
      id: 'dqab-compliance', 
      label: 'DQAB Compliance', 
      icon: Building, 
      generator: ReportService.generateDQABComplianceReport,
      format: 'Excel'
    },
  ];

  return (
    <div className="space-y-4">
      {/* Quick Reports */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Quick Reports</h3>
        <div className="flex flex-wrap gap-2">
          {quickReports.map((report) => (
            <Button
              key={report.id}
              variant="outline"
              size="sm"
              onClick={() => onOpenBuilder(report.id)}
              className="gap-2"
            >
              <report.icon className="h-4 w-4" />
              {report.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Compliance Reports */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Compliance Reports</h3>
        <div className="flex flex-wrap gap-2">
          {complianceReports.map((report) => (
            <Button
              key={report.id}
              variant="outline"
              size="sm"
              onClick={() => handleDownloadReport(report.label, report.generator)}
              disabled={isGenerating === report.label}
              className="gap-2"
            >
              {isGenerating === report.label ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {report.label}
              <span className="text-xs text-muted-foreground">({report.format})</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
