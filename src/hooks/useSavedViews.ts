import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SavedView {
  id: string;
  name: string;
  filters: {
    severityFilter?: string;
    segmentFilter?: string | null;
    query?: string;
  };
  isDefault?: boolean;
  createdAt: string;
}

export function useSavedViews() {
  const [savedViews, setSavedViews] = useState<SavedView[]>([]);
  const [currentView, setCurrentView] = useState<SavedView | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSavedViews();
  }, []);

  const loadSavedViews = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // For now, use local storage for saved views
      const stored = localStorage.getItem(`saved-views-${user.id}`);
      if (stored) {
        const views = JSON.parse(stored);
        setSavedViews(views);
        
        // Set default view if any
        const defaultView = views.find((v: SavedView) => v.isDefault);
        if (defaultView) {
          setCurrentView(defaultView);
        }
      } else {
        // Initialize with default views
        const defaultViews: SavedView[] = [
          {
            id: 'critical-only',
            name: 'Critical Only',
            filters: { severityFilter: 'critical' },
            createdAt: new Date().toISOString()
          },
          {
            id: 'unassigned-leads', 
            name: 'Unassigned Leads',
            filters: { segmentFilter: 'unassigned' },
            createdAt: new Date().toISOString()
          },
          {
            id: 'sla-violations',
            name: 'SLA Violations',
            filters: { segmentFilter: 'slaViolations' },
            isDefault: true,
            createdAt: new Date().toISOString()
          }
        ];
        setSavedViews(defaultViews);
        setCurrentView(defaultViews[2]); // SLA Violations as default
        localStorage.setItem(`saved-views-${user.id}`, JSON.stringify(defaultViews));
      }
    } catch (error) {
      console.error('Error loading saved views:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveView = async (name: string, filters: SavedView['filters'], isDefault = false) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const newView: SavedView = {
        id: Date.now().toString(),
        name,
        filters,
        isDefault,
        createdAt: new Date().toISOString()
      };

      let updatedViews = [...savedViews];
      
      // If setting as default, remove default from others
      if (isDefault) {
        updatedViews = updatedViews.map(v => ({ ...v, isDefault: false }));
      }
      
      updatedViews.push(newView);
      setSavedViews(updatedViews);
      localStorage.setItem(`saved-views-${user.id}`, JSON.stringify(updatedViews));

      toast({
        title: "View Saved",
        description: `"${name}" view has been saved successfully.`
      });

      return newView;
    } catch (error) {
      console.error('Error saving view:', error);
      toast({
        title: "Save Failed",
        description: "Unable to save view. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteView = async (viewId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const updatedViews = savedViews.filter(v => v.id !== viewId);
      setSavedViews(updatedViews);
      localStorage.setItem(`saved-views-${user.id}`, JSON.stringify(updatedViews));

      if (currentView?.id === viewId) {
        setCurrentView(null);
      }

      toast({
        title: "View Deleted",
        description: "View has been deleted successfully."
      });
    } catch (error) {
      console.error('Error deleting view:', error);
      toast({
        title: "Delete Failed",
        description: "Unable to delete view. Please try again.",
        variant: "destructive"
      });
    }
  };

  const applyView = (view: SavedView) => {
    setCurrentView(view);
    return view.filters;
  };

  return {
    savedViews,
    currentView,
    isLoading,
    saveView,
    deleteView,
    applyView,
    loadSavedViews
  };
}