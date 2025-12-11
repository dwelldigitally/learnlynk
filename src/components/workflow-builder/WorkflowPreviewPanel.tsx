import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { workflowElementTypes } from '@/config/elementTypes';
import { getIconComponent } from '@/lib/iconHelper';
import { 
  Clock, 
  Users, 
  Zap, 
  ArrowDown, 
  Play, 
  Pause,
  Download,
  Copy
} from 'lucide-react';

interface WorkflowPreviewPanelProps {
  config: {
    name: string;
    description: string;
    elements: any[];
    settings?: {
      isActive?: boolean;
      triggerSettings?: any;
      enrollmentSettings?: any;
      scheduleSettings?: any;
    };
  };
  onClose?: () => void;
}

export function WorkflowPreviewPanel({ config, onClose }: WorkflowPreviewPanelProps) {
  const triggers = config.elements.filter(el => el.type === 'trigger');
  const actions = config.elements.filter(el => el.type !== 'trigger');
  const isActive = config.settings?.isActive;

  const getStepIcon = (type: string) => {
    const elementType = workflowElementTypes.find(t => t.type === type);
    return elementType ? getIconComponent(elementType.icon) : null;
  };

  const getStepDescription = (element: any): string => {
    switch (element.type) {
      case 'send_email':
        return `Subject: "${element.config?.subject || 'No subject'}"`;
      case 'send_sms':
        return `Message: "${element.config?.message?.substring(0, 50) || 'No message'}..."`;
      case 'wait':
        const waitTime = element.config?.waitTime;
        return waitTime ? `Wait ${waitTime.value} ${waitTime.unit}` : 'Wait time not set';
      case 'condition':
        const condCount = element.config?.conditions?.length || element.conditionGroups?.[0]?.conditions?.length || 0;
        return `${condCount} condition${condCount !== 1 ? 's' : ''} to evaluate`;
      case 'create_task':
        return `Task: "${element.config?.taskTitle || 'No title'}"`;
      case 'update_lead':
        return `Update ${element.config?.updateField || 'field'}`;
      default:
        return element.description || 'No description';
    }
  };

  const calculateTotalDuration = (): string => {
    let totalMinutes = 0;
    actions.forEach(action => {
      if (action.type === 'wait' && action.config?.waitTime) {
        const { value, unit } = action.config.waitTime;
        switch (unit) {
          case 'minutes': totalMinutes += value; break;
          case 'hours': totalMinutes += value * 60; break;
          case 'days': totalMinutes += value * 60 * 24; break;
          case 'weeks': totalMinutes += value * 60 * 24 * 7; break;
        }
      }
    });
    
    if (totalMinutes < 60) return `${totalMinutes} minutes`;
    if (totalMinutes < 1440) return `${Math.round(totalMinutes / 60)} hours`;
    return `${Math.round(totalMinutes / 1440)} days`;
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-6 border-b bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xl font-bold">{config.name || 'Untitled Workflow'}</h2>
              <Badge variant={isActive ? "default" : "secondary"}>
                {isActive ? 'Active' : 'Draft'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {config.description || 'No description provided'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="font-medium">{triggers.length}</div>
              <div className="text-xs text-muted-foreground">Trigger{triggers.length !== 1 ? 's' : ''}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Play className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="font-medium">{actions.length}</div>
              <div className="text-xs text-muted-foreground">Action{actions.length !== 1 ? 's' : ''}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="font-medium">{calculateTotalDuration()}</div>
              <div className="text-xs text-muted-foreground">Duration</div>
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Flow Preview */}
      <ScrollArea className="flex-1">
        <div className="p-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            Workflow Flow
          </h3>

          <div className="space-y-0">
            {/* Triggers Section */}
            {triggers.map((trigger, index) => (
              <div key={trigger.id} className="relative">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center text-green-600 font-bold text-sm">
                      {index + 1}
                    </div>
                    {(index < triggers.length - 1 || actions.length > 0) && (
                      <div className="w-px h-8 bg-border mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <Card className="border-green-500/30">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-green-600 border-green-500/50">
                            Trigger
                          </Badge>
                          <span className="font-medium">{trigger.title}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {trigger.conditionGroups?.[0]?.conditions?.length > 0 
                            ? `${trigger.conditionGroups[0].conditions.length} conditions configured`
                            : 'When this workflow is manually triggered or conditions are met'
                          }
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            ))}

            {/* Actions Section */}
            {actions.map((action, index) => {
              const StepIcon = getStepIcon(action.type);
              const stepNumber = triggers.length + index + 1;
              const isLastStep = index === actions.length - 1;
              
              return (
                <div key={action.id} className="relative">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                        action.type === 'wait' 
                          ? 'bg-orange-500/20 border-2 border-orange-500 text-orange-600'
                          : action.type === 'condition'
                          ? 'bg-purple-500/20 border-2 border-purple-500 text-purple-600'
                          : 'bg-primary/20 border-2 border-primary text-primary'
                      }`}>
                        {stepNumber}
                      </div>
                      {!isLastStep && (
                        <div className="w-px h-8 bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <Card className={`${
                        action.type === 'wait' 
                          ? 'border-orange-500/30'
                          : action.type === 'condition'
                          ? 'border-purple-500/30'
                          : ''
                      }`}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            {StepIcon && (
                              <div className="w-6 h-6 rounded bg-muted flex items-center justify-center">
                                <StepIcon className="h-3.5 w-3.5" />
                              </div>
                            )}
                            <Badge variant="outline" className="capitalize">
                              {action.type.replace('_', ' ')}
                            </Badge>
                            <span className="font-medium">{action.title}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {getStepDescription(action)}
                          </p>
                          
                          {/* Additional Config Preview */}
                          {action.type === 'send_email' && action.config?.template && (
                            <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                              Template: {action.config.template}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* End Marker */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-muted border-2 border-muted-foreground/30 flex items-center justify-center">
                  <Pause className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Workflow completes
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
