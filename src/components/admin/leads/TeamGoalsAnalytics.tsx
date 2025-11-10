import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab } from "./team-goals/OverviewTab";
import { SetGoalsTab } from "./team-goals/SetGoalsTab";
import { TeamTrackingTab } from "./team-goals/TeamTrackingTab";
import { IndividualTrackingTab } from "./team-goals/IndividualTrackingTab";
import { ReportsTab } from "./team-goals/ReportsTab";
import { TeamGoal, GoalAnalytics } from "@/types/teamGoals";

// Dummy data
const DUMMY_GOALS: TeamGoal[] = [
  {
    id: '1',
    user_id: 'admin-1',
    goal_name: 'Q1 2024 Revenue Target',
    goal_type: 'team',
    goal_period: 'quarterly',
    metric_type: 'revenue',
    target_value: 500000,
    current_value: 387000,
    unit: '$',
    start_date: '2024-01-01',
    end_date: '2024-03-31',
    priority: 'high',
    status: 'on_track',
    description: 'Quarterly revenue goal for the entire admissions team',
    is_cascading: false,
    created_at: '2024-01-01',
    updated_at: '2024-01-15',
  },
  {
    id: '2',
    user_id: 'admin-1',
    goal_name: 'Weekly Call Volume - Sarah',
    goal_type: 'individual',
    goal_period: 'weekly',
    metric_type: 'calls',
    target_value: 50,
    current_value: 38,
    unit: 'calls',
    start_date: '2024-01-15',
    end_date: '2024-01-21',
    assignee_ids: ['user-1'],
    assignee_names: ['Sarah Johnson'],
    priority: 'high',
    status: 'at_risk',
    description: 'Weekly outbound call target',
    is_cascading: false,
    created_at: '2024-01-15',
    updated_at: '2024-01-18',
  },
  {
    id: '3',
    user_id: 'admin-1',
    goal_name: 'Monthly Email Outreach',
    goal_type: 'team',
    goal_period: 'monthly',
    metric_type: 'emails',
    target_value: 2000,
    current_value: 1650,
    unit: 'emails',
    start_date: '2024-01-01',
    end_date: '2024-01-31',
    priority: 'medium',
    status: 'on_track',
    description: 'Team-wide email communication goal',
    is_cascading: false,
    created_at: '2024-01-01',
    updated_at: '2024-01-18',
  },
  {
    id: '4',
    user_id: 'admin-1',
    goal_name: 'Annual Contract Value',
    goal_type: 'team',
    goal_period: 'annual',
    metric_type: 'contract_value',
    target_value: 2000000,
    current_value: 387000,
    unit: '$',
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    priority: 'high',
    status: 'active',
    description: 'Total contract value for 2024',
    is_cascading: true,
    created_at: '2024-01-01',
    updated_at: '2024-01-18',
  },
  {
    id: '5',
    user_id: 'admin-1',
    goal_name: 'Daily Activities - Michael',
    goal_type: 'individual',
    goal_period: 'daily',
    metric_type: 'activities',
    target_value: 15,
    current_value: 12,
    unit: 'activities',
    start_date: '2024-01-18',
    end_date: '2024-01-18',
    assignee_ids: ['user-2'],
    assignee_names: ['Michael Chen'],
    priority: 'medium',
    status: 'on_track',
    description: 'Daily activity target',
    is_cascading: false,
    created_at: '2024-01-18',
    updated_at: '2024-01-18',
  },
  {
    id: '6',
    user_id: 'admin-1',
    goal_name: 'Future Pipeline - Team',
    goal_type: 'team',
    goal_period: 'monthly',
    metric_type: 'future_revenue',
    target_value: 750000,
    current_value: 625000,
    unit: '$',
    start_date: '2024-01-01',
    end_date: '2024-01-31',
    priority: 'high',
    status: 'on_track',
    description: 'Monthly future revenue pipeline target',
    is_cascading: false,
    created_at: '2024-01-01',
    updated_at: '2024-01-18',
  },
];

const DUMMY_ANALYTICS: GoalAnalytics = {
  totalGoals: 6,
  achievedGoals: 0,
  atRiskGoals: 1,
  onTrackGoals: 4,
  offTrackGoals: 0,
  overallAttainmentRate: 82.5,
  teamMetrics: {
    totalRevenue: 387000,
    targetRevenue: 500000,
    totalCalls: 245,
    targetCalls: 300,
    totalEmails: 1650,
    targetEmails: 2000,
    totalActivities: 523,
    targetActivities: 600,
    futureRevenue: 625000,
    targetFutureRevenue: 750000,
    contractValue: 387000,
    targetContractValue: 500000,
  },
  topPerformers: [
    { userId: 'user-5', userName: 'Lisa Anderson', attainmentRate: 98, goalsAchieved: 5 },
    { userId: 'user-1', userName: 'Sarah Johnson', attainmentRate: 95, goalsAchieved: 4 },
    { userId: 'user-3', userName: 'Emily Rodriguez', attainmentRate: 92, goalsAchieved: 4 },
    { userId: 'user-2', userName: 'Michael Chen', attainmentRate: 87, goalsAchieved: 3 },
    { userId: 'user-4', userName: 'James Wilson', attainmentRate: 78, goalsAchieved: 2 },
  ],
  trends: [
    { date: '2024-01-08', value: 45000 },
    { date: '2024-01-09', value: 52000 },
    { date: '2024-01-10', value: 58000 },
    { date: '2024-01-11', value: 63000 },
    { date: '2024-01-12', value: 71000 },
  ],
};

export const TeamGoalsAnalytics: React.FC = () => {
  const [goals, setGoals] = useState<TeamGoal[]>(DUMMY_GOALS);
  const [analytics] = useState<GoalAnalytics>(DUMMY_ANALYTICS);

  const handleCreateGoal = (goalData: Partial<TeamGoal>) => {
    const newGoal: TeamGoal = {
      id: `goal-${Date.now()}`,
      user_id: 'admin-1',
      goal_name: goalData.goal_name || '',
      goal_type: goalData.goal_type || 'team',
      goal_period: goalData.goal_period || 'monthly',
      metric_type: goalData.metric_type || 'revenue',
      target_value: goalData.target_value || 0,
      current_value: goalData.current_value || 0,
      unit: goalData.unit || '$',
      start_date: goalData.start_date || new Date().toISOString().split('T')[0],
      end_date: goalData.end_date || '',
      priority: goalData.priority || 'medium',
      status: goalData.status || 'active',
      description: goalData.description,
      is_cascading: goalData.is_cascading || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const handleUpdateGoal = (goalId: string, goalData: Partial<TeamGoal>) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, ...goalData, updated_at: new Date().toISOString() }
        : goal
    ));
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
  };

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
