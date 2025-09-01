import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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
  PieChart
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Lead, LeadStatus } from '@/types/lead';
import { LeadService } from '@/services/leadService';

export default function LeadDetailTestPage() {
  const navigate = useNavigate();
  const { leadId } = useParams();
  const { toast } = useToast();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => {
    if (leadId) {
      loadLead();
    }
  }, [leadId]);

  const loadLead = async () => {
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
  };

  // Mock data for demonstration
  const mockEngagementTimeline = [
    { id: 1, type: 'email', action: 'Welcome email sent', timestamp: '2024-01-15 09:00', source: 'AI', status: 'opened' },
    { id: 2, type: 'sms', action: 'Program info shared', timestamp: '2024-01-16 14:30', source: 'Human', status: 'delivered' },
    { id: 3, type: 'event', action: 'Virtual info session attended', timestamp: '2024-01-17 18:00', source: 'Student', status: 'attended' },
    { id: 4, type: 'application', action: 'Application started', timestamp: '2024-01-18 10:15', source: 'Student', status: 'in_progress' },
    { id: 5, type: 'email', action: 'Follow-up on incomplete application', timestamp: '2024-01-20 11:00', source: 'AI', status: 'sent' }
  ];

  const mockAIRecommendations = [
    {
      id: 1,
      action: 'Send scholarship deadline reminder',
      confidence: 87,
      rationale: 'Student showed high interest in financial aid during info session',
      timing: 'Next 24 hours',
      priority: 'high'
    },
    {
      id: 2,
      action: 'Schedule one-on-one program consultation',
      confidence: 72,
      rationale: 'Similar students benefit from personal interaction at this stage',
      timing: 'Within 3 days',
      priority: 'medium'
    }
  ];

  const mockDocuments = [
    { id: 1, name: 'High School Transcript', status: 'uploaded', uploadDate: '2024-01-18', aiInsight: 'GPA: 3.7, Strong in STEM' },
    { id: 2, name: 'Personal Statement', status: 'missing', required: true },
    { id: 3, name: 'Letters of Recommendation', status: 'partial', uploadDate: '2024-01-19', aiInsight: '1 of 2 required letters' }
  ];

  const mockScores = {
    yieldLikelihood: 73,
    yieldTrend: 'up',
    engagementScore: 85,
    riskLevel: 'low',
    programMatch: 92
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

  return (
    <div className="min-h-screen bg-background">
      {/* 🧑‍🎓 1. Student Snapshot Header */}
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
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Lead
            </Button>
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
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <Users className="h-8 w-8 text-primary" />
              </div>
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
                    <span>Sarah Johnson</span>
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
                    <span className="text-sm text-muted-foreground">60% Complete</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="flex-1 grid grid-cols-5 gap-1">
                      <div className="h-2 bg-green-500 rounded-full"></div>
                      <div className="h-2 bg-green-500 rounded-full"></div>
                      <div className="h-2 bg-green-500 rounded-full"></div>
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

                {/* Tags */}
                <div className="flex gap-2 mt-3">
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    🔥 High Priority
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    📅 Info Session Attendee
                  </Badge>
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    📄 Incomplete Docs
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* 💡 Next-Best Action Panel */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-green-800">
                <Brain className="h-5 w-5" />
                AI Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white/80 p-4 rounded-lg border border-green-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-green-900">Send scholarship reminder</span>
                  <Badge className="bg-green-100 text-green-800">87% confidence</Badge>
                </div>
                <p className="text-sm text-green-700 mb-3">
                  Based on similar students, this message has a 37% yield boost
                </p>
                <div className="flex items-center gap-2 text-xs text-green-600 mb-3">
                  <Clock className="h-3 w-3" />
                  Best to send within next 24h
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <Zap className="h-3 w-3 mr-1" />
                    Execute Now
                  </Button>
                  <Button variant="outline" size="sm">
                    Edit & Send
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex h-[calc(100vh-300px)]">
        {/* 🔁 Left Panel - Engagement Timeline */}
        <div className="w-80 border-r bg-card">
          <div className="p-4 border-b">
            <h3 className="font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Engagement Timeline
            </h3>
            <div className="flex gap-2 mt-2">
              <Button variant="outline" size="sm">All</Button>
              <Button variant="ghost" size="sm">Human</Button>
              <Button variant="ghost" size="sm">AI</Button>
            </div>
          </div>
          
          <ScrollArea className="h-full p-4">
            <div className="space-y-4">
              {mockEngagementTimeline.map((event, index) => (
                <div key={event.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${
                      event.source === 'AI' ? 'bg-blue-500' : 
                      event.source === 'Human' ? 'bg-green-500' : 'bg-purple-500'
                    }`} />
                    {index < mockEngagementTimeline.length - 1 && (
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
                      <Badge variant={event.status === 'opened' ? 'default' : 'secondary'} className="text-xs">
                        {event.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Center Content - Tabs */}
        <div className="flex-1 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="border-b p-4">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="comms">Comms</TabsTrigger>
                <TabsTrigger value="docs">Docs</TabsTrigger>
                <TabsTrigger value="ai">AI</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="journey">Journey</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 p-6">
              <TabsContent value="summary" className="h-full space-y-6">
                {/* 📊 Lead Intelligence & Scores */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-green-600" />
                        {mockScores.yieldTrend === 'up' ? 
                          <TrendingUp className="h-3 w-3 text-green-600" /> : 
                          <TrendingDown className="h-3 w-3 text-red-600" />
                        }
                      </div>
                      <div className="text-2xl font-bold text-green-800">{mockScores.yieldLikelihood}%</div>
                      <div className="text-xs text-green-600">Yield Likelihood</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Activity className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-blue-800">{mockScores.engagementScore}%</div>
                      <div className="text-xs text-blue-600">Engagement</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <GraduationCap className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="text-2xl font-bold text-purple-800">{mockScores.programMatch}%</div>
                      <div className="text-xs text-purple-600">Program Match</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                    <CardContent className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Shield className="h-4 w-4 text-orange-600" />
                      </div>
                      <div className="text-2xl font-bold text-orange-800 capitalize">{mockScores.riskLevel}</div>
                      <div className="text-xs text-orange-600">Risk Level</div>
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
                          <span className="font-medium">{lead.source || 'Direct'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Campaign:</span>
                          <span className="font-medium">Fall 2024 Info Sessions</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Referrer:</span>
                          <span className="font-medium">University Website</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">First Touch:</span>
                          <span className="font-medium">2024-01-10</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Behavioral Insights</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Page Views:</span>
                          <span className="font-medium">24</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Email Opens:</span>
                          <span className="font-medium">8/10</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Response Rate:</span>
                          <span className="font-medium">85%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Last Activity:</span>
                          <span className="font-medium">2 hours ago</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="docs" className="h-full">
                {/* 📁 Documents & Application Materials */}
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Documents & Application Materials
                    </CardTitle>
                    <CardDescription>
                      Track application progress and document uploads
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockDocuments.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getDocumentBgColor(doc.status)}`}>
                              {getDocumentIcon(doc.status)}
                            </div>
                            <div>
                              <div className="font-medium">{doc.name}</div>
                              {doc.aiInsight && (
                                <div className="text-sm text-muted-foreground">
                                  AI Insight: {doc.aiInsight}
                                </div>
                              )}
                              {doc.uploadDate && (
                                <div className="text-xs text-muted-foreground">
                                  Uploaded: {doc.uploadDate}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {doc.status === 'uploaded' ? (
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            ) : (
                              <Button variant="outline" size="sm">
                                <Upload className="h-4 w-4 mr-2" />
                                Upload
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ai" className="h-full">
                {/* 🧠 AI Activity Log */}
                <div className="space-y-6 h-full">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bot className="h-5 w-5" />
                        AI Activity & Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockAIRecommendations.map((rec) => (
                          <div key={rec.id} className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-medium">{rec.action}</span>
                                  <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'}>
                                    {rec.priority}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{rec.rationale}</p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span>Confidence: {rec.confidence}%</span>
                                  <span>Timing: {rec.timing}</span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm">Execute</Button>
                                <Button variant="outline" size="sm">Edit</Button>
                              </div>
                            </div>
                            <Progress value={rec.confidence} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>AI Control Panel</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">AI Engagement Status</h4>
                          <p className="text-sm text-muted-foreground">
                            AI is actively monitoring and engaging with this lead
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Pause className="h-4 w-4 mr-2" />
                            Pause AI
                          </Button>
                          <Button variant="outline" size="sm">
                            <Flag className="h-4 w-4 mr-2" />
                            Flag for Review
                          </Button>
                        </div>
                      </div>
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
                      <p className="text-muted-foreground">Communication hub coming soon...</p>
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
                      <p className="text-muted-foreground">Task management coming soon...</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="journey" className="h-full">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Route className="h-5 w-5" />
                      Journey Tracker
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Journey visualization coming soon...</p>
                    </div>
                  </CardContent>
                </Card>
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
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span>Application deadline in 5 days</span>
                </div>
                <Button size="sm" className="w-full">
                  Send Deadline Reminder
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
