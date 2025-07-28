import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar } from "lucide-react";
import { NewsItem } from "@/types/student";

interface NewsCardProps {
  news: NewsItem;
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case "blog": return "Blog";
      case "alumni_story": return "Alumni";
      case "instructor_profile": return "Instructor";
      default: return "News";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "blog": return "bg-blue-100 text-blue-800";
      case "alumni_story": return "bg-green-100 text-green-800";
      case "instructor_profile": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
      <div className="h-40 overflow-hidden relative">
        <img 
          src={news.image} 
          alt={news.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2">
          <Badge className={`${getTypeColor(news.type)} text-xs px-2 py-1`}>
            {getTypeLabel(news.type)}
          </Badge>
        </div>
      </div>
      <div className="p-3 h-32 flex flex-col justify-between">
        <div className="space-y-1">
          <h3 className="font-bold text-sm line-clamp-2 leading-tight">{news.title}</h3>
          <p className="text-muted-foreground text-xs line-clamp-2 leading-tight">{news.description}</p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="w-3 h-3 mr-1" />
            <span>{news.readTime}</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="w-3 h-3 mr-1" />
            <span>{new Date(news.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NewsCard;