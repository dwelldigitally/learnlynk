import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GoalCard } from "./components/GoalCard";
import { TeamGoal, GoalAnalytics } from "@/types/teamGoals";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface IndividualTrackingTabProps {
  goals: TeamGoal[];
  analytics: GoalAnalytics;
}

const MOCK_TEAM_MEMBERS = [
  { id: 'user-1', name: 'Sarah Johnson', role: 'Senior Advisor', attainment: 95 },
  { id: 'user-2', name: 'Michael Chen', role: 'Advisor', attainment: 87 },
  { id: 'user-3', name: 'Emily Rodriguez', role: 'Advisor', attainment: 92 },
  { id: 'user-4', name: 'James Wilson', role: 'Junior Advisor', attainment: 78 },
  { id: 'user-5', name: 'Lisa Anderson', role: 'Team Lead', attainment: 98 },
];

export const IndividualTrackingTab: React.FC<IndividualTrackingTabProps> = ({ goals }) => {
  const [selectedMember, setSelectedMember] = useState(MOCK_TEAM_MEMBERS[0].id);

  const member = MOCK_TEAM_MEMBERS.find(m => m.id === selectedMember) || MOCK_TEAM_MEMBERS[0];
  const individualGoals = goals.filter(g => 
    g.goal_type === 'individual' && g.assignee_ids?.includes(selectedMember)
  );

  const initials = member.name.split(' ').map(n => n[0]).join('');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Individual Performance Tracking</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor individual team member goal progress
          </p>
        </div>
        <Select value={selectedMember} onValueChange={setSelectedMember}>
          <SelectTrigger className="w-[250px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MOCK_TEAM_MEMBERS.map(m => (
              <SelectItem key={m.id} value={m.id}>
                {m.name} - {m.role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Individual Profile Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-2xl font-bold">{member.name}</h3>
              <p className="text-muted-foreground">{member.role}</p>
              <div className="mt-4 grid grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Overall Attainment</p>
                  <p className="text-2xl font-bold text-green-600">{member.attainment}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Goals</p>
                  <p className="text-2xl font-bold">{individualGoals.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Achieved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {individualGoals.filter(g => g.status === 'achieved').length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">At Risk</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {individualGoals.filter(g => g.status === 'at_risk').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Comparison to Team Average</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Revenue</span>
                <span className="font-medium text-green-600">+15% above avg</span>
              </div>
              <Progress value={75} className="[&>div]:bg-green-500" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Call Volume</span>
                <span className="font-medium text-green-600">+8% above avg</span>
              </div>
              <Progress value={68} className="[&>div]:bg-green-500" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Email Activity</span>
                <span className="font-medium text-red-600">-3% below avg</span>
              </div>
              <Progress value={47} className="[&>div]:bg-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Historical Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>This Week vs Last Week</span>
                <span className="font-medium text-green-600">+12%</span>
              </div>
              <Progress value={88} className="[&>div]:bg-green-500" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>This Month vs Last Month</span>
                <span className="font-medium text-green-600">+7%</span>
              </div>
              <Progress value={82} className="[&>div]:bg-green-500" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>This Quarter vs Last Quarter</span>
                <span className="font-medium text-green-600">+18%</span>
              </div>
              <Progress value={93} className="[&>div]:bg-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Individual Goals */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Individual Goals ({individualGoals.length})
        </h3>
        {individualGoals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {individualGoals.map(goal => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">No individual goals assigned to this team member</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Coaching Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Coaching Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-green-600 mb-2">✓ Strengths</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Consistently exceeds revenue targets</li>
              <li>Strong call conversion rate</li>
              <li>Quick response times to inquiries</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-yellow-600 mb-2">→ Areas for Improvement</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Email follow-up frequency could be improved</li>
              <li>Documentation completion needs attention</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-blue-600 mb-2">💡 Recommended Actions</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Focus on increasing email touch points this week</li>
              <li>Schedule training session on CRM documentation best practices</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
