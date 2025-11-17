import { CalendarEvent } from '@/types/calendar';
import { Calendar } from '@/components/ui/calendar';
import { format, isToday, isTomorrow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Clock, Video, MapPin, Phone } from 'lucide-react';

interface CalendarSidebarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  upcomingEvents: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

const EVENT_COLORS = {
  info_session: 'border-blue-500',
  consultation: 'border-green-500',
  interview: 'border-purple-500',
  tour: 'border-cyan-500',
  demo: 'border-pink-500',
  follow_up: 'border-orange-500',
  meeting: 'border-indigo-500',
  custom: 'border-gray-500'
};

export function CalendarSidebar({
  selectedDate,
  onDateSelect,
  upcomingEvents,
  onEventClick
}: CalendarSidebarProps) {
  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'virtual':
        return <Video className="h-3 w-3" />;
      case 'phone':
        return <Phone className="h-3 w-3" />;
      case 'in_person':
        return <MapPin className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getDateLabel = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
  };

  return (
    <div className="w-80 border-r border-border p-4 overflow-auto space-y-6">
      {/* Mini Calendar */}
      <div>
        <h3 className="font-semibold mb-3 text-sm">Calendar</h3>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && onDateSelect(date)}
          className="rounded-md border pointer-events-auto"
        />
      </div>

      {/* Today's Summary */}
      <div>
        <h3 className="font-semibold mb-3 text-sm">Today's Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Total Events</span>
            <span className="font-medium">{upcomingEvents.filter(e => {
              const eventDate = typeof e.start_time === 'string' ? new Date(e.start_time) : e.start_time;
              return isToday(eventDate);
            }).length}</span>
          </div>
          {upcomingEvents.length > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Next Meeting</span>
              <span className="font-medium text-xs">
                {format(new Date(upcomingEvents[0].start_time), 'h:mm a')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Events */}
      <div>
        <h3 className="font-semibold mb-3 text-sm">Upcoming Events</h3>
        {upcomingEvents.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No upcoming events
          </p>
        ) : (
          <div className="space-y-2">
            {upcomingEvents.slice(0, 5).map(event => (
              <button
                key={event.id}
                onClick={() => onEventClick(event)}
                className={cn(
                  "w-full text-left p-3 rounded-lg border-l-4 hover:bg-accent transition-colors",
                  EVENT_COLORS[event.type],
                  "bg-card"
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-medium text-sm line-clamp-1">{event.title}</span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {getDateLabel(event.start_time)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{format(new Date(event.start_time), 'h:mm a')}</span>
                </div>

                {event.location_type && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    {getLocationIcon(event.location_type)}
                    <span className="line-clamp-1">
                      {event.location_type === 'virtual' && event.meeting_platform && 
                        `${event.meeting_platform.charAt(0).toUpperCase() + event.meeting_platform.slice(1)}`}
                      {event.location_type === 'in_person' && event.location_details}
                      {event.location_type === 'phone' && 'Phone Call'}
                    </span>
                  </div>
                )}

                {event.lead_name && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {event.lead_name}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick Filters */}
      <div>
        <h3 className="font-semibold mb-3 text-sm">Quick Filters</h3>
        <div className="space-y-1">
          <button className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors">
            My Meetings Only
          </button>
          <button className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors">
            Team Meetings
          </button>
          <button className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors">
            Lead Meetings
          </button>
          <button className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors">
            Internal Meetings
          </button>
        </div>
      </div>
    </div>
  );
}
