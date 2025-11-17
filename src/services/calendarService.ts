import { CalendarEvent, BookMeetingFormData, MeetingTemplate } from '@/types/calendar';
import { addDays, addHours, startOfDay, format } from 'date-fns';

// Mock calendar service with sample data
class CalendarService {
  private events: CalendarEvent[] = [];

  constructor() {
    this.generateMockEvents();
  }

  private generateMockEvents() {
    const today = startOfDay(new Date());
    
    // Today's events
    this.events = [
      {
        id: '1',
        title: 'Consultation Call with Sarah Johnson',
        type: 'consultation',
        start_time: addHours(today, 9).toISOString(),
        end_time: addHours(today, 10).toISOString(),
        duration_minutes: 60,
        description: 'Initial consultation about MBA program requirements',
        lead_id: 'lead-1',
        lead_name: 'Sarah Johnson',
        lead_email: 'sarah.j@email.com',
        lead_phone: '+1 234-567-8901',
        location_type: 'virtual',
        meeting_link: 'https://zoom.us/j/123456789',
        meeting_platform: 'zoom',
        attendees: [{
          id: 'att-1',
          name: 'Sarah Johnson',
          email: 'sarah.j@email.com',
          type: 'external',
          status: 'accepted'
        }],
        status: 'scheduled',
        created_by: 'current-user',
        created_at: addDays(today, -2).toISOString(),
        updated_at: addDays(today, -2).toISOString(),
        reminders: [
          { type: 'email', time_before_minutes: 60, sent: false },
          { type: 'notification', time_before_minutes: 15, sent: false }
        ]
      },
      {
        id: '2',
        title: 'Campus Tour - Mike Chen',
        type: 'tour',
        start_time: addHours(today, 11).toISOString(),
        end_time: addHours(today, 12).toISOString(),
        duration_minutes: 60,
        description: 'Campus facilities tour for Computer Science program',
        lead_id: 'lead-2',
        lead_name: 'Mike Chen',
        lead_email: 'mike.chen@email.com',
        location_type: 'in_person',
        location_details: 'Main Campus - Admissions Office',
        attendees: [{
          id: 'att-2',
          name: 'Mike Chen',
          email: 'mike.chen@email.com',
          type: 'external',
          status: 'pending'
        }],
        status: 'scheduled',
        created_by: 'current-user',
        created_at: addDays(today, -1).toISOString(),
        updated_at: addDays(today, -1).toISOString(),
        reminders: [
          { type: 'sms', time_before_minutes: 120, sent: false }
        ]
      },
      {
        id: '3',
        title: 'Interview - Emma Wilson',
        type: 'interview',
        start_time: addHours(today, 14).toISOString(),
        end_time: addHours(today, 15).toISOString(),
        duration_minutes: 60,
        description: 'Admission interview for Nursing program',
        lead_id: 'lead-3',
        lead_name: 'Emma Wilson',
        lead_email: 'emma.w@email.com',
        location_type: 'virtual',
        meeting_link: 'https://teams.microsoft.com/meet/xyz',
        meeting_platform: 'teams',
        attendees: [
          {
            id: 'att-3',
            name: 'Emma Wilson',
            email: 'emma.w@email.com',
            type: 'external',
            status: 'accepted'
          },
          {
            id: 'att-4',
            name: 'Dr. Smith',
            email: 'dr.smith@institution.edu',
            type: 'internal',
            status: 'accepted'
          }
        ],
        status: 'scheduled',
        created_by: 'current-user',
        created_at: addDays(today, -3).toISOString(),
        updated_at: addDays(today, -3).toISOString(),
        reminders: [
          { type: 'email', time_before_minutes: 1440, sent: true },
          { type: 'email', time_before_minutes: 60, sent: false }
        ]
      },
      {
        id: '4',
        title: 'Follow-up: Application Review',
        type: 'follow_up',
        start_time: addHours(today, 16).toISOString(),
        end_time: addHours(today, 16.5).toISOString(),
        duration_minutes: 30,
        description: 'Review application documents with David Park',
        lead_id: 'lead-4',
        lead_name: 'David Park',
        lead_email: 'david.park@email.com',
        location_type: 'phone',
        attendees: [{
          id: 'att-5',
          name: 'David Park',
          email: 'david.park@email.com',
          type: 'external',
          status: 'accepted'
        }],
        status: 'scheduled',
        created_by: 'current-user',
        created_at: today.toISOString(),
        updated_at: today.toISOString(),
        reminders: [
          { type: 'notification', time_before_minutes: 15, sent: false }
        ]
      },
      // Tomorrow's events
      {
        id: '5',
        title: 'Information Session - Business Programs',
        type: 'info_session',
        start_time: addHours(addDays(today, 1), 10).toISOString(),
        end_time: addHours(addDays(today, 1), 11).toISOString(),
        duration_minutes: 60,
        description: 'Group information session for MBA and Business Administration programs',
        location_type: 'virtual',
        meeting_link: 'https://zoom.us/j/987654321',
        meeting_platform: 'zoom',
        attendees: [
          {
            id: 'att-6',
            name: 'Lisa Anderson',
            email: 'lisa.a@email.com',
            type: 'external',
            status: 'accepted'
          },
          {
            id: 'att-7',
            name: 'John Martinez',
            email: 'john.m@email.com',
            type: 'external',
            status: 'pending'
          }
        ],
        status: 'scheduled',
        created_by: 'current-user',
        created_at: addDays(today, -5).toISOString(),
        updated_at: addDays(today, -5).toISOString(),
        reminders: [
          { type: 'email', time_before_minutes: 1440, sent: false }
        ]
      },
      {
        id: '6',
        title: 'Demo Session - Student Portal',
        type: 'demo',
        start_time: addHours(addDays(today, 1), 14).toISOString(),
        end_time: addHours(addDays(today, 1), 15).toISOString(),
        duration_minutes: 60,
        description: 'Demonstrate student portal features and online learning platform',
        lead_id: 'lead-5',
        lead_name: 'Rachel Green',
        lead_email: 'rachel.g@email.com',
        location_type: 'virtual',
        meeting_link: 'https://meet.google.com/abc-defg-hij',
        meeting_platform: 'google_meet',
        attendees: [{
          id: 'att-8',
          name: 'Rachel Green',
          email: 'rachel.g@email.com',
          type: 'external',
          status: 'accepted'
        }],
        status: 'scheduled',
        created_by: 'current-user',
        created_at: addDays(today, -1).toISOString(),
        updated_at: addDays(today, -1).toISOString(),
        reminders: [
          { type: 'email', time_before_minutes: 60, sent: false }
        ]
      },
      // This week's events
      {
        id: '7',
        title: 'Consultation - Engineering Programs',
        type: 'consultation',
        start_time: addHours(addDays(today, 2), 11).toISOString(),
        end_time: addHours(addDays(today, 2), 12).toISOString(),
        duration_minutes: 60,
        lead_id: 'lead-6',
        lead_name: 'Tom Anderson',
        lead_email: 'tom.a@email.com',
        location_type: 'in_person',
        location_details: 'Engineering Building, Room 205',
        attendees: [{
          id: 'att-9',
          name: 'Tom Anderson',
          email: 'tom.a@email.com',
          type: 'external',
          status: 'accepted'
        }],
        status: 'scheduled',
        created_by: 'current-user',
        created_at: addDays(today, -4).toISOString(),
        updated_at: addDays(today, -4).toISOString(),
        reminders: []
      },
      {
        id: '8',
        title: 'Team Meeting - Weekly Sync',
        type: 'meeting',
        start_time: addHours(addDays(today, 3), 9).toISOString(),
        end_time: addHours(addDays(today, 3), 10).toISOString(),
        duration_minutes: 60,
        description: 'Weekly team sync - review lead pipeline and upcoming events',
        location_type: 'in_person',
        location_details: 'Conference Room A',
        attendees: [
          {
            id: 'att-10',
            name: 'Jane Cooper',
            email: 'jane.c@institution.edu',
            type: 'internal',
            status: 'accepted'
          },
          {
            id: 'att-11',
            name: 'Mark Johnson',
            email: 'mark.j@institution.edu',
            type: 'internal',
            status: 'accepted'
          }
        ],
        status: 'scheduled',
        created_by: 'current-user',
        created_at: addDays(today, -7).toISOString(),
        updated_at: addDays(today, -7).toISOString(),
        reminders: [
          { type: 'notification', time_before_minutes: 30, sent: false }
        ]
      },
      // Completed event (yesterday)
      {
        id: '9',
        title: 'Consultation - MBA Program',
        type: 'consultation',
        start_time: addHours(addDays(today, -1), 14).toISOString(),
        end_time: addHours(addDays(today, -1), 15).toISOString(),
        duration_minutes: 60,
        description: 'Initial consultation completed',
        lead_id: 'lead-7',
        lead_name: 'Alex Thompson',
        lead_email: 'alex.t@email.com',
        location_type: 'virtual',
        meeting_link: 'https://zoom.us/j/111222333',
        meeting_platform: 'zoom',
        attendees: [{
          id: 'att-12',
          name: 'Alex Thompson',
          email: 'alex.t@email.com',
          type: 'external',
          status: 'accepted'
        }],
        status: 'completed',
        created_by: 'current-user',
        created_at: addDays(today, -5).toISOString(),
        updated_at: addDays(today, -1).toISOString(),
        meeting_notes: 'Very interested in MBA program. Discussed admission requirements and timeline.',
        outcomes: ['Sent application materials', 'Scheduled follow-up for next week'],
        follow_up_tasks: ['Send detailed program brochure', 'Connect with financial aid office'],
        reminders: []
      },
      // Next week events
      {
        id: '10',
        title: 'Interview - Graduate Program',
        type: 'interview',
        start_time: addHours(addDays(today, 7), 13).toISOString(),
        end_time: addHours(addDays(today, 7), 14).toISOString(),
        duration_minutes: 60,
        lead_id: 'lead-8',
        lead_name: 'Nina Patel',
        lead_email: 'nina.p@email.com',
        location_type: 'virtual',
        meeting_link: 'https://teams.microsoft.com/meet/interview-2024',
        meeting_platform: 'teams',
        attendees: [
          {
            id: 'att-13',
            name: 'Nina Patel',
            email: 'nina.p@email.com',
            type: 'external',
            status: 'pending'
          },
          {
            id: 'att-14',
            name: 'Prof. Williams',
            email: 'williams@institution.edu',
            type: 'internal',
            status: 'accepted'
          }
        ],
        status: 'scheduled',
        created_by: 'current-user',
        created_at: today.toISOString(),
        updated_at: today.toISOString(),
        reminders: [
          { type: 'email', time_before_minutes: 2880, sent: false }
        ]
      }
    ];
  }

  // Get all events
  async getEvents(): Promise<CalendarEvent[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...this.events]), 300);
    });
  }

  // Get events for a specific date range
  async getEventsByDateRange(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = this.events.filter(event => {
          const eventDate = new Date(event.start_time);
          return eventDate >= startDate && eventDate <= endDate;
        });
        resolve(filtered);
      }, 300);
    });
  }

  // Get event by ID
  async getEventById(id: string): Promise<CalendarEvent | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const event = this.events.find(e => e.id === id);
        resolve(event || null);
      }, 200);
    });
  }

  // Create new event
  async createEvent(data: BookMeetingFormData): Promise<CalendarEvent> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newEvent: CalendarEvent = {
          id: `event-${Date.now()}`,
          title: data.title,
          type: data.type,
          start_time: new Date(data.date.setHours(parseInt(data.start_time.split(':')[0]), parseInt(data.start_time.split(':')[1]))).toISOString(),
          end_time: new Date(data.date.getTime() + data.duration_minutes * 60000).toISOString(),
          duration_minutes: data.duration_minutes,
          description: data.description,
          agenda: data.agenda,
          objectives: data.objectives,
          lead_id: data.lead_id,
          location_type: data.location_type,
          location_details: data.location_details,
          meeting_platform: data.meeting_platform as any,
          attendees: data.attendees.map((email, idx) => ({
            id: `att-${Date.now()}-${idx}`,
            name: email.split('@')[0],
            email,
            type: 'external',
            status: 'pending'
          })),
          status: 'scheduled',
          created_by: 'current-user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          reminders: data.reminders
        };
        
        this.events.push(newEvent);
        resolve(newEvent);
      }, 500);
    });
  }

  // Update event
  async updateEvent(id: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.events.findIndex(e => e.id === id);
        if (index === -1) {
          reject(new Error('Event not found'));
          return;
        }
        
        this.events[index] = {
          ...this.events[index],
          ...updates,
          updated_at: new Date().toISOString()
        };
        
        resolve(this.events[index]);
      }, 500);
    });
  }

  // Delete event
  async deleteEvent(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.events.findIndex(e => e.id === id);
        if (index === -1) {
          reject(new Error('Event not found'));
          return;
        }
        
        this.events.splice(index, 1);
        resolve();
      }, 300);
    });
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

  // Get meeting templates
  async getMeetingTemplates(): Promise<MeetingTemplate[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
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
        ]);
      }, 200);
    });
  }
}

export const calendarService = new CalendarService();
