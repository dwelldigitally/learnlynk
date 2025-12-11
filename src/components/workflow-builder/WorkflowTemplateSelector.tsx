import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { workflowTemplates, templateCategories, WorkflowTemplate } from '@/config/workflowTemplates';
import { getIconComponent } from '@/lib/iconHelper';
import { Search, Plus, Clock, Zap, Star } from 'lucide-react';

interface WorkflowTemplateSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (template: WorkflowTemplate | null) => void;
}

export function WorkflowTemplateSelector({ open, onOpenChange, onSelectTemplate }: WorkflowTemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = useMemo(() => {
    return workflowTemplates.filter(template => {
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleSelectTemplate = (template: WorkflowTemplate) => {
    onSelectTemplate(template);
    onOpenChange(false);
  };

  const handleStartBlank = () => {
    onSelectTemplate(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] p-0 gap-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-xl">Choose a Workflow Template</DialogTitle>
          <DialogDescription>
            Start with a pre-built template or create from scratch
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Categories */}
          <div className="w-56 border-r bg-muted/30 p-4">
            <div className="space-y-1">
              {templateCategories.map(category => {
                const Icon = getIconComponent(category.icon);
                const count = category.id === 'all' 
                  ? workflowTemplates.length 
                  : workflowTemplates.filter(t => t.category === category.id).length;
                
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "secondary" : "ghost"}
                    className="w-full justify-start gap-2"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    <span className="flex-1 text-left">{category.label}</span>
                    <Badge variant="outline" className="text-xs">
                      {count}
                    </Badge>
                  </Button>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 border-dashed"
                onClick={handleStartBlank}
              >
                <Plus className="h-4 w-4" />
                Start from Scratch
              </Button>
            </div>
          </div>

          {/* Template Grid */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="grid grid-cols-2 gap-4">
                {filteredTemplates.map(template => {
                  const Icon = getIconComponent(template.icon);
                  
                  return (
                    <Card
                      key={template.id}
                      className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group"
                      onClick={() => handleSelectTemplate(template)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            {Icon && <Icon className="w-5 h-5 text-primary" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-sm truncate">{template.name}</h3>
                              {template.popularity >= 90 && (
                                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                              {template.description}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Zap className="h-3 w-3" />
                                <span>{template.steps.length} steps</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{template.estimatedDuration}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {filteredTemplates.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No templates found matching your search</p>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
