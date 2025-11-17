import { useState, useEffect } from 'react';
import { CalendarEvent, CalendarView, BookMeetingFormData } from '@/types/calendar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfDay, endOfDay } from 'date-fns';
import { CalendarMonthView } from './CalendarMonthView';
import { CalendarWeekView } from './CalendarWeekView';
import { CalendarDayView } from './CalendarDayView';
import { BookMeetingDialog } from './BookMeetingDialog';
import { EventDetailsModal } from './EventDetailsModal';
import { OutlookIntegrationBanner } from './OutlookIntegrationBanner';
import { calendarService } from '@/services/calendarService';
import { useToast } from '@/hooks/use-toast';

export function EnhancedCalendar() {
  const { toast } = useToast();
  const [view, setView] = useState<CalendarView>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingDefaults, setBookingDefaults] = useState<{ date?: Date; time?: string }>({});

  useEffect(() => {
    loadEvents();
  }, [currentDate, view]);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const allEvents = await calendarService.getEvents();
      setEvents(allEvents);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load events',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevious = () => {
    if (view === 'month') setCurrentDate(subMonths(currentDate, 1));
    else if (view === 'week') setCurrentDate(subWeeks(currentDate, 1));
    else setCurrentDate(subDays(currentDate, 1));
  };

  const handleNext = () => {
    if (view === 'month') setCurrentDate(addMonths(currentDate, 1));
    else if (view === 'week') setCurrentDate(addWeeks(currentDate, 1));
    else setCurrentDate(addDays(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const handleDateClick = (date: Date) => {
    setCurrentDate(date);
    setView('day');
  };

  const handleEmptySlotClick = (date: Date, hour?: number) => {
    const time = hour !== undefined ? `${hour.toString().padStart(2, '0')}:00` : '09:00';
    setBookingDefaults({ date, time });
    setIsBookingDialogOpen(true);
  };

  const handleBookMeeting = async (data: BookMeetingFormData) => {
    await calendarService.createEvent(data);
    await loadEvents();
  };

  const handleDeleteEvent = async (eventId: string) => {
    await calendarService.deleteEvent(eventId);
    await loadEvents();
  };

  const handleCompleteEvent = async (eventId: string, notes?: string) => {
    await calendarService.completeEvent(eventId, notes);
    await loadEvents();
  };

  const handleCancelEvent = async (eventId: string, reason: string) => {
    await calendarService.cancelEvent(eventId, reason);
    await loadEvents();
  };

  const getDateRangeLabel = () => {
    if (view === 'month') return format(currentDate, 'MMMM yyyy');
    if (view === 'week') {
      const weekStart = startOfWeek(currentDate);
      const weekEnd = endOfWeek(currentDate);
      return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
    }
    return format(currentDate, 'EEEE, MMMM d, yyyy');
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-background rounded-lg border overflow-hidden">
      <div className="flex-1 flex flex-col">
        <OutlookIntegrationBanner />
        
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            <Button onClick={handleToday} variant="outline">Today</Button>
            <div className="flex items-center gap-2">
              <Button onClick={handlePrevious} variant="ghost" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button onClick={handleNext} variant="ghost" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <h2 className="text-xl font-semibold">{getDateRangeLabel()}</h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border">
              <Button
                variant={view === 'month' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setView('month')}
              >
                Month
              </Button>
              <Button
                variant={view === 'week' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setView('week')}
              >
                Week
              </Button>
              <Button
                variant={view === 'day' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setView('day')}
              >
                Day
              </Button>
            </div>

            <Button onClick={() => setIsBookingDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Book Meeting
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          {view === 'month' && (
            <CalendarMonthView
              currentDate={currentDate}
              events={events}
              onEventClick={handleEventClick}
              onDateClick={handleDateClick}
              onEmptySlotClick={(date) => handleEmptySlotClick(date)}
            />
          )}
          {view === 'week' && (
            <CalendarWeekView
              currentDate={currentDate}
              events={events}
              onEventClick={handleEventClick}
              onEmptySlotClick={(date, hour) => handleEmptySlotClick(date, hour)}
            />
          )}
          {view === 'day' && (
            <CalendarDayView
              currentDate={currentDate}
              events={events}
              onEventClick={handleEventClick}
              onEmptySlotClick={(hour, minute) => {
                const date = new Date(currentDate);
                date.setHours(hour, minute);
                handleEmptySlotClick(date, hour);
              }}
            />
          )}
        </div>
      </div>

      <BookMeetingDialog
        open={isBookingDialogOpen}
        onOpenChange={setIsBookingDialogOpen}
        onBooking={handleBookMeeting}
        defaultDate={bookingDefaults.date}
        defaultTime={bookingDefaults.time}
      />

      <EventDetailsModal
        event={selectedEvent}
        open={isEventModalOpen}
        onOpenChange={setIsEventModalOpen}
        onEdit={(event) => {
          setIsEventModalOpen(false);
          setIsBookingDialogOpen(true);
        }}
        onDelete={handleDeleteEvent}
        onComplete={handleCompleteEvent}
        onCancel={handleCancelEvent}
      />
    </div>
  );
}
