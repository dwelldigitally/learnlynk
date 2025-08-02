import { useConditionalData } from './useConditionalData';
import { FinancialService } from '@/services/financialService';
import { DemoDataService } from '@/services/demoDataService';

/**
 * Hook to conditionally load financial demo data or show empty state
 */
export function useConditionalFinancials() {
  return useConditionalData(
    ['financials'],
    () => DemoDataService.getDemoFinancialRecords(),
    () => FinancialService.getFinancialRecords()
  );
}