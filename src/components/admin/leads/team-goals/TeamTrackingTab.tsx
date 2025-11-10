import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GoalMetricCard } from "./components/GoalMetricCard";
import { TeamGoal, GoalAnalytics } from "@/types/teamGoals";
import { DollarSign, Phone, Mail, Activity, TrendingUp, FileText } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface TeamTrackingTabProps {
  goals: TeamGoal[];
  analytics: GoalAnalytics;
}

export const TeamTrackingTab: React.FC<TeamTrackingTabProps> = ({ goals, analytics }) => {
  const teamGoals = goals.filter(g => g.goal_type === 'team');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Team Performance Tracking</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor team-level goal progress and performance metrics
        </p>
      </div>

      {/* Team Goal Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <GoalMetricCard
          title="Team Revenue"
          current={analytics.teamMetrics.totalRevenue}
          target={analytics.teamMetrics.targetRevenue}
          unit="$"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          trend={12.5}
        />
        <GoalMetricCard
          title="Team Calls"
          current={analytics.teamMetrics.totalCalls}
          target={analytics.teamMetrics.targetCalls}
          unit="calls"
          icon={<Phone className="h-4 w-4 text-muted-foreground" />}
          trend={8.3}
        />
        <GoalMetricCard
          title="Team Emails"
          current={analytics.teamMetrics.totalEmails}
          target={analytics.teamMetrics.targetEmails}
          unit="emails"
          icon={<Mail className="h-4 w-4 text-muted-foreground" />}
          trend={-2.1}
        />
        <GoalMetricCard
          title="Team Activities"
          current={analytics.teamMetrics.totalActivities}
          target={analytics.teamMetrics.targetActivities}
          unit="activities"
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
          trend={5.7}
        />
        <GoalMetricCard
          title="Future Pipeline"
          current={analytics.teamMetrics.futureRevenue}
          target={analytics.teamMetrics.targetFutureRevenue}
          unit="$"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          trend={18.2}
        />
        <GoalMetricCard
          title="Contract Value"
          current={analytics.teamMetrics.contractValue}
          target={analytics.teamMetrics.targetContractValue}
          unit="$"
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
          trend={15.9}
        />
      </div>

      {/* Team Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>Team Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.topPerformers.map((performer, idx) => (
              <div key={performer.userId} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      idx === 0 ? 'bg-yellow-500/20 text-yellow-700' :
                      idx === 1 ? 'bg-gray-400/20 text-gray-700' :
                      idx === 2 ? 'bg-orange-500/20 text-orange-700' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      <span className="font-bold">#{idx + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{performer.userName}</p>
                      <p className="text-sm text-muted-foreground">
                        {performer.goalsAchieved} goals achieved
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600">{performer.attainmentRate}%</p>
                  </div>
                </div>
                <Progress value={performer.attainmentRate} className="[&>div]:bg-green-500" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Goals Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Team Goals Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamGoals.map(goal => {
              const percentage = Math.min((goal.current_value / goal.target_value) * 100, 100);
              return (
                <div key={goal.id} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{goal.goal_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {goal.goal_period} • {goal.metric_type}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {goal.unit === '$' ? '$' : ''}{goal.current_value.toLocaleString()} 
                        {goal.unit !== '$' ? ` ${goal.unit}` : ''}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        of {goal.unit === '$' ? '$' : ''}{goal.target_value.toLocaleString()}
                        {goal.unit !== '$' ? ` ${goal.unit}` : ''}
                      </p>
                    </div>
                  </div>
                  <Progress 
                    value={percentage} 
                    className={`${
                      goal.status === 'achieved' || goal.status === 'on_track' 
                        ? '[&>div]:bg-green-500' 
                        : goal.status === 'at_risk' 
                        ? '[&>div]:bg-yellow-500' 
                        : '[&>div]:bg-red-500'
                    }`}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {percentage.toFixed(1)}% complete
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Team Utilization Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Avg. Activities per Person</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">42</div>
            <p className="text-xs text-muted-foreground mt-1">per week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Team Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground mt-1">utilized</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Balance Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">Good</div>
            <p className="text-xs text-muted-foreground mt-1">workload distribution</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
