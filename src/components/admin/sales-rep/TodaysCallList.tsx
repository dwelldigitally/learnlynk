import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Phone, Clock, AlertTriangle, Star, PhoneCall, Zap, CheckCircle2 } from 'lucide-react';
import { Lead } from '@/types/lead';
import { LeadService } from '@/services/leadService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CallTask {
  id: string;
  title: string;
  type: string;
  status: string;
  due_date: string;
  priority: string;
  lead: Lead;
}

export function TodaysCallList() {
  const { toast } = useToast();
  const [callList, setCallList] = useState<CallTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState<string | null>(null);

  useEffect(() => {
    loadTodaysCallList();
  }, []);

  const loadTodaysCallList = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('User not authenticated');
        return;
      }

      const { data: tasks, error } = await LeadService.getTodaysCallList(user.id);
      
      if (error) {
        console.error('Failed to load call list:', error);
        return;
      }

      setCallList(tasks || []);
    } catch (error) {
      console.error('Failed to load call list:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = (task: CallTask) => {
    if (task.lead?.phone) {
      window.open(`tel:${task.lead.phone}`);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      setCompletingId(taskId);
      
      const { error } = await supabase
        .from('lead_tasks')
        .update({ 
          status: 'completed', 
          completed_at: new Date().toISOString() 
        })
        .eq('id', taskId);

      if (error) {
        console.error('Failed to complete task:', error);
        toast({
          title: 'Error',
          description: 'Failed to complete the task',
          variant: 'destructive'
        });
        return;
      }

      toast({
        title: 'Task Completed',
        description: 'Call task marked as complete'
      });

      // Refresh the list
      await loadTodaysCallList();
    } catch (error) {
      console.error('Failed to complete task:', error);
    } finally {
      setCompletingId(null);
    }
  };

  const handleBulkCall = () => {
    console.log('Starting bulk calling session for', callList.length, 'tasks');
  };

  const isOverdue = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    return due < now;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-warning';
      case 'low': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high': return { variant: 'destructive' as const, label: 'High' };
      case 'medium': return { variant: 'secondary' as const, label: 'Medium' };
      case 'low': return { variant: 'outline' as const, label: 'Low' };
      default: return { variant: 'outline' as const, label: priority || 'Normal' };
    }
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return 'ASAP';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-muted rounded-lg h-20"></div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <Badge variant="secondary" className="ml-auto">{callList.length} calls</Badge>
        {callList.length > 1 && (
          <Button 
            size="sm" 
            className="h-7 px-3 text-xs gap-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-200 border-0"
            onClick={handleBulkCall}
          >
            <Zap className="w-3 h-3" />
            Start Bulk Calling
          </Button>
        )}
      </div>
      
      <div className="space-y-3">
        {callList.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Phone className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No call tasks scheduled</p>
            <p className="text-xs mt-1">Create call tasks for leads to see them here</p>
          </div>
        ) : (
          <>
            {callList.map((task) => {
              const overdue = isOverdue(task.due_date);
              const priorityBadge = getPriorityBadge(task.priority);
              const lead = task.lead;
              
              return (
                <div
                  key={task.id}
                  className={cn(
                    "p-3 rounded-lg border transition-colors bg-card shadow-sm",
                    overdue 
                      ? "border-destructive/20 bg-destructive/5" 
                      : "border-border hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">
                        {lead?.first_name?.[0]}{lead?.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm truncate">
                          {lead?.first_name} {lead?.last_name}
                        </p>
                        {overdue && (
                          <Badge variant="destructive" className="text-xs">
                            Overdue
                          </Badge>
                        )}
                        <Badge variant={priorityBadge.variant} className="text-xs">
                          {priorityBadge.label}
                        </Badge>
                      </div>
                      
                      <p className="text-xs font-medium text-foreground mb-1 truncate">
                        {task.title}
                      </p>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <Clock className="w-3 h-3" />
                        <span className={cn(overdue && "text-destructive font-medium")}>
                          {formatTime(task.due_date)}
                        </span>
                        {lead?.phone && (
                          <>
                            <span>•</span>
                            <span>{lead.phone}</span>
                          </>
                        )}
                      </div>

                      {lead?.lead_score && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-warning" />
                          <span className="text-xs font-medium">{lead.lead_score}/100</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <Button
                        size="sm"
                        variant="default"
                        className="h-8 px-3"
                        onClick={() => handleCall(task)}
                        disabled={!lead?.phone}
                      >
                        <PhoneCall className="w-3 h-3 mr-1" />
                        Call
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-3"
                        onClick={() => handleCompleteTask(task.id)}
                        disabled={completingId === task.id}
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        {completingId === task.id ? '...' : 'Done'}
                      </Button>
                      
                      {overdue && (
                        <div className="flex items-center gap-1 text-xs text-destructive">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Overdue</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </>
  );
}
