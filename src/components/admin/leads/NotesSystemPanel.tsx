import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Plus, 
  Search, 
  User, 
  Calendar, 
  Tag,
  Edit,
  Trash2,
  Filter,
  StickyNote
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Note {
  id: string;
  category: 'general' | 'follow_up' | 'meeting' | 'concern' | 'opportunity' | 'document';
  title: string;
  content: string;
  author: string;
  createdAt: string;
  tags: string[];
  priority: 'low' | 'medium' | 'high';
}

interface NotesSystemPanelProps {
  leadId: string;
  notes?: Note[];
}

export function NotesSystemPanel({ leadId, notes = [] }: NotesSystemPanelProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNote, setNewNote] = useState({
    category: 'general' as Note['category'],
    title: '',
    content: '',
    priority: 'medium' as Note['priority'],
    tags: ''
  });

  // Demo notes
  const demoNotes: Note[] = [
    {
      id: '1',
      category: 'follow_up',
      title: 'Schedule Info Session Follow-up',
      content: 'Student expressed high interest in Computer Science program. Mentioned they need more information about internship opportunities and lab facilities.',
      author: 'Sarah Johnson',
      createdAt: '2024-01-20T14:30:00Z',
      tags: ['computer-science', 'internships', 'labs'],
      priority: 'high'
    },
    {
      id: '2',
      category: 'concern',
      title: 'Financial Aid Concerns',
      content: 'Student worried about tuition costs. Family income may qualify for need-based aid. Mentioned potential scholarship applications.',
      author: 'Mike Chen',
      createdAt: '2024-01-19T11:15:00Z',
      tags: ['financial-aid', 'scholarships', 'tuition'],
      priority: 'medium'
    },
    {
      id: '3',
      category: 'meeting',
      title: 'Virtual Campus Tour Feedback',
      content: 'Attended virtual campus tour. Loved the engineering facilities and student recreation center. Asked about housing options.',
      author: 'Lisa Park',
      createdAt: '2024-01-18T16:45:00Z',
      tags: ['campus-tour', 'engineering', 'housing'],
      priority: 'low'
    }
  ];

  const displayNotes = notes.length > 0 ? notes : demoNotes;
  
  const filteredNotes = displayNotes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'follow_up':
        return <Calendar className="h-4 w-4" />;
      case 'meeting':
        return <User className="h-4 w-4" />;
      case 'concern':
        return <Tag className="h-4 w-4" />;
      case 'opportunity':
        return <Tag className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      default:
        return <StickyNote className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'follow_up':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'meeting':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'concern':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'opportunity':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'document':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const addNote = async () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in both title and content',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Note Added Successfully',
        description: `"${newNote.title}" has been added to the lead notes`,
        variant: 'default'
      });
      
      setIsAddingNote(false);
      setNewNote({
        category: 'general',
        title: '',
        content: '',
        priority: 'medium',
        tags: ''
      });
    } catch (error) {
      toast({
        title: 'Failed to Add Note',
        description: 'There was an error adding the note. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Notes System
          </div>
          <Dialog open={isAddingNote} onOpenChange={setIsAddingNote}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Note</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Select value={newNote.category} onValueChange={(value) => setNewNote({...newNote, category: value as Note['category']})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="follow_up">Follow-up</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="concern">Concern</SelectItem>
                        <SelectItem value="opportunity">Opportunity</SelectItem>
                        <SelectItem value="document">Document</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Priority</label>
                    <Select value={newNote.priority} onValueChange={(value) => setNewNote({...newNote, priority: value as Note['priority']})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input 
                    value={newNote.title}
                    onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                    placeholder="Note title..."
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Content</label>
                  <Textarea 
                    value={newNote.content}
                    onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                    placeholder="Note content..."
                    rows={4}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Tags (comma-separated)</label>
                  <Input 
                    value={newNote.tags}
                    onChange={(e) => setNewNote({...newNote, tags: e.target.value})}
                    placeholder="tag1, tag2, tag3..."
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button onClick={addNote} className="flex-1">
                    Add Note
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddingNote(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filters */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search notes..."
              className="pl-9"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="follow_up">Follow-up</SelectItem>
              <SelectItem value="meeting">Meeting</SelectItem>
              <SelectItem value="concern">Concern</SelectItem>
              <SelectItem value="opportunity">Opportunity</SelectItem>
              <SelectItem value="document">Document</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Notes List */}
        <ScrollArea className="h-[400px]">
          {filteredNotes.length > 0 ? (
            <div className="space-y-3">
              {filteredNotes.map((note) => (
                <div key={note.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(note.category)}
                      <h4 className="font-medium">{note.title}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getPriorityColor(note.priority)}>
                        {note.priority}
                      </Badge>
                      <Button size="sm" variant="ghost">
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {note.content}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getCategoryColor(note.category)}>
                        {note.category.replace('_', ' ')}
                      </Badge>
                      {note.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {note.author} • {new Date(note.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-8 w-8 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground font-medium">
                {searchTerm || selectedCategory !== 'all' ? 'No matching notes found' : 'No notes yet'}
              </p>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                {searchTerm || selectedCategory !== 'all' ? 'Try adjusting your search or filters' : 'Add your first note to get started'}
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}