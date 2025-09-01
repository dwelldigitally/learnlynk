import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, 
  AlertTriangle, 
  Rocket, 
  Target, 
  Users, 
  Route, 
  Shield, 
  BookOpen, 
  Brain,
  BarChart3,
  Clock,
  MessageSquare,
  Zap
} from "lucide-react";
import { JourneyAIAgentData } from "../JourneyBasedAIAgentWizard";

interface ReviewLaunchStepProps {
  data: JourneyAIAgentData;
  updateData: (updates: Partial<JourneyAIAgentData>) => void;
  onSave: () => void;
  isSaving: boolean;
}

const PURPOSE_LABELS = {
  'applicant_nurture': 'Applicant Nurturing',
  'incomplete_docs': 'Document Recovery',
  'interview_followup': 'Interview Follow-up',
  'high_yield_conversion': 'High-Yield Conversion',
  'custom': 'Custom Purpose'
};

export function ReviewLaunchStep({ data, updateData, onSave, isSaving }: ReviewLaunchStepProps) {
  // Validation checks
  const validationChecks = [
    {
      id: 'basic_info',
      label: 'Basic Information Complete',
      passed: data.name.trim().length > 0 && data.description.trim().length > 0,
      required: true
    },
    {
      id: 'audience',
      label: 'Target Audience Defined',
      passed: data.targetCriteria.programs.length > 0 && data.targetCriteria.stages.length > 0,
      required: true
    },
    {
      id: 'journeys',
      label: 'Journey Paths Connected',
      passed: data.journeyPaths.length > 0,
      required: true
    },
    {
      id: 'channels',
      label: 'Communication Channels Set',
      passed: data.approvedChannels.length > 0,
      required: true
    },
    {
      id: 'plays',
      label: 'Playbook Configured',
      passed: data.availablePlays.length > 0,
      required: true
    },
    {
      id: 'confidence',
      label: 'Confidence Thresholds Set',
      passed: data.confidenceSettings.autoActThreshold > 0,
      required: true
    },
    {
      id: 'fallback',
      label: 'Fallback Play Configured',
      passed: !!data.fallbackPlay,
      required: false
    }
  ];

  const requiredChecks = validationChecks.filter(check => check.required);
  const passedRequired = requiredChecks.filter(check => check.passed).length;
  const canLaunch = passedRequired === requiredChecks.length;

  const estimatedAudienceSize = data.targetCriteria.programs.length * data.targetCriteria.stages.length * 50; // Mock calculation

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-semibold">Review & Launch</h3>
        <p className="text-muted-foreground">
          Review your AI agent configuration and launch when ready
        </p>
      </div>

      {/* Validation Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Configuration Validation
          </CardTitle>
          <CardDescription>
            {canLaunch ? 'Your agent is ready to launch!' : 'Please complete the required configurations below'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {validationChecks.map(check => (
              <div key={check.id} className="flex items-center gap-3">
                {check.passed ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertTriangle className={`h-5 w-5 ${check.required ? 'text-red-600' : 'text-yellow-600'}`} />
                )}
                <span className={`text-sm ${check.passed ? 'text-green-600' : check.required ? 'text-red-600' : 'text-yellow-600'}`}>
                  {check.label}
                  {check.required && !check.passed && ' (Required)'}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configuration Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Agent Configuration Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Basic Information
            </h4>
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">{data.name}</span>
                <Badge variant="secondary">
                  {PURPOSE_LABELS[data.purpose as keyof typeof PURPOSE_LABELS] || data.purpose}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{data.description}</p>
            </div>
          </div>

          <Separator />

          {/* Audience Scope */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Target Audience
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Programs</p>
                <p className="font-medium">{data.targetCriteria.programs.length} selected</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Journey Stages</p>
                <p className="font-medium">{data.targetCriteria.stages.length} targeted</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Regions</p>
                <p className="font-medium">{data.targetCriteria.geography.length} selected</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Est. Audience</p>
                <p className="font-medium">{estimatedAudienceSize.toLocaleString()} students</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Journey Integration */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Route className="h-4 w-4" />
              Journey Integration
            </h4>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Connected Journeys</p>
                <p className="font-medium">{data.journeyPaths.length} paths</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Auto-Adjustment</p>
                <p className="font-medium">{data.autoAdjustByStage ? 'Enabled' : 'Disabled'}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Policy Constraints */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Policy Constraints
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Daily Limit (Per Student)</p>
                <p className="font-medium">{data.dailyActionLimits.maxActionsPerStudent} actions</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Daily Limit (Total)</p>
                <p className="font-medium">{data.dailyActionLimits.maxTotalActions} actions</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Channels</p>
                <p className="font-medium">{data.approvedChannels.length} approved</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tone</p>
                <p className="font-medium capitalize">{data.toneGuide}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Playbook Access */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Playbook Configuration
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Available Plays</p>
                <p className="font-medium">{data.availablePlays.length} plays</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Default Triggers</p>
                <p className="font-medium">{Object.keys(data.defaultPlaysByTrigger).length} configured</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fallback Play</p>
                <p className="font-medium">{data.fallbackPlay ? 'Set' : 'Not set'}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Confidence Settings */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Confidence Thresholds
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Auto-Execute Above</p>
                <p className="font-medium text-green-600">{data.confidenceSettings.autoActThreshold}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ask Approval</p>
                <p className="font-medium text-yellow-600">
                  {data.confidenceSettings.askApprovalRange.min}%-{data.confidenceSettings.askApprovalRange.max}%
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Skip Below</p>
                <p className="font-medium text-red-600">{data.confidenceSettings.skipThreshold}%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Launch Button */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            Ready to Launch
          </CardTitle>
          <CardDescription>
            {canLaunch 
              ? 'Your AI agent is configured and ready to start working!'
              : 'Complete the required configurations above to launch your agent.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <Button 
              onClick={onSave}
              disabled={!canLaunch || isSaving}
              size="lg"
              className="min-w-[200px]"
            >
              {isSaving ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Creating Agent...
                </>
              ) : (
                <>
                  <Rocket className="h-4 w-4 mr-2" />
                  Launch AI Agent
                </>
              )}
            </Button>
          </div>
          
          {canLaunch && (
            <div className="mt-4 text-center text-sm text-muted-foreground">
              <p>Your agent will start monitoring and engaging with students immediately after launch.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}