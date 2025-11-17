import { CalendarEvent } from '@/types/calendar';
import { format, isSameDay, startOfDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { Clock, MapPin, Video, Phone } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface CalendarDayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onEmptySlotClick: (hour: number, minute: number) => void;
}

const EVENT_COLORS = {
  info_session: 'bg-blue-500 border-blue-600',
  consultation: 'bg-green-500 border-green-600',
  interview: 'bg-purple-500 border-purple-600',
  tour: 'bg-cyan-500 border-cyan-600',
  demo: 'bg-pink-500 border-pink-600',
  follow_up: 'bg-orange-500 border-orange-600',
  meeting: 'bg-indigo-500 border-indigo-600',
  custom: 'bg-gray-500 border-gray-600'
};

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM
const INTERVALS_PER_HOUR = 2; // 30-minute intervals

export function CalendarDayView({
  currentDate,
  events,
  onEventClick,
  onEmptySlotClick
}: CalendarDayViewProps) {
  const currentTimeRef = useRef<HTMLDivElement>(null);
  const dayStart = startOfDay(currentDate);

  // Scroll to current time on mount
  useEffect(() => {
    if (currentTimeRef.current) {
      currentTimeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const dayEvents = events
    .filter(event => isSameDay(new Date(event.start_time), currentDate))
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

  const getCurrentTimePosition = () => {
    const now = new Date();
    if (!isSameDay(now, currentDate)) return null;
    
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    if (currentHour < 8 || currentHour >= 21) return null;
    
    const position = ((currentHour - 8) * 60 + currentMinute) / (13 * 60) * 100;
    return position;
  };

  const currentTimePosition = getCurrentTimePosition();

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

  return (
    <div className="flex h-full overflow-hidden">
      {/* Timeline */}
      <div className="flex-1 overflow-auto relative">
        <div className="min-h-full">
          {HOURS.map(hour => (
            <div key={hour} className="relative">
              {/* Hour label */}
              <div className="sticky left-0 top-0 w-20 px-3 py-2 text-xs text-muted-foreground border-b border-border bg-background">
                {format(new Date().setHours(hour, 0, 0, 0), 'h:mm a')}
              </div>

              {/* 30-minute intervals */}
              {Array.from({ length: INTERVALS_PER_HOUR }).map((_, intervalIdx) => {
                const minute = intervalIdx * 30;
                
                return (
                  <div
                    key={`${hour}-${minute}`}
                    className="h-16 border-b border-border hover:bg-accent/5 cursor-pointer transition-colors ml-20"
                    onClick={() => onEmptySlotClick(hour, minute)}
                  />
                );
              })}

              {/* Events for this hour */}
              {dayEvents
                .filter(event => {
                  const eventStart = new Date(event.start_time);
                  return eventStart.getHours() === hour;
                })
                .map(event => {
                  const eventStart = new Date(event.start_time);
                  const minutesFromHourStart = eventStart.getMinutes();
                  const topOffset = (minutesFromHourStart / 30) * 64; // 64px per 30min interval
                  const heightPx = (event.duration_minutes / 30) * 64;

                  return (
                    <button
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                      className={cn(
                        "absolute left-20 right-4 rounded-lg p-3 text-left text-white border-l-4 overflow-hidden transition-all hover:ring-2 hover:ring-primary/50 hover:z-10 shadow-sm",
                        EVENT_COLORS[event.type],
                        event.status === 'cancelled' && "opacity-50",
                        event.status === 'completed' && "opacity-70"
                      )}
                      style={{
                        top: `${topOffset}px`,
                        minHeight: `${Math.max(heightPx, 64)}px`
                      }}
                    >
                      <div className="font-semibold mb-1 line-clamp-1">{event.title}</div>
                      <div className="flex items-center gap-2 text-xs opacity-90 mb-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {format(eventStart, 'h:mm a')} - {format(new Date(event.end_time), 'h:mm a')}
                        </span>
                        <span className="ml-auto">({event.duration_minutes}min)</span>
                      </div>
                      {event.location_type && (
                        <div className="flex items-center gap-2 text-xs opacity-90">
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
                        <div className="text-xs opacity-90 mt-1 line-clamp-1">
                          Lead: {event.lead_name}
                        </div>
                      )}
                      {event.status === 'cancelled' && (
                        <div className="text-xs mt-1 font-semibold">CANCELLED</div>
                      )}
                      {event.status === 'completed' && (
                        <div className="text-xs mt-1 font-semibold">COMPLETED</div>
                      )}
                    </button>
                  );
                })}
            </div>
          ))}
        </div>

        {/* Current time indicator */}
        {currentTimePosition !== null && (
          <div
            ref={currentTimeRef}
            className="absolute left-0 right-0 h-0.5 bg-red-500 z-20 pointer-events-none"
            style={{ top: `${currentTimePosition}%` }}
          >
            <div className="absolute left-20 -top-1.5 h-3 w-3 rounded-full bg-red-500"></div>
            <div className="absolute left-24 -top-2.5 text-xs font-semibold text-red-500 whitespace-nowrap">
              {format(new Date(), 'h:mm a')}
            </div>
          </div>
        )}
      </div>

      {/* Sidebar with event list */}
      <div className="w-80 border-l border-border p-4 overflow-auto">
        <h3 className="font-semibold mb-4">
          {format(currentDate, 'EEEE, MMMM d, yyyy')}
        </h3>
        
        {dayEvents.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No events scheduled for this day
          </p>
        ) : (
          <div className="space-y-3">
            {dayEvents.map(event => (
              <button
                key={event.id}
                onClick={() => onEventClick(event)}
                className={cn(
                  "w-full text-left p-3 rounded-lg border-l-4 hover:bg-accent transition-colors",
                  EVENT_COLORS[event.type],
                  "bg-opacity-10 hover:bg-opacity-20"
                )}
              >
                <div className="font-medium text-sm mb-1">{event.title}</div>
                <div className="text-xs text-muted-foreground">
                  {format(new Date(event.start_time), 'h:mm a')} - {format(new Date(event.end_time), 'h:mm a')}
                </div>
                {event.lead_name && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {event.lead_name}
                  </div>
                )}
                {event.status === 'cancelled' && (
                  <div className="text-xs text-red-500 mt-1 font-semibold">CANCELLED</div>
                )}
                {event.status === 'completed' && (
                  <div className="text-xs text-green-500 mt-1 font-semibold">COMPLETED</div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
