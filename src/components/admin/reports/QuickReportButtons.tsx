import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2, TrendingUp, FileText, BarChart3, Calendar, Shield, Building, Settings } from 'lucide-react';
import { ComplianceReportService } from '@/services/complianceReportService';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

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
      toast({ title: "Report Generated", description: `${reportType} has been downloaded.` });
    } catch (error) {
      toast({ title: "Error", description: `Failed to generate ${reportType}.`, variant: "destructive" });
    } finally {
      setIsGenerating(null);
    }
  };

  const quickReports = [
    { id: 'lead-conversion', label: 'Lead Conversion', icon: TrendingUp },
    { id: 'enrollment', label: 'Enrollment', icon: FileText },
    { id: 'financial', label: 'Financial Summary', icon: BarChart3 },
    { id: 'program-perf', label: 'Program Performance', icon: Calendar },
  ];

  const complianceReports = [
    { id: 'ptiru-student', label: 'PTIRU Student', icon: Shield, generator: ComplianceReportService.generatePTIRUStudentReport, format: 'CSV' },
    { id: 'ptiru-program', label: 'PTIRU Program', icon: Shield, generator: ComplianceReportService.generatePTIRUProgramReport, format: 'PDF' },
    { id: 'dqab-institutional', label: 'DQAB Institutional', icon: Building, generator: ComplianceReportService.generateDQABInstitutionalReport, format: 'PDF' },
    { id: 'dqab-compliance', label: 'DQAB Compliance', icon: Building, generator: ComplianceReportService.generateDQABComplianceReport, format: 'Excel' },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Quick Reports</h3>
        <div className="flex flex-wrap gap-2">
          {quickReports.map((report) => (
            <Button key={report.id} variant="outline" size="sm" onClick={() => onOpenBuilder(report.id)} className="gap-2">
              <report.icon className="h-4 w-4" />
              {report.label}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-muted-foreground">Compliance Reports</h3>
          <Link to="/admin/reports/compliance">
            <Button variant="ghost" size="sm" className="gap-1 text-xs">
              <Settings className="h-3 w-3" />
              Configure
            </Button>
          </Link>
        </div>
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
              {isGenerating === report.label ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              {report.label}
              <span className="text-xs text-muted-foreground">({report.format})</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
