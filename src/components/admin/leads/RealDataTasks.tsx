import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLeadTasks } from '@/hooks/useLeadData';
import { CheckCircle, Clock, Plus, User, Calendar, Flag, Check, Trash2, Edit, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useTeamMembers } from '@/hooks/useTeamMembers';

interface RealDataTasksProps {
  leadId: string;
}

export function RealDataTasks({ leadId }: RealDataTasksProps) {
  const { tasks, loading, error, refetch } = useLeadTasks(leadId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [editingTaskId, setEditingTaskId] = useState<string>('');
  const { teamMembers } = useTeamMembers();
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: '',
    task_type: '',
    due_date: '',
    assigned_to: '',
    tags: [] as string[]
  });
  const [editTask, setEditTask] = useState({
    title: '',
    description: '',
    priority: '',
    task_type: '',
    due_date: '',
    assigned_to: '',
    tags: [] as string[]
  });
  const [tagInput, setTagInput] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
        setNewTask(prev => ({ ...prev, assigned_to: user.id }));
      }
    };
    fetchCurrentUser();
  }, []);

  const quickTemplates = [
    { label: 'Follow up with lead', title: 'Follow up with lead', description: 'Schedule follow-up call or email', category: 'follow_up' },
    { label: 'Review application documents', title: 'Review application documents', description: 'Check all submitted documents', category: 'document_review' },
    { label: 'Follow up on payment', title: 'Follow up on payment', description: 'Check payment status and follow up', category: 'follow_up' },
    { label: 'Prepare for consultation meeting', title: 'Prepare for consultation meeting', description: 'Prepare materials for consultation', category: 'interview' },
    { label: 'Update student records', title: 'Update student records', description: 'Update lead information in system', category: 'other' }
  ];

  const handleTemplateClick = (template: typeof quickTemplates[0]) => {
    setNewTask({
      ...newTask,
      title: template.title,
      description: template.description,
      task_type: template.category
    });
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!newTask.tags.includes(tagInput.trim())) {
        setNewTask({ ...newTask, tags: [...newTask.tags, tagInput.trim()] });
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewTask({ ...newTask, tags: newTask.tags.filter(tag => tag !== tagToRemove) });
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('lead_tasks')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Task marked as completed",
      });

      refetch();
    } catch (err) {
      console.error('Error completing task:', err);
      toast({
        title: "Error",
        description: "Failed to complete task",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('lead_tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Task deleted",
      });

      refetch();
    } catch (err) {
      console.error('Error deleting task:', err);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  const handleEditTask = (task: any) => {
    setEditingTaskId(task.id);
    setEditTask({
      title: task.title || '',
      description: task.description || '',
      priority: task.priority || '',
      task_type: task.task_type || '',
      due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '',
      assigned_to: task.assigned_to || '',
      tags: []
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateTask = async () => {
    if (!editTask.title.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('lead_tasks')
        .update({
          title: editTask.title,
          description: editTask.description || null,
          priority: editTask.priority,
          task_type: editTask.task_type,
          due_date: editTask.due_date || null,
          assigned_to: editTask.assigned_to || null,
        })
        .eq('id', editingTaskId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Task updated successfully",
      });

      setIsEditDialogOpen(false);
      setEditingTaskId('');
      refetch();
    } catch (err) {
      console.error('Error updating task:', err);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Not authenticated');
      }

      const { error } = await supabase
        .from('lead_tasks')
        .insert({
          lead_id: leadId,
          user_id: user.id,
          title: newTask.title,
          description: newTask.description || null,
          priority: newTask.priority || 'medium',
          task_type: newTask.task_type || 'general',
          due_date: newTask.due_date || null,
          assigned_to: newTask.assigned_to || null,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Task created successfully",
      });

      setIsDialogOpen(false);
      setNewTask({
        title: '',
        description: '',
        priority: '',
        task_type: '',
        due_date: '',
        assigned_to: currentUserId,
        tags: []
      });
      setTagInput('');
      refetch();
    } catch (err) {
      console.error('Error creating task:', err);
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      urgent: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    
    return (
      <Badge variant="outline" className={colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {priority}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading tasks...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600">Error: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeTasks = tasks.filter(task => task.status !== 'completed' && task.status !== 'cancelled');
  const completedTasks = tasks.filter(task => task.status === 'completed' || task.status === 'cancelled');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Tasks ({activeTasks.length} active, {completedTasks.length} completed)
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create New Task
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                {/* Quick Templates */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Quick Templates</Label>
                  <div className="flex flex-wrap gap-2">
                    {quickTemplates.map((template, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => handleTemplateClick(template)}
                        type="button"
                      >
                        {template.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Task Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Task Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="Enter task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter task description..."
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Priority */}
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select value={newTask.priority} onValueChange={(value) => setNewTask({ ...newTask, priority: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Task Type */}
                  <div className="space-y-2">
                    <Label>Task Type</Label>
                    <Select value={newTask.task_type} onValueChange={(value) => setNewTask({ ...newTask, task_type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="follow_up">Follow Up</SelectItem>
                        <SelectItem value="document_review">Document Review</SelectItem>
                        <SelectItem value="interview">Interview</SelectItem>
                        <SelectItem value="call">Call</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Due Date */}
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Input
                      type="date"
                      value={newTask.due_date}
                      onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                    />
                  </div>

                  {/* Assignee */}
                  <div className="space-y-2">
                    <Label>Assign To</Label>
                    <Select value={newTask.assigned_to} onValueChange={(value) => setNewTask({ ...newTask, assigned_to: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        {teamMembers.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <Input
                    placeholder="Type a tag and press Enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                  />
                  {newTask.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {newTask.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveTag(tag)}>
                          {tag} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleCreateTask} className="flex-1" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Task
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="font-medium text-foreground mb-2">No tasks yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first task to start tracking follow-ups and actions
            </p>
            <Button size="sm" onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Task
            </Button>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {/* Active Tasks */}
              {activeTasks.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Active Tasks</h4>
                  {activeTasks.map((task: any) => (
                    <div key={task.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-medium">{task.title}</h5>
                            {task.priority && getPriorityBadge(task.priority)}
                            {getStatusBadge(task.status)}
                          </div>
                          {task.description && (
                            <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            {task.due_date && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Due: {format(new Date(task.due_date), 'MMM d, yyyy')}
                              </span>
                            )}
                            {task.task_type && (
                              <span className="capitalize">{task.task_type.replace('_', ' ')}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCompleteTask(task.id)}
                            title="Mark as complete"
                          >
                            <Check className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditTask(task)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Completed Tasks */}
              {completedTasks.length > 0 && (
                <div className="space-y-2 mt-4">
                  <h4 className="text-sm font-medium text-muted-foreground">Completed Tasks</h4>
                  {completedTasks.map((task: any) => (
                    <div key={task.id} className="border rounded-lg p-3 opacity-60">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-medium line-through">{task.title}</h5>
                            {getStatusBadge(task.status)}
                          </div>
                          {task.completed_at && (
                            <p className="text-xs text-muted-foreground">
                              Completed: {format(new Date(task.completed_at), 'MMM d, yyyy')}
                            </p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>

      {/* Edit Task Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Task Title *</Label>
              <Input
                value={editTask.title}
                onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={editTask.description}
                onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={editTask.priority} onValueChange={(value) => setEditTask({ ...editTask, priority: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={editTask.due_date}
                  onChange={(e) => setEditTask({ ...editTask, due_date: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button onClick={handleUpdateTask} className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
