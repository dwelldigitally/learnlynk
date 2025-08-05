import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamCapacityService, type TeamCapacity, type AssignmentRecommendation } from "@/services/teamCapacityService";
import { SmartAssignmentService, type AssignmentRecommendation as SmartAssignmentRecommendation } from "@/services/smartAssignmentService";
import { Users, TrendingUp, Clock, Target, AlertCircle, CheckCircle, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export function TeamCapacityDashboard() {
  const [teams, setTeams] = useState<TeamCapacity[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<SmartAssignmentRecommendation[]>([]);

  useEffect(() => {
    loadTeamCapacity();
  }, []);

  const loadTeamCapacity = async () => {
    try {
      setLoading(true);
      const teamData = await TeamCapacityService.getTeamCapacity();
      
      // If no teams exist, use sample data
      if (teamData.length === 0) {
        setTeams(getSampleTeamData());
        toast.info('Using sample team capacity data for demonstration');
      } else {
        setTeams(teamData);
      }
    } catch (error) {
      console.error('Failed to load team capacity:', error);
      // Show sample data if database fails
      setTeams(getSampleTeamData());
      toast.error('Using sample data - database connection issue');
    } finally {
      setLoading(false);
    }
  };

  const getSampleTeamData = (): TeamCapacity[] => {
    return [
      {
        teamId: "team-1",
        teamName: "North America - Business Programs",
        totalCapacity: 25,
        currentLoad: 18,
        utilizationRate: 72,
        members: [
          {
            id: "advisor-1",
            name: "Sarah Johnson",
            email: "sarah.johnson@company.com",
            role: "Senior Advisor",
            department: "Business Programs",
            isActive: true,
            maxDailyAssignments: 8,
            currentAssignments: 6,
            performance: {
              conversionRate: 85,
              averageResponseTime: 45,
              leadScore: 92
            }
          },
          {
            id: "advisor-2", 
            name: "Michael Chen",
            email: "michael.chen@company.com",
            role: "Advisor",
            department: "Business Programs",
            isActive: true,
            maxDailyAssignments: 7,
            currentAssignments: 5,
            performance: {
              conversionRate: 78,
              averageResponseTime: 62,
              leadScore: 88
            }
          },
          {
            id: "advisor-3",
            name: "Emma Davis",
            email: "emma.davis@company.com", 
            role: "Lead Advisor",
            department: "Business Programs",
            isActive: true,
            maxDailyAssignments: 10,
            currentAssignments: 7,
            performance: {
              conversionRate: 91,
              averageResponseTime: 38,
              leadScore: 95
            }
          }
        ],
        specializations: ["MBA", "Business Analytics", "Finance", "Marketing"],
        region: "North America"
      },
      {
        teamId: "team-2", 
        teamName: "Europe - Technology Programs",
        totalCapacity: 20,
        currentLoad: 12,
        utilizationRate: 60,
        members: [
          {
            id: "advisor-4",
            name: "James Wilson",
            email: "james.wilson@company.com",
            role: "Technology Advisor", 
            department: "Technology Programs",
            isActive: true,
            maxDailyAssignments: 6,
            currentAssignments: 4,
            performance: {
              conversionRate: 82,
              averageResponseTime: 55,
              leadScore: 89
            }
          },
          {
            id: "advisor-5",
            name: "Sophie Mueller",
            email: "sophie.mueller@company.com",
            role: "Senior Technology Advisor",
            department: "Technology Programs", 
            isActive: true,
            maxDailyAssignments: 8,
            currentAssignments: 5,
            performance: {
              conversionRate: 88,
              averageResponseTime: 42,
              leadScore: 93
            }
          },
          {
            id: "advisor-6",
            name: "Alex Rodriguez",
            email: "alex.rodriguez@company.com",
            role: "Advisor",
            department: "Technology Programs",
            isActive: false,
            maxDailyAssignments: 6,
            currentAssignments: 3,
            performance: {
              conversionRate: 75,
              averageResponseTime: 68,
              leadScore: 85
            }
          }
        ],
        specializations: ["Computer Science", "Data Science", "AI/ML", "Cybersecurity"],
        region: "Europe"
      },
      {
        teamId: "team-3",
        teamName: "Asia Pacific - Health Sciences", 
        totalCapacity: 15,
        currentLoad: 14,
        utilizationRate: 93,
        members: [
          {
            id: "advisor-7",
            name: "Dr. Kenji Tanaka",
            email: "kenji.tanaka@company.com",
            role: "Health Sciences Advisor",
            department: "Health Sciences",
            isActive: true,
            maxDailyAssignments: 5,
            currentAssignments: 5,
            performance: {
              conversionRate: 94,
              averageResponseTime: 35,
              leadScore: 97
            }
          },
          {
            id: "advisor-8",
            name: "Dr. Priya Sharma",
            email: "priya.sharma@company.com",
            role: "Senior Health Advisor",
            department: "Health Sciences",
            isActive: true,
            maxDailyAssignments: 6,
            currentAssignments: 6,
            performance: {
              conversionRate: 89,
              averageResponseTime: 48,
              leadScore: 91
            }
          },
          {
            id: "advisor-9",
            name: "Dr. Lisa Wang",
            email: "lisa.wang@company.com",
            role: "Health Sciences Advisor",
            department: "Health Sciences", 
            isActive: true,
            maxDailyAssignments: 4,
            currentAssignments: 3,
            performance: {
              conversionRate: 86,
              averageResponseTime: 52,
              leadScore: 90
            }
          }
        ],
        specializations: ["Medicine", "Nursing", "Public Health", "Pharmacy"],
        region: "Asia Pacific"
      }
    ];
  };

  const loadSmartRecommendations = async () => {
    try {
      // Set sample recommendations for demonstration
      setRecommendations([
        {
          advisorId: "advisor-3",
          advisorName: "Emma Davis",
          score: 92,
          reasoning: ["Low workload (70% utilization)", "High conversion rate (91%)", "Program specialization match: MBA, Business Analytics"],
          confidence: 95,
          workloadImpact: "medium" as const,
          estimatedResponseTime: 2.5,
          specializations: ["MBA", "Business Analytics", "Finance"],
          currentLoad: 7,
          maxCapacity: 10,
          availability: "available" as const
        },
        {
          advisorId: "advisor-1", 
          advisorName: "Sarah Johnson",
          score: 87,
          reasoning: ["Moderate workload (75% utilization)", "High conversion rate (85%)", "Program specialization match: MBA"],
          confidence: 90,
          workloadImpact: "medium" as const,
          estimatedResponseTime: 3.2,
          specializations: ["MBA", "Finance", "Marketing"],
          currentLoad: 6,
          maxCapacity: 8,
          availability: "available" as const
        },
        {
          advisorId: "advisor-2",
          advisorName: "Michael Chen", 
          score: 78,
          reasoning: ["Low workload (71% utilization)", "Good conversion rate (78%)", "Program specialization match: Business Analytics"],
          confidence: 85,
          workloadImpact: "low" as const,
          estimatedResponseTime: 4.1,
          specializations: ["Business Analytics", "Finance"],
          currentLoad: 5,
          maxCapacity: 7,
          availability: "available" as const
        }
      ]);
      toast.success('Generated smart assignment recommendations');
    } catch (error) {
      console.error('Failed to load recommendations:', error);
      toast.error('Failed to generate recommendations');
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
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Smart Assignment Recommendations</h3>
              <p className="text-sm text-muted-foreground">
                AI-powered advisor assignment suggestions based on workload, performance, and specialization
              </p>
            </div>
            <Button onClick={loadSmartRecommendations} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Generate Recommendations
            </Button>
          </div>

          {recommendations.length > 0 ? (
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <Card key={rec.advisorId} className="border-l-4 border-l-primary">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-semibold">{rec.advisorName}</span>
                            <Badge variant={rec.availability === 'available' ? 'default' : rec.availability === 'busy' ? 'secondary' : 'destructive'}>
                              {rec.availability}
                            </Badge>
                          </div>
                          <div className="text-2xl font-bold text-primary">{rec.score}/100</div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Workload: {rec.currentLoad}/{rec.maxCapacity}</span>
                          <span>Est. Response: {rec.estimatedResponseTime}h</span>
                          <span>Confidence: {rec.confidence}%</span>
                        </div>

                        <div className="space-y-1">
                          <div className="text-sm font-medium">Specializations:</div>
                          <div className="flex flex-wrap gap-1">
                            {rec.specializations.map((spec) => (
                              <Badge key={spec} variant="outline" className="text-xs">
                                {spec}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="text-sm font-medium">Reasoning:</div>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {rec.reasoning.map((reason, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button size="sm">
                          Assign Lead
                        </Button>
                        <Badge variant={rec.workloadImpact === 'low' ? 'default' : rec.workloadImpact === 'medium' ? 'secondary' : 'destructive'}>
                          {rec.workloadImpact} impact
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Current Workload</span>
                        <span>{rec.currentLoad}/{rec.maxCapacity} assignments</span>
                      </div>
                      <Progress value={(rec.currentLoad / rec.maxCapacity) * 100} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8">
                <div className="text-center space-y-4">
                  <Target className="h-12 w-12 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-semibold">No Recommendations Available</h3>
                    <p className="text-muted-foreground">
                      Click "Generate Recommendations" to see AI-powered assignment suggestions
                      <br />
                      based on advisor workload, performance metrics, and specialization match.
                    </p>
                  </div>
                  <Button onClick={loadSmartRecommendations} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Generate Sample Recommendations
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}