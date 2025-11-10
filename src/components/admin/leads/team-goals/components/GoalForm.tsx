import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TeamGoal, GoalType, GoalPeriod, MetricType, GoalPriority } from "@/types/teamGoals";

interface GoalFormProps {
  goal?: TeamGoal;
  onSave: (goalData: Partial<TeamGoal>) => void;
  onCancel: () => void;
}

export const GoalForm: React.FC<GoalFormProps> = ({ goal, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<TeamGoal>>({
    goal_name: goal?.goal_name || "",
    goal_type: goal?.goal_type || "team",
    goal_period: goal?.goal_period || "monthly",
    metric_type: goal?.metric_type || "revenue",
    target_value: goal?.target_value || 0,
    current_value: goal?.current_value || 0,
    unit: goal?.unit || "$",
    start_date: goal?.start_date || new Date().toISOString().split('T')[0],
    end_date: goal?.end_date || "",
    priority: goal?.priority || "medium",
    description: goal?.description || "",
    status: goal?.status || "active",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label htmlFor="goal_name">Goal Name *</Label>
          <Input
            id="goal_name"
            value={formData.goal_name}
            onChange={(e) => updateField("goal_name", e.target.value)}
            placeholder="e.g., Q1 Revenue Target"
            required
          />
        </div>

        <div>
          <Label htmlFor="goal_type">Goal Type *</Label>
          <Select
            value={formData.goal_type}
            onValueChange={(value) => updateField("goal_type", value as GoalType)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="team">Team Goal</SelectItem>
              <SelectItem value="individual">Individual Goal</SelectItem>
              <SelectItem value="role_based">Role-Based Goal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="goal_period">Time Period *</Label>
          <Select
            value={formData.goal_period}
            onValueChange={(value) => updateField("goal_period", value as GoalPeriod)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="annual">Annual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="metric_type">Metric Type *</Label>
          <Select
            value={formData.metric_type}
            onValueChange={(value) => updateField("metric_type", value as MetricType)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="revenue">Revenue</SelectItem>
              <SelectItem value="calls">Calls</SelectItem>
              <SelectItem value="emails">Emails</SelectItem>
              <SelectItem value="activities">Activities</SelectItem>
              <SelectItem value="future_revenue">Future Revenue Pipeline</SelectItem>
              <SelectItem value="contract_value">Total Contract Value</SelectItem>
              <SelectItem value="conversions">Conversions</SelectItem>
              <SelectItem value="response_time">Response Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="priority">Priority *</Label>
          <Select
            value={formData.priority}
            onValueChange={(value) => updateField("priority", value as GoalPriority)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="target_value">Target Value *</Label>
          <Input
            id="target_value"
            type="number"
            value={formData.target_value}
            onChange={(e) => updateField("target_value", parseFloat(e.target.value))}
            placeholder="e.g., 50000"
            required
          />
        </div>

        <div>
          <Label htmlFor="unit">Unit *</Label>
          <Input
            id="unit"
            value={formData.unit}
            onChange={(e) => updateField("unit", e.target.value)}
            placeholder="e.g., $, calls, emails"
            required
          />
        </div>

        <div>
          <Label htmlFor="start_date">Start Date *</Label>
          <Input
            id="start_date"
            type="date"
            value={formData.start_date}
            onChange={(e) => updateField("start_date", e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="end_date">End Date *</Label>
          <Input
            id="end_date"
            type="date"
            value={formData.end_date}
            onChange={(e) => updateField("end_date", e.target.value)}
            required
          />
        </div>

        <div className="col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Optional: Add notes or context for this goal"
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {goal ? "Update Goal" : "Create Goal"}
        </Button>
      </div>
    </form>
  );
};
