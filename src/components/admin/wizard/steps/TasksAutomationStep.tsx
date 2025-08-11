import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Zap, 
  Calendar, 
  Mail, 
  MessageSquare, 
  Clock,
  Bell,
  CheckCircle,
  ArrowRight,
  Settings,
  Bot
} from "lucide-react";
import { AIAgentData } from "../AIAgentWizard";

interface TasksAutomationStepProps {
  data: AIAgentData;
  updateData: (updates: Partial<AIAgentData>) => void;
}

const FOLLOW_UP_INTERVALS = [
  { value: 1, label: '1 hour', description: 'Immediate follow-up' },
  { value: 2, label: '2 hours', description: 'Quick response' },
  { value: 4, label: '4 hours', description: 'Same day' },
  { value: 8, label: '8 hours', description: 'Next business period' },
  { value: 24, label: '1 day', description: 'Next day' },
  { value: 72, label: '3 days', description: 'Regular follow-up' },
  { value: 168, label: '1 week', description: 'Weekly check-in' },
  { value: 336, label: '2 weeks', description: 'Bi-weekly' }
];

const TASK_TEMPLATES = [
  {
    id: 'welcome_series',
    title: 'Welcome Series',
    description: 'Send a series of welcome messages to new leads',
    category: 'Onboarding',
    automated: true
  },
  {
    id: 'application_reminder',
    title: 'Application Reminders',
    description: 'Remind prospects about incomplete applications',
    category: 'Follow-up',
    automated: true
  },
  {
    id: 'program_info',
    title: 'Program Information',
    description: 'Send detailed program information based on interest',
    category: 'Information',
    automated: false
  },
  {
    id: 'deadline_alerts',
    title: 'Deadline Alerts',
    description: 'Alert prospects about upcoming deadlines',
    category: 'Urgency',
    automated: true
  },
  {
    id: 'event_invitations',
    title: 'Event Invitations',
    description: 'Invite leads to relevant webinars and events',
    category: 'Engagement',
    automated: false
  },
  {
    id: 'feedback_collection',
    title: 'Feedback Collection',
    description: 'Collect feedback from prospects about their experience',
    category: 'Research',
    automated: false
  },
  {
    id: 'nurture_sequence',
    title: 'Lead Nurturing',
    description: 'Long-term nurturing sequence for cold leads',
    category: 'Nurturing',
    automated: true
  },
  {
    id: 'reactivation',
    title: 'Reactivation Campaign',
    description: 'Re-engage dormant leads with special offers',
    category: 'Reactivation',
    automated: false
  }
];

const SEQUENCE_PREFERENCES = [
  {
    id: 'immediate_response',
    title: 'Immediate Response',
    description: 'Respond to new inquiries within minutes',
    timing: 'Instant'
  },
  {
    id: 'educational_series',
    title: 'Educational Series',
    description: 'Send educational content over time',
    timing: 'Weekly'
  },
  {
    id: 'application_support',
    title: 'Application Support',
    description: 'Guide prospects through the application process',
    timing: 'As needed'
  },
  {
    id: 'decision_support',
    title: 'Decision Support',
    description: 'Help prospects make informed decisions',
    timing: 'Bi-weekly'
  }
];

const NOTIFICATION_SETTINGS = [
  {
    id: 'task_completion',
    label: 'Task Completion',
    description: 'Notify when automated tasks are completed'
  },
  {
    id: 'lead_responses',
    label: 'Lead Responses',
    description: 'Alert when leads respond to messages'
  },
  {
    id: 'escalation_required',
    label: 'Escalation Required',
    description: 'Notify when human intervention is needed'
  },
  {
    id: 'performance_alerts',
    label: 'Performance Alerts',
    description: 'Alert on performance thresholds'
  },
  {
    id: 'daily_summary',
    label: 'Daily Summary',
    description: 'Daily summary of agent activities'
  },
  {
    id: 'weekly_report',
    label: 'Weekly Report',
    description: 'Weekly performance and activity report'
  }
];

export function TasksAutomationStep({ data, updateData }: TasksAutomationStepProps) {
  const toggleFollowUpInterval = (hours: number) => {
    const current = data.follow_up_intervals || [];
    const updated = current.includes(hours)
      ? current.filter(h => h !== hours)
      : [...current, hours].sort((a, b) => a - b);
    updateData({ follow_up_intervals: updated });
  };

  const toggleTaskTemplate = (templateId: string) => {
    const current = data.task_templates || [];
    const updated = current.includes(templateId)
      ? current.filter(id => id !== templateId)
      : [...current, templateId];
    updateData({ task_templates: updated });
  };

  const toggleSequencePreference = (sequenceId: string) => {
    const current = data.sequence_preferences || [];
    const updated = current.includes(sequenceId)
      ? current.filter(id => id !== sequenceId)
      : [...current, sequenceId];
    updateData({ sequence_preferences: updated });
  };

  const updateNotificationSetting = (settingId: string, enabled: boolean) => {
    updateData({
      notification_settings: {
        ...data.notification_settings,
        [settingId]: enabled
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="p-3 bg-orange-100 rounded-full w-fit mx-auto">
          <Zap className="h-8 w-8 text-orange-600" />
        </div>
        <h2 className="text-2xl font-bold">Tasks & Automation</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Configure automated workflows, follow-up sequences, and task management to maximize your agent's efficiency.
        </p>
      </div>

      {/* Auto Follow-up Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Automated Follow-up
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Enable Auto Follow-up</Label>
              <p className="text-sm text-muted-foreground">
                Automatically follow up with leads based on their engagement
              </p>
            </div>
            <Switch
              checked={data.auto_follow_up}
              onCheckedChange={(checked) => updateData({ auto_follow_up: checked })}
            />
          </div>

          {data.auto_follow_up && (
            <div className="space-y-4 pt-4 border-t">
              <Label>Follow-up Intervals</Label>
              <p className="text-sm text-muted-foreground">
                Select when your agent should automatically follow up with prospects
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {FOLLOW_UP_INTERVALS.map((interval) => {
                  const isSelected = data.follow_up_intervals?.includes(interval.value);
                  return (
                    <Button
                      key={interval.value}
                      variant={isSelected ? "default" : "outline"}
                      className="h-auto p-3 flex flex-col gap-1"
                      onClick={() => toggleFollowUpInterval(interval.value)}
                    >
                      <span className="font-medium">{interval.label}</span>
                      <span className="text-xs opacity-75">{interval.description}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Task Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Task Templates
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Choose which automated tasks your agent should perform
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TASK_TEMPLATES.map((template) => {
              const isSelected = data.task_templates?.includes(template.id);
              return (
                <Button
                  key={template.id}
                  variant={isSelected ? "default" : "outline"}
                  className="h-auto p-4 text-left justify-start"
                  onClick={() => toggleTaskTemplate(template.id)}
                >
                  <div className="flex items-start gap-3 w-full">
                    <Checkbox checked={isSelected} className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{template.title}</span>
                        <Badge variant="secondary" className="text-xs">
                          {template.category}
                        </Badge>
                        {template.automated && (
                          <Badge variant="outline" className="text-xs">
                            <Bot className="h-3 w-3 mr-1" />
                            Auto
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs opacity-75">{template.description}</p>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Sequence Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5" />
            Sequence Preferences
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure automated sequences your agent will use
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {SEQUENCE_PREFERENCES.map((sequence) => {
              const isSelected = data.sequence_preferences?.includes(sequence.id);
              return (
                <div
                  key={sequence.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    isSelected ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
                  }`}
                  onClick={() => toggleSequencePreference(sequence.id)}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox checked={isSelected} className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{sequence.title}</span>
                        <Badge variant="outline" className="text-xs">
                          {sequence.timing}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{sequence.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Choose what notifications you want to receive about your agent's activities
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {NOTIFICATION_SETTINGS.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="font-medium">{setting.label}</Label>
                  <p className="text-sm text-muted-foreground">{setting.description}</p>
                </div>
                <Switch
                  checked={data.notification_settings?.[setting.id] || false}
                  onCheckedChange={(checked) => updateNotificationSetting(setting.id, checked)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Automation Summary */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Automation Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="font-medium">{data.follow_up_intervals?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Follow-up intervals</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <CheckCircle className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="font-medium">{data.task_templates?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Task templates</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <ArrowRight className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="font-medium">{data.sequence_preferences?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Sequences</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <Bell className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="font-medium">
                {Object.values(data.notification_settings || {}).filter(Boolean).length}
              </div>
              <div className="text-sm text-muted-foreground">Notifications</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              {data.auto_follow_up ? 'Auto follow-up enabled' : 'Auto follow-up disabled'} • 
              {data.task_templates?.length || 0} automated tasks configured
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}