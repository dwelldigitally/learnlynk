import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, MessageSquare, CheckSquare, StickyNote,
  User, GraduationCap, BookOpen, Filter
} from 'lucide-react';
import { LeadCommunication, LeadTask, LeadNote } from '@/types/leadEnhancements';

interface SegmentedTimelineProps {
  leadId: string;
  communications: LeadCommunication[];
  tasks: LeadTask[];
  notes: LeadNote[];
}

export function SegmentedTimeline({ communications, tasks, notes }: SegmentedTimelineProps) {
  const [activeStage, setActiveStage] = useState<string>('all');
  
  // Mock function to determine activity stage based on date
  function getActivityStage(date: string): 'lead' | 'applicant' | 'student' {
    const activityDate = new Date(date);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff <= 30) return 'student';
    if (daysDiff <= 60) return 'applicant';
    return 'lead';
  }

  // Combine all real activities into timeline
  const allActivities = [
    ...communications.map(item => ({
      id: item.id,
      type: 'communication' as const,
      title: `${item.type} - ${item.subject || 'Communication'}`,
      description: item.content,
      timestamp: item.communication_date,
      icon: MessageSquare,
      badge: item.direction,
      stage: getActivityStage(item.created_at),
    })),
    ...tasks.map(item => ({
      id: item.id,
      type: 'task' as const,
      title: item.title,
      description: item.description || '',
      timestamp: item.created_at,
      icon: CheckSquare,
      badge: item.status,
      stage: getActivityStage(item.created_at),
    })),
    ...notes.map(item => ({
      id: item.id,
      type: 'note' as const,
      title: `Note - ${item.note_type}`,
      description: item.content,
      timestamp: item.created_at,
      icon: StickyNote,
      badge: item.note_type,
      stage: getActivityStage(item.created_at),
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'lead': return User;
      case 'applicant': return BookOpen;
      case 'student': return GraduationCap;
      default: return User;
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'lead': return 'text-blue-500';
      case 'applicant': return 'text-orange-500';
      case 'student': return 'text-green-500';
      default: return 'text-muted-foreground';
    }
  };

  const filteredActivities = activeStage === 'all' 
    ? allActivities 
    : allActivities.filter(activity => activity.stage === activeStage);

  const stageStats = {
    lead: allActivities.filter(a => a.stage === 'lead').length,
    applicant: allActivities.filter(a => a.stage === 'applicant').length,
    student: allActivities.filter(a => a.stage === 'student').length,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Activity Timeline
        </h3>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>
      
      {/* Stage Tabs */}
      <Tabs value={activeStage} onValueChange={setActiveStage} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            All ({allActivities.length})
          </TabsTrigger>
          <TabsTrigger value="lead" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Lead ({stageStats.lead})
          </TabsTrigger>
          <TabsTrigger value="applicant" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Applicant ({stageStats.applicant})
          </TabsTrigger>
          <TabsTrigger value="student" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Student ({stageStats.student})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeStage} className="mt-4">
          <div className="space-y-3">
            {filteredActivities.length === 0 ? (
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">
                    No activity recorded yet
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredActivities.map((item) => {
                const Icon = item.icon;
                const StageIcon = getStageIcon(item.stage);
                
                return (
                  <Card key={`${item.type}-${item.id}`} className="relative">
                    {/* Stage indicator */}
                    <div className={`absolute top-3 right-3 ${getStageColor(item.stage)}`}>
                      <StageIcon className="h-4 w-4" />
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-medium pr-8">{item.title}</h4>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">{item.badge}</Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(item.timestamp).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${getStageColor(item.stage)}`}
                            >
                              {item.stage.charAt(0).toUpperCase() + item.stage.slice(1)} Stage
                            </Badge>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
