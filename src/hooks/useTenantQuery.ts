import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTenant } from '@/contexts/TenantContext';
import { supabase } from '@/integrations/supabase/client';

type QueryFilters = Record<string, any>;

interface TenantQueryOptions {
  select?: string;
  filters?: QueryFilters;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
  enabled?: boolean;
}

/**
 * Hook for tenant-scoped SELECT queries
 * Automatically filters by current tenant_id
 */
export function useTenantQuery<T = any>(
  table: string,
  queryKey: string[],
  options?: TenantQueryOptions
) {
  const { tenantId } = useTenant();

  return useQuery({
    queryKey: [table, tenantId, ...queryKey],
    queryFn: async () => {
      if (!tenantId) {
        throw new Error('No tenant selected');
      }

      let query = supabase
        .from(table as any)
        .select(options?.select || '*')
        .eq('tenant_id', tenantId);

      // Apply additional filters
      if (options?.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              query = query.in(key, value);
            } else {
              query = query.eq(key, value);
            }
          }
        });
      }

      // Apply ordering
      if (options?.orderBy) {
        query = query.order(options.orderBy.column, {
          ascending: options.orderBy.ascending ?? false
        });
      }

      // Apply limit
      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data as T[];
    },
    enabled: !!tenantId && (options?.enabled !== false)
  });
}

/**
 * Hook for tenant-scoped single record queries
 */
export function useTenantQuerySingle<T = any>(
  table: string,
  id: string | undefined,
  queryKey: string[],
  options?: Omit<TenantQueryOptions, 'limit'>
) {
  const { tenantId } = useTenant();

  return useQuery({
    queryKey: [table, tenantId, id, ...queryKey],
    queryFn: async () => {
      if (!tenantId || !id) {
        throw new Error('No tenant or ID provided');
      }

      const { data, error } = await supabase
        .from(table as any)
        .select(options?.select || '*')
        .eq('tenant_id', tenantId)
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return data as T;
    },
    enabled: !!tenantId && !!id && (options?.enabled !== false)
  });
}

interface TenantMutationOptions<TData, TVariables> {
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
  invalidateKeys?: string[][];
}

/**
 * Hook for tenant-scoped INSERT mutations
 * Automatically adds tenant_id to inserted records
 */
export function useTenantInsert<T = any>(
  table: string,
  options?: TenantMutationOptions<T, Record<string, any>>
) {
  const { tenantId } = useTenant();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Record<string, any>) => {
      if (!tenantId) {
        throw new Error('No tenant selected');
      }

      const { data: result, error } = await supabase
        .from(table as any)
        .insert({
          ...data,
          tenant_id: tenantId
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return result as T;
    },
    onSuccess: (data, variables) => {
      // Invalidate table queries
      queryClient.invalidateQueries({ queryKey: [table, tenantId] });
      
      // Invalidate additional keys if specified
      options?.invalidateKeys?.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });

      options?.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      options?.onError?.(error as Error, variables);
    }
  });
}

/**
 * Hook for tenant-scoped UPDATE mutations
 * Ensures updates only affect tenant's own records
 */
export function useTenantUpdate<T = any>(
  table: string,
  options?: TenantMutationOptions<T, { id: string; data: Record<string, any> }>
) {
  const { tenantId } = useTenant();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, any> }) => {
      if (!tenantId) {
        throw new Error('No tenant selected');
      }

      // Remove tenant_id from update data to prevent changing it
      const { tenant_id, ...updateData } = data;

      const { data: result, error } = await supabase
        .from(table as any)
        .update(updateData)
        .eq('id', id)
        .eq('tenant_id', tenantId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return result as T;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [table, tenantId] });
      queryClient.invalidateQueries({ queryKey: [table, tenantId, variables.id] });
      
      options?.invalidateKeys?.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });

      options?.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      options?.onError?.(error as Error, variables);
    }
  });
}

/**
 * Hook for tenant-scoped DELETE mutations
 */
export function useTenantDelete(
  table: string,
  options?: TenantMutationOptions<void, string>
) {
  const { tenantId } = useTenant();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!tenantId) {
        throw new Error('No tenant selected');
      }

      const { error } = await supabase
        .from(table as any)
        .delete()
        .eq('id', id)
        .eq('tenant_id', tenantId);

      if (error) {
        throw error;
      }
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [table, tenantId] });
      
      options?.invalidateKeys?.forEach(key => {
        queryClient.invalidateQueries({ queryKey: key });
      });

      options?.onSuccess?.(undefined, id);
    },
    onError: (error, variables) => {
      options?.onError?.(error as Error, variables);
    }
  });
}

/**
 * Utility to get current tenant ID for use in services
 */
export function useCurrentTenantId(): string | null {
  const { tenantId } = useTenant();
  return tenantId;
}
