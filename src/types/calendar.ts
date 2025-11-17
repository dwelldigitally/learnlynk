export type MeetingType = 
  | 'info_session' 
  | 'consultation' 
  | 'interview' 
  | 'tour' 
  | 'demo' 
  | 'follow_up' 
  | 'meeting' 
  | 'custom';

export type LocationType = 'virtual' | 'in_person' | 'phone';

export type EventStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

export type AttendeeStatus = 'pending' | 'accepted' | 'declined' | 'tentative';

export type ReminderType = 'email' | 'sms' | 'notification';

export type CalendarView = 'month' | 'week' | 'day';

export interface Attendee {
  id: string;
  name: string;
  email: string;
  type: 'internal' | 'external';
  status: AttendeeStatus;
}

export interface Reminder {
  type: ReminderType;
  time_before_minutes: number;
  sent: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: MeetingType;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  description?: string;
  agenda?: string;
  objectives?: string[];
  
  // Lead association
  lead_id?: string;
  lead_name?: string;
  lead_email?: string;
  lead_phone?: string;
  
  // Location
  location_type: LocationType;
  location_details?: string;
  meeting_link?: string;
  meeting_platform?: 'zoom' | 'teams' | 'google_meet' | 'other';
  
  // Attendees
  attendees: Attendee[];
  
  // Status & tracking
  status: EventStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
  cancelled_reason?: string;
  
  // Reminders
  reminders: Reminder[];
  
  // Outlook integration (placeholders)
  outlook_event_id?: string;
  outlook_sync_status?: 'synced' | 'pending' | 'failed';
  outlook_last_synced?: string;
  
  // Notes & outcomes
  meeting_notes?: string;
  outcomes?: string[];
  follow_up_tasks?: string[];
  next_steps?: string[];
}

export interface MeetingTemplate {
  id: string;
  name: string;
  type: MeetingType;
  duration_minutes: number;
  description: string;
  default_attendees: string[];
}

export interface AvailabilityBlock {
  day: number; // 0-6 (Sunday-Saturday)
  start_time: string; // "09:00"
  end_time: string; // "17:00"
}

export interface BookMeetingFormData {
  lead_id?: string;
  title: string;
  type: MeetingType;
  date: Date;
  start_time: string;
  duration_minutes: number;
  description?: string;
  agenda?: string;
  objectives?: string[];
  location_type: LocationType;
  location_details?: string;
  meeting_platform?: string;
  attendees: string[];
  reminders: Reminder[];
}
