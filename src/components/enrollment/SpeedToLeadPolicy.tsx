import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Zap, Phone, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ExpectedLiftPanel } from './ExpectedLiftPanel';

interface PolicyConfiguration {
  id: string;
  policy_name: string;
  enabled: boolean;
  settings: any;
  expected_lift: number;
}

export function SpeedToLeadPolicy() {
  const [policyConfig, setPolicyConfig] = useState<PolicyConfiguration | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPolicyConfiguration();
  }, []);

  const loadPolicyConfiguration = async () => {
    try {
      const { data, error } = await supabase
        .from('policy_configurations')
        .select('*')
        .eq('policy_name', '5-minute-callback')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setPolicyConfig(data);
      } else {
        // Create default policy configuration
        await createDefaultPolicy();
      }
    } catch (error) {
      console.error('Error loading policy configuration:', error);
      toast({
        title: "Error",
        description: "Failed to load policy configuration",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createDefaultPolicy = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('policy_configurations')
        .insert({
          user_id: user.id,
          policy_name: '5-minute-callback',
          enabled: false,
          settings: { target_band: 'high', callback_delay_minutes: 5 },
          expected_lift: 15.3
        })
        .select()
        .single();

      if (error) throw error;
      setPolicyConfig(data);
    } catch (error) {
      console.error('Error creating default policy:', error);
      throw error;
    }
  };

  const handlePolicyToggle = async (enabled: boolean) => {
    if (!policyConfig) return;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from('policy_configurations')
        .update({ enabled })
        .eq('id', policyConfig.id);

      if (error) throw error;

      setPolicyConfig({ ...policyConfig, enabled });
      
      toast({
        title: enabled ? "Policy Activated" : "Policy Deactivated",
        description: enabled 
          ? "5-minute callback policy is now active for high-intent leads"
          : "5-minute callback policy has been deactivated",
      });
    } catch (error) {
      console.error('Error updating policy:', error);
      toast({
        title: "Error",
        description: "Failed to update policy",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-64 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Speed-to-Lead Policy</h1>
        <p className="text-muted-foreground">
          Configure response speed policies to maximize conversion rates
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Policy Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-primary" />
                <span>5-Minute Callback for High-Intent</span>
                <Badge 
                  variant={policyConfig?.enabled ? "default" : "secondary"}
                  className={policyConfig?.enabled ? "bg-green-100 text-green-800" : ""}
                >
                  {policyConfig?.enabled ? "Active" : "Inactive"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium text-foreground">
                    Automatic callback within 5 minutes for high-yield band leads
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Triggers immediate callback task assignment when high-intent signals are detected
                  </p>
                </div>
                <Switch
                  checked={policyConfig?.enabled || false}
                  onCheckedChange={handlePolicyToggle}
                  disabled={updating}
                />
              </div>

              {/* Policy Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Phone className="h-8 w-8 text-primary" />
                  </div>
                  <p className="font-medium text-foreground">Target Band</p>
                  <p className="text-sm text-muted-foreground">High Yield Only</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="h-8 w-8 text-primary" />
                  </div>
                  <p className="font-medium text-foreground">Response Time</p>
                  <p className="text-sm text-muted-foreground">≤ 5 Minutes</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <p className="font-medium text-foreground">Expected Lift</p>
                  <p className="text-sm text-muted-foreground">+{policyConfig?.expected_lift}%</p>
                </div>
              </div>

              {/* Implementation Details */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-2">How it works:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Monitors high-intent signals (webinar attendance, form submissions, high pageviews)</li>
                  <li>• Automatically creates priority callback tasks for counselors</li>
                  <li>• Includes lead context and engagement history in task details</li>
                  <li>• Tracks response times and conversion rates for optimization</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Expected Lift Panel */}
        <div>
          <ExpectedLiftPanel 
            isActive={policyConfig?.enabled || false}
            expectedLift={policyConfig?.expected_lift || 0}
            policyName="Speed-to-Lead"
          />
        </div>
      </div>
    </div>
  );
}