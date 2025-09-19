import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, ArrowRight, User } from "lucide-react";
import { NewsItem } from "@/types/student";

interface NewsCardProps {
  news: NewsItem;
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case "blog": return "Blog";
      case "alumni_story": return "Alumni Story";
      case "instructor_profile": return "Instructor";
      default: return "News";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "blog": return "bg-gradient-to-r from-blue-500 to-blue-600 text-white";
      case "alumni_story": return "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white";
      case "instructor_profile": return "bg-gradient-to-r from-purple-500 to-purple-600 text-white";
      default: return "bg-gradient-to-r from-slate-500 to-slate-600 text-white";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "blog": return "📝";
      case "alumni_story": return "🎓";
      case "instructor_profile": return "👨‍🏫";
      default: return "📰";
    }
  };

  return (
    <Card className="group overflow-hidden bg-white dark:bg-slate-800 border-0 shadow-sm hover:shadow-md transition-shadow duration-200 h-full cursor-pointer">
      {/* Hero Image Section */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10" />
        <img 
          src={news.image} 
          alt={news.title} 
          className="w-full h-full object-cover"
        />
        
        {/* Floating Badge */}
        <div className="absolute top-4 left-4 z-20">
          <Badge className={`${getTypeColor(news.type)} text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg border-0 flex items-center gap-1.5`}>
            <span className="text-sm">{getTypeIcon(news.type)}</span>
            {getTypeLabel(news.type)}
          </Badge>
        </div>

        {/* Date Badge */}
        <div className="absolute top-4 right-4 z-20">
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-lg">
            <div className="flex items-center gap-1 text-xs font-medium text-slate-700 dark:text-slate-300">
              <Calendar className="w-3 h-3" />
              {new Date(news.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col h-auto">
        {/* Title */}
        <h3 className="font-bold text-lg leading-tight text-slate-900 dark:text-slate-100 mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
          {news.title}
        </h3>
        
        {/* Description */}
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-3 mb-4 flex-grow">
          {news.description}
        </p>
        
        {/* Meta Information */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-medium">{news.readTime}</span>
          </div>
          
          {/* Read More Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-3 text-xs font-semibold text-primary hover:text-primary-foreground hover:bg-primary group/btn transition-all duration-300"
          >
            Read More
            <ArrowRight className="w-3 h-3 ml-1 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
          </Button>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </Card>
  );
};

export default NewsCard;