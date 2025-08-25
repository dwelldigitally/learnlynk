import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ActionQueueTable } from './ActionQueueTable';
import { ActionDensityMeter } from './ActionDensityMeter';
import { YieldBandFilter } from './YieldBandFilter';

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
  const { toast } = useToast();

  useEffect(() => {
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
  }, []);

  const loadActionQueue = async () => {
    try {
      const { data, error } = await supabase
        .from('action_queue')
        .select('*')
        .order('yield_score', { ascending: false });

      if (error) throw error;
      
      // Parse reason_codes JSON for each action
      const processedActions = (data || []).map(action => ({
        ...action,
        reason_codes: typeof action.reason_codes === 'string' ? 
          JSON.parse(action.reason_codes) : 
          action.reason_codes || []
      }));
      
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

  const filteredActions = actions.filter(action => 
    selectedYieldBand === 'all' || action.yield_band === selectedYieldBand
  );

  const pendingActions = actions.filter(action => action.status === 'pending');
  const highYieldActions = actions.filter(action => action.yield_band === 'high' && action.status === 'pending');
  const overdueSLA = actions.filter(action => 
    action.status === 'pending' && new Date(action.sla_due_at) < new Date()
  );

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

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <YieldBandFilter 
          selectedBand={selectedYieldBand}
          onBandChange={setSelectedYieldBand}
        />
        
        <Badge variant="outline" className="text-sm">
          {filteredActions.length} actions shown
        </Badge>
      </div>

      {/* Action Queue Table */}
      <Card>
        <CardHeader>
          <CardTitle>Priority Action Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <ActionQueueTable 
            actions={filteredActions}
            onCompleteAction={handleCompleteAction}
          />
        </CardContent>
      </Card>
    </div>
  );
}