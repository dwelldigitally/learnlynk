import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Clock, MessageSquare, AlertTriangle, Bell, Mail, Phone, Smartphone } from "lucide-react";
import { JourneyAIAgentData } from "../JourneyBasedAIAgentWizard";

interface PolicyConstraintsStepProps {
  data: JourneyAIAgentData;
  updateData: (updates: Partial<JourneyAIAgentData>) => void;
}

const TONE_OPTIONS = [
  { value: 'formal', label: 'Formal', description: 'Professional and academic tone' },
  { value: 'friendly', label: 'Friendly', description: 'Warm and approachable communication' },
  { value: 'casual', label: 'Casual', description: 'Relaxed and conversational style' }
];

const CHANNEL_OPTIONS = [
  { value: 'email', label: 'Email', icon: Mail, description: 'Email communications' },
  { value: 'sms', label: 'SMS', icon: Smartphone, description: 'Text messages' },
  { value: 'in_app', label: 'In-App', icon: Bell, description: 'Portal notifications' },
  { value: 'phone', label: 'Phone', icon: Phone, description: 'Voice calls (future)' }
];

export function PolicyConstraintsStep({ data, updateData }: PolicyConstraintsStepProps) {
  const updateDailyLimits = (field: string, value: number) => {
    updateData({
      dailyActionLimits: {
        ...data.dailyActionLimits,
        [field]: value
      }
    });
  };

  const updateEscalationRules = (field: string, value: any) => {
    updateData({
      escalationRules: {
        ...data.escalationRules,
        [field]: value
      }
    });
  };

  const toggleChannel = (channel: string) => {
    const channels = data.approvedChannels;
    if (channels.includes(channel as any)) {
      updateData({ approvedChannels: channels.filter(c => c !== channel) as any });
    } else {
      updateData({ approvedChannels: [...channels, channel] as any });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-semibold">Policy Constraints & Guardrails</h3>
        <p className="text-muted-foreground">
          Set institutional guardrails and limits on what the AI agent can do
        </p>
      </div>

      {/* Daily Action Limits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Daily Action Limits
          </CardTitle>
          <CardDescription>Control how many actions the agent can perform each day</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="maxActionsPerStudent">Max actions per student per day</Label>
              <div className="mt-2 space-y-2">
                <Slider
                  value={[data.dailyActionLimits.maxActionsPerStudent]}
                  onValueChange={([value]) => updateDailyLimits('maxActionsPerStudent', value)}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>1 action</span>
                  <span className="font-medium">{data.dailyActionLimits.maxActionsPerStudent} actions</span>
                  <span>10 actions</span>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="maxTotalActions">Max total actions per day</Label>
              <div className="mt-2 space-y-2">
                <Slider
                  value={[data.dailyActionLimits.maxTotalActions]}
                  onValueChange={([value]) => updateDailyLimits('maxTotalActions', value)}
                  max={1000}
                  min={10}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>10 actions</span>
                  <span className="font-medium">{data.dailyActionLimits.maxTotalActions} actions</span>
                  <span>1,000 actions</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Approved Channels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Approved Communication Channels
          </CardTitle>
          <CardDescription>Select which communication channels the agent can use</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CHANNEL_OPTIONS.map((channel) => {
              const Icon = channel.icon;
              const isSelected = data.approvedChannels.includes(channel.value as any);
              
              return (
                <div
                  key={channel.value}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-primary bg-primary/5' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => toggleChannel(channel.value)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      isSelected ? 'bg-primary text-primary-foreground' : 'bg-gray-100'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-medium">{channel.label}</h4>
                      <p className="text-sm text-muted-foreground">{channel.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tone Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Communication Tone</CardTitle>
          <CardDescription>Set the overall tone for agent communications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TONE_OPTIONS.map((tone) => {
              const isSelected = data.toneGuide === tone.value;
              
              return (
                <div
                  key={tone.value}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-primary bg-primary/5' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => updateData({ toneGuide: tone.value as any })}
                >
                  <h4 className="font-medium">{tone.label}</h4>
                  <p className="text-sm text-muted-foreground">{tone.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Escalation Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Escalation Rules
          </CardTitle>
          <CardDescription>Define when and how the agent should escalate to humans</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="maxAttempts">Max attempts before escalation</Label>
              <Input
                id="maxAttempts"
                type="number"
                min="1"
                max="10"
                value={data.escalationRules.maxAttempts}
                onChange={(e) => updateEscalationRules('maxAttempts', parseInt(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="escalateAfterHours">Escalate after (hours)</Label>
              <Input
                id="escalateAfterHours"
                type="number"
                min="1"
                max="168"
                value={data.escalationRules.escalateAfterHours}
                onChange={(e) => updateEscalationRules('escalateAfterHours', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="notifyHumans">Notify humans on escalation</Label>
              <p className="text-sm text-muted-foreground">
                Send notifications to staff when escalation occurs
              </p>
            </div>
            <Switch
              id="notifyHumans"
              checked={data.escalationRules.notifyHumans}
              onCheckedChange={(checked) => updateEscalationRules('notifyHumans', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Policy Summary */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Policy Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Daily Limit (Per Student)</p>
              <p className="text-lg font-semibold">{data.dailyActionLimits.maxActionsPerStudent} actions</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Daily Limit (Total)</p>
              <p className="text-lg font-semibold">{data.dailyActionLimits.maxTotalActions} actions</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Approved Channels</p>
              <p className="text-lg font-semibold">{data.approvedChannels.length} channels</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Escalation After</p>
              <p className="text-lg font-semibold">{data.escalationRules.maxAttempts} attempts</p>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="outline">Tone: {data.toneGuide}</Badge>
            {data.approvedChannels.map(channel => (
              <Badge key={channel} variant="outline">{channel}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}