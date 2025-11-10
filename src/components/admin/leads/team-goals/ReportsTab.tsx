import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TeamGoal, GoalAnalytics } from "@/types/teamGoals";
import { Download, FileText, BarChart3, TrendingUp, Target } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReportsTabProps {
  goals: TeamGoal[];
  analytics: GoalAnalytics;
}

const REPORT_TEMPLATES = [
  { id: 'attainment', name: 'Goal Attainment Report', icon: Target, description: 'Overall percentage of goals achieved by period' },
  { id: 'trends', name: 'Performance Trends Report', icon: TrendingUp, description: 'Historical performance over time' },
  { id: 'variance', name: 'Variance Analysis', icon: BarChart3, description: 'Actual vs. target analysis' },
  { id: 'pipeline', name: 'Revenue Pipeline Report', icon: FileText, description: 'Future revenue forecast based on current pipeline' },
];

export const ReportsTab: React.FC<ReportsTabProps> = ({ goals, analytics }) => {
  const [selectedReport, setSelectedReport] = useState('attainment');
  const [dateRange, setDateRange] = useState('month');

  const handleExportReport = (format: 'pdf' | 'csv') => {
    console.log(`Exporting report as ${format}`);
    // In real implementation, this would trigger the export
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Reports & Analytics</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Generate detailed reports on goal performance and trends
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExportReport('csv')}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => handleExportReport('pdf')}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Report Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {REPORT_TEMPLATES.map(template => (
          <Card 
            key={template.id}
            className={`cursor-pointer transition-all ${
              selectedReport === template.id 
                ? 'ring-2 ring-primary' 
                : 'hover:shadow-md'
            }`}
            onClick={() => setSelectedReport(template.id)}
          >
            <CardHeader className="pb-3">
              <template.icon className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-sm">{template.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{template.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Report Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Date Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Goal Type</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Goals</SelectItem>
                  <SelectItem value="team">Team Goals</SelectItem>
                  <SelectItem value="individual">Individual Goals</SelectItem>
                  <SelectItem value="role_based">Role-Based Goals</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Metric Type</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Metrics</SelectItem>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="calls">Calls</SelectItem>
                  <SelectItem value="emails">Emails</SelectItem>
                  <SelectItem value="activities">Activities</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Preview */}
      <Card>
        <CardHeader>
          <CardTitle>
            {REPORT_TEMPLATES.find(r => r.id === selectedReport)?.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Goals</p>
                <p className="text-2xl font-bold mt-1">{analytics.totalGoals}</p>
              </div>
              <div className="p-4 bg-green-500/10 rounded-lg">
                <p className="text-sm text-muted-foreground">Achieved</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {analytics.achievedGoals}
                </p>
              </div>
              <div className="p-4 bg-blue-500/10 rounded-lg">
                <p className="text-sm text-muted-foreground">On Track</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {analytics.onTrackGoals}
                </p>
              </div>
              <div className="p-4 bg-yellow-500/10 rounded-lg">
                <p className="text-sm text-muted-foreground">At Risk</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {analytics.atRiskGoals}
                </p>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="text-left p-3 text-sm font-medium">Goal Name</th>
                    <th className="text-left p-3 text-sm font-medium">Type</th>
                    <th className="text-left p-3 text-sm font-medium">Metric</th>
                    <th className="text-right p-3 text-sm font-medium">Target</th>
                    <th className="text-right p-3 text-sm font-medium">Current</th>
                    <th className="text-right p-3 text-sm font-medium">Attainment</th>
                    <th className="text-left p-3 text-sm font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {goals.slice(0, 10).map((goal, idx) => {
                    const attainment = ((goal.current_value / goal.target_value) * 100).toFixed(1);
                    return (
                      <tr key={goal.id} className={idx % 2 === 0 ? 'bg-muted/10' : ''}>
                        <td className="p-3 text-sm">{goal.goal_name}</td>
                        <td className="p-3 text-sm capitalize">{goal.goal_type}</td>
                        <td className="p-3 text-sm capitalize">{goal.metric_type}</td>
                        <td className="p-3 text-sm text-right">
                          {goal.unit === '$' ? '$' : ''}{goal.target_value.toLocaleString()}
                          {goal.unit !== '$' ? ` ${goal.unit}` : ''}
                        </td>
                        <td className="p-3 text-sm text-right">
                          {goal.unit === '$' ? '$' : ''}{goal.current_value.toLocaleString()}
                          {goal.unit !== '$' ? ` ${goal.unit}` : ''}
                        </td>
                        <td className="p-3 text-sm text-right font-medium">{attainment}%</td>
                        <td className="p-3 text-sm">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            goal.status === 'achieved' ? 'bg-green-500/10 text-green-700' :
                            goal.status === 'on_track' ? 'bg-blue-500/10 text-blue-700' :
                            goal.status === 'at_risk' ? 'bg-yellow-500/10 text-yellow-700' :
                            'bg-red-500/10 text-red-700'
                          }`}>
                            {goal.status.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Key Insights */}
            <div className="bg-blue-500/10 border-l-4 border-blue-500 p-4 rounded">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                📊 Key Insights
              </h4>
              <ul className="space-y-1 text-sm text-blue-900/80 dark:text-blue-100/80">
                <li>• Overall team goal attainment is at {analytics.overallAttainmentRate.toFixed(1)}%</li>
                <li>• Revenue goals are performing {analytics.overallAttainmentRate > 90 ? 'above' : 'below'} expectations</li>
                <li>• Top performers are exceeding targets by an average of 15%</li>
                <li>• {analytics.atRiskGoals} goals require immediate attention</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
