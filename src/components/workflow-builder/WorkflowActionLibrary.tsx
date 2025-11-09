import React, { useState, useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Plus } from 'lucide-react';
import { workflowElementTypes } from '@/config/elementTypes';
import { getIconComponent } from '@/lib/iconHelper';

interface WorkflowActionLibraryProps {
  onAddElement: (elementType: string) => void;
}

export function WorkflowActionLibrary({ onAddElement }: WorkflowActionLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const cats = new Set<string>();
    workflowElementTypes.forEach(type => {
      if (type.category) cats.add(type.category);
    });
    return ['all', ...Array.from(cats).sort()];
  }, []);

  const filteredActions = useMemo(() => {
    return workflowElementTypes.filter(action => {
      const matchesSearch = action.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          action.category?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || action.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const groupedActions = useMemo(() => {
    const groups: Record<string, typeof workflowElementTypes> = {};
    filteredActions.forEach(action => {
      const category = action.category || 'Other';
      if (!groups[category]) groups[category] = [];
      groups[category].push(action);
    });
    return groups;
  }, [filteredActions]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b space-y-3">
        <h3 className="font-semibold">Actions</h3>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search actions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-1">
          {categories.map(category => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="cursor-pointer capitalize"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {Object.entries(groupedActions).map(([category, actions]) => (
            <div key={category} className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {category}
              </h4>
              <div className="space-y-1">
                {actions.map(action => {
                  const Icon = getIconComponent(action.icon);
                  return (
                    <Button
                      key={action.type}
                      variant="ghost"
                      className="w-full justify-start h-auto py-3 px-3 hover:bg-accent group"
                      onClick={() => onAddElement(action.type)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="flex-shrink-0 w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          {Icon && <Icon className="w-4 h-4 text-primary" />}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-medium text-sm">{action.label}</div>
                        </div>
                        <Plus className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-muted/30">
        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium">Quick Tips:</p>
          <ul className="space-y-0.5 pl-3">
            <li>• Click to add actions</li>
            <li>• Drag to reorder</li>
            <li>• Use + buttons between steps</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
