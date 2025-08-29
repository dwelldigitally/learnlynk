import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Phone, 
  Mail, 
  Calendar, 
  CheckCircle, 
  Trash2, 
  X,
  MessageSquare,
  FileText,
  Clock,
  Zap
} from "lucide-react";

interface BulkActionsToolbarProps {
  selectedCount: number;
  selectedActionType: string;
  onBulkCall: () => void;
  onBulkEmail: (template?: string) => void;
  onBulkSchedule: () => void;
  onBulkComplete: () => void;
  onBulkDelete: () => void;
  onClearSelection: () => void;
  onBulkSMS?: () => void;
  onBulkDocumentRequest?: () => void;
  onBulkFollowUp?: (duration: string) => void;
  onBulkAutomate?: () => void;
}

const EMAIL_TEMPLATES = [
  { value: 'welcome', label: 'Welcome Sequence' },
  { value: 'follow-up', label: 'Follow-up Check' },
  { value: 'application-reminder', label: 'Application Reminder' },
  { value: 'deadline-urgent', label: 'Deadline Alert' },
  { value: 'interview-invite', label: 'Interview Invitation' },
  { value: 'document-request', label: 'Document Request' }
];

const FOLLOW_UP_DURATIONS = [
  { value: '1h', label: 'In 1 hour' },
  { value: '4h', label: 'In 4 hours' },
  { value: '1d', label: 'Tomorrow' },
  { value: '3d', label: 'In 3 days' },
  { value: '1w', label: 'Next week' }
];

export function EnhancedBulkActionsToolbar({
  selectedCount,
  selectedActionType,
  onBulkCall,
  onBulkEmail,
  onBulkSchedule,
  onBulkComplete,
  onBulkDelete,
  onClearSelection,
  onBulkSMS,
  onBulkDocumentRequest,
  onBulkFollowUp,
  onBulkAutomate
}: BulkActionsToolbarProps) {
  const [emailTemplate, setEmailTemplate] = useState<string>('');
  const [followUpDuration, setFollowUpDuration] = useState<string>('');

  const handleBulkEmail = () => {
    onBulkEmail(emailTemplate || undefined);
    setEmailTemplate('');
  };

  const handleBulkFollowUp = () => {
    if (onBulkFollowUp && followUpDuration) {
      onBulkFollowUp(followUpDuration);
      setFollowUpDuration('');
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 bg-background border rounded-lg shadow-lg p-3 max-w-screen-xl overflow-x-auto">
        <Badge variant="secondary" className="mr-2 flex-shrink-0">
          {selectedCount} selected
        </Badge>
        
        {/* Primary Actions */}
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkCall}
          className="flex items-center gap-1 flex-shrink-0"
        >
          <Phone className="h-4 w-4" />
          Call All
        </Button>

        {/* Email with Template Selection */}
        <div className="flex items-center gap-1">
          <Select value={emailTemplate} onValueChange={setEmailTemplate}>
            <SelectTrigger className="w-32 h-8 text-xs">
              <SelectValue placeholder="Template" />
            </SelectTrigger>
            <SelectContent>
              {EMAIL_TEMPLATES.map(template => (
                <SelectItem key={template.value} value={template.value}>
                  {template.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={handleBulkEmail}
            className="flex items-center gap-1"
          >
            <Mail className="h-4 w-4" />
            Email
          </Button>
        </div>

        {/* SMS Action */}
        {onBulkSMS && (
          <Button
            variant="outline"
            size="sm"
            onClick={onBulkSMS}
            className="flex items-center gap-1"
          >
            <MessageSquare className="h-4 w-4" />
            SMS
          </Button>
        )}

        {/* Schedule */}
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkSchedule}
          className="flex items-center gap-1"
        >
          <Calendar className="h-4 w-4" />
          Schedule
        </Button>

        {/* Follow-up with Duration */}
        {onBulkFollowUp && (
          <div className="flex items-center gap-1">
            <Select value={followUpDuration} onValueChange={setFollowUpDuration}>
              <SelectTrigger className="w-28 h-8 text-xs">
                <SelectValue placeholder="When" />
              </SelectTrigger>
              <SelectContent>
                {FOLLOW_UP_DURATIONS.map(duration => (
                  <SelectItem key={duration.value} value={duration.value}>
                    {duration.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkFollowUp}
              disabled={!followUpDuration}
              className="flex items-center gap-1"
            >
              <Clock className="h-4 w-4" />
              Follow-up
            </Button>
          </div>
        )}

        {/* Document Request */}
        {onBulkDocumentRequest && (
          <Button
            variant="outline"
            size="sm"
            onClick={onBulkDocumentRequest}
            className="flex items-center gap-1"
          >
            <FileText className="h-4 w-4" />
            Documents
          </Button>
        )}

        {/* Automate */}
        {onBulkAutomate && (
          <Button
            variant="outline"
            size="sm"
            onClick={onBulkAutomate}
            className="flex items-center gap-1"
          >
            <Zap className="h-4 w-4" />
            Automate
          </Button>
        )}

        {/* Complete */}
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkComplete}
          className="flex items-center gap-1"
        >
          <CheckCircle className="h-4 w-4" />
          Complete
        </Button>

        {/* Delete */}
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkDelete}
          className="flex items-center gap-1 text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>

        {/* Clear Selection */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}