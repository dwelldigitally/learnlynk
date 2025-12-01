import { 
  Phone, Clock, Calendar, 
  Video, CheckCircle, XCircle, Timer,
  Mail, TrendingUp, Zap, PlayCircle,
  PauseCircle, StopCircle
} from 'lucide-react';
import { Lead } from '@/types/lead';
import { SmartAdvisorMatch } from './SmartAdvisorMatch';
import { HotSheetCard, PastelBadge, PillButton, IconContainer, type PastelColor } from '@/components/hotsheet';

interface EnhancedRightSidebarProps {
  lead: Lead;
}

export function EnhancedRightSidebar({ lead }: EnhancedRightSidebarProps) {
  // Mock Aircall history data
  const aircallHistory = [
    {
      id: '1',
      type: 'outbound',
      duration: '5:32',
      status: 'completed',
      timestamp: '2024-01-15T10:30:00Z',
      notes: 'Discussed MBA program requirements'
    },
    {
      id: '2',
      type: 'inbound',
      duration: '3:15',
      status: 'completed',
      timestamp: '2024-01-14T14:20:00Z',
      notes: 'Follow-up questions about tuition'
    },
    {
      id: '3',
      type: 'outbound',
      duration: '0:00',
      status: 'missed',
      timestamp: '2024-01-13T16:45:00Z',
      notes: 'No answer, left voicemail'
    }
  ];

  // Mock appointment history
  const appointmentHistory = [
    {
      id: '1',
      title: 'Initial Consultation',
      type: 'video_call',
      status: 'completed',
      date: '2024-01-10T15:00:00Z',
      duration: 45,
      notes: 'Productive discussion about career goals'
    },
    {
      id: '2',
      title: 'Program Deep Dive',
      type: 'phone_call',
      status: 'scheduled',
      date: '2024-01-20T10:00:00Z',
      duration: 30,
      notes: 'Focus on MBA curriculum'
    }
  ];

  // AI Sequences data
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
      case 'missed': return 'rose';
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

  const handleSequenceAction = (sequenceId: string, action: 'enroll' | 'pause' | 'stop') => {
    console.log(`${action} sequence ${sequenceId}`);
    // Implementation would go here
  };

  return (
    <div className="w-full lg:w-72 bg-card lg:border-l border-border/40 flex flex-col">
      {/* Aircall History */}
      <div className="p-4 border-b border-border/40">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <IconContainer color="sky" size="sm">
            <Phone className="h-4 w-4" />
          </IconContainer>
          Call History
        </h3>
        <div className="space-y-3">
          {aircallHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground">No calls yet</p>
          ) : (
            aircallHistory.map((call) => (
              <HotSheetCard key={call.id} padding="sm" hover className="border-border/40">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <PastelBadge color={getCallStatusColor(call.status)} size="sm">
                      {call.status}
                    </PastelBadge>
                    <PastelBadge color="slate" size="sm">
                      {call.type}
                    </PastelBadge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {call.duration}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mb-1">
                  {new Date(call.timestamp).toLocaleString()}
                </div>
                {call.notes && (
                  <p className="text-xs text-foreground">{call.notes}</p>
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
          {appointmentHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground">No appointments yet</p>
          ) : (
            appointmentHistory.map((appointment) => (
              <HotSheetCard key={appointment.id} padding="sm" hover className="border-border/40">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <PastelBadge color={getAppointmentStatusColor(appointment.status)} size="sm">
                      {appointment.status}
                    </PastelBadge>
                    <span className="text-sm font-medium truncate">{appointment.title}</span>
                  </div>
                  {appointment.type === 'video_call' && (
                    <IconContainer color="violet" size="sm">
                      <Video className="h-3 w-3" />
                    </IconContainer>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mb-1">
                  {new Date(appointment.date).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground mb-1">
                  Duration: {appointment.duration} minutes
                </div>
                {appointment.notes && (
                  <p className="text-xs text-foreground">{appointment.notes}</p>
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