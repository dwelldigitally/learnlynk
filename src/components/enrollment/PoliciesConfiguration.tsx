import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { PolicyConfigurationService, type PolicyConfig } from '@/services/policyConfigurationService';
import { Shield, Clock, MessageSquare, StopCircle, Settings } from 'lucide-react';

export function PoliciesConfiguration() {
  const [policies, setPolicies] = useState<PolicyConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadPolicies();
  }, []);

  useEffect(() => {
    updatePreview();
  }, [policies]);

  const loadPolicies = async () => {
    try {
      // Seed default policies first
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
      setLoading(false);
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

  const handleTogglePolicy = async (policyId: string, isActive: boolean) => {
    try {
      const updatedPolicy = await PolicyConfigurationService.toggleEnabled(policyId, isActive);
      setPolicies(policies.map(p => p.id === policyId ? updatedPolicy : p));
      
      toast({
        title: isActive ? "Policy enabled" : "Policy disabled",
        description: `${updatedPolicy.policy_name} has been ${isActive ? 'enabled' : 'disabled'}`,
      });
    } catch (error) {
      console.error('Error toggling policy:', error);
      toast({
        title: "Error",
        description: "Failed to toggle policy",
        variant: "destructive",
      });
    }
  };

  const handleConfigurationChange = async (policyId: string, key: string, value: any) => {
    const policy = policies.find(p => p.id === policyId);
    if (!policy) return;

    const newSettings = {
      ...policy.settings as Record<string, any>,
      [key]: value
    };

    try {
      const updatedPolicy = await PolicyConfigurationService.updateSettings(policyId, newSettings);
      setPolicies(policies.map(p => p.id === policyId ? updatedPolicy : p));
    } catch (error) {
      console.error('Error updating configuration:', error);
      toast({
        title: "Error",
        description: "Failed to update configuration",
        variant: "destructive",
      });
    }
  };

  const getPolicyIcon = (policyType: string) => {
    switch (policyType) {
      case 'quiet_hours': return <Clock className="h-5 w-5" />;
      case 'message_pacing': return <MessageSquare className="h-5 w-5" />;
      case 'stop_triggers': return <StopCircle className="h-5 w-5" />;
      default: return <Settings className="h-5 w-5" />;
    }
  };

  const renderPolicyConfiguration = (policy: PolicyConfig) => {
    const config = policy.settings as Record<string, any>;

    switch (policy.policy_name) {
      case 'quiet_hours':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">Start Time</Label>
                <Input
                  type="time"
                  value={config.start_time || '21:00'}
                  onChange={(e) => handleConfigurationChange(policy.id, 'start_time', e.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm">End Time</Label>
                <Input
                  type="time"
                  value={config.end_time || '08:00'}
                  onChange={(e) => handleConfigurationChange(policy.id, 'end_time', e.target.value)}
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Calls and texts will be queued during these hours
            </p>
          </div>
        );

      case 'message_pacing':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">Max Messages per Day</Label>
                <Select
                  value={String(config.max_messages_per_day || 2)}
                  onValueChange={(value) => handleConfigurationChange(policy.id, 'max_messages_per_day', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 message</SelectItem>
                    <SelectItem value="2">2 messages</SelectItem>
                    <SelectItem value="3">3 messages</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">Hours Between Messages</Label>
                <Select
                  value={String(config.min_hours_between || 3)}
                  onValueChange={(value) => handleConfigurationChange(policy.id, 'min_hours_between', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hour</SelectItem>
                    <SelectItem value="2">2 hours</SelectItem>
                    <SelectItem value="3">3 hours</SelectItem>
                    <SelectItem value="6">6 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 'stop_triggers':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={config.stop_on_deposit || false}
                onCheckedChange={(checked) => handleConfigurationChange(policy.id, 'stop_on_deposit', checked)}
              />
              <Label className="text-sm">Stop marketing after deposit</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={config.stop_on_enrollment || false}
                onCheckedChange={(checked) => handleConfigurationChange(policy.id, 'stop_on_enrollment', checked)}
              />
              <Label className="text-sm">Stop marketing after enrollment</Label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="h-5 bg-muted rounded w-48"></div>
                    <div className="h-6 w-12 bg-muted rounded-full"></div>
                  </div>
                  <div className="h-20 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const activePolicies = policies.filter(p => p.enabled);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Policies</h1>
          <p className="text-muted-foreground">
            Configure the rules of the road for your communications
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {activePolicies.length} Active
        </Badge>
      </div>

      {/* Navigation Hints */}
      <Card className="border-orange-200 bg-orange-50/50">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Settings className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-foreground mb-2">Playbooks</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Simple on/off switches for enrollment sequences and business recipes.
              </p>
              <a href="/admin/enrollment/playbooks" className="text-sm text-blue-600 hover:underline">
                ← Back to Playbooks
              </a>
            </div>
            
            <div className="text-center">
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="h-6 w-6 text-orange-600" />
              </div>
              <h4 className="font-medium text-foreground mb-2">Policies (This Page)</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Safety rules that all automation must follow. Quiet hours, pacing, stop triggers.
              </p>
              <Badge variant="default" className="text-xs">You Are Here</Badge>
            </div>
            
            <div className="text-center">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-foreground mb-2">Automation Rules</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Advanced technical interface for complex triggers and custom scenarios.
              </p>
              <a href="/admin/enrollment/automation-rules" className="text-sm text-blue-600 hover:underline">
                Advanced Rules →
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Explanation */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <h3 className="font-medium mb-2">What are Policies?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Policies are the rules of the road—quiet hours, stop after deposit, pacing, and which channels are allowed. 
            They keep things sensible and safe. <strong>Policies win</strong> — even if a playbook wants to send a message, policies can block it.
          </p>
          
          {preview && (
            <div className="p-3 bg-background border rounded-lg">
              <p className="text-sm font-medium">Current Policy Summary:</p>
              <p className="text-sm text-muted-foreground mt-1">{preview}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Policies List */}
      <div className="grid gap-6">
        {policies.map((policy) => (
          <Card key={policy.id} className={policy.enabled ? "border-primary" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    policy.enabled ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    {getPolicyIcon(policy.policy_name)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{policy.policy_name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {policy.policy_name === 'quiet_hours' && 'Queue communications during quiet hours'}
                      {policy.policy_name === 'message_pacing' && 'Limit the frequency of messages sent to students'}
                      {policy.policy_name === 'stop_triggers' && 'Stop marketing communications based on student actions'}
                    </p>
                  </div>
                </div>
                
                <Switch
                  checked={policy.enabled}
                  onCheckedChange={(checked) => handleTogglePolicy(policy.id, checked)}
                />
              </div>
            </CardHeader>
            
            {policy.enabled && (
              <CardContent>
                {renderPolicyConfiguration(policy)}
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {policies.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No policies configured</h3>
            <p className="text-muted-foreground">
              Default policies will be created automatically when you set up your system.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}