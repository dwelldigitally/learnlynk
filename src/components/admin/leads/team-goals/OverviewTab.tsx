import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GoalMetricCard } from "./components/GoalMetricCard";
import { GoalCard } from "./components/GoalCard";
import { DollarSign, Phone, Mail, Activity, TrendingUp, FileText } from "lucide-react";
import { TeamGoal, GoalAnalytics } from "@/types/teamGoals";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OverviewTabProps {
  goals: TeamGoal[];
  analytics: GoalAnalytics;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ goals, analytics }) => {
  const [period, setPeriod] = React.useState<string>("week");

  const activeGoals = goals.filter(g => g.status === 'active' || g.status === 'on_track' || g.status === 'at_risk' || g.status === 'off_track');

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Goals Overview</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track team performance across all active goals
          </p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <GoalMetricCard
          title="Total Revenue"
          current={analytics.teamMetrics.totalRevenue}
          target={analytics.teamMetrics.targetRevenue}
          unit="$"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          trend={12.5}
        />
        <GoalMetricCard
          title="Total Calls"
          current={analytics.teamMetrics.totalCalls}
          target={analytics.teamMetrics.targetCalls}
          unit="calls"
          icon={<Phone className="h-4 w-4 text-muted-foreground" />}
          trend={8.3}
        />
        <GoalMetricCard
          title="Total Emails"
          current={analytics.teamMetrics.totalEmails}
          target={analytics.teamMetrics.targetEmails}
          unit="emails"
          icon={<Mail className="h-4 w-4 text-muted-foreground" />}
          trend={-2.1}
        />
        <GoalMetricCard
          title="Total Activities"
          current={analytics.teamMetrics.totalActivities}
          target={analytics.teamMetrics.targetActivities}
          unit="activities"
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
          trend={5.7}
        />
        <GoalMetricCard
          title="Future Revenue Pipeline"
          current={analytics.teamMetrics.futureRevenue}
          target={analytics.teamMetrics.targetFutureRevenue}
          unit="$"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          trend={18.2}
        />
        <GoalMetricCard
          title="Total Contract Value"
          current={analytics.teamMetrics.contractValue}
          target={analytics.teamMetrics.targetContractValue}
          unit="$"
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
          trend={15.9}
        />
      </div>

      {/* Goal Attainment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Overall Attainment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.overallAttainmentRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">across all goals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Goals Achieved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{analytics.achievedGoals}</div>
            <p className="text-xs text-muted-foreground mt-1">completed goals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">On Track</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{analytics.onTrackGoals}</div>
            <p className="text-xs text-muted-foreground mt-1">meeting targets</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{analytics.atRiskGoals}</div>
            <p className="text-xs text-muted-foreground mt-1">needs attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performers This Week</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.topPerformers.map((performer, idx) => (
              <div key={performer.userId} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    idx === 0 ? 'bg-yellow-500/20 text-yellow-700' :
                    idx === 1 ? 'bg-gray-400/20 text-gray-700' :
                    idx === 2 ? 'bg-orange-500/20 text-orange-700' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    <span className="text-sm font-bold">#{idx + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium">{performer.userName}</p>
                    <p className="text-xs text-muted-foreground">
                      {performer.goalsAchieved} goals achieved
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">{performer.attainmentRate}%</p>
                  <p className="text-xs text-muted-foreground">attainment</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Goals Grid */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Active Goals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeGoals.map(goal => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      </div>
    </div>
  );
};
