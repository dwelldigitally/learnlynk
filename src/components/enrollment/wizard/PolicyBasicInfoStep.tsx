import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { POLICY_CATEGORIES, PRIORITY_LEVELS, PolicyData } from "@/types/policy";
import { MessageSquare, Clock, Zap, Shield, FileCheck } from "lucide-react";

interface PolicyBasicInfoStepProps {
  data: PolicyData;
  onDataChange: (data: Partial<PolicyData>) => void;
  onNext: () => void;
}

const iconMap = {
  MessageSquare,
  Clock,
  Zap,
  Shield,
  FileCheck
};

const PolicyBasicInfoStep: React.FC<PolicyBasicInfoStepProps> = ({
  data,
  onDataChange,
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Policy Basic Information</h3>
        <p className="text-muted-foreground">
          Let's start by defining the basic details of your policy
        </p>
      </div>

      <div className="grid gap-6">
        {/* Policy Name and Description */}
        <Card>
          <CardHeader>
            <CardTitle>Policy Details</CardTitle>
            <CardDescription>
              Give your policy a clear name and description
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="policy-name">Policy Name *</Label>
              <Input
                id="policy-name"
                placeholder="e.g., Evening Quiet Hours"
                value={data.name}
                onChange={(e) => onDataChange({ name: e.target.value })}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="policy-description">Description *</Label>
              <Textarea
                id="policy-description"
                placeholder="Describe what this policy does and when it applies..."
                value={data.description}
                onChange={(e) => onDataChange({ description: e.target.value })}
                className="w-full min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Category Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Policy Category</CardTitle>
            <CardDescription>
              Choose the category that best fits your policy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {POLICY_CATEGORIES.map((category) => {
                const IconComponent = iconMap[category.icon as keyof typeof iconMap];
                return (
                  <div
                    key={category.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-primary/50 ${
                      data.category === category.id
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                    onClick={() => onDataChange({ category: category.id as any, icon: category.icon })}
                  >
                    <div className="flex items-start gap-3">
                      <IconComponent className="h-5 w-5 text-primary mt-0.5" />
                      <div className="space-y-1">
                        <div className="font-medium">{category.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {category.description}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Priority and Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Policy Settings</CardTitle>
            <CardDescription>
              Configure priority level and activation status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Priority Level</Label>
              <Select
                value={data.priority}
                onValueChange={(value) => onDataChange({ priority: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority level" />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={level.color}>
                          {level.label}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {level.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Activate Policy</Label>
                <div className="text-sm text-muted-foreground">
                  Enable this policy immediately after creation
                </div>
              </div>
              <Switch
                checked={data.isActive}
                onCheckedChange={(checked) => onDataChange({ isActive: checked })}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PolicyBasicInfoStep;