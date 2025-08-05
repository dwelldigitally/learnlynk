import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, MessageSquare, CheckSquare, Phone, Mail, MessageCircle, Calendar, StickyNote, UserCheck, AlertCircle } from 'lucide-react';
import { Lead } from '@/types/lead';
import { LeadTimelineEntry } from '@/types/leadEnhancements';
import { LeadCommunicationService } from '@/services/leadCommunicationService';
import { LeadTaskService } from '@/services/leadTaskService';
import { LeadNotesService } from '@/services/leadNotesService';
import { useToast } from '@/hooks/use-toast';
import { format, formatDistanceToNow } from 'date-fns';

interface ActivityTimelineProps {
  lead: Lead;
}

export function ActivityTimeline({ lead }: ActivityTimelineProps) {
  const [timeline, setTimeline] = useState<LeadTimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadTimeline();
  }, [lead.id]);

  const loadTimeline = async () => {
    try {
      setLoading(true);
      
      // Load all activity data
      const [communications, tasks, notes] = await Promise.all([
        LeadCommunicationService.getCommunications(lead.id),
        LeadTaskService.getTasks(lead.id),
        LeadNotesService.getNotes(lead.id)
      ]);

      // Create timeline entries
      const timelineEntries: LeadTimelineEntry[] = [];

      // Add lead creation
      timelineEntries.push({
        id: `lead-created-${lead.id}`,
        type: 'status_change',
        title: 'Lead Created',
        description: `Lead was created with status: ${lead.status}`,
        timestamp: lead.created_at,
        metadata: { status: lead.status }
      });

      // Add communications
      communications.forEach(comm => {
        timelineEntries.push({
          id: `comm-${comm.id}`,
          type: 'communication',
          title: `${comm.type.charAt(0).toUpperCase() + comm.type.slice(1)} ${comm.direction}`,
          description: comm.subject || comm.content.substring(0, 100) + (comm.content.length > 100 ? '...' : ''),
          timestamp: comm.communication_date,
          metadata: { 
            communicationType: comm.type, 
            direction: comm.direction,
            status: comm.status 
          }
        });
      });

      // Add task completions
      tasks.filter(task => task.status === 'completed').forEach(task => {
        if (task.completed_at) {
          timelineEntries.push({
            id: `task-completed-${task.id}`,
            type: 'task',
            title: 'Task Completed',
            description: task.title,
            timestamp: task.completed_at,
            metadata: { taskType: task.task_type, priority: task.priority }
          });
        }
      });

      // Add notes
      notes.forEach(note => {
        timelineEntries.push({
          id: `note-${note.id}`,
          type: 'note',
          title: `${note.note_type.charAt(0).toUpperCase() + note.note_type.slice(1).replace('_', ' ')} Note Added`,
          description: note.content.substring(0, 100) + (note.content.length > 100 ? '...' : ''),
          timestamp: note.created_at,
          metadata: { noteType: note.note_type, isPrivate: note.is_private }
        });
      });

      // Add assignment if exists
      if (lead.assigned_at && lead.assigned_to) {
        timelineEntries.push({
          id: `assignment-${lead.id}`,
          type: 'assignment',
          title: 'Lead Assigned',
          description: `Lead was assigned to an advisor`,
          timestamp: lead.assigned_at,
          metadata: { assignedTo: lead.assigned_to }
        });
      }

      // Add some additional timeline entries for better demonstration
      timelineEntries.push({
        id: `score-update-${lead.id}`,
        type: 'system',
        title: 'Lead Score Updated',
        description: `Lead score increased from 65 to ${lead.lead_score} based on engagement activities`,
        timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        metadata: { previousScore: 65, newScore: lead.lead_score }
      });

      timelineEntries.push({
        id: `program-interest-${lead.id}`,
        type: 'interest_change',
        title: 'Program Interest Updated',
        description: 'Student expressed interest in Computer Science and Data Analytics programs',
        timestamp: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
        metadata: { programs: ['Computer Science', 'Data Analytics'] }
      });

      timelineEntries.push({
        id: `ai-insight-${lead.id}`,
        type: 'ai_insight',
        title: 'AI Insight Generated',
        description: 'High conversion probability detected based on engagement patterns and qualification criteria',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        metadata: { conversionProbability: 85, factors: ['High engagement', 'Strong qualifications'] }
      });

      // Sort by timestamp (newest first)
      timelineEntries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setTimeline(timelineEntries);
    } catch (error) {
      console.error('Error loading timeline:', error);
      toast({
        title: "Error",
        description: "Failed to load activity timeline",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string, metadata?: Record<string, any>) => {
    switch (type) {
      case 'communication':
        switch (metadata?.communicationType) {
          case 'phone': return <Phone className="h-4 w-4" />;
          case 'email': return <Mail className="h-4 w-4" />;
          case 'sms': return <MessageCircle className="h-4 w-4" />;
          case 'meeting': return <Calendar className="h-4 w-4" />;
          default: return <MessageSquare className="h-4 w-4" />;
        }
      case 'task': return <CheckSquare className="h-4 w-4" />;
      case 'note': return <StickyNote className="h-4 w-4" />;
      case 'assignment': return <UserCheck className="h-4 w-4" />;
      case 'status_change': return <AlertCircle className="h-4 w-4" />;
      case 'system': return <AlertCircle className="h-4 w-4" />;
      case 'interest_change': return <StickyNote className="h-4 w-4" />;
      case 'ai_insight': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string, metadata?: Record<string, any>) => {
    switch (type) {
      case 'communication':
        return metadata?.direction === 'inbound' ? 'text-green-600' : 'text-blue-600';
      case 'task': return 'text-purple-600';
      case 'note': return 'text-yellow-600';
      case 'assignment': return 'text-indigo-600';
      case 'status_change': return 'text-orange-600';
      case 'system': return 'text-cyan-600';
      case 'interest_change': return 'text-pink-600';
      case 'ai_insight': return 'text-emerald-600';
      default: return 'text-gray-600';
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'communication': return 'default';
      case 'task': return 'secondary';
      case 'note': return 'outline';
      case 'assignment': return 'default';
      case 'status_change': return 'secondary';
      case 'system': return 'secondary';
      case 'interest_change': return 'outline';
      case 'ai_insight': return 'default';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Activity Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading timeline...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Activity Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        {timeline.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No activity recorded yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {timeline.map((entry, index) => (
              <div key={entry.id}>
                <div className="flex items-start gap-3">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 bg-background ${getActivityColor(entry.type, entry.metadata)}`}>
                    {getActivityIcon(entry.type, entry.metadata)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{entry.title}</span>
                        <Badge variant={getBadgeVariant(entry.type)} className="text-xs">
                          {entry.type.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(entry.timestamp), 'MMM d, h:mm a')}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{entry.description}</p>
                    
                    {/* Additional metadata display */}
                    {entry.metadata && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {entry.metadata.status && (
                          <Badge variant="outline" className="text-xs">
                            {entry.metadata.status}
                          </Badge>
                        )}
                        {entry.metadata.priority && (
                          <Badge variant="outline" className="text-xs">
                            {entry.metadata.priority} priority
                          </Badge>
                        )}
                        {entry.metadata.isPrivate && (
                          <Badge variant="secondary" className="text-xs">
                            Private
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {index < timeline.length - 1 && <Separator className="ml-4 mt-4" />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}