import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, FileText, Download, Calendar, TrendingUp, Loader2, Star, Trash2, BarChart3, Table, LineChart, PieChart, AreaChart } from 'lucide-react';
import { ReportService } from '@/services/reportService';
import { useToast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/modern/PageHeader';
import { GlassCard } from '@/components/modern/GlassCard';
import { ModernCard } from '@/components/modern/ModernCard';
import { ReportBuilderSplitView } from './reports/ReportBuilderSplitView';
import { useCustomReports } from '@/hooks/useCustomReports';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const VIZ_ICONS: Record<string, React.ElementType> = {
  table: Table,
  bar: BarChart3,
  line: LineChart,
  pie: PieChart,
  area: AreaChart,
};

export function ReportsManagement() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const { toast } = useToast();
  const { reports, isLoading, deleteReport, toggleFavorite } = useCustomReports();

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

  return (
    <div className="p-4 sm:p-6 md:p-9 space-y-6 md:space-y-8">
      <PageHeader
        title="Reports Management"
        subtitle="Generate and manage comprehensive reports for data-driven insights"
        action={
          <Button onClick={() => setIsWizardOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Custom Report
          </Button>
        }
      />

      <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
        <GlassCard hover>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
            <p className="text-xs text-muted-foreground">Custom reports</p>
          </CardContent>
        </GlassCard>
        <GlassCard hover>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorites</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.filter(r => r.is_favorite).length}</div>
            <p className="text-xs text-muted-foreground">Starred reports</p>
          </CardContent>
        </GlassCard>
        <GlassCard hover>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Sources</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10</div>
            <p className="text-xs text-muted-foreground">Available sources</p>
          </CardContent>
        </GlassCard>
        <GlassCard hover>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chart Types</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Visualizations</p>
          </CardContent>
        </GlassCard>
      </div>

      <Tabs defaultValue="my-reports" className="space-y-6">
        <TabsList>
          <TabsTrigger value="my-reports">My Reports</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Reports</TabsTrigger>
          <TabsTrigger value="quick">Quick Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="my-reports" className="space-y-4">
          {isLoading ? (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-48 rounded-xl" />
              ))}
            </div>
          ) : reports.length === 0 ? (
            <ModernCard className="p-8 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">No custom reports yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first custom report to analyze your data with flexible filtering and visualizations
              </p>
              <Button onClick={() => setIsWizardOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Report
              </Button>
            </ModernCard>
          ) : (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {reports.map((report) => {
                const VizIcon = VIZ_ICONS[report.visualizationType] || Table;
                return (
                  <ModernCard key={report.id} className="group">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <VizIcon className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-base">{report.name}</CardTitle>
                            <Badge variant="secondary" className="mt-1 text-xs capitalize">
                              {report.dataSource.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            'h-8 w-8',
                            report.is_favorite && 'text-yellow-500'
                          )}
                          onClick={() => toggleFavorite.mutate({ id: report.id, isFavorite: !report.is_favorite })}
                        >
                          <Star className={cn('h-4 w-4', report.is_favorite && 'fill-current')} />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {report.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {report.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{report.selectedFields.length} fields</span>
                        <span>{report.filters.length} filters</span>
                        <span className="capitalize">{report.visualizationType}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Updated {format(new Date(report.updated_at), 'MMM d, yyyy')}
                      </p>
                      <div className="flex gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="outline" size="sm" className="flex-1">
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => deleteReport.mutate(report.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </ModernCard>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {/* PTIRU Reports */}
            <ModernCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  PTIRU Data Witness
                </CardTitle>
                <CardDescription>
                  One-click reports for PTIRU compliance and data reporting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => handleDownloadReport('PTIRU Student Data Report', ReportService.generatePTIRUStudentReport)}
                  disabled={isGenerating === 'PTIRU Student Data Report'}
                >
                  {isGenerating === 'PTIRU Student Data Report' ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Student Data Report
                  <span className="ml-auto text-xs text-muted-foreground">CSV</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleDownloadReport('PTIRU Program Application Report', ReportService.generatePTIRUProgramReport)}
                  disabled={isGenerating === 'PTIRU Program Application Report'}
                >
                  {isGenerating === 'PTIRU Program Application Report' ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Program Application Report
                  <span className="ml-auto text-xs text-muted-foreground">PDF</span>
                </Button>
              </CardContent>
            </ModernCard>

            {/* DQAB Reports */}
            <ModernCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-secondary" />
                  DQAB Reporting
                </CardTitle>
                <CardDescription>
                  Institutional reporting for DQAB compliance requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleDownloadReport('DQAB Institutional Report', ReportService.generateDQABInstitutionalReport)}
                  disabled={isGenerating === 'DQAB Institutional Report'}
                >
                  {isGenerating === 'DQAB Institutional Report' ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Institutional Report
                  <span className="ml-auto text-xs text-muted-foreground">PDF</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleDownloadReport('DQAB Compliance Summary', ReportService.generateDQABComplianceReport)}
                  disabled={isGenerating === 'DQAB Compliance Summary'}
                >
                  {isGenerating === 'DQAB Compliance Summary' ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Compliance Summary
                  <span className="ml-auto text-xs text-muted-foreground">Excel</span>
                </Button>
              </CardContent>
            </ModernCard>
          </div>
        </TabsContent>

        <TabsContent value="quick" className="space-y-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <ModernCard className="cursor-pointer hover:border-primary/50 transition-colors">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="font-medium">Lead Conversion</h4>
                <p className="text-xs text-muted-foreground mt-1">Conversion funnel analysis</p>
              </CardContent>
            </ModernCard>
            <ModernCard className="cursor-pointer hover:border-primary/50 transition-colors">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3">
                  <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="font-medium">Enrollment Report</h4>
                <p className="text-xs text-muted-foreground mt-1">Student enrollment trends</p>
              </CardContent>
            </ModernCard>
            <ModernCard className="cursor-pointer hover:border-primary/50 transition-colors">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h4 className="font-medium">Financial Summary</h4>
                <p className="text-xs text-muted-foreground mt-1">Revenue & payments</p>
              </CardContent>
            </ModernCard>
            <ModernCard className="cursor-pointer hover:border-primary/50 transition-colors">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mx-auto mb-3">
                  <Calendar className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <h4 className="font-medium">Program Performance</h4>
                <p className="text-xs text-muted-foreground mt-1">Program analytics</p>
              </CardContent>
            </ModernCard>
          </div>
        </TabsContent>
      </Tabs>

      <ReportBuilderSplitView open={isWizardOpen} onOpenChange={setIsWizardOpen} />
    </div>
  );
}
