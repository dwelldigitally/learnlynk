
import React from "react";
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { NewsEvent } from "@/types/student";

interface NewsEventCardProps {
  event: NewsEvent;
}

const NewsEventCard: React.FC<NewsEventCardProps> = ({ event }) => {
  return (
    <Card className="overflow-hidden">
      <div className="h-40 overflow-hidden">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg">{event.title}</h3>
        <p className="text-gray-600 text-sm mt-1">{event.description}</p>
        
        <div className="flex items-center mt-4">
          <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
            <img 
              src={event.author.avatar} 
              alt={event.author.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="text-sm font-medium">{event.author.name}</div>
            <div className="text-xs text-gray-500">{event.author.role}</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            <span>{event.duration}</span>
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open mr-1"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            <span>{event.lessons} Lessons</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NewsEventCard;
