import { useConditionalData } from './useConditionalData';
import { DocumentService } from '@/services/documentService';
import { DemoDataService } from '@/services/demoDataService';

/**
 * Hook to conditionally load document demo data or show empty state
 */
export function useConditionalDocuments() {
  return useConditionalData(
    ['documents'],
    () => DemoDataService.getDemoDocuments(),
    () => DocumentService.getDocuments()
  );
}