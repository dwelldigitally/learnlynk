import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ReportConfig, FilterCondition, DATA_SOURCES, RelativeDateValue } from '@/types/reports';
import { startOfDay, subDays, startOfWeek, startOfMonth, startOfQuarter, startOfYear, endOfDay, endOfWeek, endOfMonth, endOfQuarter, endOfYear, subWeeks, subMonths, subQuarters, subYears } from 'date-fns';

// Helper to resolve relative date values to absolute dates
function resolveRelativeDate(value: RelativeDateValue): { start: Date; end: Date } {
  const now = new Date();
  
  switch (value) {
    case 'today':
      return { start: startOfDay(now), end: endOfDay(now) };
    case 'yesterday':
      return { start: startOfDay(subDays(now, 1)), end: endOfDay(subDays(now, 1)) };
    case 'last_7_days':
      return { start: startOfDay(subDays(now, 7)), end: endOfDay(now) };
    case 'last_14_days':
      return { start: startOfDay(subDays(now, 14)), end: endOfDay(now) };
    case 'last_30_days':
      return { start: startOfDay(subDays(now, 30)), end: endOfDay(now) };
    case 'last_90_days':
      return { start: startOfDay(subDays(now, 90)), end: endOfDay(now) };
    case 'this_week':
      return { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) };
    case 'last_week':
      return { start: startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 }), end: endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 }) };
    case 'this_month':
      return { start: startOfMonth(now), end: endOfMonth(now) };
    case 'last_month':
      return { start: startOfMonth(subMonths(now, 1)), end: endOfMonth(subMonths(now, 1)) };
    case 'this_quarter':
      return { start: startOfQuarter(now), end: endOfQuarter(now) };
    case 'last_quarter':
      return { start: startOfQuarter(subQuarters(now, 1)), end: endOfQuarter(subQuarters(now, 1)) };
    case 'this_year':
      return { start: startOfYear(now), end: endOfYear(now) };
    case 'last_year':
      return { start: startOfYear(subYears(now, 1)), end: endOfYear(subYears(now, 1)) };
    default:
      return { start: startOfDay(subDays(now, 7)), end: endOfDay(now) };
  }
}

// Check if a value is a relative date
function isRelativeDateValue(value: unknown): value is RelativeDateValue {
  const relativeDates = [
    'today', 'yesterday', 'last_7_days', 'last_14_days', 'last_30_days', 'last_90_days',
    'this_week', 'last_week', 'this_month', 'last_month', 'this_quarter', 'last_quarter',
    'this_year', 'last_year'
  ];
  return typeof value === 'string' && relativeDates.includes(value);
}

// Resolve filters with relative dates to absolute dates
function resolveFilters(filters: FilterCondition[]): FilterCondition[] {
  return filters.map(filter => {
    if (typeof filter.value === 'string' && isRelativeDateValue(filter.value)) {
      const { start, end } = resolveRelativeDate(filter.value);
      return {
        ...filter,
        operator: 'between' as const,
        value: [start.toISOString(), end.toISOString()] as [string, string],
      };
    }
    return filter;
  });
}

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
  
  // Use refs to prevent re-renders from creating new callback references
  const abortControllerRef = useRef<AbortController | null>(null);
  const hasFetchedRef = useRef(false);
  
  // Memoize the config key to prevent unnecessary refetches
  const configKey = useMemo(() => {
    if (!config?.dataSource || !config?.selectedFields?.length) return null;
    return JSON.stringify({
      dataSource: config.dataSource,
      selectedFields: config.selectedFields,
      filters: config.filters,
      visualizationType: config.visualizationType,
      chartConfig: config.chartConfig,
    });
  }, [config?.dataSource, config?.selectedFields, config?.filters, config?.visualizationType, config?.chartConfig]);

  const fetchData = useCallback(async (force = false) => {
    // Don't refetch if already loaded and not forced
    if (!force && hasFetchedRef.current && data.length > 0) {
      return;
    }
    
    if (!config?.dataSource || !config?.selectedFields?.length) {
      setData([]);
      setTotalCount(0);
      return;
    }

    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

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

      // Resolve relative date filters and apply them
      if (config.filters?.length) {
        const resolvedFilters = resolveFilters(config.filters);
        for (const filter of resolvedFilters) {
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

      // If aggregation is needed for charts - auto-select groupBy if not set
      if (config.visualizationType !== 'table') {
        const groupByField = config.chartConfig?.groupBy || 
          sourceConfig.fields.find(f => 
            (f.category === 'dimension' || f.category === 'date') && 
            config.selectedFields?.includes(f.name)
          )?.name;
        
        if (groupByField) {
          processedData = aggregateData(
            processedData,
            groupByField,
            config.chartConfig?.aggregation || 'count',
            config.chartConfig?.aggregationField
          );
        }
      }

      hasFetchedRef.current = true;
      setData(processedData);
      setTotalCount(count || processedData.length);
    } catch (err: any) {
      // Ignore abort errors
      if (err.name === 'AbortError') return;
      
      console.error('Report query error:', err);
      setError(err.message || 'Failed to fetch report data');
      // Keep existing data on error instead of clearing
    } finally {
      setIsLoading(false);
    }
  }, [configKey]);

  useEffect(() => {
    hasFetchedRef.current = false;
    fetchData();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [configKey]);

  const refetch = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  return { data, isLoading, error, totalCount, refetch };
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
