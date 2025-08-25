import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface PlaybookCardProps {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  description: string;
  sequence: string[];
  triggerCriteria: string;
  expectedActions: string;
  enabled: boolean;
  updating: boolean;
  onToggle: (enabled: boolean) => void;
}

export function PlaybookCard({
  title,
  subtitle,
  icon: Icon,
  description,
  sequence,
  triggerCriteria,
  expectedActions,
  enabled,
  updating,
  onToggle
}: PlaybookCardProps) {
  return (
    <Card className={`transition-all duration-200 ${enabled ? 'ring-2 ring-primary/20 bg-primary/5' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon className={`h-5 w-5 ${enabled ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className="text-lg">{title}</span>
          </div>
          <Switch
            checked={enabled}
            onCheckedChange={onToggle}
            disabled={updating}
          />
        </CardTitle>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Status Badge */}
        <div className="flex justify-between items-center">
          <Badge 
            variant={enabled ? "default" : "secondary"}
            className={enabled ? "bg-green-100 text-green-800" : ""}
          >
            {enabled ? "Active" : "Inactive"}
          </Badge>
          {enabled && (
            <Badge variant="outline" className="text-xs">
              {expectedActions}
            </Badge>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-foreground">{description}</p>

        {/* Sequence Steps */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-2">Sequence Steps:</h4>
          <ul className="space-y-1">
            {sequence.map((step, index) => (
              <li key={index} className="text-xs text-muted-foreground flex items-center">
                <span className={`inline-block w-4 h-4 rounded-full text-xs flex items-center justify-center mr-2 text-white ${
                  enabled ? 'bg-primary' : 'bg-gray-400'
                }`}>
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ul>
        </div>

        {/* Trigger Criteria */}
        <div className="border-t border-border pt-3">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Trigger:</span>
            <span className="font-medium text-foreground">{triggerCriteria}</span>
          </div>
        </div>

        {/* Performance Indicator */}
        {enabled && (
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Performance:</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-green-600">Running</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}