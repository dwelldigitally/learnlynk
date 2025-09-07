import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Clock, AlertCircle, FileText, Phone, MessageSquare, Calendar } from 'lucide-react';
import { Lead } from '@/types/lead';
import { AcademicJourneyService } from '@/services/academicJourneyService';
import { supabase } from '@/integrations/supabase/client';

interface JourneyStage {
  id: string;
  name: string;
  description: string;
  stage_type: string;
  order_index: number;
  status: 'pending' | 'active' | 'completed' | 'skipped';
  completion_percentage: number;
  requirements: JourneyRequirement[];
  estimated_days: number;
  actual_days?: number;
}

interface JourneyRequirement {
  id: string;
  name: string;
  requirement_type: string;
  is_mandatory: boolean;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  due_date?: string;
  completed_date?: string;
}

interface AcademicJourneyTrackerProps {
  lead: Lead;
  onUpdate?: () => void;
}

export function AcademicJourneyTracker({ lead, onUpdate }: AcademicJourneyTrackerProps) {
  const [journey, setJourney] = useState<any>(null);
  const [stages, setStages] = useState<JourneyStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  useEffect(() => {
    loadJourneyData();
  }, [lead.id]);

  // Refresh data when lead status changes
  useEffect(() => {
    loadJourneyData();
  }, [lead.status]);

  const loadJourneyData = async () => {
    try {
      setLoading(true);

      // First, check if this lead has an active journey instance
      const { data: journeyInstance, error: instanceError } = await supabase
        .from('student_journey_instances')
        .select(`
          *,
          academic_journeys (
            *,
            journey_stages (
              *,
              journey_requirements (*)
            )
          )
        `)
        .eq('lead_id', lead.id)
        .eq('status', 'active')
        .single();

      if (instanceError && instanceError.code !== 'PGRST116') {
        throw instanceError;
      }

      if (journeyInstance) {
        setJourney(journeyInstance.academic_journeys);
        
        // Get stage progress for this instance
        const { data: stageProgress, error: progressError } = await supabase
          .from('journey_stage_progress')
          .select('*')
          .eq('journey_instance_id', journeyInstance.id);

        if (progressError) throw progressError;

        // Transform the data to our format
        const transformedStages = journeyInstance.academic_journeys.journey_stages.map((stage: any) => {
          const progress = stageProgress?.find(p => p.stage_id === stage.id);
          const progressStatus = progress?.status;
          const validStatus = ['pending', 'active', 'completed', 'skipped'].includes(progressStatus) 
            ? progressStatus as 'pending' | 'active' | 'completed' | 'skipped'
            : 'pending';
          
          return {
            id: stage.id,
            name: stage.name,
            description: stage.description,
            stage_type: stage.stage_type,
            order_index: stage.order_index,
            status: validStatus,
            completion_percentage: progress ? 100 : 0,
            requirements: stage.journey_requirements || [],
            estimated_days: stage.timing_config?.expected_duration_days || 7,
            actual_days: progress ? Math.floor((Date.now() - new Date(progress.started_at).getTime()) / (1000 * 60 * 60 * 24)) : undefined
          };
        }).sort((a: any, b: any) => a.order_index - b.order_index);

        setStages(transformedStages);
      } else {
        // Create a sample journey based on lead's program interest
        createSampleJourney();
      }
    } catch (error) {
      console.error('Error loading journey data:', error);
      createSampleJourney();
    } finally {
      setLoading(false);
    }
  };

  const createSampleJourney = () => {
    // Create a sample journey based on the lead's stage
    const sampleStages: JourneyStage[] = [
      {
        id: '1',
        name: 'Initial Inquiry',
        description: 'First contact and interest evaluation',
        stage_type: 'inquiry',
        order_index: 0,
        status: 'completed',
        completion_percentage: 100,
        requirements: [
          { id: '1-1', name: 'Contact Information', requirement_type: 'data_collection', is_mandatory: true, status: 'completed' }
        ],
        estimated_days: 1
      },
      {
        id: '2',
        name: 'Application Submission',
        description: 'Complete and submit application',
        stage_type: 'application',
        order_index: 1,
        status: lead.status === 'qualified' || lead.status === 'converted' ? 'completed' : 'active',
        completion_percentage: lead.status === 'qualified' || lead.status === 'converted' ? 100 : 60,
        requirements: [
          { id: '2-1', name: 'Application Form', requirement_type: 'document', is_mandatory: true, status: 'completed' },
          { id: '2-2', name: 'Personal Statement', requirement_type: 'document', is_mandatory: true, status: 'pending' },
          { id: '2-3', name: 'Transcripts', requirement_type: 'document', is_mandatory: true, status: 'pending' }
        ],
        estimated_days: 14
      },
      {
        id: '3',
        name: 'Document Verification',
        description: 'Review and verify submitted documents',
        stage_type: 'verification',
        order_index: 2,
        status: lead.status === 'converted' ? 'completed' : 'pending',
        completion_percentage: lead.status === 'converted' ? 100 : 0,
        requirements: [
          { id: '3-1', name: 'Document Review', requirement_type: 'review', is_mandatory: true, status: 'pending' },
          { id: '3-2', name: 'Eligibility Check', requirement_type: 'verification', is_mandatory: true, status: 'pending' }
        ],
        estimated_days: 7
      },
      {
        id: '4',
        name: 'Interview & Assessment',
        description: 'Conduct interview and assessment',
        stage_type: 'assessment',
        order_index: 3,
        status: 'pending',
        completion_percentage: 0,
        requirements: [
          { id: '4-1', name: 'Schedule Interview', requirement_type: 'scheduling', is_mandatory: true, status: 'pending' },
          { id: '4-2', name: 'Conduct Interview', requirement_type: 'interview', is_mandatory: true, status: 'pending' }
        ],
        estimated_days: 3
      },
      {
        id: '5',
        name: 'Enrollment & Payment',
        description: 'Finalize enrollment and payment',
        stage_type: 'enrollment',
        order_index: 4,
        status: 'pending',
        completion_percentage: 0,
        requirements: [
          { id: '5-1', name: 'Payment Processing', requirement_type: 'payment', is_mandatory: true, status: 'pending' },
          { id: '5-2', name: 'Enrollment Confirmation', requirement_type: 'confirmation', is_mandatory: true, status: 'pending' }
        ],
        estimated_days: 5
      }
    ];

    setStages(sampleStages);
  };

  const getStageIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'active': return Clock;
      case 'pending': return AlertCircle;
      default: return Clock;
    }
  };

  const getStageColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-white bg-purple-500 border-purple-500';
      case 'active': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'pending': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRequirementIcon = (type: string) => {
    switch (type) {
      case 'document': return FileText;
      case 'interview': return Phone;
      case 'scheduling': return Calendar;
      default: return MessageSquare;
    }
  };

  const calculateOverallProgress = () => {
    if (stages.length === 0) return 0;
    const totalProgress = stages.reduce((sum, stage) => sum + stage.completion_percentage, 0);
    return Math.round(totalProgress / stages.length);
  };

  const getCurrentStage = () => {
    return stages.find(stage => stage.status === 'active') || stages[0];
  };

  const getNextActions = () => {
    const activeStage = getCurrentStage();
    if (!activeStage) return [];

    return activeStage.requirements
      .filter(req => req.status === 'pending' || req.status === 'in_progress')
      .slice(0, 3);
  };

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Academic Journey</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Academic Journey</CardTitle>
          <Badge variant="outline" className="text-xs">
            {calculateOverallProgress()}% Complete
          </Badge>
        </div>
        <Progress value={calculateOverallProgress()} className="h-2" />
      </CardHeader>

      <CardContent className="flex-1 space-y-4 overflow-y-auto">
        {/* Journey Timeline */}
        <div className="space-y-3">
          {stages.map((stage, index) => {
            const StageIcon = getStageIcon(stage.status);
            const isSelected = selectedStage === stage.id;

            return (
              <div key={stage.id} className="relative">
                {/* Connection line */}
                {index < stages.length - 1 && (
                  <div className="absolute left-4 top-8 w-0.5 h-6 bg-border"></div>
                )}

                <div
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer hover:shadow-sm ${
                    getStageColor(stage.status)
                  } ${isSelected ? 'ring-2 ring-primary/20' : ''}`}
                  onClick={() => setSelectedStage(isSelected ? null : stage.id)}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <StageIcon className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{stage.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {stage.completion_percentage}%
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{stage.description}</p>
                    
                    {stage.status === 'active' && (
                      <div className="mt-2">
                        <Progress value={stage.completion_percentage} className="h-1" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded stage details */}
                {isSelected && (
                  <div className="mt-2 ml-7 p-3 bg-muted/50 rounded-lg border">
                    <h5 className="font-medium text-sm mb-2">Requirements</h5>
                    <div className="space-y-2">
                      {stage.requirements.map((req) => {
                        const ReqIcon = getRequirementIcon(req.requirement_type);
                        return (
                          <div key={req.id} className="flex items-center gap-2 text-xs">
                            <ReqIcon className="h-3 w-3 text-muted-foreground" />
                            <span className={req.is_mandatory ? 'font-medium' : ''}>{req.name}</span>
                            <Badge 
                              variant={req.status === 'completed' ? 'default' : 'outline'} 
                              className="text-xs"
                            >
                              {req.status}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <Separator />

        {/* Next Actions */}
        <div>
          <h4 className="font-medium text-sm mb-3">Immediate Next Actions</h4>
          <div className="space-y-2">
            {getNextActions().map((action) => {
              const ActionIcon = getRequirementIcon(action.requirement_type);
              return (
                <div key={action.id} className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
                  <ActionIcon className="h-4 w-4 text-primary" />
                  <span className="text-sm flex-1">{action.name}</span>
                  <Button size="sm" variant="outline" className="text-xs px-2 py-1 h-6">
                    Action
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stage Summary */}
        <div className="pt-2 border-t">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-primary">{stages.filter(s => s.status === 'completed').length}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-blue-600">{stages.filter(s => s.status === 'active').length}</div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}