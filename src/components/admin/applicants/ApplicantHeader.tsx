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
import { Link, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
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
    <div className="space-y-3">
      {/* Breadcrumb & Mode Switchers */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Link to="/admin/applicants" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" />
            Applicants
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-foreground font-medium">{applicantName}</span>
        </div>
        
        {/* Mode Switchers */}
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-lg"
            onClick={() => navigate(`/admin/applicants/review/${applicant.id}`)}
          >
            <Target className="h-4 w-4 mr-2" />
            Enter Review Mode
          </Button>
          <Button variant="outline" size="sm" className="rounded-lg">
            <TrendingUp className="h-4 w-4 mr-2" />
            Switch to AI Mode
          </Button>
        </div>
      </div>

      {/* Main Header Card - Compact */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-background via-background to-primary/5 border shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        
        <div className="relative p-6">
          <div className="flex flex-col xl:flex-row gap-6 items-start">
            {/* Left Section - Profile */}
            <div className="flex items-start gap-4 flex-1 min-w-0">
              {/* Avatar */}
              <div className="relative group flex-shrink-0">
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary via-primary to-primary/70 flex items-center justify-center text-primary-foreground shadow-lg ring-2 ring-background group-hover:scale-105 transition-transform duration-300">
                  <span className="text-xl font-bold">{getInitials(applicantName)}</span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-5 w-5 bg-success rounded-full border-2 border-background flex items-center justify-center shadow-sm">
                  <CheckCircle className="h-2.5 w-2.5 text-background" />
                </div>
              </div>

              {/* Name & Info */}
              <div className="flex-1 min-w-0 space-y-3">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight mb-1">{applicantName}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">{applicant.master_records?.email || 'No email'}</span>
                  </div>
                </div>
                
                {/* Status Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
                    <GraduationCap className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-semibold text-primary">{applicant.program}</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/50 border border-border">
                    <Building className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium capitalize">{String(applicant.substage).replace(/_/g, ' ')}</span>
                  </div>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${
                    applicant.payment_status === 'completed' 
                      ? 'bg-success/10 text-success border-success/30' 
                      : 'bg-warning/10 text-warning border-warning/30'
                  }`}>
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span className="text-xs font-semibold capitalize">{applicant.payment_status}</span>
                  </div>
                  {applicant.priority === 'high' && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-destructive/10 text-destructive border border-destructive/30">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span className="text-xs font-semibold">High Priority</span>
                    </div>
                  )}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/50">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium">{daysSinceApplication} days ago</span>
                  </div>
                  {daysToDeadline !== null && (
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${
                      daysToDeadline < 7 ? 'bg-destructive/10 text-destructive border border-destructive/30' : 'bg-muted/50'
                    }`}>
                      <Calendar className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium">
                        {daysToDeadline > 0 ? `${daysToDeadline} days left` : 'Overdue'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Middle Section - Scores */}
            <div className="flex gap-2 flex-shrink-0">
              <div className={`text-center px-4 py-2.5 rounded-xl border ${getScoreBg(programFitScore)} hover:scale-105 transition-transform`}>
                <div className={`text-xl font-bold ${getScoreColor(programFitScore)}`}>{programFitScore}%</div>
                <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mt-0.5">Program Fit</div>
              </div>
              
              <div className={`text-center px-4 py-2.5 rounded-xl border ${getScoreBg(healthScore)} hover:scale-105 transition-transform`}>
                <div className={`text-xl font-bold ${getScoreColor(healthScore)}`}>{healthScore}%</div>
                <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mt-0.5">Health</div>
              </div>
              
              <div className={`text-center px-4 py-2.5 rounded-xl border ${getScoreBg(yieldScore)} hover:scale-105 transition-transform`}>
                <div className={`text-xl font-bold ${getScoreColor(yieldScore)}`}>{yieldScore}%</div>
                <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mt-0.5">Yield</div>
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex flex-col gap-2 flex-shrink-0">
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="rounded-lg font-medium shadow-sm hover:shadow-md transition-all px-6" 
                  onClick={onApprove} 
                  disabled={saving}
                >
                  <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                  Approve
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  className="rounded-lg font-medium shadow-sm hover:shadow-md transition-all" 
                  onClick={onReject} 
                  disabled={saving}
                >
                  Reject
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-lg flex-1"
                  onClick={onSendEmail}
                >
                  <Mail className="h-3.5 w-3.5 mr-1.5" />
                  Email
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-lg flex-1"
                  onClick={onScheduleInterview}
                >
                  <Calendar className="h-3.5 w-3.5 mr-1.5" />
                  Interview
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-lg"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="group relative overflow-hidden rounded-xl bg-card border p-4 hover:shadow-md transition-all duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full transition-all group-hover:scale-110" />
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-xl font-bold">
                <span className="text-primary">{Array.isArray(applicant.documents_approved) ? applicant.documents_approved.length : 0}</span>
                <span className="text-muted-foreground text-sm">/{Array.isArray(applicant.documents_submitted) ? applicant.documents_submitted.length : 0}</span>
              </div>
              <div className="text-xs font-medium text-muted-foreground">Documents</div>
            </div>
          </div>
        </div>
        
        <div className="group relative overflow-hidden rounded-xl bg-card border p-4 hover:shadow-md transition-all duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full transition-all group-hover:scale-110" />
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-xl font-bold text-primary">{daysSinceApplication}</div>
              <div className="text-xs font-medium text-muted-foreground">Days Active</div>
            </div>
          </div>
        </div>
        
        <div className="group relative overflow-hidden rounded-xl bg-card border p-4 hover:shadow-md transition-all duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full transition-all group-hover:scale-110" />
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-xl font-bold text-primary">3</div>
              <div className="text-xs font-medium text-muted-foreground">Messages</div>
            </div>
          </div>
        </div>
        
        <div className="group relative overflow-hidden rounded-xl bg-card border p-4 hover:shadow-md transition-all duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full transition-all group-hover:scale-110" />
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className={`text-xl font-bold ${getHealthColor(healthScore)}`}>{healthScore}%</div>
              <div className="text-xs font-medium text-muted-foreground">Overall</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};