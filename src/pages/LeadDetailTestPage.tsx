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
import { CallHistorySection } from '@/components/admin/leads/CallHistorySection';
import { AppointmentBookingButton } from '@/components/admin/leads/AppointmentBookingButton';
import { AdvisorMatchDialog } from '@/components/admin/leads/AdvisorMatchDialog';
import { NotesSystemPanel } from '@/components/admin/leads/NotesSystemPanel';
import { DocumentWorkflowPanel } from '@/components/admin/leads/DocumentWorkflowPanel';
import { EmailCommunicationPanel } from '@/components/admin/leads/EmailCommunicationPanel';
import { SMSCommunicationPanel } from '@/components/admin/leads/SMSCommunicationPanel';

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
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              🧪 Test Version
            </Badge>
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
            <Button variant="outline" size="sm">
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
            
            {/* Flag for Review Button */}
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Flag className="h-4 w-4 text-orange-600" />
                    <span className="font-medium text-orange-900">Review Required</span>
                  </div>
                  <Badge variant="outline" className="bg-orange-100 text-orange-800">
                    Pending
                  </Badge>
                </div>
                <p className="text-sm text-orange-700 mb-3">
                  Student has been flagged for manual review due to incomplete documentation
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  <Eye className="h-3 w-3 mr-1" />
                  Review Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex h-[calc(100vh-300px)]">
        {/* Left Panel - Enhanced Engagement Timeline */}
        <div className="w-80 border-r bg-card">
          <div className="p-4 border-b">
            <h3 className="font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Comprehensive Timeline
            </h3>
            <div className="flex flex-col gap-2 mt-3">
              <div className="flex gap-1">
                <Button 
                  variant={timelineFilter === 'all' ? 'default' : 'ghost'} 
                  size="sm"
                  onClick={() => setTimelineFilter('all')}
                >
                  All
                </Button>
                <Button 
                  variant={timelineFilter === 'human' ? 'default' : 'ghost'} 
                  size="sm"
                  onClick={() => setTimelineFilter('human')}
                >
                  Human
                </Button>
                <Button 
                  variant={timelineFilter === 'ai' ? 'default' : 'ghost'} 
                  size="sm"
                  onClick={() => setTimelineFilter('ai')}
                >
                  AI
                </Button>
              </div>
              <div className="flex gap-1">
                <Button 
                  variant={timelineFilter === 'communication' ? 'default' : 'ghost'} 
                  size="sm"
                  onClick={() => setTimelineFilter('communication')}
                >
                  <Mail className="h-3 w-3 mr-1" />
                  Comms
                </Button>
                <Button 
                  variant={timelineFilter === 'document' ? 'default' : 'ghost'} 
                  size="sm"
                  onClick={() => setTimelineFilter('document')}
                >
                  <FileText className="h-3 w-3 mr-1" />
                  Docs
                </Button>
                <Button 
                  variant={timelineFilter === 'engagement' ? 'default' : 'ghost'} 
                  size="sm"
                  onClick={() => setTimelineFilter('engagement')}
                >
                  <User className="h-3 w-3 mr-1" />
                  Events
                </Button>
              </div>
            </div>
          </div>
          
          <ScrollArea className="h-full p-4">
            {filteredTimeline.length > 0 ? (
              <div className="space-y-4">
                {filteredTimeline.map((event, index) => (
                  <div key={event.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        event.source === 'AI' ? 'bg-blue-500' : 
                        event.source === 'Human' ? 'bg-green-500' : 'bg-purple-500'
                      }`} />
                      {index < filteredTimeline.length - 1 && (
                        <div className="w-px h-8 bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        {getIconForEvent(event.type)}
                        <span className="text-sm font-medium">{event.action}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{event.timestamp}</span>
                        <Badge variant="outline" className="text-xs">
                          {event.source}
                        </Badge>
                        <Badge variant={event.status === 'opened' || event.status === 'completed' || event.status === 'approved' ? 'default' : 'secondary'} className="text-xs">
                          {event.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="h-8 w-8 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground font-medium">
                  {timelineFilter === 'all' ? 'No activity yet' : `No ${timelineFilter} activity`}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {timelineFilter === 'all' 
                    ? 'Engagement timeline will appear here as interactions occur'
                    : `${timelineFilter} activities will appear here when available`
                  }
                </p>
              </div>
            )}
          </ScrollArea>
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
                  <CallHistorySection leadId={leadId || ''} />
                  <EmailCommunicationPanel leadId={leadId || ''} leadEmail={lead?.email} />
                  <SMSCommunicationPanel leadId={leadId || ''} leadPhone={lead?.phone} />
                </div>
              </TabsContent>

              <TabsContent value="docs" className="h-full">
                <DocumentWorkflowPanel leadId={leadId || ''} />
              </TabsContent>

              <TabsContent value="notes" className="h-full">
                <NotesSystemPanel leadId={leadId || ''} />
              </TabsContent>

              <TabsContent value="ai" className="h-full">
                {/* AI Activity Log */}
                <div className="space-y-6 h-full">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bot className="h-5 w-5" />
                        AI Recommendations
                      </CardTitle>
                      <CardDescription>
                        AI-powered suggestions to optimize student engagement
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {showDemoData && mockAIRecommendations.length > 0 ? (
                        <div className="space-y-4">
                          {mockAIRecommendations.map((recommendation) => (
                            <div key={recommendation.id} className="border rounded-lg p-4 bg-card">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  {getRecommendationIcon(recommendation.type)}
                                  <div>
                                    <h4 className="font-medium">{recommendation.action}</h4>
                                    <p className="text-sm text-muted-foreground">{recommendation.rationale}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className={getPriorityColor(recommendation.priority)}>
                                    {recommendation.priority}
                                  </Badge>
                                  <Badge variant="secondary">{recommendation.confidence}% confidence</Badge>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {recommendation.timing}
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {recommendation.type.replace('_', ' ')}
                                </Badge>
                              </div>

                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  onClick={() => executeRecommendation(recommendation)}
                                  disabled={executingRecommendations.has(recommendation.id)}
                                  className="bg-primary hover:bg-primary/90"
                                >
                                  {executingRecommendations.has(recommendation.id) ? (
                                    <>
                                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                                      Executing...
                                    </>
                                  ) : (
                                    <>
                                      <Zap className="h-3 w-3 mr-1" />
                                      Execute Now
                                    </>
                                  )}
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Dismiss
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Bot className="h-8 w-8 mx-auto mb-3 text-muted-foreground opacity-50" />
                          <p className="text-muted-foreground font-medium">No AI recommendations</p>
                          <p className="text-sm text-muted-foreground mt-1 mb-4">
                            AI will analyze this lead and provide actionable recommendations
                          </p>
                          <Button variant="outline" size="sm" disabled>
                            <Brain className="h-4 w-4 mr-2" />
                            Generate Recommendations
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Executed Plays */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Play className="h-5 w-5" />
                        Executed Plays
                      </CardTitle>
                      <CardDescription>
                        Automated sequences and campaigns executed for this student
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {showDemoData && demoExecutedPlays.length > 0 ? (
                        <div className="space-y-4">
                          {demoExecutedPlays.map((play) => (
                            <div key={play.id} className="border rounded-lg p-4 bg-card">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h4 className="font-medium flex items-center gap-2">
                                    {play.name}
                                    <Badge variant={play.status === 'completed' ? 'default' : 'secondary'}>
                                      {play.status}
                                    </Badge>
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {play.type.replace('_', ' ')} • Executed {new Date(play.executedAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Open Rate:</span>
                                  <span className="font-medium ml-2">{play.performance.open_rate}%</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Click Rate:</span>
                                  <span className="font-medium ml-2">{play.performance.click_rate}%</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Conversion:</span>
                                  <span className="font-medium ml-2">{play.performance.conversion_rate}%</span>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <h5 className="text-sm font-medium">Steps:</h5>
                                {play.steps.map((step, index) => (
                                  <div key={index} className="flex items-center gap-2 text-sm">
                                    <div className={`w-2 h-2 rounded-full ${
                                      step.status === 'completed' ? 'bg-green-500' : 
                                      step.status === 'active' ? 'bg-yellow-500' : 'bg-gray-300'
                                    }`}></div>
                                    <span className="flex-1">{step.name}</span>
                                    {step.result !== 'pending' && (
                                      <Badge variant="outline" className="text-xs">
                                        {step.result}
                                      </Badge>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Play className="h-8 w-8 mx-auto mb-3 text-muted-foreground opacity-50" />
                          <p className="text-muted-foreground font-medium">No plays executed</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Automated sequences will appear here once executed
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Other tabs would continue with similar comprehensive layouts */}
              <TabsContent value="comms" className="h-full">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Message Center
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <MessageSquare className="h-8 w-8 mx-auto mb-3 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground font-medium">No communications yet</p>
                      <p className="text-sm text-muted-foreground mt-1">Message history will appear here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tasks" className="h-full">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Task Assignment & Manual Override
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Users className="h-8 w-8 mx-auto mb-3 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground font-medium">No tasks assigned</p>
                      <p className="text-sm text-muted-foreground mt-1">Tasks and notes will appear here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="journey" className="h-full">
                <div className="space-y-6 h-full">
                  {/* Current Journey */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Route className="h-5 w-5" />
                        Current Journey
                      </CardTitle>
                      <CardDescription>
                        Student's progress through their academic journey
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {showDemoData ? (
                        <div className="space-y-6">
                          {/* Journey Overview */}
                          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                            <div>
                              <h4 className="font-semibold text-primary">{demoJourneyData.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                Enrolled {new Date(demoJourneyData.enrolledAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-primary">{demoJourneyData.currentStep}/{demoJourneyData.totalSteps}</div>
                              <div className="text-xs text-muted-foreground">Steps Complete</div>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Journey Progress</span>
                              <span className="text-sm text-muted-foreground">{Math.round((demoJourneyData.currentStep / demoJourneyData.totalSteps) * 100)}%</span>
                            </div>
                            <Progress value={(demoJourneyData.currentStep / demoJourneyData.totalSteps) * 100} className="h-2" />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Started</span>
                              <span className="font-medium">Current: {demoJourneyData.currentStage}</span>
                              <span>Complete</span>
                            </div>
                          </div>

                          {/* Journey Stages */}
                          <div className="space-y-3">
                            <h5 className="text-sm font-medium">Journey Stages</h5>
                            {demoJourneyData.stages.map((stage, index) => (
                              <div key={index} className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${
                                  stage.completed ? 'bg-green-500' : 
                                  stage.active ? 'bg-primary animate-pulse' : 'bg-gray-300'
                                }`}></div>
                                <div className="flex-1">
                                  <div className={`text-sm font-medium ${stage.active ? 'text-primary' : ''}`}>
                                    {stage.name}
                                  </div>
                                  {stage.date && (
                                    <div className="text-xs text-muted-foreground">
                                      Completed {new Date(stage.date).toLocaleDateString()}
                                    </div>
                                  )}
                                </div>
                                {stage.completed && (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                )}
                                {stage.active && (
                                  <Clock className="h-4 w-4 text-primary" />
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Next Required Action */}
                          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="h-4 w-4 text-yellow-600" />
                              <h5 className="text-sm font-medium text-yellow-800">Next Required Action</h5>
                            </div>
                            <p className="text-sm text-yellow-700 mb-3">{demoJourneyData.nextRequiredAction}</p>
                            <div className="flex items-center gap-4 text-xs text-yellow-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Est. completion: {new Date(demoJourneyData.estimatedCompletionDate).toLocaleDateString()}
                              </div>
                            </div>
                          </div>

                          {/* Journey Actions */}
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3 mr-1" />
                              Edit Journey
                            </Button>
                            <Button size="sm" variant="outline">
                              <Route className="h-3 w-3 mr-1" />
                              Change Journey
                            </Button>
                            <Button size="sm">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Mark Current Stage Complete
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Route className="h-8 w-8 mx-auto mb-3 text-muted-foreground opacity-50" />
                          <p className="text-muted-foreground font-medium">Journey not started</p>
                          <p className="text-sm text-muted-foreground mt-1 mb-4">
                            Student journey will be tracked here once enrolled
                          </p>
                          <Button variant="outline" size="sm" disabled>
                            <Plus className="h-3 w-3 mr-1" />
                            Enroll in Journey
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Journey Analytics */}
                  {showDemoData && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <PieChart className="h-5 w-5" />
                          Journey Analytics
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-primary">18</div>
                            <div className="text-xs text-muted-foreground">Days in Current Stage</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-green-600">92%</div>
                            <div className="text-xs text-muted-foreground">On-Time Performance</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-orange-600">3</div>
                            <div className="text-xs text-muted-foreground">Pending Actions</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
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
