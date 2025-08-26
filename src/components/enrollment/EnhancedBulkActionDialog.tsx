import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Phone, 
  Mail, 
  Calendar, 
  X, 
  User, 
  Brain, 
  BookOpen,
  Sparkles,
  Eye,
  Send
} from 'lucide-react';

import { StudentHistoryPanel } from './StudentHistoryPanel';
import { PlaybookAuditTrail } from './PlaybookAuditTrail';
import { AIRecommendationsPanel } from './AIRecommendationsPanel';

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
    contact_info?: {
      email?: string;
      phone?: string;
    };
    // Journey/Play Traceability
    journey_name?: string;
    stage_name?: string;
    play_name?: string;
    play_category?: string;
    generation_source?: string;
    journey_context?: boolean;
  };
}

interface EnhancedBulkActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: 'call' | 'email' | 'sms' | 'meeting';
  selectedStudents: StudentAction[];
  onExecute: (config: any) => void;
}

// Mock data generators
const generateStudentHistory = (studentId: string) => [
  {
    id: '1',
    type: 'communication' as const,
    timestamp: '2024-08-20T10:00:00Z',
    title: 'Welcome Email Sent',
    description: 'Automated welcome email delivered successfully',
    outcome: 'success' as const,
  },
  {
    id: '2',
    type: 'action' as const,
    timestamp: '2024-08-22T14:30:00Z',
    title: 'Follow-up Call Scheduled',
    description: 'Scheduled follow-up call for program discussion',
    outcome: 'pending' as const,
  },
  {
    id: '3',
    type: 'journey_transition' as const,
    timestamp: '2024-08-23T09:15:00Z',
    title: 'Moved to Consideration Stage',
    description: 'Student progressed in enrollment journey',
    outcome: 'success' as const,
  },
];

const generatePlaybookExecutions = (actionId: string) => [
  {
    id: '1',
    playbook_name: 'High-Yield Prospect Nurturing',
    journey_name: 'MBA Enrollment Journey',
    stage_name: 'Interest Confirmation',
    started_at: '2024-08-20T08:00:00Z',
    status: 'active' as const,
    success_rate: 85,
    steps: [
      {
        id: '1',
        name: 'Send Welcome Email',
        type: 'action' as const,
        status: 'completed' as const,
        timestamp: '2024-08-20T08:05:00Z',
        outcome: 'Email delivered successfully',
      },
      {
        id: '2',
        name: 'Wait 2 Days',
        type: 'delay' as const,
        status: 'completed' as const,
        timestamp: '2024-08-22T08:05:00Z',
      },
      {
        id: '3',
        name: 'Schedule Follow-up Call',
        type: 'action' as const,
        status: 'current' as const,
        timestamp: '2024-08-22T08:10:00Z',
      },
      {
        id: '4',
        name: 'Check Response',
        type: 'condition' as const,
        status: 'pending' as const,
      },
    ],
    performance_metrics: {
      avg_response_time: 4.2,
      completion_rate: 78,
      conversion_impact: 23,
    },
  },
];

const generateAIRecommendations = (actionType: string) => [
  {
    id: '1',
    type: 'message' as const,
    title: 'Personalized Opening Script',
    description: 'AI-generated opening based on student\'s program interest and engagement history',
    confidence_score: 92,
    reasoning: 'Based on this student\'s high yield score and previous interactions with program materials, a consultative approach focusing on career outcomes will be most effective.',
    suggested_content: `Hi [Student Name], I noticed you've been exploring our [Program] materials extensively. Based on your background in [Previous Experience], I'd love to discuss how this program can accelerate your career goals. Are you available for a quick 15-minute call this week?`,
    success_probability: 78,
    estimated_impact: 'high' as const,
  },
  {
    id: '2',
    type: 'timing' as const,
    title: 'Optimal Contact Time',
    description: 'Best time to reach this student based on their activity patterns',
    confidence_score: 87,
    reasoning: 'Student typically engages with emails between 2-4 PM on weekdays and shows higher response rates on Tuesday-Thursday.',
    optimal_timing: 'Tuesday-Thursday, 2:00-4:00 PM EST',
    success_probability: 65,
    estimated_impact: 'medium' as const,
  },
  {
    id: '3',
    type: 'alternative_action' as const,
    title: 'Alternative Approach',
    description: 'Consider a different action type for better results',
    confidence_score: 73,
    reasoning: 'This student has not responded to previous calls but has high email engagement. Consider starting with email.',
    success_probability: 82,
    estimated_impact: 'high' as const,
  },
];

export function EnhancedBulkActionDialog({
  isOpen,
  onClose,
  actionType,
  selectedStudents,
  onExecute
}: EnhancedBulkActionDialogProps) {
  const [actionData, setActionData] = useState({
    subject: '',
    content: '',
    template: '',
    notes: '',
    scheduledDate: '',
    scheduledTime: '',
  });

  const [selectedStudentIndex, setSelectedStudentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('config');

  const getActionConfig = () => {
    switch (actionType) {
      case 'call':
        return {
          title: 'Bulk Call Campaign',
          icon: Phone,
          templates: [
            { id: 'intro', name: 'Introduction Call', content: 'Hi [Name], I wanted to reach out to discuss your interest in our [Program] program...' },
            { id: 'follow_up', name: 'Follow-up Call', content: 'Hi [Name], following up on your application for [Program]...' },
          ],
        };
      case 'email':
        return {
          title: 'Bulk Email Campaign',
          icon: Mail,
          templates: [
            { id: 'welcome', name: 'Welcome Email', content: 'Welcome to [Program]! We\'re excited to help you achieve your goals...' },
            { id: 'reminder', name: 'Application Reminder', content: 'Don\'t forget to complete your application for [Program]...' },
          ],
        };
      case 'meeting':
        return {
          title: 'Bulk Meeting Scheduling',
          icon: Calendar,
          templates: [
            { id: 'consultation', name: 'Program Consultation', content: 'Schedule a consultation to discuss how [Program] can help you...' },
          ],
        };
      default:
        return { title: 'Bulk Action', icon: User, templates: [] };
    }
  };

  const config = getActionConfig();
  const selectedStudent = selectedStudents[selectedStudentIndex];

  // Mock data for selected student
  const studentProfile = selectedStudent ? {
    id: selectedStudent.id,
    name: selectedStudent.metadata?.student_name || 'Student',
    email: selectedStudent.metadata?.contact_info?.email || 'student@example.com',
    phone: selectedStudent.metadata?.contact_info?.phone,
    program: selectedStudent.metadata?.program || 'Unknown Program',
    yield_score: selectedStudent.metadata?.yield_score || 0,
    revenue_potential: 25000,
    current_stage: 'Interest Confirmation',
    journey_name: selectedStudent.metadata?.journey_name,
    last_contact: '3 days ago',
    total_interactions: 8,
    conversion_probability: 67,
  } : null;

  const studentHistory = selectedStudent ? generateStudentHistory(selectedStudent.id) : [];
  const playbookExecutions = selectedStudent ? generatePlaybookExecutions(selectedStudent.id) : [];
  const aiRecommendations = generateAIRecommendations(actionType);

  const studentContexts = selectedStudents.map(student => ({
    id: student.id,
    name: student.metadata?.student_name || 'Student',
    yield_score: student.metadata?.yield_score || 0,
    last_interaction: '2 days ago',
    engagement_level: 'high' as const,
    preferred_channel: 'email' as const,
    timezone: 'EST',
    response_patterns: {
      best_time: '2:00 PM',
      avg_response_time: 4.2,
      preferred_day: 'Tuesday',
    },
  }));

  const handleExecute = () => {
    onExecute({
      actionType,
      students: selectedStudents,
      config: actionData,
    });
    onClose();
  };

  const handleApplyRecommendation = (recommendationId: string, content?: string) => {
    if (content) {
      setActionData(prev => ({ ...prev, content }));
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-full h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center space-x-2">
            <config.icon className="h-5 w-5" />
            <span>{config.title}</span>
            <Badge variant="secondary">{selectedStudents.length} students</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4 flex-shrink-0">
              <TabsTrigger value="config" className="flex items-center space-x-2">
                <Send className="h-4 w-4" />
                <span>Configuration</span>
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex items-center space-x-2">
                <Brain className="h-4 w-4" />
                <span>AI Insights</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Student History</span>
              </TabsTrigger>
              <TabsTrigger value="audit" className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>Audit Trail</span>
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="config" className="h-full">
                <div className="grid grid-cols-2 gap-6 h-full">
                  {/* Configuration Panel */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Template</Label>
                      <Select onValueChange={(value) => {
                        const template = config.templates.find(t => t.id === value);
                        if (template) {
                          setActionData(prev => ({ 
                            ...prev, 
                            template: template.name,
                            content: template.content 
                          }));
                        }
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a template" />
                        </SelectTrigger>
                        <SelectContent>
                          {config.templates.map(template => (
                            <SelectItem key={template.id} value={template.id}>
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {actionType === 'email' && (
                      <div className="space-y-2">
                        <Label>Subject Line</Label>
                        <Input
                          value={actionData.subject}
                          onChange={(e) => setActionData(prev => ({ ...prev, subject: e.target.value }))}
                          placeholder="Enter email subject"
                        />
                      </div>
                    )}

                    {actionType === 'meeting' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Date</Label>
                          <Input
                            type="date"
                            value={actionData.scheduledDate}
                            onChange={(e) => setActionData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Time</Label>
                          <Input
                            type="time"
                            value={actionData.scheduledTime}
                            onChange={(e) => setActionData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>Content/Script</Label>
                      <Textarea
                        value={actionData.content}
                        onChange={(e) => setActionData(prev => ({ ...prev, content: e.target.value }))}
                        placeholder={`Enter your ${actionType} content here...`}
                        className="h-32"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Notes</Label>
                      <Textarea
                        value={actionData.notes}
                        onChange={(e) => setActionData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Add any additional notes..."
                        className="h-20"
                      />
                    </div>
                  </div>

                  {/* Preview Panel */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Eye className="h-4 w-4" />
                        <span className="font-medium">Preview</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Label className="text-sm">Student:</Label>
                        <Select value={selectedStudentIndex.toString()} onValueChange={(value) => setSelectedStudentIndex(parseInt(value))}>
                          <SelectTrigger className="w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedStudents.map((student, index) => (
                              <SelectItem key={student.id} value={index.toString()}>
                                {student.metadata?.student_name || `Student ${index + 1}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                      <div className="text-sm font-medium">Preview for {selectedStudent?.metadata?.student_name || 'Student'}</div>
                      {actionType === 'email' && actionData.subject && (
                        <div>
                          <div className="text-xs text-muted-foreground">Subject:</div>
                          <div className="text-sm font-medium">{actionData.subject}</div>
                        </div>
                      )}
                      <div>
                        <div className="text-xs text-muted-foreground">Content:</div>
                        <div className="text-sm whitespace-pre-wrap">
                          {actionData.content || 'No content yet...'}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Affected Students ({selectedStudents.length})</div>
                      <ScrollArea className="h-48 border rounded">
                        <div className="p-3 space-y-2">
                          {selectedStudents.map((student, index) => (
                            <div key={student.id} className="flex items-center justify-between p-2 bg-background rounded">
                              <div>
                                <div className="font-medium text-sm">{student.metadata?.student_name || `Student ${index + 1}`}</div>
                                <div className="text-xs text-muted-foreground">{student.metadata?.program}</div>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {student.metadata?.yield_score || 0}% yield
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ai" className="h-full">
                <AIRecommendationsPanel
                  recommendations={aiRecommendations}
                  students={studentContexts}
                  selectedActionType={actionType}
                  onApplyRecommendation={handleApplyRecommendation}
                />
              </TabsContent>

              <TabsContent value="history" className="h-full">
                <div className="grid grid-cols-3 gap-6 h-full">
                  <div className="col-span-2">
                    {studentProfile && (
                      <StudentHistoryPanel
                        student={studentProfile}
                        history={studentHistory}
                      />
                    )}
                  </div>
                  <div>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm">Select Student</Label>
                        <Select value={selectedStudentIndex.toString()} onValueChange={(value) => setSelectedStudentIndex(parseInt(value))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedStudents.map((student, index) => (
                              <SelectItem key={student.id} value={index.toString()}>
                                {student.metadata?.student_name || `Student ${index + 1}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="audit" className="h-full">
                <PlaybookAuditTrail
                  executions={playbookExecutions}
                  currentActionId={selectedStudent?.id}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <div className="flex justify-between items-center pt-4 border-t flex-shrink-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setActiveTab('ai')}>
              <Sparkles className="h-4 w-4 mr-2" />
              Get AI Suggestions
            </Button>
            <Button 
              onClick={handleExecute}
              disabled={!actionData.content}
              className="min-w-32"
            >
              Execute {actionType} for {selectedStudents.length} students
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}