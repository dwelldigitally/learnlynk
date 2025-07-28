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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      <div className="h-32 overflow-hidden flex-shrink-0">
        <img 
          src={news.image} 
          alt={news.title} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3 space-y-2 flex-1 flex flex-col">
        <div className="flex items-center justify-between">
          <Badge className={getTypeColor(news.type)}>
            {getTypeLabel(news.type)}
          </Badge>
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="w-3 h-3 mr-1" />
            {new Date(news.date).toLocaleDateString()}
          </div>
        </div>
        
        <h3 className="font-bold text-sm line-clamp-2">{news.title}</h3>
        <p className="text-muted-foreground text-xs line-clamp-2 flex-1">{news.description}</p>
        
        <div className="flex items-center justify-between pt-1 mt-auto">
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="w-3 h-3 mr-1" />
            <span>{news.readTime}</span>
          </div>
          <Button size="sm" variant="outline" className="text-xs h-7">
            Read More
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default NewsCard;