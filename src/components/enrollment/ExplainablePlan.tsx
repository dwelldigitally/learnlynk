import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, FileText, Clock, Users, AlertCircle } from 'lucide-react';

interface ProgramPlan {
  program_name: string;
  active_plays: Array<{
    name: string;
    description: string;
    play_type: string;
  }>;
  policies: Array<{
    name: string;
    description: string;
  }>;
  settings: {
    stall_days?: number;
    requires_interview?: boolean;
    requires_documents?: boolean;
    response_time_target?: number;
  };
}

export function ExplainablePlan() {
  const [plans, setPlans] = useState<ProgramPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      // Load program configurations
      const { data: programConfigs, error: programError } = await supabase
        .from('program_configurations')
        .select('*')
        .eq('is_active', true);

      if (programError) throw programError;

      // Load active plays
      const { data: activePlays, error: playsError } = await supabase
        .from('plays')
        .select('*')
        .eq('is_active', true);

      if (playsError) throw playsError;

      // Load active policies
      const { data: activePolicies, error: policiesError } = await supabase
        .from('policies')
        .select('*')
        .eq('is_active', true);

      if (policiesError) throw policiesError;

      // Combine data into plans
      const combinedPlans: ProgramPlan[] = programConfigs?.map(config => ({
        program_name: config.program_name,
        active_plays: activePlays || [],
        policies: activePolicies || [],
        settings: config.settings as any
      })) || [];

      setPlans(combinedPlans);
    } catch (error) {
      console.error('Error loading plans:', error);
      toast({
        title: "Error",
        description: "Failed to load explainable plan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generatePlanDescription = (plan: ProgramPlan): string => {
    const actions: string[] = [];

    // Add response time commitment
    if (plan.settings.response_time_target) {
      actions.push(`call high-intent inquiries within ${plan.settings.response_time_target} minutes`);
    }

    // Add document requirements
    if (plan.settings.requires_documents) {
      const stallDays = plan.settings.stall_days || 7;
      actions.push(`chase missing documents on days 0/3/${stallDays}`);
    }

    // Add interview process
    if (plan.settings.requires_interview) {
      actions.push('invite to interview after webinars within 48 hours');
    }

    // Add policies
    const policyActions = plan.policies.map(policy => {
      switch (policy.name) {
        case 'Stop After Deposit':
          return 'stop all marketing when a deposit posts';
        case 'Quiet Hours':
          return 'respect quiet hours (9pm-8am)';
        case 'Message Pacing':
          return 'limit message frequency';
        default:
          return null;
      }
    }).filter(Boolean);

    actions.push(...policyActions);

    return actions.length > 0 
      ? `we will: ${actions.join(', ')}`
      : 'basic policies are in place';
  };

  const handleApprovePlan = async () => {
    setApproving(true);
    try {
      // In a real implementation, this would mark the plan as approved
      // and perhaps trigger onboarding or setup completion
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Plan approved!",
        description: "Your automation plan is now active and will begin generating actions.",
      });
    } catch (error) {
      console.error('Error approving plan:', error);
      toast({
        title: "Error",
        description: "Failed to approve plan",
        variant: "destructive",
      });
    } finally {
      setApproving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-32 bg-muted rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalActivePlays = plans.reduce((sum, plan) => sum + plan.active_plays.length, 0);
  const totalActivePolicies = plans.length > 0 ? plans[0].policies.length : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Explainable Plan</h1>
        <p className="text-muted-foreground">
          Review what will happen with your current configuration
        </p>
      </div>

      {/* Summary Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Configuration Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{plans.length}</div>
              <div className="text-sm text-muted-foreground">Programs Configured</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{totalActivePlays}</div>
              <div className="text-sm text-muted-foreground">Active Plays</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{totalActivePolicies}</div>
              <div className="text-sm text-muted-foreground">Active Policies</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Program Plans */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Program-by-Program Plan</h2>
        
        {plans.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No programs configured</h3>
              <p className="text-muted-foreground">
                Configure at least one program to see your automation plan.
              </p>
            </CardContent>
          </Card>
        ) : (
          plans.map((plan, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-sm">
                      {plan.program_name}
                    </Badge>
                  </div>
                  
                  <div className="text-lg">
                    For <span className="font-semibold">{plan.program_name}</span>{' '}
                    <span className="text-muted-foreground">{generatePlanDescription(plan)}.</span>
                  </div>

                  {/* Active Plays */}
                  {plan.active_plays.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                        Active Plays:
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {plan.active_plays.map((play, playIndex) => (
                          <Badge key={playIndex} variant="secondary">
                            {play.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Settings Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <Clock className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                      <div className="text-sm font-medium">
                        {plan.settings.response_time_target || 5}min
                      </div>
                      <div className="text-xs text-muted-foreground">Response Time</div>
                    </div>
                    
                    <div className="text-center">
                      <FileText className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                      <div className="text-sm font-medium">
                        {plan.settings.stall_days || 7} days
                      </div>
                      <div className="text-xs text-muted-foreground">Stall Threshold</div>
                    </div>
                    
                    <div className="text-center">
                      <Users className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                      <div className="text-sm font-medium">
                        {plan.settings.requires_interview ? 'Yes' : 'No'}
                      </div>
                      <div className="text-xs text-muted-foreground">Interview Required</div>
                    </div>
                    
                    <div className="text-center">
                      <CheckCircle className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                      <div className="text-sm font-medium">
                        {plan.settings.requires_documents ? 'Yes' : 'No'}
                      </div>
                      <div className="text-xs text-muted-foreground">Extra Documents</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Approval Section */}
      {plans.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-green-800 mb-1">Ready to Approve?</h3>
                <p className="text-sm text-green-700">
                  This plan will start generating actions for counselors immediately.
                </p>
              </div>
              <Button 
                onClick={handleApprovePlan}
                disabled={approving}
                className="bg-green-600 hover:bg-green-700"
              >
                {approving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Approving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Plan
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}