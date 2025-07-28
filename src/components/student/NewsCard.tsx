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
      case "blog": return "Program Blog";
      case "alumni_story": return "Alumni Story";
      case "instructor_profile": return "Instructor Profile";
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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 overflow-hidden">
        <img 
          src={news.image} 
          alt={news.title} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Badge className={getTypeColor(news.type)}>
            {getTypeLabel(news.type)}
          </Badge>
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="w-3 h-3 mr-1" />
            {new Date(news.date).toLocaleDateString()}
          </div>
        </div>
        
        <h3 className="font-bold text-lg line-clamp-2">{news.title}</h3>
        <p className="text-muted-foreground text-sm line-clamp-3">{news.description}</p>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="w-3 h-3 mr-1" />
            <span>{news.readTime}</span>
          </div>
          <Button size="sm" variant="outline">
            Read More
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default NewsCard;