import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Zap } from "lucide-react";
import { PolicyData, PolicyCondition, PolicyTrigger } from "@/types/policy";

interface PolicyConditionsStepProps {
  data: PolicyData;
  onDataChange: (data: Partial<PolicyData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const CONDITION_FIELDS = [
  { value: 'student.stage', label: 'Student Stage' },
  { value: 'student.program', label: 'Program Type' },
  { value: 'student.priority', label: 'Priority Level' },
  { value: 'student.lastContact', label: 'Last Contact Date' },
  { value: 'student.responseRate', label: 'Response Rate' },
  { value: 'communication.channel', label: 'Communication Channel' },
  { value: 'communication.frequency', label: 'Communication Frequency' },
  { value: 'time.hour', label: 'Hour of Day' },
  { value: 'time.dayOfWeek', label: 'Day of Week' },
  { value: 'time.timezone', label: 'Timezone' }
];

const OPERATORS = [
  { value: 'equals', label: 'Equals' },
  { value: 'not_equals', label: 'Not Equals' },
  { value: 'greater_than', label: 'Greater Than' },
  { value: 'less_than', label: 'Less Than' },
  { value: 'contains', label: 'Contains' },
  { value: 'not_contains', label: 'Does Not Contain' },
  { value: 'in', label: 'In List' },
  { value: 'not_in', label: 'Not In List' }
];

const TRIGGER_EVENTS = [
  { value: 'student.enrolled', label: 'Student Enrolled' },
  { value: 'student.responded', label: 'Student Responded' },
  { value: 'student.missed_deadline', label: 'Missed Deadline' },
  { value: 'document.submitted', label: 'Document Submitted' },
  { value: 'document.missing', label: 'Document Missing' },
  { value: 'communication.sent', label: 'Communication Sent' },
  { value: 'communication.failed', label: 'Communication Failed' },
  { value: 'time.daily', label: 'Daily (Scheduled)' },
  { value: 'time.weekly', label: 'Weekly (Scheduled)' }
];

const PolicyConditionsStep: React.FC<PolicyConditionsStepProps> = ({
  data,
  onDataChange,
}) => {
  const addCondition = () => {
    const newCondition: PolicyCondition = {
      id: `condition_${Date.now()}`,
      field: '',
      operator: 'equals',
      value: '',
      logicalOperator: data.conditions.length > 0 ? 'AND' : undefined
    };
    
    onDataChange({
      conditions: [...data.conditions, newCondition]
    });
  };

  const updateCondition = (index: number, updates: Partial<PolicyCondition>) => {
    const updatedConditions = data.conditions.map((condition, i) =>
      i === index ? { ...condition, ...updates } : condition
    );
    onDataChange({ conditions: updatedConditions });
  };

  const removeCondition = (index: number) => {
    const updatedConditions = data.conditions.filter((_, i) => i !== index);
    // Reset logical operator for first condition if it exists
    if (updatedConditions.length > 0 && updatedConditions[0].logicalOperator) {
      updatedConditions[0] = { ...updatedConditions[0], logicalOperator: undefined };
    }
    onDataChange({ conditions: updatedConditions });
  };

  const addTrigger = () => {
    const newTrigger: PolicyTrigger = {
      id: `trigger_${Date.now()}`,
      event: '',
      conditions: [],
      action: 'apply_policy',
      delay: 0
    };
    
    onDataChange({
      triggers: [...data.triggers, newTrigger]
    });
  };

  const updateTrigger = (index: number, updates: Partial<PolicyTrigger>) => {
    const updatedTriggers = data.triggers.map((trigger, i) =>
      i === index ? { ...trigger, ...updates } : trigger
    );
    onDataChange({ triggers: updatedTriggers });
  };

  const removeTrigger = (index: number) => {
    const updatedTriggers = data.triggers.filter((_, i) => i !== index);
    onDataChange({ triggers: updatedTriggers });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Conditions & Triggers</h3>
        <p className="text-muted-foreground">
          Define when and how this policy should be applied (optional)
        </p>
      </div>

      {/* Conditions Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">Optional</Badge>
            Conditions
          </CardTitle>
          <CardDescription>
            Specify conditions that must be met for this policy to apply
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.conditions.map((condition, index) => (
            <div key={condition.id} className="space-y-3 p-4 border rounded-lg">
              {index > 0 && (
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Operator:</Label>
                  <Select
                    value={condition.logicalOperator || 'AND'}
                    onValueChange={(value) => updateCondition(index, { logicalOperator: value as 'AND' | 'OR' })}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AND">AND</SelectItem>
                      <SelectItem value="OR">OR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="space-y-2">
                  <Label className="text-sm">Field</Label>
                  <Select
                    value={condition.field}
                    onValueChange={(value) => updateCondition(index, { field: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONDITION_FIELDS.map((field) => (
                        <SelectItem key={field.value} value={field.value}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Operator</Label>
                  <Select
                    value={condition.operator}
                    onValueChange={(value) => updateCondition(index, { operator: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {OPERATORS.map((op) => (
                        <SelectItem key={op.value} value={op.value}>
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Value</Label>
                  <Input
                    placeholder="Enter value"
                    value={condition.value}
                    onChange={(e) => updateCondition(index, { value: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Action</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeCondition(index)}
                    className="w-full"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            onClick={addCondition}
            className="w-full flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Condition
          </Button>
        </CardContent>
      </Card>

      {/* Triggers Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="outline">Optional</Badge>
            <Zap className="h-4 w-4" />
            Triggers
          </CardTitle>
          <CardDescription>
            Define events that will activate this policy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.triggers.map((trigger, index) => (
            <div key={trigger.id} className="space-y-3 p-4 border rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-2">
                  <Label className="text-sm">Event</Label>
                  <Select
                    value={trigger.event}
                    onValueChange={(value) => updateTrigger(index, { event: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select event" />
                    </SelectTrigger>
                    <SelectContent>
                      {TRIGGER_EVENTS.map((event) => (
                        <SelectItem key={event.value} value={event.value}>
                          {event.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Delay (minutes)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={trigger.delay || 0}
                    onChange={(e) => updateTrigger(index, { delay: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Action</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeTrigger(index)}
                    className="w-full"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            onClick={addTrigger}
            className="w-full flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Trigger
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PolicyConditionsStep;