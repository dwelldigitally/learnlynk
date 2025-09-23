import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Calendar, Clock, Users, MapPin } from "lucide-react";
import { Event } from "@/types/student";
import { useToast } from "@/hooks/use-toast";

interface EventCardProps {
  event: Event;
  onRegisterToggle?: (eventId: string, isRegistered: boolean) => void;
  isRegistered?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, onRegisterToggle, isRegistered: initialIsRegistered = false }) => {
  const [isRegistered, setIsRegistered] = useState(initialIsRegistered);
  const [currentRegistered, setCurrentRegistered] = useState(event.registeredCount);
  const { toast } = useToast();

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case "info_session": return "Info";
      case "workshop": return "Workshop";
      case "campus_tour": return "Tour";
      case "networking": return "Network";
      case "guest_lecture": return "Lecture";
      default: return "Event";
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "info_session": return "bg-gradient-to-r from-blue-500 to-blue-600 text-white";
      case "workshop": return "bg-gradient-to-r from-orange-500 to-orange-600 text-white";
      case "campus_tour": return "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white";
      case "networking": return "bg-gradient-to-r from-purple-500 to-purple-600 text-white";
      case "guest_lecture": return "bg-gradient-to-r from-red-500 to-red-600 text-white";
      default: return "bg-gradient-to-r from-slate-500 to-slate-600 text-white";
    }
  };

  const handleRegister = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isRegistered && currentRegistered < event.maxCapacity) {
      setIsRegistered(true);
      setCurrentRegistered(prev => prev + 1);
      onRegisterToggle?.(event.id, true);
      toast({
        title: "Successfully Registered! 🎉",
        description: `You're now registered for ${event.title}. We'll send you a reminder before the event.`,
      });
    } else if (isRegistered) {
      setIsRegistered(false);
      setCurrentRegistered(prev => prev - 1);
      onRegisterToggle?.(event.id, false);
      toast({
        title: "Registration Cancelled",
        description: `You've been unregistered from ${event.title}.`,
        variant: "destructive",
      });
    }
  };

  const isFull = currentRegistered >= event.maxCapacity;
  const availableSpots = event.maxCapacity - currentRegistered;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="group overflow-hidden bg-white dark:bg-slate-800 border-0 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer flex flex-col h-[380px]">
          {/* Hero Image Section */}
          <div className="relative h-[168px] overflow-hidden flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10" />
            <img 
              src={event.image} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
            
            {/* Floating Badge */}
            <div className="absolute top-3 left-3 z-20">
              <Badge className={`${getEventTypeColor(event.eventType)} text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg border-0`}>
                {getEventTypeLabel(event.eventType)}
              </Badge>
            </div>

            {/* Date Badge */}
            <div className="absolute top-3 right-3 z-20">
              <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-lg">
                <div className="flex items-center gap-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                  <Calendar className="w-3 h-3" />
                  {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 flex-1 flex flex-col justify-between">
            <div className="flex-1 space-y-2">
              <h3 className="font-bold text-base leading-tight text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-primary transition-colors duration-300 mb-2">{event.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 leading-relaxed mb-3">{event.description}</p>
              
              <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 pt-2">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="font-medium">{event.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  <span className="font-medium">{currentRegistered}/{event.maxCapacity}</span>
                </div>
              </div>
            </div>
            
            <div className="pt-4 pb-1 border-t border-slate-100 dark:border-slate-700">
              <Button 
                onClick={handleRegister}
                className="w-full text-sm h-10 font-semibold"
                variant={isRegistered ? "outline" : "default"}
                disabled={!isRegistered && isFull}
              >
                {isRegistered ? "Registered ✓" : isFull ? "Event Full" : "Register Now"}
              </Button>
            </div>
          </div>

          {/* Hover Effect Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </Card>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{event.title}</DialogTitle>
          <DialogDescription>
            Event details and registration information
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Image and Description */}
          <div className="space-y-4">
            <div className="aspect-video overflow-hidden rounded-lg">
              <img 
                src={event.image} 
                alt={event.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">About this event</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
            </div>
          </div>
          
          {/* Right Column - Event Details and Registration */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{new Date(event.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{event.time}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{currentRegistered}/{event.maxCapacity} registered</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge className={`${getEventTypeColor(event.eventType)} text-xs px-2 py-1`}>
                  {getEventTypeLabel(event.eventType)}
                </Badge>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <Button 
                onClick={handleRegister}
                className="w-full"
                variant={isRegistered ? "outline" : "default"}
                disabled={!isRegistered && isFull}
              >
                {isRegistered ? "Registered ✓" : isFull ? "Event Full" : "Register for Event"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventCard;