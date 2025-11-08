import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useAcademicTerms } from '@/hooks/useAcademicTerms';
import { useConditionalIntakes } from '@/hooks/useConditionalIntakes';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday, parseISO, isValid } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export function CalendarViewTab() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const navigate = useNavigate();
  const { data: terms } = useAcademicTerms();
  const { data: intakes } = useConditionalIntakes();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  
  // Get the start of the week containing the first day of the month
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // 0 = Sunday
  // Get the end of the week containing the last day of the month
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  
  // Generate all days for the calendar grid (including previous/next month days)
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleEventClick = (event: any) => {
    if (event.type.startsWith('intake-')) {
      // Navigate to intake management - you can customize this route as needed
      navigate('/admin/leads-marketing', { state: { scrollToIntakes: true } });
    } else if (event.type.startsWith('term-') || event.type.startsWith('registration-')) {
      // For now, navigate to the terms tab
      navigate('/admin/academic-terms', { state: { activeTab: 'terms' } });
    }
  };

  const getEventsForDay = (date: Date) => {
    const events = [];
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Add academic term events
    if (terms) {
      terms.forEach(term => {
        if (term.start_date === dateStr) {
          events.push({ type: 'term-start', term, label: `${term.name} Starts`, id: term.id });
        }
        if (term.end_date === dateStr) {
          events.push({ type: 'term-end', term, label: `${term.name} Ends`, id: term.id });
        }
        if (term.registration_start_date === dateStr) {
          events.push({ type: 'registration-start', term, label: `${term.name} Registration Opens`, id: term.id });
        }
        if (term.registration_end_date === dateStr) {
          events.push({ type: 'registration-end', term, label: `${term.name} Registration Closes`, id: term.id });
        }
      });
    }
    
    // Add intake events
    if (intakes) {
      intakes.forEach(intake => {
        // Helper function to safely format date
        const formatIntakeDate = (dateString: string) => {
          if (!dateString) return null;
          try {
            const date = parseISO(dateString);
            return isValid(date) ? format(date, 'yyyy-MM-dd') : null;
          } catch {
            return null;
          }
        };

        const intakeStartDate = formatIntakeDate(intake.start_date);
        const intakeDeadline = formatIntakeDate(intake.application_deadline);
        
        if (intakeStartDate === dateStr) {
          events.push({ 
            type: 'intake-start', 
            intake, 
            label: `${intake.program_name} - ${intake.name} Starts`,
            id: intake.id
          });
        }
        if (intakeDeadline === dateStr) {
          events.push({ 
            type: 'intake-deadline', 
            intake, 
            label: `${intake.program_name} - Application Deadline`,
            id: intake.id
          });
        }
      });
    }
    
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
      case 'intake-start':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'intake-deadline':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
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
            View all academic terms, intake dates, and important deadlines
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
                    onClick={() => handleEventClick(event)}
                    className={`text-xs px-1 py-0.5 w-full justify-start cursor-pointer hover:opacity-80 transition-opacity ${getEventColor(event.type)}`}
                  >
                    {event.label}
                  </Badge>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {(terms && terms.length > 0) || (intakes && intakes.length > 0) ? (
        <div className="mt-6 pt-6 border-t">
          <h3 className="font-semibold mb-3">Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
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
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-purple-500"></div>
              <span className="text-sm">Intake Start</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-yellow-500"></div>
              <span className="text-sm">Application Deadline</span>
            </div>
          </div>
        </div>
      ) : null}
    </Card>
  );
}