import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CheckSquare, Plus, Clock, AlertCircle, StickyNote, Phone, Calendar, Star } from 'lucide-react';
import { Lead } from '@/types/lead';
import { LeadTask, LeadNote, TaskFormData, NoteFormData, TaskPriority, TaskStatus, TaskType, NoteType } from '@/types/leadEnhancements';
import { LeadTaskService } from '@/services/leadTaskService';
import { LeadNotesService } from '@/services/leadNotesService';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface TasksAndNotesProps {
  lead: Lead;
  onUpdate: () => void;
}

export function TasksAndNotes({ lead, onUpdate }: TasksAndNotesProps) {
  const [tasks, setTasks] = useState<LeadTask[]>([]);
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const { toast } = useToast();

  const [newTask, setNewTask] = useState<TaskFormData>({
    title: '',
    description: '',
    task_type: 'follow_up',
    priority: 'medium',
    status: 'pending'
  });

  const [newNote, setNewNote] = useState<NoteFormData>({
    note_type: 'general',
    content: '',
    is_private: false
  });

  useEffect(() => {
    loadData();
  }, [lead.id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksData, notesData] = await Promise.all([
        LeadTaskService.getTasks(lead.id),
        LeadNotesService.getNotes(lead.id)
      ]);
      setTasks(tasksData);
      setNotes(notesData);
    } catch (error) {
      console.error('Error loading tasks and notes:', error);
      toast({
        title: "Error",
        description: "Failed to load tasks and notes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    try {
      await LeadTaskService.createTask(lead.id, newTask);
      setNewTask({
        title: '',
        description: '',
        task_type: 'follow_up',
        priority: 'medium',
        status: 'pending'
      });
      setTaskDialogOpen(false);
      loadData();
      onUpdate();
      toast({
        title: "Success",
        description: "Task created successfully"
      });
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive"
      });
    }
  };

  const handleCreateNote = async () => {
    try {
      await LeadNotesService.createNote(lead.id, newNote);
      setNewNote({
        note_type: 'general',
        content: '',
        is_private: false
      });
      setNoteDialogOpen(false);
      loadData();
      onUpdate();
      toast({
        title: "Success",
        description: "Note created successfully"
      });
    } catch (error) {
      console.error('Error creating note:', error);
      toast({
        title: "Error",
        description: "Failed to create note",
        variant: "destructive"
      });
    }
  };

  const handleCompleteTask = async (taskId: string, currentStatus: TaskStatus) => {
    try {
      const newStatus: TaskStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      await LeadTaskService.updateTask(taskId, { status: newStatus });
      loadData();
      onUpdate();
      toast({
        title: "Success",
        description: `Task ${newStatus === 'completed' ? 'completed' : 'reopened'}`
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive"
      });
    }
  };

  const getPriorityIcon = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent': return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'high': return <Star className="h-4 w-4 text-orange-500" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low': return <Clock className="h-4 w-4 text-muted-foreground" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getTaskTypeIcon = (type: TaskType) => {
    switch (type) {
      case 'call': return <Phone className="h-4 w-4" />;
      case 'meeting': return <Calendar className="h-4 w-4" />;
      default: return <CheckSquare className="h-4 w-4" />;
    }
  };

  const pendingTasks = tasks.filter(task => task.status !== 'completed');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            Tasks & Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            Tasks & Notes
          </div>
          <div className="flex gap-2">
            <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="task-title">Title</Label>
                    <Input
                      id="task-title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      placeholder="Task title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="task-description">Description</Label>
                    <Textarea
                      id="task-description"
                      value={newTask.description || ''}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      placeholder="Task description"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Type</Label>
                      <Select value={newTask.task_type} onValueChange={(value: TaskType) => setNewTask({ ...newTask, task_type: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="follow_up">Follow Up</SelectItem>
                          <SelectItem value="call">Call</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="meeting">Meeting</SelectItem>
                          <SelectItem value="research">Research</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Priority</Label>
                      <Select value={newTask.priority} onValueChange={(value: TaskPriority) => setNewTask({ ...newTask, priority: value })}>
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
                    <Label htmlFor="task-due-date">Due Date</Label>
                    <Input
                      id="task-due-date"
                      type="datetime-local"
                      value={newTask.due_date || ''}
                      onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleCreateTask} disabled={!newTask.title.trim()}>
                    Create Task
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Note
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Note</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Note Type</Label>
                    <Select value={newNote.note_type} onValueChange={(value: NoteType) => setNewNote({ ...newNote, note_type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="qualification">Qualification</SelectItem>
                        <SelectItem value="objection">Objection</SelectItem>
                        <SelectItem value="interest">Interest</SelectItem>
                        <SelectItem value="follow_up">Follow Up</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="note-content">Content</Label>
                    <Textarea
                      id="note-content"
                      value={newNote.content}
                      onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                      placeholder="Enter your note here..."
                      rows={5}
                    />
                  </div>
                  <Button onClick={handleCreateNote} disabled={!newNote.content.trim()}>
                    Add Note
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tasks">Tasks ({pendingTasks.length})</TabsTrigger>
            <TabsTrigger value="notes">Notes ({notes.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tasks" className="space-y-4">
            {pendingTasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No pending tasks</p>
              </div>
            ) : (
              <div className="space-y-2">
                {pendingTasks.map((task) => (
                  <div key={task.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCompleteTask(task.id, task.status)}
                      className="mt-1"
                    >
                      <CheckSquare className="h-4 w-4" />
                    </Button>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        {getTaskTypeIcon(task.task_type)}
                        <span className="font-medium">{task.title}</span>
                        {getPriorityIcon(task.priority)}
                        <Badge variant="outline" className="text-xs">
                          {task.priority}
                        </Badge>
                      </div>
                      {task.description && (
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                      )}
                      {task.due_date && (
                        <p className="text-xs text-muted-foreground">
                          Due: {format(new Date(task.due_date), 'MMM d, yyyy h:mm a')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {completedTasks.length > 0 && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Completed ({completedTasks.length})</h4>
                  {completedTasks.map((task) => (
                    <div key={task.id} className="flex items-start gap-3 p-3 border rounded-lg opacity-60">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCompleteTask(task.id, task.status)}
                        className="mt-1"
                      >
                        <CheckSquare className="h-4 w-4 fill-current" />
                      </Button>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          {getTaskTypeIcon(task.task_type)}
                          <span className="font-medium line-through">{task.title}</span>
                          <Badge variant="secondary" className="text-xs">
                            Completed
                          </Badge>
                        </div>
                        {task.completed_at && (
                          <p className="text-xs text-muted-foreground">
                            Completed: {format(new Date(task.completed_at), 'MMM d, yyyy h:mm a')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            {notes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <StickyNote className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No notes added yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div key={note.id} className="p-3 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <StickyNote className="h-4 w-4" />
                        <Badge variant="outline" className="text-xs">
                          {note.note_type.replace('_', ' ')}
                        </Badge>
                        {note.is_private && (
                          <Badge variant="secondary" className="text-xs">
                            Private
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(note.created_at), 'MMM d, yyyy h:mm a')}
                      </span>
                    </div>
                    <p className="text-sm">{note.content}</p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}