import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock3 } from "lucide-react";

interface SLAManagementConfigProps {
  settings: Record<string, any>;
  onSettingsChange: (settings: Record<string, any>) => void;
}

const COMMUNICATION_TYPES = [
  { value: 'inquiry', label: 'General Inquiry', defaultHours: 24 },
  { value: 'application', label: 'Application Review', defaultHours: 48 },
  { value: 'document_request', label: 'Document Request', defaultHours: 12 },
  { value: 'financial_aid', label: 'Financial Aid', defaultHours: 72 },
  { value: 'enrollment_issues', label: 'Enrollment Issues', defaultHours: 8 },
  { value: 'technical_support', label: 'Technical Support', defaultHours: 4 }
];

const ESCALATION_LEVELS = [
  { value: 'level1', label: 'Level 1 (75%)', description: 'First escalation threshold' },
  { value: 'level2', label: 'Level 2 (90%)', description: 'Second escalation threshold' },
  { value: 'level3', label: 'Level 3 (100%)', description: 'Critical threshold' }
];

const PRIORITY_TYPES = [
  { value: 'low', label: 'Low Priority', multiplier: 1.5 },
  { value: 'normal', label: 'Normal Priority', multiplier: 1.0 },
  { value: 'high', label: 'High Priority', multiplier: 0.5 },
  { value: 'urgent', label: 'Urgent', multiplier: 0.25 }
];

const SLAManagementConfig: React.FC<SLAManagementConfigProps> = ({
  settings,
  onSettingsChange
}) => {
  const responseTargets = settings.responseTargets || {
    inquiry: 24,
    application: 48,
    document_request: 12
  };
  
  const escalationRules = settings.escalationRules || {
    level1: 75,
    level2: 90,
    level3: 100
  };
  
  const priorityMultipliers = settings.priorityMultipliers || {
    high: 0.5,
    urgent: 0.25
  };

  const updateSettings = (updates: Partial<typeof settings>) => {
    onSettingsChange({ ...settings, ...updates });
  };

  const updateResponseTarget = (type: string, hours: number) => {
    const newTargets = {
      ...responseTargets,
      [type]: hours
    };
    updateSettings({ responseTargets: newTargets });
  };

  const updateEscalationRule = (level: string, percentage: number) => {
    const newRules = {
      ...escalationRules,
      [level]: percentage
    };
    updateSettings({ escalationRules: newRules });
  };

  const updatePriorityMultiplier = (priority: string, multiplier: number) => {
    const newMultipliers = {
      ...priorityMultipliers,
      [priority]: multiplier
    };
    updateSettings({ priorityMultipliers: newMultipliers });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock3 className="h-5 w-5" />
            SLA Management Configuration
          </CardTitle>
          <CardDescription>
            Set response time targets and escalation rules for different communication types
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Response Time Targets */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Response Time Targets (Hours)</Label>
            <div className="grid gap-4">
              {COMMUNICATION_TYPES.map((type) => (
                <div key={type.value} className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center p-3 border rounded-lg">
                  <div>
                    <Label className="text-sm font-medium">{type.label}</Label>
                    <div className="text-xs text-muted-foreground">
                      Default: {type.defaultHours} hours
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="1"
                      max="168"
                      value={responseTargets[type.value] || type.defaultHours}
                      onChange={(e) => updateResponseTarget(type.value, parseInt(e.target.value) || type.defaultHours)}
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">hours</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Escalation Rules */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Escalation Thresholds</Label>
            <div className="grid gap-3">
              {ESCALATION_LEVELS.map((level) => (
                <div key={level.value} className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center p-3 border rounded-lg">
                  <div>
                    <Label className="text-sm font-medium">{level.label}</Label>
                    <div className="text-xs text-muted-foreground">
                      {level.description}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="50"
                      max="100"
                      value={escalationRules[level.value] || parseInt(level.label.match(/\d+/)?.[0] || '75')}
                      onChange={(e) => updateEscalationRule(level.value, parseInt(e.target.value) || 75)}
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">% of SLA</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Multipliers */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Priority Multipliers</Label>
            <div className="text-sm text-muted-foreground mb-3">
              Adjust response time targets based on communication priority
            </div>
            <div className="grid gap-3">
              {PRIORITY_TYPES.map((priority) => (
                <div key={priority.value} className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center p-3 border rounded-lg">
                  <div>
                    <Label className="text-sm font-medium">{priority.label}</Label>
                    <div className="text-xs text-muted-foreground">
                      Default: {priority.multiplier}x
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="0.1"
                      max="2.0"
                      step="0.1"
                      value={priorityMultipliers[priority.value] || priority.multiplier}
                      onChange={(e) => updatePriorityMultiplier(priority.value, parseFloat(e.target.value) || priority.multiplier)}
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground">× multiplier</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SLA Calculation Example */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="text-sm font-medium mb-2">SLA Calculation Example:</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <div>• High priority inquiry: {responseTargets.inquiry || 24} hours × {priorityMultipliers.high || 0.5} = {((responseTargets.inquiry || 24) * (priorityMultipliers.high || 0.5))} hours</div>
              <div>• Level 1 escalation at: {((responseTargets.inquiry || 24) * (priorityMultipliers.high || 0.5) * (escalationRules.level1 || 75) / 100).toFixed(1)} hours</div>
              <div>• Level 2 escalation at: {((responseTargets.inquiry || 24) * (priorityMultipliers.high || 0.5) * (escalationRules.level2 || 90) / 100).toFixed(1)} hours</div>
            </div>
          </div>

          {/* Information */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="text-sm font-medium mb-2">How SLA Management Works:</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Response targets are calculated based on communication type and priority</li>
              <li>• Escalations trigger automatic notifications to supervisors</li>
              <li>• SLA performance is tracked and reported in dashboards</li>
              <li>• Critical thresholds (100%) require immediate action</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SLAManagementConfig;