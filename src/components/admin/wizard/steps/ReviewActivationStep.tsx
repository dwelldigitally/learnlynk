import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Trophy, 
  Bot, 
  Settings, 
  Users, 
  Globe,
  Zap,
  Shield,
  Calendar,
  Clock,
  Target,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Edit,
  Play
} from "lucide-react";
import { AIAgentData } from "../AIAgentWizard";

interface ReviewActivationStepProps {
  data: AIAgentData;
  updateData: (updates: Partial<AIAgentData>) => void;
  onSave: () => void;
  isSaving: boolean;
}

const ACTIVATION_MODES = [
  {
    value: 'immediate',
    label: 'Immediate Activation',
    description: 'Start handling leads right away',
    icon: Zap,
    color: 'text-green-600'
  },
  {
    value: 'scheduled',
    label: 'Scheduled Activation',
    description: 'Activate at a specific date/time',
    icon: Calendar,
    color: 'text-blue-600'
  },
  {
    value: 'manual',
    label: 'Manual Activation',
    description: 'Activate manually after review',
    icon: Settings,
    color: 'text-orange-600'
  }
];

export function ReviewActivationStep({ data, updateData, onSave, isSaving }: ReviewActivationStepProps) {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const selectedMode = ACTIVATION_MODES.find(mode => mode.value === data.activation_mode);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="p-3 bg-emerald-100 rounded-full w-fit mx-auto">
          <Trophy className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold">Review & Activation</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Review your AI agent configuration and choose how you'd like to activate it.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Summary */}
        <div className="lg:col-span-2 space-y-4">
          {/* Identity Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bot className="h-5 w-5" />
                Agent Identity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-2xl">
                  🤖
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{data.name}</h3>
                  <p className="text-sm text-muted-foreground">{data.description}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary">{data.personality}</Badge>
                    <Badge variant="outline">{data.response_style}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Core Configuration */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Settings className="h-5 w-5" />
                Core Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="font-semibold text-lg text-primary">{data.max_concurrent_leads}</div>
                  <div className="text-sm text-muted-foreground">Max Leads</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-lg text-primary">{data.handoff_threshold}%</div>
                  <div className="text-sm text-muted-foreground">Handoff Threshold</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-lg text-primary">{data.response_time_target}h</div>
                  <div className="text-sm text-muted-foreground">Response Target</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-lg text-primary">
                    {formatTime(data.working_hours_start)}-{formatTime(data.working_hours_end)}
                  </div>
                  <div className="text-sm text-muted-foreground">Working Hours</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Specializations & Filters */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5" />
                Specializations & Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Program Specializations</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {data.specializations?.map((spec) => (
                    <Badge key={spec} variant="secondary" className="text-xs">
                      {spec.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  )) || <span className="text-sm text-muted-foreground">None selected</span>}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Lead Sources</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {data.lead_sources?.slice(0, 4).map((source) => (
                    <Badge key={source} variant="outline" className="text-xs">
                      {source.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  )) || <span className="text-sm text-muted-foreground">All sources</span>}
                  {data.lead_sources && data.lead_sources.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{data.lead_sources.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Geographic Focus</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {data.geographic_preferences?.slice(0, 3).map((geo) => (
                    <Badge key={geo} variant="outline" className="text-xs">
                      {geo.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  )) || <span className="text-sm text-muted-foreground">Global</span>}
                  {data.geographic_preferences && data.geographic_preferences.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{data.geographic_preferences.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Automation & Features */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="h-5 w-5" />
                Automation & Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="font-semibold text-lg text-primary">
                    {data.auto_follow_up ? 'ON' : 'OFF'}
                  </div>
                  <div className="text-sm text-muted-foreground">Auto Follow-up</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-lg text-primary">
                    {data.task_templates?.length || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Task Templates</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-lg text-primary">
                    {Object.values(data.conversation_flows || {}).filter(Boolean).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Conversation Flows</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-lg text-primary">
                    {Object.values(data.security_settings || {}).filter(Boolean).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Security Features</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activation Settings */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Play className="h-5 w-5" />
                Activation Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>Activation Mode</Label>
                {ACTIVATION_MODES.map((mode) => {
                  const Icon = mode.icon;
                  const isSelected = data.activation_mode === mode.value;
                  
                  return (
                    <Button
                      key={mode.value}
                      variant={isSelected ? "default" : "outline"}
                      className="w-full h-auto p-4 text-left justify-start"
                      onClick={() => updateData({ activation_mode: mode.value as any })}
                    >
                      <div className="flex items-start gap-3 w-full">
                        <Icon className={`h-5 w-5 mt-0.5 ${mode.color}`} />
                        <div className="flex-1">
                          <div className="font-medium">{mode.label}</div>
                          <div className="text-sm opacity-75">{mode.description}</div>
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>

              {data.activation_mode === 'scheduled' && (
                <div className="space-y-2 pt-4 border-t">
                  <Label>Activation Date</Label>
                  <Input
                    type="datetime-local"
                    value={data.activation_date || ''}
                    onChange={(e) => updateData({ activation_date: e.target.value })}
                  />
                </div>
              )}

              <Separator />

              <div className="space-y-2">
                <Label>Test Leads Count</Label>
                <Select
                  value={data.test_leads_count.toString()}
                  onValueChange={(value) => updateData({ test_leads_count: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 test leads</SelectItem>
                    <SelectItem value="10">10 test leads</SelectItem>
                    <SelectItem value="20">20 test leads</SelectItem>
                    <SelectItem value="0">No test period</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Start with a small number of leads to test performance
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Performance Expectations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5" />
                Expected Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <h4 className="font-medium text-green-800">Ready for Activation</h4>
                <p className="text-sm text-green-700 mt-1">
                  Your agent is configured and ready to start handling leads
                </p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Expected Response Time:</span>
                  <span className="font-medium">{data.response_time_target}h</span>
                </div>
                <div className="flex justify-between">
                  <span>Lead Capacity:</span>
                  <span className="font-medium">{data.max_concurrent_leads} leads</span>
                </div>
                <div className="flex justify-between">
                  <span>Working Hours:</span>
                  <span className="font-medium">
                    {formatTime(data.working_hours_start)}-{formatTime(data.working_hours_end)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Handoff Threshold:</span>
                  <span className="font-medium">{data.handoff_threshold}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activation Button */}
          <Card className="border-2 border-primary">
            <CardContent className="p-6 text-center">
              <Button 
                onClick={onSave}
                disabled={isSaving}
                size="lg"
                className="w-full"
              >
                {isSaving ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Creating Agent...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    {selectedMode?.label || 'Create Agent'}
                  </>
                )}
              </Button>
              
              {data.activation_mode === 'immediate' && (
                <p className="text-xs text-muted-foreground mt-2">
                  Your agent will start handling leads immediately after creation
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}