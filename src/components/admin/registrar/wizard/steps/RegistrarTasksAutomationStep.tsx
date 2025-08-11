import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  FileCheck, 
  Search, 
  TrendingUp, 
  Shield,
  Bot,
  Clock,
  Bell,
  CheckCircle,
  ArrowRight,
  Settings
} from "lucide-react";
import { RegistrarAIAgentData } from "../RegistrarAIAgentWizard";

interface RegistrarTasksAutomationStepProps {
  data: RegistrarAIAgentData;
  updateData: (updates: Partial<RegistrarAIAgentData>) => void;
}

const PROCESSING_INTERVALS = [
  { value: 1, label: '1 hour', description: 'Immediate processing for urgent applications' },
  { value: 6, label: '6 hours', description: 'Regular business hour processing' },
  { value: 24, label: '24 hours', description: 'Daily batch processing' },
  { value: 72, label: '3 days', description: 'Weekly processing for non-urgent items' }
];

const AUTOMATION_TEMPLATES = [
  { 
    id: 'welcome_sequence', 
    label: 'Welcome Sequence', 
    description: 'Automated welcome emails and next steps for new applicants',
    icon: Bot
  },
  { 
    id: 'document_requests', 
    label: 'Document Requests', 
    description: 'Automatic requests for missing or incomplete documents',
    icon: FileCheck
  },
  { 
    id: 'status_updates', 
    label: 'Status Updates', 
    description: 'Regular application status updates to students',
    icon: Clock
  },
  { 
    id: 'enrollment_confirmation', 
    label: 'Enrollment Confirmation', 
    description: 'Automated enrollment confirmations and next steps',
    icon: CheckCircle
  },
  { 
    id: 'deadline_reminders', 
    label: 'Deadline Reminders', 
    description: 'Proactive reminders for application deadlines',
    icon: Bell
  }
];

const NOTIFICATION_SETTINGS = [
  { 
    id: 'application_received', 
    label: 'Application Received', 
    description: 'Notify when new applications are submitted',
    defaultValue: true
  },
  { 
    id: 'documents_missing', 
    label: 'Missing Documents', 
    description: 'Alert when required documents are missing',
    defaultValue: true
  },
  { 
    id: 'review_complete', 
    label: 'Review Complete', 
    description: 'Notify when application review is finished',
    defaultValue: true
  },
  { 
    id: 'escalation_needed', 
    label: 'Escalation Required', 
    description: 'Alert when human review is needed',
    defaultValue: true
  },
  { 
    id: 'enrollment_confirmed', 
    label: 'Enrollment Confirmed', 
    description: 'Notify when student confirms enrollment',
    defaultValue: false
  },
  { 
    id: 'system_errors', 
    label: 'System Errors', 
    description: 'Alert for processing errors or failures',
    defaultValue: true
  }
];

export function RegistrarTasksAutomationStep({ data, updateData }: RegistrarTasksAutomationStepProps) {
  const toggleProcessingInterval = (hours: number) => {
    const current = data.document_processing_intervals || [];
    const updated = current.includes(hours)
      ? current.filter(h => h !== hours)
      : [...current, hours];
    updateData({ document_processing_intervals: updated });
  };

  const toggleAutomationTemplate = (templateId: string) => {
    const current = data.automation_templates || [];
    const updated = current.includes(templateId)
      ? current.filter(id => id !== templateId)
      : [...current, templateId];
    updateData({ automation_templates: updated });
  };

  const updateNotificationSetting = (settingId: string, enabled: boolean) => {
    const current = data.notification_settings || {};
    updateData({ 
      notification_settings: { 
        ...current, 
        [settingId]: enabled 
      } 
    });
  };

  return (
    <div className="space-y-6">
      {/* Core Automation Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Core Automation Features
          </CardTitle>
          <CardDescription>
            Enable key automation capabilities for your registrar agent
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileCheck className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Document Verification</h4>
                    <p className="text-sm text-muted-foreground">
                      Automatically verify and process uploaded documents
                    </p>
                  </div>
                </div>
                <Switch
                  checked={data.auto_document_verification}
                  onCheckedChange={(checked) => updateData({ auto_document_verification: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Search className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Eligibility Check</h4>
                    <p className="text-sm text-muted-foreground">
                      Automatically check application eligibility requirements
                    </p>
                  </div>
                </div>
                <Switch
                  checked={data.auto_eligibility_check}
                  onCheckedChange={(checked) => updateData({ auto_eligibility_check: checked })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Enrollment Prediction</h4>
                    <p className="text-sm text-muted-foreground">
                      AI-powered enrollment likelihood analysis
                    </p>
                  </div>
                </div>
                <Switch
                  checked={data.auto_enrollment_prediction}
                  onCheckedChange={(checked) => updateData({ auto_enrollment_prediction: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Shield className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Compliance Monitoring</h4>
                    <p className="text-sm text-muted-foreground">
                      Automatic policy compliance checking
                    </p>
                  </div>
                </div>
                <Switch
                  checked={data.auto_compliance_monitoring}
                  onCheckedChange={(checked) => updateData({ auto_compliance_monitoring: checked })}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Processing Intervals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Document Processing Intervals
          </CardTitle>
          <CardDescription>
            Set how frequently different types of documents should be processed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PROCESSING_INTERVALS.map((interval) => (
              <Button
                key={interval.value}
                variant={data.document_processing_intervals?.includes(interval.value) ? "default" : "outline"}
                className="justify-start h-auto p-4"
                onClick={() => toggleProcessingInterval(interval.value)}
              >
                <div className="text-left">
                  <div className="font-medium">{interval.label}</div>
                  <div className="text-sm opacity-80">{interval.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Automation Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Automation Templates
          </CardTitle>
          <CardDescription>
            Select pre-built automation workflows for common registrar tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AUTOMATION_TEMPLATES.map((template) => {
              const IconComponent = template.icon;
              return (
                <Button
                  key={template.id}
                  variant={data.automation_templates?.includes(template.id) ? "default" : "outline"}
                  className="justify-start h-auto p-4"
                  onClick={() => toggleAutomationTemplate(template.id)}
                >
                  <div className="flex items-start gap-3 text-left">
                    <IconComponent className="h-5 w-5 mt-0.5" />
                    <div>
                      <div className="font-medium">{template.label}</div>
                      <div className="text-sm opacity-80">{template.description}</div>
                    </div>
                  </div>
                </Button>
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
          <CardDescription>
            Configure when and how you want to be notified about agent activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {NOTIFICATION_SETTINGS.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium text-sm">{setting.label}</h4>
                  <p className="text-sm text-muted-foreground">{setting.description}</p>
                </div>
                <Switch
                  checked={data.notification_settings?.[setting.id] ?? setting.defaultValue}
                  onCheckedChange={(checked) => updateNotificationSetting(setting.id, checked)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Automation Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Automation Configuration Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Core Features Enabled</h4>
                <div className="space-y-1">
                  {data.auto_document_verification && <Badge variant="secondary">Document Verification</Badge>}
                  {data.auto_eligibility_check && <Badge variant="secondary">Eligibility Check</Badge>}
                  {data.auto_enrollment_prediction && <Badge variant="secondary">Enrollment Prediction</Badge>}
                  {data.auto_compliance_monitoring && <Badge variant="secondary">Compliance Monitoring</Badge>}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-2">Processing Schedule</h4>
                <div className="space-y-1">
                  {data.document_processing_intervals?.map(interval => {
                    const intervalConfig = PROCESSING_INTERVALS.find(i => i.value === interval);
                    return intervalConfig ? (
                      <Badge key={interval} variant="outline">{intervalConfig.label}</Badge>
                    ) : null;
                  })}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-2">Active Templates</h4>
                <p className="text-sm text-muted-foreground">
                  {data.automation_templates?.length || 0} automation templates enabled
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-2">Notifications</h4>
                <p className="text-sm text-muted-foreground">
                  {Object.values(data.notification_settings || {}).filter(Boolean).length} notification types active
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}