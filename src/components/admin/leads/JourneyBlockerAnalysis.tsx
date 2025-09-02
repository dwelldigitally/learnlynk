import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  Mail, 
  Phone,
  CreditCard,
  GraduationCap,
  Users,
  Calendar,
  Route,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  Target
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface JourneyBlocker {
  id: string;
  type: 'document' | 'communication' | 'payment' | 'task' | 'approval' | 'scheduling';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  details: string[];
  actionRequired: string;
  assignedTo?: string;
  dueDate?: string;
  stage: string;
}

interface JourneyStage {
  id: string;
  name: string;
  status: 'completed' | 'current' | 'blocked' | 'pending';
  blockers: JourneyBlocker[];
  completedAt?: string;
  estimatedDays?: number;
}

interface JourneyBlockerAnalysisProps {
  leadId: string;
  leadData: any;
}

export function JourneyBlockerAnalysis({ leadId, leadData }: JourneyBlockerAnalysisProps) {
  const { toast } = useToast();
  const [stages, setStages] = useState<JourneyStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const analyzeJourneyBlockers = async () => {
    setLoading(true);
    try {
      // For now, use demo data since the table structure is complex
      // In a real implementation, you'd fetch from the correct tables
      const demoDocuments = [
        {
          id: '1',
          document_name: 'High School Transcript',
          document_type: 'transcript',
          status: 'approved',
          upload_date: '2024-01-15',
          comments: 'Verified and approved'
        },
        {
          id: '2', 
          document_name: 'English Test Results',
          document_type: 'language_test',
          status: 'rejected',
          upload_date: '2024-01-18',
          comments: 'Score below minimum requirement. Please retake test.'
        },
        {
          id: '3',
          document_name: 'Statement of Purpose',
          document_type: 'essay',
          status: 'under-review',
          upload_date: '2024-01-20',
          comments: null
        }
      ];

      const demoTasks = [
        {
          id: '1',
          title: 'Complete Application Form',
          status: 'pending',
          created_at: '2024-01-10'
        },
        {
          id: '2',
          title: 'Submit Program Selection',
          status: 'completed',
          created_at: '2024-01-12'
        }
      ];

      const demoCommunications = [
        {
          id: '1',
          type: 'email',
          created_at: '2024-01-21',
          content: 'Initial consultation completed'
        }
      ];

      // Analyze each stage and identify blockers
      const analyzedStages = analyzeStageBlockers(leadData, demoDocuments, demoTasks, demoCommunications);
      setStages(analyzedStages);

    } catch (error) {
      console.error('Error analyzing journey blockers:', error);
      toast({
        title: 'Error',
        description: 'Failed to analyze journey blockers',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const analyzeStageBlockers = (lead: any, documents: any[], tasks: any[], communications: any[]): JourneyStage[] => {
    const stages: JourneyStage[] = [
      {
        id: 'inquiry',
        name: 'Initial Inquiry',
        status: 'completed',
        blockers: [],
        completedAt: lead.created_at,
        estimatedDays: 0
      },
      {
        id: 'consultation',
        name: 'Consultation & Counseling',
        status: 'completed', // Assume completed if we have communications
        blockers: analyzeConsultationBlockers(lead, communications),
        completedAt: communications.length > 0 ? communications[0].created_at : undefined,
        estimatedDays: 3
      },
      {
        id: 'application',
        name: 'Application Submission',
        status: lead.status === 'application_submitted' ? 'completed' : 'current',
        blockers: analyzeApplicationBlockers(lead, documents, tasks),
        estimatedDays: 7
      },
      {
        id: 'documentation',
        name: 'Document Verification',
        status: getDocumentationStatus(documents),
        blockers: analyzeDocumentationBlockers(documents),
        estimatedDays: 14
      },
      {
        id: 'admission',
        name: 'Admission Review',
        status: lead.status === 'admitted' ? 'completed' : 'pending',
        blockers: analyzeAdmissionBlockers(lead, documents),
        estimatedDays: 21
      },
      {
        id: 'enrollment',
        name: 'Enrollment & Payment',
        status: lead.status === 'enrolled' ? 'completed' : 'pending',
        blockers: analyzeEnrollmentBlockers(lead),
        estimatedDays: 3
      }
    ];

    return stages;
  };

  const analyzeConsultationBlockers = (lead: any, communications: any[]): JourneyBlocker[] => {
    const blockers: JourneyBlocker[] = [];
    
    const lastCommunication = communications.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];

    if (!lastCommunication || isStale(lastCommunication.created_at, 7)) {
      blockers.push({
        id: 'no_recent_contact',
        type: 'communication',
        severity: 'high',
        title: 'No Recent Communication',
        description: 'Student needs follow-up consultation',
        details: [
          lastCommunication ? `Last contact: ${formatDate(lastCommunication.created_at)}` : 'No contact recorded',
          'Follow-up required to maintain engagement',
          'Risk of lead going cold'
        ],
        actionRequired: 'Schedule consultation call or send follow-up email',
        stage: 'consultation'
      });
    }

    if (!lead.program_interest || lead.program_interest.length === 0) {
      blockers.push({
        id: 'no_program_interest',
        type: 'communication',
        severity: 'medium',
        title: 'Program Interest Not Defined',
        description: 'Student needs program counseling',
        details: [
          'No specific program interests recorded',
          'Program selection consultation required',
          'Academic pathway needs clarification'
        ],
        actionRequired: 'Conduct program counseling session',
        stage: 'consultation'
      });
    }

    return blockers;
  };

  const analyzeApplicationBlockers = (lead: any, documents: any[], tasks: any[]): JourneyBlocker[] => {
    const blockers: JourneyBlocker[] = [];
    
    const applicationTasks = tasks.filter(t => 
      t.title.toLowerCase().includes('application') && t.status !== 'completed'
    );

    if (applicationTasks.length > 0) {
      blockers.push({
        id: 'incomplete_application_tasks',
        type: 'task',
        severity: 'critical',
        title: 'Incomplete Application Tasks',
        description: `${applicationTasks.length} application tasks pending`,
        details: applicationTasks.map(t => `• ${t.title} - ${t.status}`),
        actionRequired: 'Complete pending application tasks',
        stage: 'application'
      });
    }

    if (!lead.program_interest || lead.program_interest.length === 0) {
      blockers.push({
        id: 'no_program_selected',
        type: 'approval',
        severity: 'critical',
        title: 'No Program Selected',
        description: 'Program selection required for application',
        details: [
          'Student must select academic program',
          'Application cannot proceed without program selection',
          'Program counseling may be required'
        ],
        actionRequired: 'Select academic program with counselor',
        stage: 'application'
      });
    }

    return blockers;
  };

  const analyzeDocumentationBlockers = (documents: any[]): JourneyBlocker[] => {
    const blockers: JourneyBlocker[] = [];
    
    const requiredDocs = [
      'High School Transcript',
      'English Proficiency Test',
      'Statement of Purpose',
      'Passport Copy',
      'Financial Documents'
    ];

    const missingDocs = requiredDocs.filter(docType => 
      !documents.some(doc => 
        doc.document_type.toLowerCase().includes(docType.toLowerCase()) ||
        doc.document_name.toLowerCase().includes(docType.toLowerCase())
      )
    );

    if (missingDocs.length > 0) {
      blockers.push({
        id: 'missing_documents',
        type: 'document',
        severity: 'critical',
        title: `${missingDocs.length} Required Documents Missing`,
        description: 'Critical documents needed for application processing',
        details: missingDocs.map(doc => `• ${doc} - Not submitted`),
        actionRequired: 'Upload missing documents via student portal',
        stage: 'documentation'
      });
    }

    const rejectedDocs = documents.filter(doc => doc.status === 'rejected');
    if (rejectedDocs.length > 0) {
      blockers.push({
        id: 'rejected_documents',
        type: 'document',
        severity: 'high',
        title: `${rejectedDocs.length} Documents Rejected`,
        description: 'Documents need revision and resubmission',
        details: rejectedDocs.map(doc => 
          `• ${doc.document_name} - ${doc.comments || 'Revision required'}`
        ),
        actionRequired: 'Revise and resubmit rejected documents',
        stage: 'documentation'
      });
    }

    const pendingDocs = documents.filter(doc => doc.status === 'under-review');
    if (pendingDocs.length > 0) {
      blockers.push({
        id: 'pending_review',
        type: 'approval',
        severity: 'medium',
        title: `${pendingDocs.length} Documents Under Review`,
        description: 'Documents awaiting admin review',
        details: pendingDocs.map(doc => 
          `• ${doc.document_name} - Submitted ${formatDate(doc.upload_date)}`
        ),
        actionRequired: 'Admin review required',
        assignedTo: 'Document Review Team',
        stage: 'documentation'
      });
    }

    return blockers;
  };

  const analyzeAdmissionBlockers = (lead: any, documents: any[]): JourneyBlocker[] => {
    const blockers: JourneyBlocker[] = [];
    
    const hasAllRequiredDocs = documents.filter(doc => doc.status === 'approved').length >= 3;
    
    if (!hasAllRequiredDocs) {
      blockers.push({
        id: 'insufficient_docs_for_admission',
        type: 'document',
        severity: 'critical',
        title: 'Insufficient Approved Documents',
        description: 'Minimum document requirements not met for admission review',
        details: [
          `${documents.filter(doc => doc.status === 'approved').length} documents approved`,
          'Minimum 3 approved documents required',
          'Document verification must be completed first'
        ],
        actionRequired: 'Complete document verification process',
        stage: 'admission'
      });
    }

    if (lead.status === 'application_submitted' && hasAllRequiredDocs) {
      const daysSinceSubmission = Math.floor(
        (new Date().getTime() - new Date(lead.updated_at).getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceSubmission > 14) {
        blockers.push({
          id: 'overdue_admission_review',
          type: 'approval',
          severity: 'high',
          title: 'Admission Review Overdue',
          description: 'Application has been pending admission review for extended period',
          details: [
            `Submitted ${daysSinceSubmission} days ago`,
            'Standard review time: 14 days',
            'Expedited review may be required'
          ],
          actionRequired: 'Escalate to admission committee',
          assignedTo: 'Admissions Team',
          stage: 'admission'
        });
      }
    }

    return blockers;
  };

  const analyzeEnrollmentBlockers = (lead: any): JourneyBlocker[] => {
    const blockers: JourneyBlocker[] = [];
    
    if (lead.status === 'admitted') {
      blockers.push({
        id: 'enrollment_pending',
        type: 'payment',
        severity: 'high',
        title: 'Enrollment Payment Pending',
        description: 'Student admitted but enrollment fee not paid',
        details: [
          'Admission confirmed',
          'Enrollment fee payment required',
          'Seat reservation expires in 14 days'
        ],
        actionRequired: 'Process enrollment fee payment',
        stage: 'enrollment'
      });
    }

    return blockers;
  };

  const getDocumentationStatus = (documents: any[]): 'completed' | 'current' | 'blocked' | 'pending' => {
    const approvedDocs = documents.filter(doc => doc.status === 'approved').length;
    const rejectedDocs = documents.filter(doc => doc.status === 'rejected').length;
    
    if (approvedDocs >= 3) return 'completed';
    if (rejectedDocs > 0) return 'blocked';
    if (documents.length > 0) return 'current';
    return 'pending';
  };

  const isStale = (date: string, days: number): boolean => {
    const daysDiff = Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysDiff > days;
  };

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="h-4 w-4" />;
      case 'communication': return <Mail className="h-4 w-4" />;
      case 'payment': return <CreditCard className="h-4 w-4" />;
      case 'task': return <CheckCircle className="h-4 w-4" />;
      case 'approval': return <Users className="h-4 w-4" />;
      case 'scheduling': return <Calendar className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getStageStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'current': return <Target className="h-5 w-5 text-primary" />;
      case 'blocked': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'pending': return <Clock className="h-5 w-5 text-gray-400" />;
      default: return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const refreshAnalysis = async () => {
    setRefreshing(true);
    await analyzeJourneyBlockers();
    setRefreshing(false);
  };

  const totalBlockers = stages.reduce((sum, stage) => sum + stage.blockers.length, 0);
  const criticalBlockers = stages.reduce((sum, stage) => 
    sum + stage.blockers.filter(b => b.severity === 'critical').length, 0
  );

  useEffect(() => {
    analyzeJourneyBlockers();
  }, [leadId]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-3"></div>
            <span className="text-muted-foreground">Analyzing journey blockers...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Blocker Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Route className="h-5 w-5" />
              Journey Blocker Analysis
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={refreshAnalysis}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="text-2xl font-bold text-red-600">{criticalBlockers}</div>
              <div className="text-sm text-red-600">Critical Blockers</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-orange-600">{totalBlockers}</div>
              <div className="text-sm text-orange-600">Total Blockers</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Journey Stages with Blockers */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Journey Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-6">
              {stages.map((stage, index) => (
                <div key={stage.id} className="relative">
                  {/* Stage Header */}
                  <div className={`flex items-center gap-4 p-4 rounded-lg border ${
                    stage.status === 'blocked' ? 'bg-red-50 border-red-200' :
                    stage.status === 'current' ? 'bg-blue-50 border-blue-200' :
                    stage.status === 'completed' ? 'bg-green-50 border-green-200' :
                    'bg-gray-50 border-gray-200'
                  }`}>
                    {getStageStatusIcon(stage.status)}
                    <div className="flex-1">
                      <h3 className="font-semibold">{stage.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {stage.completedAt && (
                          <span>Completed: {formatDate(stage.completedAt)}</span>
                        )}
                        {stage.estimatedDays && !stage.completedAt && (
                          <span>Estimated: {stage.estimatedDays} days</span>
                        )}
                        {stage.blockers.length > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {stage.blockers.length} blocker{stage.blockers.length > 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Blockers */}
                  {stage.blockers.length > 0 && (
                    <div className="mt-3 ml-9 space-y-3">
                      {stage.blockers.map((blocker) => (
                        <div key={blocker.id} className="p-4 border rounded-lg bg-white">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              {getTypeIcon(blocker.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-medium">{blocker.title}</h4>
                                <Badge variant={getSeverityColor(blocker.severity)} className="text-xs">
                                  {blocker.severity}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">
                                {blocker.description}
                              </p>
                              
                              {/* Details */}
                              <div className="space-y-1 mb-3">
                                {blocker.details.map((detail, idx) => (
                                  <div key={idx} className="text-xs text-muted-foreground">
                                    {detail}
                                  </div>
                                ))}
                              </div>

                              {/* Action Required */}
                              <div className="flex items-center justify-between bg-blue-50 p-3 rounded border border-blue-200">
                                <div>
                                  <div className="text-sm font-medium text-blue-900">
                                    Action Required:
                                  </div>
                                  <div className="text-sm text-blue-700">
                                    {blocker.actionRequired}
                                  </div>
                                  {blocker.assignedTo && (
                                    <div className="text-xs text-blue-600 mt-1">
                                      Assigned to: {blocker.assignedTo}
                                    </div>
                                  )}
                                </div>
                                <ArrowRight className="h-4 w-4 text-blue-600" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Stage Connector */}
                  {index < stages.length - 1 && (
                    <div className="flex justify-center py-2">
                      <div className="w-px h-6 bg-gray-300"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}