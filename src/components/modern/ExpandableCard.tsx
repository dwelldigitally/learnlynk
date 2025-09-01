import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Maximize2, Minimize2 } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ExpandableCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  defaultFocused?: boolean;
  className?: string;
  headerActions?: React.ReactNode;
  count?: number;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export const ExpandableCard: React.FC<ExpandableCardProps> = ({
  title,
  subtitle,
  icon,
  children,
  defaultExpanded = false,
  defaultFocused = false,
  className,
  headerActions,
  count,
  priority = 'medium'
}) => {
  const [isOpen, setIsOpen] = useState(defaultExpanded);
  const [isFocused, setIsFocused] = useState(defaultFocused);

  const getPriorityBorder = () => {
    switch (priority) {
      case 'urgent': return 'border-l-destructive';
      case 'high': return 'border-l-warning';
      case 'medium': return 'border-l-primary';
      case 'low': return 'border-l-muted';
      default: return 'border-l-muted';
    }
  };

  const getPriorityGlow = () => {
    if (!isOpen) return '';
    switch (priority) {
      case 'urgent': return 'shadow-lg shadow-destructive/20';
      case 'high': return 'shadow-lg shadow-warning/20';
      case 'medium': return 'shadow-lg shadow-primary/20';
      default: return '';
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card 
        className={cn(
          "relative transition-all duration-300 border-l-4",
          getPriorityBorder(),
          getPriorityGlow(),
          isFocused && "col-span-full ring-2 ring-primary/50",
          "animate-fade-in",
          className
        )}
      >
        <CardHeader 
          className={cn(
            "flex flex-row items-center justify-between space-y-0 pb-2"
          )}
        >
          <div className="flex items-center gap-3">
            {icon && (
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                {icon}
              </div>
            )}
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                {title}
                {count !== undefined && (
                  <span className="text-sm font-normal bg-primary/20 text-primary px-2 py-1 rounded-full">
                    {count}
                  </span>
                )}
              </CardTitle>
              {subtitle && (
                <p className="text-sm text-muted-foreground mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {headerActions}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsFocused(!isFocused);
              }}
              className="h-8 w-8 p-0"
            >
              {isFocused ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>
        
        <CollapsibleContent className="animate-accordion-down">
          <CardContent className="pt-0">
            {children}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};