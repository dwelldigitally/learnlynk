import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Clock, 
  CheckCircle, 
  FileText, 
  TrendingUp,
  Award,
  Target
} from "lucide-react";

export function RegistrarTeamPerformance() {
  // Mock team data
  const teamMembers = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Senior Registrar",
      applicationsProcessed: 23,
      avgProcessingTime: 1.8,
      accuracyRate: 96,
      workloadCapacity: 85,
      documentsReviewed: 45,
      status: "active"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Document Reviewer",
      applicationsProcessed: 18,
      avgProcessingTime: 2.1,
      accuracyRate: 94,
      workloadCapacity: 72,
      documentsReviewed: 38,
      status: "active"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Enrollment Specialist",
      applicationsProcessed: 15,
      avgProcessingTime: 2.4,
      accuracyRate: 98,
      workloadCapacity: 68,
      documentsReviewed: 29,
      status: "break"
    },
    {
      id: 4,
      name: "David Park",
      role: "Compliance Officer",
      applicationsProcessed: 12,
      avgProcessingTime: 3.2,
      accuracyRate: 99,
      workloadCapacity: 45,
      documentsReviewed: 22,
      status: "active"
    }
  ];

  const teamStats = {
    totalApplicationsToday: 68,
    avgTeamProcessingTime: 2.4,
    teamAccuracyRate: 96.8,
    totalDocumentsReviewed: 134,
    activeMembers: 3,
    teamCapacityUtilization: 72
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'break':
        return <Badge className="bg-yellow-100 text-yellow-800">Break</Badge>;
      case 'offline':
        return <Badge className="bg-gray-100 text-gray-800">Offline</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getCapacityColor = (capacity: number) => {
    if (capacity >= 80) return "text-red-600";
    if (capacity >= 60) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <div className="space-y-6">
      {/* Team Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications Today</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamStats.totalApplicationsToday}</div>
            <p className="text-xs text-muted-foreground">
              Team total processed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Processing Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamStats.avgTeamProcessingTime}d</div>
            <p className="text-xs text-muted-foreground">
              Target: 3 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Accuracy</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamStats.teamAccuracyRate}%</div>
            <p className="text-xs text-muted-foreground">
              Target: 95%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamStats.activeMembers}/4</div>
            <p className="text-xs text-muted-foreground">
              Currently working
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Team Capacity Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Team Capacity & Workload
          </CardTitle>
          <CardDescription>
            Current workload distribution and capacity utilization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Team Capacity</span>
              <span className={`text-sm font-bold ${getCapacityColor(teamStats.teamCapacityUtilization)}`}>
                {teamStats.teamCapacityUtilization}%
              </span>
            </div>
            <Progress value={teamStats.teamCapacityUtilization} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Optimal capacity range: 60-80%
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Individual Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Individual Performance
          </CardTitle>
          <CardDescription>
            Detailed performance metrics for each team member
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{member.name}</h4>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(member.status)}
                    <Badge variant="outline" className={getCapacityColor(member.workloadCapacity)}>
                      {member.workloadCapacity}% capacity
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold">{member.applicationsProcessed}</div>
                    <div className="text-xs text-muted-foreground">Applications</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">{member.avgProcessingTime}d</div>
                    <div className="text-xs text-muted-foreground">Avg Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">{member.accuracyRate}%</div>
                    <div className="text-xs text-muted-foreground">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">{member.documentsReviewed}</div>
                    <div className="text-xs text-muted-foreground">Documents</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Workload Capacity</span>
                    <span className={getCapacityColor(member.workloadCapacity)}>
                      {member.workloadCapacity}%
                    </span>
                  </div>
                  <Progress value={member.workloadCapacity} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance Trends
          </CardTitle>
          <CardDescription>
            Week-over-week performance analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">+12%</div>
              <div className="text-sm text-green-700">Applications Processed</div>
              <div className="text-xs text-muted-foreground mt-1">vs last week</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">-0.3d</div>
              <div className="text-sm text-blue-700">Processing Time</div>
              <div className="text-xs text-muted-foreground mt-1">vs last week</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">+2.1%</div>
              <div className="text-sm text-purple-700">Accuracy Rate</div>
              <div className="text-xs text-muted-foreground mt-1">vs last week</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}