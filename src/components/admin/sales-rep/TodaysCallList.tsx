import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAircallWidget } from '@/hooks/useAircallWidget';
import { cn } from '@/lib/utils';
import { Phone, Clock, AlertTriangle, Star, PhoneCall, User } from 'lucide-react';
import { Lead } from '@/types/lead';
import { LeadService } from '@/services/leadService';

interface CallItem extends Lead {
  call_type: 'scheduled' | 'follow_up' | 'overdue';
  scheduled_time?: string;
  call_notes?: string;
}

export function TodaysCallList() {
  const isMobile = useIsMobile();
  const { makeCall, isWidgetReady } = useAircallWidget();
  const [callList, setCallList] = useState<CallItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTodaysCallList();
  }, []);

  const loadTodaysCallList = async () => {
    try {
      // Get leads that need to be called today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const filters = {
        date_range: {
          start: today,
          end: tomorrow
        }
      };
      
      const response = await LeadService.getLeads(filters, 1, 10);
      
      // Mock transformation to add call-specific data
      const callItems: CallItem[] = response.leads.map(lead => ({
        ...lead,
        call_type: lead.next_follow_up_at ? 
          (new Date(lead.next_follow_up_at) < new Date() ? 'overdue' : 'scheduled') : 
          'follow_up',
        scheduled_time: lead.next_follow_up_at,
        call_notes: `Follow up on ${lead.program_interest.join(', ')} inquiry`
      }));
      
      setCallList(callItems.filter(item => item.phone));
    } catch (error) {
      console.error('Failed to load today\'s call list:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = (lead: CallItem) => {
    if (lead.phone && isWidgetReady) {
      makeCall(lead.phone);
    } else {
      // Fallback: open phone dialer
      window.open(`tel:${lead.phone}`);
    }
  };

  const getCallTypeColor = (type: string) => {
    switch (type) {
      case 'overdue': return 'text-destructive';
      case 'scheduled': return 'text-primary';
      case 'follow_up': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const getCallTypeBadge = (type: string) => {
    switch (type) {
      case 'overdue': return { variant: 'destructive' as const, label: 'Overdue' };
      case 'scheduled': return { variant: 'default' as const, label: 'Scheduled' };
      case 'follow_up': return { variant: 'secondary' as const, label: 'Follow-up' };
      default: return { variant: 'outline' as const, label: 'Call' };
    }
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return 'ASAP';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Today's Call List
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
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Phone className="w-4 h-4" />
          Today's Call List
          <Badge variant="secondary" className="ml-auto">{callList.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {callList.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Phone className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No calls scheduled</p>
          </div>
        ) : (
          <div className="space-y-3">
            {callList.map((call) => {
              const badgeProps = getCallTypeBadge(call.call_type);
              
              return (
                <div
                  key={call.id}
                  className={cn(
                    "p-3 rounded-lg border transition-colors",
                    call.call_type === 'overdue' 
                      ? "border-destructive/20 bg-destructive/5" 
                      : "border-border hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">
                        {call.first_name[0]}{call.last_name[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm truncate">
                          {call.first_name} {call.last_name}
                        </p>
                        <Badge variant={badgeProps.variant} className="text-xs">
                          {badgeProps.label}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(call.scheduled_time)}</span>
                        <span>•</span>
                        <span>{call.phone}</span>
                      </div>
                      
                      {call.call_notes && (
                        <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                          {call.call_notes}
                        </p>
                      )}

                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-warning" />
                        <span className="text-xs font-medium">{call.lead_score}/100</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <Button
                        size="sm"
                        variant="default"
                        className="h-8 px-3"
                        onClick={() => handleCall(call)}
                      >
                        <PhoneCall className="w-3 h-3 mr-1" />
                        Call
                      </Button>
                      
                      {call.call_type === 'overdue' && (
                        <div className="flex items-center gap-1 text-xs text-destructive">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Overdue</span>
                        </div>
                      )}
                    </div>
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