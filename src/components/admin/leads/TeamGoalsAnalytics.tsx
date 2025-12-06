import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab } from "./team-goals/OverviewTab";
import { SetGoalsTab } from "./team-goals/SetGoalsTab";
import { TeamTrackingTab } from "./team-goals/TeamTrackingTab";
import { IndividualTrackingTab } from "./team-goals/IndividualTrackingTab";
import { ReportsTab } from "./team-goals/ReportsTab";
import { useTeamGoals } from "@/hooks/useTeamGoals";
import { useTeamGoalAnalytics } from "@/hooks/useTeamGoalAnalytics";
import { TeamGoal, GoalFormData } from "@/types/teamGoals";
import { Loader2 } from "lucide-react";

export const TeamGoalsAnalytics: React.FC = () => {
  const { 
    goals, 
    loading: goalsLoading, 
    createGoal, 
    updateGoal, 
    deleteGoal,
    refreshGoals 
  } = useTeamGoals();
  
  const { analytics, loading: analyticsLoading, refreshAnalytics } = useTeamGoalAnalytics(goals);

  // Refresh goals after analytics updates current_value in database
  React.useEffect(() => {
    if (!analyticsLoading && goals.length > 0) {
      // Small delay to ensure database updates are complete
      const timer = setTimeout(() => {
        refreshGoals();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [analyticsLoading]);

  const handleCreateGoal = async (goalData: Partial<TeamGoal>) => {
    const formData: GoalFormData = {
      goal_name: goalData.goal_name || '',
      goal_type: goalData.goal_type || 'team',
      goal_period: goalData.goal_period || 'monthly',
      metric_type: goalData.metric_type || 'revenue',
      target_value: goalData.target_value || 0,
      start_date: goalData.start_date || new Date().toISOString().split('T')[0],
      end_date: goalData.end_date || '',
      assignee_ids: goalData.assignee_ids,
      role_filter: goalData.role_filter,
      priority: goalData.priority || 'medium',
      description: goalData.description,
      is_cascading: goalData.is_cascading,
    };
    await createGoal(formData);
  };

  const handleUpdateGoal = async (goalId: string, goalData: Partial<TeamGoal>) => {
    await updateGoal(goalId, goalData);
  };

  const handleDeleteGoal = async (goalId: string) => {
    await deleteGoal(goalId);
  };

  const isLoading = goalsLoading || analyticsLoading;

  if (isLoading && goals.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="set-goals">Set Goals</TabsTrigger>
          <TabsTrigger value="team-tracking">Team Tracking</TabsTrigger>
          <TabsTrigger value="individual">Individual</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <OverviewTab goals={goals} analytics={analytics} />
        </TabsContent>

        <TabsContent value="set-goals" className="mt-6">
          <SetGoalsTab 
            goals={goals}
            onCreateGoal={handleCreateGoal}
            onUpdateGoal={handleUpdateGoal}
            onDeleteGoal={handleDeleteGoal}
          />
        </TabsContent>

        <TabsContent value="team-tracking" className="mt-6">
          <TeamTrackingTab goals={goals} analytics={analytics} />
        </TabsContent>

        <TabsContent value="individual" className="mt-6">
          <IndividualTrackingTab goals={goals} analytics={analytics} />
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <ReportsTab goals={goals} analytics={analytics} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
