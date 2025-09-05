import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { PolicyConfigurationService, type PolicyConfig } from '@/services/policyConfigurationService';
import { POLICY_TYPES, POLICY_CATEGORIES } from '@/types/policy';
import { 
  Shield, Clock, MessageSquare, StopCircle, Settings, Zap, Phone, 
  TrendingUp, Volume2, Plus, Search, Filter, Heart, Smartphone,
  AlertTriangle, Globe, Activity, User, Users, Calendar, Target
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import PolicyWizard from './wizard/PolicyWizard';
import { PolicyData } from '@/types/policy';

const iconMap = {
  MessageSquare, Clock, Zap, Shield, FileCheck: Settings,
  Moon: Clock, Timer: Clock, StopCircle, Target, Clock3: Clock,
  Heart, TrendingUp, Smartphone, AlertTriangle, Globe, Activity, User, Users, Calendar
};

export function ModernPoliciesConfiguration() {
  const [policies, setPolicies] = useState<PolicyConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showPolicyWizard, setShowPolicyWizard] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
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
      setLoading(false);
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

  const handleSavePolicy = async (policyData: PolicyData) => {
    try {
      // Save the new policy
      await PolicyConfigurationService.upsertConfiguration(policyData.name, {
        policy_name: policyData.name,
        enabled: policyData.isActive,
        settings: policyData.settings,
        expected_lift: policyData.expectedLift || 0
      });
      
      await loadPolicies();
      setShowPolicyWizard(false);
      
      toast({
        title: "Success",
        description: "Policy created successfully",
      });
    } catch (error) {
      console.error('Error saving policy:', error);
      toast({
        title: "Error",
        description: "Failed to save policy",
        variant: "destructive",
      });
    }
  };

  const getPolicyTemplate = (policyName: string) => {
    return POLICY_TYPES.find(type => type.id === policyName);
  };

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap] || Settings;
    return <IconComponent className="h-5 w-5" />;
  };

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.policy_name.toLowerCase().includes(searchQuery.toLowerCase());
    const template = getPolicyTemplate(policy.policy_name);
    const matchesCategory = selectedCategory === 'all' || template?.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const availableTemplates = POLICY_TYPES.filter(template => 
    !policies.some(policy => policy.policy_name === template.id)
  );

  const activePolicies = policies.filter(p => p.enabled);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Policy Management</h1>
          <p className="text-muted-foreground mt-1">
            Configure communication policies and automation rules to optimize enrollment outcomes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-3 py-1">
            {activePolicies.length} Active
          </Badge>
          <Button onClick={() => setShowPolicyWizard(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Policy
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search policies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            <option value="all">All Categories</option>
            {POLICY_CATEGORIES.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active Policies</TabsTrigger>
          <TabsTrigger value="available">Available Templates</TabsTrigger>
          <TabsTrigger value="all">All Policies</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activePolicies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activePolicies.map((policy) => {
                const template = getPolicyTemplate(policy.policy_name);
                return (
                  <Card key={policy.id} className="border-primary shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                            {getIcon(template?.icon || 'Settings')}
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              {template?.name || policy.policy_name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </CardTitle>
                            <Badge variant="secondary" className="mt-1 text-xs">
                              {template?.category || 'custom'}
                            </Badge>
                          </div>
                        </div>
                        <Switch
                          checked={policy.enabled}
                          onCheckedChange={() => handlePolicyToggle(policy.id)}
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-4">
                        {template?.description || 'Custom policy configuration'}
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Expected Lift</span>
                        <span className="font-medium text-green-600">+{policy.expected_lift || 0}%</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Active Policies</h3>
              <p className="text-muted-foreground mb-4">
                Start by enabling some policies to control your enrollment communications
              </p>
              <Button onClick={() => setShowPolicyWizard(true)}>
                Create Your First Policy
              </Button>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer border-dashed border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                      {getIcon(template.icon)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {template.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-4">
                    {template.description}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => setShowPolicyWizard(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Policy
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPolicies.map((policy) => {
              const template = getPolicyTemplate(policy.policy_name);
              return (
                <Card key={policy.id} className={`hover:shadow-md transition-shadow ${
                  policy.enabled ? 'border-primary' : 'border-border'
                }`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg transition-colors ${
                          policy.enabled 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {getIcon(template?.icon || 'Settings')}
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {template?.name || policy.policy_name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {template?.category || 'custom'}
                            </Badge>
                            {policy.enabled && (
                              <Badge variant="default" className="text-xs bg-green-100 text-green-700 border-green-200">
                                Active
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Switch
                        checked={policy.enabled}
                        onCheckedChange={() => handlePolicyToggle(policy.id)}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-4">
                      {template?.description || 'Custom policy configuration'}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Expected Lift</span>
                      <span className="font-medium text-green-600">+{policy.expected_lift || 0}%</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Policy Wizard */}
      {showPolicyWizard && (
        <PolicyWizard
          onClose={() => setShowPolicyWizard(false)}
          onSave={handleSavePolicy}
        />
      )}
    </div>
  );
}