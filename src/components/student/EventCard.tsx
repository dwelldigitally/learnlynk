import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, MapPin } from "lucide-react";
import { Event } from "@/types/student";
import { useToast } from "@/hooks/use-toast";

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [currentRegistered, setCurrentRegistered] = useState(event.registeredCount);
  const { toast } = useToast();

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case "info_session": return "Info Session";
      case "workshop": return "Workshop";
      case "campus_tour": return "Campus Tour";
      case "networking": return "Networking";
      case "guest_lecture": return "Guest Lecture";
      default: return "Event";
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "info_session": return "bg-blue-100 text-blue-800";
      case "workshop": return "bg-orange-100 text-orange-800";
      case "campus_tour": return "bg-green-100 text-green-800";
      case "networking": return "bg-purple-100 text-purple-800";
      case "guest_lecture": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleRegister = () => {
    if (!isRegistered && currentRegistered < event.maxCapacity) {
      setIsRegistered(true);
      setCurrentRegistered(prev => prev + 1);
      toast({
        title: "Successfully Registered! 🎉",
        description: `You're now registered for ${event.title}. We'll send you a reminder before the event.`,
      });
    } else if (isRegistered) {
      setIsRegistered(false);
      setCurrentRegistered(prev => prev - 1);
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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      <div className="h-32 overflow-hidden flex-shrink-0">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3 space-y-2 flex-1 flex flex-col">
        <div className="flex items-center justify-between">
          <Badge className={getEventTypeColor(event.eventType)}>
            {getEventTypeLabel(event.eventType)}
          </Badge>
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="w-3 h-3 mr-1" />
            {new Date(event.date).toLocaleDateString()}
          </div>
        </div>
        
        <h3 className="font-bold text-sm line-clamp-2">{event.title}</h3>
        <p className="text-muted-foreground text-xs line-clamp-2 flex-1">{event.description}</p>
        
        <div className="space-y-1 mt-auto">
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="w-3 h-3 mr-1" />
            <span>{event.time}</span>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center text-muted-foreground">
              <Users className="w-3 h-3 mr-1" />
              <span>{currentRegistered}/{event.maxCapacity}</span>
            </div>
            {!isFull && (
              <span className="text-green-600 font-medium">
                {availableSpots} left
              </span>
            )}
            {isFull && (
              <span className="text-red-600 font-medium">
                Full
              </span>
            )}
          </div>
        </div>
        
        <Button 
          onClick={handleRegister}
          className="w-full text-xs h-7 mt-2"
          variant={isRegistered ? "outline" : "default"}
          disabled={!isRegistered && isFull}
        >
          {isRegistered ? "Unregister" : isFull ? "Event Full" : "Register"}
        </Button>
      </div>
    </Card>
  );
};

export default EventCard;