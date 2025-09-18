import React, { useState } from 'react';
import { ReviewSession } from '@/types/review';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Save, MessageSquare, Plus, Mail, Phone, Calendar, Flag, Users, Clock } from 'lucide-react';

interface QuickActionsSidebarProps {
  session: ReviewSession;
  onAddNote: (note: string) => void;
  onSave: () => void;
}

// Mock recent notes
const mockRecentNotes = [
  {
    id: '1',
    content: 'Strong research background, excellent fit for program',
    timestamp: new Date('2024-01-15T10:30:00'),
    section: 'background',
    author: 'Dr. Smith'
  },
  {
    id: '2',
    content: 'Minor grammar issues in personal statement, otherwise excellent',
    timestamp: new Date('2024-01-15T10:25:00'),
    section: 'essays',
    author: 'Dr. Smith'
  }
];

export function QuickActionsSidebar({ session, onAddNote, onSave }: QuickActionsSidebarProps) {
  const [noteText, setNoteText] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState('medium');
  const [taskAssignee, setTaskAssignee] = useState('');

  const handleAddNote = () => {
    if (noteText.trim()) {
      onAddNote(noteText);
      setNoteText('');
    }
  };

  const handleCreateTask = () => {
    if (taskTitle.trim()) {
      // Would integrate with task management system
      console.log('Creating task:', { title: taskTitle, priority: taskPriority, assignee: taskAssignee });
      setTaskTitle('');
      setTaskPriority('medium');
      setTaskAssignee('');
    }
  };

  const getSectionBadgeColor = (section: string) => {
    const colors = {
      documents: 'bg-blue-100 text-blue-800',
      essays: 'bg-purple-100 text-purple-800',
      background: 'bg-green-100 text-green-800',
      assessment: 'bg-orange-100 text-orange-800'
    };
    return colors[section as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="w-80 border-l p-4 space-y-4 overflow-y-auto">
      {/* Quick Notes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center">
            <MessageSquare className="h-4 w-4 mr-2" />
            Quick Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Textarea 
            placeholder="Add a note..." 
            rows={3}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          />
          <Button size="sm" className="mt-2 w-full" onClick={handleAddNote}>
            <Plus className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        </CardContent>
      </Card>

      {/* Recent Notes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Recent Notes</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {mockRecentNotes.map((note) => (
              <div key={note.id} className="p-2 bg-muted/50 rounded text-xs">
                <div className="flex items-center justify-between mb-1">
                  <Badge className={getSectionBadgeColor(note.section)}>
                    {note.section}
                  </Badge>
                  <span className="text-muted-foreground">
                    {note.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-foreground">{note.content}</p>
                <p className="text-muted-foreground mt-1">- {note.author}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Task */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Create Task
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <Input
            placeholder="Task title..."
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
          
          <Select value={taskPriority} onValueChange={setTaskPriority}>
            <SelectTrigger>
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low Priority</SelectItem>
              <SelectItem value="medium">Medium Priority</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Assign to..."
            value={taskAssignee}
            onChange={(e) => setTaskAssignee(e.target.value)}
          />

          <Button size="sm" className="w-full" onClick={handleCreateTask}>
            <Plus className="h-4 w-4 mr-2" />
            Create Task
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          <Button variant="outline" size="sm" className="w-full" onClick={onSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Progress
          </Button>
          
          <Button variant="outline" size="sm" className="w-full">
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </Button>
          
          <Button variant="outline" size="sm" className="w-full">
            <Phone className="h-4 w-4 mr-2" />
            Schedule Call
          </Button>
          
          <Button variant="outline" size="sm" className="w-full">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Interview
          </Button>
          
          <Button variant="outline" size="sm" className="w-full">
            <Flag className="h-4 w-4 mr-2" />
            Flag for Review
          </Button>
          
          <Button variant="outline" size="sm" className="w-full">
            <Users className="h-4 w-4 mr-2" />
            Assign Reviewer
          </Button>
        </CardContent>
      </Card>

      {/* Session Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Session Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time Spent:</span>
              <span className="font-medium">{session.timeSpent}m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sections Done:</span>
              <span className="font-medium">
                {session.progress.completedSections.length}/{session.progress.totalSections}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Progress:</span>
              <span className="font-medium">{session.progress.percentComplete}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <Badge variant={session.isDraft ? "secondary" : "default"} className="text-xs">
                {session.isDraft ? 'Draft' : 'Final'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}