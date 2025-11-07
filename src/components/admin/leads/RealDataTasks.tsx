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
import { CheckCircle, Clock, Plus, User, Calendar, Flag, Check, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface RealDataTasksProps {
  leadId: string;
}

export function RealDataTasks({ leadId }: RealDataTasksProps) {
  const { tasks, loading, error, refetch } = useLeadTasks(leadId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teamMembers, setTeamMembers] = useState<Array<{ id: string; name: string; email: string }>>([]);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [editingTaskId, setEditingTaskId] = useState<string>('');
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
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Get current user info
        const currentUser = {
          id: user.id,
          name: user.user_metadata?.full_name || user.email || 'Me',
          email: user.email || ''
        };

        // For now, just show current user. In the future, you can fetch actual team members
        setTeamMembers([currentUser]);
        setNewTask(prev => ({ ...prev, assigned_to: user.id }));
      }
    };

    if (isDialogOpen) {
      fetchTeamMembers();
    }
  }, [isDialogOpen]);

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
          priority: newTask.priority,
          task_type: newTask.task_type,
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
        assigned_to: '',
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

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Flag className="h-4 w-4 text-red-600" />;
      case 'high':
        return <Flag className="h-4 w-4 text-orange-600" />;
      case 'medium':
        return <Flag className="h-4 w-4 text-yellow-600" />;
      case 'low':
        return <Flag className="h-4 w-4 text-green-600" />;
      default:
        return <Flag className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'cancelled':
        return <CheckCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
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
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading tasks...</p>
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

  // Demo tasks to show when no real tasks exist
  const demoTasks = [
    {
      id: 'demo-1',
      title: 'Follow up call with student',
      description: 'Discuss program details and answer questions about curriculum',
      status: 'pending',
      priority: 'high',
      task_type: 'call',
      due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      assigned_to: 'current-user',
      lead_id: leadId,
      user_id: 'current-user'
    },
    {
      id: 'demo-2',
      title: 'Review application documents',
      description: 'Check transcripts and recommendation letters for completeness',
      status: 'in_progress',
      priority: 'medium',
      task_type: 'document_review',
      due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      assigned_to: 'other-user',
      lead_id: leadId,
      user_id: 'other-user'
    },
    {
      id: 'demo-3',
      title: 'Send scholarship information',
      description: 'Email details about merit-based scholarships and financial aid options',
      status: 'pending',
      priority: 'medium',
      task_type: 'follow_up',
      due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      assigned_to: 'current-user',
      lead_id: leadId,
      user_id: 'current-user'
    },
    {
      id: 'demo-4',
      title: 'Schedule campus tour',
      description: 'Coordinate with admissions office for personalized campus visit',
      status: 'completed',
      priority: 'low',
      task_type: 'interview',
      due_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      completed_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      assigned_to: 'other-user',
      lead_id: leadId,
      user_id: 'other-user'
    }
  ];

  // Use demo tasks if no real tasks exist
  const displayTasks = tasks.length > 0 ? tasks : demoTasks;
  const displayActiveTasks = displayTasks.filter(task => task.status !== 'completed' && task.status !== 'cancelled');
  const displayCompletedTasks = displayTasks.filter(task => task.status === 'completed' || task.status === 'cancelled');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Tasks ({displayActiveTasks.length} active, {displayCompletedTasks.length} completed)
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

                {/* Priority and Assign To */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">
                      Priority <span className="text-red-500">*</span>
                    </Label>
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
                  <div className="space-y-2">
                    <Label htmlFor="assign_to">Assign To</Label>
                    <Select value={newTask.assigned_to} onValueChange={(value) => setNewTask({ ...newTask, assigned_to: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select team member" />
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

                {/* Due Date and Category */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="due_date">Due Date</Label>
                    <Input
                      id="due_date"
                      type="date"
                      value={newTask.due_date}
                      onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={newTask.task_type} onValueChange={(value) => setNewTask({ ...newTask, task_type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="call">Call</SelectItem>
                        <SelectItem value="follow_up">Follow Up</SelectItem>
                        <SelectItem value="document_review">Document Review</SelectItem>
                        <SelectItem value="interview">Interview</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <div className="relative">
                    <Input
                      id="tags"
                      placeholder="Enter tag and press Enter"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                    />
                    <Flag className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  {newTask.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {newTask.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="gap-1">
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 hover:text-destructive"
                            type="button"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} type="button">
                  Cancel
                </Button>
                <Button onClick={handleCreateTask} disabled={isSubmitting || !newTask.title.trim() || !newTask.priority}>
                  <Plus className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Creating...' : 'Create Task'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className={`${displayTasks.length <= 2 ? 'h-auto max-h-[300px]' : displayTasks.length <= 4 ? 'h-auto max-h-[500px]' : 'h-[600px]'}`}>
          <div className="space-y-4">
            {/* Active Tasks */}
            {displayActiveTasks.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Active Tasks</h4>
                <div className="space-y-3">
                  {displayActiveTasks.map((task) => {
                    const isAssignedToOther = task.assigned_to && task.assigned_to !== currentUserId && task.assigned_to !== 'current-user';
                    
                    return (
                      <div 
                        key={task.id} 
                        className={`border rounded-lg p-4 ${isAssignedToOther ? 'border-blue-200 bg-blue-50/50' : ''}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2 flex-1">
                            {getStatusIcon(task.status)}
                            <span className="font-medium">{task.title}</span>
                            {isAssignedToOther && (
                              <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700 border-blue-300">
                                <User className="h-3 w-3 mr-1" />
                                Other Team Member
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {getPriorityBadge(task.priority)}
                            {getStatusBadge(task.status)}
                            <div className="flex gap-1 ml-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 hover:bg-blue-100 hover:text-blue-700"
                                onClick={() => handleEditTask(task)}
                                title="Edit task"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 hover:bg-green-100 hover:text-green-700"
                                onClick={() => handleCompleteTask(task.id)}
                                title="Mark as complete"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 hover:bg-red-100 hover:text-red-700"
                                onClick={() => handleDeleteTask(task.id)}
                                title="Delete task"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {task.description && (
                          <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                        )}

                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-3">
                          {task.due_date && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>Due: {format(new Date(task.due_date), 'PPP')}</span>
                            </div>
                          )}
                          {task.assigned_to && (
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{isAssignedToOther ? 'Team member' : 'You'}</span>
                            </div>
                          )}
                        </div>

                        <div className="text-xs text-muted-foreground">
                          Created {format(new Date(task.created_at), 'PPP')}
                          {task.task_type && ` • ${task.task_type}`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Completed Tasks */}
            {displayCompletedTasks.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Completed Tasks</h4>
                <div className="space-y-3">
                  {displayCompletedTasks.map((task) => {
                    const isAssignedToOther = task.assigned_to && task.assigned_to !== currentUserId && task.assigned_to !== 'current-user';
                    
                    return (
                      <div 
                        key={task.id} 
                        className={`border rounded-lg p-4 opacity-75 ${isAssignedToOther ? 'border-blue-200 bg-blue-50/30' : ''}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2 flex-1">
                            {getStatusIcon(task.status)}
                            <span className="font-medium line-through">{task.title}</span>
                            {isAssignedToOther && (
                              <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700 border-blue-300">
                                <User className="h-3 w-3 mr-1" />
                                Other Team Member
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {getPriorityBadge(task.priority)}
                            {getStatusBadge(task.status)}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 hover:bg-red-100 hover:text-red-700 ml-2"
                              onClick={() => handleDeleteTask(task.id)}
                              title="Delete task"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {task.description && (
                          <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                        )}

                        <div className="text-xs text-muted-foreground">
                          {task.completed_at ? (
                            <span>Completed {format(new Date(task.completed_at), 'PPP')}</span>
                          ) : (
                            <span>Created {format(new Date(task.created_at), 'PPP')}</span>
                          )}
                          {task.task_type && ` • ${task.task_type}`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      {/* Edit Task Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit Task
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Task Title */}
            <div className="space-y-2">
              <Label htmlFor="edit-title">
                Task Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-title"
                placeholder="Enter task title"
                value={editTask.title}
                onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                placeholder="Enter task description..."
                value={editTask.description}
                onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                rows={3}
              />
            </div>

            {/* Priority and Assign To */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-priority">
                  Priority <span className="text-red-500">*</span>
                </Label>
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
                <Label htmlFor="edit-assign-to">Assign To</Label>
                <Select value={editTask.assigned_to} onValueChange={(value) => setEditTask({ ...editTask, assigned_to: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team member" />
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

            {/* Due Date and Category */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-due-date">Due Date</Label>
                <Input
                  id="edit-due-date"
                  type="date"
                  value={editTask.due_date}
                  onChange={(e) => setEditTask({ ...editTask, due_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select value={editTask.task_type} onValueChange={(value) => setEditTask({ ...editTask, task_type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="call">Call</SelectItem>
                    <SelectItem value="follow_up">Follow Up</SelectItem>
                    <SelectItem value="document_review">Document Review</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} type="button">
              Cancel
            </Button>
            <Button onClick={handleUpdateTask} disabled={isSubmitting || !editTask.title.trim() || !editTask.priority}>
              {isSubmitting ? 'Updating...' : 'Update Task'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}