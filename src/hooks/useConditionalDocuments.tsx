import { useConditionalData } from './useConditionalData';
import { documentService } from '@/services/documentService';
import { DemoDataService } from '@/services/demoDataService';

/**
 * Hook to conditionally load document demo data or show empty state
 */
export function useConditionalDocuments() {
  // Temporarily disabled - use documentService directly instead
  return {
    data: [],
    isLoading: false,
    error: null,
    showEmptyState: true,
    hasDemoAccess: false,
    hasRealData: false
  };
}