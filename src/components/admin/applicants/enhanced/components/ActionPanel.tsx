import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  CheckCircle, 
  AlertTriangle, 
  Mail, 
  Calendar,
  Eye
} from "lucide-react";

interface ActionPanelProps {
  aiRecommendation: string;
  processingStatus: string;
  onApprove: () => void;
  onReject: () => void;
  onSendEmail: () => void;
  onScheduleInterview: () => void;
  saving?: boolean;
}

export const ActionPanel: React.FC<ActionPanelProps> = ({
  aiRecommendation,
  processingStatus,
  onApprove,
  onReject,
  onSendEmail,
  onScheduleInterview,
  saving = false
}) => {
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
    <div className="p-6 border-t bg-muted/20">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* AI Recommendation */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="h-5 w-5 text-yellow-500" />
            <span className="font-semibold">AI Recommendation</span>
          </div>
          <div className="space-y-2">
            <Badge 
              variant="outline" 
              className={`${getRecommendationColor(aiRecommendation)} border-current text-sm px-3 py-1`}
            >
              {getRecommendationIcon(aiRecommendation)}
              <span className="ml-2">{aiRecommendation}</span>
            </Badge>
            <p className="text-sm text-muted-foreground">{processingStatus}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            onClick={onApprove}
            disabled={saving}
            className="h-11 px-6 gap-2 bg-success hover:bg-success/90"
          >
            <CheckCircle className="h-4 w-4" />
            Approve
          </Button>
          <Button 
            variant="outline"
            onClick={onReject}
            disabled={saving}
            className="h-11 px-6 gap-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <AlertTriangle className="h-4 w-4" />
            Reject
          </Button>
          <Button 
            variant="outline"
            onClick={onSendEmail}
            disabled={saving}
            className="h-11 px-4 gap-2"
          >
            <Mail className="h-4 w-4" />
            Email
          </Button>
          <Button 
            variant="outline"
            onClick={onScheduleInterview}
            disabled={saving}
            className="h-11 px-4 gap-2"
          >
            <Calendar className="h-4 w-4" />
            Interview
          </Button>
        </div>
      </div>
    </div>
  );
};