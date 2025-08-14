import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ClipboardList, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  User, 
  Calendar,
  Filter,
  SortAsc,
  Flag,
  MessageSquare,
  Plus,
  Loader2,
  Edit,
  Trash2
} from "lucide-react";
import { UniversalTaskService } from "@/services/universalTaskService";
import { UniversalTask, TaskStatus } from "@/types/universalTask";
import { UniversalTaskModal } from "./UniversalTaskModal";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function PersonalAssignments() {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("due_date");
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<UniversalTask[]>([]);
  const [assignedToMeTasks, setAssignedToMeTasks] = useState<UniversalTask[]>([]);
  const [assignedByMeTasks, setAssignedByMeTasks] = useState<UniversalTask[]>([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadTasks();
    loadCurrentUser();
    loadTeamMembers();
  }, []);

  const loadCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
  };

  const loadTeamMembers = async () => {
    try {
      const members = await UniversalTaskService.getTeamMembers();
      setTeamMembers(members);
    } catch (error) {
      console.error('Error loading team members:', error);
    }
  };

  const loadTasks = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Load tasks assigned to me
      const assignedToMe = await UniversalTaskService.getTasks({ assigned_to: user.id });
      setAssignedToMeTasks(assignedToMe || []);

      // Load tasks assigned by me
      const allTasks = await UniversalTaskService.getTasks();
      const assignedByMe = (allTasks || []).filter(task => 
        task.user_id === user.id && task.assigned_to && task.assigned_to !== user.id
      );
      setAssignedByMeTasks(assignedByMe);

      // Combine for overall stats
      const combinedTasks = [...(assignedToMe || []), ...assignedByMe];
      setTasks(combinedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated = () => {
    loadTasks();
    setShowTaskModal(false);
    toast({
      title: "Success",
      description: "Task created successfully",
    });
  };

  const handleCompleteTask = async (taskId: string, currentStatus: TaskStatus) => {
    try {
      const newStatus: TaskStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      await UniversalTaskService.updateTask(taskId, { status: newStatus });
      loadTasks();
      toast({
        title: "Success",
        description: `Task ${newStatus === 'completed' ? 'completed' : 'reopened'}`,
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

  const handleDeleteTask = async (taskId: string) => {
    try {
      await UniversalTaskService.deleteTask(taskId);
      loadTasks();
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

  const getAssigneeName = (assignedTo: string) => {
    if (!assignedTo) return 'Unassigned';
    if (assignedTo === currentUser?.id) return 'You';
    const member = teamMembers.find(m => m.id === assignedTo);
    return member ? member.name : 'Unknown User';
  };

  const getEntityInfo = (entityType: string, entityId: string) => {
    // This would normally fetch from the database
    // For now, return placeholder info
    return `${entityType}: ${entityId.substring(0, 8)}...`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-orange-600 bg-orange-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const filterTasks = (taskList: UniversalTask[]) => {
    return taskList.filter(task => {
      if (filter === 'all') return true;
      if (filter === 'urgent') return task.priority === 'urgent';
      if (filter === 'overdue') return task.due_date && isOverdue(task.due_date);
      if (filter === 'today') {
        if (!task.due_date) return false;
        const today = new Date().toDateString();
        return new Date(task.due_date).toDateString() === today;
      }
      return task.status === filter;
    });
  };

  const sortTasks = (taskList: UniversalTask[]) => {
    return [...taskList].sort((a, b) => {
      switch (sortBy) {
        case 'due_date':
          if (!a.due_date && !b.due_date) return 0;
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'created':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });
  };

  const filteredAssignedToMe = sortTasks(filterTasks(assignedToMeTasks));
  const filteredAssignedByMe = sortTasks(filterTasks(assignedByMeTasks));
  const completedTasks = tasks.filter(t => t.status === 'completed');

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    overdue: tasks.filter(t => t.due_date && isOverdue(t.due_date) && t.status !== 'completed').length,
    completed: completedTasks.length
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Assignments</h1>
          <p className="text-muted-foreground">Manage your tasks and track progress</p>
        </div>
        <Button className="flex items-center space-x-2" onClick={() => setShowTaskModal(true)}>
          <Plus className="h-4 w-4" />
          <span>Create Task</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{taskStats.total}</div>
            <p className="text-sm text-muted-foreground">Total Tasks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{taskStats.pending}</div>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{taskStats.inProgress}</div>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{taskStats.overdue}</div>
            <p className="text-sm text-muted-foreground">Overdue</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Sort */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="today">Due Today</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <SortAsc className="h-4 w-4" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="due_date">Due Date</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="category">Category</SelectItem>
              <SelectItem value="created">Created</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="assigned-to-me" className="w-full">
        <TabsList>
          <TabsTrigger value="assigned-to-me">Assigned to Me ({filteredAssignedToMe.length})</TabsTrigger>
          <TabsTrigger value="assigned-by-me">I Assigned ({filteredAssignedByMe.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="assigned-to-me" className="space-y-4">
          {filteredAssignedToMe.map((task) => (
            <Card key={task.id} className={`${task.due_date && isOverdue(task.due_date) && task.status !== 'completed' ? 'border-red-200 bg-red-50/50' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
                      <h3 className="font-semibold text-foreground">{task.title}</h3>
                      {task.due_date && isOverdue(task.due_date) && task.status !== 'completed' && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Overdue
                        </Badge>
                      )}
                    </div>

                    {task.description && (
                      <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                    )}

                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                      {task.due_date && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span className={task.due_date && isOverdue(task.due_date) && task.status !== 'completed' ? 'text-red-600' : ''}>
                            Due {formatDate(task.due_date)}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>For {getEntityInfo(task.entity_type, task.entity_id)}</span>
                      </div>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline">{task.category}</Badge>
                    </div>

                    {task.tags && task.tags.length > 0 && (
                      <div className="flex items-center space-x-2 mt-3">
                        {task.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleCompleteTask(task.id, task.status)}
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      {task.status === 'completed' ? 'Reopen' : 'Complete'}
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredAssignedToMe.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No tasks assigned to you matching the filter criteria</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="assigned-by-me" className="space-y-4">
          {filteredAssignedByMe.map((task) => (
            <Card key={task.id} className={`${task.due_date && isOverdue(task.due_date) && task.status !== 'completed' ? 'border-red-200 bg-red-50/50' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
                      <h3 className="font-semibold text-foreground">{task.title}</h3>
                      {task.due_date && isOverdue(task.due_date) && task.status !== 'completed' && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Overdue
                        </Badge>
                      )}
                    </div>

                    {task.description && (
                      <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                    )}

                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                      {task.due_date && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span className={task.due_date && isOverdue(task.due_date) && task.status !== 'completed' ? 'text-red-600' : ''}>
                            Due {formatDate(task.due_date)}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>Assigned to {getAssigneeName(task.assigned_to || '')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Flag className="h-3 w-3" />
                        <span>For {getEntityInfo(task.entity_type, task.entity_id)}</span>
                      </div>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline">{task.category}</Badge>
                    </div>

                    {task.tags && task.tags.length > 0 && (
                      <div className="flex items-center space-x-2 mt-3">
                        {task.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredAssignedByMe.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No tasks assigned by you matching the filter criteria</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedTasks.map((task) => (
            <Card key={task.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <h3 className="font-medium text-foreground">{task.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Completed {task.completed_at ? formatDate(task.completed_at) : 'Unknown'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{task.category}</Badge>
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {completedTasks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No completed tasks found</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <UniversalTaskModal
        open={showTaskModal}
        onOpenChange={setShowTaskModal}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  );
}