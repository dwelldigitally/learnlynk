import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Applicant } from "@/types/applicant";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MessageSquare, 
  Calendar, 
  FileText, 
  AlertTriangle,
  GraduationCap,
  Clock,
  Target,
  TrendingUp,
  CheckCircle,
  User,
  Building
} from "lucide-react";
import { Link } from "react-router-dom";

interface ApplicantHeaderProps {
  applicant: Applicant;
  onApprove: () => void;
  onReject: () => void;
  onScheduleInterview: () => void;
  onSendEmail: () => void;
  saving: boolean;
}

export const ApplicantHeader: React.FC<ApplicantHeaderProps> = ({
  applicant,
  onApprove,
  onReject,
  onScheduleInterview,
  onSendEmail,
  saving
}) => {
  const applicantName = applicant.master_records
    ? `${applicant.master_records.first_name} ${applicant.master_records.last_name}`
    : "Applicant";

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getHealthScore = () => {
    let score = 0;
    const weights = {
      documents: 40,
      payment: 30,
      timeline: 20,
      communication: 10
    };

    // Document completeness
    const docsSubmitted = Array.isArray(applicant.documents_submitted) ? applicant.documents_submitted.length : 0;
    const docsApproved = Array.isArray(applicant.documents_approved) ? applicant.documents_approved.length : 0;
    if (docsSubmitted > 0) score += (docsApproved / docsSubmitted) * weights.documents;

    // Payment status
    if (applicant.payment_status === 'completed') score += weights.payment;
    else if (applicant.payment_status === 'partial') score += weights.payment * 0.5;

    // Timeline (days since application)
    const daysSinceApplication = Math.floor((Date.now() - new Date(applicant.created_at).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceApplication <= 7) score += weights.timeline;
    else if (daysSinceApplication <= 14) score += weights.timeline * 0.7;
    else if (daysSinceApplication <= 30) score += weights.timeline * 0.4;

    // Communication (assume good if in progress)
    if (applicant.substage !== 'application_started') score += weights.communication;

    return Math.round(score);
  };

  const healthScore = getHealthScore();
  const getHealthColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const daysSinceApplication = Math.floor((Date.now() - new Date(applicant.created_at).getTime()) / (1000 * 60 * 60 * 24));
  const daysToDeadline = applicant.application_deadline 
    ? Math.floor((new Date(applicant.application_deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-blue-600";
    return "text-orange-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-50 border-emerald-200";
    if (score >= 60) return "bg-blue-50 border-blue-200";
    return "bg-orange-50 border-orange-200";
  };

  // Mock program fit and yield scores based on available data
  const programFitScore = Math.min(95, healthScore + 15);
  const yieldScore = Math.max(65, healthScore - 10);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/admin/applicants" className="hover:underline">Applicants</Link>
        <span>/</span>
        <span>{applicantName}</span>
      </div>

      {/* Main Header Card */}
      <Card className="bg-gradient-to-br from-card to-muted/30 backdrop-blur border-0 shadow-lg">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Student Profile Section */}
            <div className="flex items-start gap-6 flex-1">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-2xl font-bold shadow-lg">
                  {getInitials(applicantName)}
                </div>
                <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-success rounded-full border-2 border-background flex items-center justify-center">
                  <CheckCircle className="h-3 w-3 text-background" />
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">{applicantName}</h1>
                  <p className="text-muted-foreground flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4" />
                    {applicant.master_records?.email || 'No email'}
                  </p>
                </div>
                
                {/* Tags Section */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                    <GraduationCap className="h-4 w-4" />
                    <span className="text-sm font-medium">{applicant.program}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full border border-purple-200">
                    <Building className="h-4 w-4" />
                    <span className="text-sm font-medium capitalize">{String(applicant.substage).replace(/_/g, ' ')}</span>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
                    applicant.payment_status === 'completed' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-orange-50 text-orange-700 border-orange-200'
                  }`}>
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium capitalize">{applicant.payment_status}</span>
                  </div>
                  {applicant.priority === 'high' && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 rounded-full border border-red-200">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm font-medium">High Priority</span>
                    </div>
                  )}
                </div>

                {/* Timeline Info */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Applied {daysSinceApplication} days ago</span>
                  </div>
                  {daysToDeadline !== null && (
                    <span className={daysToDeadline < 7 ? "text-destructive font-medium" : ""}>
                      {daysToDeadline > 0 ? `${daysToDeadline} days to deadline` : 'Deadline passed'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Scores Section */}
            <div className="lg:w-80 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className={`text-center p-4 rounded-xl border ${getScoreBg(programFitScore)}`}>
                  <Target className={`h-5 w-5 mx-auto mb-2 ${getScoreColor(programFitScore)}`} />
                  <div className={`text-2xl font-bold ${getScoreColor(programFitScore)}`}>{programFitScore}%</div>
                  <div className="text-xs text-muted-foreground">Program Fit</div>
                </div>
                <div className={`text-center p-4 rounded-xl border ${getScoreBg(healthScore)}`}>
                  <CheckCircle className={`h-5 w-5 mx-auto mb-2 ${getScoreColor(healthScore)}`} />
                  <div className={`text-2xl font-bold ${getScoreColor(healthScore)}`}>{healthScore}%</div>
                  <div className="text-xs text-muted-foreground">Health Score</div>
                </div>
                <div className={`text-center p-4 rounded-xl border ${getScoreBg(yieldScore)}`}>
                  <TrendingUp className={`h-5 w-5 mx-auto mb-2 ${getScoreColor(yieldScore)}`} />
                  <div className={`text-2xl font-bold ${getScoreColor(yieldScore)}`}>{yieldScore}%</div>
                  <div className="text-xs text-muted-foreground">Yield Rate</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2">
                <Link to="/admin/applicants">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={onSendEmail}>
                  <Mail className="h-4 w-4 mr-1" />
                  Email
                </Button>
                <Button variant="outline" size="sm" onClick={onScheduleInterview}>
                  <Calendar className="h-4 w-4 mr-1" />
                  Interview
                </Button>
                <Button size="sm" onClick={onApprove} disabled={saving}>
                  Approve
                </Button>
                <Button size="sm" variant="destructive" onClick={onReject} disabled={saving}>
                  Reject
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg p-4 text-center hover:shadow-md transition-shadow border">
          <div className="text-2xl font-bold text-primary mb-1">
            {Array.isArray(applicant.documents_submitted) ? applicant.documents_submitted.length : 0}/{Array.isArray(applicant.documents_approved) ? applicant.documents_approved.length : 0}
          </div>
          <div className="text-sm text-muted-foreground">Documents Status</div>
        </div>
        
        <div className="bg-card rounded-lg p-4 text-center hover:shadow-md transition-shadow border">
          <div className="text-2xl font-bold text-blue-600 mb-1">{daysSinceApplication}</div>
          <div className="text-sm text-muted-foreground">Days in Process</div>
        </div>
        
        <div className="bg-card rounded-lg p-4 text-center hover:shadow-md transition-shadow border">
          <div className="text-2xl font-bold text-purple-600 mb-1">3</div>
          <div className="text-sm text-muted-foreground">Communications</div>
        </div>
        
        <div className="bg-card rounded-lg p-4 text-center hover:shadow-md transition-shadow border">
          <div className={`text-2xl font-bold mb-1 ${getHealthColor(healthScore)}`}>{healthScore}%</div>
          <div className="text-sm text-muted-foreground">Overall Score</div>
        </div>
      </div>
    </div>
  );
};