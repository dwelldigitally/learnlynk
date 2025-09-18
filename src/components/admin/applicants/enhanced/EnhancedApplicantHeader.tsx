import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Applicant } from "@/types/applicant";
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Zap, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Eye,
  Mail,
  Calendar,
  User
} from "lucide-react";

interface EnhancedApplicantHeaderProps {
  applicant: Applicant;
  onApprove: () => void;
  onReject: () => void;
  onScheduleInterview: () => void;
  onSendEmail: () => void;
  saving?: boolean;
}

export const EnhancedApplicantHeader: React.FC<EnhancedApplicantHeaderProps> = ({
  applicant,
  onApprove,
  onReject,
  onScheduleInterview,
  onSendEmail,
  saving = false
}) => {
  // Mock AI scores - in real app would come from props
  const aiConfidence = 88;
  const programFitScore = 85;
  const yieldPropensity = 78;
  const aiRecommendation = "Recommend Approve";
  const processingStatus = "AI Analysis Complete";

  const getInitials = (applicant: Applicant) => {
    if (applicant.master_records) {
      const firstName = applicant.master_records.first_name || '';
      const lastName = applicant.master_records.last_name || '';
      return (firstName[0] || '') + (lastName[0] || '');
    }
    return 'A';
  };

  const getRecommendationColor = (recommendation: string) => {
    if (recommendation.includes("Approve")) return "text-success";
    if (recommendation.includes("Review")) return "text-warning";
    return "text-destructive";
  };

  const getRecommendationIcon = (recommendation: string) => {
    if (recommendation.includes("Approve")) return <CheckCircle className="h-4 w-4" />;
    if (recommendation.includes("Review")) return <Eye className="h-4 w-4" />;
    return <AlertTriangle className="h-4 w-4" />;
  };

  return (
    <Card className="border-l-4 border-l-primary">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left: Student Info */}
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
              {getInitials(applicant)}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">
                {applicant.master_records 
                  ? `${applicant.master_records.first_name} ${applicant.master_records.last_name}`
                  : 'Applicant'
                }
              </h1>
              <p className="text-muted-foreground text-sm">{applicant.master_records?.email || 'No email'}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">{applicant.program}</Badge>
                <Badge variant={applicant.payment_status === 'completed' ? 'default' : 'secondary'}>
                  {applicant.payment_status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Center: AI Confidence & Scores */}
          <div className="text-center space-y-4">
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Brain className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">AI Confidence</span>
              </div>
              <div className="text-4xl font-bold text-primary mb-2">{aiConfidence}%</div>
              <Progress value={aiConfidence} className="h-3 w-full max-w-xs mx-auto" />
            </div>

            <div className="grid grid-cols-2 gap-6 text-center">
              <div>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-medium text-muted-foreground">Program Fit</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">{programFitScore}%</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <span className="text-xs font-medium text-muted-foreground">Yield Propensity</span>
                </div>
                <div className="text-2xl font-bold text-purple-600">{yieldPropensity}%</div>
              </div>
            </div>
          </div>

          {/* Right: AI Recommendation & Actions */}
          <div className="space-y-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium text-muted-foreground">AI Recommendation</span>
              </div>
              <Badge 
                variant="outline" 
                className={`${getRecommendationColor(aiRecommendation)} border-current mb-1`}
              >
                {getRecommendationIcon(aiRecommendation)}
                <span className="ml-1">{aiRecommendation}</span>
              </Badge>
              <div className="text-xs text-muted-foreground">{processingStatus}</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button 
                size="sm" 
                onClick={onApprove}
                disabled={saving}
                className="h-12 flex-col gap-1"
              >
                <CheckCircle className="h-4 w-4" />
                <span className="text-xs">Approve</span>
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={onReject}
                disabled={saving}
                className="h-12 flex-col gap-1"
              >
                <AlertTriangle className="h-4 w-4" />
                <span className="text-xs">Reject</span>
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={onSendEmail}
                disabled={saving}
                className="h-12 flex-col gap-1"
              >
                <Mail className="h-4 w-4" />
                <span className="text-xs">Email</span>
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={onScheduleInterview}
                disabled={saving}
                className="h-12 flex-col gap-1"
              >
                <Calendar className="h-4 w-4" />
                <span className="text-xs">Interview</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom: Quick Stats */}
        <div className="grid grid-cols-4 gap-6 mt-6 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">4/5</div>
            <div className="text-xs text-muted-foreground">Docs Approved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">23</div>
            <div className="text-xs text-muted-foreground">Days in Process</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">12</div>
            <div className="text-xs text-muted-foreground">AI Interactions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">89%</div>
            <div className="text-xs text-muted-foreground">Success Score</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};