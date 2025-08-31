import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Phone, Mail, FileText, UserPlus, Clock, 
  CheckCircle, Play, RotateCcw, Zap 
} from 'lucide-react';

interface ActionCardProps {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  confidence?: number;
  studentName?: string;
  aiReasoning?: string;
  estimatedImpact?: string;
  estimatedTime?: string;
  isSelected?: boolean;
  isExecuting?: boolean;
  canAutoExecute?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
  onExecute?: () => void;
  className?: string;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  id,
  title,
  description,
  type,
  priority,
  confidence,
  studentName,
  aiReasoning,
  estimatedImpact,
  estimatedTime,
  isSelected = false,
  isExecuting = false,
  canAutoExecute = false,
  onSelect,
  onExecute,
  className
}) => {
  const getActionIcon = () => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'call': return <Phone className="h-4 w-4" />;
      case 'assignment': return <UserPlus className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const getPriorityColor = () => {
    switch (priority) {
      case 'urgent': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'high': return 'bg-warning/10 text-warning border-warning/20';
      case 'medium': return 'bg-primary/10 text-primary border-primary/20';
      default: return 'bg-muted text-muted-foreground border-muted';
    }
  };

  const getConfidenceColor = () => {
    if (!confidence) return 'text-muted-foreground';
    if (confidence >= 85) return 'text-success';
    if (confidence >= 70) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <Card 
      className={cn(
        "relative group hover:shadow-md transition-all duration-200",
        isSelected && "ring-2 ring-primary/50 bg-primary/5",
        "animate-scale-in",
        className
      )}
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1">
            {onSelect && (
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) => onSelect(id, !!checked)}
                className="mt-1"
              />
            )}
            
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-accent/20 text-accent-foreground">
                {getActionIcon()}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium leading-tight">{title}</h4>
                {studentName && (
                  <p className="text-xs text-muted-foreground">{studentName}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-2">
            <Badge variant="outline" className={getPriorityColor()}>
              {priority}
            </Badge>
            {confidence && (
              <span className={cn("text-xs font-medium", getConfidenceColor())}>
                {confidence}%
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
          {description}
        </p>

        {/* AI Details */}
        {(aiReasoning || estimatedImpact) && (
          <div className="space-y-2 mb-4 p-3 rounded-lg bg-accent/5 border">
            {aiReasoning && (
              <div>
                <span className="text-xs font-medium text-foreground">AI Reasoning:</span>
                <p className="text-xs text-muted-foreground leading-relaxed">{aiReasoning}</p>
              </div>
            )}
            {estimatedImpact && (
              <div>
                <span className="text-xs font-medium text-foreground">Expected Impact:</span>
                <p className="text-xs text-success font-medium">{estimatedImpact}</p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {estimatedTime && (
              <>
                <Clock className="h-3 w-3" />
                <span>{estimatedTime}</span>
              </>
            )}
          </div>
          
          {onExecute && (
            <Button
              size="sm"
              onClick={onExecute}
              disabled={isExecuting}
              className={cn(
                "h-8 px-3 transition-all duration-200",
                canAutoExecute && "bg-success hover:bg-success/90 text-white"
              )}
            >
              {isExecuting ? (
                <RotateCcw className="h-3 w-3 animate-spin" />
              ) : canAutoExecute ? (
                <>
                  <Play className="h-3 w-3 mr-1" />
                  Auto-Execute
                </>
              ) : (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Approve & Execute
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};