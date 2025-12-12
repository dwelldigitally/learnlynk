import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getLeadPropertiesForTableColumns, getLeadPropertyCategories, getLeadPropertiesByCategory } from '@/config/leadProperties';

export interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  sortable: boolean;
  width?: string;
  minWidth?: number;
  maxWidth?: number;
  category?: string;
}

export interface TablePreferences {
  columns: ColumnConfig[];
  columnWidths: Record<string, number>;
  sortColumn: string;
  sortOrder: 'asc' | 'desc';
  pageSize: number;
}

const STORAGE_KEY_PREFIX = 'lead-table-preferences';

// Get all available columns from central definition
const ALL_AVAILABLE_COLUMNS: ColumnConfig[] = getLeadPropertiesForTableColumns();

// Default columns that are visible initially
const DEFAULT_PREFERENCES: TablePreferences = {
  columns: ALL_AVAILABLE_COLUMNS,
  columnWidths: {},
  sortColumn: 'created_at',
  sortOrder: 'desc',
  pageSize: 50,
};

// Get column categories for grouping in UI
export function getColumnCategories(): string[] {
  return getLeadPropertyCategories() as string[];
}

// Get columns by category
export function getColumnsByCategory(category: string): ColumnConfig[] {
  const propsInCategory = getLeadPropertiesByCategory(category as any);
  return ALL_AVAILABLE_COLUMNS.filter(col => 
    propsInCategory.some(p => p.key === col.id) || col.category === category
  );
}

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
          
          // Merge with all available columns to handle new columns added to the system
          const mergedColumns = ALL_AVAILABLE_COLUMNS.map(defaultCol => {
            const savedCol = parsed.columns?.find(c => c.id === defaultCol.id);
            return savedCol ? { ...defaultCol, visible: savedCol.visible } : defaultCol;
          });

          setPreferences({
            ...DEFAULT_PREFERENCES,
            ...parsed,
            columns: mergedColumns,
          });
        } else {
          setPreferences(DEFAULT_PREFERENCES);
        }
      } catch (error) {
        console.error('Failed to load table preferences:', error);
        setPreferences(DEFAULT_PREFERENCES);
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

  // Toggle column visibility
  const toggleColumnVisibility = useCallback((columnId: string) => {
    setPreferences(prev => {
      const updatedColumns = prev.columns.map(col =>
        col.id === columnId ? { ...col, visible: !col.visible } : col
      );
      savePreferences({ columns: updatedColumns });
      return { ...prev, columns: updatedColumns };
    });
  }, [savePreferences]);

  // Show/hide all columns in a category
  const toggleCategoryVisibility = useCallback((category: string, visible: boolean) => {
    setPreferences(prev => {
      const updatedColumns = prev.columns.map(col =>
        col.category === category ? { ...col, visible } : col
      );
      savePreferences({ columns: updatedColumns });
      return { ...prev, columns: updatedColumns };
    });
  }, [savePreferences]);

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error('Failed to reset preferences:', error);
    }
  }, [storageKey]);

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
    toggleColumnVisibility,
    toggleCategoryVisibility,
    resetToDefaults,
    getColumnCategories,
    getColumnsByCategory,
  };
}
