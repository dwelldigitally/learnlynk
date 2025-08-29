import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Zap, 
  Brain, 
  Clock, 
  Target, 
  Settings,
  CheckCircle,
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

export function SmartAutomationWidget() {
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

  const [todayAutomations, setTodayAutomations] = useState(0);

  useEffect(() => {
    // Calculate total automations for today
    const total = automationRules.reduce((sum, rule) => sum + rule.actionsToday, 0);
    setTodayAutomations(total);
  }, [automationRules]);

  const toggleAutomation = async (ruleId: string) => {
    setAutomationRules(prev => prev.map(rule => 
      rule.id === ruleId 
        ? { ...rule, enabled: !rule.enabled }
        : rule
    ));

    // In a real app, this would save to the database
    // await supabase.from('automation_rules').update({ enabled: !rule.enabled }).eq('id', ruleId);
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            Smart Automation
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            {todayAutomations} automated actions today
          </p>
        </div>
        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {automationRules.map(rule => (
          <div key={rule.id} className="space-y-2">
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
                onCheckedChange={() => toggleAutomation(rule.id)}
              />
            </div>
            
            <p className="text-xs text-muted-foreground pl-6">
              {rule.description}
            </p>
            
            <div className="flex items-center justify-between pl-6">
              <div className="flex items-center space-x-4 text-xs">
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  {rule.actionsToday} today
                </span>
                <span className="flex items-center gap-1">
                  <Target className="h-3 w-3 text-blue-500" />
                  {rule.successRate}% success
                </span>
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

        <div className="pt-2 border-t">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Automation Impact</span>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="text-xs">
                +{Math.round(todayAutomations * 1.2)} leads processed
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}