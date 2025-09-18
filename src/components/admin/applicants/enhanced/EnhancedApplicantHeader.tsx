import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Applicant } from "@/types/applicant";
import { StudentProfileSection } from "./components/StudentProfileSection";
import { AIConfidencePanel } from "./components/AIConfidencePanel";
import { ActionPanel } from "./components/ActionPanel";
import { QuickStatsPanel } from "./components/QuickStatsPanel";

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

  return (
    <Card className="border-l-4 border-l-primary">
      <CardContent className="p-0">
        {/* Hero Section with Student Info and AI Confidence */}
        <div className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <StudentProfileSection applicant={applicant} getInitials={getInitials} />
            <AIConfidencePanel 
              aiConfidence={aiConfidence}
              programFitScore={programFitScore}
              yieldPropensity={yieldPropensity}
            />
          </div>
        </div>

        <ActionPanel
          aiRecommendation={aiRecommendation}
          processingStatus={processingStatus}
          onApprove={onApprove}
          onReject={onReject}
          onSendEmail={onSendEmail}
          onScheduleInterview={onScheduleInterview}
          saving={saving}
        />

        <QuickStatsPanel />
      </CardContent>
    </Card>
  );
};