import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ModernAdminLayout } from '@/components/admin/ModernAdminLayout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LeadTimeline } from '@/components/admin/lead-details/LeadTimeline';
import { ComprehensiveTimeline } from '@/components/admin/leads/ComprehensiveTimeline';
import { 
  ArrowLeft, 
  MessageSquare, 
  FileText, 
  Clock, 
  Users, 
  Route, 
  Bot,
  Brain,
  Target,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Calendar,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Star,
  Shield,
  Eye,
  Edit,
  Send,
  Zap,
  CheckCircle,
  XCircle,
  Pause,
  Play,
  Flag,
  Award,
  Activity,
  Download,
  Upload,
  Plus,
  PieChart,
  Filter,
  User
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Lead, LeadStatus } from '@/types/lead';
import { LeadService } from '@/services/leadService';
import { CompactLeadScore } from '@/components/admin/leads/CompactLeadScore';
import { AgenticAIIndicator } from '@/components/admin/leads/AgenticAIIndicator';
import { AILeadSummary } from '@/components/admin/leads/AILeadSummary';
import { CallHistorySection } from '@/components/admin/leads/CallHistorySection';
import { JourneyBlockerAnalysis } from '@/components/admin/leads/JourneyBlockerAnalysis';
import { AppointmentBookingButton } from '@/components/admin/leads/AppointmentBookingButton';
import { AdvisorMatchDialog } from '@/components/admin/leads/AdvisorMatchDialog';
import { NotesSystemPanel } from '@/components/admin/leads/NotesSystemPanel';
import { DocumentWorkflowPanel } from '@/components/admin/leads/DocumentWorkflowPanel';
import { EmailCommunicationPanel } from '@/components/admin/leads/EmailCommunicationPanel';
import { SMSCommunicationPanel } from '@/components/admin/leads/SMSCommunicationPanel';
import { LeadEditForm } from '@/components/admin/leads/LeadEditForm';
import { CommunicationCenter } from '@/components/admin/applicants/CommunicationCenter';
import { DocumentUpload } from '@/components/admin/leads/DocumentUpload';
import { PresetDocumentUpload } from '@/components/admin/leads/PresetDocumentUpload';
import { RealDataTasks } from '@/components/admin/leads/RealDataTasks';
import { RealDataJourney } from '@/components/admin/leads/RealDataJourney';
import AIRecommendations from '@/components/admin/leads/AIRecommendations';
import { usePresetDocuments } from '@/hooks/usePresetDocuments';
import { useLeadAcademicJourney } from '@/hooks/useLeadData';

export default function LeadDetailTestPage() {
  const navigate = useNavigate();
  const { leadId } = useParams();
  const { toast } = useToast();
  
  // All useState hooks must be at the top
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary');
  const [showDemoData, setShowDemoData] = useState(false);
  const [executingRecommendations, setExecutingRecommendations] = useState<Set<number>>(new Set());
  const [advisorMatchOpen, setAdvisorMatchOpen] = useState(false);
  const [timelineFilter, setTimelineFilter] = useState('all');
  const [isEditing, setIsEditing] = useState(false);
  
  // Document and journey data
  const { documents: presetDocuments, loading: documentsLoading, refetchDocuments } = usePresetDocuments(leadId || '', 'Computer Science');
  
  // Academic journey data
  const { journey, loading: journeyLoading } = useLeadAcademicJourney(leadId || '');

  const loadLead = useCallback(async () => {
    if (!leadId) return;
    
    try {
      setLoading(true);
      const { data: leadData } = await LeadService.getLeadById(leadId);
      
      if (leadData) {
        setLead(leadData);
      } else {
        toast({
          title: 'Error',
          description: 'Lead not found',
          variant: 'destructive'
        });
        navigate('/admin/leads');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load lead',
        variant: 'destructive'
      });
      navigate('/admin/leads');
    } finally {
      setLoading(false);
    }
  }, [leadId, toast, navigate]);

  useEffect(() => {
    if (leadId) {
      loadLead();
    }
  }, [leadId, loadLead]);

  // Demo data
  const demoEngagementTimeline = [
    { id: 1, type: 'email', action: 'Welcome email sent', timestamp: '2024-01-15 09:00', source: 'AI', status: 'opened', category: 'communication' },
    { id: 2, type: 'ai_analysis', action: 'AI analyzed student profile - High potential match', timestamp: '2024-01-15 09:05', source: 'AI', status: 'completed', category: 'ai_activity' },
    { id: 3, type: 'ai_scoring', action: 'Lead score updated: 73 → 85', timestamp: '2024-01-15 09:10', source: 'AI', status: 'completed', category: 'ai_activity' },
    { id: 4, type: 'sms', action: 'Program info shared', timestamp: '2024-01-16 14:30', source: 'Human', status: 'delivered', category: 'communication' },
    { id: 5, type: 'ai_recommendation', action: 'AI suggested scholarship info based on profile', timestamp: '2024-01-16 15:00', source: 'AI', status: 'executed', category: 'ai_activity' },
    { id: 6, type: 'event', action: 'Virtual info session attended', timestamp: '2024-01-17 18:00', source: 'Student', status: 'attended', category: 'engagement' },
    { id: 7, type: 'ai_automation', action: 'Auto-enrolled in document reminder sequence', timestamp: '2024-01-17 18:15', source: 'AI', status: 'active', category: 'ai_activity' },
    { id: 8, type: 'application', action: 'Application started', timestamp: '2024-01-18 10:15', source: 'Student', status: 'in_progress', category: 'application' },
    { id: 9, type: 'ai_insight', action: 'AI detected strong STEM background from transcript', timestamp: '2024-01-18 10:45', source: 'AI', status: 'completed', category: 'ai_activity' },
    { id: 10, type: 'email', action: 'Follow-up on incomplete application', timestamp: '2024-01-20 11:00', source: 'AI', status: 'sent', category: 'communication' },
    { id: 11, type: 'ai_prediction', action: 'AI predicted 87% enrollment likelihood', timestamp: '2024-01-20 11:30', source: 'AI', status: 'completed', category: 'ai_activity' },
    { id: 12, type: 'call', action: 'Outbound call - answered', timestamp: '2024-01-20 14:30', source: 'Human', status: 'completed', category: 'communication' },
    { id: 13, type: 'ai_optimization', action: 'AI optimized communication timing for student timezone', timestamp: '2024-01-20 15:00', source: 'AI', status: 'applied', category: 'ai_activity' },
    { id: 14, type: 'note', action: 'Added financial aid discussion notes', timestamp: '2024-01-19 11:15', source: 'Human', status: 'completed', category: 'internal' },
    { id: 15, type: 'document', action: 'High school transcript uploaded', timestamp: '2024-01-18 10:30', source: 'Student', status: 'approved', category: 'document' },
    { id: 16, type: 'ai_validation', action: 'AI validated transcript authenticity - Verified', timestamp: '2024-01-18 10:32', source: 'AI', status: 'completed', category: 'ai_activity' }
  ];

  const demoAIRecommendations = [
    {
      id: 1,
      action: 'Send scholarship deadline reminder',
      confidence: 87,
      rationale: 'Student showed high interest in financial aid during info session',
      timing: 'Next 24 hours',
      priority: 'high',
      type: 'email',
      status: 'pending'
    },
    {
      id: 2,
      action: 'Schedule one-on-one program consultation',
      confidence: 72,
      rationale: 'Similar students benefit from personal interaction at this stage',
      timing: 'Within 3 days',
      priority: 'medium',
      type: 'task',
      status: 'pending'
    },
    {
      id: 3,
      action: 'Move to application review stage',
      confidence: 94,
      rationale: 'All documents submitted and eligibility criteria met',
      timing: 'Immediate',
      priority: 'high',
      type: 'journey_move',
      status: 'pending'
    }
  ];

  const demoJourneyData = {
    id: 'journey-1',
    name: 'Bachelor of Science Application Journey',
    currentStage: 'Document Collection',
    currentStep: 3,
    totalSteps: 7,
    enrolledAt: '2024-01-15T09:00:00Z',
    stages: [
      { name: 'Initial Inquiry', completed: true, date: '2024-01-15' },
      { name: 'Info Session', completed: true, date: '2024-01-17' },
      { name: 'Document Collection', completed: false, active: true },
      { name: 'Application Review', completed: false },
      { name: 'Interview Process', completed: false },
      { name: 'Admission Decision', completed: false },
      { name: 'Enrollment', completed: false }
    ],
    nextRequiredAction: 'Submit transcripts and personal statement',
    estimatedCompletionDate: '2024-02-15'
  };

  const demoExecutedPlays = [
    {
      id: 'play-1',
      name: 'Welcome Email Sequence',
      type: 'email_sequence',
      status: 'completed',
      executedAt: '2024-01-15T09:30:00Z',
      steps: [
        { name: 'Welcome email', status: 'completed', result: 'opened' },
        { name: 'Program overview', status: 'completed', result: 'clicked' },
        { name: 'Next steps guide', status: 'completed', result: 'opened' }
      ],
      performance: { open_rate: 85, click_rate: 65, conversion_rate: 23 }
    },
    {
      id: 'play-2',
      name: 'Document Reminder Campaign',
      type: 'nurture_sequence',
      status: 'active',
      executedAt: '2024-01-20T08:00:00Z',
      steps: [
        { name: 'Initial reminder', status: 'completed', result: 'opened' },
        { name: 'Helpful tips email', status: 'active', result: 'pending' },
        { name: 'Final deadline warning', status: 'pending', result: 'pending' }
      ],
      performance: { open_rate: 92, click_rate: 45, conversion_rate: 0 }
    }
  ];

  const demoDocuments = [
    { id: 1, name: 'High School Transcript', status: 'uploaded', uploadDate: '2024-01-18', aiInsight: 'GPA: 3.7, Strong in STEM' },
    { id: 2, name: 'Personal Statement', status: 'missing', required: true },
    { id: 3, name: 'Letters of Recommendation', status: 'partial', uploadDate: '2024-01-19', aiInsight: '1 of 2 required letters' }
  ];

  const demoScores = {
    yieldLikelihood: 73,
    yieldTrend: 'up',
    engagementScore: 85,
    riskLevel: 'low',
    programMatch: 92
  };

  // Use demo data or empty data based on state
  const mockEngagementTimeline = showDemoData ? demoEngagementTimeline : [];
  const mockAIRecommendations = showDemoData ? demoAIRecommendations : [];
  const mockDocuments = showDemoData ? demoDocuments : [];
  const mockScores = showDemoData ? demoScores : {
    yieldLikelihood: 0,
    yieldTrend: 'neutral',
    engagementScore: 0,
    riskLevel: 'unknown',
    programMatch: 0
  };

  // Filter timeline based on selected filter
  const filteredTimeline = mockEngagementTimeline.filter(event => {
    if (timelineFilter === 'all') return true;
    if (timelineFilter === 'human') return event.source === 'Human';
    if (timelineFilter === 'ai') return event.source === 'AI';
    if (timelineFilter === 'student') return event.source === 'Student';
    return event.category === timelineFilter;
  });

  // Helper functions
  const getIconForEvent = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-3 w-3 text-muted-foreground" />;
      case 'sms':
        return <MessageSquare className="h-3 w-3 text-muted-foreground" />;
      case 'event':
        return <Calendar className="h-3 w-3 text-muted-foreground" />;
      case 'application':
        return <FileText className="h-3 w-3 text-muted-foreground" />;
      case 'ai_analysis':
        return <Brain className="h-3 w-3 text-blue-500" />;
      case 'ai_scoring':
        return <Target className="h-3 w-3 text-green-500" />;
      case 'ai_recommendation':
        return <Bot className="h-3 w-3 text-purple-500" />;
      case 'ai_automation':
        return <Zap className="h-3 w-3 text-orange-500" />;
      case 'ai_insight':
        return <Eye className="h-3 w-3 text-teal-500" />;
      case 'ai_prediction':
        return <TrendingUp className="h-3 w-3 text-indigo-500" />;
      case 'ai_optimization':
        return <Award className="h-3 w-3 text-amber-500" />;
      case 'ai_validation':
        return <CheckCircle className="h-3 w-3 text-emerald-500" />;
      default:
        return <Activity className="h-3 w-3 text-muted-foreground" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading lead details...</p>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Lead not found</h2>
          <Button onClick={() => navigate('/admin/leads')}>Back to Leads</Button>
        </div>
      </div>
    );
  }

  return (
    <ModernAdminLayout>
      <div className="min-h-screen bg-background">
        {/* Student Snapshot Header */}
        <div className="border-b bg-gradient-to-r from-primary/5 to-primary/10 px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/leads')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Leads
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowDemoData(!showDemoData)}
              className={showDemoData ? "bg-green-50 hover:bg-green-100 text-green-700 border-green-200" : "bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200"}
            >
              {showDemoData ? '📊 Clear Demo Data' : '🎯 Fill Demo Data'}
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Lead
            </Button>
            <AppointmentBookingButton leadId={leadId || ''} />
            <Button size="sm">
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </div>
        </div>

        {/* Edit Form Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <div className="bg-background rounded-lg shadow-xl w-full max-w-4xl my-8">
              <div className="p-6">
                <LeadEditForm
                  lead={lead}
                  onSave={(updatedLead) => {
                    setLead(updatedLead);
                    setIsEditing(false);
                  }}
                  onCancel={() => setIsEditing(false)}
                />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student Info */}
          <div className="lg:col-span-2">
             <div className="flex items-start gap-4">
               <CompactLeadScore lead={lead} />
               <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-foreground">
                    {lead.first_name} {lead.last_name}
                  </h1>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    {lead.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span>{(lead.program_interest && lead.program_interest[0]) || 'General Interest'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>Location TBD</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-sm font-normal underline hover:no-underline"
                      onClick={() => setAdvisorMatchOpen(true)}
                    >
                      Sarah Johnson
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{lead.phone || 'No phone'}</span>
                  </div>
                </div>

                 {/* Application Stage Progress */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Application Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {journey && journey.stages ? 
                        `${Math.round((journey.stages.filter(s => s.completed).length / journey.stages.length) * 100)}% Complete` : 
                        (showDemoData ? '60% Complete' : 'Not Started')
                      }
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="flex-1 grid grid-cols-5 gap-1">
                      {journey && journey.stages ? (
                        // Show first 5 stages from academic journey
                        journey.stages.slice(0, 5).map((stage, index) => (
                          <div 
                            key={index}
                            className={`h-2 rounded-full ${stage.completed ? 'bg-primary' : 'bg-gray-200'}`}
                          />
                        ))
                      ) : showDemoData ? (
                        <>
                          <div className="h-2 rounded-full bg-green-500"></div>
                          <div className="h-2 rounded-full bg-green-500"></div>
                          <div className="h-2 rounded-full bg-green-500"></div>
                          <div className="h-2 bg-gray-200 rounded-full"></div>
                          <div className="h-2 bg-gray-200 rounded-full"></div>
                        </>
                      ) : (
                        Array.from({ length: 5 }, (_, i) => (
                          <div key={i} className="h-2 bg-gray-200 rounded-full" />
                        ))
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    {journey && journey.stages ? (
                      // Show stage names from academic journey
                      journey.stages.slice(0, 5).map((stage, index) => (
                        <span key={index} className={stage.completed ? 'text-primary' : ''}>
                          {stage.stage_name}
                        </span>
                      ))
                    ) : (
                      <>
                        <span>Inquiry</span>
                        <span>Started</span>
                        <span>Submitted</span>
                        <span>Admitted</span>
                        <span>Enrolled</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Tags & AI Indicator */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex gap-2">
                    {showDemoData ? (
                      <>
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          🔥 High Priority
                        </Badge>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          📅 Info Session Attendee
                        </Badge>
                        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                          📄 Incomplete Docs
                        </Badge>
                      </>
                    ) : (
                      <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
                        No tags assigned
                      </Badge>
                    )}
                  </div>
                  
                  {/* AgenticAI Indicator */}
                  <AgenticAIIndicator 
                    isAIManaged={showDemoData}
                    aiStatus={showDemoData ? 'active' : undefined}
                    lastAIAction={showDemoData ? 'Sent follow-up email 2 hours ago' : undefined}
                    nextAIAction={showDemoData ? 'Schedule call reminder in 4 hours' : undefined}
                    onHumanTakeover={() => {
                      toast({
                        title: 'Human Takeover Initiated',
                        description: 'AI management has been paused. You now have full control.',
                        variant: 'default'
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Lead Score & Quick Actions */}
          <div className="space-y-4">
            {/* AI Recommendations */}
            <AIRecommendations 
              currentStage={journey?.current_stage_name || 'Inquiry'}
              leadData={lead}
              onActionClick={(actionId) => {
                console.log('AI Action clicked:', actionId);
                toast({
                  title: "AI Action Triggered",
                  description: `Executing: ${actionId}`,
                });
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex h-[calc(100vh-300px)]">
        {/* Left Panel - Enhanced Engagement Timeline */}
        <div className="w-80 border-r bg-card">
          <ComprehensiveTimeline 
            leadId={leadId || ''}
            filter={timelineFilter}
            onFilterChange={setTimelineFilter}
          />
        </div>

        {/* Center Content - Tabs */}
        <div className="flex-1 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="border-b p-4">
              <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="comms">Comms</TabsTrigger>
                <TabsTrigger value="docs">Docs</TabsTrigger>
                <TabsTrigger value="ai">AI</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="journey">Journey</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 p-6">
              <TabsContent value="summary" className="h-full space-y-6">
                {/* AI Summary Section - First */}
                <AILeadSummary 
                  leadId={leadId}
                  leadName={`${lead.first_name} ${lead.last_name}`}
                />
                
                {/* Lead Intelligence & Scores */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  <Card className={`bg-gradient-to-br ${showDemoData ? 'from-green-50 to-green-100 border-green-200' : 'from-gray-50 to-gray-100 border-gray-200'}`}>
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Target className={`h-4 w-4 ${showDemoData ? 'text-green-600' : 'text-gray-400'}`} />
                        {showDemoData && mockScores.yieldTrend === 'up' && (
                          <TrendingUp className="h-3 w-3 text-green-600" />
                        )}
                      </div>
                      <div className={`text-2xl font-bold ${showDemoData ? 'text-green-800' : 'text-gray-400'}`}>{mockScores.yieldLikelihood}%</div>
                      <div className={`text-xs ${showDemoData ? 'text-green-600' : 'text-gray-500'}`}>Yield Likelihood</div>
                    </CardContent>
                  </Card>

                  <Card className={`bg-gradient-to-br ${showDemoData ? 'from-blue-50 to-blue-100 border-blue-200' : 'from-gray-50 to-gray-100 border-gray-200'}`}>
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Activity className={`h-4 w-4 ${showDemoData ? 'text-blue-600' : 'text-gray-400'}`} />
                      </div>
                      <div className={`text-2xl font-bold ${showDemoData ? 'text-blue-800' : 'text-gray-400'}`}>{mockScores.engagementScore}%</div>
                      <div className={`text-xs ${showDemoData ? 'text-blue-600' : 'text-gray-500'}`}>Engagement</div>
                    </CardContent>
                  </Card>

                  <Card className={`bg-gradient-to-br ${showDemoData ? 'from-purple-50 to-purple-100 border-purple-200' : 'from-gray-50 to-gray-100 border-gray-200'}`}>
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <GraduationCap className={`h-4 w-4 ${showDemoData ? 'text-purple-600' : 'text-gray-400'}`} />
                      </div>
                      <div className={`text-2xl font-bold ${showDemoData ? 'text-purple-800' : 'text-gray-400'}`}>{mockScores.programMatch}%</div>
                      <div className={`text-xs ${showDemoData ? 'text-purple-600' : 'text-gray-500'}`}>Program Match</div>
                    </CardContent>
                  </Card>

                  <Card className={`bg-gradient-to-br ${showDemoData ? 'from-orange-50 to-orange-100 border-orange-200' : 'from-gray-50 to-gray-100 border-gray-200'}`}>
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Shield className={`h-4 w-4 ${showDemoData ? 'text-orange-600' : 'text-gray-400'}`} />
                      </div>
                      <div className={`text-2xl font-bold ${showDemoData ? 'text-orange-800' : 'text-gray-400'} capitalize`}>{mockScores.riskLevel}</div>
                      <div className={`text-xs ${showDemoData ? 'text-orange-600' : 'text-gray-500'}`}>Risk Level</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Star className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-800">{lead.lead_score}</div>
                      <div className="text-xs text-gray-600">Lead Score</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Lead Source & Attribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Lead Intelligence</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Source & Attribution</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Source:</span>
                          <span className="font-medium">{lead.source || 'Unknown'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Campaign:</span>
                          <span className="font-medium">{showDemoData ? 'Fall 2024 Info Sessions' : 'Not tracked'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Referrer:</span>
                          <span className="font-medium">{showDemoData ? 'University Website' : 'Not available'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">First Touch:</span>
                          <span className="font-medium">{lead.created_at ? new Date(lead.created_at).toLocaleDateString() : 'Unknown'}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Behavioral Insights</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Page Views:</span>
                          <span className="font-medium">{showDemoData ? '24' : '0'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Email Opens:</span>
                          <span className="font-medium">{showDemoData ? '8/10' : '0/0'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Response Rate:</span>
                          <span className="font-medium">{showDemoData ? '85%' : 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Last Activity:</span>
                          <span className="font-medium">{showDemoData ? '2 hours ago' : 'No activity'}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="comms" className="h-full">
                <CommunicationCenter 
                  applicantId={leadId || ''}
                  applicantName={`${lead.first_name} ${lead.last_name}`}
                  applicantEmail={lead.email}
                  onSendMessage={(type, content, subject) => {
                    console.log('Sending message:', { type, content, subject, leadId });
                    // TODO: Implement actual message sending
                  }}
                />
              </TabsContent>

              <TabsContent value="docs" className="h-full">
                <PresetDocumentUpload
                  leadId={leadId || ''}
                  programName="Computer Science"
                  documents={presetDocuments}
                  onDocumentUploaded={refetchDocuments}
                  onDocumentDeleted={refetchDocuments}
                  onStatusUpdated={refetchDocuments}
                />
              </TabsContent>

              <TabsContent value="notes" className="h-full">
                <NotesSystemPanel leadId={leadId || ''} />
              </TabsContent>

              <TabsContent value="ai" className="h-full">
                {showDemoData ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">AI Activity Log</h3>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        <Bot className="h-3 w-3 mr-1" />
                        {mockEngagementTimeline.filter(e => e.category === 'ai_activity').length} AI Actions
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      {mockEngagementTimeline
                        .filter(event => event.category === 'ai_activity')
                        .map((event) => (
                          <Card key={event.id} className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="mt-1">
                                {getIconForEvent(event.type)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium text-sm">{event.action}</h4>
                                  <Badge 
                                    variant="outline" 
                                    className={
                                      event.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                                      event.status === 'active' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                      event.status === 'executed' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                      'bg-gray-50 text-gray-700 border-gray-200'
                                    }
                                  >
                                    {event.status}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(event.timestamp).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </Card>
                        ))
                      }
                    </div>
                    
                    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Bot className="h-8 w-8 text-blue-600" />
                          <div>
                            <h4 className="font-medium text-blue-900">AI Agent Status</h4>
                            <p className="text-sm text-blue-700">
                              Currently monitoring lead behavior and optimizing engagement strategy
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Bot className="h-8 w-8 mx-auto mb-3 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground font-medium">No AI activity yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      AI actions and automation will be tracked here
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="tasks" className="h-full">
                <RealDataTasks leadId={leadId || ''} />
              </TabsContent>

              <TabsContent value="journey" className="h-full">
                <RealDataJourney leadId={leadId || ''} />
              </TabsContent>

            </div>
          </Tabs>
        </div>

        {/* Right Sidebar - Compliance & Additional Info */}
        <div className="w-80 border-l bg-card p-4 space-y-4">
          {/* Privacy & Compliance */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Privacy & Compliance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Communication Consent</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">FERPA Compliant</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">AI Audit Trail</span>
                <Button variant="ghost" size="sm">
                  <Eye className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Phone className="h-4 w-4 mr-2" />
                Schedule Call
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Book Meeting
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Flag className="h-4 w-4 mr-2" />
                Flag for Review
              </Button>
            </CardContent>
          </Card>

          {/* Sticky Action Card */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 sticky top-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-primary">
                <Zap className="h-4 w-4" />
                Take Action Now
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${showDemoData ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
                  <span>{showDemoData ? 'Application deadline in 5 days' : 'No urgent actions required'}</span>
                </div>
                <Button size="sm" className="w-full" disabled={!showDemoData}>
                  {showDemoData ? 'Send Deadline Reminder' : 'No Actions Available'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>

      {/* Advisor Match Dialog */}
      <AdvisorMatchDialog 
        open={advisorMatchOpen}
        onOpenChange={setAdvisorMatchOpen}
        advisorName="Sarah Johnson"
        lead={lead || {} as Lead}
      />
    </ModernAdminLayout>
  );
}