import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { CheckSquare, Clock, AlertTriangle, Calendar, Plus, Play, X } from 'lucide-react';
import { LeadTask } from '@/types/leadEnhancements';
import { LeadTaskService } from '@/services/leadTaskService';
import { useToast } from '@/hooks/use-toast';

export function TodaysTasks() {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<LeadTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingTasks, setCompletingTasks] = useState<Set<string>>(new Set());
  const [selectedTask, setSelectedTask] = useState<LeadTask | null>(null);
  const [showExecutionDialog, setShowExecutionDialog] = useState(false);

  useEffect(() => {
    if (user) {
      loadTodaysTasks();
    }
  }, [user]);

  const loadTodaysTasks = async () => {
    try {
      // Get tasks due today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // This would need enhancement in the service to filter by user and date
      // For now, we'll use mock data
      const mockTasks: LeadTask[] = [
        {
          id: '1',
          lead_id: 'lead-1',
          user_id: user?.id || '',
          assigned_to: user?.id || '',
          title: 'Follow up on MBA inquiry',
          description: 'Call Sarah Johnson about her MBA application questions',
          priority: 'high',
          status: 'pending',
          task_type: 'follow_up',
          due_date: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          lead_id: 'lead-2',
          user_id: user?.id || '',
          assigned_to: user?.id || '',
          title: 'Send program brochure',
          description: 'Email Michael Chen the updated program brochure',
          priority: 'medium',
          status: 'pending',
          task_type: 'email',
          due_date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago (overdue)
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          lead_id: 'lead-3',
          user_id: user?.id || '',
          assigned_to: user?.id || '',
          title: 'Schedule intake meeting',
          description: 'Book intake meeting with Emily Rodriguez for next week',
          priority: 'medium',
          status: 'pending',
          task_type: 'meeting',
          due_date: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      setTasks(mockTasks);
    } catch (error) {
      console.error('Failed to load today\'s tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskClick = (task: LeadTask) => {
    setSelectedTask(task);
    setShowExecutionDialog(true);
  };

  const handleTaskComplete = async (taskId: string) => {
    setCompletingTasks(prev => new Set(prev).add(taskId));
    
    try {
      // Simulate successful execution
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, status: 'completed', completed_at: new Date().toISOString() }
          : task
      ));
      
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-destructive';
      case 'high': return 'text-warning';
      case 'medium': return 'text-primary';
      case 'low': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
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

  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const completedToday = tasks.filter(task => 
    task.status === 'completed' && 
    task.completed_at &&
    new Date(task.completed_at).toDateString() === new Date().toDateString()
  ).length;

  if (loading) {
    return (
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="pb-3 p-6">
          <div className="text-base flex items-center gap-2">
            <CheckSquare className="w-4 h-4" />
            Loading...
          </div>
        </div>
        <div className="p-6 pt-0">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-muted rounded-lg h-16"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-300 ml-auto">
          {pendingTasks.length} pending
        </Badge>
        <Badge variant="outline" className="border-green-300 text-green-700">
          {completedToday} done
        </Badge>
      </div>
      
      <div className="space-y-3">
        {pendingTasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <div className="p-3 bg-green-100 rounded-full w-12 h-12 mx-auto mb-3">
              <CheckSquare className="w-6 h-6 text-green-500 mx-auto mt-1.5" />
            </div>
            <p className="text-sm font-medium text-green-700">All tasks completed! 🎉</p>
            <p className="text-xs text-muted-foreground mt-1">Great job staying on top of things</p>
          </div>
        ) : (
          <>
            {pendingTasks.slice(0, 4).map((task) => (
              <div
                key={task.id}
                className={cn(
                  "p-3 rounded-lg border transition-colors bg-white shadow-sm",
                  isOverdue(task.due_date)
                    ? "border-red-200 bg-red-50/50"
                    : "border-border"
                )}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={false}
                    onCheckedChange={() => handleTaskClick(task)}
                    disabled={completingTasks.has(task.id)}
                    className="mt-0.5 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 cursor-pointer"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm truncate">
                        {task.title}
                      </p>
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs", getPriorityColor(task.priority))}
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
                          <AlertTriangle className="w-3 h-3 text-red-500" />
                          <span className="text-red-600 font-medium">
                            {formatTime(task.due_date)}
                          </span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 text-muted-foreground" />
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
              <Button variant="ghost" size="sm" className="w-full text-green-600 hover:bg-green-100">
                View all {pendingTasks.length} pending tasks
              </Button>
            )}
          </>
        )}
      </div>

      <Button 
        variant="outline" 
        size="sm" 
        className="w-full mt-4 border-green-300 text-green-700 hover:bg-green-100"
        onClick={() => {/* Navigate to task creation */}}
      >
        <Plus className="w-3 h-3 mr-1" />
        Add New Task
      </Button>

      <Dialog open={showExecutionDialog} onOpenChange={setShowExecutionDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-1.5 bg-green-500 rounded-lg">
                <CheckSquare className="w-4 h-4 text-white" />
              </div>
              Execute Task
            </DialogTitle>
            <DialogDescription>
              Review task details before execution
            </DialogDescription>
          </DialogHeader>

          {selectedTask && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Task:</span>
                  <span className="text-sm">{selectedTask.title}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Priority:</span>
                  <Badge 
                    variant="outline" 
                    className={cn("text-xs", getPriorityColor(selectedTask.priority))}
                  >
                    {selectedTask.priority}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Due:</span>
                  <span className={cn(
                    "text-sm",
                    isOverdue(selectedTask.due_date) ? "text-red-600 font-medium" : "text-muted-foreground"
                  )}>
                    {formatTime(selectedTask.due_date)}
                  </span>
                </div>
                
                {selectedTask.description && (
                  <div className="space-y-1">
                    <span className="text-sm font-medium">Description:</span>
                    <p className="text-sm text-muted-foreground">{selectedTask.description}</p>
                  </div>
                )}
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-2">Action Impact:</p>
                <p className="text-sm">This task will be marked as completed and removed from your pending tasks list.</p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowExecutionDialog(false)}
              disabled={selectedTask ? completingTasks.has(selectedTask.id) : false}
            >
              <X className="w-3 h-3 mr-1" />
              Cancel
            </Button>
            <Button
              onClick={() => selectedTask && handleTaskComplete(selectedTask.id)}
              disabled={selectedTask ? completingTasks.has(selectedTask.id) : false}
              className="bg-green-500 hover:bg-green-600"
            >
              <Play className="w-3 h-3 mr-1" />
              {selectedTask && completingTasks.has(selectedTask.id) ? 'Executing...' : 'Execute Task'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}