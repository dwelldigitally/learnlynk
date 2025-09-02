import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Clock, User, Video, MapPin, Plus } from 'lucide-react';
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

interface AppointmentBookingWidgetProps {
  leadId: string;
  className?: string;
}

export function AppointmentBookingWidget({ leadId, className }: AppointmentBookingWidgetProps) {
  const { toast } = useToast();
  const [selectedSlot, setSelectedSlot] = useState<AppointmentSlot | null>(null);
  const [isBooking, setIsBooking] = useState(false);

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
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Quick Appointment Booking
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {availableSlots.slice(0, 2).map((slot) => (
            <div key={slot.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getTypeIcon(slot.type)}
                  <span className="font-medium text-sm">{slot.type.replace('_', ' ')}</span>
                  {getTypeBadge(slot.type)}
                </div>
                <span className="text-xs text-muted-foreground">{slot.duration}min</span>
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-muted-foreground">
                  {new Date(slot.date).toLocaleDateString()} at {slot.time}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {getLocationIcon(slot.location)}
                  {slot.location}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">with {slot.advisor}</span>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" onClick={() => setSelectedSlot(slot)}>
                      Book
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Appointment Booking</DialogTitle>
                    </DialogHeader>
                    {selectedSlot && (
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-3">
                            {getTypeIcon(selectedSlot.type)}
                            <div>
                              <h3 className="font-medium capitalize">{selectedSlot.type.replace('_', ' ')}</h3>
                              <p className="text-sm text-muted-foreground">
                                {selectedSlot.duration} minutes with {selectedSlot.advisor}
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Date & Time:</span>
                              <div className="font-medium">
                                {new Date(selectedSlot.date).toLocaleDateString()}
                                <br />
                                {selectedSlot.time}
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Location:</span>
                              <div className="font-medium capitalize flex items-center gap-1">
                                {getLocationIcon(selectedSlot.location)}
                                {selectedSlot.location}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <Button 
                            className="flex-1" 
                            onClick={() => bookAppointment(selectedSlot)}
                            disabled={isBooking}
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
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))}
          
          <Button variant="ghost" className="w-full text-sm" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            View All Available Times
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}