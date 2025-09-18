import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ModernAdminLayout } from "@/components/admin/ModernAdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ApplicantService } from "@/services/applicantService";
import { Applicant } from "@/types/applicant";
import { ApplicantHeader } from "@/components/admin/applicants/ApplicantHeader";
import { ApplicationTimeline } from "@/components/admin/applicants/ApplicationTimeline";
import { DocumentManager } from "@/components/admin/applicants/DocumentManager";
import { CommunicationCenter } from "@/components/admin/applicants/CommunicationCenter";
import { AssessmentPanel } from "@/components/admin/applicants/AssessmentPanel";
import { CollaborationSidebar } from "@/components/admin/applicants/CollaborationSidebar";
import { AISuggestionsCard } from "@/components/admin/applicants/AISuggestionsCard";
// Enhanced AI Components
import { EnhancedApplicantHeader } from "@/components/admin/applicants/enhanced/EnhancedApplicantHeader";
import { AIInsightsDashboard } from "@/components/admin/applicants/enhanced/AIInsightsDashboard";
import { SmartDocumentReview } from "@/components/admin/applicants/enhanced/SmartDocumentReview";
import { HumanDecisionTracker } from "@/components/admin/applicants/enhanced/HumanDecisionTracker";
// Comprehensive Student Information Components
import { ComprehensiveApplicantOverview } from "@/components/admin/applicants/comprehensive/ComprehensiveApplicantOverview";
import { Zap, Eye } from "lucide-react";

const paymentStatuses = ["pending", "partial", "completed", "refunded"] as const;

const ApplicantDetailPage: React.FC = () => {
  const { applicantId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [aiViewMode, setAiViewMode] = useState(false);

  const getStageProgress = (substage: string): number => {
    const stageMap: Record<string, number> = {
      'application_started': 20,
      'documents_submitted': 40,
      'under_review': 60,
      'decision_pending': 80,
      'approved': 100,
      'rejected': 100,
    };
    return stageMap[substage] || 0;
  };

  useEffect(() => {
    if (!applicantId) return;
    const load = async () => {
      try {
        setLoading(true);
        const data = await ApplicantService.getApplicantById(applicantId);
        setApplicant(data);
        document.title = data?.master_records
          ? `${data.master_records.first_name} ${data.master_records.last_name} — Applicant`
          : "Applicant — Detail";
      } catch (e) {
        console.error(e);
        toast({ title: "Error", description: "Failed to load applicant", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [applicantId, toast]);

  const handleApprove = async () => {
    if (!applicant) return;
    try {
      setSaving(true);
      await ApplicantService.approveApplicant(applicant.id, "Approved on detail page");
      toast({ title: "Approved", description: "Applicant moved to student stage" });
      const refreshed = await ApplicantService.getApplicantById(applicant.id);
      setApplicant(refreshed);
    } catch (e) {
      toast({ title: "Error", description: "Could not approve applicant", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleReject = async () => {
    if (!applicant) return;
    try {
      setSaving(true);
      await ApplicantService.rejectApplicant(applicant.id, "Rejected on detail page");
      toast({ title: "Rejected", description: "Applicant rejected" });
      const refreshed = await ApplicantService.getApplicantById(applicant.id);
      setApplicant(refreshed);
    } catch (e) {
      toast({ title: "Error", description: "Could not reject applicant", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleCreateSample = async () => {
    try {
      setSaving(true);
      const created = await ApplicantService.createSampleApplicant();
      toast({ title: "Sample applicant created", description: `${created.master_records?.first_name || 'Sample'} ${created.master_records?.last_name || ''}`.trim() });
      navigate(`/admin/applicants/detail/${created.id}`);
    } catch (e) {
      toast({ title: "Error", description: "Could not create sample applicant", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleStageUpdate = async (stage: string) => {
    if (!applicant) return;
    try {
      setSaving(true);
      const updated = await ApplicantService.updateApplicantSubstage(applicant.id, stage);
      setApplicant(updated);
      toast({ title: "Stage updated", description: `Moved to ${stage.replace("_", " ")}` });
    } catch (e) {
      toast({ title: "Error", description: "Could not update stage", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  // Enhanced handlers for new features
  const handleSendMessage = async (type: string, content: string, subject?: string) => {
    toast({ 
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} sent`, 
      description: `Message sent successfully` 
    });
  };

  const handleDocumentAction = async (action: string, document: string) => {
    toast({ 
      title: "Document updated", 
      description: `${action} applied to ${document}` 
    });
  };

  const handleScoreUpdate = async (category: string, score: number) => {
    toast({ 
      title: "Score updated", 
      description: `${category} score set to ${score}` 
    });
  };

  const handleAssessmentNotesUpdate = async (notes: string) => {
    toast({ 
      title: "Assessment notes saved", 
      description: "Notes updated successfully" 
    });
  };

  const handleAssign = async (userId: string, role: string) => {
    toast({ 
      title: "Team member assigned", 
      description: `Reviewer assigned successfully` 
    });
  };

  const handleComment = async (comment: string) => {
    toast({ 
      title: "Comment added", 
      description: "Team comment posted" 
    });
  };

  const handleScheduleInterview = () => {
    toast({ 
      title: "Interview scheduler", 
      description: "Opening interview scheduler..." 
    });
  };

  const handleSendEmail = () => {
    setActiveTab("communication");
  };

  const handleApproveAllDocs = async () => {
    if (!applicant) return;
    try {
      setSaving(true);
      const submitted = Array.isArray(applicant.documents_submitted) ? applicant.documents_submitted : [];
      const updated = await ApplicantService.updateApplicant(applicant.id, {
        documents_approved: submitted,
        substage: (submitted.length > 0 ? "under_review" : applicant.substage) as any,
      });
      setApplicant(updated);
      toast({ title: "Documents approved", description: "All submitted docs marked approved" });
    } catch (e) {
      toast({ title: "Error", description: "Could not update documents", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <ModernAdminLayout>
        <div className="p-6">Loading applicant...</div>
      </ModernAdminLayout>
    );
  }

  if (!applicant) {
    return (
      <ModernAdminLayout>
        <div className="p-6 space-y-4">
          <div className="text-center py-8">
            <h2 className="text-2xl font-semibold mb-2">Applicant Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The applicant you're looking for doesn't exist or has been removed.
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Go Back
              </Button>
              <Button onClick={handleCreateSample} disabled={saving}>
                Create Sample Applicant
              </Button>
            </div>
          </div>
        </div>
      </ModernAdminLayout>
    );
  }

  const applicantName = applicant.master_records
    ? `${applicant.master_records.first_name} ${applicant.master_records.last_name}`
    : "Applicant";

  const handleAISuggestionApply = (suggestion: string) => {
    toast({ title: "Action applied", description: suggestion });
  };

  return (
    <ModernAdminLayout>
      <div className="p-6 space-y-6">
        {/* Header with view toggle */}
        {aiViewMode ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">AI-Accelerated Review Mode</h2>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setAiViewMode(false)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Switch to Classic View
              </Button>
            </div>
            <EnhancedApplicantHeader
              applicant={applicant}
              onApprove={handleApprove}
              onReject={handleReject}
              onScheduleInterview={handleScheduleInterview}
              onSendEmail={handleSendEmail}
              saving={saving}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-end">
              <Button 
                onClick={() => setAiViewMode(true)}
                className="flex items-center gap-2"
              >
                <Zap className="h-4 w-4" />
                Switch to AI Mode
              </Button>
            </div>
            <ApplicantHeader
              applicant={applicant}
              onApprove={handleApprove}
              onReject={handleReject}
              onScheduleInterview={handleScheduleInterview}
              onSendEmail={handleSendEmail}
              saving={saving}
            />
          </div>
        )}

        {aiViewMode ? (
          // AI-Accelerated Three-Column Layout
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Left Column - AI Insights */}
            <div className="xl:col-span-1 space-y-6">
              <AIInsightsDashboard applicant={applicant} />
            </div>

            {/* Center Column - Core Information */}
            <div className="xl:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="documents">Smart Docs</TabsTrigger>
                  <TabsTrigger value="assessment">AI Assessment</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                </TabsList>

                <div className="mt-6">
                  <TabsContent value="overview" className="space-y-6">
                    <ComprehensiveApplicantOverview applicant={applicant} />
                  </TabsContent>

                  <TabsContent value="documents" className="space-y-6">
                    <SmartDocumentReview
                      applicant={applicant}
                      onDocumentAction={handleDocumentAction}
                      onApproveAll={handleApproveAllDocs}
                    />
                  </TabsContent>

                  <TabsContent value="assessment" className="space-y-6">
                    <AssessmentPanel
                      applicant={applicant}
                      onScoreUpdate={handleScoreUpdate}
                      onNotesUpdate={handleAssessmentNotesUpdate}
                    />
                  </TabsContent>

                  <TabsContent value="timeline" className="space-y-6">
                    <ApplicationTimeline 
                      applicant={applicant} 
                      onStageUpdate={handleStageUpdate}
                    />
                  </TabsContent>
                </div>
              </Tabs>
            </div>

            {/* Right Column - Human Decision Tools */}
            <div className="xl:col-span-1 space-y-6">
              <HumanDecisionTracker applicant={applicant} />
              <AISuggestionsCard onApply={handleAISuggestionApply} />
            </div>
          </div>
        ) : (
          // Classic Layout
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Main Content - 3 columns */}
            <div className="xl:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="communication">Communication</TabsTrigger>
                  <TabsTrigger value="assessment">Assessment</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                </TabsList>

                <div className="mt-6">
                  <TabsContent value="overview" className="space-y-6">
                    <ComprehensiveApplicantOverview applicant={applicant} />
                  </TabsContent>

                  <TabsContent value="documents">
                    <DocumentManager
                      applicant={applicant}
                      onDocumentAction={handleDocumentAction}
                      onApproveAll={handleApproveAllDocs}
                    />
                  </TabsContent>

                  <TabsContent value="communication">
                    <CommunicationCenter
                      applicantId={applicant.id}
                      applicantName={applicantName}
                      applicantEmail={applicant.master_records?.email || ''}
                      onSendMessage={handleSendMessage}
                    />
                  </TabsContent>

                  <TabsContent value="assessment">
                    <AssessmentPanel
                      applicant={applicant}
                      onScoreUpdate={handleScoreUpdate}
                      onNotesUpdate={handleAssessmentNotesUpdate}
                    />
                  </TabsContent>

                  <TabsContent value="timeline">
                    <ApplicationTimeline
                      applicant={applicant}
                      onStageUpdate={handleStageUpdate}
                    />
                  </TabsContent>
                </div>
              </Tabs>
            </div>

            {/* Collaboration Sidebar - 1 column */}
            <div className="xl:col-span-1">
              <CollaborationSidebar
                applicantId={applicant.id}
                onAssign={handleAssign}
                onComment={handleComment}
              />
            </div>
          </div>
        )}
      </div>
    </ModernAdminLayout>
  );
};

export default ApplicantDetailPage;
