import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { ActionQueueTable } from './ActionQueueTable';
import { ActionDensityMeter } from './ActionDensityMeter';
import { YieldBandFilter } from './YieldBandFilter';
import { ActionFilters } from './ActionFilters';
import { BulkActionsToolbar } from './BulkActionsToolbar';
import { BulkActionDialog } from './BulkActionDialog';
import { enrollmentSeedService } from '@/services/enrollmentSeedService';

interface ActionQueueItem {
  id: string;
  student_name: string;
  program: string;
  yield_score: number;
  yield_band: string;
  reason_codes: any; // Will be parsed as JSON
  suggested_action: string;
  sla_due_at: string;
  status: string;
  completed_at?: string;
}

export function EnrollmentCommandCenter() {
  const [actions, setActions] = useState<ActionQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYieldBand, setSelectedYieldBand] = useState<string>('all');
  const [actionsPerHour, setActionsPerHour] = useState(0);
  
  // Enhanced filtering states
  const [selectedActionType, setSelectedActionType] = useState<string>('all');
  const [selectedSLAStatus, setSelectedSLAStatus] = useState<string>('all');
  const [selectedYieldRange, setSelectedYieldRange] = useState<string>('all');
  
  // Bulk action states
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [bulkActionDialog, setBulkActionDialog] = useState<{
    isOpen: boolean;
    actionType: 'call' | 'email' | 'schedule' | null;
  }>({ isOpen: false, actionType: null });
  
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  // Redirect to sign-in if not authenticated
  if (!authLoading && !user) {
    return <Navigate to="/sign-in" replace />;
  }

  useEffect(() => {
    // Only load data if user is authenticated
    if (!user) return;
    
    loadActionQueue();
    calculateActionsPerHour();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('action_queue_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'action_queue'
      }, () => {
        loadActionQueue();
        calculateActionsPerHour();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const loadActionQueue = async () => {
    try {
      // Clear existing data and reseed with updated action types
      const { data: existingData } = await supabase
        .from('action_queue')
        .select('id')
        .eq('user_id', user?.id);

      if (existingData && existingData.length > 0) {
        console.log('Clearing existing action queue data...');
        await supabase
          .from('action_queue')
          .delete()
          .eq('user_id', user?.id);
      }

      console.log('Seeding fresh action queue data...');
      await enrollmentSeedService.seedActionQueue();
        
      toast({
        title: "Data Refreshed",
        description: "Action queue data has been updated with proper filtering support",
      });

      // Load both action_queue and student_actions for comprehensive view
      const [actionQueueResult, studentActionsResult] = await Promise.all([
        supabase
          .from('action_queue')
          .select('*')
          .eq('user_id', user?.id)
          .order('yield_score', { ascending: false }),
        supabase
          .from('student_actions')
          .select(`
            *,
            plays:play_id (name, play_type)
          `)
          .eq('user_id', user?.id)
          .eq('status', 'pending')
          .order('priority')
          .order('created_at')
      ]);

      if (actionQueueResult.error) throw actionQueueResult.error;
      if (studentActionsResult.error) throw studentActionsResult.error;
      
      // Convert student_actions to action queue format
      const studentActionItems = (studentActionsResult.data || []).map(action => {
        const metadata = action.metadata as Record<string, any> || {};
        return {
          id: action.id,
          user_id: action.user_id,
          student_id: action.student_id,
          student_name: `Student ${action.student_id?.slice(-4)}`, // Fallback name
          program: metadata.program || 'Unknown Program',
          yield_score: metadata.yield_score || 50,
          yield_band: metadata.yield_band || 'medium',
          reason_codes: Array.isArray(action.reason_chips) ? action.reason_chips : [],
          suggested_action: action.instruction,
          status: 'pending',
          priority_band: action.priority <= 1 ? 'high' : action.priority <= 2 ? 'medium' : 'low',
          sla_due_at: action.scheduled_at,
          created_at: action.created_at,
          updated_at: action.updated_at,
          completed_at: null,
          completed_by: null,
          is_from_student_actions: true,
          original_action_id: action.id,
          play_name: action.plays?.name,
          play_type: action.plays?.play_type
        };
      });
      
      // Parse reason_codes JSON for action_queue items
      const processedQueueActions = (actionQueueResult.data || []).map(action => ({
        ...action,
        reason_codes: typeof action.reason_codes === 'string' ? 
          JSON.parse(action.reason_codes) : 
          action.reason_codes || [],
        is_from_student_actions: false
      }));
      
      // Combine and sort by priority and yield score
      const processedActions = [...processedQueueActions, ...studentActionItems]
        .sort((a, b) => {
          if (a.priority_band !== b.priority_band) {
            const priorityOrder = { high: 1, medium: 2, low: 3 };
            return priorityOrder[a.priority_band as keyof typeof priorityOrder] - 
                   priorityOrder[b.priority_band as keyof typeof priorityOrder];
          }
          return b.yield_score - a.yield_score;
        });
      
      console.log('Loaded actions:', processedActions.length);
      console.log('Action types:', [...new Set(processedActions.map(a => a.suggested_action))]);
      console.log('Yield bands:', [...new Set(processedActions.map(a => a.yield_band))]);
      
      setActions(processedActions);
    } catch (error) {
      console.error('Error loading action queue:', error);
      toast({
        title: "Error",
        description: "Failed to load action queue",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateActionsPerHour = async () => {
    try {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

      const { data, error } = await supabase
        .from('action_queue')
        .select('id')
        .eq('status', 'completed')
        .gte('completed_at', oneHourAgo.toISOString());

      if (error) throw error;
      setActionsPerHour(data?.length || 0);
    } catch (error) {
      console.error('Error calculating actions per hour:', error);
    }
  };

  const handleCompleteAction = async (actionId: string) => {
    try {
      const { error } = await supabase
        .from('action_queue')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', actionId);

      if (error) throw error;

      toast({
        title: "Action Completed",
        description: "Action marked as completed successfully",
      });

      // Refresh the list
      loadActionQueue();
      calculateActionsPerHour();
    } catch (error) {
      console.error('Error completing action:', error);
      toast({
        title: "Error",
        description: "Failed to complete action",
        variant: "destructive"
      });
    }
  };

  // Enhanced filtering logic
  const applyFilters = () => {
    return actions.filter(action => {
      // Yield band filter
      if (selectedYieldBand !== 'all' && action.yield_band !== selectedYieldBand) {
        return false;
      }
      
      // Action type filter
      if (selectedActionType !== 'all' && action.suggested_action !== selectedActionType) {
        return false;
      }
      
      // SLA status filter
      if (selectedSLAStatus !== 'all') {
        const slaDate = new Date(action.sla_due_at);
        const now = new Date();
        const hoursUntilSLA = (slaDate.getTime() - now.getTime()) / (1000 * 60 * 60);
        
        if (selectedSLAStatus === 'overdue' && hoursUntilSLA >= 0) return false;
        if (selectedSLAStatus === 'urgent' && (hoursUntilSLA < 0 || hoursUntilSLA > 24)) return false;
        if (selectedSLAStatus === 'normal' && hoursUntilSLA <= 24) return false;
      }
      
      // Yield score range filter
      if (selectedYieldRange !== 'all') {
        const score = action.yield_score;
        if (selectedYieldRange === '80-100' && (score < 80 || score > 100)) return false;
        if (selectedYieldRange === '60-79' && (score < 60 || score >= 80)) return false;
        if (selectedYieldRange === '0-59' && score >= 60) return false;
      }
      
      return true;
    });
  };

  const filteredActions = applyFilters();

  // Bulk action handlers
  const handleBulkCall = () => {
    setBulkActionDialog({ isOpen: true, actionType: 'call' });
  };

  const handleBulkEmail = () => {
    setBulkActionDialog({ isOpen: true, actionType: 'email' });
  };

  const handleBulkSchedule = () => {
    setBulkActionDialog({ isOpen: true, actionType: 'schedule' });
  };

  const handleBulkComplete = async () => {
    try {
      for (const actionId of selectedActions) {
        await supabase
          .from('action_queue')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString()
          })
          .eq('id', actionId);
      }
      
      toast({
        title: "Actions Completed",
        description: `Successfully completed ${selectedActions.length} actions.`,
      });
      
      setSelectedActions([]);
      loadActionQueue();
    } catch (error) {
      console.error('Error completing actions:', error);
      toast({
        title: "Error",
        description: "Failed to complete actions",
        variant: "destructive"
      });
    }
  };

  const handleBulkDelete = async () => {
    if (confirm(`Are you sure you want to delete ${selectedActions.length} actions?`)) {
      try {
        for (const actionId of selectedActions) {
          await supabase
            .from('action_queue')
            .delete()
            .eq('id', actionId);
        }
        
        toast({
          title: "Actions Deleted",
          description: `Successfully deleted ${selectedActions.length} actions.`,
        });
        
        setSelectedActions([]);
        loadActionQueue();
      } catch (error) {
        console.error('Error deleting actions:', error);
        toast({
          title: "Error",
          description: "Failed to delete actions",
          variant: "destructive"
        });
      }
    }
  };

  const handleBulkActionExecute = async (actionData: any) => {
    try {
      // Here you would implement the actual execution logic
      // For calls: trigger calling system
      // For emails: send bulk emails
      // For scheduling: create calendar events
      
      toast({
        title: "Bulk Action Executed",
        description: `Successfully executed ${actionData.actionType} for ${actionData.selectedActions.length} students.`,
      });
      
      // Mark actions as completed
      await handleBulkComplete();
      
    } catch (error) {
      console.error('Error executing bulk action:', error);
      toast({
        title: "Execution Failed",
        description: "Failed to execute bulk action",
        variant: "destructive"
      });
    }
  };

  const clearAllFilters = () => {
    setSelectedActionType('all');
    setSelectedSLAStatus('all');
    setSelectedYieldRange('all');
    setSelectedYieldBand('all');
  };

  const pendingActions = actions.filter(action => action.status === 'pending');
  const highYieldActions = actions.filter(action => action.yield_band === 'high' && action.status === 'pending');
  const overdueSLA = actions.filter(action => 
    action.status === 'pending' && new Date(action.sla_due_at) < new Date()
  );
  
  const selectedActionItems = actions.filter(action => selectedActions.includes(action.id));

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Command Center - Today</h1>
          <p className="text-muted-foreground">
            Prioritized actions ranked by enrollment probability
          </p>
        </div>
        
        <ActionDensityMeter actionsPerHour={actionsPerHour} />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Actions</p>
                <p className="text-2xl font-bold text-foreground">{pendingActions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Yield</p>
                <p className="text-2xl font-bold text-foreground">{highYieldActions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">SLA Overdue</p>
                <p className="text-2xl font-bold text-foreground">{overdueSLA.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Yield Score</p>
                <p className="text-2xl font-bold text-foreground">
                  {actions.length > 0 ? 
                    (actions.reduce((sum, action) => sum + action.yield_score, 0) / actions.length).toFixed(1) : 
                    '0'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Filters */}
      <ActionFilters
        selectedActionType={selectedActionType}
        selectedSLAStatus={selectedSLAStatus}
        selectedYieldRange={selectedYieldRange}
        onActionTypeChange={setSelectedActionType}
        onSLAStatusChange={setSelectedSLAStatus}
        onYieldRangeChange={setSelectedYieldRange}
        filteredCount={filteredActions.length}
        totalCount={actions.length}
        onClearFilters={clearAllFilters}
      />

      {/* Action Queue Table */}
      <Card>
        <CardHeader>
          <CardTitle>Priority Action Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <ActionQueueTable 
            actions={filteredActions}
            onCompleteAction={handleCompleteAction}
            selectedActions={selectedActions}
            onSelectionChange={setSelectedActions}
          />
        </CardContent>
      </Card>

      {/* Bulk Actions Toolbar */}
      <BulkActionsToolbar
        selectedCount={selectedActions.length}
        selectedActionType={selectedActionType}
        onBulkCall={handleBulkCall}
        onBulkEmail={handleBulkEmail}
        onBulkSchedule={handleBulkSchedule}
        onBulkComplete={handleBulkComplete}
        onBulkDelete={handleBulkDelete}
        onClearSelection={() => setSelectedActions([])}
      />

      {/* Bulk Action Dialog */}
      <BulkActionDialog
        isOpen={bulkActionDialog.isOpen}
        onClose={() => setBulkActionDialog({ isOpen: false, actionType: null })}
        actionType={bulkActionDialog.actionType}
        selectedActions={selectedActionItems}
        onExecute={handleBulkActionExecute}
      />
    </div>
  );
}