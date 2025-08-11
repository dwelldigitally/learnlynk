import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Applicant } from "@/types/applicant";
import { ArrowLeft, Mail, Phone, MessageSquare, Calendar, FileText, AlertTriangle } from "lucide-react";
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

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/admin/applicants" className="hover:underline">Applicants</Link>
        <span>/</span>
        <span>{applicantName}</span>
      </div>

      {/* Main Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="" alt={applicantName} />
            <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
              {getInitials(applicantName)}
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">{applicantName}</h1>
            
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="font-medium">
                {applicant.program}
              </Badge>
              <Badge 
                variant={applicant.substage === 'approved' ? 'default' : 'secondary'}
                className="capitalize"
              >
                {String(applicant.substage).replace(/_/g, ' ')}
              </Badge>
              <Badge 
                variant={applicant.payment_status === 'completed' ? 'default' : 'outline'}
                className="capitalize"
              >
                Payment: {applicant.payment_status}
              </Badge>
              {applicant.priority === 'high' && (
                <Badge variant="destructive" className="gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  High Priority
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Applied {daysSinceApplication} days ago</span>
              {daysToDeadline !== null && (
                <span className={daysToDeadline < 7 ? "text-destructive font-medium" : ""}>
                  {daysToDeadline > 0 ? `${daysToDeadline} days to deadline` : 'Deadline passed'}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">
              {Array.isArray(applicant.documents_submitted) ? applicant.documents_submitted.length : 0}
            </div>
            <div className="text-sm text-muted-foreground">Documents Submitted</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">
              {Array.isArray(applicant.documents_approved) ? applicant.documents_approved.length : 0}
            </div>
            <div className="text-sm text-muted-foreground">Documents Approved</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className={`text-2xl font-bold ${getHealthColor(healthScore)}`}>
              {healthScore}%
            </div>
            <div className="text-sm text-muted-foreground">Health Score</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">
              {daysSinceApplication}
            </div>
            <div className="text-sm text-muted-foreground">Days in Process</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};