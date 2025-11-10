import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoalForm } from "./components/GoalForm";
import { GoalCard } from "./components/GoalCard";
import { TeamGoal } from "@/types/teamGoals";
import { Plus, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SetGoalsTabProps {
  goals: TeamGoal[];
  onCreateGoal: (goalData: Partial<TeamGoal>) => void;
  onUpdateGoal: (goalId: string, goalData: Partial<TeamGoal>) => void;
  onDeleteGoal: (goalId: string) => void;
}

export const SetGoalsTab: React.FC<SetGoalsTabProps> = ({
  goals,
  onCreateGoal,
  onUpdateGoal,
  onDeleteGoal,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<TeamGoal | undefined>();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterPeriod, setFilterPeriod] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const handleSaveGoal = (goalData: Partial<TeamGoal>) => {
    if (editingGoal) {
      onUpdateGoal(editingGoal.id, goalData);
    } else {
      onCreateGoal(goalData);
    }
    setShowForm(false);
    setEditingGoal(undefined);
  };

  const handleEditGoal = (goal: TeamGoal) => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  const handleDeleteGoal = (goalId: string) => {
    if (confirm("Are you sure you want to delete this goal?")) {
      onDeleteGoal(goalId);
    }
  };

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.goal_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || goal.goal_type === filterType;
    const matchesPeriod = filterPeriod === "all" || goal.goal_period === filterPeriod;
    const matchesStatus = filterStatus === "all" || goal.status === filterStatus;
    return matchesSearch && matchesType && matchesPeriod && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Set Goals</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Create and manage team and individual goals
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Goal
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filter Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search goals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Goal Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="team">Team Goals</SelectItem>
                <SelectItem value="individual">Individual Goals</SelectItem>
                <SelectItem value="role_based">Role-Based Goals</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPeriod} onValueChange={setFilterPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Periods</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="annual">Annual</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="achieved">Achieved</SelectItem>
                <SelectItem value="at_risk">At Risk</SelectItem>
                <SelectItem value="off_track">Off Track</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Goals List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            All Goals ({filteredGoals.length})
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGoals.map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={handleEditGoal}
              onDelete={handleDeleteGoal}
            />
          ))}
        </div>
        {filteredGoals.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">No goals found matching your filters</p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Goal
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Goal Form Dialog */}
      <Dialog open={showForm} onOpenChange={(open) => {
        setShowForm(open);
        if (!open) setEditingGoal(undefined);
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingGoal ? "Edit Goal" : "Create New Goal"}
            </DialogTitle>
          </DialogHeader>
          <GoalForm
            goal={editingGoal}
            onSave={handleSaveGoal}
            onCancel={() => {
              setShowForm(false);
              setEditingGoal(undefined);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
