import { supabase } from '@/integrations/supabase/client';
import { LeadNote, NoteFormData } from '@/types/leadEnhancements';
import { DummyLeadDataService } from './dummyLeadDataService';

export class LeadNotesService {
  static async getNotes(leadId: string): Promise<LeadNote[]> {
    try {
      const { data, error } = await supabase
        .from('lead_notes')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notes:', error);
        return [];
      }

      return (data || []) as LeadNote[];
    } catch (error) {
      console.error('Database connection error:', error);
      return [];
    }
  }

  static async createNote(leadId: string, noteData: NoteFormData): Promise<LeadNote> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('lead_notes')
      .insert({
        lead_id: leadId,
        user_id: user.id,
        ...noteData,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating note:', error);
      throw new Error('Failed to create note');
    }

    return data as LeadNote;
  }

  static async updateNote(id: string, updates: Partial<NoteFormData>): Promise<LeadNote> {
    const { data, error } = await supabase
      .from('lead_notes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating note:', error);
      throw new Error('Failed to update note');
    }

    return data as LeadNote;
  }

  static async deleteNote(id: string): Promise<void> {
    const { error } = await supabase
      .from('lead_notes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting note:', error);
      throw new Error('Failed to delete note');
    }
  }

  static async getNotesByType(leadId: string, noteType: string): Promise<LeadNote[]> {
    const { data, error } = await supabase
      .from('lead_notes')
      .select('*')
      .eq('lead_id', leadId)
      .eq('note_type', noteType)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notes by type:', error);
      return [];
    }

    return (data || []) as LeadNote[];
  }
}