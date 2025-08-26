import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Play, 
  Mail, 
  MessageSquare, 
  Phone, 
  FileText, 
  Calendar, 
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowDown,
  TestTube
} from "lucide-react";
import type { PlaybookData } from "./PlaybookWizard";

interface PlaybookPreviewStepProps {
  data: PlaybookData;
  onUpdate: (updates: Partial<PlaybookData>) => void;
}

const actionIcons = {
  email: Mail,
  sms: MessageSquare,
  call: Phone,
  document: FileText,
  interview: Calendar,
  wait: Clock,
};

export const PlaybookPreviewStep: React.FC<PlaybookPreviewStepProps> = ({
  data,
  onUpdate,
}) => {
  const [testEmails, setTestEmails] = useState(data.testEmails?.join(", ") || "");

  const handleTestEmailsChange = (value: string) => {
    setTestEmails(value);
    const emails = value.split(",").map(email => email.trim()).filter(Boolean);
    onUpdate({ testEmails: emails });
  };

  const formatTiming = (delay: { value: number; unit: string }) => {
    if (delay.value === 0) return "Immediately";
    return `${delay.value} ${delay.unit}${delay.value !== 1 ? '' : ''}`;
  };

  const getTriggerSummary = () => {
    if (data.triggers.length === 0) return "No triggers configured";
    
    const triggerDescriptions = data.triggers.map(trigger => {
      const conditions = trigger.conditions.map(condition => {
        return `${condition.field} ${condition.operator} ${condition.value}`;
      }).join(` ${trigger.conditions[0]?.logic || 'AND'} `);
      
      return `${trigger.type}: ${conditions}`;
    });

    return triggerDescriptions.join(` ${data.triggerLogic} `);
  };

  const getSequenceSummary = () => {
    if (data.actions.length === 0) return "No actions configured";
    
    let totalTime = 0;
    data.actions.forEach(action => {
      if (action.timing.delay) {
        const multiplier = action.timing.delay.unit === 'minutes' ? 1 : 
                          action.timing.delay.unit === 'hours' ? 60 : 1440;
        totalTime += action.timing.delay.value * multiplier;
      }
    });

    const formatTime = (minutes: number) => {
      if (minutes < 60) return `${minutes}m`;
      if (minutes < 1440) return `${Math.round(minutes / 60)}h`;
      return `${Math.round(minutes / 1440)}d`;
    };

    return `${data.actions.length} actions over ${formatTime(totalTime)}`;
  };

  const getValidationIssues = () => {
    const issues = [];
    
    if (!data.name) issues.push("Missing playbook name");
    if (!data.description) issues.push("Missing description");
    if (data.triggers.length === 0) issues.push("No triggers configured");
    if (data.actions.length === 0) issues.push("No actions in sequence");
    if (data.executionLimits.maxPerDay <= 0) issues.push("Invalid execution limits");
    
    return issues;
  };

  const validationIssues = getValidationIssues();
  const isValid = validationIssues.length === 0;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Review & Test</h3>
        <p className="text-muted-foreground text-sm">
          Review your playbook configuration and run tests before activation.
        </p>
      </div>

      {/* Validation Status */}
      <Card className={isValid ? "border-green-200 bg-green-50/50" : "border-red-200 bg-red-50/50"}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            {isValid ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-600" />
            )}
            <span className={`font-medium ${isValid ? "text-green-900" : "text-red-900"}`}>
              {isValid ? "Playbook is ready to deploy" : "Issues need to be resolved"}
            </span>
          </div>
          {!isValid && (
            <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
              {validationIssues.map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Playbook Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Play className="h-4 w-4 text-primary" />
            </div>
            {data.name || "Untitled Playbook"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {data.description || "No description provided"}
          </p>
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="capitalize">{data.category}</Badge>
            <Badge variant="outline" className="capitalize">{data.priority} Priority</Badge>
            <Badge variant={data.isActive ? "default" : "secondary"}>
              {data.isActive ? "Will Activate" : "Inactive"}
            </Badge>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Trigger Conditions</h4>
              <p className="text-muted-foreground">{getTriggerSummary()}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Action Sequence</h4>
              <p className="text-muted-foreground">{getSequenceSummary()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sequence Flow Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sequence Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.actions.map((action, index) => {
              const IconComponent = actionIcons[action.type] || Mail;
              
              return (
                <div key={action.id}>
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <IconComponent className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{action.title}</div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {action.type}
                        {action.timing.delay && action.timing.delay.value > 0 && (
                          ` • Delay: ${formatTiming(action.timing.delay)}`
                        )}
                      </div>
                      {action.config.subject && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Subject: {action.config.subject}
                        </div>
                      )}
                      {action.config.message && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Message: {action.config.message.substring(0, 60)}...
                        </div>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Step {index + 1}
                    </Badge>
                  </div>
                  {index < data.actions.length - 1 && (
                    <div className="flex justify-center py-2">
                      <ArrowDown className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Execution Settings Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Execution Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <h4 className="font-medium">Daily Limit</h4>
              <p className="text-muted-foreground">{data.executionLimits.maxPerDay}</p>
            </div>
            <div>
              <h4 className="font-medium">Per Student</h4>
              <p className="text-muted-foreground">{data.executionLimits.maxPerStudent}</p>
            </div>
            <div>
              <h4 className="font-medium">Cooldown</h4>
              <p className="text-muted-foreground">
                {data.executionLimits.cooldownPeriod.value} {data.executionLimits.cooldownPeriod.unit}
              </p>
            </div>
            <div>
              <h4 className="font-medium">Max Attempts</h4>
              <p className="text-muted-foreground">{data.maxAttempts}</p>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-2">
            <h4 className="font-medium text-sm">Policy Compliance</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant={data.policyCompliance.respectQuietHours ? "default" : "secondary"}>
                Quiet Hours: {data.policyCompliance.respectQuietHours ? "On" : "Off"}
              </Badge>
              <Badge variant={data.policyCompliance.respectPacing ? "default" : "secondary"}>
                Pacing: {data.policyCompliance.respectPacing ? "On" : "Off"}
              </Badge>
              <Badge variant={data.policyCompliance.respectStopTriggers ? "default" : "secondary"}>
                Stop Triggers: {data.policyCompliance.respectStopTriggers ? "On" : "Off"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Mode Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TestTube className="h-5 w-5 text-primary" />
            Test Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <Label className="text-sm font-medium">Enable Test Mode</Label>
              <p className="text-xs text-muted-foreground">
                Run playbook with test data and limited emails
              </p>
            </div>
            <Switch
              checked={data.testMode}
              onCheckedChange={(checked) => onUpdate({ testMode: checked })}
            />
          </div>

          {data.testMode && (
            <div>
              <Label className="text-sm">Test Email Recipients</Label>
              <Input
                value={testEmails}
                onChange={(e) => handleTestEmailsChange(e.target.value)}
                placeholder="email1@example.com, email2@example.com"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Comma-separated email addresses for testing
              </p>
            </div>
          )}

          <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TestTube className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Test Mode Benefits</span>
            </div>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Runs with sample data to verify logic</li>
              <li>• Emails only sent to specified test addresses</li>
              <li>• All actions logged for review</li>
              <li>• Easy to disable and switch to production</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Performance Expectations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Expected Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {data.expectedMetrics.completionRate}%
              </div>
              <div className="text-xs text-green-700">Completion Rate</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {data.expectedMetrics.averageResponseTime}
              </div>
              <div className="text-xs text-blue-700">Avg Response Time</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {data.expectedMetrics.estimatedActions}
              </div>
              <div className="text-xs text-purple-700">Actions/Day</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};