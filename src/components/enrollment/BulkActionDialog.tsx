import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Phone, Mail, Calendar, Clock, Users, Send, Eye } from 'lucide-react';
import { format } from 'date-fns';

interface ActionQueueItem {
  id: string;
  student_name: string;
  program: string;
  yield_score: number;
  suggested_action: string;
  sla_due_at: string;
}

interface BulkActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: 'call' | 'email' | 'schedule' | null;
  selectedActions: ActionQueueItem[];
  onExecute: (actionData: any) => void;
}

export function BulkActionDialog({
  isOpen,
  onClose,
  actionType,
  selectedActions,
  onExecute
}: BulkActionDialogProps) {
  const [actionData, setActionData] = useState({
    subject: '',
    content: '',
    template: '',
    scheduledTime: '',
    duration: '30',
    notes: ''
  });
  const [showPreview, setShowPreview] = useState(false);

  const getActionConfig = () => {
    switch (actionType) {
      case 'call':
        return {
          title: 'Bulk Call Campaign',
          icon: Phone,
          color: 'text-blue-600',
          templates: [
            { id: 'intro', name: 'Introduction Call', script: 'Hi {student_name}, this is calling about your {program} application...' },
            { id: 'followup', name: 'Follow-up Call', script: 'Hi {student_name}, following up on your interest in {program}...' },
            { id: 'reminder', name: 'Deadline Reminder', script: 'Hi {student_name}, friendly reminder about your {program} application deadline...' }
          ]
        };
      case 'email':
        return {
          title: 'Bulk Email Campaign',
          icon: Mail,
          color: 'text-green-600',
          templates: [
            { id: 'welcome', name: 'Welcome Email', content: 'Dear {student_name},\n\nWelcome to our {program} program...' },
            { id: 'status', name: 'Status Update', content: 'Dear {student_name},\n\nWe wanted to update you on your {program} application...' },
            { id: 'reminder', name: 'Action Reminder', content: 'Dear {student_name},\n\nThis is a friendly reminder about your {program} application...' }
          ]
        };
      case 'schedule':
        return {
          title: 'Bulk Meeting Scheduler',
          icon: Calendar,
          color: 'text-purple-600',
          templates: [
            { id: 'consultation', name: 'Program Consultation', content: 'Schedule a consultation to discuss your {program} application' },
            { id: 'interview', name: 'Admission Interview', content: 'Schedule your admission interview for {program}' },
            { id: 'orientation', name: 'Program Orientation', content: 'Join our {program} orientation session' }
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
        subject: actionType === 'email' ? `Re: Your ${selectedActions[0]?.program} Application` : '',
        content: (template as any).content || (template as any).script || ''
      }));
    }
  };

  const getPreviewContent = (student: ActionQueueItem) => {
    return actionData.content
      .replace(/{student_name}/g, student.student_name)
      .replace(/{program}/g, student.program);
  };

  const handleExecute = () => {
    const executionData = {
      actionType,
      selectedActions,
      ...actionData,
      timestamp: new Date().toISOString()
    };
    
    onExecute(executionData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden" aria-describedby="bulk-action-description">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <IconComponent className={`h-5 w-5 ${config.color}`} />
            <span>{config.title}</span>
            <Badge variant="secondary">{selectedActions.length} students</Badge>
          </DialogTitle>
          <div id="bulk-action-description" className="text-sm text-muted-foreground">
            Configure and execute bulk actions for selected students
          </div>
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

            {actionType === 'email' && (
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

            {actionType === 'schedule' && (
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
                {actionType === 'call' ? 'Call Script' : actionType === 'email' ? 'Email Content' : 'Meeting Description'}
              </Label>
              <Textarea
                id="content"
                value={actionData.content}
                onChange={(e) => setActionData(prev => ({ ...prev, content: e.target.value }))}
                placeholder={`Enter ${actionType} content...`}
                rows={8}
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
                <h3 className="font-medium">Preview & Affected Students</h3>
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
                {showPreview && actionData.content && (
                  <div className="bg-muted/50 p-3 rounded border">
                    <h4 className="font-medium text-sm mb-2">Preview for {selectedActions[0]?.student_name}:</h4>
                    {actionType === 'email' && actionData.subject && (
                      <p className="text-sm font-medium mb-1">Subject: {actionData.subject}</p>
                    )}
                    <div className="text-sm whitespace-pre-wrap">
                      {getPreviewContent(selectedActions[0])}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    Students to Contact ({selectedActions.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedActions.map(action => (
                      <div key={action.id} className="flex items-center justify-between p-2 bg-muted/30 rounded text-sm">
                        <div>
                          <div className="font-medium">{action.student_name}</div>
                          <div className="text-muted-foreground">{action.program}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">
                            Score: {action.yield_score}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Due: {format(new Date(action.sla_due_at), 'MMM d')}
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
            This will {actionType} {selectedActions.length} student{selectedActions.length !== 1 ? 's' : ''}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleExecute}
              disabled={!actionData.content}
              className="flex items-center space-x-1"
            >
              <Send className="h-4 w-4" />
              <span>Execute {config.title}</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}