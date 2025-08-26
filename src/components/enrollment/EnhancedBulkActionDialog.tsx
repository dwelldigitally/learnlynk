import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Bot, Mail, Phone, MessageSquare, Calendar, Star, Clock, Play, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

interface StudentAction {
  id: string;
  action_type: string;
  instruction: string;
  priority: number;
  scheduled_at: string;
  metadata: {
    student_name?: string;
    program?: string;
    yield_score?: number;
    yield_band?: string;
    contact_info?: {
      email?: string;
      phone?: string;
    };
    journey_name?: string;
    stage_name?: string;
    play_name?: string;
    generation_source?: string;
    journey_context?: boolean;
  };
}

interface AIRecommendation {
  student_id: string;
  student_name: string;
  confidence: number;
  success_probability: number;
  reasoning: string;
  personalized_message?: string;
  best_timing?: string;
  risk_factors?: string[];
  historical_performance?: {
    similar_leads: number;
    success_rate: number;
    avg_response_time: string;
  };
}

interface BulkActionSummary {
  total_leads: number;
  high_confidence: number;
  medium_confidence: number;
  low_confidence: number;
  avg_success_rate: number;
  estimated_completion_time: string;
  recommended_action_type: string;
}

interface EnhancedBulkActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedActions: StudentAction[];
  actionType: 'email' | 'call' | 'sms' | 'meeting';
  onExecute: (actions: StudentAction[], customMessage?: string) => void;
}

export function EnhancedBulkActionDialog({
  isOpen,
  onClose,
  selectedActions,
  actionType,
  onExecute
}: EnhancedBulkActionDialogProps) {
  const [loading, setLoading] = useState(true);
  const [aiRecommendations, setAIRecommendations] = useState<AIRecommendation[]>([]);
  const [bulkSummary, setBulkSummary] = useState<BulkActionSummary | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isOpen && selectedActions.length > 0) {
      setSelectedLeads(selectedActions.map(action => action.id));
      generateAIRecommendations();
    }
  }, [isOpen, selectedActions]);

  const generateAIRecommendations = async () => {
    setLoading(true);
    try {
      // Mock AI analysis - replace with actual API call
      const mockRecommendations: AIRecommendation[] = selectedActions.map((action, index) => ({
        student_id: action.id,
        student_name: action.metadata?.student_name || 'Student',
        confidence: Math.floor(75 + Math.random() * 20), // 75-95%
        success_probability: Math.floor(60 + Math.random() * 30), // 60-90%
        reasoning: getPersonalizedReasoning(action),
        personalized_message: getPersonalizedMessage(action, actionType),
        best_timing: getBestTiming(action),
        risk_factors: getRiskFactors(action),
        historical_performance: {
          similar_leads: Math.floor(50 + Math.random() * 200),
          success_rate: Math.floor(65 + Math.random() * 25),
          avg_response_time: `${Math.floor(2 + Math.random() * 12)}h`
        }
      }));

      const summary: BulkActionSummary = {
        total_leads: selectedActions.length,
        high_confidence: mockRecommendations.filter(r => r.confidence >= 85).length,
        medium_confidence: mockRecommendations.filter(r => r.confidence >= 70 && r.confidence < 85).length,
        low_confidence: mockRecommendations.filter(r => r.confidence < 70).length,
        avg_success_rate: Math.round(mockRecommendations.reduce((acc, r) => acc + r.success_probability, 0) / mockRecommendations.length),
        estimated_completion_time: calculateCompletionTime(selectedActions.length, actionType),
        recommended_action_type: actionType
      };

      setAIRecommendations(mockRecommendations);
      setBulkSummary(summary);
    } catch (error) {
      console.error('Error generating AI recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPersonalizedReasoning = (action: StudentAction): string => {
    const reasons = [
      `${action.metadata?.student_name} has shown high engagement with ${action.metadata?.program} program materials.`,
      `Student has a ${action.metadata?.yield_score}% yield score, indicating strong conversion potential.`,
      `Previous communications from ${action.metadata?.journey_name} journey showed positive response patterns.`,
      `Optimal timing based on student's interaction history and preferences.`
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  };

  const getPersonalizedMessage = (action: StudentAction, type: string): string => {
    const messages: Record<string, string[]> = {
      email: [
        `Hi ${action.metadata?.student_name}, I wanted to follow up on your interest in our ${action.metadata?.program} program...`,
        `Hello ${action.metadata?.student_name}, I have some exciting updates about the ${action.metadata?.program} curriculum...`,
        `Dear ${action.metadata?.student_name}, I'd love to discuss how our ${action.metadata?.program} aligns with your career goals...`
      ],
      call: [
        `Script: Warm greeting, mention their interest in ${action.metadata?.program}, ask about their timeline...`,
        `Talking points: Discuss program benefits, address any concerns, schedule next steps...`,
        `Approach: Friendly consultation about ${action.metadata?.program} fit and career outcomes...`
      ],
      sms: [
        `Hi ${action.metadata?.student_name}! Quick update on your ${action.metadata?.program} application. Can we chat? - [Your Name]`,
        `Hello! I have some great news about ${action.metadata?.program}. When's a good time to call? - [Your Name]`,
        `Hi ${action.metadata?.student_name}, following up on ${action.metadata?.program}. Free for a quick call today? - [Your Name]`
      ]
    };
    const typeMessages = messages[type] || messages.email;
    return typeMessages[Math.floor(Math.random() * typeMessages.length)];
  };

  const getBestTiming = (action: StudentAction): string => {
    const timings = [
      'Today 2-4 PM (based on their timezone)',
      'Tomorrow morning 10-11 AM',
      'This evening 6-8 PM (their preferred time)',
      'Within next 2 hours (high engagement window)'
    ];
    return timings[Math.floor(Math.random() * timings.length)];
  };

  const getRiskFactors = (action: StudentAction): string[] => {
    const allRisks = [
      'No recent engagement (>7 days)',
      'Multiple unanswered attempts',
      'Low email open rate',
      'Timezone mismatch',
      'Weekend timing'
    ];
    return allRisks.slice(0, Math.floor(Math.random() * 3));
  };

  const calculateCompletionTime = (count: number, type: string): string => {
    const timePerAction = { email: 2, sms: 1, call: 15, meeting: 5 };
    const minutes = count * (timePerAction[type as keyof typeof timePerAction] || 5);
    if (minutes < 60) return `${minutes} minutes`;
    return `${Math.round(minutes / 60)} hours`;
  };

  const toggleLead = (leadId: string) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const toggleAllLeads = () => {
    const allIds = aiRecommendations.map(r => r.student_id);
    setSelectedLeads(prev => 
      prev.length === allIds.length ? [] : allIds
    );
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getActionIcon = () => {
    switch (actionType) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'call': return <Phone className="h-4 w-4" />;
      case 'sms': return <MessageSquare className="h-4 w-4" />;
      case 'meeting': return <Calendar className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  const handleExecute = () => {
    const actionsToExecute = selectedActions.filter(action => selectedLeads.includes(action.id));
    onExecute(actionsToExecute, customMessage);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {getActionIcon()}
            <span>Bulk {actionType.charAt(0).toUpperCase() + actionType.slice(1)} - AI Enhanced</span>
            <Badge variant="secondary">{selectedActions.length} students</Badge>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center space-y-4">
              <Bot className="h-12 w-12 mx-auto animate-pulse text-primary" />
              <p>AI is analyzing your students and generating personalized recommendations...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary Cards */}
            {bulkSummary && (
              <div className="grid grid-cols-4 gap-4">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">High Confidence</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{bulkSummary.high_confidence}</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium">Medium Confidence</span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-600">{bulkSummary.medium_confidence}</p>
                </div>
                <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Avg Success Rate</span>
                  </div>
                  <p className="text-2xl font-bold text-primary">{bulkSummary.avg_success_rate}%</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg border">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Est. Time</span>
                  </div>
                  <p className="text-2xl font-bold">{bulkSummary.estimated_completion_time}</p>
                </div>
              </div>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="students">Student Analysis</TabsTrigger>
                <TabsTrigger value="customize">Customize & Execute</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-3">Action Summary</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Total Students:</span> {bulkSummary?.total_leads}</p>
                      <p><span className="font-medium">Action Type:</span> {actionType}</p>
                      <p><span className="font-medium">Success Rate:</span> {bulkSummary?.avg_success_rate}%</p>
                      <p><span className="font-medium">Completion Time:</span> {bulkSummary?.estimated_completion_time}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-3">Confidence Distribution</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span className="text-sm">High Confidence ({bulkSummary?.high_confidence})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                        <span className="text-sm">Medium Confidence ({bulkSummary?.medium_confidence})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded"></div>
                        <span className="text-sm">Low Confidence ({bulkSummary?.low_confidence})</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="students" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Individual Student Analysis</h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedLeads.length === aiRecommendations.length}
                      onCheckedChange={toggleAllLeads}
                    />
                    <span className="text-sm">Select All</span>
                  </div>
                </div>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3 pr-4">
                    {aiRecommendations.map((rec) => (
                      <div key={rec.student_id} className={`p-4 border rounded-lg ${selectedLeads.includes(rec.student_id) ? 'ring-2 ring-primary' : ''}`}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              checked={selectedLeads.includes(rec.student_id)}
                              onCheckedChange={() => toggleLead(rec.student_id)}
                            />
                            <div>
                              <h4 className="font-medium">{rec.student_name}</h4>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="outline" className={getConfidenceColor(rec.confidence)}>
                                  {rec.confidence}% confidence
                                </Badge>
                                <Badge variant="outline">
                                  <Star className="h-2 w-2 mr-1" />
                                  {rec.success_probability}% success
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">{rec.reasoning}</p>
                        
                        {rec.best_timing && (
                          <p className="text-xs text-green-600 mb-1">
                            <Clock className="h-3 w-3 inline mr-1" />
                            Best timing: {rec.best_timing}
                          </p>
                        )}
                        
                        {rec.risk_factors && rec.risk_factors.length > 0 && (
                          <div className="text-xs text-red-600">
                            <AlertCircle className="h-3 w-3 inline mr-1" />
                            Risks: {rec.risk_factors.join(', ')}
                          </div>
                        )}

                        {rec.historical_performance && (
                          <div className="text-xs text-muted-foreground mt-2">
                            Historical: {rec.historical_performance.similar_leads} similar leads, {rec.historical_performance.success_rate}% success rate, avg response: {rec.historical_performance.avg_response_time}
                          </div>
                        )}

                        {rec.personalized_message && (
                          <div className="mt-2 p-2 bg-muted/30 rounded text-xs">
                            <span className="font-medium">Suggested approach:</span>
                            <p className="mt-1">{rec.personalized_message}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="customize" className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Custom Message (Optional)</h3>
                  <Textarea
                    placeholder={`Add a custom message for this ${actionType} campaign...`}
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium">Ready to execute {actionType} for {selectedLeads.length} students</p>
                    <p className="text-sm text-muted-foreground">
                      Estimated completion: {bulkSummary?.estimated_completion_time}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button onClick={handleExecute} disabled={selectedLeads.length === 0}>
                      Execute {actionType.charAt(0).toUpperCase() + actionType.slice(1)}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}