import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Table, BarChart3, LineChart, PieChart, AreaChart, 
  Download, FileSpreadsheet, FileJson, Database
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReportConfig, VisualizationType, DATA_SOURCES } from '@/types/reports';
import { ReportPreview } from './ReportPreview';

interface LivePreviewPanelProps {
  config: Partial<ReportConfig>;
  data: any[];
  isLoading: boolean;
  totalCount: number;
  onVisualizationChange: (type: VisualizationType) => void;
}

const VISUALIZATION_TYPES: { id: VisualizationType; icon: React.ElementType; label: string }[] = [
  { id: 'table', icon: Table, label: 'Table' },
  { id: 'bar', icon: BarChart3, label: 'Bar' },
  { id: 'line', icon: LineChart, label: 'Line' },
  { id: 'pie', icon: PieChart, label: 'Pie' },
  { id: 'area', icon: AreaChart, label: 'Area' },
];

export function LivePreviewPanel({ 
  config, 
  data, 
  isLoading, 
  totalCount,
  onVisualizationChange 
}: LivePreviewPanelProps) {
  const hasDataSource = !!config.dataSource;
  const hasFields = (config.selectedFields?.length || 0) > 0;
  const canPreview = hasDataSource && hasFields;

  const handleExport = (format: 'csv' | 'json') => {
    if (!data.length) return;

    let content: string;
    let mimeType: string;
    let filename: string;

    if (format === 'csv') {
      const headers = config.selectedFields || [];
      const csvRows = [
        headers.join(','),
        ...data.map(row => headers.map(h => JSON.stringify(row[h] ?? '')).join(','))
      ];
      content = csvRows.join('\n');
      mimeType = 'text/csv';
      filename = `${config.name || 'report'}.csv`;
    } else {
      content = JSON.stringify(data, null, 2);
      mimeType = 'application/json';
      filename = `${config.name || 'report'}.json`;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Panel Header with Visualization Switcher */}
      <div className="flex-shrink-0 p-4 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm">Preview</h3>
            {canPreview && !isLoading && (
              <Badge variant="outline" className="text-xs">
                {totalCount.toLocaleString()} records
              </Badge>
            )}
          </div>

          {/* Visualization Type Switcher */}
          {canPreview && (
            <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
              {VISUALIZATION_TYPES.map((viz) => {
                const Icon = viz.icon;
                const isActive = config.visualizationType === viz.id;
                return (
                  <button
                    key={viz.id}
                    onClick={() => onVisualizationChange(viz.id)}
                    className={cn(
                      'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all',
                      isActive 
                        ? 'bg-background text-foreground shadow-sm' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{viz.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto p-4">
        {!hasDataSource ? (
          <EmptyState 
            icon={Database}
            title="Select a Data Source"
            description="Choose a data source from the configuration panel to start building your report"
          />
        ) : !hasFields ? (
          <EmptyState 
            icon={Table}
            title="Select Fields"
            description="Select at least one field to see a preview of your data"
          />
        ) : isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-[350px] w-full" />
          </div>
        ) : (
          <div className="h-full">
            <ReportPreview 
              config={config} 
              data={data} 
              isLoading={isLoading} 
            />
          </div>
        )}
      </div>

      {/* Export Footer */}
      {canPreview && data.length > 0 && (
        <div className="flex-shrink-0 p-4 border-t bg-muted/30">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Showing {Math.min(data.length, 100)} of {totalCount.toLocaleString()} records
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('csv')}
                className="text-xs"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 mr-1.5" />
                CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('json')}
                className="text-xs"
              >
                <FileJson className="h-3.5 w-3.5 mr-1.5" />
                JSON
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
}) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-8">
      <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-muted-foreground/50" />
      </div>
      <h4 className="font-medium text-lg mb-2">{title}</h4>
      <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
    </div>
  );
}
