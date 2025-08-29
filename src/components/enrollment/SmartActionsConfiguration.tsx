import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Brain, 
  Zap, 
  Target, 
  Clock, 
  Shield,
  BarChart3,
  AlertTriangle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  type: 'priority' | 'follow-up' | 'assignment' | 'notification';
  conditions: string[];
  actionsToday: number;
  successRate: number;
}

interface ConfigurationSettings {
  autoExecutionThreshold: number;
  maxDailyExecutions: number;
  enabledActionTypes: string[];
  confidenceThresholds: {
    autoExecute: number;
    highConfidence: number;
    requireReview: number;
  };
  automationImpact: {
    leadsProcessed: number;
    responseTimeImprovement: number;
    conversionLift: number;
  };
}

export function SmartActionsConfiguration() {
  const [settings, setSettings] = useState<ConfigurationSettings>({
    autoExecutionThreshold: 85,
    maxDailyExecutions: 50,
    enabledActionTypes: ['email', 'follow_up', 'assignment'],
    confidenceThresholds: {
      autoExecute: 85,
      highConfidence: 70,
      requireReview: 50,
    },
    automationImpact: {
      leadsProcessed: 127,
      responseTimeImprovement: 34,
      conversionLift: 18,
    },
  });

  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([
    {
      id: '1',
      name: 'Auto-Priority Boost',
      description: 'Elevate high-yield prospects approaching deadlines',
      enabled: true,
      type: 'priority',
      conditions: ['Yield Score > 80', 'Application Deadline < 7 days'],
      actionsToday: 12,
      successRate: 89
    },
    {
      id: '2', 
      name: 'Smart Follow-up',
      description: 'Generate follow-up tasks for unresponsive high-value leads',
      enabled: true,
      type: 'follow-up',
      conditions: ['No Response > 48h', 'Lead Score > 70'],
      actionsToday: 8,
      successRate: 76
    },
    {
      id: '3',
      name: 'Load Balancing',
      description: 'Auto-assign new leads based on advisor capacity',
      enabled: false,
      type: 'assignment', 
      conditions: ['New Lead', 'Advisor Availability'],
      actionsToday: 0,
      successRate: 0
    },
    {
      id: '4',
      name: 'Urgent Alerts',
      description: 'Notify team of critical conversion opportunities',
      enabled: true,
      type: 'notification',
      conditions: ['Deposit Decision Pending', 'High Yield Score'],
      actionsToday: 5,
      successRate: 94
    }
  ]);

  const actionTypes = [
    { id: 'email', label: 'Email Actions', icon: <Zap className="h-4 w-4" /> },
    { id: 'call', label: 'Call Scheduling', icon: <Clock className="h-4 w-4" /> },
    { id: 'follow_up', label: 'Follow-up Tasks', icon: <Target className="h-4 w-4" /> },
    { id: 'assignment', label: 'Lead Assignment', icon: <Brain className="h-4 w-4" /> },
    { id: 'document', label: 'Document Generation', icon: <BarChart3 className="h-4 w-4" /> },
  ];

  const handleSettingsChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleThresholdChange = (type: string, value: number) => {
    setSettings(prev => ({
      ...prev,
      confidenceThresholds: {
        ...prev.confidenceThresholds,
        [type]: value,
      },
    }));
  };

  const toggleActionType = (actionType: string) => {
    setSettings(prev => ({
      ...prev,
      enabledActionTypes: prev.enabledActionTypes.includes(actionType)
        ? prev.enabledActionTypes.filter(type => type !== actionType)
        : [...prev.enabledActionTypes, actionType],
    }));
  };

  const toggleAutomationRule = (ruleId: string) => {
    setAutomationRules(prev => prev.map(rule => 
      rule.id === ruleId 
        ? { ...rule, enabled: !rule.enabled }
        : rule
    ));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'priority': return <Target className="h-4 w-4 text-orange-500" />;
      case 'follow-up': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'assignment': return <Brain className="h-4 w-4 text-purple-500" />;
      case 'notification': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'priority': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'follow-up': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'assignment': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'notification': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Smart Actions Configuration
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General Settings</TabsTrigger>
          <TabsTrigger value="automation">Automation Rules</TabsTrigger>
          <TabsTrigger value="impact">Impact Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          {/* Action Types */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Enabled Action Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {actionTypes.map(type => (
                <div key={type.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {type.icon}
                    <span className="font-medium">{type.label}</span>
                  </div>
                  <Switch
                    checked={settings.enabledActionTypes.includes(type.id)}
                    onCheckedChange={() => toggleActionType(type.id)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Confidence Thresholds */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Confidence Thresholds</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Auto-Execute Threshold</label>
                  <span className="text-sm text-muted-foreground">{settings.confidenceThresholds.autoExecute}%</span>
                </div>
                <Slider
                  value={[settings.confidenceThresholds.autoExecute]}
                  onValueChange={(value) => handleThresholdChange('autoExecute', value[0])}
                  max={100}
                  min={70}
                  step={5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">Actions above this confidence level will execute automatically</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">High Confidence Threshold</label>
                  <span className="text-sm text-muted-foreground">{settings.confidenceThresholds.highConfidence}%</span>
                </div>
                <Slider
                  value={[settings.confidenceThresholds.highConfidence]}
                  onValueChange={(value) => handleThresholdChange('highConfidence', value[0])}
                  max={85}
                  min={50}
                  step={5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">Actions requiring one-click approval</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Max Daily Executions</label>
                  <span className="text-sm text-muted-foreground">{settings.maxDailyExecutions}</span>
                </div>
                <Slider
                  value={[settings.maxDailyExecutions]}
                  onValueChange={(value) => handleSettingsChange('maxDailyExecutions', value[0])}
                  max={200}
                  min={10}
                  step={10}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">Maximum automated actions per day</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Automation Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {automationRules.map(rule => (
                <div key={rule.id} className="space-y-2 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(rule.type)}
                      <span className="text-sm font-medium">{rule.name}</span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getTypeColor(rule.type)}`}
                      >
                        {rule.type}
                      </Badge>
                    </div>
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={() => toggleAutomationRule(rule.id)}
                    />
                  </div>
                  
                  <p className="text-xs text-muted-foreground pl-6">
                    {rule.description}
                  </p>
                  
                  <div className="flex items-center justify-between pl-6">
                    <div className="flex items-center space-x-4 text-xs">
                      <span>{rule.actionsToday} today</span>
                      <span>{rule.successRate}% success rate</span>
                    </div>
                  </div>
                  
                  {rule.conditions.length > 0 && (
                    <div className="pl-6">
                      <div className="flex flex-wrap gap-1">
                        {rule.conditions.map((condition, index) => (
                          <Badge 
                            key={index}
                            variant="secondary" 
                            className="text-xs"
                          >
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="impact" className="space-y-4">
          {/* Automation Impact Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Automation Impact Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary">
                    {settings.automationImpact.leadsProcessed}
                  </div>
                  <div className="text-sm text-muted-foreground">Leads Processed Today</div>
                  <Badge variant="default" className="text-xs">
                    +23% vs yesterday
                  </Badge>
                </div>
                
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-green-600">
                    {settings.automationImpact.responseTimeImprovement}%
                  </div>
                  <div className="text-sm text-muted-foreground">Response Time Improvement</div>
                  <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                    Excellent
                  </Badge>
                </div>
                
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-blue-600">
                    {settings.automationImpact.conversionLift}%
                  </div>
                  <div className="text-sm text-muted-foreground">Conversion Lift</div>
                  <Badge variant="default" className="text-xs bg-blue-100 text-blue-800">
                    +5% this week
                  </Badge>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h4 className="text-sm font-medium mb-4">Performance by Action Type</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Email Actions</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                      <span className="text-xs text-muted-foreground">78% success</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Follow-up Tasks</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <span className="text-xs text-muted-foreground">85% success</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Lead Assignment</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                      <span className="text-xs text-muted-foreground">92% success</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ROI Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">ROI & Efficiency Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="text-muted-foreground">Time Saved Daily</div>
                  <div className="text-lg font-semibold">4.2 hours</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">Actions Automated</div>
                  <div className="text-lg font-semibold">156 / week</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">Cost Savings</div>
                  <div className="text-lg font-semibold text-green-600">$2,340 / month</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">Accuracy Rate</div>
                  <div className="text-lg font-semibold">94.8%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>Save Configuration</Button>
      </div>
    </div>
  );
}