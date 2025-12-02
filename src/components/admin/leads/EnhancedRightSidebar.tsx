import { useState, useEffect } from 'react';
import { 
  Phone, Clock, Calendar, 
  Video, CheckCircle, XCircle, Timer,
  Mail, TrendingUp, Zap, PlayCircle,
  PauseCircle, StopCircle
} from 'lucide-react';
import { Lead } from '@/types/lead';
import { SmartAdvisorMatch } from './SmartAdvisorMatch';
import { HotSheetCard, PastelBadge, PillButton, IconContainer, type PastelColor } from '@/components/hotsheet';
import { supabase } from '@/integrations/supabase/client';

interface EnhancedRightSidebarProps {
  lead: Lead;
}

interface CallRecord {
  id: string;
  type: string;
  direction: string;
  duration?: number;
  status: string;
  communication_date: string;
  content?: string;
}

interface Appointment {
  id: string;
  subject: string;
  type: string;
  status: string;
  scheduled_for?: string;
  communication_date: string;
  content?: string;
}

export function EnhancedRightSidebar({ lead }: EnhancedRightSidebarProps) {
  const [callHistory, setCallHistory] = useState<CallRecord[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingCalls, setLoadingCalls] = useState(true);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

  useEffect(() => {
    fetchCallHistory();
    fetchAppointments();
  }, [lead.id]);

  const fetchCallHistory = async () => {
    setLoadingCalls(true);
    try {
      const { data, error } = await supabase
        .from('lead_communications')
        .select('id, type, direction, status, communication_date, content, metadata')
        .eq('lead_id', lead.id)
        .eq('type', 'phone')
        .order('communication_date', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching call history:', error);
        setCallHistory([]);
      } else {
        setCallHistory((data || []).map(call => ({
          id: call.id,
          type: call.type,
          direction: call.direction || 'outbound',
          duration: (call.metadata as any)?.duration,
          status: call.status,
          communication_date: call.communication_date,
          content: call.content
        })));
      }
    } catch (error) {
      console.error('Error fetching call history:', error);
      setCallHistory([]);
    } finally {
      setLoadingCalls(false);
    }
  };

  const fetchAppointments = async () => {
    setLoadingAppointments(true);
    try {
      const { data, error } = await supabase
        .from('lead_communications')
        .select('id, type, subject, status, scheduled_for, communication_date, content')
        .eq('lead_id', lead.id)
        .eq('type', 'meeting')
        .order('scheduled_for', { ascending: true })
        .limit(5);

      if (error) {
        console.error('Error fetching appointments:', error);
        setAppointments([]);
      } else {
        setAppointments((data || []).map(apt => ({
          id: apt.id,
          subject: apt.subject || 'Meeting',
          type: apt.type,
          status: apt.status,
          scheduled_for: apt.scheduled_for,
          communication_date: apt.communication_date,
          content: apt.content
        })));
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setAppointments([]);
    } finally {
      setLoadingAppointments(false);
    }
  };

  // AI Sequences data - keeping static for now as these may come from campaigns/sequences table
  const aiSequences = [
    {
      id: '1',
      name: 'MBA Welcome Series',
      description: 'Comprehensive introduction to MBA programs and requirements',
      type: 'nurture',
      status: 'active',
      duration: '14 days',
      emails: 5,
      conversionRate: 18,
      enrolled: false
    },
    {
      id: '2',
      name: 'Application Deadline Reminder',
      description: 'Urgent reminders for approaching application deadlines',
      type: 'deadline-driven',
      status: 'active',
      duration: '7 days',
      emails: 3,
      conversionRate: 45,
      enrolled: true
    },
    {
      id: '3',
      name: 'Financial Aid Information',
      description: 'Complete guide to scholarships and financial assistance',
      type: 'educational',
      status: 'draft',
      duration: '10 days',
      emails: 4,
      conversionRate: 22,
      enrolled: false
    }
  ];

  const getCallStatusColor = (status: string): PastelColor => {
    switch (status) {
      case 'completed': return 'emerald';
      case 'sent': return 'emerald';
      case 'missed': return 'rose';
      case 'failed': return 'rose';
      default: return 'amber';
    }
  };

  const getAppointmentStatusColor = (status: string): PastelColor => {
    switch (status) {
      case 'completed': return 'emerald';
      case 'scheduled': return 'sky';
      case 'cancelled': return 'rose';
      default: return 'amber';
    }
  };

  const getSequenceTypeColor = (type: string): PastelColor => {
    switch (type) {
      case 'nurture': return 'sky';
      case 'deadline-driven': return 'rose';
      case 'educational': return 'violet';
      default: return 'slate';
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSequenceAction = (sequenceId: string, action: 'enroll' | 'pause' | 'stop') => {
    console.log(`${action} sequence ${sequenceId}`);
    // Implementation would go here
  };

  return (
    <div className="w-full lg:w-72 bg-card lg:border-l border-border/40 flex flex-col">
      {/* Call History */}
      <div className="p-4 border-b border-border/40">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <IconContainer color="sky" size="sm">
            <Phone className="h-4 w-4" />
          </IconContainer>
          Call History
        </h3>
        <div className="space-y-3">
          {loadingCalls ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            </div>
          ) : callHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No calls recorded</p>
          ) : (
            callHistory.map((call) => (
              <HotSheetCard key={call.id} padding="sm" hover className="border-border/40">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <PastelBadge color={getCallStatusColor(call.status)} size="sm">
                      {call.status}
                    </PastelBadge>
                    <PastelBadge color="slate" size="sm">
                      {call.direction}
                    </PastelBadge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDuration(call.duration)}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mb-1">
                  {new Date(call.communication_date).toLocaleString()}
                </div>
                {call.content && (
                  <p className="text-xs text-foreground line-clamp-2">{call.content}</p>
                )}
              </HotSheetCard>
            ))
          )}
        </div>
      </div>

      {/* Appointment History */}
      <div className="p-4 border-b border-border/40">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <IconContainer color="emerald" size="sm">
            <Calendar className="h-4 w-4" />
          </IconContainer>
          Appointments
        </h3>
        <div className="space-y-3">
          {loadingAppointments ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            </div>
          ) : appointments.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No appointments scheduled</p>
          ) : (
            appointments.map((appointment) => (
              <HotSheetCard key={appointment.id} padding="sm" hover className="border-border/40">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <PastelBadge color={getAppointmentStatusColor(appointment.status)} size="sm">
                      {appointment.status}
                    </PastelBadge>
                    <span className="text-sm font-medium truncate">{appointment.subject}</span>
                  </div>
                  <IconContainer color="violet" size="sm">
                    <Video className="h-3 w-3" />
                  </IconContainer>
                </div>
                <div className="text-xs text-muted-foreground mb-1">
                  {appointment.scheduled_for 
                    ? new Date(appointment.scheduled_for).toLocaleString()
                    : new Date(appointment.communication_date).toLocaleString()
                  }
                </div>
                {appointment.content && (
                  <p className="text-xs text-foreground line-clamp-2">{appointment.content}</p>
                )}
              </HotSheetCard>
            ))
          )}
        </div>
        <PillButton variant="outline" size="sm" className="w-full mt-3" icon={<Calendar className="h-4 w-4" />}>
          Schedule Meeting
        </PillButton>
      </div>

      {/* AI Sequences Section */}
      <div className="p-4 border-b border-border/40">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <IconContainer color="primary" size="sm">
              <Zap className="h-4 w-4" />
            </IconContainer>
            <h3 className="text-lg font-semibold">AI Sequences</h3>
          </div>
          <PastelBadge color="emerald" size="sm">
            {aiSequences.filter(s => s.enrolled).length} Active
          </PastelBadge>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          Automated email sequences powered by AI to nurture and convert leads
        </p>

        <div className="space-y-3">
          {aiSequences.map((sequence) => {
            const isEnrolled = sequence.enrolled;
            
            return (
              <HotSheetCard 
                key={sequence.id} 
                padding="sm"
                hover={!isEnrolled}
                className={isEnrolled ? 'border-emerald-200 bg-emerald-50/50' : 'border-border/40'}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="text-sm font-semibold truncate">{sequence.name}</h4>
                      <PastelBadge color={getSequenceTypeColor(sequence.type)} size="sm">
                        {sequence.type}
                      </PastelBadge>
                      {isEnrolled && (
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 break-words">{sequence.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1 min-w-0">
                        <Clock className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{sequence.duration}</span>
                      </div>
                      <div className="flex items-center gap-1 min-w-0">
                        <Mail className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{sequence.emails} emails</span>
                      </div>
                      <div className="flex items-center gap-1 min-w-0">
                        <TrendingUp className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{sequence.conversionRate}%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {isEnrolled ? (
                    <>
                      <PillButton
                        size="sm"
                        variant="outline"
                        className="flex-1 h-7 text-xs"
                        onClick={() => handleSequenceAction(sequence.id, 'pause')}
                        icon={<PauseCircle className="h-3 w-3" />}
                      >
                        Pause
                      </PillButton>
                      <PillButton
                        size="sm"
                        variant="outline"
                        className="flex-1 h-7 text-xs"
                        onClick={() => handleSequenceAction(sequence.id, 'stop')}
                        icon={<StopCircle className="h-3 w-3" />}
                      >
                        Stop
                      </PillButton>
                    </>
                  ) : (
                    <PillButton
                      size="sm"
                      variant="primary"
                      className="flex-1 h-7 text-xs"
                      onClick={() => handleSequenceAction(sequence.id, 'enroll')}
                      icon={<PlayCircle className="h-3 w-3" />}
                    >
                      Enroll Lead
                    </PillButton>
                  )}
                </div>
              </HotSheetCard>
            );
          })}
        </div>

        <PillButton variant="outline" size="sm" className="w-full mt-3" icon={<Zap className="h-4 w-4" />}>
          Manage Sequences
        </PillButton>
      </div>

      {/* Smart Advisor Match */}
      <div className="p-4">
        <SmartAdvisorMatch lead={lead} />
      </div>
    </div>
  );
}
