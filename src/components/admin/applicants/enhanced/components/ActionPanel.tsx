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

  return null;
};