import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArrowRight, FileCheck, DollarSign, User, 
  Clock, CheckCircle2, Zap 
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { useTransitionLogs } from '@/hooks/useStageTransitions';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface StageTransitionTimelineProps {
  leadId: string;
}

const TRIGGER_TYPE_ICONS: Record<string, React.ComponentType<any>> = {
  'all_documents_approved': FileCheck,
  'specific_document_approved': FileCheck,
  'payment_received': DollarSign,
  'manual_approval': User,
  'manual': User,
  'document_approved': FileCheck,
  'all_requirements_completed': CheckCircle2,
  'system': Zap
};

const TRIGGER_TYPE_COLORS: Record<string, string> = {
  'all_documents_approved': 'bg-green-100 text-green-700',
  'specific_document_approved': 'bg-green-100 text-green-700',
  'payment_received': 'bg-blue-100 text-blue-700',
  'manual_approval': 'bg-purple-100 text-purple-700',
  'manual': 'bg-purple-100 text-purple-700',
  'document_approved': 'bg-green-100 text-green-700',
  'all_requirements_completed': 'bg-emerald-100 text-emerald-700',
  'system': 'bg-amber-100 text-amber-700'
};

export function StageTransitionTimeline({ leadId }: StageTransitionTimelineProps) {
  const { data: logs = [], isLoading } = useTransitionLogs(leadId);

  // Fetch stage names for display
  const stageIds = [...new Set(logs.flatMap(l => [l.from_stage_id, l.to_stage_id]).filter(Boolean))];
  
  const { data: stages = [] } = useQuery({
    queryKey: ['journey-stages-names', stageIds],
    queryFn: async () => {
      if (stageIds.length === 0) return [];
      const { data } = await supabase
        .from('journey_stages')
        .select('id, name')
        .in('id', stageIds as string[]);
      return data || [];
    },
    enabled: stageIds.length > 0
  });

  const getStageNameMap = () => {
    const map: Record<string, string> = {};
    stages.forEach(s => {
      map[s.id] = s.name;
    });
    return map;
  };

  const stageNames = getStageNameMap();

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Stage Transitions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-16 bg-muted/50 rounded-lg animate-pulse" />
            <div className="h-16 bg-muted/50 rounded-lg animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (logs.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Stage Transitions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-sm text-muted-foreground">
            No stage transitions recorded yet.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Stage Transitions
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {logs.length} transitions
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="max-h-[400px]">
          <div className="p-4 pt-0 space-y-3">
            {logs.map((log, index) => {
              const TriggerIcon = TRIGGER_TYPE_ICONS[log.trigger_type] || Zap;
              const colorClass = TRIGGER_TYPE_COLORS[log.trigger_type] || 'bg-gray-100 text-gray-700';
              
              return (
                <div key={log.id} className="relative">
                  {/* Timeline connector */}
                  {index < logs.length - 1 && (
                    <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-border -mb-3" />
                  )}
                  
                  <div className="flex gap-3">
                    {/* Timeline dot */}
                    <div className={`w-8 h-8 rounded-full ${colorClass} flex items-center justify-center flex-shrink-0 relative z-10`}>
                      <TriggerIcon className="h-4 w-4" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0 pb-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium">
                          {stageNames[log.from_stage_id || ''] || 'Unknown Stage'}
                        </span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-medium text-primary">
                          {stageNames[log.to_stage_id || ''] || 'Unknown Stage'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {log.trigger_type.replace(/_/g, ' ')}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          by {log.triggered_by}
                        </span>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mt-1.5">
                        {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                        <span className="mx-1">•</span>
                        {format(new Date(log.created_at), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
