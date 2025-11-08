import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Calendar, Clock, Video, Phone, User, Plus, MapPin, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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
  lead_id?: string;
  is_virtual?: boolean;
  meeting_link?: string;
}

export function MyDayCalendar() {
  const isMobile = useIsMobile();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [demoMode] = useState(true); // Always in demo mode

  useEffect(() => {
    loadTodaysEvents();
  }, []);

  const loadTodaysEvents = async () => {
    try {
      // Enhanced mock calendar events for today (reduced to 3 events)
      const mockEvents: CalendarEvent[] = [
        {
          id: '1',
          title: 'Intake Meeting - Sarah Johnson',
          type: 'intake',
          start_time: new Date(Date.now() + 0.5 * 60 * 60 * 1000).toISOString(),
          end_time: new Date(Date.now() + 1.5 * 60 * 60 * 1000).toISOString(),
          description: 'Data Science Masters program inquiry - High priority lead with CS background',
          lead_name: 'Sarah Johnson',
          lead_id: 'lead-1',
          is_virtual: true,
          meeting_link: 'https://zoom.us/j/123456789',
          location: 'Virtual Meeting Room'
        },
        {
          id: '2',
          title: 'Application Review - Michael Chen',
          type: 'meeting',
          start_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          end_time: new Date(Date.now() + 2.5 * 60 * 60 * 1000).toISOString(),
          description: 'MBA application status review - GMAT score 720, all documents submitted',
          lead_name: 'Michael Chen',
          lead_id: 'lead-2',
          attendees: ['Michael Chen', 'Admissions Team'],
          is_virtual: false,
          location: 'Conference Room B'
        },
        {
          id: '3',
          title: 'Corporate Training Demo - TechCorp',
          type: 'demo',
          start_time: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
          end_time: new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString(),
          description: 'Corporate training program demo for 150 employees - $200k-350k budget',
          attendees: ['Jennifer Lopez', 'Business Dev Team', 'Training Coordinators'],
          lead_id: 'lead-3',
          is_virtual: true,
          meeting_link: 'https://zoom.us/j/corporatedemo',
          location: 'Virtual Presentation Room'
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

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  const handleJoinMeeting = (meetingLink: string) => {
    window.open(meetingLink, '_blank');
  };

  if (loading) {
    return (
      <div className="col-span-full rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="pb-3 p-6">
          <div className="text-base flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Loading...
          </div>
        </div>
        <div className="p-6 pt-0">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-muted rounded-lg h-20"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-full rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="pb-3 p-6">
        <div className="text-base flex items-center gap-2">
          <Badge variant="secondary" className="ml-auto">{events.length} events</Badge>
          {demoMode && (
            <Badge variant="outline" className="text-xs">
              Demo Mode
            </Badge>
          )}
        </div>
      </div>
      <div className="p-6 pt-0">
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
                    onClick={() => handleEventClick(event)}
                    className={cn(
                      "p-4 rounded-lg border transition-all cursor-pointer group",
                      isEventSoon(event.start_time)
                        ? "border-warning/20 bg-warning/5 hover:border-warning/40 hover:shadow-md"
                        : "border-border hover:bg-muted/50 hover:border-primary/20 hover:shadow-md",
                      isEventSoon(event.start_time) && "animate-pulse"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn("w-3 h-3 rounded-full mt-1.5", getEventTypeColor(event.type))}></div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm truncate group-hover:text-primary transition-colors">{event.title}</h4>
                          {isEventSoon(event.start_time) && (
                            <Badge variant="outline" className="text-xs text-warning border-warning">
                              Starting Soon
                            </Badge>
                          )}
                          <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
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
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-7 px-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleJoinMeeting(event.meeting_link!);
                            }}
                          >
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
      </div>

      {/* Event Details Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className={cn("w-3 h-3 rounded-full", selectedEvent && getEventTypeColor(selectedEvent.type))}></div>
              {selectedEvent?.title}
            </DialogTitle>
            <DialogDescription>
              {selectedEvent && formatTimeRange(selectedEvent.start_time, selectedEvent.end_time)}
            </DialogDescription>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-4">
              {selectedEvent.description && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Type</h4>
                  <Badge variant="secondary" className="capitalize">
                    {selectedEvent.type.replace('_', ' ')}
                  </Badge>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-1">Format</h4>
                  <div className="flex items-center gap-1 text-sm">
                    {selectedEvent.is_virtual ? (
                      <>
                        <Video className="w-3 h-3" />
                        <span>Virtual</span>
                      </>
                    ) : (
                      <>
                        <MapPin className="w-3 h-3" />
                        <span>In-person</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {selectedEvent.location && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Location</h4>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {selectedEvent.location}
                  </p>
                </div>
              )}

              {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Attendees</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedEvent.attendees.map((attendee, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        <User className="w-3 h-3 mr-1" />
                        {attendee}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedEvent.lead_name && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Lead</h4>
                  <p className="text-sm text-muted-foreground">{selectedEvent.lead_name}</p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                {selectedEvent.meeting_link && (
                  <Button 
                    className="flex-1"
                    onClick={() => handleJoinMeeting(selectedEvent.meeting_link!)}
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Join Meeting
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedEvent(null)}
                  className={selectedEvent.meeting_link ? "" : "flex-1"}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}