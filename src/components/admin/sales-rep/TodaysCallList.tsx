import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';

import { cn } from '@/lib/utils';
import { Phone, Clock, AlertTriangle, Star, PhoneCall, User, Zap, Users } from 'lucide-react';
import { Lead } from '@/types/lead';
import { LeadService } from '@/services/leadService';

interface CallItem extends Lead {
  call_type: 'scheduled' | 'follow_up' | 'overdue';
  scheduled_time?: string;
  call_notes?: string;
}

export function TodaysCallList() {
  const isMobile = useIsMobile();
  
  const [callList, setCallList] = useState<CallItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTodaysCallList();
  }, []);

  const loadTodaysCallList = async () => {
    try {
      // Enhanced mock call list with more realistic data
      const mockCallItems: CallItem[] = [
        {
          id: 'call-1',
          first_name: 'Sarah',
          last_name: 'Johnson',
          email: 'sarah.johnson@email.com',
          phone: '+1 (555) 123-4567',
          country: 'United States',
          state: 'California',
          city: 'San Francisco',
          source: 'web' as const,
          status: 'qualified' as const,
          stage: 'QUALIFICATION' as const,
          priority: 'high' as const,
          lead_score: 87,
          program_interest: ['MBA', 'Executive MBA'],
          assigned_to: 'current-user',
          tags: ['hot-lead', 'mba-interested'],
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
          call_type: 'scheduled' as const,
          scheduled_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          call_notes: 'Follow up on MBA application requirements and scholarship opportunities',
          next_follow_up_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'call-2',
          first_name: 'Michael',
          last_name: 'Chen',
          email: 'michael.chen@email.com',
          phone: '+1 (555) 234-5678',
          country: 'United States',
          state: 'New York',
          city: 'New York',
          source: 'referral' as const,
          status: 'contacted' as const,
          stage: 'NURTURING' as const,
          priority: 'medium' as const,
          lead_score: 72,
          program_interest: ['Business Analytics', 'Data Science'],
          assigned_to: 'current-user',
          tags: ['callback-requested'],
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
          call_type: 'follow_up' as const,
          scheduled_time: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
          call_notes: 'Discuss program comparison and career outcomes',
          next_follow_up_at: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'call-3',
          first_name: 'Emily',
          last_name: 'Rodriguez',
          email: 'emily.rodriguez@email.com',
          phone: '+1 (555) 345-6789',
          country: 'United States',
          state: 'Texas',
          city: 'Austin',
          source: 'social_media' as const,
          status: 'new' as const,
          stage: 'NEW_INQUIRY' as const,
          priority: 'urgent' as const,
          lead_score: 65,
          program_interest: ['Marketing Certificate', 'Digital Marketing'],
          assigned_to: 'current-user',
          tags: ['overdue'],
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
          call_type: 'overdue' as const,
          scheduled_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          call_notes: 'OVERDUE: Initial consultation call - application deadline approaching',
          next_follow_up_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'call-4',
          first_name: 'David',
          last_name: 'Kim',
          email: 'david.kim@email.com',
          phone: '+1 (555) 456-7890',
          country: 'United States',
          state: 'Washington',
          city: 'Seattle',
          source: 'email' as const,
          status: 'nurturing' as const,
          stage: 'PROPOSAL_SENT' as const,
          priority: 'high' as const,
          lead_score: 84,
          program_interest: ['Executive MBA'],
          assigned_to: 'current-user',
          tags: ['decision-pending'],
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
          call_type: 'scheduled' as const,
          scheduled_time: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
          call_notes: 'Decision call - proposal review and next steps',
          next_follow_up_at: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'call-5',
          first_name: 'Lisa',
          last_name: 'Wang',
          email: 'lisa.wang@email.com',
          phone: '+1 (555) 567-8901',
          country: 'Canada',
          state: 'Ontario',
          city: 'Toronto',
          source: 'event' as const,
          status: 'qualified' as const,
          stage: 'APPLICATION_STARTED' as const,
          priority: 'medium' as const,
          lead_score: 78,
          program_interest: ['Finance MBA', 'Investment Management'],
          assigned_to: 'current-user',
          tags: ['international', 'application-in-progress'],
          created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
          call_type: 'follow_up' as const,
          scheduled_time: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
          call_notes: 'Application support call - document submission guidance',
          next_follow_up_at: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      setCallList(mockCallItems);
    } catch (error) {
      console.error('Failed to load today\'s call list:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = (lead: CallItem) => {
    if (lead.phone) {
      // Open phone dialer
      window.open(`tel:${lead.phone}`);
    }
  };

  const handleBulkCall = () => {
    console.log('Starting bulk calling session for', callList.length, 'leads');
    // Here you would implement bulk calling logic
    // Could open a dedicated bulk calling interface
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
          {callList.length > 1 && (
            <Button 
              size="sm" 
              variant="outline" 
              className="h-6 px-2 text-xs gap-1 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700 hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100"
              onClick={handleBulkCall}
            >
              <Zap className="w-3 h-3" />
              Start Bulk Calling
            </Button>
          )}
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