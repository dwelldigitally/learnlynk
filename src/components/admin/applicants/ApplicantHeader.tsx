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
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-primary";
    return "text-warning";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-success/10 border-success/20";
    if (score >= 60) return "bg-primary/10 border-primary/20";
    return "bg-warning/10 border-warning/20";
  };

  // Mock program fit and yield scores based on available data
  const programFitScore = Math.min(95, healthScore + 15);
  const yieldScore = Math.max(65, healthScore - 10);

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link to="/admin/applicants" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
          <ArrowLeft className="h-3.5 w-3.5" />
          Applicants
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-foreground font-medium">{applicantName}</span>
      </div>

      {/* Main Header Card - Redesigned */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-background via-background to-primary/5 border shadow-xl">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        
        <div className="relative p-8">
          <div className="flex flex-col xl:flex-row gap-8">
            {/* Left Section - Profile */}
            <div className="flex-1 space-y-6">
              {/* Profile Info */}
              <div className="flex items-start gap-5">
                {/* Avatar with online indicator */}
                <div className="relative group">
                  <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/70 flex items-center justify-center text-primary-foreground shadow-lg ring-4 ring-background group-hover:scale-105 transition-transform duration-300">
                    <span className="text-3xl font-bold">{getInitials(applicantName)}</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-7 w-7 bg-success rounded-full border-4 border-background flex items-center justify-center shadow-md">
                    <CheckCircle className="h-3.5 w-3.5 text-background" />
                  </div>
                </div>

                {/* Name & Email */}
                <div className="flex-1 min-w-0">
                  <h1 className="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                    {applicantName}
                  </h1>
                  <div className="flex items-center gap-2 text-muted-foreground mb-4">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm truncate">{applicant.master_records?.email || 'No email'}</span>
                  </div>
                  
                  {/* Status Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 backdrop-blur-sm">
                      <GraduationCap className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold text-primary">{applicant.program}</span>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border backdrop-blur-sm">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium capitalize">{String(applicant.substage).replace(/_/g, ' ')}</span>
                    </div>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-sm ${
                      applicant.payment_status === 'completed' 
                        ? 'bg-success/10 text-success border-success/30' 
                        : 'bg-warning/10 text-warning border-warning/30'
                    }`}>
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-semibold capitalize">{applicant.payment_status}</span>
                    </div>
                    {applicant.priority === 'high' && (
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive border border-destructive/30 backdrop-blur-sm animate-pulse">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm font-semibold">High Priority</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Timeline & Stats Row */}
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-medium">Applied {daysSinceApplication} days ago</span>
                </div>
                {daysToDeadline !== null && (
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    daysToDeadline < 7 ? 'bg-destructive/10 text-destructive' : 'bg-muted/50'
                  }`}>
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">
                      {daysToDeadline > 0 ? `${daysToDeadline} days to deadline` : 'Deadline passed'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Section - Scores & Actions */}
            <div className="xl:w-96 space-y-5">
              {/* Score Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className={`relative overflow-hidden rounded-2xl border p-5 backdrop-blur-sm transition-all hover:scale-105 ${getScoreBg(programFitScore)}`}>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />
                  <Target className={`h-5 w-5 mb-3 ${getScoreColor(programFitScore)}`} />
                  <div className={`text-3xl font-bold mb-1 ${getScoreColor(programFitScore)}`}>{programFitScore}%</div>
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Program Fit</div>
                </div>
                
                <div className={`relative overflow-hidden rounded-2xl border p-5 backdrop-blur-sm transition-all hover:scale-105 ${getScoreBg(healthScore)}`}>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />
                  <CheckCircle className={`h-5 w-5 mb-3 ${getScoreColor(healthScore)}`} />
                  <div className={`text-3xl font-bold mb-1 ${getScoreColor(healthScore)}`}>{healthScore}%</div>
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Health</div>
                </div>
                
                <div className={`relative overflow-hidden rounded-2xl border p-5 backdrop-blur-sm transition-all hover:scale-105 ${getScoreBg(yieldScore)}`}>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />
                  <TrendingUp className={`h-5 w-5 mb-3 ${getScoreColor(yieldScore)}`} />
                  <div className={`text-3xl font-bold mb-1 ${getScoreColor(yieldScore)}`}>{yieldScore}%</div>
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Yield</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Button 
                    size="lg" 
                    className="flex-1 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all" 
                    onClick={onApprove} 
                    disabled={saving}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button 
                    size="lg" 
                    variant="destructive" 
                    className="flex-1 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all" 
                    onClick={onReject} 
                    disabled={saving}
                  >
                    Reject
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant="outline" 
                    size="default" 
                    className="rounded-xl hover:bg-muted/50 transition-all"
                    onClick={onSendEmail}
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="default" 
                    className="rounded-xl hover:bg-muted/50 transition-all"
                    onClick={onScheduleInterview}
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="default" 
                    className="rounded-xl hover:bg-muted/50 transition-all"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid - Redesigned */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="group relative overflow-hidden rounded-2xl bg-card border p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full transition-all group-hover:scale-110" />
          <FileText className="h-5 w-5 text-primary mb-3" />
          <div className="text-3xl font-bold mb-1">
            <span className="text-primary">{Array.isArray(applicant.documents_approved) ? applicant.documents_approved.length : 0}</span>
            <span className="text-muted-foreground">/{Array.isArray(applicant.documents_submitted) ? applicant.documents_submitted.length : 0}</span>
          </div>
          <div className="text-sm font-medium text-muted-foreground">Documents Approved</div>
        </div>
        
        <div className="group relative overflow-hidden rounded-2xl bg-card border p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full transition-all group-hover:scale-110" />
          <Clock className="h-5 w-5 text-primary mb-3" />
          <div className="text-3xl font-bold text-primary mb-1">{daysSinceApplication}</div>
          <div className="text-sm font-medium text-muted-foreground">Days in Process</div>
        </div>
        
        <div className="group relative overflow-hidden rounded-2xl bg-card border p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full transition-all group-hover:scale-110" />
          <MessageSquare className="h-5 w-5 text-primary mb-3" />
          <div className="text-3xl font-bold text-primary mb-1">3</div>
          <div className="text-sm font-medium text-muted-foreground">Communications</div>
        </div>
        
        <div className="group relative overflow-hidden rounded-2xl bg-card border p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full transition-all group-hover:scale-110" />
          <TrendingUp className="h-5 w-5 text-primary mb-3" />
          <div className={`text-3xl font-bold mb-1 ${getHealthColor(healthScore)}`}>{healthScore}%</div>
          <div className="text-sm font-medium text-muted-foreground">Overall Score</div>
        </div>
      </div>
    </div>
  );
};