import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { CheckSquare, Clock, AlertTriangle, Plus, Play, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { endOfDay } from 'date-fns';

interface Task {
  id: string;
  lead_id: string;
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
}

export function TodaysTasks() {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingTasks, setCompletingTasks] = useState<Set<string>>(new Set());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showExecutionDialog, setShowExecutionDialog] = useState(false);

  useEffect(() => {
    if (user) {
      loadTodaysTasks();
    }
  }, [user]);

  const loadTodaysTasks = async () => {
    if (!user) return;

    try {
      const today = new Date();
      const endOfToday = endOfDay(today).toISOString();

      const { data, error } = await supabase
        .from('lead_tasks')
        .select('*')
        .or(`assigned_to.eq.${user.id},user_id.eq.${user.id}`)
        .lte('due_date', endOfToday)
        .neq('status', 'completed')
        .order('due_date', { ascending: true })
        .limit(10);

      if (error) {
        console.error('Error fetching tasks:', error);
        return;
      }

      setTasks(data || []);
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

  const handleTaskComplete = async (taskId: string) => {
    setCompletingTasks(prev => new Set(prev).add(taskId));
    
    try {
      const { error } = await supabase
        .from('lead_tasks')
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
      >
        <Plus className="w-4 h-4 mr-1.5" />
        Add New Task
      </Button>

      <Dialog open={showExecutionDialog} onOpenChange={setShowExecutionDialog}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 bg-[hsl(158,64%,90%)] rounded-xl">
                <CheckSquare className="w-4 h-4 text-[hsl(158,64%,40%)]" />
              </div>
              Execute Task
            </DialogTitle>
            <DialogDescription>
              Review task details before execution
            </DialogDescription>
          </DialogHeader>

          {selectedTask && (
            <div className="space-y-4 py-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Task:</span>
                  <span className="text-sm font-medium">{selectedTask.title}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Priority:</span>
                  <Badge 
                    className={cn("text-xs rounded-full", getPriorityStyles(selectedTask.priority))}
                  >
                    {selectedTask.priority}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Due:</span>
                  <span className={cn(
                    "text-sm",
                    isOverdue(selectedTask.due_date) ? "text-[hsl(24,95%,45%)] font-medium" : "text-foreground"
                  )}>
                    {formatTime(selectedTask.due_date)}
                  </span>
                </div>
                
                {selectedTask.description && (
                  <div className="space-y-1.5">
                    <span className="text-sm text-muted-foreground">Description:</span>
                    <p className="text-sm text-foreground bg-muted/50 p-3 rounded-xl">{selectedTask.description}</p>
                  </div>
                )}
              </div>

              <div className="p-3 bg-[hsl(245,90%,94%)] rounded-xl">
                <p className="text-xs text-primary font-medium mb-1">Action Impact:</p>
                <p className="text-sm text-foreground">This task will be marked as completed and removed from your pending tasks list.</p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowExecutionDialog(false)}
              disabled={selectedTask ? completingTasks.has(selectedTask.id) : false}
              className="rounded-full"
            >
              <X className="w-4 h-4 mr-1.5" />
              Cancel
            </Button>
            <Button
              onClick={() => selectedTask && handleTaskComplete(selectedTask.id)}
              disabled={selectedTask ? completingTasks.has(selectedTask.id) : false}
              className="rounded-full bg-[hsl(158,64%,52%)] hover:bg-[hsl(158,64%,45%)]"
            >
              <Play className="w-4 h-4 mr-1.5" />
              {selectedTask && completingTasks.has(selectedTask.id) ? 'Executing...' : 'Execute Task'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
