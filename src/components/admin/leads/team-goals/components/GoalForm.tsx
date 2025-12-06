import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TeamGoal, GoalType, GoalPeriod, MetricType, GoalPriority } from "@/types/teamGoals";
import { supabase } from "@/integrations/supabase/client";

interface GoalFormProps {
  goal?: TeamGoal;
  onSave: (goalData: Partial<TeamGoal>) => void;
  onCancel: () => void;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
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
    assignee_ids: goal?.assignee_ids || [],
    assignee_names: goal?.assignee_names || [],
    is_cascading: goal?.is_cascading || false,
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  // Fetch team members from profiles table
  useEffect(() => {
    const fetchTeamMembers = async () => {
      setLoadingMembers(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('user_id, first_name, last_name')
          .order('first_name');

        if (error) throw error;

        const members: TeamMember[] = (data || []).map((profile: any) => ({
          id: profile.user_id,
          name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown User',
          role: 'Team Member',
        }));

        setTeamMembers(members);
      } catch (err) {
        console.error('Error fetching team members:', err);
      } finally {
        setLoadingMembers(false);
      }
    };

    fetchTeamMembers();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAssigneeToggle = (memberId: string, memberName: string) => {
    const currentIds = formData.assignee_ids || [];
    const currentNames = formData.assignee_names || [];
    
    if (currentIds.includes(memberId)) {
      // Remove member
      const index = currentIds.indexOf(memberId);
      updateField('assignee_ids', currentIds.filter(id => id !== memberId));
      updateField('assignee_names', currentNames.filter((_, i) => i !== index));
    } else {
      // Add member
      updateField('assignee_ids', [...currentIds, memberId]);
      updateField('assignee_names', [...currentNames, memberName]);
    }
  };

  // Auto-set unit based on metric type
  useEffect(() => {
    const units: Record<string, string> = {
      revenue: '$',
      future_revenue: '$',
      contract_value: '$',
      calls: 'calls',
      emails: 'emails',
      activities: 'activities',
      conversions: 'conversions',
      response_time: 'minutes',
    };
    if (formData.metric_type) {
      updateField('unit', units[formData.metric_type] || '');
    }
  }, [formData.metric_type]);

  const showAssigneeSelector = formData.goal_type === 'individual';

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

        {/* Assignee Selector for Individual Goals */}
        {showAssigneeSelector && (
          <div className="col-span-2">
            <Label>Assign To Team Members *</Label>
            <div className="border rounded-md p-3 mt-1 max-h-40 overflow-y-auto space-y-2">
              {loadingMembers ? (
                <p className="text-sm text-muted-foreground">Loading team members...</p>
              ) : teamMembers.length === 0 ? (
                <p className="text-sm text-muted-foreground">No team members found</p>
              ) : (
                teamMembers.map(member => (
                  <div key={member.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`member-${member.id}`}
                      checked={formData.assignee_ids?.includes(member.id)}
                      onCheckedChange={() => handleAssigneeToggle(member.id, member.name)}
                    />
                    <label
                      htmlFor={`member-${member.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {member.name} <span className="text-muted-foreground">({member.role})</span>
                    </label>
                  </div>
                ))
              )}
            </div>
            {formData.assignee_ids && formData.assignee_ids.length > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                {formData.assignee_ids.length} member(s) selected
              </p>
            )}
          </div>
        )}

        {/* Role filter for role-based goals */}
        {formData.goal_type === 'role_based' && (
          <div className="col-span-2">
            <Label htmlFor="role_filter">Target Role</Label>
            <Select
              value={formData.role_filter || 'all'}
              onValueChange={(value) => updateField("role_filter", value === 'all' ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="advisor">Advisor</SelectItem>
                <SelectItem value="team_lead">Team Lead</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

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
            onChange={(e) => updateField("target_value", parseFloat(e.target.value) || 0)}
            placeholder="e.g., 50000"
            required
          />
        </div>

        <div>
          <Label htmlFor="unit">Unit</Label>
          <Input
            id="unit"
            value={formData.unit}
            onChange={(e) => updateField("unit", e.target.value)}
            placeholder="Auto-set based on metric"
            disabled
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
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_cascading"
              checked={formData.is_cascading}
              onCheckedChange={(checked) => updateField("is_cascading", checked)}
            />
            <label
              htmlFor="is_cascading"
              className="text-sm font-medium leading-none"
            >
              Enable goal cascading (auto-create sub-goals for smaller periods)
            </label>
          </div>
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
