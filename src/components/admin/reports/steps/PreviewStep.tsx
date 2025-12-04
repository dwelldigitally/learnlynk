import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ReportConfig, DATA_SOURCES } from '@/types/reports';
import { ReportPreview } from '../components/ReportPreview';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { useReportData } from '@/hooks/useReportData';

interface PreviewStepProps {
  config: ReportConfig;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
}

export function PreviewStep({ config, onNameChange, onDescriptionChange }: PreviewStepProps) {
  const { data, isLoading, totalCount } = useReportData(config);
  const source = DATA_SOURCES.find(s => s.id === config.dataSource);

  const exportToCSV = () => {
    if (!data.length) return;

    const headers = config.visualizationType === 'table' 
      ? config.selectedFields 
      : ['name', 'value'];
    
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(h => JSON.stringify(row[h] ?? '')).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${config.name || 'report'}.csv`;
    link.click();
  };

  const exportToJSON = () => {
    if (!data.length) return;

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${config.name || 'report'}.json`;
    link.click();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Report details */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Report Details</h3>
          <p className="text-sm text-muted-foreground">
            Give your report a name and preview the results
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Report Name *</Label>
            <Input
              id="name"
              value={config.name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Enter report name..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={config.description || ''}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Describe what this report shows..."
              rows={3}
            />
          </div>
        </div>

        {/* Report summary */}
        <Card className="p-4 space-y-3">
          <h4 className="font-medium">Report Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Data Source</span>
              <span className="font-medium">{source?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fields</span>
              <span className="font-medium">{config.selectedFields.length} selected</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Filters</span>
              <span className="font-medium">{config.filters.length} applied</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Visualization</span>
              <Badge variant="secondary" className="capitalize">
                {config.visualizationType}
              </Badge>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="text-muted-foreground">Total Records</span>
              <span className="font-medium">{totalCount.toLocaleString()}</span>
            </div>
          </div>
        </Card>

        {/* Export options */}
        <Card className="p-4 space-y-3">
          <h4 className="font-medium">Export Options</h4>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={exportToCSV} disabled={!data.length}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Download CSV
            </Button>
            <Button variant="outline" size="sm" onClick={exportToJSON} disabled={!data.length}>
              <FileText className="h-4 w-4 mr-2" />
              Download JSON
            </Button>
          </div>
        </Card>
      </div>

      {/* Live preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Live Preview</h3>
          {isLoading && (
            <Badge variant="secondary">Loading...</Badge>
          )}
        </div>

        <Card className="p-4 min-h-[400px]">
          <ReportPreview config={config} data={data} isLoading={isLoading} />
        </Card>
      </div>
    </div>
  );
}
