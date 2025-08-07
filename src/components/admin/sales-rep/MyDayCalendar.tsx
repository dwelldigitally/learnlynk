import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Calendar, Clock, Video, Phone, User, Plus, MapPin } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  type: 'call' | 'meeting' | 'intake' | 'follow_up' | 'demo';
  start_time: string;
  end_time: string;
  description?: string;
  attendees?: string[];
  location?: string;
  lead_name?: string;
  is_virtual?: boolean;
  meeting_link?: string;
}

export function MyDayCalendar() {
  const isMobile = useIsMobile();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  useEffect(() => {
    loadTodaysEvents();
  }, []);

  const loadTodaysEvents = async () => {
    try {
      // Mock calendar events for today
      const mockEvents: CalendarEvent[] = [
        {
          id: '1',
          title: 'Intake Meeting - Sarah Johnson',
          type: 'intake',
          start_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
          end_time: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
          description: 'MBA program intake discussion',
          lead_name: 'Sarah Johnson',
          is_virtual: true,
          meeting_link: 'https://zoom.us/j/123456789'
        },
        {
          id: '2',
          title: 'Follow-up Call - Michael Chen',
          type: 'follow_up',
          start_time: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
          end_time: new Date(Date.now() + 4.5 * 60 * 60 * 1000).toISOString(),
          description: 'Discuss application requirements',
          lead_name: 'Michael Chen',
          is_virtual: false
        },
        {
          id: '3',
          title: 'Program Demo - Tech Bootcamp',
          type: 'demo',
          start_time: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours from now
          end_time: new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString(),
          description: 'Live demo of our coding bootcamp curriculum',
          attendees: ['Emily Rodriguez', 'James Wilson'],
          is_virtual: true,
          meeting_link: 'https://zoom.us/j/987654321'
        }
      ];
      
      setEvents(mockEvents.sort((a, b) => 
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      ));
    } catch (error) {
      console.error('Failed to load today\'s events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone className="w-3 h-3" />;
      case 'meeting': return <User className="w-3 h-3" />;
      case 'intake': return <Calendar className="w-3 h-3" />;
      case 'follow_up': return <Phone className="w-3 h-3" />;
      case 'demo': return <Video className="w-3 h-3" />;
      default: return <Calendar className="w-3 h-3" />;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'call': return 'bg-blue-500';
      case 'meeting': return 'bg-green-500';
      case 'intake': return 'bg-purple-500';
      case 'follow_up': return 'bg-orange-500';
      case 'demo': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatTimeRange = (start: string, end: string) => {
    return `${formatTime(start)} - ${formatTime(end)}`;
  };

  const isEventSoon = (startTime: string) => {
    const now = new Date();
    const eventTime = new Date(startTime);
    const diffMinutes = (eventTime.getTime() - now.getTime()) / (1000 * 60);
    return diffMinutes <= 15 && diffMinutes > 0;
  };

  const getCurrentTimeSlot = () => {
    const now = new Date();
    return `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      slots.push(`${hour}:00`);
      slots.push(`${hour}:30`);
    }
    return slots;
  };

  if (loading) {
    return (
      <Card className="col-span-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            My Day
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-muted rounded-lg h-20"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          My Day - {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'short', 
            day: 'numeric' 
          })}
          <Badge variant="secondary" className="ml-auto">{events.length} events</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={cn("grid gap-6", isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2")}>
          {/* Timeline View */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground">Today's Schedule</h3>
            
            {events.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No events scheduled</p>
                <Button variant="outline" size="sm" className="mt-2">
                  <Plus className="w-3 h-3 mr-1" />
                  Schedule Meeting
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className={cn(
                      "p-4 rounded-lg border transition-colors",
                      isEventSoon(event.start_time)
                        ? "border-warning/20 bg-warning/5"
                        : "border-border hover:bg-muted/50"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn("w-3 h-3 rounded-full mt-1.5", getEventTypeColor(event.type))}></div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm truncate">{event.title}</h4>
                          {isEventSoon(event.start_time) && (
                            <Badge variant="outline" className="text-xs text-warning">
                              Starting Soon
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          <Clock className="w-3 h-3" />
                          <span>{formatTimeRange(event.start_time, event.end_time)}</span>
                          {event.is_virtual && (
                            <>
                              <span>•</span>
                              <Video className="w-3 h-3" />
                              <span>Virtual</span>
                            </>
                          )}
                        </div>
                        
                        {event.description && (
                          <p className="text-xs text-muted-foreground mb-2">
                            {event.description}
                          </p>
                        )}
                        
                        {event.attendees && event.attendees.length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <User className="w-3 h-3" />
                            <span>{event.attendees.join(', ')}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        {event.meeting_link && (
                          <Button size="sm" variant="outline" className="h-7 px-2">
                            <Video className="w-3 h-3 mr-1" />
                            Join
                          </Button>
                        )}
                        {getEventTypeIcon(event.type)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Time Blocking */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground">Available Time Slots</h3>
            
            <div className="grid grid-cols-2 gap-2">
              {generateTimeSlots().map((slot) => {
                const hasEvent = events.some(event => 
                  formatTime(event.start_time).startsWith(slot.split(':')[0])
                );
                const currentSlot = getCurrentTimeSlot();
                const isCurrent = slot === currentSlot;
                
                return (
                  <Button
                    key={slot}
                    variant={hasEvent ? "secondary" : "outline"}
                    size="sm"
                    className={cn(
                      "h-8 text-xs",
                      isCurrent && "border-primary",
                      hasEvent && "opacity-50 cursor-not-allowed"
                    )}
                    disabled={hasEvent}
                    onClick={() => setSelectedTimeSlot(slot)}
                  >
                    {slot}
                  </Button>
                );
              })}
            </div>
            
            {selectedTimeSlot && (
              <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-sm font-medium">Schedule meeting at {selectedTimeSlot}</p>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="default">
                    <Plus className="w-3 h-3 mr-1" />
                    Book Slot
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setSelectedTimeSlot(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}