import { CalendarEvent, BookMeetingFormData, MeetingTemplate } from '@/types/calendar';
import { supabase } from '@/integrations/supabase/client';

class CalendarService {
  // Get all events for the current user
  async getEvents(): Promise<CalendarEvent[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('user_id', user.id)
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching calendar events:', error);
      return [];
    }

    return (data || []).map(this.mapDbEventToCalendarEvent);
  }

  // Get events for a specific date range
  async getEventsByDateRange(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('user_id', user.id)
      .gte('start_time', startDate.toISOString())
      .lte('start_time', endDate.toISOString())
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching calendar events by date range:', error);
      return [];
    }

    return (data || []).map(this.mapDbEventToCalendarEvent);
  }

  // Get event by ID
  async getEventById(id: string): Promise<CalendarEvent | null> {
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching calendar event:', error);
      return null;
    }

    return data ? this.mapDbEventToCalendarEvent(data) : null;
  }

  // Create new event
  async createEvent(formData: BookMeetingFormData): Promise<CalendarEvent> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const startTime = new Date(formData.date);
    const [hours, minutes] = formData.start_time.split(':').map(Number);
    startTime.setHours(hours, minutes, 0, 0);

    const endTime = new Date(startTime.getTime() + formData.duration_minutes * 60000);

    const eventData = {
      user_id: user.id,
      title: formData.title,
      type: formData.type,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      duration_minutes: formData.duration_minutes,
      description: formData.description || null,
      agenda: formData.agenda || null,
      objectives: formData.objectives || null,
      lead_id: formData.lead_id || null,
      location_type: formData.location_type || 'virtual',
      location_details: formData.location_details || null,
      meeting_platform: formData.meeting_platform || null,
      attendees: JSON.stringify(formData.attendees.map((email, idx) => ({
        id: `att-${Date.now()}-${idx}`,
        name: email.split('@')[0],
        email,
        type: 'external',
        status: 'pending'
      }))),
      status: 'scheduled',
      created_by: user.id,
      reminders: JSON.stringify(formData.reminders || [])
    };

    const { data, error } = await supabase
      .from('calendar_events')
      .insert(eventData as any)
      .select()
      .single();

    if (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }

    return this.mapDbEventToCalendarEvent(data);
  }

  // Update event
  async updateEvent(id: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent> {
    const updateData: any = { ...updates, updated_at: new Date().toISOString() };
    if (updates.attendees) updateData.attendees = JSON.stringify(updates.attendees);
    if (updates.reminders) updateData.reminders = JSON.stringify(updates.reminders);
    
    const { data, error } = await supabase
      .from('calendar_events')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating calendar event:', error);
      throw error;
    }

    return this.mapDbEventToCalendarEvent(data);
  }

  // Delete event
  async deleteEvent(id: string): Promise<void> {
    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting calendar event:', error);
      throw error;
    }
  }

  // Cancel event
  async cancelEvent(id: string, reason: string): Promise<CalendarEvent> {
    return this.updateEvent(id, {
      status: 'cancelled',
      cancelled_reason: reason
    });
  }

  // Complete event
  async completeEvent(id: string, notes?: string, outcomes?: string[]): Promise<CalendarEvent> {
    return this.updateEvent(id, {
      status: 'completed',
      meeting_notes: notes,
      outcomes
    });
  }

  // Get meeting templates (static for now, could be moved to DB)
  async getMeetingTemplates(): Promise<MeetingTemplate[]> {
    return [
      {
        id: 'template-1',
        name: 'Standard Consultation',
        type: 'consultation',
        duration_minutes: 60,
        description: 'Initial consultation call to discuss program requirements and answer questions',
        default_attendees: []
      },
      {
        id: 'template-2',
        name: 'Quick Info Session',
        type: 'info_session',
        duration_minutes: 30,
        description: 'Brief information session about specific programs',
        default_attendees: []
      },
      {
        id: 'template-3',
        name: 'Campus Tour',
        type: 'tour',
        duration_minutes: 90,
        description: 'Comprehensive campus tour including facilities and departments',
        default_attendees: []
      },
      {
        id: 'template-4',
        name: 'Admission Interview',
        type: 'interview',
        duration_minutes: 60,
        description: 'Formal admission interview with program coordinator',
        default_attendees: []
      }
    ];
  }

  // Get today's meetings count
  async getTodaysMeetingsCount(): Promise<number> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { count, error } = await supabase
      .from('calendar_events')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('start_time', today.toISOString())
      .lt('start_time', tomorrow.toISOString())
      .gte('created_at', today.toISOString());

    if (error) {
      console.error('Error counting today\'s meetings:', error);
      return 0;
    }

    return count || 0;
  }

  // Helper to map DB record to CalendarEvent type
  private mapDbEventToCalendarEvent(dbEvent: any): CalendarEvent {
    return {
      id: dbEvent.id,
      title: dbEvent.title,
      type: dbEvent.type,
      start_time: dbEvent.start_time,
      end_time: dbEvent.end_time,
      duration_minutes: dbEvent.duration_minutes,
      description: dbEvent.description,
      agenda: dbEvent.agenda,
      objectives: dbEvent.objectives,
      lead_id: dbEvent.lead_id,
      lead_name: dbEvent.lead_name,
      lead_email: dbEvent.lead_email,
      lead_phone: dbEvent.lead_phone,
      location_type: dbEvent.location_type,
      location_details: dbEvent.location_details,
      meeting_link: dbEvent.meeting_link,
      meeting_platform: dbEvent.meeting_platform,
      attendees: dbEvent.attendees || [],
      status: dbEvent.status,
      cancelled_reason: dbEvent.cancelled_reason,
      meeting_notes: dbEvent.meeting_notes,
      outcomes: dbEvent.outcomes,
      follow_up_tasks: dbEvent.follow_up_tasks,
      reminders: dbEvent.reminders || [],
      created_by: dbEvent.created_by,
      created_at: dbEvent.created_at,
      updated_at: dbEvent.updated_at
    };
  }
}

export const calendarService = new CalendarService();
