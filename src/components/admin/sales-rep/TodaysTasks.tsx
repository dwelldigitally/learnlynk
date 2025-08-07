import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { CheckSquare, Clock, AlertTriangle, Calendar, Plus } from 'lucide-react';
import { LeadTask } from '@/types/leadEnhancements';
import { LeadTaskService } from '@/services/leadTaskService';

export function TodaysTasks() {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [tasks, setTasks] = useState<LeadTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingTasks, setCompletingTasks] = useState<Set<string>>(new Set());

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

  const handleTaskComplete = async (taskId: string) => {
    setCompletingTasks(prev => new Set(prev).add(taskId));
    
    try {
      await LeadTaskService.updateTask(taskId, { status: 'completed' });
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, status: 'completed', completed_at: new Date().toISOString() }
          : task
      ));
    } catch (error) {
      console.error('Failed to complete task:', error);
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
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CheckSquare className="w-4 h-4" />
            Today's Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-muted rounded-lg h-16"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <CheckSquare className="w-4 h-4" />
          Today's Tasks
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="secondary">{pendingTasks.length}</Badge>
            <Badge variant="outline">{completedToday} done</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pendingTasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">All tasks completed! 🎉</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingTasks.map((task) => (
              <div
                key={task.id}
                className={cn(
                  "p-3 rounded-lg border transition-colors",
                  isOverdue(task.due_date)
                    ? "border-destructive/20 bg-destructive/5"
                    : "border-border hover:bg-muted/50"
                )}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={false}
                    onCheckedChange={() => handleTaskComplete(task.id)}
                    disabled={completingTasks.has(task.id)}
                    className="mt-0.5"
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
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {task.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 text-xs">
                      {isOverdue(task.due_date) ? (
                        <>
                          <AlertTriangle className="w-3 h-3 text-destructive" />
                          <span className="text-destructive font-medium">
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
          </div>
        )}

        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-4"
          onClick={() => {/* Navigate to task creation */}}
        >
          <Plus className="w-3 h-3 mr-1" />
          Add Task
        </Button>
      </CardContent>
    </Card>
  );
}