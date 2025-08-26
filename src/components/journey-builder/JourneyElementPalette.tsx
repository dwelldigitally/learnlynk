import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { journeyElementTypes } from '@/config/elementTypes';
import { 
  Phone, Video, Users, FileText, CheckSquare, 
  Keyboard, Brain, Target, Eye, Bell, Clock,
  Search, Plus
} from 'lucide-react';

interface JourneyElementPaletteProps {
  onAddElement: (elementType: string) => void;
}

export function JourneyElementPalette({ onAddElement }: JourneyElementPaletteProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const getElementIcon = (type: string) => {
    const iconMap = {
      'phone-interview': Phone,
      'video-interview': Video,
      'in-person-interview': Users,
      'document-upload': FileText,
      'verification': CheckSquare,
      'typing-test': Keyboard,
      'aptitude-test': Brain,
      'skills-assessment': Target,
      'application-review': Eye,
      'committee-review': Users,
      'notification': Bell,
      'reminder': Clock,
    };
    
    const IconComponent = iconMap[type as keyof typeof iconMap] || FileText;
    return <IconComponent className="h-4 w-4" />;
  };

  const getCategoryColor = (category: string) => {
    const colorMap = {
      'Interviews': 'bg-blue-100 text-blue-800 border-blue-200',
      'Requirements': 'bg-green-100 text-green-800 border-green-200',
      'Tests': 'bg-purple-100 text-purple-800 border-purple-200',
      'Review': 'bg-orange-100 text-orange-800 border-orange-200',
      'Communications': 'bg-pink-100 text-pink-800 border-pink-200',
    };
    return colorMap[category as keyof typeof colorMap] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const filteredElements = journeyElementTypes.filter(element =>
    element.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    element.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    element.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedElements = filteredElements.reduce((acc, element) => {
    if (!acc[element.category]) {
      acc[element.category] = [];
    }
    acc[element.category].push(element);
    return acc;
  }, {} as Record<string, typeof journeyElementTypes>);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Journey Steps</CardTitle>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search steps..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="p-4 space-y-6">
            {Object.entries(groupedElements).map(([category, elements]) => (
              <div key={category} className="space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-muted-foreground">{category}</h3>
                  <Badge variant="outline" className={`text-xs ${getCategoryColor(category)}`}>
                    {elements.length}
                  </Badge>
                </div>
                
                <div className="grid gap-2">
                  {elements.map((element) => (
                    <Button
                      key={element.type}
                      variant="ghost"
                      className="justify-start h-auto p-3 hover:bg-accent/80 transition-colors"
                      onClick={() => onAddElement(element.type)}
                    >
                      <div className="flex items-start gap-3 text-left w-full">
                        <div className="flex-shrink-0 mt-0.5">
                          {getElementIcon(element.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{element.label}</span>
                            <Plus className="h-3 w-3 opacity-60" />
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {getElementDescription(element.type)}
                          </p>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
            
            {Object.keys(groupedElements).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No steps found matching "{searchTerm}"</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function getElementDescription(type: string): string {
  const descriptions = {
    'phone-interview': 'Schedule and conduct phone interviews with applicants',
    'video-interview': 'Set up video interviews using Zoom, Teams, or Google Meet',
    'in-person-interview': 'Arrange face-to-face interviews at your campus',
    'document-upload': 'Require specific documents like transcripts or resumes',
    'verification': 'Verify identity, academic records, or background checks',
    'typing-test': 'Assess typing speed and accuracy with WPM requirements',
    'aptitude-test': 'Test general, numerical, verbal, or logical reasoning',
    'skills-assessment': 'Evaluate specific technical or practical skills',
    'application-review': 'Single or multiple reviewer evaluation process',
    'committee-review': 'Multi-member committee decision process',
    'notification': 'Send automated notifications via email, SMS, or push',
    'reminder': 'Schedule reminder messages for pending tasks',
  };
  return descriptions[type as keyof typeof descriptions] || 'Configure this journey step';
}