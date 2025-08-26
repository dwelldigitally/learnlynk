import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Clock, Users, AlertTriangle } from "lucide-react";
import type { PlaybookData } from "./PlaybookWizard";

interface PlaybookSettingsStepProps {
  data: PlaybookData;
  onUpdate: (updates: Partial<PlaybookData>) => void;
}

export const PlaybookSettingsStep: React.FC<PlaybookSettingsStepProps> = ({
  data,
  onUpdate,
}) => {
  const updateExecutionLimits = (updates: Partial<typeof data.executionLimits>) => {
    onUpdate({
      executionLimits: { ...data.executionLimits, ...updates }
    });
  };

  const updatePolicyCompliance = (updates: Partial<typeof data.policyCompliance>) => {
    onUpdate({
      policyCompliance: { ...data.policyCompliance, ...updates }
    });
  };

  const updateExpectedMetrics = (updates: Partial<typeof data.expectedMetrics>) => {
    onUpdate({
      expectedMetrics: { ...data.expectedMetrics, ...updates }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Advanced Settings</h3>
        <p className="text-muted-foreground text-sm">
          Configure execution limits, policy compliance, and performance expectations for your playbook.
        </p>
      </div>

      {/* Execution Limits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-5 w-5 text-primary" />
            Execution Limits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm">Max Executions Per Day</Label>
              <Input
                type="number"
                value={data.executionLimits.maxPerDay}
                onChange={(e) => updateExecutionLimits({ 
                  maxPerDay: parseInt(e.target.value) || 50 
                })}
                min="1"
                max="1000"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Prevent system overload
              </p>
            </div>
            
            <div>
              <Label className="text-sm">Max Per Student</Label>
              <Input
                type="number"
                value={data.executionLimits.maxPerStudent}
                onChange={(e) => updateExecutionLimits({ 
                  maxPerStudent: parseInt(e.target.value) || 1 
                })}
                min="1"
                max="10"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Avoid overwhelming students
              </p>
            </div>
            
            <div>
              <Label className="text-sm">Cooldown Period</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={data.executionLimits.cooldownPeriod.value}
                  onChange={(e) => updateExecutionLimits({
                    cooldownPeriod: {
                      ...data.executionLimits.cooldownPeriod,
                      value: parseInt(e.target.value) || 24
                    }
                  })}
                  min="1"
                  className="flex-1"
                />
                <Select
                  value={data.executionLimits.cooldownPeriod.unit}
                  onValueChange={(value: any) => updateExecutionLimits({
                    cooldownPeriod: {
                      ...data.executionLimits.cooldownPeriod,
                      unit: value
                    }
                  })}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hours">hrs</SelectItem>
                    <SelectItem value="days">days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Time between executions for same student
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Policy Compliance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-5 w-5 text-primary" />
            Policy Compliance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Ensure this playbook follows your organization's communication policies.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Label className="text-sm font-medium">Respect Quiet Hours</Label>
                <p className="text-xs text-muted-foreground">
                  Don't send messages during configured quiet hours
                </p>
              </div>
              <Switch
                checked={data.policyCompliance.respectQuietHours}
                onCheckedChange={(checked) => updatePolicyCompliance({ 
                  respectQuietHours: checked 
                })}
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Label className="text-sm font-medium">Respect Message Pacing</Label>
                <p className="text-xs text-muted-foreground">
                  Follow daily message limits and spacing rules
                </p>
              </div>
              <Switch
                checked={data.policyCompliance.respectPacing}
                onCheckedChange={(checked) => updatePolicyCompliance({ 
                  respectPacing: checked 
                })}
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Label className="text-sm font-medium">Respect Stop Triggers</Label>
                <p className="text-xs text-muted-foreground">
                  Stop all communications when deposit is received
                </p>
              </div>
              <Switch
                checked={data.policyCompliance.respectStopTriggers}
                onCheckedChange={(checked) => updatePolicyCompliance({ 
                  respectStopTriggers: checked 
                })}
              />
            </div>
          </div>

          <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Policy Integration</span>
            </div>
            <p className="text-xs text-blue-700">
              These settings work with your global policies. Even if disabled here, 
              global policies will still apply unless specifically overridden.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Performance Expectations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-5 w-5 text-primary" />
            Performance Expectations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm">Expected Completion Rate (%)</Label>
              <Input
                type="number"
                value={data.expectedMetrics.completionRate}
                onChange={(e) => updateExpectedMetrics({ 
                  completionRate: parseInt(e.target.value) || 75 
                })}
                min="0"
                max="100"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Percentage of successful outcomes
              </p>
            </div>
            
            <div>
              <Label className="text-sm">Average Response Time</Label>
              <Input
                value={data.expectedMetrics.averageResponseTime}
                onChange={(e) => updateExpectedMetrics({ 
                  averageResponseTime: e.target.value 
                })}
                placeholder="e.g., 2.5h, 1 day"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Expected response time from students
              </p>
            </div>
            
            <div>
              <Label className="text-sm">Estimated Actions/Day</Label>
              <Input
                type="number"
                value={data.expectedMetrics.estimatedActions}
                onChange={(e) => updateExpectedMetrics({ 
                  estimatedActions: parseInt(e.target.value) || 25 
                })}
                min="0"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Expected daily execution count
              </p>
            </div>
          </div>

          <div className="p-3 bg-green-50/50 border border-green-200 rounded-lg">
            <h4 className="text-sm font-medium text-green-900 mb-2">Success Metrics</h4>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-medium">Completion Rate:</span>
                <Badge variant="outline" className="ml-2">
                  {data.expectedMetrics.completionRate}%
                </Badge>
              </div>
              <div>
                <span className="font-medium">Response Time:</span>
                <Badge variant="outline" className="ml-2">
                  {data.expectedMetrics.averageResponseTime}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Additional Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm">Max Sequence Attempts</Label>
              <Input
                type="number"
                value={data.maxAttempts}
                onChange={(e) => onUpdate({ maxAttempts: parseInt(e.target.value) || 3 })}
                min="1"
                max="10"
              />
            </div>
            
            <div className="flex items-center gap-2 pt-6">
              <Switch
                checked={data.stopOnSuccess}
                onCheckedChange={(checked) => onUpdate({ stopOnSuccess: checked })}
              />
              <Label className="text-sm">Stop on first success</Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};