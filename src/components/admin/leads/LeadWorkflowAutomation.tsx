import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Zap, 
  Settings, 
  Play, 
  Pause, 
  TrendingUp, 
  Clock, 
  Users,
  Target,
  BarChart3,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  triggerType: 'score_threshold' | 'time_based' | 'activity_based' | 'status_change';
  conditions: Record<string, any>;
  actions: string[];
  lastExecuted?: string;
  executionCount: number;
  successRate: number;
}

export function LeadWorkflowAutomation() {
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([
    {
      id: '1',
      name: 'High-Score Lead Conversion',
      description: 'Automatically convert leads with score ≥ 80 and qualified status',
      isActive: true,
      triggerType: 'score_threshold',
      conditions: { minScore: 80, requiredStatus: 'qualified' },
      actions: ['convert_to_student', 'notify_registrar', 'assign_advisor'],
      lastExecuted: '2024-01-08T10:30:00Z',
      executionCount: 45,
      successRate: 92
    },
    {
      id: '2',
      name: 'Engagement Follow-up',
      description: 'Send follow-up sequence for leads with no activity in 3 days',
      isActive: true,
      triggerType: 'time_based',
      conditions: { daysInactive: 3, excludeStatuses: ['converted', 'lost'] },
      actions: ['send_email', 'create_task', 'update_priority'],
      lastExecuted: '2024-01-08T08:15:00Z',
      executionCount: 128,
      successRate: 78
    },
    {
      id: '3',
      name: 'Program Interest Routing',
      description: 'Auto-assign leads to specialized advisors based on program interest',
      isActive: false,
      triggerType: 'activity_based',
      conditions: { hasProgram: true, isNewLead: true },
      actions: ['assign_specialist', 'prioritize_lead'],
      executionCount: 23,
      successRate: 85
    },
    {
      id: '4',
      name: 'Low Score Alert',
      description: 'Alert team when qualified leads drop below score threshold',
      isActive: true,
      triggerType: 'score_threshold',
      conditions: { maxScore: 50, requiredStatus: 'qualified' },
      actions: ['send_alert', 'create_urgent_task'],
      lastExecuted: '2024-01-07T16:45:00Z',
      executionCount: 12,
      successRate: 100
    }
  ]);

  const [automationMetrics, setAutomationMetrics] = useState({
    totalExecutions: 208,
    successfulExecutions: 185,
    averageExecutionTime: 2.3,
    leadsProcessed: 1247,
    conversionsGenerated: 89,
    timesSaved: 156
  });

  const { toast } = useToast();

  const toggleAutomation = (ruleId: string) => {
    setAutomationRules(prev => 
      prev.map(rule => 
        rule.id === ruleId 
          ? { ...rule, isActive: !rule.isActive }
          : rule
      )
    );
    
    const rule = automationRules.find(r => r.id === ruleId);
    toast({
      title: rule?.isActive ? "Automation Disabled" : "Automation Enabled",
      description: `${rule?.name} has been ${rule?.isActive ? 'disabled' : 'enabled'}`,
    });
  };

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'score_threshold': return <Target className="h-4 w-4" />;
      case 'time_based': return <Clock className="h-4 w-4" />;
      case 'activity_based': return <Users className="h-4 w-4" />;
      case 'status_change': return <TrendingUp className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const getTriggerLabel = (type: string) => {
    switch (type) {
      case 'score_threshold': return 'Score Threshold';
      case 'time_based': return 'Time Based';
      case 'activity_based': return 'Activity Based';
      case 'status_change': return 'Status Change';
      default: return 'Unknown';
    }
  };

  const activeRules = automationRules.filter(rule => rule.isActive);
  const inactiveRules = automationRules.filter(rule => !rule.isActive);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Workflow Automation</h2>
          <p className="text-sm text-muted-foreground">
            Manage automated lead processing and conversion workflows
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Settings className="h-4 w-4 mr-2" />
          Configure Rules
        </Button>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="flex items-center p-4">
            <Zap className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-xs font-medium text-muted-foreground">Total Executions</p>
              <p className="text-lg font-bold text-foreground">{automationMetrics.totalExecutions}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-4">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-xs font-medium text-muted-foreground">Success Rate</p>
              <p className="text-lg font-bold text-foreground">
                {Math.round((automationMetrics.successfulExecutions / automationMetrics.totalExecutions) * 100)}%
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-4">
            <Users className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-xs font-medium text-muted-foreground">Leads Processed</p>
              <p className="text-lg font-bold text-foreground">{automationMetrics.leadsProcessed}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-4">
            <Target className="h-8 w-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-xs font-medium text-muted-foreground">Conversions</p>
              <p className="text-lg font-bold text-foreground">{automationMetrics.conversionsGenerated}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-4">
            <Clock className="h-8 w-8 text-indigo-600" />
            <div className="ml-3">
              <p className="text-xs font-medium text-muted-foreground">Avg Time</p>
              <p className="text-lg font-bold text-foreground">{automationMetrics.averageExecutionTime}s</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-4">
            <BarChart3 className="h-8 w-8 text-teal-600" />
            <div className="ml-3">
              <p className="text-xs font-medium text-muted-foreground">Hours Saved</p>
              <p className="text-lg font-bold text-foreground">{automationMetrics.timesSaved}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Automation Rules */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active Rules ({activeRules.length})</TabsTrigger>
          <TabsTrigger value="inactive">Inactive Rules ({inactiveRules.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          {activeRules.map((rule) => (
            <AutomationRuleCard 
              key={rule.id} 
              rule={rule} 
              onToggle={toggleAutomation}
            />
          ))}
        </TabsContent>
        
        <TabsContent value="inactive" className="space-y-4">
          {inactiveRules.map((rule) => (
            <AutomationRuleCard 
              key={rule.id} 
              rule={rule} 
              onToggle={toggleAutomation}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface AutomationRuleCardProps {
  rule: AutomationRule;
  onToggle: (ruleId: string) => void;
}

function AutomationRuleCard({ rule, onToggle }: AutomationRuleCardProps) {
  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'score_threshold': return <Target className="h-4 w-4" />;
      case 'time_based': return <Clock className="h-4 w-4" />;
      case 'activity_based': return <Users className="h-4 w-4" />;
      case 'status_change': return <TrendingUp className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const getTriggerLabel = (type: string) => {
    switch (type) {
      case 'score_threshold': return 'Score Threshold';
      case 'time_based': return 'Time Based';
      case 'activity_based': return 'Activity Based';
      case 'status_change': return 'Status Change';
      default: return 'Unknown';
    }
  };

  return (
    <Card className={rule.isActive ? 'border-green-200 bg-green-50/50' : 'border-gray-200'}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${rule.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
              {getTriggerIcon(rule.triggerType)}
            </div>
            <div>
              <CardTitle className="text-lg">{rule.name}</CardTitle>
              <CardDescription>{rule.description}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="flex items-center gap-1">
              {getTriggerIcon(rule.triggerType)}
              {getTriggerLabel(rule.triggerType)}
            </Badge>
            <Switch 
              checked={rule.isActive}
              onCheckedChange={() => onToggle(rule.id)}
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Executions:</span>
            <span className="ml-2 font-medium">{rule.executionCount}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Success Rate:</span>
            <span className="ml-2 font-medium text-green-600">{rule.successRate}%</span>
          </div>
          <div>
            <span className="text-muted-foreground">Last Run:</span>
            <span className="ml-2 font-medium">
              {rule.lastExecuted 
                ? new Date(rule.lastExecuted).toLocaleDateString()
                : 'Never'
              }
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Status:</span>
            <Badge className={`ml-2 ${rule.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              {rule.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Performance</span>
          <span className="font-medium">{rule.successRate}%</span>
        </div>
        
        <Progress value={rule.successRate} className="h-2" />
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Actions</h4>
          <div className="flex flex-wrap gap-1">
            {rule.actions.map((action, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {action.replace(/_/g, ' ')}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-1" />
            Configure
          </Button>
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-1" />
            Analytics
          </Button>
          {rule.isActive ? (
            <Button variant="outline" size="sm" onClick={() => onToggle(rule.id)}>
              <Pause className="h-4 w-4 mr-1" />
              Pause
            </Button>
          ) : (
            <Button size="sm" onClick={() => onToggle(rule.id)}>
              <Play className="h-4 w-4 mr-1" />
              Activate
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}