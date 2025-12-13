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
  RefreshCw,
  ExternalLink,
  Video,
  Loader2,
  CheckCircle2,
  Cloud
} from 'lucide-react';
import { toast } from 'sonner';
import { useOutlookConnection } from '@/hooks/useOutlookConnection';
import { OutlookService } from '@/services/outlookService';
import { supabase } from '@/integrations/supabase/client';
import { format, isToday, startOfDay, endOfDay } from 'date-fns';

interface CalendarEventItem {
  id: string;
  title: string;
  description?: string | null;
  start_time: string;
  end_time: string;
  location_details?: string | null;
  location_type?: string | null;
  meeting_link?: string | null;
  attendees?: any;
  microsoft_event_id?: string | null;
  sync_status?: string | null;
  status?: string | null;
}

export function OutlookCalendarWidget() {
  const { connectionStatus, loading: connectionLoading, connect } = useOutlookConnection();
  const [events, setEvents] = useState<CalendarEventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loadTodaysEvents();
  }, []);

  const loadTodaysEvents = async () => {
    setLoading(true);
    try {
      const today = new Date();
      const startTime = startOfDay(today).toISOString();
      const endTime = endOfDay(today).toISOString();

      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .gte('start_time', startTime)
        .lte('start_time', endTime)
        .order('start_time', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error loading calendar events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    if (!connectionStatus.connected) {
      toast.error('Please connect Outlook first');
      return;
    }
    
    setSyncing(true);
    try {
      const result = await OutlookService.syncCalendarEvents();
      toast.success(`Synced ${result.syncedEvents.length} events`);
      await loadTodaysEvents();
    } catch (error) {
      console.error('Error syncing calendar:', error);
      toast.error('Failed to sync calendar');
    } finally {
      setSyncing(false);
    }
  };

  const formatEventTime = (event: CalendarEventItem) => {
    const start = new Date(event.start_time);
    const end = new Date(event.end_time);
    return `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`;
  };

  const getEventTimeStatus = (event: CalendarEventItem) => {
    const now = new Date();
    const start = new Date(event.start_time);
    const end = new Date(event.end_time);
    
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

  if (connectionLoading) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
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
            {connectionStatus.connected && (
              <Badge variant="default" className="bg-emerald-500 text-xs">
                <Cloud className="h-3 w-3 mr-1" />
                Synced
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSync}
              disabled={syncing || !connectionStatus.connected}
            >
              {syncing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
            <Badge variant="secondary" className="text-xs">
              {events.length} events today
            </Badge>
          </div>
        </div>
        <CardDescription>
          {connectionStatus.connected 
            ? `Synced with ${connectionStatus.email}`
            : 'Connect Outlook for calendar sync'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!connectionStatus.connected && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span>Connect Outlook for two-way calendar sync</span>
            </div>
            <Button variant="outline" size="sm" onClick={connect}>
              Connect
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
              const isSynced = !!event.microsoft_event_id;
              
              return (
                <div
                  key={event.id}
                  className={`p-3 rounded-lg border border-l-4 ${
                    event.status === 'cancelled' 
                      ? 'border-l-gray-400 opacity-60' 
                      : 'border-l-blue-500'
                  } bg-card hover:bg-muted/50 transition-colors`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-sm">{event.title}</h4>
                        <div className={`w-2 h-2 rounded-full ${timeStatus.color}`} />
                        {isSynced && (
                          <span title="Synced with Outlook">
                            <Cloud className="h-3 w-3 text-blue-500" />
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatEventTime(event)}</span>
                        </div>
                        
                        {event.location_details && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate max-w-32">
                              {event.location_details}
                            </span>
                          </div>
                        )}
                        
                        {event.attendees && Array.isArray(event.attendees) && event.attendees.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>{event.attendees.length}</span>
                          </div>
                        )}
                      </div>

                      {event.description && (
                        <p className="text-xs text-muted-foreground truncate">
                          {event.description}
                        </p>
                      )}
                    </div>

                    {event.meeting_link && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-2"
                        onClick={() => window.open(event.meeting_link!, '_blank')}
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
