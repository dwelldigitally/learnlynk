import React from 'react';
import { SavedReport, DATA_SOURCES } from '@/types/reports';
import { useReportData } from '@/hooks/useReportData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, Trash2, Maximize2, RefreshCw, Table, BarChart3, LineChart, PieChart, AreaChart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart as RechartsAreaChart,
  Area,
} from 'recharts';

const VIZ_ICONS: Record<string, React.ElementType> = {
  table: Table,
  bar: BarChart3,
  line: LineChart,
  pie: PieChart,
  area: AreaChart,
};

const CHART_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

interface ReportDashboardWidgetProps {
  report: SavedReport;
  onToggleFavorite: () => void;
  onDelete: () => void;
  onExpand: () => void;
}

export function ReportDashboardWidget({
  report,
  onToggleFavorite,
  onDelete,
  onExpand,
}: ReportDashboardWidgetProps) {
  const { data, isLoading, totalCount, refetch } = useReportData({
    dataSource: report.dataSource,
    selectedFields: report.selectedFields,
    filters: report.filters,
    visualizationType: report.visualizationType,
    chartConfig: report.chartConfig,
    name: report.name,
  });

  const VizIcon = VIZ_ICONS[report.visualizationType] || Table;
  const source = DATA_SOURCES.find(s => s.id === report.dataSource);

  const renderVisualization = () => {
    if (isLoading) {
      return <Skeleton className="w-full h-full" />;
    }

    if (!data || data.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
          No data available
        </div>
      );
    }

    const hasChartData = data[0]?.hasOwnProperty('name') && data[0]?.hasOwnProperty('value');

    switch (report.visualizationType) {
      case 'bar':
        if (!hasChartData) return renderTable();
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.slice(0, 8)}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-45} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 10 }} width={30} />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        if (!hasChartData) return renderTable();
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={data.slice(0, 10)}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} width={30} />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
            </RechartsLineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        if (!hasChartData) return renderTable();
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={data.slice(0, 6)}
                cx="50%"
                cy="50%"
                innerRadius={25}
                outerRadius={50}
                paddingAngle={2}
                dataKey="value"
              >
                {data.slice(0, 6).map((_, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12 }} />
            </RechartsPieChart>
          </ResponsiveContainer>
        );

      case 'area':
        if (!hasChartData) return renderTable();
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsAreaChart data={data.slice(0, 10)}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} width={30} />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="value" fill="hsl(var(--primary) / 0.2)" stroke="hsl(var(--primary))" />
            </RechartsAreaChart>
          </ResponsiveContainer>
        );

      default:
        return renderTable();
    }
  };

  const renderTable = () => {
    if (!data || data.length === 0) return null;
    const fields = report.selectedFields.slice(0, 3);
    return (
      <div className="overflow-hidden text-xs">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              {fields.map(field => (
                <th key={field} className="text-left p-1 font-medium text-muted-foreground truncate">
                  {source?.fields.find(f => f.name === field)?.label || field}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 4).map((row, i) => (
              <tr key={i} className="border-b border-border/50">
                {fields.map(field => (
                  <td key={field} className="p-1 truncate max-w-[80px]">
                    {String(row[field] ?? '-')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <VizIcon className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-sm truncate">{report.name}</CardTitle>
              <Badge variant="secondary" className="text-[10px] capitalize mt-0.5">
                {report.dataSource.replace('_', ' ')}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => refetch()}
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn('h-6 w-6', report.is_favorite && 'text-yellow-500')}
              onClick={onToggleFavorite}
            >
              <Star className={cn('h-3 w-3', report.is_favorite && 'fill-current')} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onExpand}
            >
              <Maximize2 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-destructive hover:text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[140px] mt-2">
          {renderVisualization()}
        </div>
        <div className="flex items-center justify-between mt-3 pt-2 border-t text-[10px] text-muted-foreground">
          <span>{totalCount} records</span>
          <span>Updated: {format(new Date(), 'h:mm a')}</span>
        </div>
      </CardContent>
    </Card>
  );
}
