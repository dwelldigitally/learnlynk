import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamCapacityService, type TeamCapacity, type AssignmentRecommendation } from "@/services/teamCapacityService";
import { Users, TrendingUp, Clock, Target, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export function TeamCapacityDashboard() {
  const [teams, setTeams] = useState<TeamCapacity[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<AssignmentRecommendation[]>([]);

  useEffect(() => {
    loadTeamCapacity();
  }, []);

  const loadTeamCapacity = async () => {
    try {
      setLoading(true);
      const teamData = await TeamCapacityService.getTeamCapacity();
      setTeams(teamData);
    } catch (error) {
      console.error('Failed to load team capacity:', error);
      toast.error('Failed to load team capacity data');
    } finally {
      setLoading(false);
    }
  };

  const getUtilizationColor = (rate: number) => {
    if (rate >= 90) return "text-red-600";
    if (rate >= 75) return "text-yellow-600";
    if (rate >= 50) return "text-blue-600";
    return "text-green-600";
  };

  const getUtilizationVariant = (rate: number) => {
    if (rate >= 90) return "destructive";
    if (rate >= 75) return "secondary";
    return "default";
  };

  if (loading) {
    return <div className="space-y-4">Loading team capacity data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Team Capacity Management</h2>
          <p className="text-muted-foreground">Monitor and optimize team workload distribution</p>
        </div>
        <Button onClick={loadTeamCapacity} variant="outline">
          Refresh Data
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="teams">Team Details</TabsTrigger>
          <TabsTrigger value="assignments">Smart Assignments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teams.length}</div>
                <p className="text-xs text-muted-foreground">
                  Active teams
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {teams.reduce((sum, team) => sum + team.totalCapacity, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Daily assignments
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Load</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {teams.reduce((sum, team) => sum + team.currentLoad, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Active assignments
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Utilization</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(
                    teams.reduce((sum, team) => sum + team.utilizationRate, 0) / (teams.length || 1)
                  )}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Team utilization
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Team Overview Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {teams.map((team) => (
              <Card key={team.teamId} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{team.teamName}</CardTitle>
                    <Badge variant={getUtilizationVariant(team.utilizationRate)}>
                      {team.utilizationRate.toFixed(1)}% utilized
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    {team.members.length} members • {team.region}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Capacity Usage</span>
                      <span className={getUtilizationColor(team.utilizationRate)}>
                        {team.currentLoad}/{team.totalCapacity}
                      </span>
                    </div>
                    <Progress value={team.utilizationRate} className="h-2" />
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {team.specializations.slice(0, 3).map((spec) => (
                      <Badge key={spec} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                    {team.specializations.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{team.specializations.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium">Available</div>
                      <div className="text-green-600">
                        {team.members.filter(m => m.currentAssignments < m.maxDailyAssignments).length}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">At Capacity</div>
                      <div className="text-red-600">
                        {team.members.filter(m => m.currentAssignments >= m.maxDailyAssignments).length}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="teams" className="space-y-6">
          <div className="grid gap-6">
            {teams.map((team) => (
              <Card key={team.teamId}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{team.teamName}</span>
                    <Badge variant={getUtilizationVariant(team.utilizationRate)}>
                      {team.utilizationRate.toFixed(1)}% utilized
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-4">
                      {team.members.map((member) => (
                        <Card key={member.id} className="border">
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-sm">{member.name}</span>
                                {member.isActive ? (
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                ) : (
                                  <AlertCircle className="h-4 w-4 text-red-600" />
                                )}
                              </div>
                              
                              <div className="text-xs text-muted-foreground">
                                {member.email}
                              </div>

                              <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span>Workload</span>
                                  <span className={
                                    member.currentAssignments >= member.maxDailyAssignments 
                                      ? "text-red-600" 
                                      : "text-green-600"
                                  }>
                                    {member.currentAssignments}/{member.maxDailyAssignments}
                                  </span>
                                </div>
                                <Progress 
                                  value={(member.currentAssignments / member.maxDailyAssignments) * 100} 
                                  className="h-1"
                                />
                              </div>

                              <div className="text-xs">
                                <div>Conv: {member.performance.conversionRate.toFixed(1)}%</div>
                                <div>Resp: {member.performance.averageResponseTime}m</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Smart Assignment Recommendations</CardTitle>
              <p className="text-sm text-muted-foreground">
                AI-powered advisor assignment suggestions based on workload, performance, and specialization
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Smart assignment recommendations will appear here when leads are ready for assignment.
                <br />
                The system considers workload balance, performance metrics, and specialization match.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}