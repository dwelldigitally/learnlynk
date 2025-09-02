import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Phone, 
  PhoneCall, 
  PhoneIncoming, 
  PhoneOutgoing, 
  Clock, 
  User,
  PlayCircle,
  Download,
  MoreHorizontal
} from 'lucide-react';

interface CallRecord {
  id: string;
  direction: 'inbound' | 'outbound';
  duration: number;
  timestamp: string;
  status: 'answered' | 'missed' | 'voicemail' | 'busy';
  caller: string;
  number: string;
  recording_url?: string;
  notes?: string;
}

interface CallHistorySectionProps {
  leadId: string;
  calls?: CallRecord[];
  loading?: boolean;
}

export function CallHistorySection({ leadId, calls = [], loading = false }: CallHistorySectionProps) {
  const [selectedCall, setSelectedCall] = useState<string | null>(null);

  // Demo data
  const demoCalls: CallRecord[] = [
    {
      id: '1',
      direction: 'outbound',
      duration: 320,
      timestamp: '2024-01-20T14:30:00Z',
      status: 'answered',
      caller: 'Sarah Johnson',
      number: '+1-555-0123',
      recording_url: '#',
      notes: 'Discussed program requirements and financial aid options'
    },
    {
      id: '2',
      direction: 'inbound',
      duration: 0,
      timestamp: '2024-01-19T16:45:00Z',
      status: 'missed',
      caller: 'Student',
      number: '+1-555-0123'
    },
    {
      id: '3',
      direction: 'outbound',
      duration: 180,
      timestamp: '2024-01-18T11:15:00Z',
      status: 'voicemail',
      caller: 'Sarah Johnson',
      number: '+1-555-0123',
      notes: 'Left voicemail about upcoming info session'
    }
  ];

  const displayCalls = calls.length > 0 ? calls : demoCalls;

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCallIcon = (direction: string, status: string) => {
    if (status === 'missed') return <Phone className="h-4 w-4 text-red-500" />;
    if (direction === 'inbound') return <PhoneIncoming className="h-4 w-4 text-blue-500" />;
    return <PhoneOutgoing className="h-4 w-4 text-green-500" />;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      answered: 'default',
      missed: 'destructive',
      voicemail: 'secondary',
      busy: 'outline'
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PhoneCall className="h-5 w-5" />
            Call History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PhoneCall className="h-5 w-5" />
            Call History
          </div>
          <Button size="sm" variant="outline">
            <Phone className="h-4 w-4 mr-2" />
            Make Call
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        {displayCalls.length > 0 ? (
          <ScrollArea className="h-full">
            <div className="space-y-3">
              {displayCalls.map((call) => (
                <div key={call.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {getCallIcon(call.direction, call.status)}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{call.caller}</span>
                          {getStatusBadge(call.status)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {call.number}
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div>{new Date(call.timestamp).toLocaleDateString()}</div>
                      <div>{new Date(call.timestamp).toLocaleTimeString()}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {call.duration > 0 ? formatDuration(call.duration) : 'No answer'}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {call.direction}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {call.recording_url && (
                        <Button size="sm" variant="ghost">
                          <PlayCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {call.notes && (
                    <div className="mt-2 p-2 bg-muted rounded text-sm">
                      <span className="font-medium">Notes: </span>
                      {call.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-8">
            <PhoneCall className="h-8 w-8 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground font-medium">No call history</p>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Call history will appear here once calls are made
            </p>
            <Button variant="outline" size="sm">
              <Phone className="h-4 w-4 mr-2" />
              Make First Call
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}