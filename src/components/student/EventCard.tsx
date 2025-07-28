import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, MapPin } from "lucide-react";
import { Event } from "@/types/student";

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [currentRegistered, setCurrentRegistered] = useState(event.registeredCount);

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
    } else if (isRegistered) {
      setIsRegistered(false);
      setCurrentRegistered(prev => prev - 1);
    }
  };

  const isFull = currentRegistered >= event.maxCapacity;
  const availableSpots = event.maxCapacity - currentRegistered;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 overflow-hidden">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Badge className={getEventTypeColor(event.eventType)}>
            {getEventTypeLabel(event.eventType)}
          </Badge>
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="w-3 h-3 mr-1" />
            {new Date(event.date).toLocaleDateString()}
          </div>
        </div>
        
        <h3 className="font-bold text-lg line-clamp-2">{event.title}</h3>
        <p className="text-muted-foreground text-sm line-clamp-3">{event.description}</p>
        
        <div className="space-y-2">
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="w-3 h-3 mr-1" />
            <span>{event.time}</span>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center text-muted-foreground">
              <Users className="w-3 h-3 mr-1" />
              <span>{currentRegistered}/{event.maxCapacity} registered</span>
            </div>
            {!isFull && (
              <span className="text-green-600 font-medium">
                {availableSpots} spots left
              </span>
            )}
            {isFull && (
              <span className="text-red-600 font-medium">
                Event Full
              </span>
            )}
          </div>
        </div>
        
        <Button 
          onClick={handleRegister}
          className="w-full"
          variant={isRegistered ? "outline" : "default"}
          disabled={!isRegistered && isFull}
        >
          {isRegistered ? "Unregister" : isFull ? "Event Full" : "Register Now"}
        </Button>
      </div>
    </Card>
  );
};

export default EventCard;