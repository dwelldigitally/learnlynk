import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface StudentAction {
  id: string;
  action_type: string;
  instruction: string;
  reason_chips: string[];
  priority: number;
  status: string;
  scheduled_at: string;
  metadata: any;
}

export function useRealTimeActions() {
  const [actions, setActions] = useState<StudentAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [newActionCount, setNewActionCount] = useState(0);
  const { toast } = useToast();

  const loadActions = useCallback(async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        await supabase.auth.refreshSession();
        return;
      }

      const { data, error } = await supabase
        .from('student_actions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .order('priority', { ascending: true })
        .order('scheduled_at', { ascending: true });

      if (error) throw error;
      
      const transformedActions = (data || []).map(action => ({
        ...action,
        metadata: typeof action.metadata === 'string' 
          ? JSON.parse(action.metadata) 
          : action.metadata || {}
      })) as StudentAction[];
      
      setActions(transformedActions);
    } catch (error) {
      console.error('Error loading actions:', error);
      toast({
        title: "Error",
        description: "Failed to load actions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadActions();

    // Set up real-time subscription
    const channel = supabase
      .channel('student-actions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'student_actions'
        },
        (payload) => {
          console.log('Real-time action change:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newAction = {
              ...payload.new,
              metadata: typeof payload.new.metadata === 'string' 
                ? JSON.parse(payload.new.metadata) 
                : payload.new.metadata || {}
            } as StudentAction;
            
            setActions(prev => [newAction, ...prev]);
            setNewActionCount(prev => prev + 1);
            
            // Show notification for high-priority actions
            if (newAction.priority === 1) {
              toast({
                title: "🚨 Urgent Action Added!",
                description: `${newAction.metadata?.student_name || 'Student'}: ${newAction.instruction}`,
              });
              
              // Play sound for urgent actions
              const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj');
              audio.play().catch(() => {}); // Ignore errors if sound fails
            }
          } else if (payload.eventType === 'UPDATE') {
            setActions(prev => prev.map(action => 
              action.id === payload.new.id 
                ? { 
                    ...payload.new, 
                    metadata: typeof payload.new.metadata === 'string' 
                      ? JSON.parse(payload.new.metadata) 
                      : payload.new.metadata || {}
                  } as StudentAction
                : action
            ));
          } else if (payload.eventType === 'DELETE') {
            setActions(prev => prev.filter(action => action.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadActions, toast]);

  const markNewActionsSeen = useCallback(() => {
    setNewActionCount(0);
  }, []);

  return {
    actions,
    loading,
    newActionCount,
    markNewActionsSeen,
    refreshActions: loadActions
  };
}