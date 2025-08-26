import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  X, 
  Mail, 
  MessageSquare, 
  Phone, 
  FileText, 
  Calendar, 
  Clock,
  ArrowDown,
  GripVertical
} from "lucide-react";
import type { PlaybookData, PlaybookAction } from "./PlaybookWizard";

interface PlaybookSequenceStepProps {
  data: PlaybookData;
  onUpdate: (updates: Partial<PlaybookData>) => void;
}

const actionTypes = [
  { 
    value: "email", 
    label: "Email", 
    icon: Mail, 
    description: "Send automated email",
    color: "bg-blue-50 text-blue-600 border-blue-200"
  },
  { 
    value: "sms", 
    label: "SMS", 
    icon: MessageSquare, 
    description: "Send text message",
    color: "bg-green-50 text-green-600 border-green-200"
  },
  { 
    value: "call", 
    label: "Call Task", 
    icon: Phone, 
    description: "Create call task for staff",
    color: "bg-orange-50 text-orange-600 border-orange-200"
  },
  { 
    value: "document", 
    label: "Document Request", 
    icon: FileText, 
    description: "Request specific documents",
    color: "bg-purple-50 text-purple-600 border-purple-200"
  },
  { 
    value: "interview", 
    label: "Interview", 
    icon: Calendar, 
    description: "Schedule interview",
    color: "bg-indigo-50 text-indigo-600 border-indigo-200"
  },
  { 
    value: "wait", 
    label: "Wait", 
    icon: Clock, 
    description: "Add delay between actions",
    color: "bg-gray-50 text-gray-600 border-gray-200"
  },
];

const emailTemplates = [
  { value: "follow-up", label: "General Follow-up" },
  { value: "document-reminder", label: "Document Reminder" },
  { value: "interview-invite", label: "Interview Invitation" },
  { value: "application-status", label: "Application Status Update" },
  { value: "custom", label: "Custom Message" },
];

const documentTypes = [
  { value: "transcript", label: "Official Transcript" },
  { value: "recommendation", label: "Letter of Recommendation" },
  { value: "essay", label: "Personal Statement/Essay" },
  { value: "resume", label: "Resume/CV" },
  { value: "portfolio", label: "Portfolio" },
  { value: "certificate", label: "Certificate/License" },
];

export const PlaybookSequenceStep: React.FC<PlaybookSequenceStepProps> = ({
  data,
  onUpdate,
}) => {
  const [selectedActionType, setSelectedActionType] = useState<string>("email");

  const addAction = () => {
    const newAction: PlaybookAction = {
      id: `action-${Date.now()}`,
      type: selectedActionType as any,
      title: `${actionTypes.find(a => a.value === selectedActionType)?.label} Action`,
      config: {},
      timing: {
        delay: { value: 0, unit: "minutes" }
      }
    };

    // Set default config based on type
    switch (selectedActionType) {
      case "email":
        newAction.config.template = "follow-up";
        newAction.config.subject = "Follow-up on your application";
        break;
      case "sms":
        newAction.config.message = "Hi {{first_name}}, checking in on your application status.";
        break;
      case "call":
        newAction.config.priority = "medium";
        break;
      case "document":
        newAction.config.documentType = "transcript";
        break;
      case "wait":
        newAction.timing.delay = { value: 1, unit: "hours" };
        break;
    }

    onUpdate({
      actions: [...data.actions, newAction]
    });
  };

  const updateAction = (index: number, updates: Partial<PlaybookAction>) => {
    const updatedActions = data.actions.map((action, i) => 
      i === index ? { ...action, ...updates } : action
    );
    onUpdate({ actions: updatedActions });
  };

  const removeAction = (index: number) => {
    const updatedActions = data.actions.filter((_, i) => i !== index);
    onUpdate({ actions: updatedActions });
  };

  const moveAction = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= data.actions.length) return;

    const updatedActions = [...data.actions];
    [updatedActions[index], updatedActions[newIndex]] = [updatedActions[newIndex], updatedActions[index]];
    onUpdate({ actions: updatedActions });
  };

  const renderActionConfig = (action: PlaybookAction, index: number) => {
    const actionType = actionTypes.find(t => t.value === action.type);
    
    return (
      <div className="space-y-4">
        {/* Basic Info */}
        <div>
          <Label className="text-sm">Action Title</Label>
          <Input
            value={action.title}
            onChange={(e) => updateAction(index, { title: e.target.value })}
            placeholder={`${actionType?.label} action`}
          />
        </div>

        {/* Type-specific configuration */}
        {action.type === "email" && (
          <div className="space-y-3">
            <div>
              <Label className="text-sm">Email Template</Label>
              <Select
                value={action.config.template}
                onValueChange={(value) => updateAction(index, { 
                  config: { ...action.config, template: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {emailTemplates.map((template) => (
                    <SelectItem key={template.value} value={template.value}>
                      {template.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm">Subject Line</Label>
              <Input
                value={action.config.subject || ""}
                onChange={(e) => updateAction(index, { 
                  config: { ...action.config, subject: e.target.value }
                })}
                placeholder="Email subject"
              />
            </div>
            {action.config.template === "custom" && (
              <div>
                <Label className="text-sm">Message Content</Label>
                <Textarea
                  value={action.config.message || ""}
                  onChange={(e) => updateAction(index, { 
                    config: { ...action.config, message: e.target.value }
                  })}
                  placeholder="Email content..."
                  className="min-h-[100px]"
                />
              </div>
            )}
          </div>
        )}

        {action.type === "sms" && (
          <div>
            <Label className="text-sm">SMS Message</Label>
            <Textarea
              value={action.config.message || ""}
              onChange={(e) => updateAction(index, { 
                config: { ...action.config, message: e.target.value }
              })}
              placeholder="SMS content (160 characters max)..."
              maxLength={160}
              className="min-h-[80px]"
            />
            <div className="text-xs text-muted-foreground mt-1">
              {(action.config.message || "").length}/160 characters
            </div>
          </div>
        )}

        {action.type === "call" && (
          <div>
            <Label className="text-sm">Call Priority</Label>
              <Select
                value={action.config.priority}
                onValueChange={(value: 'low' | 'medium' | 'high') => updateAction(index, { 
                  config: { ...action.config, priority: value }
                })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {action.type === "document" && (
          <div>
            <Label className="text-sm">Document Type</Label>
            <Select
              value={action.config.documentType}
              onValueChange={(value) => updateAction(index, { 
                config: { ...action.config, documentType: value }
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map((doc) => (
                  <SelectItem key={doc.value} value={doc.value}>
                    {doc.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {action.type === "wait" && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <Label className="text-sm">Wait Duration</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                type="number"
                value={action.timing.delay?.value || 1}
                onChange={(e) => updateAction(index, {
                  timing: {
                    ...action.timing,
                    delay: {
                      ...action.timing.delay,
                      value: parseInt(e.target.value) || 1
                    }
                  }
                })}
                className="w-20"
                min="1"
              />
              <Select
                value={action.timing.delay?.unit}
                onValueChange={(value: any) => updateAction(index, {
                  timing: {
                    ...action.timing,
                    delay: {
                      ...action.timing.delay,
                      unit: value
                    }
                  }
                })}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minutes">Minutes</SelectItem>
                  <SelectItem value="hours">Hours</SelectItem>
                  <SelectItem value="days">Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Timing Configuration for non-wait actions */}
        {action.type !== "wait" && (
          <div className="p-3 bg-blue-50/50 rounded-lg">
            <Label className="text-sm">Delay Before This Action</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                type="number"
                value={action.timing.delay?.value || 0}
                onChange={(e) => updateAction(index, {
                  timing: {
                    ...action.timing,
                    delay: {
                      ...action.timing.delay,
                      value: parseInt(e.target.value) || 0
                    }
                  }
                })}
                className="w-20"
                min="0"
              />
              <Select
                value={action.timing.delay?.unit}
                onValueChange={(value: any) => updateAction(index, {
                  timing: {
                    ...action.timing,
                    delay: {
                      ...action.timing.delay,
                      unit: value
                    }
                  }
                })}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minutes">Minutes</SelectItem>
                  <SelectItem value="hours">Hours</SelectItem>
                  <SelectItem value="days">Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Action Sequence</h3>
        <p className="text-muted-foreground text-sm">
          Build the step-by-step sequence that will execute when triggers are met. Actions run in order.
        </p>
      </div>

      {/* Sequence Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Sequence Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm">Max Attempts</Label>
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
              <Label className="text-sm">Stop sequence when successful</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Sequence */}
      <div className="space-y-4">
        {data.actions.map((action, index) => {
          const actionType = actionTypes.find(t => t.value === action.type);
          const IconComponent = actionType?.icon || Mail;
          
          return (
            <Card key={action.id} className="border-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => moveAction(index, 'up')}
                        disabled={index === 0}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-50"
                      >
                        <GripVertical className="h-4 w-4" />
                      </button>
                      <Badge variant="outline">Step {index + 1}</Badge>
                    </div>
                    <div className={`p-2 rounded-lg ${actionType?.color}`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{action.title}</div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {actionType?.label}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveAction(index, 'down')}
                      disabled={index === data.actions.length - 1}
                    >
                      ↓
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAction(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {renderActionConfig(action, index)}
              </CardContent>
            </Card>
          );
        })}

        {/* Show flow arrows between actions */}
        {data.actions.length > 1 && (
          <div className="flex justify-center">
            <ArrowDown className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Add New Action */}
      <Card className="border-dashed">
        <CardContent className="p-6">
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Add Action to Sequence</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {actionTypes.map((type) => (
                <button
                  key={type.value}
                  className={`p-3 border rounded-lg text-left transition-colors ${
                    selectedActionType === type.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedActionType(type.value)}
                >
                  <type.icon className="h-5 w-5 mb-2 text-primary" />
                  <div className="text-sm font-medium">{type.label}</div>
                  <div className="text-xs text-muted-foreground">{type.description}</div>
                </button>
              ))}
            </div>
            <Button onClick={addAction} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add {actionTypes.find(t => t.value === selectedActionType)?.label} Action
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};