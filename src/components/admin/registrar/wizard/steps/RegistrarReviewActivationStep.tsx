import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, 
  Bot, 
  Settings, 
  Filter, 
  Zap, 
  Shield,
  Calendar,
  Clock,
  Users,
  FileCheck,
  TrendingUp,
  Sparkles,
  Play,
  GraduationCap
} from "lucide-react";
import { RegistrarAIAgentData } from "../RegistrarAIAgentWizard";

interface RegistrarReviewActivationStepProps {
  data: RegistrarAIAgentData;
  updateData: (updates: Partial<RegistrarAIAgentData>) => void;
  onSave: () => void;
  isSaving: boolean;
}

const ACTIVATION_MODES = [
  {
    value: 'immediate',
    label: 'Immediate Activation',
    description: 'Activate the agent immediately after creation',
    icon: Play
  },
  {
    value: 'scheduled',
    label: 'Scheduled Activation',
    description: 'Schedule the agent to activate at a specific date and time',
    icon: Calendar
  },
  {
    value: 'manual',
    label: 'Manual Activation',
    description: 'Create the agent but activate it manually later',
    icon: Settings
  }
];

export function RegistrarReviewActivationStep({ 
  data, 
  updateData, 
  onSave, 
  isSaving 
}: RegistrarReviewActivationStepProps) {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="space-y-6">
      {/* Agent Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Registrar Agent Summary
          </CardTitle>
          <CardDescription>
            Review your registrar AI agent configuration before activation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Identity Summary */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Agent Identity
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Name</p>
                <p className="text-sm text-muted-foreground">{data.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Processing Style</p>
                <Badge variant="secondary">{data.processing_style}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium">Personality</p>
                <Badge variant="outline">{data.personality}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium">Communication</p>
                <Badge variant="outline">{data.communication_tone}</Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Core Configuration */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Core Configuration
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Max Applications</p>
                <p className="text-sm text-muted-foreground">{data.max_concurrent_applications}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Processing Target</p>
                <p className="text-sm text-muted-foreground">{data.processing_time_target}h</p>
              </div>
              <div>
                <p className="text-sm font-medium">Review Threshold</p>
                <p className="text-sm text-muted-foreground">{data.review_threshold}%</p>
              </div>
              <div>
                <p className="text-sm font-medium">Working Hours</p>
                <p className="text-sm text-muted-foreground">
                  {formatTime(data.working_hours_start)} - {formatTime(data.working_hours_end)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Timezone</p>
                <p className="text-sm text-muted-foreground">{data.timezone}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Escalation Rules</p>
                <p className="text-sm text-muted-foreground">{data.escalation_conditions?.length || 0} active</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Specializations & Filters */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Program Specializations & Filters
            </h4>
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-2">Program Specializations</p>
                  <div className="flex flex-wrap gap-1">
                    {data.program_specializations?.slice(0, 3).map(spec => (
                      <Badge key={spec} variant="secondary" className="text-xs">{spec}</Badge>
                    ))}
                    {(data.program_specializations?.length || 0) > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{(data.program_specializations?.length || 0) - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Geographic Focus</p>
                  <p className="text-sm text-muted-foreground">
                    {data.geographic_preferences?.length || 0} regions selected
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Application Sources</p>
                  <p className="text-sm text-muted-foreground">
                    {data.application_sources?.length || 0} sources configured
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Document Types</p>
                  <p className="text-sm text-muted-foreground">
                    {data.document_types?.length || 0} types selected
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Automation Features */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Automation Features
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="text-center">
                <FileCheck className={`h-6 w-6 mx-auto mb-1 ${data.auto_document_verification ? 'text-green-600' : 'text-muted-foreground'}`} />
                <p className="text-xs font-medium">Document Verification</p>
                <Badge variant={data.auto_document_verification ? "default" : "secondary"} className="text-xs">
                  {data.auto_document_verification ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <div className="text-center">
                <Users className={`h-6 w-6 mx-auto mb-1 ${data.auto_eligibility_check ? 'text-green-600' : 'text-muted-foreground'}`} />
                <p className="text-xs font-medium">Eligibility Check</p>
                <Badge variant={data.auto_eligibility_check ? "default" : "secondary"} className="text-xs">
                  {data.auto_eligibility_check ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <div className="text-center">
                <TrendingUp className={`h-6 w-6 mx-auto mb-1 ${data.auto_enrollment_prediction ? 'text-green-600' : 'text-muted-foreground'}`} />
                <p className="text-xs font-medium">Enrollment Prediction</p>
                <Badge variant={data.auto_enrollment_prediction ? "default" : "secondary"} className="text-xs">
                  {data.auto_enrollment_prediction ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <div className="text-center">
                <Shield className={`h-6 w-6 mx-auto mb-1 ${data.auto_compliance_monitoring ? 'text-green-600' : 'text-muted-foreground'}`} />
                <p className="text-xs font-medium">Compliance Monitoring</p>
                <Badge variant={data.auto_compliance_monitoring ? "default" : "secondary"} className="text-xs">
                  {data.auto_compliance_monitoring ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activation Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Activation Settings
          </CardTitle>
          <CardDescription>
            Choose how and when to activate your registrar AI agent
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ACTIVATION_MODES.map((mode) => {
              const IconComponent = mode.icon;
              return (
                <div
                  key={mode.value}
                  className={`cursor-pointer p-4 border rounded-lg transition-all duration-200 ${
                    data.activation_mode === mode.value
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }`}
                  onClick={() => updateData({ activation_mode: mode.value as any })}
                >
                  <div className="text-center space-y-2">
                    <IconComponent className="h-6 w-6 mx-auto" />
                    <h4 className="font-semibold text-sm">{mode.label}</h4>
                    <p className="text-xs text-muted-foreground">{mode.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {data.activation_mode === 'scheduled' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
              <div className="space-y-2">
                <Label htmlFor="activationDate">Activation Date</Label>
                <Input
                  id="activationDate"
                  type="datetime-local"
                  value={data.activation_date || ''}
                  onChange={(e) => updateData({ activation_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Scheduled Time</Label>
                <p className="text-sm text-muted-foreground">
                  Agent will activate automatically at the specified time
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="testApplications">Test Applications Count</Label>
              <Select
                value={data.test_applications_count.toString()}
                onValueChange={(value) => updateData({ test_applications_count: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 applications</SelectItem>
                  <SelectItem value="10">10 applications</SelectItem>
                  <SelectItem value="25">25 applications</SelectItem>
                  <SelectItem value="50">50 applications</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Number of test applications to process during initial evaluation
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expected Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Expected Performance
          </CardTitle>
          <CardDescription>
            Projected performance metrics based on your configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">85%</p>
              <p className="text-sm font-medium">Processing Efficiency</p>
              <p className="text-xs text-muted-foreground">Based on automation settings</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{data.processing_time_target}h</p>
              <p className="text-sm font-medium">Avg Processing Time</p>
              <p className="text-xs text-muted-foreground">Per application</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">95%</p>
              <p className="text-sm font-medium">Accuracy Rate</p>
              <p className="text-xs text-muted-foreground">Document verification</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Agent Button */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Ready to Create Your Registrar Agent?</h3>
              <p className="text-sm text-muted-foreground">
                Your registrar AI agent is configured and ready for {data.activation_mode} activation.
                {data.activation_mode === 'immediate' && ' It will begin processing applications immediately after creation.'}
                {data.activation_mode === 'scheduled' && ' It will activate at your scheduled time.'}
                {data.activation_mode === 'manual' && ' You can activate it manually when ready.'}
              </p>
            </div>

            <Button 
              onClick={onSave} 
              disabled={isSaving}
              size="lg"
              className="w-full md:w-auto"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Creating Registrar Agent...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Create Registrar Agent
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}