import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wand2, Phone, Mail, MessageSquare, Calendar, FileText, Gift, Clock } from 'lucide-react';
import { Lead } from '@/types/lead';
import { useToast } from '@/hooks/use-toast';

interface RecommendedActionsProps {
  lead: Lead;
  onAction: () => void;
}

interface RecommendedAction {
  id: string;
  type: 'call' | 'email' | 'sms' | 'meeting' | 'document' | 'offer' | 'followup';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  confidence: number;
  estimated_time: number; // minutes
  template?: string;
}

export function RecommendedActions({ lead, onAction }: RecommendedActionsProps) {
  const [actions, setActions] = useState<RecommendedAction[]>([]);
  const [loading, setLoading] = useState(false);
  const [executingAction, setExecutingAction] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    generateRecommendedActions();
  }, [lead]);

  const generateRecommendedActions = async () => {
    setLoading(true);
    
    try {
      const recommendedActions = await calculateRecommendedActions();
      setActions(recommendedActions);
    } catch (error) {
      console.error('Failed to generate recommended actions:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateRecommendedActions = async (): Promise<RecommendedAction[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const actions: RecommendedAction[] = [];
    const leadAge = (new Date().getTime() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60);
    
    // Fresh lead actions
    if (leadAge < 2 && lead.status === 'new') {
      actions.push({
        id: 'urgent_call',
        type: 'call',
        title: 'Urgent Call',
        description: 'Call immediately while lead is hot',
        priority: 'high',
        confidence: 95,
        estimated_time: 15,
        template: 'Hi {{first_name}}, I just received your inquiry and wanted to reach out immediately...'
      });
    }
    
    // Status-based actions
    if (lead.status === 'new') {
      actions.push({
        id: 'welcome_email',
        type: 'email',
        title: 'Send Welcome Email',
        description: 'Warm welcome with program information',
        priority: 'high',
        confidence: 88,
        estimated_time: 5,
        template: 'Welcome to {{company}}! Thank you for your interest in {{program_interest}}...'
      });
    } else if (lead.status === 'contacted') {
      actions.push({
        id: 'followup_call',
        type: 'call',
        title: 'Follow-up Call',
        description: 'Check in and address any questions',
        priority: 'medium',
        confidence: 82,
        estimated_time: 10
      });
    } else if (lead.status === 'qualified') {
      actions.push({
        id: 'schedule_meeting',
        type: 'meeting',
        title: 'Schedule Campus Visit',
        description: 'Book in-person or virtual campus tour',
        priority: 'high',
        confidence: 90,
        estimated_time: 20
      });
    }
    
    // Time-based actions
    if (leadAge > 48 && leadAge < 168) { // 2-7 days
      actions.push({
        id: 'reengagement_email',
        type: 'email',
        title: 'Re-engagement Email',
        description: 'Special offer to rekindle interest',
        priority: 'medium',
        confidence: 75,
        estimated_time: 8,
        template: 'I wanted to follow up on your interest in {{program_interest}}. We have a special opportunity...'
      });
    } else if (leadAge > 168) { // > 1 week
      actions.push({
        id: 'special_offer',
        type: 'offer',
        title: 'Send Special Offer',
        description: 'Limited-time scholarship or discount',
        priority: 'high',
        confidence: 85,
        estimated_time: 12
      });
    }
    
    // Source-based actions
    if (lead.source === 'web' || lead.source === 'forms') {
      actions.push({
        id: 'program_brochure',
        type: 'document',
        title: 'Send Program Brochure',
        description: 'Digital brochure with career outcomes',
        priority: 'medium',
        confidence: 78,
        estimated_time: 3
      });
    }
    
    // Priority-based actions
    if (lead.priority === 'high' || lead.priority === 'urgent') {
      actions.push({
        id: 'priority_sms',
        type: 'sms',
        title: 'Priority SMS',
        description: 'Quick SMS to acknowledge urgency',
        priority: 'high',
        confidence: 92,
        estimated_time: 2,
        template: 'Hi {{first_name}}, thanks for your urgent inquiry. When would be a good time to call you today?'
      });
    }
    
    // International student actions
    if (lead.country && lead.country !== 'United States') {
      actions.push({
        id: 'visa_info',
        type: 'document',
        title: 'Visa Information Package',
        description: 'Complete visa and immigration guide',
        priority: 'medium',
        confidence: 85,
        estimated_time: 5
      });
    }
    
    // Program-specific actions
    if (lead.program_interest?.length > 0) {
      actions.push({
        id: 'program_specific_followup',
        type: 'email',
        title: 'Program-Specific Information',
        description: `Detailed info about ${lead.program_interest.join(', ')}`,
        priority: 'medium',
        confidence: 80,
        estimated_time: 10
      });
    }
    
    // Generic follow-up for older leads
    if (!actions.length) {
      actions.push({
        id: 'general_followup',
        type: 'followup',
        title: 'General Follow-up',
        description: 'Check current status and interest level',
        priority: 'low',
        confidence: 60,
        estimated_time: 8
      });
    }
    
    return actions.slice(0, 4); // Show top 4 actions
  };

  const executeAction = async (action: RecommendedAction) => {
    setExecutingAction(action.id);
    
    try {
      // Simulate action execution
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: 'Action Executed',
        description: `${action.title} completed successfully`,
      });
      
      onAction(); // Refresh lead data
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to execute ${action.title}`,
        variant: 'destructive'
      });
    } finally {
      setExecutingAction(null);
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'sms': return <MessageSquare className="h-4 w-4" />;
      case 'meeting': return <Calendar className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      case 'offer': return <Gift className="h-4 w-4" />;
      case 'followup': return <Clock className="h-4 w-4" />;
      default: return <Wand2 className="h-4 w-4" />;
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            Recommended Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Wand2 className="h-4 w-4" />
          Recommended Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No actions recommended</p>
        ) : (
          actions.map((action) => (
            <div key={action.id} className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2 flex-1">
                  <div className="flex-shrink-0 mt-0.5">
                    {getActionIcon(action.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium">{action.title}</p>
                      <Badge variant={getPriorityVariant(action.priority)} className="text-xs">
                        {action.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        ~{action.estimated_time}min
                      </span>
                      <span className="text-xs text-blue-600">
                        {action.confidence}% confidence
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full"
                onClick={() => executeAction(action)}
                disabled={executingAction === action.id}
              >
                {executingAction === action.id ? 'Executing...' : 'Execute'}
              </Button>
              {action !== actions[actions.length - 1] && <hr className="my-2" />}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}