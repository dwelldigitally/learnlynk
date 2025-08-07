import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Target, 
  TrendingUp, 
  TrendingDown, 
  Award,
  Clock,
  CheckCircle,
  DollarSign,
  Users,
  Phone,
  Mail,
  Calendar,
  Star
} from "lucide-react";

export function TeamPerformance() {
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  const teamData = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "/avatars/sarah.jpg",
      role: "Senior Admission Advisor",
      performance: {
        leadsAssigned: 45,
        leadsContacted: 42,
        conversions: 8,
        revenue: 120000,
        responseTime: 1.2,
        goalProgress: 89,
        rank: 1
      },
      goals: {
        monthly: { conversions: 12, revenue: 150000 },
        weekly: { contacts: 50, responses: 48 }
      },
      metrics: {
        conversionRate: 17.8,
        avgDealSize: 15000,
        qualityScore: 9.2,
        satisfactionScore: 4.8
      }
    },
    {
      id: 2,
      name: "Michael Chen",
      avatar: "/avatars/michael.jpg",
      role: "Admission Advisor",
      performance: {
        leadsAssigned: 38,
        leadsContacted: 35,
        conversions: 6,
        revenue: 90000,
        responseTime: 2.1,
        goalProgress: 75,
        rank: 2
      },
      goals: {
        monthly: { conversions: 10, revenue: 125000 },
        weekly: { contacts: 40, responses: 38 }
      },
      metrics: {
        conversionRate: 15.8,
        avgDealSize: 15000,
        qualityScore: 8.7,
        satisfactionScore: 4.6
      }
    },
    {
      id: 3,
      name: "Emma Williams",
      avatar: "/avatars/emma.jpg",
      role: "Junior Admission Advisor",
      performance: {
        leadsAssigned: 32,
        leadsContacted: 28,
        conversions: 4,
        revenue: 60000,
        responseTime: 3.2,
        goalProgress: 67,
        rank: 3
      },
      goals: {
        monthly: { conversions: 8, revenue: 100000 },
        weekly: { contacts: 35, responses: 32 }
      },
      metrics: {
        conversionRate: 12.5,
        avgDealSize: 15000,
        qualityScore: 8.1,
        satisfactionScore: 4.4
      }
    }
  ];

  const teamSummary = {
    totalRevenue: teamData.reduce((sum, member) => sum + member.performance.revenue, 0),
    totalConversions: teamData.reduce((sum, member) => sum + member.performance.conversions, 0),
    avgConversionRate: teamData.reduce((sum, member) => sum + member.metrics.conversionRate, 0) / teamData.length,
    avgResponseTime: teamData.reduce((sum, member) => sum + member.performance.responseTime, 0) / teamData.length,
    teamUtilization: 78,
    goalAttainment: teamData.reduce((sum, member) => sum + member.performance.goalProgress, 0) / teamData.length
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1: return <Badge className="bg-gold-100 text-gold-800 border-gold-200">🥇 #1</Badge>;
      case 2: return <Badge className="bg-silver-100 text-silver-800 border-silver-200">🥈 #2</Badge>;
      case 3: return <Badge className="bg-bronze-100 text-bronze-800 border-bronze-200">🥉 #3</Badge>;
      default: return <Badge variant="outline">#{rank}</Badge>;
    }
  };

  const getPerformanceColor = (progress: number) => {
    if (progress >= 90) return "text-green-600";
    if (progress >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Team Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="flex items-center p-4">
            <DollarSign className="h-6 w-6 text-green-600" />
            <div className="ml-3">
              <p className="text-lg font-bold text-foreground">
                ${(teamSummary.totalRevenue / 1000).toFixed(0)}K
              </p>
              <p className="text-xs text-muted-foreground">Team Revenue</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-4">
            <Target className="h-6 w-6 text-blue-600" />
            <div className="ml-3">
              <p className="text-lg font-bold text-foreground">{teamSummary.totalConversions}</p>
              <p className="text-xs text-muted-foreground">Conversions</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-4">
            <TrendingUp className="h-6 w-6 text-purple-600" />
            <div className="ml-3">
              <p className="text-lg font-bold text-foreground">{teamSummary.avgConversionRate.toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground">Avg Conv. Rate</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-4">
            <Clock className="h-6 w-6 text-orange-600" />
            <div className="ml-3">
              <p className="text-lg font-bold text-foreground">{teamSummary.avgResponseTime.toFixed(1)}h</p>
              <p className="text-xs text-muted-foreground">Avg Response</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-4">
            <Users className="h-6 w-6 text-teal-600" />
            <div className="ml-3">
              <p className="text-lg font-bold text-foreground">{teamSummary.teamUtilization}%</p>
              <p className="text-xs text-muted-foreground">Utilization</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-4">
            <Award className="h-6 w-6 text-indigo-600" />
            <div className="ml-3">
              <p className="text-lg font-bold text-foreground">{teamSummary.goalAttainment.toFixed(0)}%</p>
              <p className="text-xs text-muted-foreground">Goal Progress</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Individual Performance Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Individual Performance</h3>
          <div className="flex gap-2">
            <Button 
              variant={selectedPeriod === "week" ? "default" : "outline"} 
              size="sm"
              onClick={() => setSelectedPeriod("week")}
            >
              This Week
            </Button>
            <Button 
              variant={selectedPeriod === "month" ? "default" : "outline"} 
              size="sm"
              onClick={() => setSelectedPeriod("month")}
            >
              This Month
            </Button>
          </div>
        </div>

        {teamData.map((member) => (
          <Card key={member.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground">{member.name}</h4>
                      {getRankBadge(member.performance.rank)}
                    </div>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">{member.metrics.satisfactionScore}/5.0</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Customer Rating</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Conversions</span>
                    <span className="font-semibold">{member.performance.conversions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Conv. Rate</span>
                    <span className="font-semibold text-green-600">{member.metrics.conversionRate}%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Revenue</span>
                    <span className="font-semibold">${(member.performance.revenue / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Avg Deal</span>
                    <span className="font-semibold">${(member.metrics.avgDealSize / 1000).toFixed(0)}K</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Contacted</span>
                    <span className="font-semibold">{member.performance.leadsContacted}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Response Time</span>
                    <span className="font-semibold">{member.performance.responseTime}h</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Quality Score</span>
                    <span className="font-semibold">{member.metrics.qualityScore}/10</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Goal Progress</span>
                      <span className={`text-xs font-semibold ${getPerformanceColor(member.performance.goalProgress)}`}>
                        {member.performance.goalProgress}%
                      </span>
                    </div>
                    <Progress value={member.performance.goalProgress} className="h-2" />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline">
                  <Phone className="h-3 w-3 mr-1" />
                  Call
                </Button>
                <Button size="sm" variant="outline">
                  <Mail className="h-3 w-3 mr-1" />
                  Email
                </Button>
                <Button size="sm" variant="outline">
                  <Calendar className="h-3 w-3 mr-1" />
                  Schedule 1:1
                </Button>
                <Button size="sm" variant="outline">
                  <Target className="h-3 w-3 mr-1" />
                  Adjust Goals
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}