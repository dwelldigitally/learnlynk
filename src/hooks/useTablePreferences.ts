import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  sortable: boolean;
  width?: string;
  minWidth?: number;
  maxWidth?: number;
}

export interface TablePreferences {
  columns: ColumnConfig[];
  columnWidths: Record<string, number>;
  sortColumn: string;
  sortOrder: 'asc' | 'desc';
  pageSize: number;
}

const STORAGE_KEY_PREFIX = 'lead-table-preferences';

const DEFAULT_PREFERENCES: TablePreferences = {
  columns: [
    { id: 'name', label: 'Name', visible: true, sortable: true, minWidth: 140, maxWidth: 220 },
    { id: 'email', label: 'Email', visible: true, sortable: true, minWidth: 160, maxWidth: 260 },
    { id: 'phone', label: 'Phone', visible: true, sortable: false, minWidth: 100, maxWidth: 160 },
    { id: 'source', label: 'Source', visible: true, sortable: true, minWidth: 80, maxWidth: 130 },
    { id: 'created_at', label: 'Created', visible: true, sortable: true, minWidth: 100, maxWidth: 160 },
    { id: 'last_activity', label: 'Last Activity', visible: true, sortable: false, minWidth: 100, maxWidth: 160 },
    { id: 'stage', label: 'Stage', visible: true, sortable: true, minWidth: 80, maxWidth: 130 },
    { id: 'lead_score', label: 'Lead Score', visible: true, sortable: true, minWidth: 90, maxWidth: 130 },
    { id: 'priority', label: 'Priority', visible: true, sortable: true, minWidth: 80, maxWidth: 120 },
    { id: 'assigned_to', label: 'Assigned To', visible: true, sortable: false, minWidth: 120, maxWidth: 200 },
    { id: 'suggested_action', label: 'Suggested Action', visible: true, sortable: false, minWidth: 130, maxWidth: 200 },
  ],
  columnWidths: {},
  sortColumn: 'created_at',
  sortOrder: 'desc',
  pageSize: 50,
};

export function useTablePreferences() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<TablePreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const storageKey = user?.id ? `${STORAGE_KEY_PREFIX}-${user.id}` : STORAGE_KEY_PREFIX;

  // Load preferences on mount
  useEffect(() => {
    const loadPreferences = () => {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored) as Partial<TablePreferences>;
          
          // Merge with defaults to handle new columns added to the system
          const mergedColumns = DEFAULT_PREFERENCES.columns.map(defaultCol => {
            const savedCol = parsed.columns?.find(c => c.id === defaultCol.id);
            return savedCol ? { ...defaultCol, ...savedCol } : defaultCol;
          });

          setPreferences({
            ...DEFAULT_PREFERENCES,
            ...parsed,
            columns: mergedColumns,
          });
        }
      } catch (error) {
        console.error('Failed to load table preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [storageKey]);

  // Debounced save function
  const savePreferences = useCallback((newPreferences: Partial<TablePreferences>) => {
    setPreferences(prev => {
      const updated = { ...prev, ...newPreferences };
      
      // Debounce localStorage writes
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = setTimeout(() => {
        try {
          localStorage.setItem(storageKey, JSON.stringify(updated));
        } catch (error) {
          console.error('Failed to save table preferences:', error);
        }
      }, 300);

      return updated;
    });
  }, [storageKey]);

  // Update specific preference values
  const updateColumns = useCallback((columns: ColumnConfig[]) => {
    savePreferences({ columns });
  }, [savePreferences]);

  const updateColumnWidths = useCallback((columnWidths: Record<string, number>) => {
    savePreferences({ columnWidths });
  }, [savePreferences]);

  const updateSort = useCallback((sortColumn: string, sortOrder: 'asc' | 'desc') => {
    savePreferences({ sortColumn, sortOrder });
  }, [savePreferences]);

  const updatePageSize = useCallback((pageSize: number) => {
    savePreferences({ pageSize });
  }, [savePreferences]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    preferences,
    isLoading,
    updateColumns,
    updateColumnWidths,
    updateSort,
    updatePageSize,
  };
}
