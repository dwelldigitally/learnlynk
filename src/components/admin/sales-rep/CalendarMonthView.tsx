import { CalendarEvent } from '@/types/calendar';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, startOfWeek, endOfWeek } from 'date-fns';
import { cn } from '@/lib/utils';

interface CalendarMonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onDateClick: (date: Date) => void;
  onEmptySlotClick: (date: Date) => void;
}

const EVENT_COLORS = {
  info_session: 'bg-blue-500',
  consultation: 'bg-green-500',
  interview: 'bg-purple-500',
  tour: 'bg-cyan-500',
  demo: 'bg-pink-500',
  follow_up: 'bg-orange-500',
  meeting: 'bg-indigo-500',
  custom: 'bg-gray-500'
};

export function CalendarMonthView({
  currentDate,
  events,
  onEventClick,
  onDateClick,
  onEmptySlotClick
}: CalendarMonthViewProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getEventsForDay = (day: Date) => {
    return events.filter(event => 
      isSameDay(new Date(event.start_time), day)
    ).sort((a, b) => 
      new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-border">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div
            key={day}
            className="px-3 py-2 text-sm font-semibold text-muted-foreground text-center"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 flex-1 overflow-auto">
        {days.map((day, idx) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isCurrentDay = isToday(day);
          const visibleEvents = dayEvents.slice(0, 3);
          const moreCount = dayEvents.length - 3;

          return (
            <div
              key={idx}
              className={cn(
                "min-h-[120px] border-r border-b border-border p-2 cursor-pointer hover:bg-accent/5 transition-colors",
                !isCurrentMonth && "bg-muted/20"
              )}
              onClick={() => onDateClick(day)}
              onDoubleClick={() => onEmptySlotClick(day)}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={cn(
                    "text-sm font-medium",
                    !isCurrentMonth && "text-muted-foreground",
                    isCurrentDay && "flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground"
                  )}
                >
                  {format(day, 'd')}
                </span>
              </div>

              <div className="space-y-1">
                {visibleEvents.map(event => (
                  <button
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    className={cn(
                      "w-full text-left px-2 py-1 rounded text-xs font-medium truncate transition-all hover:ring-2 hover:ring-primary/50",
                      EVENT_COLORS[event.type],
                      event.status === 'cancelled' && "opacity-50 line-through",
                      event.status === 'completed' && "opacity-70"
                    )}
                    title={event.title}
                  >
                    <span className="text-white">
                      {format(new Date(event.start_time), 'h:mm a')} {event.title}
                    </span>
                  </button>
                ))}
                
                {moreCount > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDateClick(day);
                    }}
                    className="w-full text-left px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    +{moreCount} more
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
