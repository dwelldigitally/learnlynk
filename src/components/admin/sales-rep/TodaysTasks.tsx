import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { CheckSquare, Clock, AlertTriangle, Plus, ExternalLink, CheckCircle, User, FileText, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { endOfDay, format } from 'date-fns';
import { UnifiedTaskDialog } from '@/components/admin/tasks/UnifiedTaskDialog';

interface Task {
  id: string;
  lead_id?: string;
  user_id: string;
  assigned_to?: string;
  title: string;
  description?: string;
  priority: string;
  status: string;
  task_type?: string;
  due_date: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  source: 'lead_tasks' | 'tasks';
  lead_name?: string;
}

export function TodaysTasks() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingTasks, setCompletingTasks] = useState<Set<string>>(new Set());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showExecutionDialog, setShowExecutionDialog] = useState(false);
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);

  useEffect(() => {
    if (user) {
      loadTodaysTasks();
    }
  }, [user]);

  const loadTodaysTasks = async () => {
    if (!user) return;

    try {
      const today = new Date();
      const endOfTodayISO = endOfDay(today).toISOString();

      // Query lead_tasks table (without nested join since there's no FK)
      const { data: leadTasks, error: leadTasksError } = await supabase
        .from('lead_tasks')
        .select('*')
        .or(`assigned_to.eq.${user.id},user_id.eq.${user.id}`)
        .lte('due_date', endOfTodayISO)
        .neq('status', 'completed');

      if (leadTasksError) {
        console.error('Error fetching lead_tasks:', leadTasksError);
      }

      // Query universal tasks table
      const { data: universalTasks, error: universalTasksError } = await supabase
        .from('tasks')
        .select('*')
        .or(`assigned_to.eq.${user.id},user_id.eq.${user.id}`)
        .lte('due_date', endOfTodayISO)
        .neq('status', 'completed');

      if (universalTasksError) {
        console.error('Error fetching tasks:', universalTasksError);
      }

      // Fetch lead names for tasks that have lead_id
      const leadIds = (leadTasks || [])
        .filter(t => t.lead_id)
        .map(t => t.lead_id);
      
      let leadsMap: Record<string, { first_name: string; last_name: string }> = {};
      
      if (leadIds.length > 0) {
        const { data: leads } = await supabase
          .from('leads')
          .select('id, first_name, last_name')
          .in('id', leadIds);
        
        if (leads) {
          leadsMap = leads.reduce((acc, lead) => {
            acc[lead.id] = { first_name: lead.first_name, last_name: lead.last_name };
            return acc;
          }, {} as Record<string, { first_name: string; last_name: string }>);
        }
      }

      // Combine and normalize both task sources
      const allTasks: Task[] = [
        ...(leadTasks || []).map(t => {
          const lead = t.lead_id ? leadsMap[t.lead_id] : null;
          return {
            ...t,
            source: 'lead_tasks' as const,
            lead_name: lead ? `${lead.first_name || ''} ${lead.last_name || ''}`.trim() : undefined
          };
        }),
        ...(universalTasks || []).map(t => ({ 
          ...t, 
          source: 'tasks' as const,
          task_type: t.category
        }))
      ];

      // Sort by due date
      allTasks.sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
      
      setTasks(allTasks.slice(0, 15));
    } catch (error) {
      console.error('Failed to load today\'s tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setShowExecutionDialog(true);
  };

  const handleTaskComplete = async (taskId: string, source: 'lead_tasks' | 'tasks') => {
    setCompletingTasks(prev => new Set(prev).add(taskId));
    
    try {
      // Use the correct table based on task source
      const { error } = await supabase
        .from(source)
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) throw error;
      
      setTasks(prev => prev.filter(task => task.id !== taskId));
      
      toast({
        title: "Task Completed",
        description: `Successfully completed: ${selectedTask?.title}`,
      });
      
      setShowExecutionDialog(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Failed to complete task:', error);
      toast({
        title: "Error",
        description: "Failed to complete task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCompletingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-[hsl(24,95%,92%)] text-[hsl(24,95%,40%)] border-0';
      case 'high': return 'bg-[hsl(24,95%,92%)] text-[hsl(24,95%,40%)] border-0';
      case 'medium': return 'bg-[hsl(245,90%,94%)] text-primary border-0';
      case 'low': return 'bg-muted text-muted-foreground border-0';
      default: return 'bg-muted text-muted-foreground border-0';
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    if (date < now) {
      const diff = now.getTime() - date.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      return `${hours}h overdue`;
    }
    
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const pendingTasks = tasks.filter(task => task.status !== 'completed');

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-muted rounded-2xl h-20"></div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <Badge className="bg-[hsl(158,64%,90%)] text-[hsl(158,64%,35%)] border-0 rounded-full px-3 py-1 text-xs font-medium ml-auto">
          {pendingTasks.length} pending
        </Badge>
      </div>
      
      <div className="space-y-3">
        {pendingTasks.length === 0 ? (
          <div className="text-center py-10">
            <div className="p-4 bg-[hsl(158,64%,90%)] rounded-2xl w-14 h-14 mx-auto mb-4 flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-[hsl(158,64%,40%)]" />
            </div>
            <p className="font-semibold text-foreground">All tasks completed!</p>
            <p className="text-sm text-muted-foreground mt-1">Great job staying on top of things</p>
          </div>
        ) : (
          <>
            {pendingTasks.slice(0, 4).map((task) => (
              <div
                key={task.id}
                className={cn(
                  "p-4 rounded-2xl border transition-all duration-200 bg-card hover:shadow-sm",
                  isOverdue(task.due_date)
                    ? "border-[hsl(24,95%,85%)] bg-[hsl(24,95%,98%)]"
                    : "border-border hover:border-primary/20"
                )}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={false}
                    onCheckedChange={() => handleTaskClick(task)}
                    disabled={completingTasks.has(task.id)}
                    className="mt-0.5 rounded-md data-[state=checked]:bg-[hsl(158,64%,52%)] data-[state=checked]:border-[hsl(158,64%,52%)] cursor-pointer h-5 w-5"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <p className="font-medium text-sm text-foreground truncate">
                        {task.title}
                      </p>
                      <Badge 
                        className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium capitalize", getPriorityStyles(task.priority))}
                      >
                        {task.priority}
                      </Badge>
                    </div>
                    
                    {task.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                        {task.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 text-xs">
                      {isOverdue(task.due_date) ? (
                        <>
                          <AlertTriangle className="w-3.5 h-3.5 text-[hsl(24,95%,50%)]" />
                          <span className="text-[hsl(24,95%,45%)] font-medium">
                            {formatTime(task.due_date)}
                          </span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            Due {formatTime(task.due_date)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {pendingTasks.length > 4 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-primary hover:bg-[hsl(245,90%,94%)] rounded-full"
              >
                View all {pendingTasks.length} pending tasks
              </Button>
            )}
          </>
        )}
      </div>

      <Button 
        variant="outline" 
        size="sm" 
        className="w-full mt-4 rounded-full border-border hover:bg-[hsl(245,90%,94%)] hover:border-primary/30 hover:text-primary"
        onClick={() => setShowAddTaskDialog(true)}
      >
        <Plus className="w-4 h-4 mr-1.5" />
        Add New Task
      </Button>

      {/* Add Task Dialog - Using UnifiedTaskDialog */}
      <UnifiedTaskDialog
        open={showAddTaskDialog}
        onOpenChange={setShowAddTaskDialog}
        onTaskCreated={loadTodaysTasks}
        showEntitySearch={true}
      />

      {/* Task Details Dialog */}
      <Dialog open={showExecutionDialog} onOpenChange={setShowExecutionDialog}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 bg-[hsl(158,64%,90%)] rounded-xl">
                <CheckSquare className="w-4 h-4 text-[hsl(158,64%,40%)]" />
              </div>
              Task Details
            </DialogTitle>
            <DialogDescription>
              Review task details and take action
            </DialogDescription>
          </DialogHeader>

          {selectedTask && (
            <div className="space-y-4 py-4">
              {/* Task Title */}
              <div className="p-4 bg-muted/30 rounded-xl border border-border">
                <h3 className="font-semibold text-foreground text-lg">{selectedTask.title}</h3>
              </div>

              {/* Task Details Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Priority */}
                <div className="p-3 bg-card rounded-xl border border-border">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Priority
                  </div>
                  <Badge className={cn("text-xs rounded-full capitalize", getPriorityStyles(selectedTask.priority))}>
                    {selectedTask.priority}
                  </Badge>
                </div>

                {/* Task Type */}
                <div className="p-3 bg-card rounded-xl border border-border">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                    <Tag className="w-3.5 h-3.5" />
                    Task Type
                  </div>
                  <Badge variant="outline" className="text-xs rounded-full capitalize">
                    {selectedTask.task_type || 'General'}
                  </Badge>
                </div>

                {/* Due Date */}
                <div className="p-3 bg-card rounded-xl border border-border">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    Due Date
                  </div>
                  <span className={cn(
                    "text-sm font-medium",
                    isOverdue(selectedTask.due_date) ? "text-[hsl(24,95%,45%)]" : "text-foreground"
                  )}>
                    {format(new Date(selectedTask.due_date), 'MMM dd, yyyy h:mm a')}
                  </span>
                </div>

                {/* Lead Assignment */}
                <div className="p-3 bg-card rounded-xl border border-border">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                    <User className="w-3.5 h-3.5" />
                    Assigned Lead
                  </div>
                  {selectedTask.lead_id && selectedTask.lead_name ? (
                    <span className="text-sm font-medium text-foreground">{selectedTask.lead_name}</span>
                  ) : (
                    <span className="text-sm text-muted-foreground">No lead assigned</span>
                  )}
                </div>
              </div>

              {/* Description */}
              {selectedTask.description && (
                <div className="p-4 bg-card rounded-xl border border-border">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
                    <FileText className="w-3.5 h-3.5" />
                    Description
                  </div>
                  <p className="text-sm text-foreground whitespace-pre-wrap">{selectedTask.description}</p>
                </div>
              )}

              {/* Status indicator */}
              {isOverdue(selectedTask.due_date) && (
                <div className="p-3 bg-[hsl(24,95%,95%)] rounded-xl border border-[hsl(24,95%,85%)]">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[hsl(24,95%,50%)]" />
                    <p className="text-sm text-[hsl(24,95%,40%)] font-medium">This task is overdue</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {/* Go to Lead Button - only show if lead is assigned */}
            {selectedTask?.lead_id && (
              <Button
                variant="outline"
                onClick={() => {
                  setShowExecutionDialog(false);
                  navigate(`/admin/leads/${selectedTask.lead_id}`);
                }}
                className="rounded-full w-full sm:w-auto"
              >
                <ExternalLink className="w-4 h-4 mr-1.5" />
                Go to Lead
              </Button>
            )}
            
            {/* Close Task Button */}
            <Button
              onClick={() => selectedTask && handleTaskComplete(selectedTask.id, selectedTask.source)}
              disabled={selectedTask ? completingTasks.has(selectedTask.id) : false}
              className="rounded-full bg-[hsl(158,64%,52%)] hover:bg-[hsl(158,64%,45%)] w-full sm:w-auto"
            >
              <CheckCircle className="w-4 h-4 mr-1.5" />
              {selectedTask && completingTasks.has(selectedTask.id) ? 'Closing...' : 'Close Task'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
