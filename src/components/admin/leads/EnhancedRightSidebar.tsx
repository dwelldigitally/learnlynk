import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Phone, Clock, Calendar, Users, 
  Video, CheckCircle, XCircle, Timer
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

      {/* Smart Advisor Match */}
      <div className="p-4">
        <SmartAdvisorMatch lead={lead} />
      </div>
    </div>
  );
}