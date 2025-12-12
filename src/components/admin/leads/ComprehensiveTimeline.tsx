import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Activity, 
  Mail, 
  FileText, 
  User, 
  CheckSquare,
  StickyNote,
  Globe,
  Bot,
  Clock,
  ChevronDown,
  FileUp,
  FileCheck,
  FileX,
  ArrowRight,
  UserPlus,
  Calendar,
  AlertCircle,
  Trash2,
  RefreshCw,
  DollarSign,
  Receipt,
  FileSpreadsheet,
  Edit
} from 'lucide-react';
import { leadActivityService, ActivityLogEntry } from '@/services/leadActivityService';
import { supabase } from '@/integrations/supabase/client';

interface TimelineEvent {
  id: string;
  timestamp: string;
  action: string;
  description: string;
  type: 'communication' | 'document' | 'engagement' | 'system' | 'task' | 'note' | 'stage' | 'lead' | 'payment';
  source: string; // Now stores actual user name or "System"
  metadata?: any;
}

interface ComprehensiveTimelineProps {
  leadId: string;
  filter: string;
  onFilterChange: (filter: string) => void;
  refreshTrigger?: number; // Increment to trigger refresh
}

export function ComprehensiveTimeline({ leadId, filter, onFilterChange, refreshTrigger }: ComprehensiveTimelineProps) {
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    loadTimelineData();
  }, [leadId, refreshTrigger]);

  const loadTimelineData = async () => {
    try {
      setLoading(true);
      const events: TimelineEvent[] = [];

      // 1. Get activity logs from the new lead_activity_logs table
      const activityLogs = await leadActivityService.getActivityLogs(leadId);
      
      activityLogs.forEach(log => {
        events.push({
          id: `activity-${log.id}`,
          timestamp: log.created_at,
          action: log.title,
          description: log.description || '',
          type: mapCategoryToType(log.action_category),
          source: log.user_name || 'System',
          metadata: { ...log.metadata, action_type: log.action_type }
        });
      });

      // 2. Get communications
      const { data: communications } = await supabase
        .from('lead_communications')
        .select('*')
        .eq('lead_id', leadId)
        .order('communication_date', { ascending: false });

      // Fetch user names for communications
      const commUserIds = [...new Set((communications || []).map(c => c.user_id).filter(Boolean))];
      let commUserNames: Record<string, string> = {};
      if (commUserIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, first_name, last_name')
          .in('user_id', commUserIds);
        if (profiles) {
          commUserNames = profiles.reduce((acc, p) => {
            acc[p.user_id] = [p.first_name, p.last_name].filter(Boolean).join(' ') || 'Unknown User';
            return acc;
          }, {} as Record<string, string>);
        }
      }

      communications?.forEach(comm => {
        const userName = comm.user_id ? (commUserNames[comm.user_id] || 'Unknown User') : 'System';
        
        events.push({
          id: `comm-${comm.id}`,
          timestamp: comm.communication_date,
          action: `${comm.type?.toUpperCase() || 'COMMUNICATION'} ${comm.direction || ''}`.trim(),
          description: comm.subject || comm.content?.substring(0, 100) + '...' || '',
          type: 'communication',
          source: comm.direction === 'outbound' ? userName : 'Student',
          metadata: { type: comm.type, direction: comm.direction }
        });
      });

      // 3. Get tasks
      const { data: tasks } = await supabase
        .from('lead_tasks')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });

      // Fetch user names for tasks
      const taskUserIds = [...new Set((tasks || []).map(t => t.user_id).filter(Boolean))];
      let taskUserNames: Record<string, string> = {};
      if (taskUserIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, first_name, last_name')
          .in('user_id', taskUserIds);
        if (profiles) {
          taskUserNames = profiles.reduce((acc, p) => {
            acc[p.user_id] = [p.first_name, p.last_name].filter(Boolean).join(' ') || 'Unknown User';
            return acc;
          }, {} as Record<string, string>);
        }
      }

      tasks?.forEach(task => {
        const userName = task.user_id ? (taskUserNames[task.user_id] || 'Unknown User') : 'System';
        
        // Only add task events if not already captured in activity logs
        const existingTaskLog = activityLogs.find(
          log => log.action_type === 'task_created' && log.metadata?.task_id === task.id
        );
        
        if (!existingTaskLog) {
          events.push({
            id: `task-${task.id}`,
            timestamp: task.created_at,
            action: 'Task Created',
            description: task.title,
            type: 'task',
            source: userName,
            metadata: { status: task.status, priority: task.priority }
          });
        }

        if (task.completed_at) {
          events.push({
            id: `task-completed-${task.id}`,
            timestamp: task.completed_at,
            action: 'Task Completed',
            description: task.title,
            type: 'task',
            source: userName,
            metadata: { status: 'completed' }
          });
        }
      });

      // 4. Get notes
      const { data: notes } = await supabase
        .from('lead_notes')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });

      // Fetch user names for notes
      const noteUserIds = [...new Set((notes || []).map(n => n.user_id).filter(Boolean))];
      let noteUserNames: Record<string, string> = {};
      if (noteUserIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, first_name, last_name')
          .in('user_id', noteUserIds);
        if (profiles) {
          noteUserNames = profiles.reduce((acc, p) => {
            acc[p.user_id] = [p.first_name, p.last_name].filter(Boolean).join(' ') || 'Unknown User';
            return acc;
          }, {} as Record<string, string>);
        }
      }

      notes?.forEach(note => {
        const userName = note.user_id ? (noteUserNames[note.user_id] || 'Unknown User') : 'System';
        
        events.push({
          id: `note-${note.id}`,
          timestamp: note.created_at,
          action: 'Note Added',
          description: note.content?.substring(0, 100) + ((note.content?.length || 0) > 100 ? '...' : '') || '',
          type: 'note',
          source: userName,
          metadata: { note_type: note.note_type }
        });
      });

      // 5. Get stage transition logs
      const { data: stageTransitions } = await supabase
        .from('stage_transition_logs')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });

      // Fetch user names and stage names for transitions
      const transitionUserIds = [...new Set((stageTransitions || []).map(t => t.triggered_by).filter(Boolean))];
      let transitionUserNames: Record<string, string> = {};
      if (transitionUserIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, first_name, last_name')
          .in('user_id', transitionUserIds);
        if (profiles) {
          transitionUserNames = profiles.reduce((acc, p) => {
            acc[p.user_id] = [p.first_name, p.last_name].filter(Boolean).join(' ') || 'Unknown User';
            return acc;
          }, {} as Record<string, string>);
        }
      }

      // Fetch stage names
      const stageIds = [...new Set([
        ...(stageTransitions || []).map(t => t.from_stage_id).filter(Boolean),
        ...(stageTransitions || []).map(t => t.to_stage_id).filter(Boolean)
      ])];
      let stageNames: Record<string, string> = {};
      if (stageIds.length > 0) {
        const { data: stages } = await supabase
          .from('journey_stages')
          .select('id, name')
          .in('id', stageIds);
        if (stages) {
          stageNames = stages.reduce((acc, s) => {
            acc[s.id] = s.name;
            return acc;
          }, {} as Record<string, string>);
        }
      }

      stageTransitions?.forEach(transition => {
        const userName = transition.triggered_by ? (transitionUserNames[transition.triggered_by] || 'Unknown User') : 'System';
        const fromStageName = stageNames[transition.from_stage_id] || 'Unknown';
        const toStageName = stageNames[transition.to_stage_id] || 'Unknown';
        
        // Only add if not already in activity logs
        const existingStageLog = activityLogs.find(
          log => (log.action_type === 'stage_advanced' || log.action_type === 'stage_regressed') && 
                 Math.abs(new Date(log.created_at).getTime() - new Date(transition.created_at).getTime()) < 1000
        );
        
        if (!existingStageLog) {
          events.push({
            id: `stage-${transition.id}`,
            timestamp: transition.created_at,
            action: transition.trigger_type === 'regress' ? 'Stage Regressed' : 'Stage Advanced',
            description: `Moved from "${fromStageName}" → "${toStageName}" stage`,
            type: 'stage',
            source: userName,
            metadata: { trigger_type: transition.trigger_type }
          });
        }
      });

      // Sort events by timestamp (newest first)
      events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      // Remove duplicates based on similar content within 1 second
      const deduped = events.filter((event, index) => {
        const isDuplicate = events.slice(0, index).some(prev => 
          prev.action === event.action && 
          Math.abs(new Date(prev.timestamp).getTime() - new Date(event.timestamp).getTime()) < 1000
        );
        return !isDuplicate;
      });
      
      setTimelineEvents(deduped);
    } catch (error) {
      console.error('Error loading timeline data:', error);
    } finally {
      setLoading(false);
    }
  };

  const mapCategoryToType = (category: string): TimelineEvent['type'] => {
    switch (category) {
      case 'document': return 'document';
      case 'communication': return 'communication';
      case 'stage': return 'stage';
      case 'task': return 'task';
      case 'note': return 'note';
      case 'lead': return 'engagement';
      case 'system': return 'system';
      case 'payment': return 'payment';
      default: return 'system';
    }
  };

  const getIconForEvent = (type: string, actionType?: string) => {
    // Check action type first for more specific icons
    if (actionType) {
      switch (actionType) {
        case 'document_uploaded': return <FileUp className="h-3 w-3" />;
        case 'document_approved': return <FileCheck className="h-3 w-3" />;
        case 'document_rejected': return <FileX className="h-3 w-3" />;
        case 'document_deleted': return <Trash2 className="h-3 w-3" />;
        case 'stage_advanced':
        case 'stage_regressed': return <ArrowRight className="h-3 w-3" />;
        case 'advisor_assigned':
        case 'advisor_changed': return <UserPlus className="h-3 w-3" />;
        case 'intake_assigned':
        case 'intake_changed': return <Calendar className="h-3 w-3" />;
        case 'status_changed':
        case 'priority_changed': return <AlertCircle className="h-3 w-3" />;
        case 'lead_created': return <User className="h-3 w-3" />;
        case 'lead_updated': return <Edit className="h-3 w-3" />;
        // Payment icons
        case 'payment_created': return <DollarSign className="h-3 w-3" />;
        case 'payment_status_changed': return <DollarSign className="h-3 w-3" />;
        case 'payment_received': return <DollarSign className="h-3 w-3" />;
        case 'invoice_sent': return <FileSpreadsheet className="h-3 w-3" />;
        case 'receipt_sent': return <Receipt className="h-3 w-3" />;
        // Task icons
        case 'task_created': return <CheckSquare className="h-3 w-3" />;
        case 'task_updated': return <Edit className="h-3 w-3" />;
        case 'task_completed': return <CheckSquare className="h-3 w-3" />;
        case 'task_deleted': return <Trash2 className="h-3 w-3" />;
        // Note icons
        case 'note_added': return <StickyNote className="h-3 w-3" />;
        case 'note_updated': return <Edit className="h-3 w-3" />;
        case 'note_deleted': return <Trash2 className="h-3 w-3" />;
      }
    }

    switch (type) {
      case 'communication': return <Mail className="h-3 w-3" />;
      case 'document': return <FileText className="h-3 w-3" />;
      case 'engagement': return <User className="h-3 w-3" />;
      case 'task': return <CheckSquare className="h-3 w-3" />;
      case 'note': return <StickyNote className="h-3 w-3" />;
      case 'stage': return <ArrowRight className="h-3 w-3" />;
      case 'system': return <Globe className="h-3 w-3" />;
      case 'payment': return <DollarSign className="h-3 w-3" />;
      default: return <Activity className="h-3 w-3" />;
    }
  };

  const getColorForType = (type: string, actionType?: string) => {
    if (actionType) {
      switch (actionType) {
        case 'document_approved': return 'bg-green-500';
        case 'document_rejected': return 'bg-red-500';
        case 'document_uploaded': return 'bg-blue-500';
        case 'document_deleted': return 'bg-orange-500';
        case 'stage_advanced': return 'bg-purple-500';
        case 'stage_regressed': return 'bg-yellow-500';
        case 'advisor_assigned':
        case 'advisor_changed': return 'bg-indigo-500';
        case 'intake_assigned':
        case 'intake_changed': return 'bg-cyan-500';
        case 'lead_created': return 'bg-emerald-500';
        case 'lead_updated': return 'bg-sky-500';
        // Payment colors
        case 'payment_received': return 'bg-green-500';
        case 'payment_created': return 'bg-blue-500';
        case 'payment_status_changed': return 'bg-amber-500';
        case 'invoice_sent': return 'bg-violet-500';
        case 'receipt_sent': return 'bg-teal-500';
        // Task colors
        case 'task_created': return 'bg-blue-500';
        case 'task_completed': return 'bg-green-500';
        case 'task_updated': return 'bg-sky-500';
        case 'task_deleted': return 'bg-red-500';
        // Note colors
        case 'note_added': return 'bg-yellow-500';
        case 'note_updated': return 'bg-amber-500';
        case 'note_deleted': return 'bg-orange-500';
      }
    }

    switch (type) {
      case 'communication': return 'bg-blue-500';
      case 'document': return 'bg-amber-500';
      case 'engagement': return 'bg-purple-500';
      case 'task': return 'bg-green-500';
      case 'note': return 'bg-yellow-500';
      case 'stage': return 'bg-indigo-500';
      case 'payment': return 'bg-emerald-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredTimeline = timelineEvents.filter(event => {
    if (filter === 'all') return true;
    if (filter === 'human') return event.source !== 'System' && event.source !== 'Student';
    if (filter === 'ai') return event.source === 'AI';
    if (filter === 'communication') return event.type === 'communication';
    if (filter === 'document') return event.type === 'document';
    if (filter === 'engagement') return event.type === 'engagement' || event.type === 'system' || event.type === 'stage' || event.type === 'lead';
    if (filter === 'property') return event.metadata?.action_type === 'lead_updated';
    if (filter === 'payment') return event.type === 'payment';
    if (filter === 'task') return event.type === 'task';
    if (filter === 'note') return event.type === 'note';
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
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => loadTimelineData()}
              title="Refresh timeline"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? '' : '-rotate-90'}`} />
              </Button>
            </CollapsibleTrigger>
          </div>
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
          <div className="flex gap-1 flex-wrap">
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
              variant={filter === 'payment' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => onFilterChange('payment')}
            >
              <DollarSign className="h-3 w-3 mr-1" />
              Payments
            </Button>
            <Button 
              variant={filter === 'property' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => onFilterChange('property')}
            >
              <Edit className="h-3 w-3 mr-1" />
              Changes
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
                      <div className={`w-3 h-3 rounded-full ${getColorForType(event.type, event.metadata?.action_type)}`} />
                      {index < filteredTimeline.length - 1 && (
                        <div className="w-px h-8 bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {getIconForEvent(event.type, event.metadata?.action_type)}
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
