import { CalendarEvent } from '@/types/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { 
  Clock, 
  MapPin, 
  Video, 
  Phone, 
  User, 
  Mail, 
  Edit, 
  Trash2,
  CheckCircle,
  XCircle,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface EventDetailsModalProps {
  event: CalendarEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (event: CalendarEvent) => void;
  onDelete: (eventId: string) => Promise<void>;
  onComplete: (eventId: string, notes?: string) => Promise<void>;
  onCancel: (eventId: string, reason: string) => Promise<void>;
}

const EVENT_TYPE_LABELS = {
  info_session: 'Information Session',
  consultation: 'Consultation',
  interview: 'Interview',
  tour: 'Campus Tour',
  demo: 'Demo Session',
  follow_up: 'Follow-up',
  meeting: 'Meeting',
  custom: 'Custom'
};

const EVENT_COLORS = {
  info_session: 'bg-blue-500',
  consultation: 'bg-green-500',
  interview: 'bg-purple-500',
  tour: 'bg-cyan-500',
  demo: 'bg-pink-500',
  follow_up: 'bg-orange-500',
  meeting: 'bg-indigo-500',
  custom: 'bg-gray-500'
};

export function EventDetailsModal({
  event,
  open,
  onOpenChange,
  onEdit,
  onDelete,
  onComplete,
  onCancel
}: EventDetailsModalProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [completionNotes, setCompletionNotes] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);

  if (!event) return null;

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      setIsDeleting(true);
      await onDelete(event.id);
      toast({
        title: 'Event Deleted',
        description: 'The event has been removed from your calendar.'
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete event.',
        variant: 'destructive'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleComplete = async () => {
    try {
      setIsCompleting(true);
      await onComplete(event.id, completionNotes);
      toast({
        title: 'Event Completed',
        description: 'Meeting has been marked as completed.'
      });
      setShowCompleteDialog(false);
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to complete event.',
        variant: 'destructive'
      });
    } finally {
      setIsCompleting(false);
    }
  };

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      toast({
        title: 'Reason Required',
        description: 'Please provide a reason for cancellation.',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsCancelling(true);
      await onCancel(event.id, cancelReason);
      toast({
        title: 'Event Cancelled',
        description: 'The meeting has been cancelled and attendees will be notified.'
      });
      setShowCancelDialog(false);
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to cancel event.',
        variant: 'destructive'
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const getLocationIcon = () => {
    switch (event.location_type) {
      case 'virtual':
        return <Video className="h-4 w-4" />;
      case 'phone':
        return <Phone className="h-4 w-4" />;
      case 'in_person':
        return <MapPin className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const canJoinMeeting = () => {
    if (event.location_type !== 'virtual' || !event.meeting_link) return false;
    
    const now = new Date();
    const meetingStart = new Date(event.start_time);
    const meetingEnd = new Date(event.end_time);
    
    // Allow joining 15 minutes before and during the meeting
    return now >= new Date(meetingStart.getTime() - 15 * 60000) && now <= meetingEnd;
  };

  if (showCompleteDialog) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Meeting</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Meeting Notes (Optional)</label>
              <Textarea
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
                placeholder="Add notes about this meeting..."
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowCompleteDialog(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleComplete}
                disabled={isCompleting}
              >
                {isCompleting ? 'Completing...' : 'Mark as Complete'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (showCancelDialog) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Meeting</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Cancellation Reason</label>
              <Textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Why is this meeting being cancelled?"
                rows={3}
              />
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-3">
              <p className="text-sm">
                Attendees will be notified of the cancellation (Coming Soon with Outlook integration)
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowCancelDialog(false)}
              >
                Keep Meeting
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleCancel}
                disabled={isCancelling}
              >
                {isCancelling ? 'Cancelling...' : 'Cancel Meeting'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{event.title}</DialogTitle>
              <div className="flex items-center gap-2">
                <Badge className={cn("text-white", EVENT_COLORS[event.type])}>
                  {EVENT_TYPE_LABELS[event.type]}
                </Badge>
                {event.status === 'completed' && (
                  <Badge variant="outline" className="border-green-500 text-green-500">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                )}
                {event.status === 'cancelled' && (
                  <Badge variant="outline" className="border-red-500 text-red-500">
                    <XCircle className="h-3 w-3 mr-1" />
                    Cancelled
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Date & Time */}
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">
                {format(new Date(event.start_time), 'EEEE, MMMM d, yyyy')}
              </p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(event.start_time), 'h:mm a')} - {format(new Date(event.end_time), 'h:mm a')}
                {' '}({event.duration_minutes} minutes)
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3">
            {getLocationIcon()}
            <div className="flex-1">
              <p className="font-medium capitalize">{event.location_type.replace('_', ' ')}</p>
              {event.location_type === 'virtual' && event.meeting_link && (
                <a
                  href={event.meeting_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-1 mt-1"
                >
                  Join meeting
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
              {event.location_type === 'in_person' && event.location_details && (
                <p className="text-sm text-muted-foreground">{event.location_details}</p>
              )}
              {event.meeting_platform && (
                <p className="text-sm text-muted-foreground capitalize">
                  Platform: {event.meeting_platform.replace('_', ' ')}
                </p>
              )}
            </div>
          </div>

          {/* Lead Information */}
          {event.lead_name && (
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">{event.lead_name}</p>
                {event.lead_email && (
                  <a href={`mailto:${event.lead_email}`} className="text-sm text-primary hover:underline flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {event.lead_email}
                  </a>
                )}
                {event.lead_phone && (
                  <p className="text-sm text-muted-foreground">{event.lead_phone}</p>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          {event.description && (
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{event.description}</p>
            </div>
          )}

          {/* Attendees */}
          {event.attendees && event.attendees.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Attendees ({event.attendees.length})</h4>
              <div className="space-y-2">
                {event.attendees.map(attendee => (
                  <div key={attendee.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium">{attendee.name}</p>
                      <p className="text-muted-foreground">{attendee.email}</p>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {attendee.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Meeting Notes (if completed) */}
          {event.status === 'completed' && event.meeting_notes && (
            <div>
              <h4 className="font-medium mb-2">Meeting Notes</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{event.meeting_notes}</p>
            </div>
          )}

          {/* Cancellation Reason */}
          {event.status === 'cancelled' && event.cancelled_reason && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
              <h4 className="font-medium mb-1 text-red-500">Cancellation Reason</h4>
              <p className="text-sm">{event.cancelled_reason}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            {canJoinMeeting() && (
              <Button asChild className="flex-1">
                <a href={event.meeting_link} target="_blank" rel="noopener noreferrer">
                  <Video className="h-4 w-4 mr-2" />
                  Join Meeting
                </a>
              </Button>
            )}
            
            {event.status === 'scheduled' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => onEdit(event)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setShowCompleteDialog(true)}
                  className="flex-1"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setShowCancelDialog(true)}
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </>
            )}

            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
