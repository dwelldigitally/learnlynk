import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { campaignTemplates, CampaignTemplate } from '@/config/campaignTemplates';
import { Sparkles, FileText } from 'lucide-react';

interface TemplateSelectorProps {
  onSelectTemplate: (template: CampaignTemplate) => void;
  onStartBlank: () => void;
}

export function TemplateSelector({ onSelectTemplate, onStartBlank }: TemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { value: 'all', label: 'All Templates' },
    { value: 'onboarding', label: 'Onboarding' },
    { value: 're-engagement', label: 'Re-engagement' },
    { value: 'nurturing', label: 'Nurturing' },
    { value: 'conversion', label: 'Conversion' },
    { value: 'retention', label: 'Retention' },
  ];

  const filteredTemplates = selectedCategory === 'all'
    ? campaignTemplates
    : campaignTemplates.filter(t => t.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      onboarding: 'bg-blue-500/10 text-blue-500',
      're-engagement': 'bg-purple-500/10 text-purple-500',
      nurturing: 'bg-green-500/10 text-green-500',
      conversion: 'bg-orange-500/10 text-orange-500',
      retention: 'bg-pink-500/10 text-pink-500',
    };
    return colors[category] || 'bg-muted text-muted-foreground';
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Sparkles className="h-4 w-4 mr-2" />
          Use Template
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Campaign Templates</DialogTitle>
          <DialogDescription>
            Start with a pre-built campaign template or create from scratch
          </DialogDescription>
        </DialogHeader>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid grid-cols-6 w-full">
            {categories.map((category) => (
              <TabsTrigger key={category.value} value={category.value}>
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <ScrollArea className="h-[500px] mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-4">
              {/* Start Blank Option */}
              <Card className="border-2 border-dashed hover:border-primary cursor-pointer transition-colors" onClick={onStartBlank}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-lg">Start from Blank</CardTitle>
                  </div>
                  <CardDescription>
                    Create a custom campaign from scratch
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Build your own workflow with complete flexibility
                  </p>
                </CardContent>
              </Card>

              {/* Template Cards */}
              {filteredTemplates.map((template) => (
                <Card
                  key={template.id}
                  className="hover:border-primary cursor-pointer transition-colors"
                  onClick={() => onSelectTemplate(template)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{template.icon}</span>
                        <div>
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <Badge className={`mt-1 ${getCategoryColor(template.category)}`}>
                            {template.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="mt-2">
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{template.config.elements?.length || 0} steps</span>
                      <Button size="sm" variant="ghost">
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
