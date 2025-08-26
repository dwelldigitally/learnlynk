import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Bot, Mail, Phone, MessageSquare, Calendar, Star, Clock, Play, TrendingUp, AlertCircle, CheckCircle, Eye, Send, Pause, RotateCcw, Target } from 'lucide-react';

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

interface ExecutionStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'current' | 'completed' | 'failed';
}

interface StudentPreview {
  student_id: string;
  student_name: string;
  preview_content: {
    subject?: string;
    body: string;
    recipient: string;
    timing: string;
    playbook?: string;
  };
  status: 'pending' | 'sending' | 'sent' | 'failed';
  execution_time?: string;
  error_message?: string;
}

interface ExecutionProgress {
  total: number;
  completed: number;
  failed: number;
  current_batch: number;
  estimated_completion: string;
  is_paused: boolean;
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
  
  // Execution states
  const [currentStep, setCurrentStep] = useState<'planning' | 'preview' | 'confirmation' | 'execution' | 'results'>('planning');
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([]);
  const [studentPreviews, setStudentPreviews] = useState<StudentPreview[]>([]);
  const [executionProgress, setExecutionProgress] = useState<ExecutionProgress | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResults, setExecutionResults] = useState<any[]>([]);
  const [selectedPreviewStudent, setSelectedPreviewStudent] = useState<string>('');

  useEffect(() => {
    if (isOpen && selectedActions.length > 0) {
      setSelectedLeads(selectedActions.map(action => action.id));
      initializeExecutionSteps();
      generateAIRecommendations();
    }
  }, [isOpen, selectedActions]);

  const initializeExecutionSteps = () => {
    const steps: ExecutionStep[] = [
      {
        id: 'planning',
        name: 'AI Analysis & Planning',
        description: 'Analyze students and generate personalized recommendations',
        status: 'current'
      },
      {
        id: 'preview',
        name: 'Preview & Customize',
        description: 'Review what will be sent to each student',
        status: 'pending'
      },
      {
        id: 'confirmation',
        name: 'Final Confirmation',
        description: 'Confirm execution details and timing',
        status: 'pending'
      },
      {
        id: 'execution',
        name: 'Execute Actions',
        description: 'Send communications to selected students',
        status: 'pending'
      },
      {
        id: 'results',
        name: 'Results & Follow-up',
        description: 'Review execution results and plan next steps',
        status: 'pending'
      }
    ];
    setExecutionSteps(steps);
  };

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
      generateStudentPreviews(mockRecommendations);
      updateExecutionStep('planning', 'completed');
      setCurrentStep('preview');
    } catch (error) {
      console.error('Error generating AI recommendations:', error);
      updateExecutionStep('planning', 'failed');
    } finally {
      setLoading(false);
    }
  };

  const generateStudentPreviews = (recommendations: AIRecommendation[]) => {
    const previews: StudentPreview[] = recommendations.map(rec => {
      const action = selectedActions.find(a => a.id === rec.student_id);
      return {
        student_id: rec.student_id,
        student_name: rec.student_name,
        preview_content: {
          subject: actionType === 'email' ? generateEmailSubject(action!) : undefined,
          body: rec.personalized_message || generateActionContent(action!, actionType),
          recipient: getRecipientInfo(action!),
          timing: rec.best_timing || 'Immediate',
          playbook: `${action?.metadata?.journey_name} > ${action?.metadata?.stage_name} > ${action?.metadata?.play_name}`
        },
        status: 'pending'
      };
    });
    setStudentPreviews(previews);
    if (previews.length > 0) {
      setSelectedPreviewStudent(previews[0].student_id);
    }
  };

  const generateEmailSubject = (action: StudentAction): string => {
    const subjects = [
      `Next steps for your ${action.metadata?.program} application`,
      `Your ${action.metadata?.program} journey with us`,
      `Important update about ${action.metadata?.program}`,
      `Let's discuss your ${action.metadata?.program} goals`
    ];
    return subjects[Math.floor(Math.random() * subjects.length)];
  };

  const generateActionContent = (action: StudentAction, type: string): string => {
    const name = action.metadata?.student_name || 'Student';
    const program = action.metadata?.program || 'our program';
    
    switch (type) {
      case 'email':
        return `Dear ${name},\n\nI wanted to personally reach out regarding your interest in ${program}. Based on your profile and engagement, I believe this program aligns perfectly with your career goals.\n\nI'd love to schedule a brief conversation to discuss:\n• Program curriculum and career outcomes\n• Financial aid and payment options\n• Your specific questions and timeline\n\nWhen would be a good time for a 15-minute call this week?\n\nBest regards,\n[Your Name]`;
      case 'sms':
        return `Hi ${name}! I have some exciting updates about ${program}. When's a good time for a quick call to discuss your next steps? - [Your Name]`;
      case 'call':
        return `Call Script for ${name}:\n\n1. Warm greeting and introduction\n2. Reference their interest in ${program}\n3. Ask about their timeline and goals\n4. Discuss program benefits and outcomes\n5. Address any concerns or questions\n6. Schedule next steps or application guidance\n\nKey talking points:\n• Personalized career outcomes\n• Flexible scheduling options\n• Strong job placement rates\n• Financial aid opportunities`;
      case 'meeting':
        return `Meeting agenda for ${name}:\n\n• Welcome and introductions (5 min)\n• Program overview and curriculum (15 min)\n• Career services and outcomes (10 min)\n• Financial options and next steps (10 min)\n• Q&A and application guidance (10 min)\n\nPrep notes:\n• Review their background and interests\n• Prepare specific examples relevant to their goals\n• Have application materials ready`;
      default:
        return `Personalized outreach for ${name} regarding ${program}`;
    }
  };

  const getRecipientInfo = (action: StudentAction): string => {
    const email = action.metadata?.contact_info?.email;
    const phone = action.metadata?.contact_info?.phone;
    const name = action.metadata?.student_name;
    
    switch (actionType) {
      case 'email':
        return email ? `${name} <${email}>` : `${name} (email required)`;
      case 'sms':
        return phone ? `${name} (${phone})` : `${name} (phone required)`;
      case 'call':
        return phone ? `${name} (${phone})` : `${name} (phone required)`;
      case 'meeting':
        return email ? `${name} <${email}>` : `${name} (email required)`;
      default:
        return name || 'Unknown';
    }
  };

  const updateExecutionStep = (stepId: string, status: ExecutionStep['status']) => {
    setExecutionSteps(prev => 
      prev.map(step => 
        step.id === stepId ? { ...step, status } : step
      )
    );
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

  const proceedToPreview = () => {
    updateExecutionStep('preview', 'current');
    setCurrentStep('preview');
    setActiveTab('preview');
  };

  const proceedToConfirmation = () => {
    updateExecutionStep('preview', 'completed');
    updateExecutionStep('confirmation', 'current');
    setCurrentStep('confirmation');
    setActiveTab('confirmation');
  };

  const startExecution = async () => {
    updateExecutionStep('confirmation', 'completed');
    updateExecutionStep('execution', 'current');
    setCurrentStep('execution');
    setActiveTab('execution');
    setIsExecuting(true);

    const selectedPreviews = studentPreviews.filter(p => selectedLeads.includes(p.student_id));
    
    setExecutionProgress({
      total: selectedPreviews.length,
      completed: 0,
      failed: 0,
      current_batch: 1,
      estimated_completion: calculateExecutionTime(selectedPreviews.length),
      is_paused: false
    });

    try {
      // Execute the actual bulk action using the parent component's onExecute function
      const actionsToExecute = selectedActions.filter(action => selectedLeads.includes(action.id));
      
      // Update previews to show "sending" status
      setStudentPreviews(prev => 
        prev.map(p => 
          selectedLeads.includes(p.student_id) 
            ? { ...p, status: 'sending' }
            : p
        )
      );

      // Call the actual execution function from parent component
      await onExecute(actionsToExecute, customMessage);

      // Update all selected previews to "sent" status
      setStudentPreviews(prev => 
        prev.map(p => 
          selectedLeads.includes(p.student_id) 
            ? { 
                ...p, 
                status: 'sent',
                execution_time: new Date().toLocaleTimeString()
              }
            : p
        )
      );

      setExecutionProgress(prev => prev ? {
        ...prev,
        completed: selectedPreviews.length,
        failed: 0
      } : null);

    } catch (error) {
      console.error('Bulk action execution failed:', error);
      
      // Update failed previews
      setStudentPreviews(prev => 
        prev.map(p => 
          selectedLeads.includes(p.student_id) 
            ? { 
                ...p, 
                status: 'failed',
                execution_time: new Date().toLocaleTimeString(),
                error_message: error instanceof Error ? error.message : 'Execution failed'
              }
            : p
        )
      );

      setExecutionProgress(prev => prev ? {
        ...prev,
        completed: 0,
        failed: selectedPreviews.length
      } : null);
    }

    setIsExecuting(false);
    updateExecutionStep('execution', 'completed');
    updateExecutionStep('results', 'current');
    setCurrentStep('results');
    setActiveTab('results');
  };

  const calculateExecutionTime = (count: number): string => {
    const minutes = Math.ceil(count * 1.5); // 1.5 minutes per action
    return `~${minutes} minutes`;
  };

  const pauseExecution = () => {
    setExecutionProgress(prev => prev ? { ...prev, is_paused: true } : null);
  };

  const resumeExecution = () => {
    setExecutionProgress(prev => prev ? { ...prev, is_paused: false } : null);
  };

  const retryFailed = async () => {
    const failedPreviews = studentPreviews.filter(p => p.status === 'failed');
    // Implement retry logic
  };


  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {getActionIcon()}
            <span>Bulk {actionType.charAt(0).toUpperCase() + actionType.slice(1)} - AI Enhanced</span>
            <Badge variant="secondary">{selectedActions.length} students</Badge>
          </DialogTitle>
        </DialogHeader>

        {/* Execution Steps Progress */}
        <div className="border-b pb-4">
          <div className="flex items-center justify-between">
            {executionSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                  step.status === 'completed' ? 'bg-green-100 text-green-700' :
                  step.status === 'current' ? 'bg-primary/10 text-primary' :
                  step.status === 'failed' ? 'bg-red-100 text-red-700' :
                  'bg-muted text-muted-foreground'
                }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    step.status === 'completed' ? 'bg-green-600 text-white' :
                    step.status === 'current' ? 'bg-primary text-white' :
                    step.status === 'failed' ? 'bg-red-600 text-white' :
                    'bg-muted-foreground text-white'
                  }`}>
                    {step.status === 'completed' ? <CheckCircle className="h-3 w-3" /> : index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{step.name}</div>
                    <div className="text-xs opacity-75">{step.description}</div>
                  </div>
                </div>
                {index < executionSteps.length - 1 && (
                  <div className="w-8 h-px bg-border mx-2"></div>
                )}
              </div>
            ))}
          </div>
        </div>

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
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview" disabled={currentStep !== 'planning'}>Overview</TabsTrigger>
                <TabsTrigger value="students" disabled={currentStep !== 'planning'}>Student Analysis</TabsTrigger>
                <TabsTrigger value="preview" disabled={currentStep === 'planning'}>Preview</TabsTrigger>
                <TabsTrigger value="confirmation" disabled={!['confirmation', 'execution', 'results'].includes(currentStep)}>Confirmation</TabsTrigger>
                <TabsTrigger value="execution" disabled={!['execution', 'results'].includes(currentStep)}>Execution</TabsTrigger>
                <TabsTrigger value="results" disabled={currentStep !== 'results'}>Results</TabsTrigger>
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
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Ready to proceed to preview phase
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button onClick={proceedToPreview} className="flex items-center space-x-2">
                      <Eye className="h-4 w-4" />
                      <span>Preview Communications</span>
                    </Button>
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

              <TabsContent value="preview" className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-3">Student Previews</h3>
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-2 pr-4">
                        {studentPreviews.filter(p => selectedLeads.includes(p.student_id)).map((preview) => (
                          <div 
                            key={preview.student_id}
                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                              selectedPreviewStudent === preview.student_id ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
                            }`}
                            onClick={() => setSelectedPreviewStudent(preview.student_id)}
                          >
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{preview.student_name}</h4>
                              <Badge variant="outline" className="text-xs">
                                {preview.preview_content.playbook?.split(' > ').pop() || 'Manual'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {preview.preview_content.timing}
                            </p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3 flex items-center space-x-2">
                      <Eye className="h-4 w-4" />
                      <span>Preview Content</span>
                    </h3>
                    {selectedPreviewStudent && (
                      <div className="border rounded-lg p-4 space-y-4">
                        {(() => {
                          const preview = studentPreviews.find(p => p.student_id === selectedPreviewStudent);
                          if (!preview) return null;
                          
                          return (
                            <>
                              <div className="space-y-2">
                                <div className="text-sm">
                                  <span className="font-medium">To:</span> {preview.preview_content.recipient}
                                </div>
                                <div className="text-sm">
                                  <span className="font-medium">Timing:</span> {preview.preview_content.timing}
                                </div>
                                {preview.preview_content.playbook && (
                                  <div className="text-sm">
                                    <span className="font-medium">Triggered by:</span> {preview.preview_content.playbook}
                                  </div>
                                )}
                                {preview.preview_content.subject && (
                                  <div className="text-sm">
                                    <span className="font-medium">Subject:</span> {preview.preview_content.subject}
                                  </div>
                                )}
                              </div>
                              
                              <Separator />
                              
                              <div className="space-y-2">
                                <h4 className="font-medium">Content:</h4>
                                <div className="bg-muted/30 p-3 rounded text-sm whitespace-pre-wrap">
                                  {preview.preview_content.body}
                                </div>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {selectedLeads.length} students ready for {actionType}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => setCurrentStep('planning')}>
                      Back to Analysis
                    </Button>
                    <Button onClick={proceedToConfirmation} className="flex items-center space-x-2">
                      <Target className="h-4 w-4" />
                      <span>Proceed to Confirmation</span>
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="confirmation" className="space-y-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-4">Final Confirmation</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm">Execution Summary</h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">Action Type:</span> {actionType.charAt(0).toUpperCase() + actionType.slice(1)}</p>
                          <p><span className="font-medium">Total Students:</span> {selectedLeads.length}</p>
                          <p><span className="font-medium">Estimated Time:</span> {calculateExecutionTime(selectedLeads.length)}</p>
                          <p><span className="font-medium">Success Rate Prediction:</span> {bulkSummary?.avg_success_rate}%</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm">Safety Checks</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm">All recipients have valid contact info</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm">Content reviewed and approved</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm">Timing optimized for engagement</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Custom Message (Optional)</h4>
                    <Textarea
                      placeholder={`Add a custom message for this ${actionType} campaign...`}
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Ready to execute {selectedLeads.length} {actionType} actions
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => setCurrentStep('preview')}>
                      Back to Preview
                    </Button>
                    <Button 
                      onClick={startExecution}
                      disabled={selectedLeads.length === 0}
                      className="flex items-center space-x-2"
                    >
                      <Send className="h-4 w-4" />
                      <span>Start Execution</span>
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="execution" className="space-y-4">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">Execution in Progress</h3>
                      <div className="flex items-center space-x-2">
                        {isExecuting && (
                          <Button variant="outline" size="sm" onClick={pauseExecution}>
                            <Pause className="h-4 w-4 mr-1" />
                            Pause
                          </Button>
                        )}
                        {executionProgress?.is_paused && (
                          <Button variant="outline" size="sm" onClick={resumeExecution}>
                            <Play className="h-4 w-4 mr-1" />
                            Resume
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {executionProgress && (
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">
                              Progress: {executionProgress.completed + executionProgress.failed} / {executionProgress.total}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              ETA: {executionProgress.estimated_completion}
                            </span>
                          </div>
                          <Progress 
                            value={((executionProgress.completed + executionProgress.failed) / executionProgress.total) * 100} 
                            className="h-2"
                          />
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{executionProgress.completed}</div>
                            <div className="text-sm text-green-700">Completed</div>
                          </div>
                          <div className="text-center p-3 bg-red-50 rounded-lg">
                            <div className="text-2xl font-bold text-red-600">{executionProgress.failed}</div>
                            <div className="text-sm text-red-700">Failed</div>
                          </div>
                          <div className="text-center p-3 bg-muted/50 rounded-lg">
                            <div className="text-2xl font-bold">{executionProgress.total - executionProgress.completed - executionProgress.failed}</div>
                            <div className="text-sm text-muted-foreground">Pending</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Student Status</h4>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-2 pr-4">
                        {studentPreviews.filter(p => selectedLeads.includes(p.student_id)).map((preview) => (
                          <div key={preview.student_id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <h5 className="font-medium">{preview.student_name}</h5>
                              {preview.execution_time && (
                                <p className="text-xs text-muted-foreground">Executed at {preview.execution_time}</p>
                              )}
                              {preview.error_message && (
                                <p className="text-xs text-red-600">{preview.error_message}</p>
                              )}
                            </div>
                            <Badge variant={
                              preview.status === 'sent' ? 'default' :
                              preview.status === 'sending' ? 'secondary' :
                              preview.status === 'failed' ? 'destructive' :
                              'outline'
                            }>
                              {preview.status === 'sending' ? 'Sending...' : preview.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="results" className="space-y-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-4">Execution Results</h3>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-3xl font-bold text-green-600">
                          {studentPreviews.filter(p => p.status === 'sent').length}
                        </div>
                        <div className="text-sm text-green-700">Successfully Sent</div>
                        <div className="text-xs text-green-600 mt-1">
                          {Math.round((studentPreviews.filter(p => p.status === 'sent').length / selectedLeads.length) * 100)}% success rate
                        </div>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                        <div className="text-3xl font-bold text-red-600">
                          {studentPreviews.filter(p => p.status === 'failed').length}
                        </div>
                        <div className="text-sm text-red-700">Failed</div>
                        {studentPreviews.filter(p => p.status === 'failed').length > 0 && (
                          <Button variant="outline" size="sm" className="mt-2" onClick={retryFailed}>
                            <RotateCcw className="h-3 w-3 mr-1" />
                            Retry
                          </Button>
                        )}
                      </div>
                      <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
                        <div className="text-3xl font-bold text-primary">
                          {Math.round(((studentPreviews.filter(p => p.status === 'sent').length / selectedLeads.length) * 100))}%
                        </div>
                        <div className="text-sm text-primary">vs {bulkSummary?.avg_success_rate}% predicted</div>
                        <div className="text-xs text-muted-foreground mt-1">Performance vs AI prediction</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Next Steps & Follow-up</h4>
                    <div className="space-y-3">
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <h5 className="font-medium mb-2">Recommended Follow-up Actions</h5>
                        <ul className="space-y-1 text-sm">
                          <li>• Monitor response rates over next 24-48 hours</li>
                          <li>• Schedule follow-up actions for non-responders in 3-5 days</li>
                          <li>• Review failed sends and update contact information</li>
                          <li>• Track engagement metrics and optimize future campaigns</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Execution completed for {selectedLeads.length} students
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={onClose}>
                      Close
                    </Button>
                    <Button onClick={onClose}>
                      View Full Report
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