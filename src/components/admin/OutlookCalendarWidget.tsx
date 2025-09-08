import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  Plus,
  RefreshCw,
  ExternalLink,
  Video
} from 'lucide-react';
import { toast } from 'sonner';
import { MicrosoftGraphService } from '@/services/microsoftGraphService';
import { format, isToday, isTomorrow, isYesterday, startOfDay, endOfDay } from 'date-fns';

interface CalendarEvent {
  id: string;
  subject: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  location?: {
    displayName: string;
  };
  attendees?: Array<{
    emailAddress: {
      name: string;
      address: string;
    };
  }>;
  bodyPreview?: string;
  isOnlineMeeting?: boolean;
  onlineMeeting?: {
    joinUrl: string;
  };
  importance: 'low' | 'normal' | 'high';
}

export function OutlookCalendarWidget() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(true);

  useEffect(() => {
    // Always start in demo mode
    enableDemoMode();
  }, []);

  const checkConnection = async () => {
    try {
      const token = localStorage.getItem('outlook_access_token');
      if (token) {
        setAccessToken(token);
        setIsConnected(true);
        await loadTodaysEvents(token);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error checking Outlook connection:', error);
      setLoading(false);
    }
  };

  const connectOutlook = async () => {
    try {
      const authUrl = MicrosoftGraphService.getAuthUrl();
      window.open(authUrl, '_blank', 'width=500,height=600');
      
      // Listen for auth completion
      const handleAuthMessage = (event: MessageEvent) => {
        if (event.data.type === 'OUTLOOK_AUTH_SUCCESS') {
          setAccessToken(event.data.accessToken);
          setIsConnected(true);
          localStorage.setItem('outlook_access_token', event.data.accessToken);
          loadTodaysEvents(event.data.accessToken);
          window.removeEventListener('message', handleAuthMessage);
        }
      };
      
      window.addEventListener('message', handleAuthMessage);
    } catch (error) {
      console.error('Error connecting to Outlook:', error);
      toast.error('Failed to connect to Outlook');
    }
  };

  const generateDemoEvents = (): CalendarEvent[] => {
    const now = new Date();
    const startOfToday = startOfDay(now);
    
    return [
      {
        id: 'demo-1',
        subject: 'Intake Meeting - Sarah Johnson',
        start: {
          dateTime: new Date(startOfToday.getTime() + 9 * 60 * 60 * 1000).toISOString(), // 9 AM
          timeZone: 'UTC'
        },
        end: {
          dateTime: new Date(startOfToday.getTime() + 10 * 60 * 60 * 1000).toISOString(), // 10 AM
          timeZone: 'UTC'
        },
        bodyPreview: 'Data Science Masters program inquiry - High priority lead with CS background',
        location: { displayName: 'Virtual Meeting Room' },
        attendees: [{ emailAddress: { name: 'Sarah Johnson', address: 'sarah.johnson@email.com' } }],
        isOnlineMeeting: true,
        onlineMeeting: { joinUrl: 'https://teams.microsoft.com/join/demo1' },
        importance: 'high'
      },
      {
        id: 'demo-2',
        subject: 'Application Review - Michael Chen',
        start: {
          dateTime: new Date(startOfToday.getTime() + 11 * 60 * 60 * 1000).toISOString(), // 11 AM
          timeZone: 'UTC'
        },
        end: {
          dateTime: new Date(startOfToday.getTime() + 11.5 * 60 * 60 * 1000).toISOString(), // 11:30 AM
          timeZone: 'UTC'
        },
        bodyPreview: 'MBA application status review - GMAT score 720, all documents submitted',
        location: { displayName: 'Conference Room B' },
        attendees: [
          { emailAddress: { name: 'Michael Chen', address: 'm.chen.dev@gmail.com' } },
          { emailAddress: { name: 'Admissions Team', address: 'admissions@college.edu' } }
        ],
        isOnlineMeeting: false,
        importance: 'normal'
      },
      {
        id: 'demo-3',
        subject: 'Corporate Training Demo - TechCorp',
        start: {
          dateTime: new Date(startOfToday.getTime() + 14 * 60 * 60 * 1000).toISOString(), // 2 PM
          timeZone: 'UTC'
        },
        end: {
          dateTime: new Date(startOfToday.getTime() + 15.5 * 60 * 60 * 1000).toISOString(), // 3:30 PM
          timeZone: 'UTC'
        },
        bodyPreview: 'Corporate training program demo for 150 employees - $200k-350k budget',
        location: { displayName: 'Virtual Presentation Room' },
        attendees: [
          { emailAddress: { name: 'Jennifer Lopez', address: 'jlopez.finance@company.com' } },
          { emailAddress: { name: 'Business Dev Team', address: 'bizdev@college.edu' } }
        ],
        isOnlineMeeting: true,
        onlineMeeting: { joinUrl: 'https://teams.microsoft.com/join/demo3' },
        importance: 'high'
      },
      {
        id: 'demo-4',
        subject: 'Student Support - Alex Kumar',
        start: {
          dateTime: new Date(startOfToday.getTime() + 16 * 60 * 60 * 1000).toISOString(), // 4 PM
          timeZone: 'UTC'
        },
        end: {
          dateTime: new Date(startOfToday.getTime() + 16.5 * 60 * 60 * 1000).toISOString(), // 4:30 PM
          timeZone: 'UTC'
        },
        bodyPreview: 'Help with student portal access issues - CS Year 2 student',
        location: { displayName: 'IT Support Office' },
        attendees: [{ emailAddress: { name: 'Alex Kumar', address: 'alex.kumar.2024@outlook.com' } }],
        isOnlineMeeting: false,
        importance: 'normal'
      },
      {
        id: 'demo-5',
        subject: 'Partnership Discussion - Dr. Emily Rodriguez',
        start: {
          dateTime: new Date(startOfToday.getTime() + 17 * 60 * 60 * 1000).toISOString(), // 5 PM
          timeZone: 'UTC'
        },
        end: {
          dateTime: new Date(startOfToday.getTime() + 18 * 60 * 60 * 1000).toISOString(), // 6 PM
          timeZone: 'UTC'
        },
        bodyPreview: 'Research collaboration & student exchange opportunities with State University',
        location: { displayName: 'Virtual Conference Room' },
        attendees: [
          { emailAddress: { name: 'Dr. Emily Rodriguez', address: 'e.rodriguez@university.edu' } },
          { emailAddress: { name: 'Academic Affairs', address: 'academic@college.edu' } }
        ],
        isOnlineMeeting: true,
        onlineMeeting: { joinUrl: 'https://teams.microsoft.com/join/demo5' },
        importance: 'normal'
      }
    ];
  };

  const loadDemoEvents = () => {
    setLoading(true);
    try {
      const demoEvents = generateDemoEvents();
      setEvents(demoEvents);
    } catch (error) {
      console.error('Error loading demo events:', error);
      toast.error('Failed to load demo events');
    } finally {
      setLoading(false);
    }
  };

  const enableDemoMode = () => {
    setDemoMode(true);
    setIsConnected(true);
    loadDemoEvents();
  };

  const loadTodaysEvents = async (token: string) => {
    setLoading(true);
    try {
      const today = new Date();
      const startTime = startOfDay(today).toISOString();
      const endTime = endOfDay(today).toISOString();

      const response = await MicrosoftGraphService.makeGraphRequest(
        `/me/calendar/calendarView?startDateTime=${startTime}&endDateTime=${endTime}&$orderby=start/dateTime&$top=10`,
        token
      );

      setEvents(response.value || []);
    } catch (error) {
      console.error('Error loading calendar events:', error);
      toast.error('Failed to load calendar events');
    } finally {
      setLoading(false);
    }
  };

  const refreshEvents = () => {
    if (demoMode) {
      loadDemoEvents();
    } else if (accessToken) {
      loadTodaysEvents(accessToken);
    }
  };

  const formatEventTime = (event: CalendarEvent) => {
    const start = new Date(event.start.dateTime);
    const end = new Date(event.end.dateTime);
    
    return `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`;
  };

  const getEventTimeStatus = (event: CalendarEvent) => {
    const now = new Date();
    const start = new Date(event.start.dateTime);
    const end = new Date(event.end.dateTime);
    
    if (now >= start && now <= end) {
      return { status: 'ongoing', color: 'bg-green-500' };
    } else if (start > now && start.getTime() - now.getTime() <= 15 * 60 * 1000) {
      return { status: 'starting-soon', color: 'bg-yellow-500' };
    } else if (start > now) {
      return { status: 'upcoming', color: 'bg-blue-500' };
    } else {
      return { status: 'completed', color: 'bg-gray-400' };
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'border-l-red-500';
      case 'normal': return 'border-l-blue-500';
      case 'low': return 'border-l-gray-400';
      default: return 'border-l-blue-500';
    }
  };

  if (!isConnected) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>My Day Calendar</span>
          </CardTitle>
          <CardDescription>
            Connect your Outlook calendar to see today's schedule
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8 space-y-4">
          <Calendar className="h-12 w-12 text-muted-foreground" />
          <div className="text-center space-y-2">
            <h3 className="font-medium">Connect Outlook Calendar</h3>
            <p className="text-sm text-muted-foreground">
              View and manage your daily schedule from Outlook
            </p>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={connectOutlook}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Connect Outlook
            </Button>
            <Button variant="outline" onClick={enableDemoMode}>
              <Calendar className="h-4 w-4 mr-2" />
              Demo Mode
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <CardTitle>My Day Calendar</CardTitle>
            {demoMode && (
              <Badge variant="secondary" className="text-xs">
                Demo Mode
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={refreshEvents}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Badge variant="secondary" className="text-xs">
              {events.length} events today
            </Badge>
          </div>
        </div>
        <CardDescription>
          {demoMode ? 'Demo calendar events for product demonstration' : 'Today\'s schedule from Outlook'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {demoMode && (
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setDemoMode(false);
                setIsConnected(false);
                setEvents([]);
              }}
            >
              Exit Demo Mode
            </Button>
          </div>
        )}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-8 space-y-4">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto" />
            <div className="space-y-2">
              <h3 className="font-medium">No events today</h3>
              <p className="text-sm text-muted-foreground">
                Enjoy your free day!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {events.map((event) => {
              const timeStatus = getEventTimeStatus(event);
              return (
                <div
                  key={event.id}
                  className={`p-3 rounded-lg border border-l-4 ${getImportanceColor(event.importance)} bg-card hover:bg-muted/50 transition-colors`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-sm">{event.subject}</h4>
                        <div className={`w-2 h-2 rounded-full ${timeStatus.color}`} />
                      </div>
                      
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatEventTime(event)}</span>
                        </div>
                        
                        {event.location?.displayName && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate max-w-32">
                              {event.location.displayName}
                            </span>
                          </div>
                        )}
                        
                        {event.attendees && event.attendees.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>{event.attendees.length}</span>
                          </div>
                        )}
                      </div>

                      {event.bodyPreview && (
                        <p className="text-xs text-muted-foreground truncate">
                          {event.bodyPreview}
                        </p>
                      )}
                    </div>

                    {event.isOnlineMeeting && event.onlineMeeting?.joinUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-2"
                        onClick={() => window.open(event.onlineMeeting!.joinUrl, '_blank')}
                      >
                        <Video className="h-3 w-3 mr-1" />
                        Join
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}