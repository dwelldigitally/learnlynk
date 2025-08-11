import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Phone, Clock, Calendar, Users, 
  Video, CheckCircle, XCircle, Timer,
  Mail, TrendingUp, Zap, PlayCircle,
  PauseCircle, StopCircle
} from 'lucide-react';
import { Lead } from '@/types/lead';
import { SmartAdvisorMatch } from './SmartAdvisorMatch';

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

  const getCallStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'missed': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Timer className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getAppointmentStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'scheduled': return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Timer className="h-4 w-4 text-yellow-500" />;
    }
  };

  const handleSequenceAction = (sequenceId: string, action: 'enroll' | 'pause' | 'stop') => {
    console.log(`${action} sequence ${sequenceId}`);
    // Implementation would go here
  };

  return (
    <div className="w-72 bg-card border-l border-border flex flex-col overflow-y-auto">
      {/* Aircall History */}
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Phone className="h-4 w-4 text-blue-500" />
          Call History
        </h3>
        <div className="space-y-3">
          {aircallHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground">No calls yet</p>
          ) : (
            aircallHistory.map((call) => (
              <div key={call.id} className="p-3 rounded-lg bg-muted/50 border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getCallStatusIcon(call.status)}
                    <Badge variant="outline" className="text-xs">
                      {call.type}
                    </Badge>
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
              </div>
            ))
          )}
        </div>
      </div>

      {/* Appointment History */}
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-green-500" />
          Appointments
        </h3>
        <div className="space-y-3">
          {appointmentHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground">No appointments yet</p>
          ) : (
            appointmentHistory.map((appointment) => (
              <div key={appointment.id} className="p-3 rounded-lg bg-muted/50 border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getAppointmentStatusIcon(appointment.status)}
                    <span className="text-sm font-medium">{appointment.title}</span>
                  </div>
                  {appointment.type === 'video_call' && (
                    <Video className="h-4 w-4 text-purple-500" />
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
              </div>
            ))
          )}
        </div>
        <Button variant="outline" size="sm" className="w-full mt-3">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Meeting
        </Button>
      </div>

      {/* AI Sequences Section */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">AI Sequences</h3>
          </div>
          <Badge variant="secondary" className="text-xs">
            {aiSequences.filter(s => s.enrolled).length} Active
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          Automated email sequences powered by AI to nurture and convert leads
        </p>

        <div className="space-y-3">
          {aiSequences.map((sequence) => {
            const isEnrolled = sequence.enrolled;
            
            return (
              <div key={sequence.id} className={`rounded-lg border transition-all duration-200 ${
                isEnrolled 
                  ? 'bg-green-50 border-green-200 shadow-sm' 
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}>
                <div className="p-3 overflow-hidden">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold truncate">{sequence.name}</h4>
                        <Badge 
                          variant={sequence.type === 'deadline-driven' ? 'destructive' : 'outline'} 
                          className="text-xs px-2 py-0"
                        >
                          {sequence.type}
                        </Badge>
                        {isEnrolled && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
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
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 h-7 text-xs"
                          onClick={() => handleSequenceAction(sequence.id, 'pause')}
                        >
                          <PauseCircle className="h-3 w-3 mr-1" />
                          Pause
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 h-7 text-xs"
                          onClick={() => handleSequenceAction(sequence.id, 'stop')}
                        >
                          <StopCircle className="h-3 w-3 mr-1" />
                          Stop
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        className="flex-1 h-7 text-xs"
                        onClick={() => handleSequenceAction(sequence.id, 'enroll')}
                      >
                        <PlayCircle className="h-3 w-3 mr-1" />
                        Enroll Lead
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Button variant="outline" size="sm" className="w-full mt-3">
          <Zap className="h-4 w-4 mr-2" />
          Manage Sequences
        </Button>
      </div>

      {/* Smart Advisor Match */}
      <div className="p-4">
        <SmartAdvisorMatch lead={lead} />
      </div>
    </div>
  );
}
