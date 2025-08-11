import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Users, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Globe,
  Timer,
  FileCheck
} from "lucide-react";
import { RegistrarAIAgentData } from "../RegistrarAIAgentWizard";

interface RegistrarCoreConfigurationStepProps {
  data: RegistrarAIAgentData;
  updateData: (updates: Partial<RegistrarAIAgentData>) => void;
}

const ESCALATION_CONDITIONS = [
  { id: 'missing_documents', label: 'Missing Required Documents', description: 'Critical documents not provided' },
  { id: 'eligibility_issues', label: 'Eligibility Concerns', description: 'Questionable eligibility requirements' },
  { id: 'policy_violations', label: 'Policy Violations', description: 'Potential policy or compliance issues' },
  { id: 'high_risk_applications', label: 'High Risk Applications', description: 'Applications requiring special review' },
  { id: 'technical_errors', label: 'Technical Processing Errors', description: 'System or processing failures' },
  { id: 'student_complaints', label: 'Student Complaints', description: 'Complaints about application process' }
];

export function RegistrarCoreConfigurationStep({ data, updateData }: RegistrarCoreConfigurationStepProps) {
  const toggleEscalationCondition = (conditionId: string) => {
    const current = data.escalation_conditions || [];
    const updated = current.includes(conditionId)
      ? current.filter(id => id !== conditionId)
      : [...current, conditionId];
    updateData({ escalation_conditions: updated });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="space-y-6">
      {/* Capacity Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Processing Capacity
          </CardTitle>
          <CardDescription>
            Configure how many applications your agent can handle simultaneously
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Maximum Concurrent Applications</Label>
              <div className="px-3">
                <Slider
                  value={[data.max_concurrent_applications]}
                  onValueChange={([value]) => updateData({ max_concurrent_applications: value })}
                  max={100}
                  min={10}
                  step={5}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>10 applications</span>
                <span className="font-medium text-foreground">
                  {data.max_concurrent_applications} applications
                </span>
                <span>100 applications</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Recommended: 25-50 applications for balanced processing
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="processingTimeTarget">Processing Time Target</Label>
              <Select
                value={data.processing_time_target.toString()}
                onValueChange={(value) => updateData({ processing_time_target: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hour (Express)</SelectItem>
                  <SelectItem value="2">2 hours (Fast)</SelectItem>
                  <SelectItem value="4">4 hours (Standard)</SelectItem>
                  <SelectItem value="8">8 hours (Thorough)</SelectItem>
                  <SelectItem value="24">24 hours (Comprehensive)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Average time to complete application processing
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Working Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Working Hours
          </CardTitle>
          <CardDescription>
            Set when your registrar agent should be active
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={data.timezone}
                onValueChange={(value) => updateData({ timezone: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  <SelectItem value="America/Chicago">Central Time</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={data.working_hours_start}
                onChange={(e) => updateData({ working_hours_start: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={data.working_hours_end}
                onChange={(e) => updateData({ working_hours_end: e.target.value })}
              />
            </div>
          </div>
          
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm">
              <strong>Active Hours:</strong> {formatTime(data.working_hours_start)} - {formatTime(data.working_hours_end)} ({data.timezone})
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Applications received outside these hours will be queued for processing
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Review Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Review & Escalation Settings
          </CardTitle>
          <CardDescription>
            Configure when applications should be escalated to human reviewers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Review Threshold</Label>
              <div className="px-3">
                <Slider
                  value={[data.review_threshold]}
                  onValueChange={([value]) => updateData({ review_threshold: value })}
                  max={100}
                  min={50}
                  step={5}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>50% (Low confidence)</span>
                <span className="font-medium text-foreground">
                  {data.review_threshold}% confidence required
                </span>
                <span>100% (Perfect match)</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Applications below this confidence level will be escalated to human review
              </p>
            </div>

            <div className="space-y-3">
              <Label>Automatic Escalation Conditions</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ESCALATION_CONDITIONS.map((condition) => (
                  <Button
                    key={condition.id}
                    variant={data.escalation_conditions?.includes(condition.id) ? "default" : "outline"}
                    className="justify-start h-auto p-3"
                    onClick={() => toggleEscalationCondition(condition.id)}
                  >
                    <div className="text-left">
                      <div className="font-medium text-sm">{condition.label}</div>
                      <div className="text-xs opacity-80">{condition.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Selected conditions will trigger automatic escalation regardless of confidence score
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Configuration Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Max Applications:</span>
                <Badge variant="secondary">{data.max_concurrent_applications}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Processing Target:</span>
                <Badge variant="secondary">{data.processing_time_target}h</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Review Threshold:</span>
                <Badge variant="secondary">{data.review_threshold}%</Badge>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Working Hours:</span>
                <Badge variant="outline">
                  {formatTime(data.working_hours_start)} - {formatTime(data.working_hours_end)}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Timezone:</span>
                <Badge variant="outline">{data.timezone}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Escalation Rules:</span>
                <Badge variant="outline">{data.escalation_conditions?.length || 0} active</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}