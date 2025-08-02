import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  Calendar,
  User,
  Edit,
  Trash2
} from 'lucide-react';
import { LeadTask, TaskFormData } from '@/types/leadEnhancements';
import { LeadTaskService } from '@/services/leadTaskService';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';

interface TaskPanelProps {
  leadId: string;
  tasks: LeadTask[];
  onTaskCreated: (task: LeadTask) => void;
  onTaskUpdated: (task: LeadTask) => void;
  loading: boolean;
}

export function TaskPanel({
  leadId,
  tasks,
  onTaskCreated,
  onTaskUpdated,
  loading
}: TaskPanelProps) {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<LeadTask | null>(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm<TaskFormData>({
    defaultValues: {
      task_type: 'follow_up',
      priority: 'medium',
    }
  });

  const onSubmit = async (data: TaskFormData) => {
    setIsCreating(true);
    try {
      if (editingTask) {
        const updatedTask = await LeadTaskService.updateTask(editingTask.id, data);
        onTaskUpdated(updatedTask);
        setEditingTask(null);
      } else {
        const newTask = await LeadTaskService.createTask(leadId, data);
        onTaskCreated(newTask);
      }
      setShowCreateDialog(false);
      reset();
      toast({
        title: "Success",
        description: editingTask ? "Task updated successfully" : "Task created successfully",
      });
    } catch (error) {
      console.error('Error saving task:', error);
      toast({
        title: "Error",
        description: "Failed to save task",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleTaskComplete = async (task: LeadTask) => {
    try {
      const updatedTask = await LeadTaskService.updateTask(task.id, {
        status: task.status === 'completed' ? 'pending' : 'completed'
      });
      onTaskUpdated(updatedTask);
      toast({
        title: "Success",
        description: `Task marked as ${updatedTask.status}`,
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const handleEditTask = (task: LeadTask) => {
    setEditingTask(task);
    setValue('title', task.title);
    setValue('description', task.description || '');
    setValue('task_type', task.task_type);
    setValue('priority', task.priority);
    setValue('due_date', task.due_date ? task.due_date.slice(0, 16) : '');
    setShowCreateDialog(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await LeadTaskService.deleteTask(taskId);
      // Remove from local state (parent component should handle this)
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'destructive';
      case 'high':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'in_progress':
        return 'secondary';
      case 'pending':
        return 'outline';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const isOverdue = (task: LeadTask) => {
    return task.due_date && 
           task.status !== 'completed' && 
           new Date(task.due_date) < new Date();
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    // Completed tasks go to bottom
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    if (a.status !== 'completed' && b.status === 'completed') return -1;
    
    // Overdue tasks go to top
    const aOverdue = isOverdue(a);
    const bOverdue = isOverdue(b);
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;
    
    // Sort by due date
    if (a.due_date && b.due_date) {
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    }
    if (a.due_date && !b.due_date) return -1;
    if (!a.due_date && b.due_date) return 1;
    
    return 0;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Tasks</h3>
        <Dialog open={showCreateDialog} onOpenChange={(open) => {
          setShowCreateDialog(open);
          if (!open) {
            setEditingTask(null);
            reset();
          }
        }}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="title">Task Title</Label>
                <Input 
                  {...register('title', { required: true })}
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  {...register('description')}
                  placeholder="Task description (optional)"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="task_type">Type</Label>
                  <Select onValueChange={(value) => setValue('task_type', value as any)} defaultValue="follow_up">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="follow_up">Follow-up</SelectItem>
                      <SelectItem value="call">Call</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="research">Research</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select onValueChange={(value) => setValue('priority', value as any)} defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="due_date">Due Date & Time</Label>
                <Input 
                  {...register('due_date')}
                  type="datetime-local"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? 'Saving...' : editingTask ? 'Update Task' : 'Create Task'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {loading ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">Loading tasks...</p>
            </CardContent>
          </Card>
        ) : sortedTasks.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                No tasks created yet. Create your first task to start tracking follow-ups.
              </p>
            </CardContent>
          </Card>
        ) : (
          sortedTasks.map((task) => (
            <Card key={task.id} className={`${task.status === 'completed' ? 'opacity-60' : ''} ${isOverdue(task) ? 'border-destructive' : ''}`}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={task.status === 'completed'}
                      onCheckedChange={() => handleTaskComplete(task)}
                    />
                    <div className="flex items-center gap-2">
                      {getPriorityIcon(task.priority)}
                      <CardTitle className={`text-sm ${task.status === 'completed' ? 'line-through' : ''}`}>
                        {task.title}
                      </CardTitle>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getPriorityBadgeVariant(task.priority)}>
                      {task.priority}
                    </Badge>
                    <Badge variant={getStatusBadgeVariant(task.status)}>
                      {task.status}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => handleEditTask(task)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteTask(task.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {task.description && (
                  <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                )}
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span className="capitalize">Type: {task.task_type}</span>
                    {task.due_date && (
                      <span className={`flex items-center gap-1 ${isOverdue(task) ? 'text-destructive font-medium' : ''}`}>
                        <Calendar className="h-3 w-3" />
                        Due: {new Date(task.due_date).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <span>
                    Created {new Date(task.created_at).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}