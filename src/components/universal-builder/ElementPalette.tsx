import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getElementTypesForBuilder } from '@/config/elementTypes';
import { useBuilder } from '@/contexts/BuilderContext';
import { UniversalElement } from '@/types/universalBuilder';
import * as Icons from 'lucide-react';

interface ElementPaletteProps {
  onAddElement: (elementType: string) => void;
}

export function ElementPalette({ onAddElement }: ElementPaletteProps) {
  const { state } = useBuilder();
  const elementTypes = getElementTypesForBuilder(state.config.type);

  // Group elements by category
  const groupedElements = elementTypes.reduce((acc, elementType) => {
    const category = elementType.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(elementType);
    return acc;
  }, {} as Record<string, typeof elementTypes>);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">
          {state.config.type === 'form' && 'Form Fields'}
          {state.config.type === 'workflow' && 'Workflow Elements'}
          {state.config.type === 'campaign' && 'Campaign Steps'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-4 p-4">
            {Object.entries(groupedElements).map(([category, elements]) => (
              <div key={category} className="space-y-2">
                <Badge variant="outline" className="text-xs font-medium">
                  {category}
                </Badge>
                <div className="grid gap-2">
                  {elements.map((elementType) => {
                    const IconComponent = Icons[elementType.icon as keyof typeof Icons] as React.ComponentType<any>;
                    
                    return (
                      <Button
                        key={elementType.type}
                        variant="ghost"
                        size="sm"
                        className="justify-start h-auto p-3 border border-dashed border-border/50 hover:border-primary/50 hover:bg-accent/50"
                        onClick={() => onAddElement(elementType.type)}
                      >
                        <div className="flex items-center gap-3 w-full">
                          {IconComponent && (
                            <IconComponent className="h-4 w-4 text-muted-foreground" />
                          )}
                          <div className="text-left">
                            <div className="font-medium text-sm">{elementType.label}</div>
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}