import { useConditionalData } from './useConditionalData';
import { FinancialService } from '@/services/financialService';

/**
 * Hook to load financial records from database
 */
export function useConditionalFinancials() {
  return useConditionalData(
    ['financials'],
    () => [],
    () => FinancialService.getFinancialRecords()
  );
}
