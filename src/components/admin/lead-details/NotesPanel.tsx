import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, StickyNote } from 'lucide-react';
import { LeadNote, NoteFormData } from '@/types/leadEnhancements';
import { LeadNotesService } from '@/services/leadNotesService';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';

interface NotesPanelProps {
  leadId: string;
  notes: LeadNote[];
  onNoteCreated: (note: LeadNote) => void;
  loading: boolean;
}

export function NotesPanel({ leadId, notes, onNoteCreated, loading }: NotesPanelProps) {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm<NoteFormData>({
    defaultValues: { note_type: 'general', is_private: false }
  });

  const onSubmit = async (data: NoteFormData) => {
    setIsCreating(true);
    try {
      const newNote = await LeadNotesService.createNote(leadId, data);
      onNoteCreated(newNote);
      setShowCreateDialog(false);
      reset();
      toast({ title: "Success", description: "Note added successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to add note", variant: "destructive" });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Notes</h3>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-2" />Add Note</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Note</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label>Note Type</Label>
                <Select onValueChange={(value) => setValue('note_type', value as any)} defaultValue="general">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="qualification">Qualification</SelectItem>
                    <SelectItem value="objection">Objection</SelectItem>
                    <SelectItem value="interest">Interest</SelectItem>
                    <SelectItem value="follow_up">Follow-up</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Content</Label>
                <Textarea {...register('content', { required: true })} rows={4} />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? 'Adding...' : 'Add Note'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {loading ? (
          <Card><CardContent className="p-6"><p className="text-center text-muted-foreground">Loading notes...</p></CardContent></Card>
        ) : notes.length === 0 ? (
          <Card><CardContent className="p-6"><p className="text-center text-muted-foreground">No notes yet.</p></CardContent></Card>
        ) : (
          notes.map((note) => (
            <Card key={note.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <StickyNote className="h-4 w-4" />
                    Note
                  </CardTitle>
                  <Badge variant="outline">{note.note_type}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">{note.content}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(note.created_at).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}