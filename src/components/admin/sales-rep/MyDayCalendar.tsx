import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Calendar, Clock, Video, Phone, User, Plus, MapPin, ExternalLink, CalendarDays } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';

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
  const [weekEvents, setWeekEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [demoMode] = useState(true); // Always in demo mode

  useEffect(() => {
    loadTodaysEvents();
    loadWeekEvents();
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

  const loadWeekEvents = async () => {
    try {
      const today = new Date();
      const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday start
      
      // Generate mock events for the entire week
      const mockWeekEvents: CalendarEvent[] = [
        // Monday
        {
          id: 'w1',
          title: 'Team Standup',
          type: 'meeting',
          start_time: addDays(weekStart, 0).setHours(9, 0, 0, 0).toString(),
          end_time: addDays(weekStart, 0).setHours(9, 30, 0, 0).toString(),
          description: 'Daily team sync',
          is_virtual: true,
          meeting_link: 'https://zoom.us/j/teamstandup',
        },
        // Tuesday
        {
          id: 'w2',
          title: 'Client Demo - ABC Corp',
          type: 'demo',
          start_time: addDays(weekStart, 1).setHours(14, 0, 0, 0).toString(),
          end_time: addDays(weekStart, 1).setHours(15, 0, 0, 0).toString(),
          description: 'Product demonstration for potential enterprise client',
          lead_name: 'ABC Corporation',
          lead_id: 'lead-abc',
          is_virtual: true,
          meeting_link: 'https://zoom.us/j/abcdemo',
        },
        // Wednesday - Today's events
        ...events.map(e => ({ ...e, id: `today-${e.id}` })),
        // Thursday
        {
          id: 'w3',
          title: 'Follow-up Call - Jennifer Smith',
          type: 'follow_up',
          start_time: addDays(weekStart, 3).setHours(10, 30, 0, 0).toString(),
          end_time: addDays(weekStart, 3).setHours(11, 0, 0, 0).toString(),
          description: 'Post-demo follow-up discussion',
          lead_name: 'Jennifer Smith',
          lead_id: 'lead-jennifer',
          is_virtual: false,
          location: 'Phone Call',
        },
        {
          id: 'w4',
          title: 'Intake Meeting - David Brown',
          type: 'intake',
          start_time: addDays(weekStart, 3).setHours(15, 0, 0, 0).toString(),
          end_time: addDays(weekStart, 3).setHours(16, 0, 0, 0).toString(),
          description: 'MBA program consultation',
          lead_name: 'David Brown',
          lead_id: 'lead-david',
          is_virtual: true,
          meeting_link: 'https://zoom.us/j/davidintake',
        },
        // Friday
        {
          id: 'w5',
          title: 'Weekly Review Meeting',
          type: 'meeting',
          start_time: addDays(weekStart, 4).setHours(16, 0, 0, 0).toString(),
          end_time: addDays(weekStart, 4).setHours(17, 0, 0, 0).toString(),
          description: 'Review week performance and plan for next week',
          attendees: ['Sales Team', 'Manager'],
          is_virtual: false,
          location: 'Conference Room A',
        },
      ];

      setWeekEvents(mockWeekEvents.sort((a, b) => 
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      ));
    } catch (error) {
      console.error('Failed to load week events:', error);
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

  const getWeekDays = () => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  };

  const getEventsForDay = (day: Date) => {
    return weekEvents.filter(event => 
      isSameDay(new Date(event.start_time), day)
    );
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
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'daily' | 'weekly')} className="w-auto">
            <TabsList>
              <TabsTrigger value="daily" className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Daily
              </TabsTrigger>
              <TabsTrigger value="weekly" className="flex items-center gap-1">
                <CalendarDays className="w-3 h-3" />
                Weekly
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {viewMode === 'daily' ? `${events.length} events today` : `${weekEvents.length} events this week`}
            </Badge>
            {demoMode && (
              <Badge variant="outline" className="text-xs">
                Demo Mode
              </Badge>
            )}
          </div>
        </div>
      </div>
      <div className="p-6 pt-0">
        {viewMode === 'daily' ? (
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
        ) : (
          /* Weekly View */
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
              {getWeekDays().map((day, idx) => {
                const dayEvents = getEventsForDay(day);
                const isToday = isSameDay(day, new Date());
                
                return (
                  <div 
                    key={idx}
                    className={cn(
                      "rounded-lg border p-3 min-h-[200px]",
                      isToday ? "border-primary bg-primary/5" : "border-border"
                    )}
                  >
                    <div className="mb-3 pb-2 border-b">
                      <div className="text-xs text-muted-foreground">
                        {format(day, 'EEE')}
                      </div>
                      <div className={cn(
                        "text-lg font-semibold",
                        isToday && "text-primary"
                      )}>
                        {format(day, 'd')}
                      </div>
                      {isToday && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          Today
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      {dayEvents.length === 0 ? (
                        <p className="text-xs text-muted-foreground text-center py-4">
                          No events
                        </p>
                      ) : (
                        dayEvents.map((event) => (
                          <div
                            key={event.id}
                            onClick={() => handleEventClick(event)}
                            className={cn(
                              "p-2 rounded border cursor-pointer transition-all group hover:shadow-md",
                              isEventSoon(event.start_time)
                                ? "border-warning/40 bg-warning/10"
                                : "border-border/50 hover:border-primary/30"
                            )}
                          >
                            <div className="flex items-start gap-2">
                              <div className={cn("w-2 h-2 rounded-full mt-1 flex-shrink-0", getEventTypeColor(event.type))}></div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium truncate group-hover:text-primary transition-colors">
                                  {event.title}
                                </p>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                  <Clock className="w-2.5 h-2.5" />
                                  <span className="text-xs">{formatTime(event.start_time)}</span>
                                </div>
                                {event.is_virtual && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <Video className="w-2.5 h-2.5 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
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