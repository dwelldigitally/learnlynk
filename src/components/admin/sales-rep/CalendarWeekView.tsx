import { CalendarEvent } from '@/types/calendar';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday, addMinutes, startOfDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

interface CalendarWeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onEmptySlotClick: (date: Date, hour: number) => void;
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

export function CalendarWeekView({
  currentDate,
  events,
  onEventClick,
  onEmptySlotClick
}: CalendarWeekViewProps) {
  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const currentTimeRef = useRef<HTMLDivElement>(null);

  // Scroll to current time on mount
  useEffect(() => {
    if (currentTimeRef.current) {
      currentTimeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const getEventsForDayAndHour = (day: Date, hour: number) => {
    return events.filter(event => {
      const eventStart = new Date(event.start_time);
      return isSameDay(eventStart, day) && eventStart.getHours() === hour;
    });
  };

  const getCurrentTimePosition = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    if (currentHour < 8 || currentHour >= 21) return null;
    
    const position = ((currentHour - 8) * 60 + currentMinute) / (13 * 60) * 100;
    return position;
  };

  const currentTimePosition = getCurrentTimePosition();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Day headers */}
      <div className="grid grid-cols-8 border-b border-border sticky top-0 bg-background z-10">
        <div className="px-3 py-2 text-sm font-semibold text-muted-foreground border-r border-border">
          Time
        </div>
        {days.map(day => {
          const isCurrentDay = isToday(day);
          return (
            <div
              key={day.toISOString()}
              className={cn(
                "px-3 py-2 text-center border-r border-border",
                isCurrentDay && "bg-primary/10"
              )}
            >
              <div className={cn(
                "text-xs font-medium text-muted-foreground",
                isCurrentDay && "text-primary font-semibold"
              )}>
                {format(day, 'EEE')}
              </div>
              <div className={cn(
                "text-lg font-semibold",
                isCurrentDay && "flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground mx-auto"
              )}>
                {format(day, 'd')}
              </div>
            </div>
          );
        })}
      </div>

      {/* Time slots */}
      <div className="flex-1 overflow-auto relative">
        <div className="grid grid-cols-8">
          {/* Time labels column */}
          <div className="border-r border-border">
            {HOURS.map(hour => (
              <div
                key={hour}
                className="h-16 px-3 py-2 text-xs text-muted-foreground border-b border-border"
              >
                {format(new Date().setHours(hour, 0, 0, 0), 'h:mm a')}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map(day => (
            <div key={day.toISOString()} className="border-r border-border relative">
              {HOURS.map(hour => {
                const dayEvents = getEventsForDayAndHour(day, hour);
                
                return (
                  <div
                    key={hour}
                    className="h-16 border-b border-border hover:bg-accent/5 cursor-pointer transition-colors relative"
                    onClick={() => onEmptySlotClick(day, hour)}
                  >
                    {dayEvents.map(event => {
                      const eventStart = new Date(event.start_time);
                      const minutesFromHourStart = eventStart.getMinutes();
                      const topOffset = (minutesFromHourStart / 60) * 100;
                      const heightPercent = (event.duration_minutes / 60) * 100;

                      return (
                        <button
                          key={event.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEventClick(event);
                          }}
                          className={cn(
                            "absolute left-1 right-1 rounded px-2 py-1 text-xs font-medium text-white border-l-2 overflow-hidden transition-all hover:ring-2 hover:ring-primary/50 hover:z-10",
                            EVENT_COLORS[event.type],
                            event.status === 'cancelled' && "opacity-50 line-through",
                            event.status === 'completed' && "opacity-70"
                          )}
                          style={{
                            top: `${topOffset}%`,
                            height: `${Math.max(heightPercent, 25)}%`
                          }}
                        >
                          <div className="truncate font-semibold">{event.title}</div>
                          <div className="truncate text-xs opacity-90">
                            {format(eventStart, 'h:mm a')}
                          </div>
                        </button>
                      );
                    })}
                  </div>
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
            <div className="absolute -left-1 -top-1.5 h-3 w-3 rounded-full bg-red-500"></div>
          </div>
        )}
      </div>
    </div>
  );
}
