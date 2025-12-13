import { useConditionalData } from './useConditionalData';

/**
 * Hook to load documents from database
 * Uses documentService directly in components instead
 */
export function useConditionalDocuments() {
  return {
    data: [],
    isLoading: false,
    error: null,
    showEmptyState: true,
    hasDemoAccess: false,
    hasRealData: false
  };
}
