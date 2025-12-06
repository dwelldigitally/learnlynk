import React, { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";

interface IndividualTrackingTabProps {
  goals: TeamGoal[];
  analytics: GoalAnalytics;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
}

export const IndividualTrackingTab: React.FC<IndividualTrackingTabProps> = ({ goals, analytics }) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [memberMetrics, setMemberMetrics] = useState({
    calls: 0,
    emails: 0,
    revenue: 0,
    teamAvgCalls: 0,
    teamAvgEmails: 0,
    teamAvgRevenue: 0,
  });

  // Fetch team members from database
  useEffect(() => {
    const fetchTeamMembers = async () => {
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
        if (members.length > 0 && !selectedMember) {
          setSelectedMember(members[0].id);
        }
      } catch (err) {
        console.error('Error fetching team members:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  // Fetch member-specific metrics
  useEffect(() => {
    const fetchMemberMetrics = async () => {
      if (!selectedMember) return;

      try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

        // Fetch individual metrics
        const [callsResult, emailsResult] = await Promise.all([
          supabase
            .from('lead_communications')
            .select('id')
            .eq('user_id', selectedMember)
            .eq('type', 'phone')
            .gte('created_at', startOfMonth)
            .lte('created_at', endOfMonth),
          supabase
            .from('lead_communications')
            .select('id')
            .eq('user_id', selectedMember)
            .eq('type', 'email')
            .gte('created_at', startOfMonth)
            .lte('created_at', endOfMonth),
        ]);

        // Fetch team averages
        const [teamCallsResult, teamEmailsResult] = await Promise.all([
          supabase
            .from('lead_communications')
            .select('id, user_id')
            .eq('type', 'phone')
            .gte('created_at', startOfMonth)
            .lte('created_at', endOfMonth),
          supabase
            .from('lead_communications')
            .select('id, user_id')
            .eq('type', 'email')
            .gte('created_at', startOfMonth)
            .lte('created_at', endOfMonth),
        ]);

        const memberCalls = callsResult.data?.length || 0;
        const memberEmails = emailsResult.data?.length || 0;
        
        const uniqueUsers = new Set([
          ...(teamCallsResult.data || []).map(r => r.user_id),
          ...(teamEmailsResult.data || []).map(r => r.user_id),
        ]);
        const teamSize = Math.max(uniqueUsers.size, 1);
        
        const teamAvgCalls = (teamCallsResult.data?.length || 0) / teamSize;
        const teamAvgEmails = (teamEmailsResult.data?.length || 0) / teamSize;

        setMemberMetrics({
          calls: memberCalls,
          emails: memberEmails,
          revenue: 0, // Would need individual revenue tracking
          teamAvgCalls,
          teamAvgEmails,
          teamAvgRevenue: 0,
        });
      } catch (err) {
        console.error('Error fetching member metrics:', err);
      }
    };

    fetchMemberMetrics();
  }, [selectedMember]);

  const member = teamMembers.find(m => m.id === selectedMember);
  const individualGoals = goals.filter(g => 
    g.goal_type === 'individual' && g.assignee_ids?.includes(selectedMember)
  );

  const initials = member?.name.split(' ').map(n => n[0]).join('') || '?';

  // Calculate attainment from goals
  const achievedGoals = individualGoals.filter(g => g.status === 'achieved').length;
  const attainmentRate = individualGoals.length > 0 
    ? Math.round((achievedGoals / individualGoals.length) * 100)
    : 0;

  // Calculate comparison percentages
  const callsComparison = memberMetrics.teamAvgCalls > 0 
    ? Math.round(((memberMetrics.calls - memberMetrics.teamAvgCalls) / memberMetrics.teamAvgCalls) * 100)
    : 0;
  const emailsComparison = memberMetrics.teamAvgEmails > 0 
    ? Math.round(((memberMetrics.emails - memberMetrics.teamAvgEmails) / memberMetrics.teamAvgEmails) * 100)
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading team members...</p>
      </div>
    );
  }

  if (teamMembers.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Individual Performance Tracking</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor individual team member goal progress
          </p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No team members found. Invite team members to track individual performance.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <SelectValue placeholder="Select team member" />
          </SelectTrigger>
          <SelectContent>
            {teamMembers.map(m => (
              <SelectItem key={m.id} value={m.id}>
                {m.name} - {m.role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Individual Profile Card */}
      {member && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-2xl font-bold">{member.name}</h3>
                <p className="text-muted-foreground capitalize">{member.role?.replace('_', ' ')}</p>
                <div className="mt-4 grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Overall Attainment</p>
                    <p className={`text-2xl font-bold ${attainmentRate >= 80 ? 'text-green-600' : attainmentRate >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {attainmentRate}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Goals</p>
                    <p className="text-2xl font-bold">{individualGoals.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Achieved</p>
                    <p className="text-2xl font-bold text-green-600">
                      {achievedGoals}
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
      )}

      {/* Performance Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Comparison to Team Average (This Month)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Call Volume ({memberMetrics.calls} calls)</span>
                <span className={`font-medium ${callsComparison >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {callsComparison >= 0 ? '+' : ''}{callsComparison}% vs avg
                </span>
              </div>
              <Progress 
                value={Math.min(100, Math.max(0, 50 + callsComparison))} 
                className={`[&>div]:${callsComparison >= 0 ? 'bg-green-500' : 'bg-red-500'}`} 
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Email Activity ({memberMetrics.emails} emails)</span>
                <span className={`font-medium ${emailsComparison >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {emailsComparison >= 0 ? '+' : ''}{emailsComparison}% vs avg
                </span>
              </div>
              <Progress 
                value={Math.min(100, Math.max(0, 50 + emailsComparison))} 
                className={`[&>div]:${emailsComparison >= 0 ? 'bg-green-500' : 'bg-red-500'}`} 
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Goal Progress Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {individualGoals.slice(0, 3).map(goal => {
              const progress = goal.target_value > 0 
                ? Math.round((goal.current_value / goal.target_value) * 100)
                : 0;
              return (
                <div key={goal.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="truncate max-w-[200px]">{goal.goal_name}</span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <Progress 
                    value={Math.min(100, progress)} 
                    className={`[&>div]:${
                      goal.status === 'achieved' ? 'bg-green-500' : 
                      goal.status === 'on_track' ? 'bg-blue-500' : 
                      goal.status === 'at_risk' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} 
                  />
                </div>
              );
            })}
            {individualGoals.length === 0 && (
              <p className="text-sm text-muted-foreground">No individual goals assigned</p>
            )}
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
              <p className="text-sm text-muted-foreground mt-1">
                Create a goal and select this member as an assignee
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Coaching Insights - Only show if there are goals */}
      {individualGoals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Coaching Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-green-600 mb-2">✓ Strengths</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                {achievedGoals > 0 && <li>Has achieved {achievedGoals} goal(s) this period</li>}
                {callsComparison > 0 && <li>Outperforming team average on call volume</li>}
                {emailsComparison > 0 && <li>Strong email activity compared to team</li>}
                {achievedGoals === 0 && callsComparison <= 0 && emailsComparison <= 0 && (
                  <li>Actively working on assigned goals</li>
                )}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-yellow-600 mb-2">→ Areas for Improvement</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                {individualGoals.filter(g => g.status === 'at_risk').length > 0 && (
                  <li>{individualGoals.filter(g => g.status === 'at_risk').length} goal(s) at risk - needs attention</li>
                )}
                {callsComparison < 0 && <li>Call volume below team average</li>}
                {emailsComparison < 0 && <li>Email activity could be increased</li>}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-600 mb-2">💡 Recommended Actions</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                {individualGoals.filter(g => g.status === 'at_risk').length > 0 && (
                  <li>Focus on at-risk goals to get back on track</li>
                )}
                <li>Review goal progress with manager weekly</li>
                <li>Set daily micro-targets for consistent progress</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
