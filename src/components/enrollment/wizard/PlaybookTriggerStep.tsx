import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, X, Clock, Calendar, Filter, Zap } from "lucide-react";
import type { PlaybookData, PlaybookTrigger } from "./PlaybookWizard";

interface PlaybookTriggerStepProps {
  data: PlaybookData;
  onUpdate: (updates: Partial<PlaybookData>) => void;
}

const triggerTypes = [
  { value: "condition", label: "Condition-Based", description: "Trigger when specific conditions are met", icon: Filter },
  { value: "time", label: "Time-Based", description: "Trigger after a specific time period", icon: Clock },
  { value: "event", label: "Event-Based", description: "Trigger when specific events occur", icon: Zap },
  { value: "manual", label: "Manual", description: "Manually triggered by staff", icon: Calendar },
];

const conditionFields = [
  { value: "days_stalled", label: "Days Stalled", type: "number" },
  { value: "application_status", label: "Application Status", type: "select", options: ["incomplete", "submitted", "pending", "approved"] },
  { value: "missing_documents", label: "Missing Documents", type: "boolean" },
  { value: "last_contact_days", label: "Days Since Last Contact", type: "number" },
  { value: "enrollment_stage", label: "Enrollment Stage", type: "select", options: ["inquiry", "application", "admitted", "enrolled"] },
  { value: "event_rsvp", label: "Event RSVP", type: "boolean" },
  { value: "lead_score", label: "Lead Score", type: "number" },
  { value: "program_interest", label: "Program Interest", type: "select", options: ["business", "technology", "healthcare", "arts"] },
];

const operators = [
  { value: "equals", label: "Equals" },
  { value: "greater_than", label: "Greater Than" },
  { value: "less_than", label: "Less Than" },
  { value: "contains", label: "Contains" },
  { value: "exists", label: "Exists" },
];

export const PlaybookTriggerStep: React.FC<PlaybookTriggerStepProps> = ({
  data,
  onUpdate,
}) => {
  const [selectedTriggerType, setSelectedTriggerType] = useState<string>("condition");

  const addTrigger = () => {
    const newTrigger: PlaybookTrigger = {
      type: selectedTriggerType as any,
      conditions: [{
        field: "days_stalled",
        operator: "greater_than",
        value: 7
      }]
    };

    onUpdate({
      triggers: [...data.triggers, newTrigger]
    });
  };

  const updateTrigger = (index: number, updates: Partial<PlaybookTrigger>) => {
    const updatedTriggers = data.triggers.map((trigger, i) => 
      i === index ? { ...trigger, ...updates } : trigger
    );
    onUpdate({ triggers: updatedTriggers });
  };

  const removeTrigger = (index: number) => {
    const updatedTriggers = data.triggers.filter((_, i) => i !== index);
    onUpdate({ triggers: updatedTriggers });
  };

  const addCondition = (triggerIndex: number) => {
    const trigger = data.triggers[triggerIndex];
    const newCondition = {
      field: "days_stalled",
      operator: "greater_than" as const,
      value: 7,
      logic: "AND" as const
    };

    updateTrigger(triggerIndex, {
      conditions: [...trigger.conditions, newCondition]
    });
  };

  const updateCondition = (triggerIndex: number, conditionIndex: number, updates: any) => {
    const trigger = data.triggers[triggerIndex];
    const updatedConditions = trigger.conditions.map((condition, i) =>
      i === conditionIndex ? { ...condition, ...updates } : condition
    );
    updateTrigger(triggerIndex, { conditions: updatedConditions });
  };

  const removeCondition = (triggerIndex: number, conditionIndex: number) => {
    const trigger = data.triggers[triggerIndex];
    const updatedConditions = trigger.conditions.filter((_, i) => i !== conditionIndex);
    updateTrigger(triggerIndex, { conditions: updatedConditions });
  };

  const getFieldOptions = (fieldName: string) => {
    const field = conditionFields.find(f => f.value === fieldName);
    return field?.options || [];
  };

  const renderConditionValue = (triggerIndex: number, conditionIndex: number, condition: any) => {
    const field = conditionFields.find(f => f.value === condition.field);
    
    if (field?.type === "select") {
      return (
        <Select
          value={condition.value}
          onValueChange={(value) => updateCondition(triggerIndex, conditionIndex, { value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {getFieldOptions(condition.field).map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (field?.type === "boolean") {
      return (
        <Select
          value={condition.value ? "true" : "false"}
          onValueChange={(value) => updateCondition(triggerIndex, conditionIndex, { value: value === "true" })}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Yes</SelectItem>
            <SelectItem value="false">No</SelectItem>
          </SelectContent>
        </Select>
      );
    }

    return (
      <Input
        type={field?.type === "number" ? "number" : "text"}
        value={condition.value}
        onChange={(e) => updateCondition(triggerIndex, conditionIndex, { 
          value: field?.type === "number" ? parseInt(e.target.value) || 0 : e.target.value 
        })}
        placeholder="Enter value"
      />
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Trigger Configuration</h3>
        <p className="text-muted-foreground text-sm">
          Define when this playbook should activate. You can combine multiple triggers and conditions.
        </p>
      </div>

      {/* Trigger Logic */}
      {data.triggers.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Multiple Trigger Logic</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Label className="text-sm">When</Label>
              <Select
                value={data.triggerLogic}
                onValueChange={(value: any) => onUpdate({ triggerLogic: value })}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ANY">ANY</SelectItem>
                  <SelectItem value="ALL">ALL</SelectItem>
                </SelectContent>
              </Select>
              <Label className="text-sm">of the following triggers are met:</Label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Triggers */}
      <div className="space-y-4">
        {data.triggers.map((trigger, triggerIndex) => (
          <Card key={triggerIndex} className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    Trigger {triggerIndex + 1}
                  </Badge>
                  <span className="text-sm capitalize">{trigger.type}-based</span>
                </div>
                {data.triggers.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTrigger(triggerIndex)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Conditions */}
              {trigger.conditions.map((condition, conditionIndex) => (
                <div key={conditionIndex} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  {conditionIndex > 0 && (
                    <Select
                      value={condition.logic || "AND"}
                      onValueChange={(value) => updateCondition(triggerIndex, conditionIndex, { logic: value })}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AND">AND</SelectItem>
                        <SelectItem value="OR">OR</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                  
                  <Select
                    value={condition.field}
                    onValueChange={(value) => updateCondition(triggerIndex, conditionIndex, { field: value })}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {conditionFields.map((field) => (
                        <SelectItem key={field.value} value={field.value}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={condition.operator}
                    onValueChange={(value) => updateCondition(triggerIndex, conditionIndex, { operator: value })}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {operators.map((op) => (
                        <SelectItem key={op.value} value={op.value}>
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="w-32">
                    {renderConditionValue(triggerIndex, conditionIndex, condition)}
                  </div>

                  {trigger.conditions.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCondition(triggerIndex, conditionIndex)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() => addCondition(triggerIndex)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Condition
              </Button>

              {/* Time Configuration for time-based triggers */}
              {trigger.type === "time" && (
                <div className="space-y-3 p-3 bg-blue-50/50 rounded-lg border">
                  <h4 className="text-sm font-medium">Time Configuration</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Days Stalled</Label>
                      <Input
                        type="number"
                        value={trigger.timeConfig?.daysStalled || 7}
                        onChange={(e) => updateTrigger(triggerIndex, {
                          timeConfig: {
                            ...trigger.timeConfig,
                            daysStalled: parseInt(e.target.value) || 7
                          }
                        })}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={trigger.timeConfig?.recurring || false}
                        onCheckedChange={(checked) => updateTrigger(triggerIndex, {
                          timeConfig: {
                            ...trigger.timeConfig,
                            recurring: checked
                          }
                        })}
                      />
                      <Label className="text-xs">Recurring</Label>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Trigger */}
      <Card className="border-dashed">
        <CardContent className="p-6">
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Add New Trigger</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {triggerTypes.map((type) => (
                <button
                  key={type.value}
                  className={`p-3 border rounded-lg text-left transition-colors ${
                    selectedTriggerType === type.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedTriggerType(type.value)}
                >
                  <type.icon className="h-5 w-5 mb-2 text-primary" />
                  <div className="text-sm font-medium">{type.label}</div>
                  <div className="text-xs text-muted-foreground">{type.description}</div>
                </button>
              ))}
            </div>
            <Button onClick={addTrigger} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add {triggerTypes.find(t => t.value === selectedTriggerType)?.label} Trigger
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
