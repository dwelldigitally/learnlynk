import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Bot,
  Zap,
  Target,
  MessageSquare,
  Users,
  TrendingUp,
  Clock,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { HelpIcon } from "@/components/ui/help-icon";
import { useHelpContent } from "@/hooks/useHelpContent";

interface AIAction {
  id: string;
  title: string;
  description: string;
  icon: any;
  action: () => Promise<void>;
  type: 'instant' | 'bulk' | 'analysis';
  context: string[];
  urgent?: boolean;
  helpKey: string;
}

export function AIQuickActions() {
  const location = useLocation();
  const { toast } = useToast();
  const { getHelpContent } = useHelpContent();
  const [loading, setLoading] = useState<string | null>(null);
  const currentPath = location.pathname;

  const executeAIAction = async (actionId: string, actionFn: () => Promise<void>) => {
    setLoading(actionId);
    try {
      await actionFn();
      toast({
        title: "AI Action Completed",
        description: "Your AI operation has been completed successfully.",
      });
    } catch (error) {
      toast({
        title: "AI Action Failed",
        description: "There was an error executing the AI action. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const aiActions: AIAction[] = [
    {
      id: "score-leads",
      title: "AI Lead Scoring",
      description: "Score unscored leads",
      icon: Target,
      type: "bulk",
      context: ["/admin/leads"],
      helpKey: "aiLeadScoring",
      action: async () => {
        const { data, error } = await supabase.functions.invoke('ai-lead-scoring', {
          body: { analysisType: 'revamp' }
        });
        if (error) throw error;
      }
    },
    {
      id: "generate-followup",
      title: "Smart Follow-ups",
      description: "Generate follow-up templates",
      icon: MessageSquare,
      type: "bulk",
      context: ["/admin/leads", "/admin/communication"],
      helpKey: "smartFollowups",
      action: async () => {
        const { data, error } = await supabase.functions.invoke('ai-template-assistant', {
          body: {
            action: 'generate',
            templateType: 'email',
            purpose: 'follow_up',
            tone: 'professional'
          }
        });
        if (error) throw error;
      }
    },
    {
      id: "priority-analysis",
      title: "Priority Analysis",
      description: "AI lead prioritization",
      icon: TrendingUp,
      type: "analysis",
      context: ["/admin/leads"],
      urgent: true,
      helpKey: "priorityAnalysis",
      action: async () => {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    },
    {
      id: "smart-assignment",
      title: "Smart Assignment",
      description: "AI lead distribution",
      icon: Users,
      type: "bulk",
      context: ["/admin/leads", "/admin/team"],
      helpKey: "smartAssignment",
      action: async () => {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    },
    {
      id: "optimal-timing",
      title: "Contact Timing",
      description: "AI contact scheduling",
      icon: Clock,
      type: "instant",
      context: ["/admin/leads"],
      helpKey: "contactTiming",
      action: async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  ];

  // Debug logging
  console.log('🔍 AIQuickActions Debug:');
  console.log('- Current path:', currentPath);
  console.log('- Total AI actions:', aiActions.length);
  
  // Filter actions based on current context, or show default actions for admin pages
  const contextualActions = currentPath.startsWith('/admin') 
    ? aiActions.filter(action => 
        action.context.some(ctx => currentPath.startsWith(ctx)) ||
        action.context.includes('/admin/leads') // Default fallback to lead actions
      )
    : [];

  console.log('- Filtered contextual actions:', contextualActions.length);
  console.log('- Contextual actions:', contextualActions.map(a => a.title));

  const urgentActions = contextualActions.filter(action => action.urgent);
  const regularActions = contextualActions.filter(action => !action.urgent);
  
  console.log('- Urgent actions:', urgentActions.length);
  console.log('- Regular actions:', regularActions.length);

  // Always show the component on admin pages, even if no specific actions
  if (!currentPath.startsWith('/admin')) {
    console.log('- Not on admin page, returning null');
    return null;
  }

  console.log('- Rendering AI Quick Actions component');

  return (
    <Card className="mx-2 mb-4 bg-card/50 backdrop-blur-sm border-primary/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Bot className="h-4 w-4 text-primary" />
          AI Quick Actions
          <HelpIcon 
            content={getHelpContent("aiQuickActions")}
            size="sm"
          />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {urgentActions.length > 0 && (
          <>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-3 w-3 text-orange-500" />
                <span className="text-xs font-medium text-orange-500">Urgent</span>
              </div>
              {urgentActions.map((action) => (
                <Button
                  key={action.id}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start h-auto p-3 border-orange-200 hover:border-orange-300 hover:bg-orange-50/50"
                  onClick={() => executeAIAction(action.id, action.action)}
                  disabled={loading === action.id}
                >
                  <div className="flex items-center gap-3 w-full">
                    {loading === action.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <action.icon className="h-4 w-4 text-orange-500" />
                    )}
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-1">
                        <div className="font-medium text-xs">{action.title}</div>
                        <HelpIcon 
                          content={getHelpContent(action.helpKey)}
                          size="sm"
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">{action.description}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
            <Separator className="my-3" />
          </>
        )}

        <div className="space-y-2">
          {regularActions.map((action) => (
            <Button
              key={action.id}
              variant="ghost"
              size="sm"
              className="w-full justify-start h-auto p-3 hover:bg-primary/5"
              onClick={() => executeAIAction(action.id, action.action)}
              disabled={loading === action.id}
            >
              <div className="flex items-center gap-3 w-full">
                {loading === action.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <action.icon className="h-4 w-4 text-primary" />
                )}
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-1">
                    <div className="font-medium text-xs">{action.title}</div>
                    <HelpIcon 
                      content={getHelpContent(action.helpKey)}
                      size="sm"
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              </div>
            </Button>
          ))}
        </div>

        <div className="pt-2 border-t border-border/50">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs text-muted-foreground hover:text-primary"
            onClick={() => window.location.href = '/admin/ai-features'}
          >
            <Zap className="h-3 w-3 mr-2" />
            View All AI Features
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}