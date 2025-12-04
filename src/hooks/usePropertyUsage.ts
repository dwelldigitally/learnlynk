import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PropertyCategory } from '@/types/systemProperties';

interface UsageCount {
  property_key: string;
  count: number;
}

// Helper to group and count values
function groupAndCount(data: any[], field: string): UsageCount[] {
  if (!data) return [];
  const grouped = data.reduce((acc, item) => {
    const key = item[field] || 'unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(grouped).map(([key, count]) => ({ 
    property_key: key, 
    count: count as number 
  }));
}

export function usePropertyUsage(category: PropertyCategory) {
  const { data: usageCounts, isLoading } = useQuery({
    queryKey: ['property-usage', category],
    queryFn: async () => {
      let counts: UsageCount[] = [];
      
      switch (category) {
        case 'lead_source': {
          const { data } = await supabase
            .from('leads')
            .select('source')
            .not('source', 'is', null);
          counts = groupAndCount(data || [], 'source');
          break;
        }
        
        case 'lead_status': {
          const { data } = await supabase
            .from('leads')
            .select('status')
            .not('status', 'is', null);
          counts = groupAndCount(data || [], 'status');
          break;
        }
        
        case 'lead_priority': {
          const { data } = await supabase
            .from('leads')
            .select('priority')
            .not('priority', 'is', null);
          counts = groupAndCount(data || [], 'priority');
          break;
        }
        
        case 'document_type': {
          const { data } = await supabase
            .from('document_templates')
            .select('type')
            .not('type', 'is', null);
          counts = groupAndCount(data || [], 'type');
          break;
        }
        
        case 'program_level':
        case 'program_category':
        case 'delivery_mode': {
          // Programs table uses 'type' column, map to appropriate field
          const { data } = await supabase
            .from('programs')
            .select('type')
            .not('type', 'is', null);
          counts = groupAndCount(data || [], 'type');
          break;
        }
        
        case 'payment_method':
        case 'fee_type': {
          // Financial records use 'payment_type' column
          const { data } = await supabase
            .from('financial_records')
            .select('payment_type')
            .not('payment_type', 'is', null);
          counts = groupAndCount(data || [], 'payment_type');
          break;
        }
      }
      
      return counts;
    },
    staleTime: 30000,
  });

  const getUsageCount = (propertyKey: string): number => {
    if (!usageCounts) return 0;
    const found = usageCounts.find(u => u.property_key === propertyKey);
    return found?.count || 0;
  };

  return {
    usageCounts: usageCounts || [],
    getUsageCount,
    isLoading,
  };
}
