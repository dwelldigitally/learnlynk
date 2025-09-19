import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { useLocation } from 'react-router-dom';
import { HelpCircle, Book, MessageCircle, Video, FileText, ExternalLink } from 'lucide-react';

interface HelpResource {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  action: string;
}

const contextualHelp: Record<string, HelpResource[]> = {
  '/student': [
    {
      title: 'Getting Started Guide',
      description: 'Learn how to navigate your student portal',
      icon: Book,
      action: 'View Guide'
    },
    {
      title: 'Application Process',
      description: 'Step-by-step application instructions',
      icon: FileText,
      action: 'Learn More'
    }
  ],
  '/student/applications': [
    {
      title: 'Application Help',
      description: 'Common questions about applications',
      icon: FileText,
      action: 'View FAQ'
    },
    {
      title: 'Required Documents',
      description: 'What documents you need to submit',
      icon: Book,
      action: 'View List'
    }
  ],
  '/student/schedule': [
    {
      title: 'Class Schedule Help',
      description: 'Understanding your timetable',
      icon: Video,
      action: 'Watch Tutorial'
    }
  ],
  default: [
    {
      title: 'Contact Support',
      description: 'Get help from our support team',
      icon: MessageCircle,
      action: 'Chat Now'
    }
  ]
};

export const ContextualHelp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const helpResources = contextualHelp[location.pathname] || contextualHelp.default;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm">
          <HelpCircle className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-72 p-0" align="end">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-sm">Help & Support</h3>
          <p className="text-xs text-muted-foreground">
            Get help with this page
          </p>
        </div>
        
        <div className="p-2">
          {helpResources.map((resource, index) => (
            <div key={index}>
              <div className="flex items-start gap-3 p-2 hover:bg-muted/50 rounded-md cursor-pointer transition-colors">
                <div className="p-2 rounded-lg bg-primary/10">
                  <resource.icon className="w-4 h-4 text-primary" />
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">{resource.title}</h4>
                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {resource.description}
                  </p>
                  <p className="text-xs text-primary font-medium">
                    {resource.action}
                  </p>
                </div>
              </div>
              {index < helpResources.length - 1 && <Separator className="my-1" />}
            </div>
          ))}
        </div>
        
        <div className="p-3 border-t bg-muted/20">
          <Button variant="outline" size="sm" className="w-full">
            <MessageCircle className="w-4 h-4 mr-2" />
            Open Live Chat
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};