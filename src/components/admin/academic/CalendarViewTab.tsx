import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useAcademicTerms } from '@/hooks/useAcademicTerms';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';

export function CalendarViewTab() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { data: terms } = useAcademicTerms();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getEventsForDay = (date: Date) => {
    if (!terms) return [];
    
    const events = [];
    const dateStr = format(date, 'yyyy-MM-dd');
    
    terms.forEach(term => {
      if (term.start_date === dateStr) {
        events.push({ type: 'term-start', term, label: `${term.name} Starts` });
      }
      if (term.end_date === dateStr) {
        events.push({ type: 'term-end', term, label: `${term.name} Ends` });
      }
      if (term.registration_start_date === dateStr) {
        events.push({ type: 'registration-start', term, label: `${term.name} Registration Opens` });
      }
      if (term.registration_end_date === dateStr) {
        events.push({ type: 'registration-end', term, label: `${term.name} Registration Closes` });
      }
    });
    
    return events;
  };

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'term-start':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'term-end':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'registration-start':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'registration-end':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Academic Calendar</h2>
          <p className="text-muted-foreground">
            View all academic terms and important dates
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2 min-w-[160px] justify-center">
            <Calendar className="w-4 h-4" />
            <span className="font-medium">
              {format(currentDate, 'MMMM yyyy')}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={goToNextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map(day => {
          const events = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isCurrentDay = isToday(day);
          
          return (
            <div
              key={day.toISOString()}
              className={`min-h-[100px] p-2 border rounded-lg ${
                isCurrentMonth ? 'bg-background' : 'bg-muted/30'
              } ${isCurrentDay ? 'border-primary bg-primary/5' : 'border-border'}`}
            >
              <div className={`text-sm font-medium mb-1 ${
                isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                {events.map((event, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className={`text-xs px-1 py-0.5 w-full justify-start ${getEventColor(event.type)}`}
                  >
                    {event.label}
                  </Badge>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {terms && terms.length > 0 && (
        <div className="mt-6 pt-6 border-t">
          <h3 className="font-semibold mb-3">Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500"></div>
              <span className="text-sm">Term Start</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-500"></div>
              <span className="text-sm">Term End</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-500"></div>
              <span className="text-sm">Registration Opens</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-orange-500"></div>
              <span className="text-sm">Registration Closes</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}