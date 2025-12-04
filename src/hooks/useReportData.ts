import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ReportConfig, FilterCondition, DATA_SOURCES } from '@/types/reports';

interface ReportDataResult {
  data: any[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  refetch: () => void;
}

export function useReportData(config: Partial<ReportConfig> | null): ReportDataResult {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchData = useCallback(async () => {
    if (!config?.dataSource || !config?.selectedFields?.length) {
      setData([]);
      setTotalCount(0);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const sourceConfig = DATA_SOURCES.find(s => s.id === config.dataSource);
      if (!sourceConfig) {
        throw new Error('Invalid data source');
      }

      // Build select string
      const selectFields = config.selectedFields.join(', ');
      
      // Start building query
      let query = supabase
        .from(sourceConfig.table as any)
        .select(selectFields, { count: 'exact' });

      // Apply filters
      if (config.filters?.length) {
        for (const filter of config.filters) {
          query = applyFilter(query, filter);
        }
      }

      // Apply ordering if chart config has groupBy
      if (config.chartConfig?.xAxis) {
        query = query.order(config.chartConfig.xAxis, { ascending: true });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      // Limit results
      query = query.limit(1000);

      const { data: result, error: queryError, count } = await query;

      if (queryError) throw queryError;

      // Process data for visualization
      let processedData = result || [];

      // If aggregation is needed for charts
      if (config.visualizationType !== 'table' && config.chartConfig?.groupBy) {
        processedData = aggregateData(
          processedData,
          config.chartConfig.groupBy,
          config.chartConfig.aggregation || 'count',
          config.chartConfig.aggregationField
        );
      }

      setData(processedData);
      setTotalCount(count || processedData.length);
    } catch (err: any) {
      console.error('Report query error:', err);
      setError(err.message || 'Failed to fetch report data');
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [config]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, totalCount, refetch: fetchData };
}

function applyFilter(query: any, filter: FilterCondition): any {
  const { field, operator, value } = filter;

  switch (operator) {
    case 'equals':
      return query.eq(field, value);
    case 'not_equals':
      return query.neq(field, value);
    case 'contains':
      return query.ilike(field, `%${value}%`);
    case 'not_contains':
      return query.not(field, 'ilike', `%${value}%`);
    case 'starts_with':
      return query.ilike(field, `${value}%`);
    case 'ends_with':
      return query.ilike(field, `%${value}`);
    case 'greater_than':
      return query.gt(field, value);
    case 'less_than':
      return query.lt(field, value);
    case 'greater_equal':
      return query.gte(field, value);
    case 'less_equal':
      return query.lte(field, value);
    case 'between':
      if (Array.isArray(value) && value.length === 2) {
        return query.gte(field, value[0]).lte(field, value[1]);
      }
      return query;
    case 'in':
      if (Array.isArray(value)) {
        return query.in(field, value);
      }
      return query;
    case 'is_null':
      return query.is(field, null);
    case 'is_not_null':
      return query.not(field, 'is', null);
    default:
      return query;
  }
}

function aggregateData(
  data: any[],
  groupBy: string,
  aggregation: string,
  aggregationField?: string
): any[] {
  const grouped = data.reduce((acc, item) => {
    const key = item[groupBy] || 'Unknown';
    if (!acc[key]) {
      acc[key] = { [groupBy]: key, items: [] };
    }
    acc[key].items.push(item);
    return acc;
  }, {} as Record<string, { items: any[] }>);

  return Object.entries(grouped).map(([key, group]: [string, any]) => {
    const items = group.items;
    let value = 0;

    switch (aggregation) {
      case 'count':
        value = items.length;
        break;
      case 'sum':
        value = aggregationField 
          ? items.reduce((sum: number, item: any) => sum + (Number(item[aggregationField]) || 0), 0)
          : items.length;
        break;
      case 'avg':
        value = aggregationField && items.length > 0
          ? items.reduce((sum: number, item: any) => sum + (Number(item[aggregationField]) || 0), 0) / items.length
          : 0;
        break;
      case 'min':
        value = aggregationField
          ? Math.min(...items.map((item: any) => Number(item[aggregationField]) || 0))
          : 0;
        break;
      case 'max':
        value = aggregationField
          ? Math.max(...items.map((item: any) => Number(item[aggregationField]) || 0))
          : 0;
        break;
    }

    return {
      name: key,
      value: Math.round(value * 100) / 100,
    };
  });
}
