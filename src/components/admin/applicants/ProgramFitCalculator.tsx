import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Applicant } from "@/types/applicant";
import { ProgramFitAssessment, ProgramFitFactors } from "@/types/programFit";
import { ProgramFitService } from "@/services/programFitService";
import { 
  Brain, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Users,
  FileCheck,
  DollarSign,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProgramFitCalculatorProps {
  applicant: Applicant;
  onAssessmentComplete?: (assessment: ProgramFitAssessment) => void;
}

export const ProgramFitCalculator: React.FC<ProgramFitCalculatorProps> = ({
  applicant,
  onAssessmentComplete
}) => {
  const [assessment, setAssessment] = useState<ProgramFitAssessment | null>(null);
  const [factors, setFactors] = useState<ProgramFitFactors | null>(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadExistingAssessment();
  }, [applicant.id]);

  const loadExistingAssessment = async () => {
    try {
      const existingAssessment = await ProgramFitService.getAssessment(applicant.id);
      setAssessment(existingAssessment);
      if (existingAssessment) {
        setFactors(existingAssessment.assessment_data as ProgramFitFactors);
      }
    } catch (error) {
      console.error('Error loading assessment:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateFit = async () => {
    setCalculating(true);
    try {
      const { programFit, yieldPropensity, factors: calculatedFactors } = await ProgramFitService.calculateProgramFit(applicant);
      
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('User not authenticated');

      const newAssessment = await ProgramFitService.saveAssessment({
        applicant_id: applicant.id,
        user_id: user.id,
        program_fit_score: Math.round(programFit),
        yield_propensity_score: Math.round(yieldPropensity),
        hard_eligibility_passed: Object.values(calculatedFactors.hardEligibility).every(Boolean),
        academic_alignment_score: Math.round((
          calculatedFactors.academicAlignment.courseworkMatch +
          calculatedFactors.academicAlignment.gradeAlignment +
          calculatedFactors.academicAlignment.prerequisiteRecency +
          calculatedFactors.academicAlignment.academicProgression
        ) / 4),
        engagement_intent_score: Math.round((
          calculatedFactors.engagementIntent.responseTime +
          calculatedFactors.engagementIntent.emailEngagement +
          calculatedFactors.engagementIntent.portalActivity +
          Math.min(calculatedFactors.engagementIntent.eventParticipation * 20, 100)
        ) / 4),
        behavioral_signals_score: Math.round((
          calculatedFactors.behavioralSignals.applicationVelocity +
          calculatedFactors.behavioralSignals.nudgeResponse +
          calculatedFactors.behavioralSignals.schedulingSpeed +
          calculatedFactors.behavioralSignals.consistency
        ) / 4),
        financial_readiness_score: Math.round(100 - calculatedFactors.riskFactors.financialReadiness),
        risk_flags_count: Object.values(calculatedFactors.riskFactors).filter(risk => risk > 50).length,
        assessment_data: calculatedFactors,
        ai_confidence_score: 85,
        assessed_by: user.id,
        assessed_at: new Date().toISOString()
      });

      setAssessment(newAssessment);
      setFactors(calculatedFactors);
      onAssessmentComplete?.(newAssessment);

      toast({
        title: "Assessment Complete",
        description: `Program fit: ${Math.round(programFit)}%, Yield propensity: ${Math.round(yieldPropensity)}%`,
      });
    } catch (error) {
      console.error('Error calculating fit:', error);
      toast({
        title: "Assessment Failed", 
        description: "Failed to calculate program fit. Please try again.",
        variant: "destructive"
      });
    } finally {
      setCalculating(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { variant: 'default' as const, text: 'Excellent', icon: CheckCircle };
    if (score >= 80) return { variant: 'secondary' as const, text: 'Very Good', icon: TrendingUp };
    if (score >= 70) return { variant: 'outline' as const, text: 'Good', icon: Target };
    if (score >= 60) return { variant: 'outline' as const, text: 'Fair', icon: Clock };
    return { variant: 'destructive' as const, text: 'Poor', icon: AlertTriangle };
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 animate-pulse" />
            <span>Loading assessment...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Program Fit Assessment
            </div>
            <Button 
              onClick={calculateFit} 
              disabled={calculating}
              variant={assessment ? "outline" : "default"}
            >
              {calculating ? (
                <>
                  <Zap className="h-4 w-4 mr-2 animate-pulse" />
                  Calculating...
                </>
              ) : assessment ? (
                "Recalculate"
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Calculate Fit
                </>
              )}
            </Button>
          </CardTitle>
        </CardHeader>
      </Card>

      {assessment && (
        <>
          {/* Main Scores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Program Fit Score
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(assessment.program_fit_score)}`}>
                    {assessment.program_fit_score}
                  </div>
                  <div className="text-sm text-muted-foreground">Will this student succeed?</div>
                  <Badge variant={getScoreBadge(assessment.program_fit_score).variant} className="mt-2">
                    {React.createElement(getScoreBadge(assessment.program_fit_score).icon, { className: "h-3 w-3 mr-1" })}
                    {getScoreBadge(assessment.program_fit_score).text}
                  </Badge>
                </div>
                <Progress value={assessment.program_fit_score} className="h-3" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Yield Propensity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(assessment.yield_propensity_score)}`}>
                    {assessment.yield_propensity_score}
                  </div>
                  <div className="text-sm text-muted-foreground">Likely to enroll if admitted?</div>
                  <Badge variant={getScoreBadge(assessment.yield_propensity_score).variant} className="mt-2">
                    {React.createElement(getScoreBadge(assessment.yield_propensity_score).icon, { className: "h-3 w-3 mr-1" })}
                    {getScoreBadge(assessment.yield_propensity_score).text}
                  </Badge>
                </div>
                <Progress value={assessment.yield_propensity_score} className="h-3" />
              </CardContent>
            </Card>
          </div>

          {/* Factor Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Assessment Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-4 w-4" />
                    <span className="font-medium">Hard Eligibility</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {assessment.hard_eligibility_passed ? (
                      <CheckCircle className="h-4 w-4 text-success" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    )}
                    <span className="text-sm">
                      {assessment.hard_eligibility_passed ? 'Passed' : 'Failed'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    <span className="font-medium">Academic Alignment</span>
                  </div>
                  <div className={`text-lg font-semibold ${getScoreColor(assessment.academic_alignment_score)}`}>
                    {assessment.academic_alignment_score}%
                  </div>
                  <Progress value={assessment.academic_alignment_score} className="h-1" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">Engagement Intent</span>
                  </div>
                  <div className={`text-lg font-semibold ${getScoreColor(assessment.engagement_intent_score)}`}>
                    {assessment.engagement_intent_score}%
                  </div>
                  <Progress value={assessment.engagement_intent_score} className="h-1" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span className="font-medium">Behavioral Signals</span>
                  </div>
                  <div className={`text-lg font-semibold ${getScoreColor(assessment.behavioral_signals_score)}`}>
                    {assessment.behavioral_signals_score}%
                  </div>
                  <Progress value={assessment.behavioral_signals_score} className="h-1" />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-medium">Financial Readiness</span>
                  </div>
                  <div className={`text-lg font-semibold ${getScoreColor(assessment.financial_readiness_score)}`}>
                    {assessment.financial_readiness_score}%
                  </div>
                  <Progress value={assessment.financial_readiness_score} className="h-1" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-medium">Risk Flags</span>
                  </div>
                  <div className={`text-lg font-semibold ${assessment.risk_flags_count > 0 ? 'text-destructive' : 'text-success'}`}>
                    {assessment.risk_flags_count}
                  </div>
                  <span className="text-sm text-muted-foreground">Active flags</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    <span className="font-medium">AI Confidence</span>
                  </div>
                  <div className={`text-lg font-semibold ${getScoreColor(assessment.ai_confidence_score)}`}>
                    {assessment.ai_confidence_score}%
                  </div>
                  <Progress value={assessment.ai_confidence_score} className="h-1" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assessment Notes */}
          {assessment.assessment_notes && (
            <Card>
              <CardHeader>
                <CardTitle>Assessment Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {assessment.assessment_notes}
                </p>
                <div className="mt-2 text-xs text-muted-foreground">
                  Assessed on {new Date(assessment.assessed_at).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};