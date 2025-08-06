import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { 
  Target, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw,
  Filter,
  ArrowUpRight,
  Zap,
  Brain
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  trigger: string;
  action: string;
  successRate: number;
  timesExecuted: number;
  category: 'routing' | 'prioritization' | 'categorization' | 'follow-up';
}

interface IntelligentInsight {
  id: string;
  type: 'optimization' | 'alert' | 'recommendation';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  metric?: {
    current: number;
    target: number;
    unit: string;
  };
}

export function AIIntelligentManagement() {
  const { toast } = useToast();
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [insights, setInsights] = useState<IntelligentInsight[]>([]);
  const [loading, setLoading] = useState(false);
  const [systemStats, setSystemStats] = useState({
    totalLeadsProcessed: 2847,
    automationRate: 78,
    averageResponseTime: 2.4,
    conversionImprovement: 23
  });

  useEffect(() => {
    loadIntelligentData();
  }, []);

  const loadIntelligentData = async () => {
    setLoading(true);
    
    try {
      // Simulate loading intelligent management data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const rules: AutomationRule[] = [
        {
          id: 'auto-score',
          name: 'Smart Lead Scoring',
          description: 'Automatically calculate and update lead scores based on behavior and profile',
          enabled: true,
          trigger: 'Lead created/updated',
          action: 'Update lead score',
          successRate: 94,
          timesExecuted: 1247,
          category: 'categorization'
        },
        {
          id: 'intelligent-routing',
          name: 'Intelligent Advisor Routing',
          description: 'Route leads to best-matched advisors based on expertise and availability',
          enabled: true,
          trigger: 'High-score lead',
          action: 'Assign to specialist',
          successRate: 87,
          timesExecuted: 423,
          category: 'routing'
        },
        {
          id: 'priority-adjustment',
          name: 'Dynamic Priority Adjustment',
          description: 'Automatically adjust lead priority based on engagement and score changes',
          enabled: true,
          trigger: 'Score threshold reached',
          action: 'Update priority',
          successRate: 91,
          timesExecuted: 756,
          category: 'prioritization'
        },
        {
          id: 'duplicate-detection',
          name: 'Smart Duplicate Detection',
          description: 'Identify and merge potential duplicate leads using AI matching',
          enabled: false,
          trigger: 'New lead created',
          action: 'Check for duplicates',
          successRate: 96,
          timesExecuted: 89,
          category: 'categorization'
        },
        {
          id: 'follow-up-automation',
          name: 'Intelligent Follow-up Timing',
          description: 'Schedule optimal follow-up times based on lead behavior patterns',
          enabled: true,
          trigger: 'No response for 48h',
          action: 'Schedule follow-up',
          successRate: 73,
          timesExecuted: 892,
          category: 'follow-up'
        }
      ];

      const intelligentInsights: IntelligentInsight[] = [
        {
          id: 'response-time',
          type: 'optimization',
          title: 'Response Time Optimization',
          description: 'Average response time has improved by 35% with AI routing',
          impact: 'high',
          actionable: false,
          metric: { current: 2.4, target: 2.0, unit: 'hours' }
        },
        {
          id: 'conversion-boost',
          type: 'recommendation',
          title: 'Conversion Rate Opportunity',
          description: 'Enable duplicate detection to potentially increase conversion by 8%',
          impact: 'medium',
          actionable: true
        },
        {
          id: 'workload-distribution',
          type: 'alert',
          title: 'Advisor Workload Imbalance',
          description: '2 advisors are handling 65% of high-priority leads',
          impact: 'medium',
          actionable: true
        },
        {
          id: 'score-accuracy',
          type: 'optimization',
          title: 'Lead Scoring Accuracy',
          description: 'AI scoring model accuracy has reached 94%, up from 78%',
          impact: 'high',
          actionable: false,
          metric: { current: 94, target: 95, unit: '%' }
        }
      ];

      setAutomationRules(rules);
      setInsights(intelligentInsights);
    } catch (error) {
      console.error('Failed to load intelligent management data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRule = (ruleId: string) => {
    setAutomationRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
    
    const rule = automationRules.find(r => r.id === ruleId);
    toast({
      title: `Automation ${rule?.enabled ? 'Disabled' : 'Enabled'}`,
      description: `${rule?.name} has been ${rule?.enabled ? 'disabled' : 'enabled'}.`
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'routing': return <Users className="h-4 w-4" />;
      case 'prioritization': return <TrendingUp className="h-4 w-4" />;
      case 'categorization': return <Filter className="h-4 w-4" />;
      case 'follow-up': return <Clock className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'routing': return 'bg-blue-100 text-blue-800';
      case 'prioritization': return 'bg-green-100 text-green-800';
      case 'categorization': return 'bg-purple-100 text-purple-800';
      case 'follow-up': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'optimization': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'alert': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'recommendation': return <Target className="h-4 w-4 text-blue-600" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* System Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              Leads Processed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalLeadsProcessed.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-600" />
              Automation Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{systemStats.automationRate}%</div>
            <p className="text-xs text-muted-foreground">of processes automated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-600" />
              Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{systemStats.averageResponseTime}h</div>
            <p className="text-xs text-muted-foreground">average response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">+{systemStats.conversionImprovement}%</div>
            <p className="text-xs text-muted-foreground">conversion rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Automation Rules */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                Intelligent Automation Rules
              </CardTitle>
              <Button size="sm" variant="outline" onClick={loadIntelligentData}>
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {automationRules.map((rule) => (
              <div key={rule.id} className="p-3 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(rule.category)}
                    <span className="font-medium text-sm">{rule.name}</span>
                    <Badge className={getCategoryColor(rule.category)} variant="outline">
                      {rule.category}
                    </Badge>
                  </div>
                  <Switch
                    checked={rule.enabled}
                    onCheckedChange={() => toggleRule(rule.id)}
                  />
                </div>
                
                <p className="text-xs text-muted-foreground mb-3">{rule.description}</p>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-4">
                    <span>Success: <span className="font-medium text-green-600">{rule.successRate}%</span></span>
                    <span>Executed: <span className="font-medium">{rule.timesExecuted}</span></span>
                  </div>
                  <Progress value={rule.successRate} className="w-16 h-1" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Intelligent Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Smart Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.map((insight) => (
              <div key={insight.id} className="p-3 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getInsightIcon(insight.type)}
                    <span className="font-medium text-sm">{insight.title}</span>
                  </div>
                  <span className={`text-xs ${getImpactColor(insight.impact)}`}>
                    {insight.impact} impact
                  </span>
                </div>
                
                <p className="text-xs text-muted-foreground mb-2">{insight.description}</p>
                
                {insight.metric && (
                  <div className="flex items-center gap-2 mb-2">
                    <Progress value={(insight.metric.current / insight.metric.target) * 100} className="flex-1 h-1" />
                    <span className="text-xs text-muted-foreground">
                      {insight.metric.current}/{insight.metric.target} {insight.metric.unit}
                    </span>
                  </div>
                )}
                
                {insight.actionable && (
                  <Button size="sm" variant="outline" className="text-xs">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    Take Action
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}