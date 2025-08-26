import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Workflow, MessageSquare, Phone, Users, Target, Lightbulb } from "lucide-react";
import type { PlaybookData } from "./PlaybookWizard";

interface PlaybookBasicInfoStepProps {
  data: PlaybookData;
  onUpdate: (updates: Partial<PlaybookData>) => void;
}

const iconOptions = [
  { value: "workflow", label: "Workflow", icon: Workflow },
  { value: "message", label: "Message", icon: MessageSquare },
  { value: "phone", label: "Phone", icon: Phone },
  { value: "users", label: "Users", icon: Users },
  { value: "target", label: "Target", icon: Target },
  { value: "lightbulb", label: "Lightbulb", icon: Lightbulb },
];

const categoryOptions = [
  { value: "enrollment", label: "Enrollment", description: "Help students complete their enrollment process" },
  { value: "retention", label: "Retention", description: "Keep students engaged and prevent dropouts" },
  { value: "engagement", label: "Engagement", description: "Increase student participation and interaction" },
  { value: "conversion", label: "Conversion", description: "Convert leads into enrolled students" },
];

const priorityOptions = [
  { value: "low", label: "Low Priority", description: "Background automation" },
  { value: "medium", label: "Medium Priority", description: "Standard processing" },
  { value: "high", label: "High Priority", description: "Urgent, time-sensitive" },
];

export const PlaybookBasicInfoStep: React.FC<PlaybookBasicInfoStepProps> = ({
  data,
  onUpdate,
}) => {
  const selectedIcon = iconOptions.find(icon => icon.value === data.icon);
  const IconComponent = selectedIcon?.icon || Workflow;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
        <p className="text-muted-foreground text-sm">
          Define the core details of your custom playbook. Choose a descriptive name and clear category.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="playbook-name">Playbook Name *</Label>
            <Input
              id="playbook-name"
              value={data.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              placeholder="e.g., Missing Document Follow-up"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="playbook-description">Description *</Label>
            <Textarea
              id="playbook-description"
              value={data.description}
              onChange={(e) => onUpdate({ description: e.target.value })}
              placeholder="Describe what this playbook does and when it should be used..."
              className="mt-1 min-h-[100px]"
            />
          </div>

          <div>
            <Label>Category *</Label>
            <Select
              value={data.category}
              onValueChange={(value: any) => onUpdate({ category: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    <div>
                      <div className="font-medium">{category.label}</div>
                      <div className="text-xs text-muted-foreground">{category.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Icon</Label>
            <Select
              value={data.icon}
              onValueChange={(value) => onUpdate({ icon: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-4 w-4" />
                    <span>{selectedIcon?.label}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map((icon) => (
                  <SelectItem key={icon.value} value={icon.value}>
                    <div className="flex items-center gap-2">
                      <icon.icon className="h-4 w-4" />
                      <span>{icon.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Priority Level</Label>
            <Select
              value={data.priority}
              onValueChange={(value: any) => onUpdate({ priority: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    <div>
                      <div className="font-medium">{priority.label}</div>
                      <div className="text-xs text-muted-foreground">{priority.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor="active-toggle" className="text-sm font-medium">
                Activate Immediately
              </Label>
              <p className="text-xs text-muted-foreground">
                Turn on this playbook as soon as it's created
              </p>
            </div>
            <Switch
              id="active-toggle"
              checked={data.isActive}
              onCheckedChange={(checked) => onUpdate({ isActive: checked })}
            />
          </div>
        </div>
      </div>

      {/* Preview Card */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-sm">Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <IconComponent className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm">
                {data.name || "Playbook Name"}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                {data.description || "Playbook description will appear here..."}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs px-2 py-1 bg-secondary rounded capitalize">
                  {data.category}
                </span>
                <span className="text-xs px-2 py-1 bg-secondary rounded capitalize">
                  {data.priority} Priority
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};