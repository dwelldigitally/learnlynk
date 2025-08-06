import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useBuilder } from '@/contexts/BuilderContext';
import { getElementTypesForBuilder } from '@/config/elementTypes';
import { 
  Search, 
  ChevronDown, 
  ChevronRight, 
  Mail, 
  MessageSquare, 
  Phone, 
  Clock, 
  Eye,
  Send,
  Filter,
  TestTube,
  Plus
} from 'lucide-react';

interface ActionsSidebarProps {
  onAddElement: (elementType: string) => void;
}

export function ActionsSidebar({ onAddElement }: ActionsSidebarProps) {
  const { state } = useBuilder();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Sending Options']);

  const elementTypes = getElementTypesForBuilder(state.config.type);
  
  // Group elements by category
  const categories = elementTypes.reduce((acc, element) => {
    const category = element.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(element);
    return acc;
  }, {} as Record<string, typeof elementTypes>);

  // Filter elements based on search
  const filteredCategories = Object.entries(categories).reduce((acc, [category, elements]) => {
    const filteredElements = elements.filter(element =>
      element.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      element.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (filteredElements.length > 0) {
      acc[category] = filteredElements;
    }
    
    return acc;
  }, {} as Record<string, typeof elementTypes>);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const getActionIcon = (elementType: string) => {
    switch (elementType) {
      case 'send_email':
      case 'email_campaign':
        return Mail;
      case 'send_site_message':
        return MessageSquare;
      case 'send_sms':
      case 'sms_campaign':
        return Phone;
      case 'wait':
      case 'wait_and_check':
      case 'wait_and_send':
        return Clock;
      case 'wait_and_check':
        return Eye;
      case 'wait_and_send':
        return Send;
      case 'audience_filter':
        return Filter;
      case 'ab_test':
        return TestTube;
      default:
        return Plus;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3 bg-secondary/50">
        <CardTitle className="text-lg font-semibold">Actions</CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search actions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="space-y-1">
          {Object.entries(filteredCategories).map(([category, elements]) => {
            const isExpanded = expandedCategories.includes(category);
            
            return (
              <Collapsible
                key={category}
                open={isExpanded}
                onOpenChange={() => toggleCategory(category)}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-3 h-auto font-medium text-left hover:bg-accent/50"
                  >
                    <span className="flex items-center gap-2">
                      {category}
                      <Badge variant="secondary" className="text-xs">
                        {elements.length}
                      </Badge>
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="space-y-1">
                  {elements.map((element) => {
                    const ActionIcon = getActionIcon(element.type);
                    
                    return (
                      <Button
                        key={element.type}
                        variant="ghost"
                        className="w-full justify-start p-3 h-auto text-left hover:bg-accent/70 group"
                        onClick={() => onAddElement(element.type)}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <ActionIcon className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">
                              {element.label}
                            </div>
                            {element.type === 'send_email' && (
                              <div className="text-xs text-muted-foreground">
                                Send personalized emails
                              </div>
                            )}
                            {element.type === 'send_site_message' && (
                              <div className="text-xs text-muted-foreground">
                                Send in-app notifications
                              </div>
                            )}
                            {element.type === 'send_sms' && (
                              <div className="text-xs text-muted-foreground">
                                Send SMS messages
                              </div>
                            )}
                            {element.type === 'wait' && (
                              <div className="text-xs text-muted-foreground">
                                Add time delays
                              </div>
                            )}
                          </div>
                          <Plus className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </Button>
                    );
                  })}
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>

        {/* Quick access section */}
        <div className="p-3 border-t mt-4">
          <h4 className="text-sm font-medium mb-2 text-muted-foreground">Quick Access</h4>
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs"
              onClick={() => onAddElement('send_email')}
            >
              <Mail className="w-4 h-4 mr-2" />
              Send an email
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs"
              onClick={() => onAddElement('wait')}
            >
              <Clock className="w-4 h-4 mr-2" />
              Add delay
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}