import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Phone, 
  PhoneIncoming, 
  PhoneOutgoing, 
  PhoneMissed,
  Play,
  Clock,
  User,
  Calendar
} from 'lucide-react';
import { useTenant } from '@/contexts/TenantContext';
import { supabase } from '@/integrations/supabase/client';
import { format, formatDistanceToNow } from 'date-fns';

interface AircallCall {
  id: string;
  aircall_call_id: string;
  phone_number: string;
  direction: string;
  status: string;
  duration: number | null;
  started_at: string | null;
  ended_at: string | null;
  recording_url: string | null;
  notes: string | null;
  outcome: string | null;
  agent_name: string | null;
  lead_id: string | null;
}

interface AircallCallHistoryProps {
  leadId?: string;
  limit?: number;
  showTitle?: boolean;
}

export const AircallCallHistory: React.FC<AircallCallHistoryProps> = ({
  leadId,
  limit = 10,
  showTitle = true
}) => {
  const { tenantId } = useTenant();
  const [calls, setCalls] = useState<AircallCall[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tenantId) {
      fetchCalls();
    }
  }, [tenantId, leadId]);

  const fetchCalls = async () => {
    if (!tenantId) return;
    
    setLoading(true);
    try {
      let query = supabase
        .from('aircall_calls')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('started_at', { ascending: false })
        .limit(limit);

      if (leadId) {
        query = query.eq('lead_id', leadId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setCalls((data as AircallCall[]) || []);
    } catch (error) {
      console.error('Error fetching call history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'inbound':
        return <PhoneIncoming className="h-4 w-4 text-blue-500" />;
      case 'outbound':
        return <PhoneOutgoing className="h-4 w-4 text-green-500" />;
      case 'missed':
        return <PhoneMissed className="h-4 w-4 text-red-500" />;
      default:
        return <Phone className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      completed: 'default',
      answered: 'default',
      missed: 'destructive',
      voicemail: 'secondary',
      busy: 'secondary'
    };
    
    return (
      <Badge variant={variants[status] || 'outline'} className="text-xs">
        {status}
      </Badge>
    );
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <Card>
        {showTitle && (
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Call History
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      {showTitle && (
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Call History
          </CardTitle>
        </CardHeader>
      )}
      <CardContent>
        {calls.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Phone className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No calls recorded yet</p>
            <p className="text-sm">Calls made through Aircall will appear here</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {calls.map((call) => (
                <div 
                  key={call.id} 
                  className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    {getDirectionIcon(call.direction)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{call.phone_number}</span>
                      {getStatusBadge(call.status)}
                    </div>
                    
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDuration(call.duration)}
                      </span>
                      
                      {call.agent_name && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {call.agent_name}
                        </span>
                      )}
                      
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {call.started_at 
                          ? formatDistanceToNow(new Date(call.started_at), { addSuffix: true })
                          : 'Unknown'
                        }
                      </span>
                    </div>
                    
                    {call.notes && (
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {call.notes}
                      </p>
                    )}
                    
                    {call.outcome && (
                      <Badge variant="outline" className="mt-2 text-xs">
                        {call.outcome}
                      </Badge>
                    )}
                  </div>
                  
                  {call.recording_url && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => window.open(call.recording_url!, '_blank')}
                      title="Play recording"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
