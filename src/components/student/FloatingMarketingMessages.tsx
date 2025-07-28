import React, { useState, useEffect } from "react";
import { Star, TrendingUp, Award, Users } from "lucide-react";

interface MarketingMessage {
  id: string;
  text: string;
  icon: React.ReactNode;
  type: "success" | "employment" | "achievement" | "community";
}

const FloatingMarketingMessages: React.FC = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const messages: MarketingMessage[] = [
    {
      id: "1",
      text: "97% of our Health Care graduates find employment within 6 months!",
      icon: <TrendingUp className="w-4 h-4" />,
      type: "employment"
    },
    {
      id: "2", 
      text: "Sarah M. graduated HCA program → Now working at Vancouver General Hospital",
      icon: <Star className="w-4 h-4" />,
      type: "success"
    },
    {
      id: "3",
      text: "Join 2,500+ alumni making a difference in healthcare across BC",
      icon: <Users className="w-4 h-4" />,
      type: "community"
    },
    {
      id: "4",
      text: "Our students receive hands-on training at top healthcare facilities",
      icon: <Award className="w-4 h-4" />,
      type: "achievement"
    },
    {
      id: "5",
      text: "Complete your application today → Start your healthcare career in March!",
      icon: <Star className="w-4 h-4" />,
      type: "success"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
        setIsVisible(true);
      }, 300);
      
    }, 4000);

    return () => clearInterval(interval);
  }, [messages.length]);

  const currentMessage = messages[currentMessageIndex];

  const getMessageColor = (type: string) => {
    switch (type) {
      case "employment":
        return "text-green-700 bg-green-50 border-green-200";
      case "success":
        return "text-blue-700 bg-blue-50 border-blue-200";
      case "achievement":
        return "text-purple-700 bg-purple-50 border-purple-200";
      case "community":
        return "text-orange-700 bg-orange-50 border-orange-200";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="flex items-center justify-center px-4">
      <div 
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-300 text-sm font-medium
          ${getMessageColor(currentMessage.type)}
          ${isVisible ? 'animate-fade-in opacity-100' : 'animate-fade-out opacity-0'}
        `}
      >
        {currentMessage.icon}
        <span className="whitespace-nowrap">{currentMessage.text}</span>
      </div>
    </div>
  );
};

export default FloatingMarketingMessages;