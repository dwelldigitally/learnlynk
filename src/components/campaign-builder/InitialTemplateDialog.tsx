import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { campaignTemplates, CampaignTemplate } from '@/config/campaignTemplates';
import { FileText, Sparkles } from 'lucide-react';

interface InitialTemplateDialogProps {
  open: boolean;
  onSelectTemplate: (template: CampaignTemplate) => void;
  onStartBlank: () => void;
}

export function InitialTemplateDialog({ open, onSelectTemplate, onStartBlank }: InitialTemplateDialogProps) {
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
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-5xl max-h-[90vh]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Start Your Campaign
          </DialogTitle>
          <DialogDescription>
            Choose a pre-built template to get started quickly or build from scratch
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Start Blank Option */}
            <Card 
              className="border-2 border-dashed hover:border-primary cursor-pointer transition-all hover:shadow-md" 
              onClick={onStartBlank}
            >
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-base">Blank Campaign</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Build your own workflow from scratch
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Complete flexibility to create exactly what you need
                </p>
              </CardContent>
            </Card>

            {/* Template Cards */}
            {campaignTemplates.map((template) => (
              <Card
                key={template.id}
                className="hover:border-primary cursor-pointer transition-all hover:shadow-md"
                onClick={() => onSelectTemplate(template)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{template.icon}</span>
                    <Badge className={`text-xs ${getCategoryColor(template.category)}`}>
                      {template.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  <CardDescription className="text-xs line-clamp-2">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{template.config.elements?.length || 0} steps</span>
                    <Button size="sm" variant="ghost" className="h-7 text-xs">
                      Use
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
