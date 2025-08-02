import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MessageSquare, CheckSquare, StickyNote } from 'lucide-react';
import { LeadCommunication, LeadTask, LeadNote } from '@/types/leadEnhancements';

interface LeadTimelineProps {
  leadId: string;
  communications: LeadCommunication[];
  tasks: LeadTask[];
  notes: LeadNote[];
}

export function LeadTimeline({ communications, tasks, notes }: LeadTimelineProps) {
  // Combine all activities into timeline
  const timelineItems = [
    ...communications.map(item => ({
      id: item.id,
      type: 'communication' as const,
      title: `${item.type} - ${item.subject || 'Communication'}`,
      description: item.content,
      timestamp: item.communication_date,
      icon: MessageSquare,
      badge: item.direction,
    })),
    ...tasks.map(item => ({
      id: item.id,
      type: 'task' as const,
      title: item.title,
      description: item.description || '',
      timestamp: item.created_at,
      icon: CheckSquare,
      badge: item.status,
    })),
    ...notes.map(item => ({
      id: item.id,
      type: 'note' as const,
      title: `Note - ${item.note_type}`,
      description: item.content,
      timestamp: item.created_at,
      icon: StickyNote,
      badge: item.note_type,
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Calendar className="h-5 w-5" />
        Activity Timeline
      </h3>
      
      <div className="space-y-3">
        {timelineItems.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">No activity yet</p>
            </CardContent>
          </Card>
        ) : (
          timelineItems.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={`${item.type}-${item.id}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium">{item.title}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{item.badge}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(item.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      {item.description && (
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}