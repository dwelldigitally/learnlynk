import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  Settings, 
  Users, 
  Clock, 
  AlertTriangle, 
  Zap,
  Info,
  CheckCircle,
  Globe,
  Timer
} from "lucide-react";
import { AIAgentData } from "../AIAgentWizard";

interface CoreConfigurationStepProps {
  data: AIAgentData;
  updateData: (updates: Partial<AIAgentData>) => void;
}

const TIMEZONE_OPTIONS = [
  { value: 'UTC', label: 'UTC (GMT+0)' },
  { value: 'America/New_York', label: 'Eastern Time (GMT-5)' },
  { value: 'America/Chicago', label: 'Central Time (GMT-6)' },
  { value: 'America/Denver', label: 'Mountain Time (GMT-7)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (GMT-8)' },
  { value: 'Europe/London', label: 'GMT (GMT+0)' },
  { value: 'Europe/Paris', label: 'CET (GMT+1)' },
  { value: 'Asia/Tokyo', label: 'JST (GMT+9)' },
  { value: 'Australia/Sydney', label: 'AEST (GMT+10)' }
];

const ESCALATION_CONDITIONS = [
  { id: 'high_value', label: 'High-value leads (>$50k program cost)' },
  { id: 'urgent_inquiry', label: 'Urgent or time-sensitive inquiries' },
  { id: 'complex_question', label: 'Complex questions beyond AI scope' },
  { id: 'negative_sentiment', label: 'Negative sentiment or complaints' },
  { id: 'multiple_programs', label: 'Interest in multiple programs' },
  { id: 'previous_student', label: 'Previous students or alumni' }
];

export function CoreConfigurationStep({ data, updateData }: CoreConfigurationStepProps) {
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
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="p-3 bg-green-100 rounded-full w-fit mx-auto">
          <Settings className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold">Core Configuration</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Set your agent's capacity, working hours, and handoff preferences to ensure optimal performance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Capacity Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Capacity Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Maximum Concurrent Leads</Label>
              <div className="space-y-2">
                <Slider
                  value={[data.max_concurrent_leads]}
                  onValueChange={(value) => updateData({ max_concurrent_leads: value[0] })}
                  max={100}
                  min={5}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>5 leads</span>
                  <span className="font-medium text-foreground">
                    {data.max_concurrent_leads} leads
                  </span>
                  <span>100 leads</span>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-blue-800">
                    <p className="font-medium">Recommended: 20-30 leads</p>
                    <p>This ensures quality interactions and response times. You can adjust this later based on performance.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Response Time Target (hours)</Label>
              <Select 
                value={data.response_time_target.toString()} 
                onValueChange={(value) => updateData({ response_time_target: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hour (Immediate)</SelectItem>
                  <SelectItem value="2">2 hours (Fast)</SelectItem>
                  <SelectItem value="4">4 hours (Standard)</SelectItem>
                  <SelectItem value="8">8 hours (Business day)</SelectItem>
                  <SelectItem value="24">24 hours (Next day)</SelectItem>
                </SelectContent>
              </Select>
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
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Timezone</Label>
              <Select 
                value={data.timezone} 
                onValueChange={(value) => updateData({ timezone: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONE_OPTIONS.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={data.working_hours_start}
                  onChange={(e) => updateData({ working_hours_start: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input
                  type="time"
                  value={data.working_hours_end}
                  onChange={(e) => updateData({ working_hours_end: e.target.value })}
                />
              </div>
            </div>

            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span className="font-medium">Active Hours:</span>
                <span>{formatTime(data.working_hours_start)} - {formatTime(data.working_hours_end)}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Outside these hours, leads will receive automated responses and be queued for the next business day.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Handoff Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Human Handoff Settings
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure when your AI agent should transfer leads to human advisors
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Handoff Threshold</Label>
            <div className="space-y-2">
              <Slider
                value={[data.handoff_threshold]}
                onValueChange={(value) => updateData({ handoff_threshold: value[0] })}
                max={100}
                min={10}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>10% (Very aggressive)</span>
                <span className="font-medium text-foreground">
                  {data.handoff_threshold}% confidence
                </span>
                <span>100% (Never handoff)</span>
              </div>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-orange-800">
                  <p className="font-medium">Recommended: 70-80%</p>
                  <p>When the AI is less than {data.handoff_threshold}% confident in its response, it will escalate to a human advisor.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Automatic Escalation Conditions</Label>
            <p className="text-sm text-muted-foreground">
              Select situations where leads should automatically be assigned to human advisors
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ESCALATION_CONDITIONS.map((condition) => {
                const isSelected = data.escalation_conditions?.includes(condition.id);
                return (
                  <Button
                    key={condition.id}
                    variant={isSelected ? "default" : "outline"}
                    className="h-auto p-3 justify-start text-left"
                    onClick={() => toggleEscalationCondition(condition.id)}
                  >
                    <div className="flex items-center gap-2">
                      {isSelected && <CheckCircle className="h-4 w-4" />}
                      <span className="text-sm">{condition.label}</span>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Summary */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Configuration Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="font-medium">{data.max_concurrent_leads} Leads</div>
              <div className="text-sm text-muted-foreground">Maximum capacity</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <Timer className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="font-medium">{data.response_time_target}h Response</div>
              <div className="text-sm text-muted-foreground">Target time</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="font-medium">{data.handoff_threshold}% Threshold</div>
              <div className="text-sm text-muted-foreground">Handoff point</div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Your agent will work {formatTime(data.working_hours_start)} - {formatTime(data.working_hours_end)} ({data.timezone})
              </span>
            </div>
            <p className="text-xs text-green-700 mt-1">
              {data.escalation_conditions?.length || 0} escalation conditions configured
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}