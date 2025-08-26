import React from 'react';
import { UniversalElement } from '@/types/universalBuilder';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, Video, Users, FileText, CheckSquare, 
  Keyboard, Brain, Target, Eye, Bell, Clock,
  Calendar, MapPin, Timer, AlertTriangle, CheckCircle
} from 'lucide-react';

interface JourneyElementRendererProps {
  element: UniversalElement;
  isPreview?: boolean;
}

export function JourneyElementRenderer({ element, isPreview = false }: JourneyElementRendererProps) {
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
    
    const IconComponent = iconMap[type as keyof typeof iconMap] || AlertTriangle;
    return <IconComponent className="h-4 w-4" />;
  };

  const renderElementDetails = () => {
    const { config } = element;
    
    switch (element.type) {
      case 'phone-interview':
      case 'video-interview':
      case 'in-person-interview':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {config.duration && (
                <span className="flex items-center gap-1">
                  <Timer className="h-3 w-3" />
                  {config.duration} minutes
                </span>
              )}
              {element.type === 'video-interview' && config.platform && (
                <span className="capitalize">{config.platform}</span>
              )}
              {element.type === 'in-person-interview' && config.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {config.location}
                </span>
              )}
            </div>
            {config.instructions && !isPreview && (
              <p className="text-sm text-muted-foreground">{config.instructions}</p>
            )}
            {config.schedulingRequired && (
              <Badge variant="outline" className="text-xs">
                <Calendar className="h-3 w-3 mr-1" />
                Scheduling Required
              </Badge>
            )}
          </div>
        );

      case 'document-upload':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {config.documentType?.replace('-', ' ')}
              </Badge>
              {config.required && (
                <Badge variant="destructive" className="text-xs">Required</Badge>
              )}
            </div>
            {config.maxFileSize && (
              <span className="text-xs text-muted-foreground">
                Max size: {config.maxFileSize}MB
              </span>
            )}
            {config.instructions && !isPreview && (
              <p className="text-sm text-muted-foreground">{config.instructions}</p>
            )}
          </div>
        );

      case 'verification':
        return (
          <div className="space-y-2">
            <Badge variant="secondary" className="text-xs">
              {config.verificationType?.replace('-', ' ')}
            </Badge>
            {config.autoVerify && (
              <Badge variant="outline" className="text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                Auto Verification
              </Badge>
            )}
            {config.instructions && !isPreview && (
              <p className="text-sm text-muted-foreground">{config.instructions}</p>
            )}
          </div>
        );

      case 'typing-test':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {config.minimumWPM && (
                <span>Min WPM: {config.minimumWPM}</span>
              )}
              {config.duration && (
                <span className="flex items-center gap-1">
                  <Timer className="h-3 w-3" />
                  {config.duration} minutes
                </span>
              )}
              {config.retries && (
                <span>Retries: {config.retries}</span>
              )}
            </div>
          </div>
        );

      case 'aptitude-test':
      case 'skills-assessment':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {config.testType && (
                <Badge variant="secondary" className="text-xs">
                  {config.testType?.replace('-', ' ')}
                </Badge>
              )}
              {config.skillArea && (
                <Badge variant="secondary" className="text-xs">
                  {config.skillArea}
                </Badge>
              )}
              {config.duration && (
                <span className="flex items-center gap-1">
                  <Timer className="h-3 w-3" />
                  {config.duration} minutes
                </span>
              )}
            </div>
            {config.passingScore && (
              <span className="text-xs text-muted-foreground">
                Passing score: {config.passingScore}%
              </span>
            )}
            {config.practicalComponent && (
              <Badge variant="outline" className="text-xs">
                Includes Practical Component
              </Badge>
            )}
          </div>
        );

      case 'application-review':
      case 'committee-review':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {config.reviewType && (
                <Badge variant="secondary" className="text-xs">
                  {config.reviewType?.replace('-', ' ')}
                </Badge>
              )}
              {config.reviewers && element.type === 'application-review' && (
                <span>{config.reviewers} reviewer{config.reviewers > 1 ? 's' : ''}</span>
              )}
              {config.committeeSize && element.type === 'committee-review' && (
                <span>{config.committeeSize} members</span>
              )}
              {config.timeframe && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {config.timeframe} days
                </span>
              )}
            </div>
            {config.consensusRequired && (
              <Badge variant="outline" className="text-xs">
                Consensus Required
              </Badge>
            )}
            {config.autoAssign && (
              <Badge variant="outline" className="text-xs">
                Auto Assign
              </Badge>
            )}
          </div>
        );

      case 'notification':
      case 'reminder':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {config.notificationType && (
                <Badge variant="secondary" className="text-xs">
                  {config.notificationType}
                </Badge>
              )}
              {config.reminderType && (
                <Badge variant="secondary" className="text-xs">
                  {config.reminderType}
                </Badge>
              )}
              {config.reminderTime && config.reminderUnit && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {config.reminderTime} {config.reminderUnit}
                </span>
              )}
            </div>
            {config.autoSend && (
              <Badge variant="outline" className="text-xs">
                Auto Send
              </Badge>
            )}
            {config.template && (
              <span className="text-xs text-muted-foreground">
                Template: {config.template}
              </span>
            )}
          </div>
        );

      default:
        return (
          <div className="text-sm text-muted-foreground">
            {element.description || 'No additional details configured'}
          </div>
        );
    }
  };

  if (isPreview) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {getElementIcon(element.type)}
          <span className="text-xs text-muted-foreground">
            {element.description || 'Click to configure this step'}
          </span>
        </div>
        {renderElementDetails()}
      </div>
    );
  }

  // Full render for preview mode
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          {getElementIcon(element.type)}
          <h4 className="font-medium">{element.title}</h4>
        </div>
        {renderElementDetails()}
      </CardContent>
    </Card>
  );
}