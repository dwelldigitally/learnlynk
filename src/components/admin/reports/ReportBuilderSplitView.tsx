import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { X, Save, Loader2 } from 'lucide-react';
import { ReportConfig, DataSource } from '@/types/reports';
import { ConfigurationPanel } from './components/ConfigurationPanel';
import { LivePreviewPanel } from './components/LivePreviewPanel';
import { useCustomReports } from '@/hooks/useCustomReports';
import { useReportData } from '@/hooks/useReportData';
import { useDebounce } from '@/hooks/useDebounce';

interface ReportBuilderSplitViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editReport?: ReportConfig & { id?: string };
}

export function ReportBuilderSplitView({ open, onOpenChange, editReport }: ReportBuilderSplitViewProps) {
  const { createReport, updateReport } = useCustomReports();

  const [config, setConfig] = useState<ReportConfig>(() => editReport || {
    name: '',
    description: '',
    dataSource: '' as DataSource,
    selectedFields: [],
    filters: [],
    visualizationType: 'table',
    chartConfig: {
      aggregation: 'count',
      showLegend: true,
      showGrid: true,
    },
  });

  // Reset config when dialog opens with new/edit report
  useEffect(() => {
    if (open) {
      setConfig(editReport || {
        name: '',
        description: '',
        dataSource: '' as DataSource,
        selectedFields: [],
        filters: [],
        visualizationType: 'table',
        chartConfig: {
          aggregation: 'count',
          showLegend: true,
          showGrid: true,
        },
      });
    }
  }, [open, editReport]);

  // Debounce config for preview to prevent excessive API calls
  const debouncedConfig = useDebounce(config, 300);

  // Fetch report data for live preview
  const { data, isLoading: isPreviewLoading, totalCount } = useReportData(
    debouncedConfig.dataSource && debouncedConfig.selectedFields.length > 0 
      ? debouncedConfig 
      : null
  );

  const updateConfig = (updates: Partial<ReportConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const handleSave = async () => {
    if (!config.name.trim()) return;
    
    if (editReport?.id) {
      await updateReport.mutateAsync({ id: editReport.id, config });
    } else {
      await createReport.mutateAsync(config);
    }
    onOpenChange(false);
  };

  const canSave = useMemo(() => {
    return config.name.trim() && config.dataSource && config.selectedFields.length > 0;
  }, [config.name, config.dataSource, config.selectedFields.length]);

  const isSaving = createReport.isPending || updateReport.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-[95vw] h-[90vh] max-h-[90vh] p-0 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b">
          <div className="p-4 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <Input
                    placeholder="Untitled Report"
                    value={config.name}
                    onChange={(e) => updateConfig({ name: e.target.value })}
                    className="text-xl font-semibold border-none bg-transparent px-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/50"
                  />
                </div>
                <Textarea
                  placeholder="Add a description..."
                  value={config.description || ''}
                  onChange={(e) => updateConfig({ description: e.target.value })}
                  className="min-h-[40px] max-h-[80px] resize-none border-none bg-transparent px-0 text-sm text-muted-foreground focus-visible:ring-0 placeholder:text-muted-foreground/50"
                  rows={1}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={!canSave || isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {editReport?.id ? 'Update Report' : 'Save Report'}
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onOpenChange(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Split Panel Content */}
        <div className="flex-1 overflow-hidden">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {/* Left Panel - Configuration */}
            <ResizablePanel defaultSize={40} minSize={30} maxSize={50}>
              <ConfigurationPanel
                config={config}
                onConfigChange={updateConfig}
              />
            </ResizablePanel>

            <ResizableHandle withHandle className="bg-border/50 hover:bg-primary/20 transition-colors" />

            {/* Right Panel - Live Preview */}
            <ResizablePanel defaultSize={60} minSize={40}>
              <LivePreviewPanel
                config={config}
                data={data}
                isLoading={isPreviewLoading}
                totalCount={totalCount}
                onVisualizationChange={(type) => updateConfig({ visualizationType: type })}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </DialogContent>
    </Dialog>
  );
}
