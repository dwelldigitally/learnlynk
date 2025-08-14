import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Bot, 
  FileCheck, 
  Activity, 
  TrendingUp, 
  Clock, 
  Users,
  FileText,
  CheckCircle,
  AlertTriangle,
  Settings,
  RefreshCw,
  Calendar,
  BarChart3,
  Brain,
  Shield,
  Search
} from "lucide-react";
import { useRegistrarAIAgent } from "@/hooks/useRegistrarAIAgent";
import { useNavigate } from "react-router-dom";

export function RegistrarIntelligence() {
  const navigate = useNavigate();
  const {
    activeAgent,
    performanceMetrics,
    isLoading
  } = useRegistrarAIAgent();

  if (isLoading) {
    return (
      <div className="p-6 pt-8 w-full max-w-none space-y-8">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  const recentActivities = [
    {
      id: 1,
      type: "document_processed",
      title: "Transcript verified for Sarah Johnson",
      description: "Engineering program eligibility confirmed",
      timestamp: "2 minutes ago",
      icon: FileCheck,
      status: "success"
    },
    {
      id: 2,
      type: "application_reviewed",
      title: "Application scored: Michael Chen",
      description: "Score: 87/100 - Auto-approved for Nursing program",
      timestamp: "5 minutes ago",
      icon: CheckCircle,
      status: "success"
    },
    {
      id: 3,
      type: "compliance_check",
      title: "FERPA compliance verified",
      description: "All document access logs updated",
      timestamp: "12 minutes ago",
      icon: Shield,
      status: "info"
    },
    {
      id: 4,
      type: "escalation_required",
      title: "Manual review needed: Emma Wilson",
      description: "Missing prerequisite documentation",
      timestamp: "18 minutes ago",
      icon: AlertTriangle,
      status: "warning"
    }
  ];

  return (
    <div className="p-6 pt-8 w-full max-w-none space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-6">
          <div className={`relative p-4 rounded-2xl ${activeAgent?.is_active ? 'bg-primary/10' : 'bg-muted'}`}>
            <Bot className={`h-12 w-12 ${activeAgent?.is_active ? 'text-primary' : 'text-muted-foreground'}`} />
            {activeAgent?.is_active && (
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-background" />
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{activeAgent?.name || "No Active Registrar Agent"}</h1>
              <Badge variant={activeAgent?.is_active ? "default" : "secondary"}>
                {activeAgent?.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground">
              {activeAgent?.description || "No registrar agent is currently active"}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate('/admin/registrar/ai-features')}>
          <Settings className="h-4 w-4 mr-2" />
          Configure Agent
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Applications</p>
                <p className="text-2xl font-bold">{performanceMetrics?.active_leads_count || 24}</p>
                <p className="text-xs text-muted-foreground">Processing</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Processing Efficiency</p>
                <p className="text-2xl font-bold">{performanceMetrics?.success_rate || 92}%</p>
                <p className="text-xs text-green-600">+5% from last week</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Process Time</p>
                <p className="text-2xl font-bold">2.4h</p>
                <p className="text-xs text-blue-600">Target: 4h</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Manual Reviews</p>
                <p className="text-2xl font-bold">{performanceMetrics?.handoffs_count || 3}</p>
                <p className="text-xs text-orange-600">Pending</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Users className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent AI Activity
            </CardTitle>
            <CardDescription>
              Latest actions performed by the registrar AI agent
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border">
                <div className={`p-2 rounded-lg ${
                  activity.status === 'success' ? 'bg-green-100' :
                  activity.status === 'warning' ? 'bg-orange-100' :
                  'bg-blue-100'
                }`}>
                  <activity.icon className={`h-4 w-4 ${
                    activity.status === 'success' ? 'text-green-600' :
                    activity.status === 'warning' ? 'text-orange-600' :
                    'text-blue-600'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full">
              View All Activity
            </Button>
          </CardContent>
        </Card>

        {/* Performance Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance Analytics
            </CardTitle>
            <CardDescription>
              AI processing effectiveness over time
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Document Processing</span>
                <span className="text-sm text-muted-foreground">98.5%</span>
              </div>
              <Progress value={98.5} className="h-2" />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Eligibility Assessment</span>
                <span className="text-sm text-muted-foreground">94.2%</span>
              </div>
              <Progress value={94.2} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Compliance Monitoring</span>
                <span className="text-sm text-muted-foreground">99.8%</span>
              </div>
              <Progress value={99.8} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Processing Speed</span>
                <span className="text-sm text-muted-foreground">89.1%</span>
              </div>
              <Progress value={89.1} className="h-2" />
            </div>

            <Button variant="outline" size="sm" className="w-full">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Detailed Analytics
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Configuration Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Current Configuration Summary
          </CardTitle>
          <CardDescription>
            Key settings configured during agent setup
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeAgent ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Processing Style</h4>
                <Badge variant="outline">
                  {activeAgent.configuration?.processing_style || 'Efficient'}
                </Badge>
                <p className="text-xs text-muted-foreground">
                  Optimized for speed and accuracy
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Capacity Limits</h4>
                <Badge variant="outline">
                  {activeAgent.configuration?.max_concurrent_applications || 50} applications
                </Badge>
                <p className="text-xs text-muted-foreground">
                  Maximum concurrent processing
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Review Threshold</h4>
                <Badge variant="outline">
                  {activeAgent.configuration?.review_threshold || 85}% confidence
                </Badge>
                <p className="text-xs text-muted-foreground">
                  Auto-approval threshold
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Working Hours</h4>
                <Badge variant="outline">
                  {activeAgent.configuration?.working_hours?.start || '08:00'} - {activeAgent.configuration?.working_hours?.end || '18:00'}
                </Badge>
                <p className="text-xs text-muted-foreground">
                  {activeAgent.configuration?.working_hours?.timezone || 'UTC'}
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Specializations</h4>
                <div className="flex flex-wrap gap-1">
                  {(activeAgent.configuration?.specializations || ['Education', 'Engineering']).map((spec: string) => (
                    <Badge key={spec} variant="secondary" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Compliance Features</h4>
                <div className="flex flex-col gap-1">
                  <Badge variant="outline" className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    FERPA Compliant
                  </Badge>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No active registrar agent configured</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}