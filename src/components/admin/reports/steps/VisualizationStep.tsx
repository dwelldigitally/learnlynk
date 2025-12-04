import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { DATA_SOURCES, DataSource, VisualizationType, ChartConfig, AGGREGATIONS } from '@/types/reports';
import { Table, BarChart3, LineChart, PieChart, AreaChart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VisualizationStepProps {
  dataSource: DataSource;
  selectedFields: string[];
  visualizationType: VisualizationType;
  chartConfig: ChartConfig;
  onVisualizationChange: (type: VisualizationType) => void;
  onChartConfigChange: (config: Partial<ChartConfig>) => void;
}

const VISUALIZATION_TYPES: { id: VisualizationType; name: string; icon: React.ElementType; description: string }[] = [
  { id: 'table', name: 'Table', icon: Table, description: 'Raw data in rows and columns' },
  { id: 'bar', name: 'Bar Chart', icon: BarChart3, description: 'Compare categories' },
  { id: 'line', name: 'Line Chart', icon: LineChart, description: 'Show trends over time' },
  { id: 'pie', name: 'Pie Chart', icon: PieChart, description: 'Show proportions' },
  { id: 'area', name: 'Area Chart', icon: AreaChart, description: 'Cumulative trends' },
];

export function VisualizationStep({
  dataSource,
  selectedFields,
  visualizationType,
  chartConfig,
  onVisualizationChange,
  onChartConfigChange,
}: VisualizationStepProps) {
  const source = DATA_SOURCES.find(s => s.id === dataSource);
  const fields = source?.fields.filter(f => selectedFields.includes(f.name)) || [];
  
  const dimensionFields = fields.filter(f => f.category === 'dimension' || f.category === 'date');
  const measureFields = fields.filter(f => f.category === 'measure');

  const showChartConfig = visualizationType !== 'table';

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Choose Visualization</h3>
        <p className="text-sm text-muted-foreground">
          Select how you want to display your data
        </p>
      </div>

      {/* Visualization type selector */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {VISUALIZATION_TYPES.map((viz) => {
          const Icon = viz.icon;
          const isSelected = visualizationType === viz.id;

          return (
            <Card
              key={viz.id}
              className={cn(
                'p-4 cursor-pointer transition-all hover:shadow-md hover:border-primary/50',
                isSelected && 'ring-2 ring-primary border-primary bg-primary/5'
              )}
              onClick={() => onVisualizationChange(viz.id)}
            >
              <div className="flex flex-col items-center text-center gap-2">
                <div
                  className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">{viz.name}</h4>
                  <p className="text-xs text-muted-foreground">{viz.description}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Chart configuration */}
      {showChartConfig && (
        <Card className="p-4 space-y-4">
          <h4 className="font-medium">Chart Configuration</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Group By / X-Axis */}
            <div className="space-y-2">
              <Label>Group By (X-Axis)</Label>
              <Select
                value={chartConfig.groupBy || ''}
                onValueChange={(value) => onChartConfigChange({ groupBy: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select field to group by" />
                </SelectTrigger>
                <SelectContent>
                  {dimensionFields.map(field => (
                    <SelectItem key={field.name} value={field.name}>
                      {field.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Aggregation */}
            <div className="space-y-2">
              <Label>Aggregation</Label>
              <Select
                value={chartConfig.aggregation || 'count'}
                onValueChange={(value) => onChartConfigChange({ aggregation: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AGGREGATIONS.map(agg => (
                    <SelectItem key={agg.value} value={agg.value}>
                      {agg.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Aggregation Field (for sum, avg, etc.) */}
            {chartConfig.aggregation && chartConfig.aggregation !== 'count' && measureFields.length > 0 && (
              <div className="space-y-2">
                <Label>Aggregation Field</Label>
                <Select
                  value={chartConfig.aggregationField || ''}
                  onValueChange={(value) => onChartConfigChange({ aggregationField: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select numeric field" />
                  </SelectTrigger>
                  <SelectContent>
                    {measureFields.map(field => (
                      <SelectItem key={field.name} value={field.name}>
                        {field.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Chart options */}
          <div className="flex flex-wrap gap-6 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Switch
                id="showLegend"
                checked={chartConfig.showLegend ?? true}
                onCheckedChange={(checked) => onChartConfigChange({ showLegend: checked })}
              />
              <Label htmlFor="showLegend">Show Legend</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="showGrid"
                checked={chartConfig.showGrid ?? true}
                onCheckedChange={(checked) => onChartConfigChange({ showGrid: checked })}
              />
              <Label htmlFor="showGrid">Show Grid</Label>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
