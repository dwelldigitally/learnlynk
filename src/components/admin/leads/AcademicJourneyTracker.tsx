import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, AlertCircle, FileText, Phone, MessageSquare, Calendar, Info, ChevronRight, Play, Loader2 } from 'lucide-react';
import { Lead } from '@/types/lead';
import { supabase } from '@/integrations/supabase/client';
import { LeadJourneyService } from '@/services/leadJourneyService';
import { HotSheetCard, PastelBadge, PillButton, IconContainer, type PastelColor } from '@/components/hotsheet';
import { toast } from 'sonner';

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
  const [journeyInstance, setJourneyInstance] = useState<any>(null);
  const [stages, setStages] = useState<JourneyStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingInstance, setCreatingInstance] = useState(false);
  const [advancingStage, setAdvancingStage] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [noJourneyConfigured, setNoJourneyConfigured] = useState(false);

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
      setNoJourneyConfigured(false);

      // First, check if this lead has an active journey instance
      const { data: existingInstance, error: instanceError } = await supabase
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

      if (existingInstance) {
        setJourneyInstance(existingInstance);
        setJourney(existingInstance.academic_journeys);
        
        // Get stage progress for this instance
        const { data: stageProgress, error: progressError } = await supabase
          .from('journey_stage_progress')
          .select('*')
          .eq('journey_instance_id', existingInstance.id);

        if (progressError) throw progressError;

        // Transform the data to our format using PERSONAL progress
        const transformedStages = existingInstance.academic_journeys.journey_stages.map((stage: any) => {
          const progress = stageProgress?.find(p => p.stage_id === stage.id);
          const progressStatus = progress?.status;
          const validStatus = ['pending', 'active', 'completed', 'skipped'].includes(progressStatus) 
            ? progressStatus as 'pending' | 'active' | 'completed' | 'skipped'
            : 'pending';
          
          // Calculate completion percentage from status
          const completionPercentage = validStatus === 'completed' ? 100 
            : validStatus === 'active' ? 50 
            : 0;
          
          return {
            id: stage.id,
            name: stage.name,
            description: stage.description,
            stage_type: stage.stage_type,
            order_index: stage.order_index,
            status: validStatus,
            completion_percentage: completionPercentage,
            requirements: stage.journey_requirements || [],
            estimated_days: stage.timing_config?.expected_duration_days || 7,
            actual_days: progress?.started_at 
              ? Math.floor((Date.now() - new Date(progress.started_at).getTime()) / (1000 * 60 * 60 * 24)) 
              : undefined,
            progressId: progress?.id
          };
        }).sort((a: any, b: any) => a.order_index - b.order_index);

        setStages(transformedStages);
      } else {
        // No instance exists - check if program has a journey to auto-create
        await loadJourneyFromProgramInterest();
      }
    } catch (error) {
      console.error('Error loading journey data:', error);
      await loadJourneyFromProgramInterest();
    } finally {
      setLoading(false);
    }
  };

  const loadJourneyFromProgramInterest = async () => {
    try {
      // Check if lead has program interest
      const programId = lead.program_interest?.[0];
      if (!programId) {
        setStages([]);
        setNoJourneyConfigured(true);
        return;
      }

      // Try to find an academic journey for this program
      const programJourney = await LeadJourneyService.getJourneyForProgram(programId);

      if (programJourney && programJourney.journey_stages?.length > 0) {
        setJourney(programJourney);
        
        // Auto-create journey instance for this lead
        setCreatingInstance(true);
        const instance = await LeadJourneyService.createJourneyInstanceForLead(lead.id, programJourney.id);
        setCreatingInstance(false);

        if (instance) {
          // Reload to get the fresh data with personal progress
          await loadJourneyData();
          return;
        }

        // Fallback: Transform stages showing template view (shouldn't happen normally)
        const transformedStages = programJourney.journey_stages
          .sort((a: any, b: any) => a.order_index - b.order_index)
          .map((stage: any, index: number) => ({
            id: stage.id,
            name: stage.name,
            description: stage.description || '',
            stage_type: stage.stage_type,
            order_index: stage.order_index,
            status: index === 0 ? 'active' : 'pending' as 'pending' | 'active' | 'completed' | 'skipped',
            completion_percentage: 0,
            requirements: (stage.journey_requirements || []).map((req: any) => ({
              id: req.id,
              name: req.name,
              requirement_type: req.requirement_type,
              is_mandatory: req.is_mandatory,
              status: 'pending' as 'pending' | 'in_progress' | 'completed' | 'overdue'
            })),
            estimated_days: stage.timing_config?.expected_duration_days || 7
          }));

        setStages(transformedStages);
        setNoJourneyConfigured(false);
      } else {
        // No journey configured for this program
        setStages([]);
        setNoJourneyConfigured(true);
      }
    } catch (error) {
      console.error('Error loading journey from program interest:', error);
      setStages([]);
      setNoJourneyConfigured(true);
    }
  };

  // Complete current stage and advance to next
  const handleAdvanceStage = async () => {
    if (!journeyInstance) return;

    const currentStageIndex = stages.findIndex(s => s.status === 'active');
    if (currentStageIndex === -1 || currentStageIndex >= stages.length - 1) return;

    const currentStage = stages[currentStageIndex];
    const nextStage = stages[currentStageIndex + 1];

    setAdvancingStage(true);
    try {
      await LeadJourneyService.updateLeadStage(lead.id, nextStage.id, { completeCurrentStage: true });
      toast.success(`Advanced to "${nextStage.name}"`);
      await loadJourneyData();
      onUpdate?.();
    } catch (error) {
      console.error('Error advancing stage:', error);
      toast.error('Failed to advance stage');
    } finally {
      setAdvancingStage(false);
    }
  };

  // Complete a specific stage manually
  const handleCompleteStage = async (stageId: string) => {
    if (!journeyInstance) return;

    setAdvancingStage(true);
    try {
      // Update stage progress to completed
      await supabase
        .from('journey_stage_progress')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('journey_instance_id', journeyInstance.id)
        .eq('stage_id', stageId);

      toast.success('Stage completed');
      await loadJourneyData();
      onUpdate?.();
    } catch (error) {
      console.error('Error completing stage:', error);
      toast.error('Failed to complete stage');
    } finally {
      setAdvancingStage(false);
    }
  };

  const getStageIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'active': return Clock;
      case 'pending': return AlertCircle;
      default: return Clock;
    }
  };

  const getStageColor = (status: string): PastelColor => {
    switch (status) {
      case 'completed': return 'emerald';
      case 'active': return 'sky';
      case 'pending': return 'slate';
      default: return 'slate';
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

  const getRequirementStatusColor = (status: string): PastelColor => {
    switch (status) {
      case 'completed': return 'emerald';
      case 'in_progress': return 'sky';
      case 'overdue': return 'rose';
      default: return 'slate';
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
      <HotSheetCard className="h-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Academic Journey</h3>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </HotSheetCard>
    );
  }

  // Show empty state when no journey is configured
  if (noJourneyConfigured || stages.length === 0) {
    return (
      <HotSheetCard className="h-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Academic Journey</h3>
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <IconContainer color="slate" size="md" className="mb-3">
              <Info className="h-5 w-5" />
            </IconContainer>
            <p className="text-sm text-muted-foreground">
              {!lead.program_interest?.length 
                ? "No program selected for this lead"
                : "No journey configured for this program"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Configure an academic journey in Program settings
            </p>
          </div>
        </div>
      </HotSheetCard>
    );
  }

  const currentStage = getCurrentStage();
  const hasNextStage = stages.findIndex(s => s.status === 'active') < stages.length - 1;

  return (
    <HotSheetCard className="h-full flex flex-col">
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Academic Journey</h3>
            {currentStage && (
              <p className="text-xs text-muted-foreground mt-0.5">
                Current: {currentStage.name}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasNextStage && journeyInstance && (
              <Button
                size="sm"
                onClick={handleAdvanceStage}
                disabled={advancingStage}
                className="text-xs h-7"
              >
                {advancingStage ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                ) : (
                  <Play className="h-3 w-3 mr-1" />
                )}
                Next Stage
              </Button>
            )}
            <PastelBadge color="primary">
              {calculateOverallProgress()}% Complete
            </PastelBadge>
          </div>
        </div>
        <Progress value={calculateOverallProgress()} className="h-2" />
      </div>

      <div className="flex-1 px-6 pb-6 space-y-4 overflow-y-auto">
        {/* Journey Timeline */}
        <div className="space-y-3">
          {stages.map((stage, index) => {
            const StageIcon = getStageIcon(stage.status);
            const isSelected = selectedStage === stage.id;
            const stageColor = getStageColor(stage.status);

            return (
              <div key={stage.id} className="relative">
                {/* Connection line */}
                {index < stages.length - 1 && (
                  <div className="absolute left-4 top-10 w-0.5 h-6 bg-border/40"></div>
                )}

                <HotSheetCard
                  padding="sm"
                  hover
                  interactive
                  onClick={() => setSelectedStage(isSelected ? null : stage.id)}
                  className={`${isSelected ? 'ring-2 ring-primary/20' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <IconContainer color={stageColor} size="sm">
                      <StageIcon className="h-4 w-4" />
                    </IconContainer>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{stage.name}</h4>
                        <PastelBadge color={stageColor} size="sm">
                          {stage.completion_percentage}%
                        </PastelBadge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{stage.description}</p>
                      
                      {stage.status === 'active' && (
                        <div className="mt-2">
                          <Progress value={stage.completion_percentage} className="h-1" />
                        </div>
                      )}
                    </div>
                  </div>
                </HotSheetCard>

                {/* Expanded stage details */}
                {isSelected && (
                  <HotSheetCard padding="sm" className="mt-2 ml-7 bg-muted/30">
                    <h5 className="font-medium text-sm mb-2">Requirements</h5>
                    <div className="space-y-2">
                      {stage.requirements.length > 0 ? stage.requirements.map((req) => {
                        const ReqIcon = getRequirementIcon(req.requirement_type);
                        return (
                          <div key={req.id} className="flex items-center gap-2 text-xs">
                            <ReqIcon className="h-3 w-3 text-muted-foreground" />
                            <span className={req.is_mandatory ? 'font-medium' : ''}>{req.name}</span>
                            <PastelBadge color={getRequirementStatusColor(req.status)} size="sm">
                              {req.status}
                            </PastelBadge>
                          </div>
                        );
                      }) : (
                        <p className="text-xs text-muted-foreground">No requirements defined</p>
                      )}
                    </div>
                    
                    {/* Stage Actions - only show for active stages */}
                    {stage.status === 'active' && journeyInstance && (
                      <div className="mt-3 pt-3 border-t border-border/40 flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCompleteStage(stage.id);
                          }}
                          disabled={advancingStage}
                          className="text-xs h-7"
                        >
                          {advancingStage ? (
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                          ) : (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          )}
                          Complete Stage
                        </Button>
                        {index < stages.length - 1 && (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAdvanceStage();
                            }}
                            disabled={advancingStage}
                            className="text-xs h-7"
                          >
                            {advancingStage ? (
                              <Loader2 className="h-3 w-3 animate-spin mr-1" />
                            ) : (
                              <ChevronRight className="h-3 w-3 mr-1" />
                            )}
                            Advance to Next
                          </Button>
                        )}
                      </div>
                    )}
                  </HotSheetCard>
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
                <HotSheetCard key={action.id} padding="sm" hover className="bg-muted/30">
                  <div className="flex items-center gap-3">
                    <IconContainer color="primary" size="sm">
                      <ActionIcon className="h-4 w-4" />
                    </IconContainer>
                    <span className="text-sm flex-1">{action.name}</span>
                    <PillButton size="sm" variant="outline" className="text-xs px-2 py-1 h-6">
                      Action
                    </PillButton>
                  </div>
                </HotSheetCard>
              );
            })}
          </div>
        </div>

        {/* Stage Summary */}
        <div className="pt-2 border-t border-border/40">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-emerald-600">{stages.filter(s => s.status === 'completed').length}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-sky-600">{stages.filter(s => s.status === 'active').length}</div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
          </div>
        </div>
      </div>
    </HotSheetCard>
  );
}