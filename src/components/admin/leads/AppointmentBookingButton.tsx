import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Video, MapPin, Phone, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format, addDays, setHours, setMinutes } from 'date-fns';

interface AppointmentBookingButtonProps {
  leadId: string;
  leadName?: string;
  leadEmail?: string;
  leadPhone?: string;
  className?: string;
  onBooked?: () => void;
}

export function AppointmentBookingButton({ 
  leadId, 
  leadName,
  leadEmail,
  leadPhone,
  className,
  onBooked
}: AppointmentBookingButtonProps) {
  const { toast } = useToast();
  const [isBooking, setIsBooking] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Form state
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [meetingType, setMeetingType] = useState<string>('consultation');
  const [locationType, setLocationType] = useState<string>('virtual');
  const [title, setTitle] = useState('');

  // Generate next 14 days for date selection
  const dateOptions = Array.from({ length: 14 }, (_, i) => {
    const date = addDays(new Date(), i + 1);
    return {
      value: format(date, 'yyyy-MM-dd'),
      label: format(date, 'EEEE, MMM d')
    };
  });

  // Generate time slots (9 AM - 5 PM, 30-min increments)
  const timeSlots = [];
  for (let hour = 9; hour < 17; hour++) {
    for (let min = 0; min < 60; min += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      const label = format(setMinutes(setHours(new Date(), hour), min), 'h:mm a');
      timeSlots.push({ value: time, label });
    }
  }

  const getLocationIcon = (location: string) => {
    switch (location) {
      case 'virtual': return <Video className="h-4 w-4" />;
      case 'campus': return <MapPin className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const resetForm = () => {
    setSelectedDate('');
    setSelectedTime('');
    setMeetingType('consultation');
    setLocationType('virtual');
    setTitle('');
  };

  const bookAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: 'Missing Information',
        description: 'Please select a date and time',
        variant: 'destructive'
      });
      return;
    }

    setIsBooking(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create start and end times
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const startDate = new Date(selectedDate);
      startDate.setHours(hours, minutes, 0, 0);
      
      const endDate = new Date(startDate);
      endDate.setMinutes(endDate.getMinutes() + 30); // 30 minute default duration

      const eventTitle = title || `${meetingType.replace('_', ' ')} with ${leadName || 'Lead'}`;

      // Insert into calendar_events table
      const { error } = await supabase.from('calendar_events').insert({
        user_id: user.id,
        lead_id: leadId,
        title: eventTitle,
        type: meetingType,
        start_time: startDate.toISOString(),
        end_time: endDate.toISOString(),
        location_type: locationType,
        lead_name: leadName || null,
        lead_email: leadEmail || null,
        lead_phone: leadPhone || null,
        status: 'scheduled',
        duration_minutes: 30
      });

      if (error) throw error;
      
      toast({
        title: 'Appointment Booked',
        description: `${meetingType.replace('_', ' ')} scheduled for ${format(startDate, 'MMM d')} at ${format(startDate, 'h:mm a')}`,
      });
      
      resetForm();
      setDialogOpen(false);
      onBooked?.();
    } catch (error: any) {
      toast({
        title: 'Booking Failed',
        description: error.message || 'There was an error booking the appointment.',
        variant: 'destructive'
      });
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={(open) => {
      setDialogOpen(open);
      if (!open) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <Calendar className="h-4 w-4 mr-2" />
          Book Appointment
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Title (optional) */}
          <div className="space-y-2">
            <Label htmlFor="title">Title (optional)</Label>
            <Input
              id="title"
              placeholder="e.g., Program consultation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Meeting Type */}
          <div className="space-y-2">
            <Label>Meeting Type</Label>
            <Select value={meetingType} onValueChange={setMeetingType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="consultation">Consultation</SelectItem>
                <SelectItem value="info_session">Info Session</SelectItem>
                <SelectItem value="tour">Campus Tour</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location Type */}
          <div className="space-y-2">
            <Label>Location</Label>
            <Select value={locationType} onValueChange={setLocationType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="virtual">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    Virtual (Video Call)
                  </div>
                </SelectItem>
                <SelectItem value="campus">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    On Campus
                  </div>
                </SelectItem>
                <SelectItem value="phone">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Call
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label>Date</Label>
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger>
                <SelectValue placeholder="Select a date" />
              </SelectTrigger>
              <SelectContent>
                {dateOptions.map((date) => (
                  <SelectItem key={date.value} value={date.value}>
                    {date.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label>Time</Label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger>
                <SelectValue placeholder="Select a time" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time.value} value={time.value}>
                    {time.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Summary */}
          {selectedDate && selectedTime && (
            <div className="p-3 bg-muted/50 rounded-lg space-y-2">
              <div className="text-sm font-medium">Appointment Summary</div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {timeSlots.find(t => t.value === selectedTime)?.label} (30 min)
                </div>
                <div className="flex items-center gap-2">
                  {getLocationIcon(locationType)}
                  <span className="capitalize">{locationType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {leadName || 'Lead'}
                </div>
              </div>
            </div>
          )}

          {/* Book Button */}
          <Button 
            onClick={bookAppointment} 
            disabled={isBooking || !selectedDate || !selectedTime}
            className="w-full"
          >
            {isBooking ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Booking...
              </>
            ) : (
              'Confirm Booking'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}