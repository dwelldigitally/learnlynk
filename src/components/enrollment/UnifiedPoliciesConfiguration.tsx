import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { PolicyConfigurationService, type PolicyConfig } from '@/services/policyConfigurationService';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Clock, MessageSquare, StopCircle, Settings, Zap, Phone, TrendingUp, AlertCircle } from 'lucide-react';
import { ExpectedLiftPanel } from './ExpectedLiftPanel';

interface SpeedPolicyConfiguration {
  id: string;
  policy_name: string;
  enabled: boolean;
  settings: any;
  expected_lift: number;
}

export function UnifiedPoliciesConfiguration() {
  // General Policies State
  const [policies, setPolicies] = useState<PolicyConfig[]>([]);
  const [policiesLoading, setPoliciesLoading] = useState(true);
  const [preview, setPreview] = useState('');
  
  // Speed Policy State
  const [speedPolicyConfig, setSpeedPolicyConfig] = useState<SpeedPolicyConfiguration | null>(null);
  const [speedPolicyLoading, setSpeedPolicyLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    loadAllPolicies();
  }, []);

  useEffect(() => {
    updatePreview();
  }, [policies]);

  const loadAllPolicies = async () => {
    await Promise.all([
      loadGeneralPolicies(),
      loadSpeedPolicyConfiguration()
    ]);
  };

  // General Policies Functions
  const loadGeneralPolicies = async () => {
    try {
      await PolicyConfigurationService.seedDefaultPolicies();
      const data = await PolicyConfigurationService.getPolicies();
      setPolicies(data);
    } catch (error) {
      console.error('Error loading policies:', error);
      toast({
        title: "Error",
        description: "Failed to load policies",
        variant: "destructive",
      });
    } finally {
      setPoliciesLoading(false);
    }
  };

  const updatePreview = async () => {
    try {
      const previewText = await PolicyConfigurationService.getPolicyPreview();
      setPreview(previewText);
    } catch (error) {
      console.error('Error updating preview:', error);
    }
  };

  const handlePolicyToggle = async (policyId: string) => {
    try {
      const policy = policies.find(p => p.id === policyId);
      if (!policy) return;

      const updatedPolicy = await PolicyConfigurationService.updateConfiguration(policyId, {
        enabled: !policy.enabled
      });

      setPolicies(policies.map(p => p.id === policyId ? updatedPolicy : p));
      toast({
        title: "Success",
        description: `Policy ${updatedPolicy.enabled ? 'enabled' : 'disabled'}`,
      });
    } catch (error) {
      console.error('Error updating policy:', error);
      toast({
        title: "Error",
        description: "Failed to update policy",
        variant: "destructive",
      });
    }
  };

  const handlePolicyUpdate = async (policyId: string, settings: any) => {
    try {
      const policy = policies.find(p => p.id === policyId);
      if (!policy) return;

      const updatedPolicy = await PolicyConfigurationService.updateConfiguration(policyId, {
        settings: { ...(policy.settings as any), ...settings }
      });

      setPolicies(policies.map(p => p.id === policyId ? updatedPolicy : p));
    } catch (error) {
      console.error('Error updating policy settings:', error);
      toast({
        title: "Error",
        description: "Failed to update policy settings",
        variant: "destructive",
      });
    }
  };

  // Speed Policy Functions
  const loadSpeedPolicyConfiguration = async () => {
    try {
      const { data, error } = await supabase
        .from('policy_configurations')
        .select('*')
        .eq('policy_name', '5-minute-callback')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setSpeedPolicyConfig(data);
      } else {
        await createDefaultSpeedPolicy();
      }
    } catch (error) {
      console.error('Error loading speed policy configuration:', error);
      toast({
        title: "Error",
        description: "Failed to load speed policy configuration",
        variant: "destructive"
      });
    } finally {
      setSpeedPolicyLoading(false);
    }
  };

  const createDefaultSpeedPolicy = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const defaultConfig = {
        user_id: user.id,
        policy_name: '5-minute-callback',
        enabled: false,
        settings: {
          callback_threshold_minutes: 5,
          auto_assign: true,
          priority_level: 'high',
          channels_enabled: ['phone', 'sms'],
          business_hours_only: false,
          working_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          time_ranges: [{ start: '09:00', end: '17:00' }]
        },
        expected_lift: 23
      };

      const { data, error } = await supabase
        .from('policy_configurations')
        .insert(defaultConfig)
        .select()
        .single();

      if (error) throw error;
      setSpeedPolicyConfig(data);
    } catch (error) {
      console.error('Error creating default speed policy:', error);
      throw error;
    }
  };

  const handleSpeedPolicyToggle = async () => {
    if (!speedPolicyConfig) return;

    setUpdating(true);
    try {
      const { data, error } = await supabase
        .from('policy_configurations')
        .update({ enabled: !speedPolicyConfig.enabled })
        .eq('id', speedPolicyConfig.id)
        .select()
        .single();

      if (error) throw error;

      setSpeedPolicyConfig(data);
      toast({
        title: "Success",
        description: `Speed-to-lead policy ${data.enabled ? 'enabled' : 'disabled'}`,
      });
    } catch (error) {
      console.error('Error updating speed policy:', error);
      toast({
        title: "Error",
        description: "Failed to update speed policy",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleSpeedPolicySettingsUpdate = async (newSettings: any) => {
    if (!speedPolicyConfig) return;

    setUpdating(true);
    try {
      const { data, error } = await supabase
        .from('policy_configurations')
        .update({ 
          settings: { ...speedPolicyConfig.settings, ...newSettings }
        })
        .eq('id', speedPolicyConfig.id)
        .select()
        .single();

      if (error) throw error;

      setSpeedPolicyConfig(data);
      toast({
        title: "Success",
        description: "Speed policy settings updated",
      });
    } catch (error) {
      console.error('Error updating speed policy settings:', error);
      toast({
        title: "Error",
        description: "Failed to update speed policy settings",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
    }
  };

  const getPolicyIcon = (type: string) => {
    switch (type) {
      case 'quiet_hours': return Clock;
      case 'communication_limits': return MessageSquare;
      case 'stop_after_deposit': return StopCircle;
      case 'speed_to_lead': return Zap;
      default: return Shield;
    }
  };

  const activePolicies = policies.filter(p => p.enabled);

  if (policiesLoading || speedPolicyLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Policies & Speed Controls</h1>
          <p className="text-muted-foreground">
            Configure enrollment policies and speed-to-lead automation
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="gap-1">
            <Shield className="h-3 w-3" />
            {activePolicies.length} Active
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Zap className="h-3 w-3" />
            Speed Policy {speedPolicyConfig?.enabled ? 'ON' : 'OFF'}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="speed-policy" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="speed-policy" className="gap-2">
            <Zap className="h-4 w-4" />
            Speed-to-Lead Policy
          </TabsTrigger>
          <TabsTrigger value="general-policies" className="gap-2">
            <Shield className="h-4 w-4" />
            General Policies
          </TabsTrigger>
        </TabsList>

        {/* Speed-to-Lead Policy Tab */}
        <TabsContent value="speed-policy" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Speed Policy Configuration */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    5-Minute Callback Policy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Enable Speed-to-Lead Policy</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically trigger fast callbacks for new leads
                      </p>
                    </div>
                    <Switch
                      checked={speedPolicyConfig?.enabled || false}
                      onCheckedChange={handleSpeedPolicyToggle}
                      disabled={updating}
                    />
                  </div>

                  {speedPolicyConfig?.enabled && (
                    <div className="space-y-4 pt-4 border-t">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Callback Threshold (minutes)</Label>
                          <Input
                            type="number"
                            value={speedPolicyConfig.settings.callback_threshold_minutes}
                            onChange={(e) => handleSpeedPolicySettingsUpdate({
                              callback_threshold_minutes: parseInt(e.target.value)
                            })}
                            min={1}
                            max={60}
                          />
                        </div>
                        <div>
                          <Label>Priority Level</Label>
                          <Select
                            value={speedPolicyConfig.settings.priority_level}
                            onValueChange={(value) => handleSpeedPolicySettingsUpdate({
                              priority_level: value
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Auto-assign to Available Rep</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically assign to the next available representative
                          </p>
                        </div>
                        <Switch
                          checked={speedPolicyConfig.settings.auto_assign}
                          onCheckedChange={(checked) => handleSpeedPolicySettingsUpdate({
                            auto_assign: checked
                          })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Business Hours Only</Label>
                          <p className="text-sm text-muted-foreground">
                            Only trigger during business hours
                          </p>
                        </div>
                        <Switch
                          checked={speedPolicyConfig.settings.business_hours_only}
                          onCheckedChange={(checked) => handleSpeedPolicySettingsUpdate({
                            business_hours_only: checked
                          })}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Speed Policy Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Performance Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">+23%</div>
                      <div className="text-sm text-muted-foreground">Conversion Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">2.3m</div>
                      <div className="text-sm text-muted-foreground">Avg Response Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">94%</div>
                      <div className="text-sm text-muted-foreground">Contact Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Expected Lift Panel */}
            <div>
              <ExpectedLiftPanel 
                isActive={speedPolicyConfig?.enabled || false}
                expectedLift={speedPolicyConfig?.expected_lift || 23}
                policyName="Speed-to-Lead Policy"
              />
            </div>
          </div>
        </TabsContent>

        {/* General Policies Tab */}
        <TabsContent value="general-policies" className="space-y-6">
          {/* How Policies Work */}
          <Card className="border-blue-200 bg-blue-50/50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-medium mb-2">What are Policies?</h3>
                  <p className="text-sm text-muted-foreground">
                    Policies are the rules of the road—quiet hours, stop after deposit, pacing, and which channels are allowed. 
                    They keep things sensible and safe. <strong>Policies win</strong> — even if a playbook wants to send a message, policies can block it.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Policy Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-primary">{activePolicies.length}</div>
                <div className="text-sm text-muted-foreground">Active Policies</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-green-600">Safe</div>
                <div className="text-sm text-muted-foreground">Policy Status</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-blue-600">12</div>
                <div className="text-sm text-muted-foreground">Messages Blocked Today</div>
              </CardContent>
            </Card>
          </div>

          {/* Policies List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {policies.map((policy) => {
              const IconComponent = getPolicyIcon(policy.policy_name);
              return (
                <Card key={policy.id} className={`transition-all duration-200 ${policy.enabled ? 'border-green-200 bg-green-50/30' : 'border-gray-200'}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${policy.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{policy.policy_name}</CardTitle>
                          <p className="text-sm text-muted-foreground">Policy configuration for {policy.policy_name}</p>
                        </div>
                      </div>
                      <Switch
                        checked={policy.enabled}
                        onCheckedChange={() => handlePolicyToggle(policy.id)}
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {policy.settings && typeof policy.settings === 'object' && Object.entries(policy.settings as Record<string, any>).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground capitalize">{key.replace(/_/g, ' ')}:</span>
                          <span className="font-medium">{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {policies.length === 0 && (
            <Card className="text-center py-16">
              <CardContent>
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No policies configured</h3>
                <p className="text-muted-foreground">Policies will be automatically seeded when you configure your first enrollment workflow.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Preview Panel */}
      {preview && (
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Current Policy Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm bg-background p-4 rounded-lg overflow-auto max-h-40">
              {preview}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}