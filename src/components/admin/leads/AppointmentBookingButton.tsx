import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Video, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AppointmentSlot {
  id: string;
  date: string;
  time: string;
  duration: number;
  type: 'info_session' | 'consultation' | 'interview' | 'tour';
  advisor: string;
  location: 'virtual' | 'campus' | 'phone';
  available: boolean;
}

interface AppointmentBookingButtonProps {
  leadId: string;
  className?: string;
}

export function AppointmentBookingButton({ leadId, className }: AppointmentBookingButtonProps) {
  const { toast } = useToast();
  const [selectedSlot, setSelectedSlot] = useState<AppointmentSlot | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Demo appointment slots
  const availableSlots: AppointmentSlot[] = [
    {
      id: '1',
      date: '2024-01-24',
      time: '10:00 AM',
      duration: 30,
      type: 'consultation',
      advisor: 'Sarah Johnson',
      location: 'virtual',
      available: true
    },
    {
      id: '2',
      date: '2024-01-24',
      time: '2:00 PM',
      duration: 60,
      type: 'info_session',
      advisor: 'Mike Chen',
      location: 'campus',
      available: true
    },
    {
      id: '3',
      date: '2024-01-25',
      time: '11:00 AM',
      duration: 45,
      type: 'tour',
      advisor: 'Lisa Park',
      location: 'campus',
      available: true
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'consultation':
        return <User className="h-4 w-4" />;
      case 'info_session':
        return <Calendar className="h-4 w-4" />;
      case 'tour':
        return <MapPin className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getLocationIcon = (location: string) => {
    switch (location) {
      case 'virtual':
        return <Video className="h-4 w-4" />;
      case 'campus':
        return <MapPin className="h-4 w-4" />;
      case 'phone':
        return <Calendar className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      consultation: 'default',
      info_session: 'secondary',
      interview: 'destructive',
      tour: 'outline'
    } as const;
    
    return (
      <Badge variant={variants[type as keyof typeof variants] || 'outline'}>
        {type.replace('_', ' ')}
      </Badge>
    );
  };

  const bookAppointment = async (slot: AppointmentSlot) => {
    setIsBooking(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: 'Appointment Booked Successfully',
        description: `${slot.type.replace('_', ' ')} scheduled for ${slot.date} at ${slot.time}`,
        variant: 'default'
      });
      
      setSelectedSlot(null);
      setDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Booking Failed',
        description: 'There was an error booking the appointment. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <Calendar className="h-4 w-4 mr-2" />
          Book Appointment
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-3">
            {availableSlots.map((slot) => (
              <div key={slot.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(slot.type)}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium capitalize">{slot.type.replace('_', ' ')}</span>
                        {getTypeBadge(slot.type)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {slot.duration}min with {slot.advisor}
                      </div>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => setSelectedSlot(slot)}
                    disabled={selectedSlot?.id === slot.id}
                  >
                    {selectedSlot?.id === slot.id ? 'Selected' : 'Select'}
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(slot.date).toLocaleDateString()} at {slot.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getLocationIcon(slot.location)}
                    <span className="capitalize">{slot.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {selectedSlot && (
            <div className="border-t pt-4">
              <div className="bg-muted/50 rounded-lg p-4 mb-4">
                <h3 className="font-medium mb-2">Selected Appointment</h3>
                <div className="text-sm space-y-1">
                  <div>Type: <span className="capitalize">{selectedSlot.type.replace('_', ' ')}</span></div>
                  <div>Date: {new Date(selectedSlot.date).toLocaleDateString()} at {selectedSlot.time}</div>
                  <div>Duration: {selectedSlot.duration} minutes</div>
                  <div>Advisor: {selectedSlot.advisor}</div>
                  <div>Location: <span className="capitalize">{selectedSlot.location}</span></div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={() => bookAppointment(selectedSlot)} 
                  disabled={isBooking}
                  className="flex-1"
                >
                  {isBooking ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Booking...
                    </>
                  ) : (
                    'Confirm Booking'
                  )}
                </Button>
                <Button variant="outline" onClick={() => setSelectedSlot(null)}>
                  Clear Selection
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}