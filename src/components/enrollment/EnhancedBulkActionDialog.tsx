import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Phone, Mail, Calendar, Clock, Users, Send, Eye, Star, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

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
      phone?: string;
      email?: string;
    };
    journey_context?: boolean;
    stage_name?: string;
  };
}

interface EnhancedBulkActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: 'call' | 'email' | 'schedule' | 'sms' | 'meeting';
  selectedActions: StudentAction[];
  onExecute: (actions: StudentAction[], customMessage?: string) => void;
}

export function EnhancedBulkActionDialog({
  isOpen,
  onClose,
  actionType,
  selectedActions,
  onExecute
}: EnhancedBulkActionDialogProps) {
  const { toast } = useToast();
  const [actionData, setActionData] = useState({
    subject: '',
    content: '',
    template: '',
    scheduledTime: '',
    duration: '30',
    notes: ''
  });
  const [showPreview, setShowPreview] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);

  const getActionConfig = () => {
    switch (actionType) {
      case 'call':
        return {
          title: 'Bulk Call Campaign',
          icon: Phone,
          color: 'text-primary',
          templates: [
            { 
              id: 'intro', 
              name: 'Introduction Call', 
              script: 'Hi {student_name}, this is [Your Name] from [Institution]. I\'m calling about your {program} application. How are you today?\n\nI wanted to personally reach out to see if you have any questions about our program and to discuss your next steps in the enrollment process.\n\nDo you have a few minutes to chat about your educational goals?' 
            },
            { 
              id: 'followup', 
              name: 'Follow-up Call', 
              script: 'Hi {student_name}, this is [Your Name] following up on your interest in our {program} program.\n\nI wanted to check in and see if you\'ve had a chance to review the information we sent, and if you have any questions about the application process or program details.\n\nHow can I best support you in moving forward with your enrollment?' 
            },
            { 
              id: 'reminder', 
              name: 'Deadline Reminder', 
              script: 'Hi {student_name}, this is [Your Name] from [Institution]. I\'m calling with a friendly reminder about your {program} application.\n\nI want to make sure you don\'t miss any important deadlines. Do you have everything you need to complete your application, or is there anything I can help you with today?' 
            }
          ]
        };
      case 'email':
        return {
          title: 'Bulk Email Campaign',
          icon: Mail,
          color: 'text-primary',
          templates: [
            { 
              id: 'welcome', 
              name: 'Welcome Email', 
              content: 'Dear {student_name},\n\nThank you for your interest in our {program} program! We\'re excited about the possibility of having you join our academic community.\n\nI wanted to personally reach out to:\n• Answer any questions you might have about the program\n• Discuss your academic and career goals\n• Help guide you through the enrollment process\n\nPlease don\'t hesitate to reach out if you need any assistance.\n\nBest regards,\n[Your Name]' 
            },
            { 
              id: 'status', 
              name: 'Status Update', 
              content: 'Dear {student_name},\n\nI wanted to provide you with an update on your {program} application status.\n\nWe\'ve received your application and our admissions team is currently reviewing it. Here\'s what happens next:\n\n• Application review (typically 2-3 weeks)\n• Interview scheduling (if required)\n• Final admission decision\n\nIf you have any questions during this process, please feel free to contact me directly.\n\nBest regards,\n[Your Name]' 
            },
            { 
              id: 'reminder', 
              name: 'Action Reminder', 
              content: 'Dear {student_name},\n\nI hope this email finds you well. I\'m reaching out regarding your {program} application.\n\nTo keep your application moving forward, we need:\n• [Specific action items]\n• [Any missing documents]\n• [Next steps]\n\nThe deadline for these items is [date]. Please let me know if you need any assistance completing these requirements.\n\nI\'m here to help make this process as smooth as possible for you.\n\nBest regards,\n[Your Name]' 
            }
          ]
        };
      case 'schedule':
      case 'meeting':
        return {
          title: 'Bulk Meeting Scheduler',
          icon: Calendar,
          color: 'text-primary',
          templates: [
            { 
              id: 'consultation', 
              name: 'Program Consultation', 
              content: 'Schedule a personalized consultation to discuss your {program} application and answer any questions you may have about the program, career opportunities, and enrollment process.' 
            },
            { 
              id: 'interview', 
              name: 'Admission Interview', 
              content: 'Schedule your admission interview for the {program} program. This is an opportunity for us to get to know you better and for you to learn more about what makes our program unique.' 
            },
            { 
              id: 'orientation', 
              name: 'Program Orientation', 
              content: 'Join our {program} orientation session to meet faculty, current students, and learn about campus resources. This session will help you prepare for success in your academic journey.' 
            }
          ]
        };
      case 'sms':
        return {
          title: 'Bulk SMS Campaign',
          icon: MessageSquare,
          color: 'text-primary',
          templates: [
            { 
              id: 'quick_check', 
              name: 'Quick Check-in', 
              content: 'Hi {student_name}! Just checking in about your {program} application. Any questions? Reply YES if you\'d like me to call you.' 
            },
            { 
              id: 'reminder', 
              name: 'Deadline Reminder', 
              content: 'Hi {student_name}, friendly reminder about your {program} application deadline. Need help? Reply HELP for assistance.' 
            },
            { 
              id: 'next_steps', 
              name: 'Next Steps', 
              content: 'Hi {student_name}! Ready for the next step in your {program} journey? We\'re here to help. Reply CALL to schedule a conversation.' 
            }
          ]
        };
      default:
        return { title: '', icon: Phone, color: '', templates: [] };
    }
  };

  const config = getActionConfig();
  const IconComponent = config.icon;

  const handleTemplateSelect = (templateId: string) => {
    const template = config.templates.find(t => t.id === templateId);
    if (template) {
      setActionData(prev => ({
        ...prev,
        template: templateId,
        subject: actionType === 'email' ? `Your ${selectedActions[0]?.metadata?.program || 'Program'} Application` : '',
        content: (template as any).content || (template as any).script || ''
      }));
    }
  };

  const getPreviewContent = (student: StudentAction | undefined) => {
    if (!student || !actionData.content) {
      return 'Select a template to see personalized preview';
    }
    
    return actionData.content
      .replace(/{student_name}/g, student.metadata?.student_name || 'Student')
      .replace(/{program}/g, student.metadata?.program || 'Program');
  };

  const handleExecute = async () => {
    if (!actionData.content || selectedActions.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select a template and ensure content is provided.",
        variant: "destructive"
      });
      return;
    }

    setIsExecuting(true);
    
    try {
      // Execute the actions
      await onExecute(selectedActions, actionData.content);
      
      toast({
        title: "Actions Executed Successfully",
        description: `${actionType} campaign launched for ${selectedActions.length} students.`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Execution Failed",
        description: "There was an error executing the bulk action. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <IconComponent className={`h-5 w-5 ${config.color}`} />
            <span>{config.title}</span>
            <Badge variant="secondary">{selectedActions.length} students</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
          {/* Configuration Panel */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="template">Choose Template</Label>
              <Select value={actionData.template} onValueChange={handleTemplateSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
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

            {(actionType === 'email') && (
              <div>
                <Label htmlFor="subject">Email Subject</Label>
                <Input
                  id="subject"
                  value={actionData.subject}
                  onChange={(e) => setActionData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Enter email subject"
                />
              </div>
            )}

            {(actionType === 'schedule' || actionType === 'meeting') && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="scheduledTime">Meeting Time</Label>
                  <Input
                    id="scheduledTime"
                    type="datetime-local"
                    value={actionData.scheduledTime}
                    onChange={(e) => setActionData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Select value={actionData.duration} onValueChange={(value) => setActionData(prev => ({ ...prev, duration: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="content">
                {actionType === 'call' ? 'Call Script' : 
                 actionType === 'email' ? 'Email Content' : 
                 actionType === 'sms' ? 'SMS Message' : 
                 'Meeting Description'}
              </Label>
              <Textarea
                id="content"
                value={actionData.content}
                onChange={(e) => setActionData(prev => ({ ...prev, content: e.target.value }))}
                placeholder={`Enter ${actionType} content...`}
                rows={10}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use {"{student_name}"} and {"{program}"} for personalization
              </p>
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={actionData.notes}
                onChange={(e) => setActionData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any additional notes for this action..."
                rows={3}
              />
            </div>
          </div>

          {/* Preview Panel */}
          <div className="border border-border rounded-lg">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Preview & Students</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center space-x-1"
                >
                  <Eye className="h-4 w-4" />
                  <span>{showPreview ? 'Hide' : 'Show'} Preview</span>
                </Button>
              </div>
            </div>

            <ScrollArea className="h-[500px]">
              <div className="p-4 space-y-4">
                {showPreview && actionData.content && selectedActions.length > 0 && (
                  <div className="bg-muted/50 p-4 rounded border">
                    <h4 className="font-medium text-sm mb-3 flex items-center">
                      <IconComponent className="h-4 w-4 mr-2" />
                      Preview for {selectedActions[0]?.metadata?.student_name || 'Student'}:
                    </h4>
                    {(actionType === 'email') && actionData.subject && (
                      <div className="mb-3 p-2 bg-background rounded border">
                        <p className="text-sm font-medium text-muted-foreground">Subject:</p>
                        <p className="text-sm">{actionData.subject}</p>
                      </div>
                    )}
                    <div className="text-sm whitespace-pre-wrap bg-background p-3 rounded border">
                      {getPreviewContent(selectedActions[0])}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-sm mb-3 flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    Selected Students ({selectedActions.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedActions.map(action => (
                      <div key={action.id} className="flex items-center justify-between p-3 bg-muted/30 rounded text-sm border">
                        <div className="flex-1">
                          <div className="font-medium flex items-center gap-2">
                            {action.metadata?.student_name || 'Student'}
                            {action.metadata?.yield_score && action.metadata.yield_score >= 70 && (
                              <Star className="h-3 w-3 text-yellow-500" />
                            )}
                          </div>
                          <div className="text-muted-foreground">{action.metadata?.program || 'Program'}</div>
                          {action.metadata?.journey_context && (
                            <Badge variant="outline" className="text-xs mt-1">
                              {action.metadata.stage_name || 'Journey Stage'}
                            </Badge>
                          )}
                        </div>
                        <div className="text-right">
                          {action.metadata?.yield_score && (
                            <div className="text-xs text-muted-foreground">
                              Score: {action.metadata.yield_score}%
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground">
                            Due: {format(new Date(action.scheduled_at), 'MMM d, h:mm a')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            {selectedActions.length > 0 ? (
              <>This will {actionType} {selectedActions.length} student{selectedActions.length !== 1 ? 's' : ''}</>
            ) : (
              <>No students selected</>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={onClose} disabled={isExecuting}>
              Cancel
            </Button>
            <Button 
              onClick={handleExecute}
              disabled={!actionData.content || selectedActions.length === 0 || isExecuting}
              className="flex items-center space-x-1"
            >
              <Send className="h-4 w-4" />
              <span>{isExecuting ? 'Executing...' : `Execute ${config.title}`}</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}