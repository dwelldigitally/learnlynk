import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Loader2, Check, RefreshCw, Wand2, ArrowRight } from 'lucide-react';
import { useAIWorkflowGenerator } from '@/hooks/useAIWorkflowGenerator';
import { cn } from '@/lib/utils';

interface AIWorkflowGeneratorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyWorkflow: (workflow: {
    name: string;
    description: string;
    elements: any[];
  }) => void;
  existingElements?: any[];
}

const EXAMPLE_PROMPTS = [
  {
    title: "Welcome Sequence",
    description: "Send welcome email to new leads, wait 2 days, follow up if no response",
  },
  {
    title: "Re-engagement Campaign",
    description: "For leads inactive for 30 days: send 'we miss you' email, wait a week, send special offer, create task if no response",
  },
  {
    title: "Application Reminder",
    description: "When application is incomplete: send reminder email, wait 3 days, send SMS, escalate to advisor",
  },
  {
    title: "Payment Follow-up",
    description: "Send payment reminder when due, wait 5 days, send urgent reminder, create task for finance team",
  },
  {
    title: "High-Value Lead Nurture",
    description: "For leads with score above 80: assign to senior advisor, send personalized email, schedule call task",
  },
  {
    title: "Document Collection",
    description: "Request documents via email, wait 1 week, send SMS reminder, notify advisor if still missing",
  },
];

export function AIWorkflowGenerator({ 
  open, 
  onOpenChange, 
  onApplyWorkflow,
  existingElements 
}: AIWorkflowGeneratorProps) {
  const [description, setDescription] = useState('');
  const { generateWorkflow, isGenerating, generatedWorkflow, error, clearGenerated } = useAIWorkflowGenerator();

  const handleGenerate = async () => {
    if (!description.trim()) return;
    await generateWorkflow(description, existingElements);
  };

  const handleApply = () => {
    if (generatedWorkflow) {
      onApplyWorkflow(generatedWorkflow);
      onOpenChange(false);
      setDescription('');
      clearGenerated();
    }
  };

  const handleRegenerate = () => {
    clearGenerated();
    handleGenerate();
  };

  const handleExampleClick = (prompt: string) => {
    setDescription(prompt);
    clearGenerated();
  };

  const handleClose = () => {
    onOpenChange(false);
    setDescription('');
    clearGenerated();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Workflow Generator
          </DialogTitle>
          <DialogDescription>
            Describe your automation in plain English and let AI build it for you
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4">
          {/* Input Section */}
          <div className="space-y-3">
            <Textarea
              placeholder="Describe what you want your automation to do...

Example: 'When a new lead is created from the website, send a welcome email immediately, wait 2 days, then check if they opened it. If not, send a follow-up SMS and create a task for the assigned advisor.'"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px] resize-none"
              disabled={isGenerating}
            />

            <div className="flex items-center gap-2">
              <Button
                onClick={handleGenerate}
                disabled={!description.trim() || isGenerating}
                className="gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" />
                    Generate Workflow
                  </>
                )}
              </Button>

              {generatedWorkflow && (
                <Button variant="outline" onClick={handleRegenerate} className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Regenerate
                </Button>
              )}
            </div>
          </div>

          {/* Example Prompts */}
          {!generatedWorkflow && !isGenerating && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Try an example:</p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_PROMPTS.map((example, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-accent transition-colors py-1.5 px-3"
                    onClick={() => handleExampleClick(example.description)}
                  >
                    {example.title}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Generated Preview */}
          {generatedWorkflow && (
            <div className="flex-1 overflow-hidden border rounded-lg">
              <div className="p-3 border-b bg-muted/50 flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{generatedWorkflow.name}</h4>
                  <p className="text-sm text-muted-foreground">{generatedWorkflow.description}</p>
                </div>
                <Badge variant="secondary" className="gap-1">
                  <Check className="h-3 w-3" />
                  {generatedWorkflow.elements.length} steps
                </Badge>
              </div>

              <ScrollArea className="h-[200px]">
                <div className="p-4 space-y-2">
                  {generatedWorkflow.elements.map((element, index) => (
                    <div 
                      key={element.id} 
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border"
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
                        element.type === 'trigger' && "bg-blue-500/20 text-blue-600",
                        element.type === 'email' && "bg-green-500/20 text-green-600",
                        element.type === 'sms' && "bg-purple-500/20 text-purple-600",
                        element.type === 'wait' && "bg-orange-500/20 text-orange-600",
                        element.type === 'condition' && "bg-yellow-500/20 text-yellow-600",
                        element.type === 'create-task' && "bg-pink-500/20 text-pink-600",
                        element.type === 'update-lead' && "bg-cyan-500/20 text-cyan-600",
                        element.type === 'assign-advisor' && "bg-indigo-500/20 text-indigo-600",
                        !['trigger', 'email', 'sms', 'wait', 'condition', 'create-task', 'update-lead', 'assign-advisor'].includes(element.type) && "bg-gray-500/20 text-gray-600"
                      )}>
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{element.title}</p>
                        <p className="text-xs text-muted-foreground capitalize">{element.type.replace('-', ' ')}</p>
                      </div>
                      {index < generatedWorkflow.elements.length - 1 && (
                        <ArrowRight className="h-4 w-4 text-muted-foreground/50" />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleApply} 
            disabled={!generatedWorkflow}
            className="gap-2"
          >
            <Check className="h-4 w-4" />
            Apply Workflow
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
