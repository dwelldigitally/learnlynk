import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ModernAdminLayout } from '@/components/admin/ModernAdminLayout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
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

export default function LeadDetailPage() {
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

  const loadLead = useCallback(async () => {
    if (!leadId || leadId === ':leadId') {
      console.log('❌ Invalid leadId:', leadId);
      return;
    }
    
    try {
      setLoading(true);
      console.log('🔍 Loading lead with ID:', leadId);
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
    if (leadId && leadId !== ':leadId') {
      loadLead();
    } else if (leadId === ':leadId') {
      console.error('❌ Route parameter issue: leadId is literal ":leadId"');
      setLoading(false);
      toast({
        title: 'Route Error',
        description: 'Invalid lead ID in URL. Please access this page from the leads list.',
        variant: 'destructive'
      });
      navigate('/admin/leads');
    }
  }, [leadId, loadLead, toast, navigate]);

  // Demo data
  const demoEngagementTimeline = [
    { id: 1, type: 'email', action: 'Welcome email sent', timestamp: '2024-01-15 09:00', source: 'AI', status: 'opened', category: 'communication' },
    { id: 2, type: 'sms', action: 'Program info shared', timestamp: '2024-01-16 14:30', source: 'Human', status: 'delivered', category: 'communication' },
    { id: 3, type: 'event', action: 'Virtual info session attended', timestamp: '2024-01-17 18:00', source: 'Student', status: 'attended', category: 'engagement' },
    { id: 4, type: 'application', action: 'Application started', timestamp: '2024-01-18 10:15', source: 'Student', status: 'in_progress', category: 'application' },
    { id: 5, type: 'email', action: 'Follow-up on incomplete application', timestamp: '2024-01-20 11:00', source: 'AI', status: 'sent', category: 'communication' },
    { id: 6, type: 'call', action: 'Outbound call - answered', timestamp: '2024-01-20 14:30', source: 'Human', status: 'completed', category: 'communication' },
    { id: 7, type: 'note', action: 'Added financial aid discussion notes', timestamp: '2024-01-19 11:15', source: 'Human', status: 'completed', category: 'internal' },
    { id: 8, type: 'document', action: 'High school transcript uploaded', timestamp: '2024-01-18 10:30', source: 'Student', status: 'approved', category: 'document' }
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
      default:
        return <Activity className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const getDocumentIcon = (status: string) => {
    switch (status) {
      case 'uploaded':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'partial':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default:
        return <XCircle className="h-5 w-5 text-red-600" />;
    }
  };

  const getDocumentBgColor = (status: string) => {
    switch (status) {
      case 'uploaded':
        return 'bg-green-100';
      case 'partial':
        return 'bg-yellow-100';
      default:
        return 'bg-red-100';
    }
  };

  const executeRecommendation = async (recommendation: any) => {
    setExecutingRecommendations(prev => new Set(prev).add(recommendation.id));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'Action Executed Successfully',
        description: `${recommendation.action} has been executed for ${lead?.first_name} ${lead?.last_name}`,
        variant: 'default'
      });

      if (showDemoData) {
        console.log('Recommendation executed:', recommendation);
      }
      
    } catch (error) {
      toast({
        title: 'Execution Failed',
        description: 'There was an error executing this recommendation. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setExecutingRecommendations(prev => {
        const newSet = new Set(prev);
        newSet.delete(recommendation.id);
        return newSet;
      });
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'task':
        return <CheckCircle className="h-4 w-4" />;
      case 'journey_move':
        return <Route className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
                    <span className="text-sm text-muted-foreground">{showDemoData ? '60% Complete' : 'Not Started'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="flex-1 grid grid-cols-5 gap-1">
                      <div className={`h-2 rounded-full ${showDemoData ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                      <div className={`h-2 rounded-full ${showDemoData ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                      <div className={`h-2 rounded-full ${showDemoData ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                      <div className="h-2 bg-gray-200 rounded-full"></div>
                      <div className="h-2 bg-gray-200 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Inquiry</span>
                    <span>Started</span>
                    <span>Submitted</span>
                    <span>Admitted</span>
                    <span>Enrolled</span>
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
                  <AgenticAIIndicator 
                    isAIManaged={lead.ai_managed || false}
                    aiStatus={lead.ai_managed ? 'active' : undefined}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Journey & Blockers */}
          <div className="lg:col-span-1">
            <JourneyBlockerAnalysis leadId={leadId || ''} leadData={lead} />
          </div>
          </div>

          {/* Three-Tab Layout */}
          <div className="mt-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="summary" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Summary
              </TabsTrigger>
              <TabsTrigger value="engagement" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Engagement
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Documents
              </TabsTrigger>
              <TabsTrigger value="communication" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Communication
              </TabsTrigger>
            </TabsList>

            <TabsContent value="summary">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* AI Summary */}
                <AILeadSummary 
                  leadId={leadId || ''} 
                  leadName={`${lead.first_name} ${lead.last_name}`} 
                />

                {/* Call History */}
                <CallHistorySection leadId={leadId || ''} />
              </div>
            </TabsContent>

            <TabsContent value="engagement" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* AI Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      AI Recommendations
                    </CardTitle>
                    <CardDescription>
                      Smart suggestions to improve conversion likelihood
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockAIRecommendations.length > 0 ? (
                      mockAIRecommendations.map((recommendation) => (
                        <div key={recommendation.id} className="p-4 rounded-lg border bg-card">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getRecommendationIcon(recommendation.type)}
                              <h4 className="font-medium text-sm">{recommendation.action}</h4>
                            </div>
                            <Badge className={getPriorityColor(recommendation.priority)}>
                              {recommendation.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {recommendation.rationale}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>🎯 {recommendation.confidence}% confidence</span>
                              <span>⏰ {recommendation.timing}</span>
                            </div>
                            <Button 
                              size="sm" 
                              onClick={() => executeRecommendation(recommendation)}
                              disabled={executingRecommendations.has(recommendation.id)}
                            >
                              {executingRecommendations.has(recommendation.id) ? 'Executing...' : 'Execute'}
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No recommendations available yet
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Engagement Timeline */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="h-5 w-5" />
                          Engagement Timeline
                        </CardTitle>
                        <CardDescription>
                          Chronological view of all interactions
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <select 
                          value={timelineFilter} 
                          onChange={(e) => setTimelineFilter(e.target.value)}
                          className="text-sm border rounded px-2 py-1"
                        >
                          <option value="all">All</option>
                          <option value="communication">Communication</option>
                          <option value="engagement">Engagement</option>
                          <option value="application">Application</option>
                          <option value="human">Human</option>
                          <option value="ai">AI</option>
                          <option value="student">Student</option>
                        </select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      {filteredTimeline.length > 0 ? (
                        <div className="space-y-3">
                          {filteredTimeline.map((event) => (
                            <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                              <div className="mt-1">
                                {getIconForEvent(event.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <p className="text-sm font-medium">{event.action}</p>
                                  <Badge variant="outline" className="text-xs">
                                    {event.source}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span>{event.timestamp}</span>
                                  <span className="capitalize">{event.status}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          No activity recorded yet
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {/* Executed AI Plays */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    AI Plays Executed
                  </CardTitle>
                  <CardDescription>
                    Automated sequences and their performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {showDemoData && demoExecutedPlays.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {demoExecutedPlays.map((play) => (
                        <div key={play.id} className="p-4 rounded-lg border bg-card">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium">{play.name}</h4>
                            <Badge 
                              variant={play.status === 'completed' ? 'default' : 'secondary'}
                              className={play.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
                            >
                              {play.status}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            {play.steps.map((step, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                {step.status === 'completed' ? (
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                ) : step.status === 'active' ? (
                                  <Play className="h-4 w-4 text-blue-600" />
                                ) : (
                                  <Pause className="h-4 w-4 text-gray-400" />
                                )}
                                <span className={step.status === 'completed' ? 'text-foreground' : 'text-muted-foreground'}>
                                  {step.name}
                                </span>
                                {step.result !== 'pending' && (
                                  <Badge variant="outline" className="text-xs">
                                    {step.result}
                                  </Badge>
                                )}
                              </div>
                            ))}
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="text-center p-2 bg-muted rounded">
                              <div className="font-medium">{play.performance.open_rate}%</div>
                              <div className="text-muted-foreground">Open Rate</div>
                            </div>
                            <div className="text-center p-2 bg-muted rounded">
                              <div className="font-medium">{play.performance.click_rate}%</div>
                              <div className="text-muted-foreground">Click Rate</div>
                            </div>
                            <div className="text-center p-2 bg-muted rounded">
                              <div className="font-medium">{play.performance.conversion_rate}%</div>
                              <div className="text-muted-foreground">Conversion</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No AI plays executed yet
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <DocumentWorkflowPanel leadId={leadId || ''} />
            </TabsContent>

            <TabsContent value="communication" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <EmailCommunicationPanel leadId={leadId || ''} leadEmail={lead.email} />
                <SMSCommunicationPanel leadId={leadId || ''} leadPhone={lead.phone} />
              </div>
              <NotesSystemPanel leadId={leadId || ''} />
            </TabsContent>
          </Tabs>
          </div>
        </div>

      {/* Advisor Match Dialog */}
      <AdvisorMatchDialog 
        open={advisorMatchOpen} 
        onOpenChange={setAdvisorMatchOpen}
        advisorName="Sarah Johnson"
        lead={lead}
      />
    </ModernAdminLayout>
  );
}