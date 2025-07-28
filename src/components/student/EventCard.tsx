import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users } from "lucide-react";
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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
      <div className="h-40 overflow-hidden relative">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2">
          <Badge className={`${getEventTypeColor(event.eventType)} text-xs px-2 py-1`}>
            {getEventTypeLabel(event.eventType)}
          </Badge>
        </div>
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
      </div>
      <div className="p-3 h-32 flex flex-col">
        <div className="flex-1 space-y-1">
          <h3 className="font-bold text-sm line-clamp-2 leading-tight">{event.title}</h3>
          <p className="text-muted-foreground text-xs line-clamp-1 leading-tight">{event.description}</p>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center">
              <Users className="w-3 h-3 mr-1" />
              <span>{currentRegistered}/{event.maxCapacity}</span>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={handleRegister}
          className="w-full text-xs h-6 mt-2"
          variant={isRegistered ? "outline" : "default"}
          disabled={!isRegistered && isFull}
        >
          {isRegistered ? "Registered ✓" : isFull ? "Full" : "Register"}
        </Button>
      </div>
    </Card>
  );
};

export default EventCard;