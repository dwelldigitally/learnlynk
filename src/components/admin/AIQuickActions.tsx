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

interface AIAction {
  id: string;
  title: string;
  description: string;
  icon: any;
  action: () => Promise<void>;
  type: 'instant' | 'bulk' | 'analysis';
  context: string[];
  urgent?: boolean;
}

export function AIQuickActions() {
  const location = useLocation();
  const { toast } = useToast();
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
      description: "Score all unscored leads using AI",
      icon: Target,
      type: "bulk",
      context: ["/admin/leads"],
      action: async () => {
        const { data, error } = await supabase.functions.invoke('ai-lead-scoring', {
          body: { analysisType: 'revamp' }
        });
        if (error) throw error;
      }
    },
    {
      id: "generate-forms",
      title: "AI Form Builder",
      description: "Generate smart lead capture forms",
      icon: Sparkles,
      type: "instant",
      context: ["/admin/leads/forms"],
      action: async () => {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    },
    {
      id: "generate-followup",
      title: "Smart Follow-ups",
      description: "Generate personalized follow-up templates",
      icon: MessageSquare,
      type: "bulk",
      context: ["/admin/leads", "/admin/communication"],
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
      description: "AI-powered lead prioritization",
      icon: TrendingUp,
      type: "analysis",
      context: ["/admin/leads"],
      urgent: true,
      action: async () => {
        // Simulate AI analysis
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    },
    {
      id: "smart-assignment",
      title: "Smart Assignment",
      description: "AI-based lead distribution",
      icon: Users,
      type: "bulk",
      context: ["/admin/leads", "/admin/team"],
      action: async () => {
        // Simulate smart assignment logic
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    },
    {
      id: "conversion-prediction",
      title: "Conversion Forecast",
      description: "Predict lead conversion probability",
      icon: Sparkles,
      type: "analysis",
      context: ["/admin/leads", "/admin/analytics"],
      action: async () => {
        // Simulate prediction analysis
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    },
    {
      id: "optimal-timing",
      title: "Contact Timing",
      description: "AI-optimized contact scheduling",
      icon: Clock,
      type: "instant",
      context: ["/admin/leads"],
      action: async () => {
        // Simulate timing optimization
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  ];

  // Filter actions based on current context
  const contextualActions = aiActions.filter(action => 
    action.context.some(ctx => currentPath.startsWith(ctx))
  );

  const urgentActions = contextualActions.filter(action => action.urgent);
  const regularActions = contextualActions.filter(action => !action.urgent);

  if (contextualActions.length === 0) {
    return null;
  }

  return (
    <Card className="mx-2 mb-4 bg-card/50 backdrop-blur-sm border-primary/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Bot className="h-4 w-4 text-primary" />
          AI Quick Actions
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
                      <div className="font-medium text-xs">{action.title}</div>
                      <div className="text-xs text-muted-foreground">{action.description}</div>
                    </div>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
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
                  <div className="font-medium text-xs">{action.title}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant="secondary" className="text-xs">
                    {action.type}
                  </Badge>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
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
          >
            <Zap className="h-3 w-3 mr-2" />
            View All AI Features
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}