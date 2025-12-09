import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, FileText, RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/modern/PageHeader';
import { ModernCard } from '@/components/modern/ModernCard';
import { ReportBuilderSplitView } from './reports/ReportBuilderSplitView';
import { ReportDashboardWidget } from './reports/ReportDashboardWidget';
import { QuickReportButtons } from './reports/QuickReportButtons';
import { useCustomReports } from '@/hooks/useCustomReports';
import { Skeleton } from '@/components/ui/skeleton';

export function ReportsManagement() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { reports, isLoading, deleteReport, toggleFavorite } = useCustomReports();

  const handleRefreshAll = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleOpenBuilder = (preset?: string) => {
    // Could pass preset to pre-configure the builder
    setIsWizardOpen(true);
  };

  return (
    <div className="p-4 sm:p-6 md:p-9 space-y-6 md:space-y-8">
      <PageHeader
        title="Reports Dashboard"
        subtitle="Your saved reports with live data - auto-updates on every page load"
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleRefreshAll}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh All
            </Button>
            <Button onClick={() => setIsWizardOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Report
            </Button>
          </div>
        }
      />

      {/* Quick Reports & Compliance Buttons */}
      <ModernCard className="p-4 sm:p-6">
        <QuickReportButtons onOpenBuilder={handleOpenBuilder} />
      </ModernCard>

      {/* Reports Dashboard Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4">My Reports</h2>
        
        {isLoading ? (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        ) : reports.length === 0 ? (
          <ModernCard className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No reports yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first report to see live data visualizations on your dashboard
            </p>
            <Button onClick={() => setIsWizardOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Report
            </Button>
          </ModernCard>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3" key={refreshKey}>
            {reports.map((report) => (
              <ReportDashboardWidget
                key={report.id}
                report={report}
                onToggleFavorite={() => toggleFavorite.mutate({ id: report.id, isFavorite: !report.is_favorite })}
                onDelete={() => deleteReport.mutate(report.id)}
                onExpand={() => {
                  // Could open a full-screen modal view
                  console.log('Expand report:', report.id);
                }}
              />
            ))}
          </div>
        )}
      </div>

      <ReportBuilderSplitView open={isWizardOpen} onOpenChange={setIsWizardOpen} />
    </div>
  );
}
