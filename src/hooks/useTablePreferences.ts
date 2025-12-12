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

// All available columns - comprehensive list with all lead properties
const ALL_AVAILABLE_COLUMNS: ColumnConfig[] = [
  // Core columns (visible by default)
  { id: 'name', label: 'Name', visible: true, sortable: true, minWidth: 140, maxWidth: 220, category: 'Core' },
  { id: 'email', label: 'Email', visible: true, sortable: true, minWidth: 160, maxWidth: 260, category: 'Core' },
  { id: 'phone', label: 'Phone', visible: true, sortable: false, minWidth: 100, maxWidth: 160, category: 'Core' },
  { id: 'source', label: 'Source', visible: true, sortable: true, minWidth: 80, maxWidth: 130, category: 'Core' },
  { id: 'created_at', label: 'Created', visible: true, sortable: true, minWidth: 100, maxWidth: 160, category: 'Core' },
  { id: 'last_activity', label: 'Last Activity', visible: true, sortable: false, minWidth: 100, maxWidth: 160, category: 'Core' },
  { id: 'stage', label: 'Stage', visible: true, sortable: true, minWidth: 80, maxWidth: 130, category: 'Core' },
  { id: 'lead_score', label: 'Lead Score', visible: true, sortable: true, minWidth: 90, maxWidth: 130, category: 'Core' },
  { id: 'priority', label: 'Priority', visible: true, sortable: true, minWidth: 80, maxWidth: 120, category: 'Core' },
  { id: 'assigned_to', label: 'Assigned To', visible: true, sortable: false, minWidth: 120, maxWidth: 200, category: 'Core' },
  { id: 'suggested_action', label: 'Suggested Action', visible: true, sortable: false, minWidth: 130, maxWidth: 200, category: 'Core' },
  
  // Location columns
  { id: 'city', label: 'City', visible: false, sortable: true, minWidth: 100, maxWidth: 160, category: 'Location' },
  { id: 'state', label: 'State/Province', visible: false, sortable: true, minWidth: 100, maxWidth: 160, category: 'Location' },
  { id: 'country', label: 'Country/Region', visible: false, sortable: true, minWidth: 100, maxWidth: 160, category: 'Location' },
  { id: 'postal_code', label: 'Postal Code', visible: false, sortable: true, minWidth: 90, maxWidth: 140, category: 'Location' },
  { id: 'time_zone', label: 'Time Zone', visible: false, sortable: true, minWidth: 120, maxWidth: 180, category: 'Location' },
  
  // Activity Metrics columns
  { id: 'call_count', label: 'Call Count', visible: false, sortable: true, minWidth: 90, maxWidth: 130, category: 'Activity' },
  { id: 'meeting_count', label: 'Meeting Count', visible: false, sortable: true, minWidth: 100, maxWidth: 140, category: 'Activity' },
  { id: 'number_of_sales_activities', label: 'Sales Activities', visible: false, sortable: true, minWidth: 110, maxWidth: 160, category: 'Activity' },
  { id: 'number_of_times_contacted', label: 'Times Contacted', visible: false, sortable: true, minWidth: 110, maxWidth: 160, category: 'Activity' },
  { id: 'number_of_form_submissions', label: 'Form Submissions', visible: false, sortable: true, minWidth: 120, maxWidth: 170, category: 'Activity' },
  { id: 'number_of_page_views', label: 'Page Views', visible: false, sortable: true, minWidth: 100, maxWidth: 140, category: 'Activity' },
  
  // Engagement columns
  { id: 'last_contacted_at', label: 'Last Contacted', visible: false, sortable: true, minWidth: 130, maxWidth: 180, category: 'Engagement' },
  { id: 'last_engagement_date', label: 'Last Engagement', visible: false, sortable: true, minWidth: 130, maxWidth: 180, category: 'Engagement' },
  { id: 'date_of_first_engagement', label: 'First Engagement', visible: false, sortable: true, minWidth: 130, maxWidth: 180, category: 'Engagement' },
  { id: 'lead_response_time', label: 'Response Time', visible: false, sortable: true, minWidth: 110, maxWidth: 160, category: 'Engagement' },
  { id: 'time_to_first_touch', label: 'Time to First Touch', visible: false, sortable: true, minWidth: 130, maxWidth: 180, category: 'Engagement' },
  { id: 'next_follow_up_at', label: 'Next Follow-up', visible: false, sortable: true, minWidth: 120, maxWidth: 170, category: 'Engagement' },
  
  // Conversion columns
  { id: 'first_conversion', label: 'First Conversion', visible: false, sortable: true, minWidth: 120, maxWidth: 180, category: 'Conversion' },
  { id: 'first_conversion_date', label: 'First Conversion Date', visible: false, sortable: true, minWidth: 140, maxWidth: 200, category: 'Conversion' },
  
  // Classification columns
  { id: 'status', label: 'Status', visible: false, sortable: true, minWidth: 90, maxWidth: 140, category: 'Classification' },
  { id: 'lead_type', label: 'Lead Type', visible: false, sortable: true, minWidth: 100, maxWidth: 160, category: 'Classification' },
  { id: 'lifecycle_stage', label: 'Lifecycle Stage', visible: false, sortable: true, minWidth: 120, maxWidth: 180, category: 'Classification' },
  { id: 'source_details', label: 'Source Details', visible: false, sortable: true, minWidth: 120, maxWidth: 200, category: 'Classification' },
  
  // Scores columns
  { id: 'ai_score', label: 'AI Score', visible: false, sortable: true, minWidth: 80, maxWidth: 120, category: 'Scores' },
  
  // Assignment columns
  { id: 'assigned_at', label: 'Assigned At', visible: false, sortable: true, minWidth: 120, maxWidth: 180, category: 'Assignment' },
  { id: 'assignment_method', label: 'Assignment Method', visible: false, sortable: true, minWidth: 130, maxWidth: 190, category: 'Assignment' },
  { id: 'owner_assigned_date', label: 'Owner Assigned Date', visible: false, sortable: true, minWidth: 140, maxWidth: 200, category: 'Assignment' },
  
  // Program columns
  { id: 'program_interest', label: 'Program Interest', visible: false, sortable: true, minWidth: 130, maxWidth: 200, category: 'Program' },
  { id: 'preferred_intake_id', label: 'Preferred Intake', visible: false, sortable: false, minWidth: 120, maxWidth: 180, category: 'Program' },
  { id: 'days_to_intake_start', label: 'Days to Intake', visible: false, sortable: true, minWidth: 110, maxWidth: 160, category: 'Program' },
  
  // Marketing columns
  { id: 'utm_source', label: 'UTM Source', visible: false, sortable: true, minWidth: 100, maxWidth: 160, category: 'Marketing' },
  { id: 'utm_medium', label: 'UTM Medium', visible: false, sortable: true, minWidth: 100, maxWidth: 160, category: 'Marketing' },
  { id: 'utm_campaign', label: 'UTM Campaign', visible: false, sortable: true, minWidth: 110, maxWidth: 180, category: 'Marketing' },
  { id: 'utm_content', label: 'UTM Content', visible: false, sortable: true, minWidth: 100, maxWidth: 160, category: 'Marketing' },
  { id: 'utm_term', label: 'UTM Term', visible: false, sortable: true, minWidth: 90, maxWidth: 150, category: 'Marketing' },
  { id: 'referrer_url', label: 'Referrer URL', visible: false, sortable: false, minWidth: 140, maxWidth: 250, category: 'Marketing' },
  { id: 'latest_traffic_source_date', label: 'Traffic Source Date', visible: false, sortable: true, minWidth: 140, maxWidth: 200, category: 'Marketing' },
  
  // Email columns
  { id: 'unsubscribed_from_all_email', label: 'Unsubscribed', visible: false, sortable: true, minWidth: 100, maxWidth: 150, category: 'Email' },
  
  // System columns
  { id: 'id', label: 'Record ID', visible: false, sortable: false, minWidth: 120, maxWidth: 280, category: 'System' },
  { id: 'updated_at', label: 'Last Modified', visible: false, sortable: true, minWidth: 120, maxWidth: 180, category: 'System' },
  { id: 'created_by_user_id', label: 'Created By', visible: false, sortable: false, minWidth: 120, maxWidth: 200, category: 'System' },
  { id: 'updated_by_user_id', label: 'Updated By', visible: false, sortable: false, minWidth: 120, maxWidth: 200, category: 'System' },
  
  // Tags columns
  { id: 'tags', label: 'Tags', visible: false, sortable: false, minWidth: 120, maxWidth: 250, category: 'Tags' },
  { id: 'notes', label: 'Notes', visible: false, sortable: false, minWidth: 150, maxWidth: 300, category: 'Tags' },
];

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
  const categories = new Set<string>();
  ALL_AVAILABLE_COLUMNS.forEach(col => {
    if (col.category) categories.add(col.category);
  });
  return Array.from(categories);
}

// Get columns by category
export function getColumnsByCategory(category: string): ColumnConfig[] {
  return ALL_AVAILABLE_COLUMNS.filter(col => col.category === category);
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
