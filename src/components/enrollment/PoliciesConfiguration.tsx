import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { PoliciesService, type Policy } from '@/services/policiesService';
import { Shield, Clock, MessageSquare, StopCircle, Settings } from 'lucide-react';

export function PoliciesConfiguration() {
  const [policies, setPolicies] = useState<Policy[]>([]);
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
      const data = await PoliciesService.getPolicies();
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
      const previewText = await PoliciesService.getPolicyPreview();
      setPreview(previewText);
    } catch (error) {
      console.error('Error updating preview:', error);
    }
  };

  const handleTogglePolicy = async (policyId: string, isActive: boolean) => {
    try {
      const updatedPolicy = await PoliciesService.togglePolicy(policyId, isActive);
      setPolicies(policies.map(p => p.id === policyId ? updatedPolicy : p));
      
      toast({
        title: isActive ? "Policy enabled" : "Policy disabled",
        description: `${updatedPolicy.name} has been ${isActive ? 'enabled' : 'disabled'}`,
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

    const newConfiguration = {
      ...policy.configuration as Record<string, any>,
      [key]: value
    };

    try {
      const updatedPolicy = await PoliciesService.updatePolicyConfiguration(policyId, newConfiguration);
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

  const renderPolicyConfiguration = (policy: Policy) => {
    const config = policy.configuration as Record<string, any>;

    switch (policy.policy_type) {
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

  const activePolicies = policies.filter(p => p.is_active);

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

      {/* Explanation */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <h3 className="font-medium mb-2">What are Policies?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Policies are the rules of the road—quiet hours, stop after deposit, pacing, and which channels are allowed. 
            They keep things sensible and safe.
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
          <Card key={policy.id} className={policy.is_active ? "border-primary" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    policy.is_active ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    {getPolicyIcon(policy.policy_type)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{policy.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{policy.description}</p>
                  </div>
                </div>
                
                <Switch
                  checked={policy.is_active}
                  onCheckedChange={(checked) => handleTogglePolicy(policy.id, checked)}
                />
              </div>
            </CardHeader>
            
            {policy.is_active && (
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