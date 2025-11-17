import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Video, MapPin, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import { BookMeetingFormData, MeetingType, LocationType } from '@/types/calendar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface BookMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBooking: (data: BookMeetingFormData) => Promise<void>;
  defaultDate?: Date;
  defaultTime?: string;
}

type BookingStep = 'lead' | 'details' | 'datetime' | 'location' | 'attendees' | 'review';

export function BookMeetingDialog({
  open,
  onOpenChange,
  onBooking,
  defaultDate,
  defaultTime
}: BookMeetingDialogProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<BookingStep>('lead');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Partial<BookMeetingFormData>>({
    title: '',
    type: 'consultation',
    date: defaultDate || new Date(),
    start_time: defaultTime || '09:00',
    duration_minutes: 60,
    location_type: 'virtual',
    attendees: [],
    reminders: [
      { type: 'email', time_before_minutes: 60, sent: false }
    ]
  });

  const steps: BookingStep[] = ['lead', 'details', 'datetime', 'location', 'attendees', 'review'];

  const handleNext = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await onBooking(formData as BookMeetingFormData);
      toast({
        title: 'Meeting Booked',
        description: 'Your meeting has been scheduled successfully.'
      });
      onOpenChange(false);
      resetForm();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to book meeting. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCurrentStep('lead');
    setFormData({
      title: '',
      type: 'consultation',
      date: defaultDate || new Date(),
      start_time: defaultTime || '09:00',
      duration_minutes: 60,
      location_type: 'virtual',
      attendees: [],
      reminders: [
        { type: 'email', time_before_minutes: 60, sent: false }
      ]
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'lead':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="lead-search">Select Lead (Optional)</Label>
              <Input
                id="lead-search"
                placeholder="Search for a lead..."
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Or leave empty for internal meetings
              </p>
            </div>
            
            <div className="border rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium">Recent Leads</p>
              {['Sarah Johnson - MBA Program', 'Mike Chen - Computer Science', 'Emma Wilson - Nursing'].map(lead => (
                <button
                  key={lead}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-accent transition-colors text-sm"
                  onClick={() => {
                    setFormData({ ...formData, title: `Meeting with ${lead.split(' - ')[0]}` });
                    handleNext();
                  }}
                >
                  {lead}
                </button>
              ))}
            </div>
          </div>
        );

      case 'details':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Meeting Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter meeting title"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="type">Meeting Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as MeetingType })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info_session">Information Session</SelectItem>
                  <SelectItem value="consultation">Consultation Call</SelectItem>
                  <SelectItem value="tour">Program Tour</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="demo">Demo Session</SelectItem>
                  <SelectItem value="follow_up">Follow-up Meeting</SelectItem>
                  <SelectItem value="meeting">General Meeting</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description/Agenda</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add meeting description or agenda..."
                className="mt-2"
                rows={4}
              />
            </div>
          </div>
        );

      case 'datetime':
        return (
          <div className="space-y-4">
            <div>
              <Label>Select Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-2",
                      !formData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => date && setFormData({ ...formData, date })}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-time">Start Time</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="duration">Duration</Label>
                <Select
                  value={formData.duration_minutes?.toString()}
                  onValueChange={(value) => setFormData({ ...formData, duration_minutes: parseInt(value) })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-muted/50">
              <p className="text-sm font-medium mb-2">Suggested Time Slots</p>
              <div className="space-y-1">
                {['9:00 AM - Available', '11:00 AM - Available', '2:00 PM - Available'].map(slot => (
                  <button
                    key={slot}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-background transition-colors text-sm"
                    onClick={() => {
                      const time = slot.split(' - ')[0];
                      const [hours, minutes] = time.split(':');
                      const hour24 = time.includes('PM') ? (parseInt(hours) + 12) : parseInt(hours);
                      setFormData({ ...formData, start_time: `${hour24.toString().padStart(2, '0')}:${minutes.split(' ')[0]}` });
                    }}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'location':
        return (
          <div className="space-y-4">
            <div>
              <Label>Meeting Format</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <button
                  onClick={() => setFormData({ ...formData, location_type: 'virtual' })}
                  className={cn(
                    "p-4 rounded-lg border-2 transition-all",
                    formData.location_type === 'virtual'
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <Video className="h-6 w-6 mx-auto mb-2" />
                  <p className="text-sm font-medium">Virtual</p>
                </button>

                <button
                  onClick={() => setFormData({ ...formData, location_type: 'in_person' })}
                  className={cn(
                    "p-4 rounded-lg border-2 transition-all",
                    formData.location_type === 'in_person'
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <MapPin className="h-6 w-6 mx-auto mb-2" />
                  <p className="text-sm font-medium">In Person</p>
                </button>

                <button
                  onClick={() => setFormData({ ...formData, location_type: 'phone' })}
                  className={cn(
                    "p-4 rounded-lg border-2 transition-all",
                    formData.location_type === 'phone'
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <Phone className="h-6 w-6 mx-auto mb-2" />
                  <p className="text-sm font-medium">Phone</p>
                </button>
              </div>
            </div>

            {formData.location_type === 'virtual' && (
              <div>
                <Label htmlFor="platform">Platform</Label>
                <Select
                  value={formData.meeting_platform}
                  onValueChange={(value) => setFormData({ ...formData, meeting_platform: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zoom">Zoom</SelectItem>
                    <SelectItem value="teams">Microsoft Teams</SelectItem>
                    <SelectItem value="google_meet">Google Meet</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-2">
                  Meeting link will be generated automatically (Coming Soon)
                </p>
              </div>
            )}

            {formData.location_type === 'in_person' && (
              <div>
                <Label htmlFor="location">Location Details</Label>
                <Input
                  id="location"
                  value={formData.location_details || ''}
                  onChange={(e) => setFormData({ ...formData, location_details: e.target.value })}
                  placeholder="e.g., Main Campus, Room 205"
                  className="mt-2"
                />
              </div>
            )}

            {formData.location_type === 'phone' && (
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.location_details || ''}
                  onChange={(e) => setFormData({ ...formData, location_details: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                  className="mt-2"
                />
              </div>
            )}
          </div>
        );

      case 'attendees':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="attendees">Add Attendees (Optional)</Label>
              <Input
                id="attendees"
                placeholder="Enter email addresses..."
                className="mt-2"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value) {
                    setFormData({
                      ...formData,
                      attendees: [...(formData.attendees || []), e.currentTarget.value]
                    });
                    e.currentTarget.value = '';
                  }
                }}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Press Enter to add each email
              </p>
            </div>

            {formData.attendees && formData.attendees.length > 0 && (
              <div className="border rounded-lg p-3 space-y-2">
                {formData.attendees.map((email, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-3 py-2 bg-muted rounded-md"
                  >
                    <span className="text-sm">{email}</span>
                    <button
                      onClick={() => {
                        const newAttendees = [...(formData.attendees || [])];
                        newAttendees.splice(idx, 1);
                        setFormData({ ...formData, attendees: newAttendees });
                      }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t pt-4">
              <Label className="text-sm font-medium">Reminder Settings</Label>
              <div className="space-y-2 mt-3">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span>Email reminder 1 hour before</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded" />
                  <span>SMS reminder 15 minutes before</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span>In-app notification</span>
                </label>
              </div>
            </div>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-4">
            <div className="border rounded-lg p-4 space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Title</p>
                <p className="font-medium">{formData.title || 'Untitled Meeting'}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="font-medium capitalize">{formData.type?.replace('_', ' ')}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Date & Time</p>
                <p className="font-medium">
                  {formData.date && format(formData.date, 'PPP')} at {formData.start_time}
                </p>
                <p className="text-sm text-muted-foreground">Duration: {formData.duration_minutes} minutes</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium capitalize">
                  {formData.location_type?.replace('_', ' ')}
                  {formData.location_type === 'virtual' && formData.meeting_platform && 
                    ` (${formData.meeting_platform})`}
                  {formData.location_details && ` - ${formData.location_details}`}
                </p>
              </div>

              {formData.attendees && formData.attendees.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground">Attendees</p>
                  <p className="font-medium">{formData.attendees.length} attendee(s)</p>
                </div>
              )}

              {formData.description && (
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="text-sm">{formData.description}</p>
                </div>
              )}
            </div>

            <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
              <p className="text-sm">
                <span className="font-medium">Note:</span> Calendar invites and email notifications will be sent automatically (Coming Soon with Outlook integration)
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'lead': return 'Select Lead';
      case 'details': return 'Meeting Details';
      case 'datetime': return 'Date & Time';
      case 'location': return 'Location';
      case 'attendees': return 'Attendees & Reminders';
      case 'review': return 'Review & Confirm';
      default: return '';
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'lead': return true; // Optional
      case 'details': return !!formData.title && !!formData.type;
      case 'datetime': return !!formData.date && !!formData.start_time && !!formData.duration_minutes;
      case 'location': return !!formData.location_type;
      case 'attendees': return true; // Optional
      case 'review': return true;
      default: return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getStepTitle()}</DialogTitle>
          <div className="flex items-center gap-2 mt-4">
            {steps.map((step, idx) => (
              <div
                key={step}
                className={cn(
                  "flex-1 h-2 rounded-full transition-colors",
                  steps.indexOf(currentStep) >= idx
                    ? "bg-primary"
                    : "bg-muted"
                )}
              />
            ))}
          </div>
        </DialogHeader>

        <div className="py-4">
          {renderStepContent()}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 'lead'}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep === 'review' ? (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Booking...' : 'Confirm & Book'}
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={!canProceed()}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
