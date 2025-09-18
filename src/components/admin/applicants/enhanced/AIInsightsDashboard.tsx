import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Applicant } from "@/types/applicant";
import { 
  Brain, 
  Target, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Zap,
  Eye,
  Clock,
  Users,
  DollarSign,
  FileCheck,
  Lightbulb
} from "lucide-react";

interface AIInsightsDashboardProps {
  applicant: Applicant;
}

export const AIInsightsDashboard: React.FC<AIInsightsDashboardProps> = ({ applicant }) => {
  // Mock data - would come from AI service in real app
  const insights = [
    {
      type: "strength",
      title: "Exceptional Academic Record",
      description: "GPA in top 10% with strong STEM background",
      confidence: 95,
      impact: "high"
    },
    {
      type: "opportunity", 
      title: "Fast-Track for Interview",
      description: "Profile suggests high interview success rate",
      confidence: 88,
      impact: "medium"
    },
    {
      type: "concern",
      title: "Payment Delay Risk",
      description: "Similar profiles show 23% payment delay rate",
      confidence: 76,
      impact: "low"
    }
  ];

  const predictiveMetrics = [
    {
      label: "Enrollment Probability",
      value: 82,
      icon: Target,
      color: "text-blue-600"
    },
    {
      label: "Interview Success Rate",
      value: 91,
      icon: Users,
      color: "text-green-600"
    },
    {
      label: "Program Completion",
      value: 88,
      icon: CheckCircle,
      color: "text-purple-600"
    },
    {
      label: "Payment Reliability",
      value: 78,
      icon: DollarSign,
      color: "text-orange-600"
    }
  ];

  const nextBestActions = [
    {
      action: "Schedule Interview",
      urgency: "high",
      timeframe: "Within 48 hours",
      reason: "High conversion window closing"
    },
    {
      action: "Send Program Details",
      urgency: "medium", 
      timeframe: "Next 7 days",
      reason: "Engagement optimization"
    },
    {
      action: "Financial Aid Consultation",
      urgency: "low",
      timeframe: "Next 2 weeks",
      reason: "Risk mitigation"
    }
  ];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "strength": return <CheckCircle className="h-4 w-4 text-success" />;
      case "concern": return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "opportunity": return <TrendingUp className="h-4 w-4 text-blue-600" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "text-destructive";
      case "medium": return "text-warning";
      case "low": return "text-muted-foreground";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Processing Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Analysis Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div className="flex-1">
              <div className="font-medium">Analysis Complete</div>
              <div className="text-sm text-muted-foreground">
                Last updated 2 minutes ago • Confidence: 88%
              </div>
            </div>
            <Button size="sm" variant="outline">
              <Zap className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Predictive Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Predictive Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {predictiveMetrics.map((metric, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <metric.icon className={`h-4 w-4 ${metric.color}`} />
                  <span className="font-medium">{metric.label}</span>
                </div>
                <span className={`font-bold ${metric.color}`}>{metric.value}%</span>
              </div>
              <Progress value={metric.value} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.map((insight, index) => (
            <Card key={index} className="border-l-4 border-l-primary/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <h4 className="font-medium">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {insight.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Confidence:</span>
                        <Progress value={insight.confidence} className="h-1 w-16" />
                        <span className="text-xs text-muted-foreground">{insight.confidence}%</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {insight.impact} impact
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Next Best Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Recommended Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {nextBestActions.map((action, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{action.action}</h4>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getUrgencyColor(action.urgency)}`}
                  >
                    {action.urgency} priority
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {action.reason} • {action.timeframe}
                </div>
              </div>
              <Button size="sm" variant="outline">
                Execute
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-success">Low</div>
              <div className="text-sm text-muted-foreground">Dropout Risk</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">Medium</div>
              <div className="text-sm text-muted-foreground">Payment Risk</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">Low</div>
              <div className="text-sm text-muted-foreground">Compliance Risk</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};