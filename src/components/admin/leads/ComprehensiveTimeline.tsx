import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Activity, 
  Mail, 
  FileText, 
  User, 
  Phone,
  Calendar,
  MessageSquare,
  CheckSquare,
  StickyNote,
  UserPlus,
  Globe,
  Bot,
  Clock,
  ChevronDown
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TimelineEvent {
  id: string;
  timestamp: string;
  action: string;
  description: string;
  type: 'communication' | 'document' | 'engagement' | 'system' | 'task' | 'note';
  source: 'AI' | 'Human' | 'System' | 'Student';
  metadata?: any;
}

interface ComprehensiveTimelineProps {
  leadId: string;
  filter: string;
  onFilterChange: (filter: string) => void;
}

export function ComprehensiveTimeline({ leadId, filter, onFilterChange }: ComprehensiveTimelineProps) {
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    loadTimelineData();
  }, [leadId]);

  const loadTimelineData = async () => {
    try {
      setLoading(true);
      
      // Get lead creation event
      const { data: lead } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();

      const events: TimelineEvent[] = [];

      if (lead) {
        // Lead creation event
        events.push({
          id: `lead-created-${lead.id}`,
          timestamp: lead.created_at,
          action: 'Lead Created',
          description: `New lead registered via ${lead.source}`,
          type: 'engagement',
          source: 'Student',
          metadata: { source: lead.source, utm_source: lead.utm_source }
        });

        // Check for academic journey enrollment
        const { data: journey } = await supabase
          .from('lead_academic_journeys')
          .select('*')
          .eq('lead_id', leadId)
          .single();

        if (journey) {
          events.push({
            id: `journey-enrolled-${journey.id}`,
            timestamp: journey.enrolled_at,
            action: 'Academic Journey Started',
            description: `Enrolled in ${journey.journey_name} - ${journey.current_stage_name}`,
            type: 'system',
            source: 'System',
            metadata: { stage: journey.current_stage_name }
          });
        }

        // Get communications (if available)
        const { data: communications } = await supabase
          .from('lead_communications')
          .select('*')
          .eq('lead_id', leadId)
          .order('communication_date', { ascending: false });

        communications?.forEach(comm => {
          events.push({
            id: `comm-${comm.id}`,
            timestamp: comm.communication_date,
            action: `${comm.type.toUpperCase()} ${comm.direction}`,
            description: comm.subject || comm.content?.substring(0, 100) + '...',
            type: 'communication',
            source: comm.direction === 'outbound' ? 'Human' : 'Student',
            metadata: { type: comm.type, direction: comm.direction }
          });
        });

        // Get tasks
        const { data: tasks } = await supabase
          .from('lead_tasks')
          .select('*')
          .eq('lead_id', leadId)
          .order('created_at', { ascending: false });

        tasks?.forEach(task => {
          events.push({
            id: `task-${task.id}`,
            timestamp: task.created_at,
            action: 'Task Created',
            description: task.title,
            type: 'task',
            source: 'Human',
            metadata: { status: task.status, priority: task.priority }
          });

          if (task.completed_at) {
            events.push({
              id: `task-completed-${task.id}`,
              timestamp: task.completed_at,
              action: 'Task Completed',
              description: task.title,
              type: 'task',
              source: 'Human',
              metadata: { status: 'completed' }
            });
          }
        });

        // Get notes
        const { data: notes } = await supabase
          .from('lead_notes')
          .select('*')
          .eq('lead_id', leadId)
          .order('created_at', { ascending: false });

        notes?.forEach(note => {
          events.push({
            id: `note-${note.id}`,
            timestamp: note.created_at,
            action: `Note Added`,
            description: note.content?.substring(0, 100) + (note.content?.length > 100 ? '...' : ''),
            type: 'note',
            source: 'Human',
            metadata: { note_type: note.note_type }
          });
        });

        // Get journey progress updates
        const { data: progress } = await supabase
          .from('lead_journey_progress')
          .select('*')
          .eq('lead_id', leadId)
          .order('created_at', { ascending: false });

        progress?.forEach(stage => {
          if (stage.completed) {
            events.push({
              id: `stage-completed-${stage.id}`,
              timestamp: stage.completed_at || stage.updated_at,
              action: 'Stage Completed',
              description: `Completed ${stage.stage_name} stage`,
              type: 'system',
              source: 'System',
              metadata: { stage: stage.stage_name }
            });
          }
        });
      }

      // Sort events by timestamp (newest first)
      events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setTimelineEvents(events);
    } catch (error) {
      console.error('Error loading timeline data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIconForEvent = (type: string, source: string) => {
    switch (type) {
      case 'communication':
        return <Mail className="h-3 w-3" />;
      case 'document':
        return <FileText className="h-3 w-3" />;
      case 'engagement':
        return <User className="h-3 w-3" />;
      case 'task':
        return <CheckSquare className="h-3 w-3" />;
      case 'note':
        return <StickyNote className="h-3 w-3" />;
      case 'system':
        return source === 'AI' ? <Bot className="h-3 w-3" /> : <Globe className="h-3 w-3" />;
      default:
        return <Activity className="h-3 w-3" />;
    }
  };

  const filteredTimeline = timelineEvents.filter(event => {
    if (filter === 'all') return true;
    if (filter === 'human') return event.source === 'Human' || event.source === 'Student';
    if (filter === 'ai') return event.source === 'AI';
    if (filter === 'communication') return event.type === 'communication';
    if (filter === 'document') return event.type === 'document';
    if (filter === 'engagement') return event.type === 'engagement' || event.type === 'system';
    return true;
  });

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Comprehensive Timeline
          </h3>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? '' : '-rotate-90'}`} />
            </Button>
          </CollapsibleTrigger>
        </div>
        <div className="flex flex-col gap-2 mt-3">
          <div className="flex gap-1">
            <Button 
              variant={filter === 'all' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => onFilterChange('all')}
            >
              All
            </Button>
            <Button 
              variant={filter === 'human' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => onFilterChange('human')}
            >
              Human
            </Button>
            <Button 
              variant={filter === 'ai' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => onFilterChange('ai')}
            >
              AI
            </Button>
          </div>
          <div className="flex gap-1">
            <Button 
              variant={filter === 'communication' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => onFilterChange('communication')}
            >
              <Mail className="h-3 w-3 mr-1" />
              Comms
            </Button>
            <Button 
              variant={filter === 'document' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => onFilterChange('document')}
            >
              <FileText className="h-3 w-3 mr-1" />
              Docs
            </Button>
            <Button 
              variant={filter === 'engagement' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => onFilterChange('engagement')}
            >
              <User className="h-3 w-3 mr-1" />
              Events
            </Button>
          </div>
        </div>
      </div>
      
      <CollapsibleContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4">
            {filteredTimeline.length > 0 ? (
              <div className="space-y-4">
                {filteredTimeline.map((event, index) => (
                  <div key={event.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        event.source === 'AI' ? 'bg-blue-500' : 
                        event.source === 'Human' ? 'bg-green-500' : 
                        event.source === 'Student' ? 'bg-purple-500' :
                        'bg-gray-500'
                      }`} />
                      {index < filteredTimeline.length - 1 && (
                        <div className="w-px h-8 bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        {getIconForEvent(event.type, event.source)}
                        <span className="text-sm font-medium">{event.action}</span>
                        <Badge variant="outline" className="text-xs">
                          {event.source}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {event.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No timeline events found</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CollapsibleContent>
    </Collapsible>
  );
}