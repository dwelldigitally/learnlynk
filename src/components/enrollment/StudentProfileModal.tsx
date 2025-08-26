import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Phone, Mail, MapPin, Calendar, MessageSquare, FileText, User, GraduationCap, Clock, Star, ExternalLink, Bot, Play } from 'lucide-react';
import { format } from 'date-fns';

interface StudentData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  program: string;
  yield_score: number;
  yield_band: string;
  location?: string;
  source?: string;
  last_contacted?: string;
  stage?: string;
  notes?: string[];
  ai_recommendations?: AIRecommendation[];
  communication_history?: CommunicationHistoryItem[];
  playbook_audit_trail?: PlaybookAuditItem[];
  preferences?: {
    best_contact_time?: string;
    preferred_method?: string;
    timezone?: string;
  };
}

interface AIRecommendation {
  id: string;
  type: 'email' | 'call' | 'sms' | 'meeting';
  priority: 'high' | 'medium' | 'low';
  confidence: number;
  reasoning: string;
  suggested_content?: string;
  best_time?: string;
  success_probability?: number;
}

interface CommunicationHistoryItem {
  id: string;
  type: string;
  date: string;
  subject: string;
  outcome?: string;
  ai_generated?: boolean;
  playbook_source?: string;
  response_time?: number;
}

interface PlaybookAuditItem {
  id: string;
  journey_name: string;
  stage_name: string;
  play_name: string;
  action_type: string;
  triggered_at: string;
  success_rate: number;
  reasoning: string;
  outcome?: string;
}

interface StudentProfileModalProps {
  studentId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onQuickAction?: (action: string, studentId: string) => void;
}

export function StudentProfileModal({ studentId, isOpen, onClose, onQuickAction }: StudentProfileModalProps) {
  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (studentId && isOpen) {
      loadStudentData();
    }
  }, [studentId, isOpen]);

  const loadStudentData = async () => {
    setLoading(true);
    try {
      // Mock comprehensive student data - replace with actual API call
      const mockStudent: StudentData = {
        id: studentId!,
        name: "Sarah Johnson",
        email: "sarah.johnson@email.com",
        phone: "+1 (555) 123-4567",
        program: "Computer Science MS",
        yield_score: 85,
        yield_band: "high",
        location: "New York, NY",
        source: "Website Form",
        last_contacted: "2024-01-15T10:30:00Z",
        stage: "Application Review",
        notes: [
          "Interested in AI/ML concentration",
          "Has background in software development",
          "Prefers evening calls after 6 PM EST"
        ],
        ai_recommendations: [
          {
            id: '1',
            type: 'call',
            priority: 'high',
            confidence: 92,
            reasoning: 'Student has shown high engagement and prefers phone calls. Historical data shows 85% success rate for similar profiles.',
            best_time: '6:00 PM - 8:00 PM EST',
            success_probability: 85
          },
          {
            id: '2',
            type: 'email',
            priority: 'medium',
            confidence: 78,
            reasoning: 'Follow-up email with AI/ML program details would address their specific interests.',
            suggested_content: 'AI/ML concentration details and career outcomes',
            success_probability: 72
          }
        ],
        communication_history: [
          {
            id: '1',
            type: "email",
            date: "2024-01-15T10:30:00Z",
            subject: "Application Status Update",
            outcome: "Opened, no reply",
            ai_generated: true,
            playbook_source: "Application Review Journey",
            response_time: 24
          },
          {
            id: '2',
            type: "call",
            date: "2024-01-10T16:45:00Z",
            subject: "Initial consultation call",
            outcome: "Connected, 15 min discussion",
            ai_generated: false,
            response_time: 0
          },
          {
            id: '3',
            type: "email",
            date: "2024-01-08T09:15:00Z",
            subject: "Welcome and next steps",
            outcome: "Replied with questions",
            ai_generated: true,
            playbook_source: "Welcome Series",
            response_time: 2
          }
        ],
        playbook_audit_trail: [
          {
            id: '1',
            journey_name: 'Application Review Journey',
            stage_name: 'Initial Review',
            play_name: 'Status Update Sequence',
            action_type: 'email',
            triggered_at: '2024-01-15T10:30:00Z',
            success_rate: 78,
            reasoning: 'Student has been in review stage for 5 days. Historical data shows status updates improve conversion by 23%.',
            outcome: 'email_sent'
          },
          {
            id: '2',
            journey_name: 'Welcome Series',
            stage_name: 'Onboarding',
            play_name: 'Welcome & Next Steps',
            action_type: 'email',
            triggered_at: '2024-01-08T09:15:00Z',
            success_rate: 89,
            reasoning: 'New lead from high-converting source. Welcome series has 89% engagement rate.',
            outcome: 'replied'
          }
        ],
        preferences: {
          best_contact_time: "6:00 PM - 8:00 PM EST",
          preferred_method: "Phone call",
          timezone: "America/New_York"
        }
      };

      setStudent(mockStudent);
    } catch (error) {
      console.error('Error loading student data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    if (student && onQuickAction) {
      onQuickAction(action, student.id);
    }
  };

  const getOutcomeColor = (outcome?: string) => {
    if (!outcome) return 'text-muted-foreground';
    if (outcome.includes('replied') || outcome.includes('connected')) return 'text-green-600';
    if (outcome.includes('no reply') || outcome.includes('bounced')) return 'text-red-600';
    return 'text-yellow-600';
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span>{loading ? 'Loading...' : student?.name || 'Student Profile'}</span>
              {student && (
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant="outline"
                    className={`${
                      student.yield_band === 'high' ? 'bg-green-50 text-green-700 border-green-200' :
                      student.yield_band === 'medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                      'bg-red-50 text-red-700 border-red-200'
                    }`}
                  >
                    <Star className="h-3 w-3 mr-1" />
                    {student.yield_score}% Yield Score
                  </Badge>
                  <Badge variant="secondary">{student.stage}</Badge>
                </div>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-pulse space-y-4 w-full max-w-md">
              <div className="h-6 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="space-y-2">
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="h-4 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </div>
        ) : student ? (
          <div className="space-y-4">
            {/* Quick Actions */}
            <div className="flex items-center space-x-2 p-3 bg-muted/30 rounded-lg">
              <span className="text-sm font-medium text-muted-foreground">Quick Actions:</span>
              <Button size="sm" onClick={() => handleQuickAction('email')}>
                <Mail className="h-3 w-3 mr-1" />
                Email
              </Button>
              <Button size="sm" onClick={() => handleQuickAction('call')}>
                <Phone className="h-3 w-3 mr-1" />
                Call
              </Button>
              <Button size="sm" onClick={() => handleQuickAction('sms')}>
                <MessageSquare className="h-3 w-3 mr-1" />
                SMS
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleQuickAction('meeting')}>
                <Calendar className="h-3 w-3 mr-1" />
                Schedule
              </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="playbooks">Playbooks</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4 pr-4">
                    {/* Contact Information */}
                    <div>
                      <h3 className="text-sm font-medium text-foreground mb-2 flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        Contact Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <a href={`mailto:${student.email}`} className="text-primary hover:underline">
                            {student.email}
                          </a>
                        </div>
                        {student.phone && (
                          <div className="flex items-center space-x-2">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <a href={`tel:${student.phone}`} className="text-primary hover:underline">
                              {student.phone}
                            </a>
                          </div>
                        )}
                        {student.location && (
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span>{student.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <Separator />

                    {/* Program & Status */}
                    <div>
                      <h3 className="text-sm font-medium text-foreground mb-2 flex items-center">
                        <GraduationCap className="h-4 w-4 mr-1" />
                        Program Information
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <p><span className="font-medium">Program:</span> {student.program}</p>
                        <p><span className="font-medium">Source:</span> {student.source}</p>
                        {student.last_contacted && (
                          <p><span className="font-medium">Last Contact:</span> {format(new Date(student.last_contacted), 'MMM d, yyyy h:mm a')}</p>
                        )}
                      </div>
                    </div>

                    <Separator />

                    {/* Communication Preferences */}
                    {student.preferences && (
                      <>
                        <div>
                          <h3 className="text-sm font-medium text-foreground mb-2 flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Communication Preferences
                          </h3>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <p><span className="font-medium">Best Time:</span> {student.preferences.best_contact_time}</p>
                            <p><span className="font-medium">Preferred Method:</span> {student.preferences.preferred_method}</p>
                            <p><span className="font-medium">Timezone:</span> {student.preferences.timezone}</p>
                          </div>
                        </div>
                        <Separator />
                      </>
                    )}

                    {/* Notes */}
                    {student.notes && student.notes.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-foreground mb-2 flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          Notes
                        </h3>
                        <div className="space-y-1">
                          {student.notes.map((note, index) => (
                            <p key={index} className="text-sm text-muted-foreground">• {note}</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="ai-insights" className="space-y-4">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4 pr-4">
                    <h3 className="text-sm font-medium text-foreground mb-2 flex items-center">
                      <Bot className="h-4 w-4 mr-1" />
                      AI Recommendations
                    </h3>
                    {student.ai_recommendations?.map((rec) => (
                      <div key={rec.id} className="p-3 border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}>
                              {rec.type}
                            </Badge>
                            <Badge variant="outline">
                              {rec.confidence}% confidence
                            </Badge>
                            {rec.success_probability && (
                              <Badge variant="outline">
                                {rec.success_probability}% success rate
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm">{rec.reasoning}</p>
                        {rec.suggested_content && (
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">Suggested content:</span> {rec.suggested_content}
                          </p>
                        )}
                        {rec.best_time && (
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">Best time:</span> {rec.best_time}
                          </p>
                        )}
                        <Button size="sm" onClick={() => handleQuickAction(rec.type)}>
                          Execute {rec.type}
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4 pr-4">
                    <h3 className="text-sm font-medium text-foreground mb-2 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Communication History
                    </h3>
                    {student.communication_history?.map((comm) => (
                      <div key={comm.id} className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {comm.type === 'email' ? 
                              <Mail className="h-3 w-3" /> : 
                              <Phone className="h-3 w-3" />
                            }
                            <span className="font-medium text-sm">{comm.type}</span>
                            {comm.ai_generated && (
                              <Badge variant="outline" className="text-xs">
                                <Bot className="h-2 w-2 mr-1" />
                                AI Generated
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(comm.date), 'MMM d, h:mm a')}
                          </span>
                        </div>
                        <p className="text-sm mb-1">{comm.subject}</p>
                        {comm.outcome && (
                          <p className={`text-xs ${getOutcomeColor(comm.outcome)}`}>
                            → {comm.outcome}
                          </p>
                        )}
                        {comm.playbook_source && (
                          <p className="text-xs text-muted-foreground mt-1">
                            <Play className="h-2 w-2 inline mr-1" />
                            Source: {comm.playbook_source}
                          </p>
                        )}
                        {comm.response_time !== undefined && (
                          <p className="text-xs text-muted-foreground">
                            <Clock className="h-2 w-2 inline mr-1" />
                            Response time: {comm.response_time}h
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="playbooks" className="space-y-4">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4 pr-4">
                    <h3 className="text-sm font-medium text-foreground mb-2 flex items-center">
                      <Play className="h-4 w-4 mr-1" />
                      Playbook Audit Trail
                    </h3>
                    {student.playbook_audit_trail?.map((audit) => (
                      <div key={audit.id} className="p-3 border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{audit.journey_name}</Badge>
                            <Badge variant="secondary">{audit.stage_name}</Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(audit.triggered_at), 'MMM d, h:mm a')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{audit.play_name}</p>
                          <p className="text-xs text-muted-foreground mb-2">Action: {audit.action_type}</p>
                          <p className="text-sm">{audit.reasoning}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">
                            {audit.success_rate}% success rate
                          </Badge>
                          {audit.outcome && (
                            <Badge variant="outline" className={getOutcomeColor(audit.outcome)}>
                              {audit.outcome}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="flex items-center justify-center h-96">
            <p className="text-muted-foreground">Student not found</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}