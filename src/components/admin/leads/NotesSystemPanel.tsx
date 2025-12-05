import { useState, useEffect, useCallback } from 'react';
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
  StickyNote,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LeadNotesService } from '@/services/leadNotesService';
import { LeadNote } from '@/types/leadEnhancements';

interface NotesSystemPanelProps {
  leadId: string;
}

type NoteCategory = 'general' | 'follow_up' | 'meeting' | 'concern' | 'opportunity' | 'document';

export function NotesSystemPanel({ leadId }: NotesSystemPanelProps) {
  const { toast } = useToast();
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingNote, setEditingNote] = useState<LeadNote | null>(null);
  const [newNote, setNewNote] = useState({
    note_type: 'general' as string,
    content: '',
  });

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedNotes = await LeadNotesService.getNotes(leadId);
      setNotes(fetchedNotes);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load notes',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [leadId, toast]);

  useEffect(() => {
    if (leadId) {
      fetchNotes();
    }
  }, [leadId, fetchNotes]);
  
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || note.note_type === selectedCategory;
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

  const addNote = async () => {
    if (!newNote.content.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please enter note content',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await LeadNotesService.createNote(leadId, {
        content: newNote.content,
        note_type: newNote.note_type as any,
      });
      
      toast({
        title: 'Note Added Successfully',
        description: 'Your note has been saved',
      });
      
      setIsAddingNote(false);
      setNewNote({ note_type: 'general', content: '' });
      fetchNotes();
    } catch (error) {
      console.error('Error adding note:', error);
      toast({
        title: 'Failed to Add Note',
        description: 'There was an error adding the note. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateNote = async () => {
    if (!editingNote || !editingNote.content.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please enter note content',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await LeadNotesService.updateNote(editingNote.id, {
        content: editingNote.content,
        note_type: editingNote.note_type as any
      });
      
      toast({
        title: 'Note Updated',
        description: 'Your note has been updated',
      });
      
      setEditingNote(null);
      fetchNotes();
    } catch (error) {
      console.error('Error updating note:', error);
      toast({
        title: 'Failed to Update Note',
        description: 'There was an error updating the note.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      await LeadNotesService.deleteNote(noteId);
      toast({
        title: 'Note Deleted',
        description: 'The note has been removed',
      });
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: 'Failed to Delete Note',
        description: 'There was an error deleting the note.',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Notes System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading notes...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

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
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Select 
                    value={newNote.note_type} 
                    onValueChange={(value) => setNewNote({...newNote, note_type: value})}
                  >
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
                  <label className="text-sm font-medium">Content</label>
                  <Textarea 
                    value={newNote.content}
                    onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                    placeholder="Note content..."
                    rows={4}
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button onClick={addNote} className="flex-1" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      'Add Note'
                    )}
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
                      {getCategoryIcon(note.note_type)}
                      <Badge variant="outline" className={getCategoryColor(note.note_type)}>
                        {note.note_type.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => setEditingNote(note)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => deleteNote(note.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-foreground mb-3">
                    {note.content}
                  </p>
                  
                  <div className="text-xs text-muted-foreground">
                    {new Date(note.created_at).toLocaleDateString()} at {new Date(note.created_at).toLocaleTimeString()}
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
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Add your first note to get started'}
              </p>
              {!searchTerm && selectedCategory === 'all' && (
                <Button size="sm" onClick={() => setIsAddingNote(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Note
                </Button>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Edit Note Dialog */}
        <Dialog open={!!editingNote} onOpenChange={(open) => !open && setEditingNote(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Note</DialogTitle>
            </DialogHeader>
            {editingNote && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Select 
                    value={editingNote.note_type} 
                    onValueChange={(value) => setEditingNote({...editingNote, note_type: value as any})}
                  >
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
                  <label className="text-sm font-medium">Content</label>
                  <Textarea 
                    value={editingNote.content}
                    onChange={(e) => setEditingNote({...editingNote, content: e.target.value})}
                    placeholder="Note content..."
                    rows={4}
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button onClick={updateNote} className="flex-1" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setEditingNote(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
