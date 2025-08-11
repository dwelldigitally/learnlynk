import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Target,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  BarChart3
} from "lucide-react";

export function FlashReports() {
  const flashData = {
    todayMetrics: {
      newLeads: 47,
      contactedLeads: 38,
      qualifiedLeads: 12,
      conversions: 3,
      revenue: 45600,
      responseTimeAvg: 2.4
    },
    weeklyTrends: {
      leadGrowth: 12.5,
      conversionImprovement: 8.3,
      revenueGrowth: 15.7,
      teamEfficiency: 94.2
    },
    intakePipelineHealth: {
      totalIntakes: 24,
      activeIntakes: 18,
      enrollmentRate: 78,
      campusPerformance: {
        downtown: { fillRate: 85, enrollments: 145 },
        northCampus: { fillRate: 72, enrollments: 98 },
        southCampus: { fillRate: 91, enrollments: 167 }
      },
      programPerformance: {
        healthCare: { fillRate: 88, enrollments: 234 },
        aviation: { fillRate: 76, enrollments: 89 },
        hospitality: { fillRate: 82, enrollments: 87 }
      }
    },
    complianceMetrics: {
      responseCompliance: 87,
      followUpCompliance: 92,
      slaViolations: 5,
      qualityScore: 8.6
    }
  };

  return (
    <div className="space-y-6">
      {/* Today's Performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="flex items-center p-4">
            <Users className="h-6 w-6 text-blue-600" />
            <div className="ml-3">
              <p className="text-2xl font-bold text-foreground">{flashData.todayMetrics.newLeads}</p>
              <p className="text-xs text-muted-foreground">New Leads Today</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div className="ml-3">
              <p className="text-2xl font-bold text-foreground">{flashData.todayMetrics.contactedLeads}</p>
              <p className="text-xs text-muted-foreground">Contacted</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-4">
            <Target className="h-6 w-6 text-purple-600" />
            <div className="ml-3">
              <p className="text-2xl font-bold text-foreground">{flashData.todayMetrics.qualifiedLeads}</p>
              <p className="text-xs text-muted-foreground">Qualified</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-4">
            <TrendingUp className="h-6 w-6 text-emerald-600" />
            <div className="ml-3">
              <p className="text-2xl font-bold text-foreground">{flashData.todayMetrics.conversions}</p>
              <p className="text-xs text-muted-foreground">Conversions</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-4">
            <DollarSign className="h-6 w-6 text-green-600" />
            <div className="ml-3">
              <p className="text-2xl font-bold text-foreground">
                ${(flashData.todayMetrics.revenue / 1000).toFixed(0)}K
              </p>
              <p className="text-xs text-muted-foreground">Revenue Today</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-4">
            <Clock className="h-6 w-6 text-orange-600" />
            <div className="ml-3">
              <p className="text-2xl font-bold text-foreground">{flashData.todayMetrics.responseTimeAvg}h</p>
              <p className="text-xs text-muted-foreground">Avg Response</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Weekly Performance Trends
          </CardTitle>
          <CardDescription>Performance changes compared to last week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Lead Growth</span>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-bold text-green-600">
                    +{flashData.weeklyTrends.leadGrowth}%
                  </span>
                </div>
              </div>
              <Progress value={flashData.weeklyTrends.leadGrowth} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Conversion Rate</span>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-bold text-green-600">
                    +{flashData.weeklyTrends.conversionImprovement}%
                  </span>
                </div>
              </div>
              <Progress value={flashData.weeklyTrends.conversionImprovement} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Revenue Growth</span>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-bold text-green-600">
                    +{flashData.weeklyTrends.revenueGrowth}%
                  </span>
                </div>
              </div>
              <Progress value={flashData.weeklyTrends.revenueGrowth} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Team Efficiency</span>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-bold text-green-600">
                    {flashData.weeklyTrends.teamEfficiency}%
                  </span>
                </div>
              </div>
              <Progress value={flashData.weeklyTrends.teamEfficiency} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pipeline Health & Compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Intake Pipeline Performance
            </CardTitle>
            <CardDescription>Campus, intake, and program-wise tracking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Intakes</span>
                <span className="text-lg font-bold">{flashData.intakePipelineHealth.totalIntakes}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Active Intakes</span>
                <span className="text-lg font-bold text-green-600">{flashData.intakePipelineHealth.activeIntakes}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Enrollment Rate</span>
                <span className="text-sm font-bold">{flashData.intakePipelineHealth.enrollmentRate}%</span>
              </div>
              <Progress value={flashData.intakePipelineHealth.enrollmentRate} className="h-2" />
            </div>
            
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Campus Performance</h4>
              {Object.entries(flashData.intakePipelineHealth.campusPerformance).map(([campus, data]) => (
                <div key={campus} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="capitalize">{campus.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span>{data.fillRate}% • {data.enrollments} enrolled</span>
                  </div>
                  <Progress value={data.fillRate} className="h-1" />
                </div>
              ))}
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Program Performance</h4>
              {Object.entries(flashData.intakePipelineHealth.programPerformance).map(([program, data]) => (
                <div key={program} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="capitalize">{program.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span>{data.fillRate}% • {data.enrollments} enrolled</span>
                  </div>
                  <Progress value={data.fillRate} className="h-1" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Compliance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Response Compliance</span>
                <span className="text-sm font-bold">{flashData.complianceMetrics.responseCompliance}%</span>
              </div>
              <Progress value={flashData.complianceMetrics.responseCompliance} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Follow-up Compliance</span>
                <span className="text-sm font-bold">{flashData.complianceMetrics.followUpCompliance}%</span>
              </div>
              <Progress value={flashData.complianceMetrics.followUpCompliance} className="h-2" />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">SLA Violations</span>
              <Badge variant="destructive">{flashData.complianceMetrics.slaViolations}</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Quality Score</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-green-600">
                  {flashData.complianceMetrics.qualityScore}/10
                </span>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}