import React, { useState } from "react";
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
  Plus
} from "lucide-react";

export function PersonalAssignments() {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("due_date");

  const tasks = [
    {
      id: "1",
      title: "Review MBA application - Sarah Johnson",
      description: "Complete document review and provide feedback",
      priority: "high",
      dueDate: "2024-01-15T15:00:00",
      status: "pending",
      category: "admissions",
      assignedBy: "Emily Davis",
      estimatedTime: "30 min",
      tags: ["urgent", "review"]
    },
    {
      id: "2", 
      title: "Follow up with overdue payment - Mike Chen",
      description: "Contact student regarding outstanding tuition payment",
      priority: "urgent",
      dueDate: "2024-01-14T10:00:00",
      status: "pending",
      category: "finance",
      assignedBy: "Finance Team",
      estimatedTime: "15 min",
      tags: ["payment", "follow-up"]
    },
    {
      id: "3",
      title: "Prepare consultation materials",
      description: "Gather program information for upcoming student meeting",
      priority: "medium",
      dueDate: "2024-01-16T09:00:00",
      status: "in_progress",
      category: "consultation",
      assignedBy: "Self",
      estimatedTime: "45 min",
      tags: ["meeting", "preparation"]
    },
    {
      id: "4",
      title: "Update student records - Biology intake",
      description: "Enter new student information into system",
      priority: "low", 
      dueDate: "2024-01-18T17:00:00",
      status: "pending",
      category: "administration",
      assignedBy: "Admin Team",
      estimatedTime: "20 min",
      tags: ["data-entry", "intake"]
    }
  ];

  const completedTasks = [
    {
      id: "5",
      title: "Send welcome email to new students",
      completedAt: "2024-01-13T14:30:00",
      category: "communication",
      priority: "medium"
    },
    {
      id: "6", 
      title: "Process scholarship applications",
      completedAt: "2024-01-12T16:45:00",
      category: "finance",
      priority: "high"
    }
  ];

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

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'urgent') return task.priority === 'urgent';
    if (filter === 'overdue') return isOverdue(task.dueDate);
    if (filter === 'today') {
      const today = new Date().toDateString();
      return new Date(task.dueDate).toDateString() === today;
    }
    return task.status === filter;
  });

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    overdue: tasks.filter(t => isOverdue(t.dueDate)).length,
    completed: completedTasks.length
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Assignments</h1>
          <p className="text-muted-foreground">Manage your tasks and track progress</p>
        </div>
        <Button className="flex items-center space-x-2">
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

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active Tasks ({filteredTasks.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {filteredTasks.map((task) => (
            <Card key={task.id} className={`${isOverdue(task.dueDate) ? 'border-red-200 bg-red-50/50' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
                      <h3 className="font-semibold text-foreground">{task.title}</h3>
                      {isOverdue(task.dueDate) && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Overdue
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">{task.description}</p>

                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span className={isOverdue(task.dueDate) ? 'text-red-600' : ''}>
                          Due {formatDate(task.dueDate)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{task.estimatedTime}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>From {task.assignedBy}</span>
                      </div>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status.replace('_', ' ')}
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-2 mt-3">
                      {task.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Comment
                    </Button>
                    <Button size="sm">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Complete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredTasks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No tasks found matching your filter criteria</p>
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
                      Completed {formatDate(task.completedAt)}
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
        </TabsContent>
      </Tabs>
    </div>
  );
}