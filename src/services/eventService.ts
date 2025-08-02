import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

export class EventService {
  /**
   * Get all events for the current user
   */
  static async getEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching events:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Create a new event
   */
  static async createEvent(event: any) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('events')
      .insert({
        ...event,
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating event:', error);
      throw error;
    }

    return data;
  }

  /**
   * Update an event
   */
  static async updateEvent(id: string, event: any) {
    const { data, error } = await supabase
      .from('events')
      .update(event)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating event:', error);
      throw error;
    }

    return data;
  }

  /**
   * Delete an event
   */
  static async deleteEvent(id: string) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }

  /**
   * Get event statistics
   */
  static async getEventStats() {
    const events = await this.getEvents();
    
    const upcoming = events.filter(e => e.status === 'upcoming').length;
    const totalRegistrations = events.reduce((sum, e) => sum + (e.registrations || 0), 0);
    const past = events.filter(e => e.status === 'past').length;
    const drafts = events.filter(e => e.status === 'draft').length;

    return {
      upcomingEvents: upcoming,
      totalRegistrations,
      pastEvents: past,
      draftEvents: drafts
    };
  }
}

/**
 * React hook to get events with conditional demo data
 */
export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: () => EventService.getEvents(),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * React hook to get event statistics
 */
export function useEventStats() {
  return useQuery({
    queryKey: ['event-stats'],
    queryFn: () => EventService.getEventStats(),
    staleTime: 5 * 60 * 1000,
  });
}