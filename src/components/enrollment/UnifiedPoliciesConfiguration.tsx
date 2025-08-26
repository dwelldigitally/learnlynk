import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { PolicyConfigurationService, type PolicyConfig } from '@/services/policyConfigurationService';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Clock, MessageSquare, StopCircle, Settings, Zap, Phone, TrendingUp, Volume2 } from 'lucide-react';
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

  const getPolicyIcon = (policyName: string) => {
    switch (policyName) {
      case 'quiet_hours': return <Clock className="h-5 w-5" />;
      case 'message_pacing': return <MessageSquare className="h-5 w-5" />;
      case 'stop_triggers': return <StopCircle className="h-5 w-5" />;
      case 'confidence_bands': return <TrendingUp className="h-5 w-5" />;
      case 'volume_limits': return <Volume2 className="h-5 w-5" />;
      default: return <Settings className="h-5 w-5" />;
    }
  };

  const getPolicyDescription = (policyName: string) => {
    switch (policyName) {
      case 'quiet_hours': return 'Queue communications during quiet hours to respect student privacy';
      case 'message_pacing': return 'Control the frequency of messages to prevent overwhelming students';
      case 'stop_triggers': return 'Automatically stop marketing when students take specific actions';
      case 'confidence_bands': return 'Set minimum confidence thresholds for automated actions';
      case 'volume_limits': return 'Set daily and weekly limits on total communication volume';
      default: return 'Configure this policy to control automated communications';
    }
  };

  const renderPolicyConfiguration = (policy: PolicyConfig) => {
    const config = policy.settings as Record<string, any>;

    switch (policy.policy_name) {
      case 'quiet_hours':
        return (
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Start Time</Label>
                <Input
                  type="time"
                  value={config.start_time || '21:00'}
                  onChange={(e) => handlePolicyUpdate(policy.id, { start_time: e.target.value })}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">End Time</Label>
                <Input
                  type="time"
                  value={config.end_time || '08:00'}
                  onChange={(e) => handlePolicyUpdate(policy.id, { end_time: e.target.value })}
                  className="w-full"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Timezone</Label>
              <Select
                value={config.timezone || 'UTC'}
                onValueChange={(value) => handlePolicyUpdate(policy.id, { timezone: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  <SelectItem value="America/Chicago">Central Time</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-muted-foreground bg-background/50 p-3 rounded border">
              <Clock className="h-4 w-4 inline mr-2" />
              Messages will be queued and sent after quiet hours end
            </p>
          </div>
        );

      case 'message_pacing':
        return (
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Max Messages per Day</Label>
                <Select
                  value={String(config.max_messages_per_day || 2)}
                  onValueChange={(value) => handlePolicyUpdate(policy.id, { max_messages_per_day: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 message per day</SelectItem>
                    <SelectItem value="2">2 messages per day</SelectItem>
                    <SelectItem value="3">3 messages per day</SelectItem>
                    <SelectItem value="5">5 messages per day</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Hours Between Messages</Label>
                <Select
                  value={String(config.min_hours_between || 3)}
                  onValueChange={(value) => handlePolicyUpdate(policy.id, { min_hours_between: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hour minimum</SelectItem>
                    <SelectItem value="2">2 hours minimum</SelectItem>
                    <SelectItem value="3">3 hours minimum</SelectItem>
                    <SelectItem value="6">6 hours minimum</SelectItem>
                    <SelectItem value="12">12 hours minimum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Adaptive Pacing</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={config.adaptive_pacing || false}
                  onCheckedChange={(checked) => handlePolicyUpdate(policy.id, { adaptive_pacing: checked })}
                />
                <span className="text-sm text-muted-foreground">Automatically adjust pacing based on engagement</span>
              </div>
            </div>
          </div>
        );

      case 'stop_triggers':
        return (
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-background rounded border">
                <div className="flex items-center space-x-2">
                  <StopCircle className="h-4 w-4 text-red-500" />
                  <Label className="text-sm font-medium">Stop after deposit</Label>
                </div>
                <Switch
                  checked={config.stop_on_deposit || false}
                  onCheckedChange={(checked) => handlePolicyUpdate(policy.id, { stop_on_deposit: checked })}
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-background rounded border">
                <div className="flex items-center space-x-2">
                  <StopCircle className="h-4 w-4 text-red-500" />
                  <Label className="text-sm font-medium">Stop after enrollment</Label>
                </div>
                <Switch
                  checked={config.stop_on_enrollment || false}
                  onCheckedChange={(checked) => handlePolicyUpdate(policy.id, { stop_on_enrollment: checked })}
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-background rounded border">
                <div className="flex items-center space-x-2">
                  <StopCircle className="h-4 w-4 text-orange-500" />
                  <Label className="text-sm font-medium">Stop after unsubscribe</Label>
                </div>
                <Switch
                  checked={config.stop_on_unsubscribe !== false}
                  onCheckedChange={(checked) => handlePolicyUpdate(policy.id, { stop_on_unsubscribe: checked })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Grace Period (hours)</Label>
              <div className="px-3">
                <Slider
                  value={[config.grace_period_hours || 24]}
                  onValueChange={(value) => handlePolicyUpdate(policy.id, { grace_period_hours: value[0] })}
                  max={72}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Immediate</span>
                  <span>{config.grace_period_hours || 24}h</span>
                  <span>72h</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderGeneralPolicies = () => {
    return policies.map((policy) => (
      <Card key={policy.id} className={policy.enabled ? "border-primary shadow-sm" : "border-border"}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg transition-colors ${
                policy.enabled 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {getPolicyIcon(policy.policy_name)}
              </div>
              <div>
                <CardTitle className="text-lg">
                  {policy.policy_name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {getPolicyDescription(policy.policy_name)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {policy.enabled && (
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                  Active
                </Badge>
              )}
              <Switch
                checked={policy.enabled}
                onCheckedChange={() => handlePolicyToggle(policy.id)}
              />
            </div>
          </div>
        </CardHeader>
        
        {policy.enabled && (
          <CardContent>
            {renderPolicyConfiguration(policy)}
          </CardContent>
        )}
      </Card>
    ));
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

  const totalActivePolicies = (speedPolicyConfig?.enabled ? 1 : 0) + activePolicies.length;

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Communication Policies</h1>
          <p className="text-muted-foreground">
            Configure speed-to-lead responses and communication guardrails
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {totalActivePolicies} Active Policies
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Speed-to-Lead Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Speed-to-Lead Policy</h2>
            </div>
            
            <Card className={speedPolicyConfig?.enabled ? "border-primary shadow-sm" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span>5-Minute Callback for High-Intent</span>
                    <Badge 
                      variant={speedPolicyConfig?.enabled ? "default" : "secondary"}
                      className={speedPolicyConfig?.enabled ? "bg-green-100 text-green-800 border-green-200" : ""}
                    >
                      {speedPolicyConfig?.enabled ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <Switch
                    checked={speedPolicyConfig?.enabled || false}
                    onCheckedChange={handleSpeedPolicyToggle}
                    disabled={updating}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  Automatically creates priority callback tasks when high-intent signals are detected
                </p>

                {/* Policy Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <Phone className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="font-medium text-foreground">Target Band</p>
                    <p className="text-sm text-muted-foreground">High Yield Only</p>
                  </div>
                  
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="font-medium text-foreground">Response Time</p>
                    <p className="text-sm text-muted-foreground">≤ 5 Minutes</p>
                  </div>
                  
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="font-medium text-foreground">Expected Lift</p>
                    <p className="text-sm text-muted-foreground">+{speedPolicyConfig?.expected_lift}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* General Policies Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Communication Guardrails</h2>
            </div>

            <div className="space-y-4">{renderGeneralPolicies()}</div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Expected Lift Panel */}
          <ExpectedLiftPanel 
            isActive={speedPolicyConfig?.enabled || false}
            expectedLift={speedPolicyConfig?.expected_lift || 0}
            policyName="Speed-to-Lead"
          />

          {/* Policy Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Policy Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {preview ? (
                <p className="text-sm text-muted-foreground">{preview}</p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No active policies configured yet.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Speed Policy</span>
                <Badge variant={speedPolicyConfig?.enabled ? "default" : "secondary"} className="text-xs">
                  {speedPolicyConfig?.enabled ? "On" : "Off"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">General Policies</span>
                <Badge variant="outline" className="text-xs">
                  {activePolicies.length} / {policies.length}
                </Badge>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="text-sm font-medium">Total Active</span>
                <Badge variant="default" className="text-xs">
                  {totalActivePolicies}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}