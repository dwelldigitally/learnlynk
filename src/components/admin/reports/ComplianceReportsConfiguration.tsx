import React, { useState } from 'react';
import { PageHeader } from '@/components/modern/PageHeader';
import { ModernCard } from '@/components/modern/ModernCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Shield, 
  Building, 
  Users, 
  FileText, 
  Settings, 
  Plus,
  Download,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  useComplianceReportConfigs, 
  ComplianceReportType, 
  DEFAULT_COLUMNS 
} from '@/hooks/useComplianceReportConfigs';
import { ComplianceReportEditor } from './ComplianceReportEditor';
import { ComplianceReportService } from '@/services/complianceReportService';
import { useToast } from '@/hooks/use-toast';

const REPORT_TYPES: { 
  id: ComplianceReportType; 
  label: string; 
  description: string; 
  icon: React.ElementType;
  format: string;
}[] = [
  { 
    id: 'ptiru_student', 
    label: 'PTIRU Student Data', 
    description: 'Student enrollment and progress data for PTIRU reporting',
    icon: Users,
    format: 'CSV'
  },
  { 
    id: 'ptiru_program', 
    label: 'PTIRU Program', 
    description: 'Program and intake information for PTIRU compliance',
    icon: FileText,
    format: 'PDF'
  },
  { 
    id: 'dqab_institutional', 
    label: 'DQAB Institutional', 
    description: 'Institutional information and credentials for DQAB',
    icon: Building,
    format: 'PDF'
  },
  { 
    id: 'dqab_compliance', 
    label: 'DQAB Compliance', 
    description: 'Compliance status and review schedules for DQAB',
    icon: Shield,
    format: 'Excel'
  },
];

export function ComplianceReportsConfiguration() {
  const [activeTab, setActiveTab] = useState<ComplianceReportType>('ptiru_student');
  const [editingConfig, setEditingConfig] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const { configs, isLoading, createConfig, deleteConfig } = useComplianceReportConfigs(activeTab);
  const { toast } = useToast();

  const handleCreateDefault = async () => {
    setIsCreating(true);
    try {
      await createConfig.mutateAsync({
        report_type: activeTab,
        name: `Default ${REPORT_TYPES.find(r => r.id === activeTab)?.label} Configuration`,
        columns: DEFAULT_COLUMNS[activeTab],
        filters: [],
        is_default: true,
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleGenerateReport = async (reportType: ComplianceReportType) => {
    setIsGenerating(reportType);
    try {
      switch (reportType) {
        case 'ptiru_student':
          await ComplianceReportService.generatePTIRUStudentReport();
          break;
        case 'ptiru_program':
          await ComplianceReportService.generatePTIRUProgramReport();
          break;
        case 'dqab_institutional':
          await ComplianceReportService.generateDQABInstitutionalReport();
          break;
        case 'dqab_compliance':
          await ComplianceReportService.generateDQABComplianceReport();
          break;
      }
      toast({
        title: 'Report Generated',
        description: 'Your compliance report has been downloaded.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate report.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(null);
    }
  };

  const activeReportType = REPORT_TYPES.find(r => r.id === activeTab);

  return (
    <div className="p-4 sm:p-6 md:p-9 space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <Link to="/admin/reports">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Reports
          </Button>
        </Link>
      </div>

      <PageHeader
        title="Compliance Reports Configuration"
        subtitle="Configure columns and filters for regulatory compliance reports"
        action={
          <Button 
            onClick={() => handleGenerateReport(activeTab)}
            disabled={!!isGenerating}
          >
            {isGenerating === activeTab ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Generate {activeReportType?.label}
          </Button>
        }
      />

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ComplianceReportType)}>
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 w-full">
          {REPORT_TYPES.map((type) => (
            <TabsTrigger key={type.id} value={type.id} className="gap-2">
              <type.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{type.label}</span>
              <span className="sm:hidden">{type.label.split(' ')[0]}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {REPORT_TYPES.map((type) => (
          <TabsContent key={type.id} value={type.id} className="mt-6 space-y-6">
            {/* Report Type Info Card */}
            <ModernCard className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <type.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{type.label}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                    <Badge variant="secondary" className="mt-2">
                      Format: {type.format}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={handleCreateDefault}
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  New Configuration
                </Button>
              </div>
            </ModernCard>

            {/* Configurations List */}
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2">
                {[1, 2].map(i => (
                  <ModernCard key={i} className="p-6 animate-pulse">
                    <div className="h-6 bg-muted rounded w-1/2 mb-2" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                  </ModernCard>
                ))}
              </div>
            ) : configs.length === 0 ? (
              <ModernCard className="p-8 text-center">
                <Settings className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium mb-2">No configurations yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create a configuration to customize which columns appear in this report
                </p>
                <Button onClick={handleCreateDefault} disabled={isCreating}>
                  {isCreating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Create Default Configuration
                </Button>
              </ModernCard>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {configs.map((config) => (
                  <Card 
                    key={config.id} 
                    className="p-6 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setEditingConfig(config.id)}
                  >
                    <CardContent className="p-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{config.name}</h4>
                            {config.is_default && (
                              <Badge variant="secondary" className="text-xs">Default</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {config.columns.filter(c => c.visible).length} columns configured
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Editor Dialog */}
      {editingConfig && (
        <ComplianceReportEditor
          configId={editingConfig}
          reportType={activeTab}
          open={!!editingConfig}
          onOpenChange={(open) => !open && setEditingConfig(null)}
        />
      )}
    </div>
  );
}
