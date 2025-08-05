import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamCapacityService, type AssignmentRecommendation } from "@/services/teamCapacityService";
import { supabase } from "@/integrations/supabase/client";
import { Zap, Target, TrendingUp, Clock, AlertTriangle, CheckCircle, Plus, Settings } from "lucide-react";
import { toast } from "sonner";

interface RoutingRule {
  id: string;
  name: string;
  description: string;
  priority: number;
  isActive: boolean;
  conditions: any;
  assignmentConfig: any;
  matchCount: number;
  successRate: number;
}

interface RoutingMetrics {
  totalAssignments: number;
  automaticAssignments: number;
  averageAssignmentTime: number;
  successfulMatches: number;
  rulePerformance: Array<{
    ruleId: string;
    ruleName: string;
    executions: number;
    successRate: number;
    averageResponseTime: number;
  }>;
}

export function AdvancedRoutingEngine() {
  const [rules, setRules] = useState<RoutingRule[]>([]);
  const [metrics, setMetrics] = useState<RoutingMetrics | null>(null);
  const [recommendations, setRecommendations] = useState<AssignmentRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRule, setSelectedRule] = useState<string | null>(null);
  const [showRuleBuilder, setShowRuleBuilder] = useState(false);

  useEffect(() => {
    loadRoutingData();
  }, []);

  const loadRoutingData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadRoutingRules(),
        loadRoutingMetrics()
      ]);
    } catch (error) {
      console.error('Failed to load routing data:', error);
      toast.error('Failed to load routing data');
    } finally {
      setLoading(false);
    }
  };

  const loadRoutingRules = async () => {
    const { data: rulesData } = await supabase
      .from('lead_routing_rules')
      .select('*')
      .order('priority', { ascending: false });

    if (rulesData) {
      const rulesWithMetrics = await Promise.all(
        rulesData.map(async (rule) => {
          const { data: executions } = await supabase
            .from('rule_execution_logs')
            .select('*')
            .eq('rule_id', rule.id)
            .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

          const totalExecutions = executions?.length || 0;
          const successfulExecutions = executions?.filter(e => e.execution_result === 'success').length || 0;

          return {
            id: rule.id,
            name: rule.name,
            description: rule.description || '',
            priority: rule.priority,
            isActive: rule.is_active,
            conditions: rule.conditions,
            assignmentConfig: rule.assignment_config,
            matchCount: totalExecutions,
            successRate: totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 0
          };
        })
      );

      setRules(rulesWithMetrics);
    }
  };

  const loadRoutingMetrics = async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    
    // Get assignment metrics
    const { data: assignments } = await supabase
      .from('leads')
      .select('assigned_to, assigned_at, assignment_method')
      .not('assigned_to', 'is', null)
      .gte('assigned_at', thirtyDaysAgo);

    // Get rule execution metrics
    const { data: executions } = await supabase
      .from('rule_execution_logs')
      .select('*')
      .gte('created_at', thirtyDaysAgo);

    const totalAssignments = assignments?.length || 0;
    const automaticAssignments = assignments?.filter(a => 
      ['ai_based', 'round_robin', 'workload_based'].includes(a.assignment_method)
    ).length || 0;

    const ruleStats = executions?.reduce((acc, exec) => {
      if (!acc[exec.rule_id]) {
        acc[exec.rule_id] = {
          executions: 0,
          successes: 0,
          totalTime: 0
        };
      }
      acc[exec.rule_id].executions++;
      if (exec.execution_result === 'success') {
        acc[exec.rule_id].successes++;
      }
      acc[exec.rule_id].totalTime += exec.execution_time_ms || 0;
      return acc;
    }, {} as Record<string, any>) || {};

    const rulePerformance = Object.entries(ruleStats).map(([ruleId, stats]) => {
      const rule = rules.find(r => r.id === ruleId);
      return {
        ruleId,
        ruleName: rule?.name || 'Unknown Rule',
        executions: stats.executions,
        successRate: stats.executions > 0 ? (stats.successes / stats.executions) * 100 : 0,
        averageResponseTime: stats.executions > 0 ? stats.totalTime / stats.executions : 0
      };
    });

    setMetrics({
      totalAssignments,
      automaticAssignments,
      averageAssignmentTime: 150, // Placeholder
      successfulMatches: automaticAssignments,
      rulePerformance
    });
  };

  const toggleRule = async (ruleId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('lead_routing_rules')
        .update({ is_active: isActive })
        .eq('id', ruleId);

      if (error) throw error;

      setRules(rules.map(rule => 
        rule.id === ruleId ? { ...rule, isActive } : rule
      ));

      toast.success(`Rule ${isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Failed to toggle rule:', error);
      toast.error('Failed to update rule status');
    }
  };

  const getPerformanceColor = (rate: number) => {
    if (rate >= 80) return "text-green-600";
    if (rate >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getPerformanceBadge = (rate: number) => {
    if (rate >= 80) return "default";
    if (rate >= 60) return "secondary";
    return "destructive";
  };

  if (loading) {
    return <div className="space-y-4">Loading routing engine data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Advanced Routing Engine</h2>
          <p className="text-muted-foreground">AI-powered lead assignment and routing automation</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadRoutingData} variant="outline">
            Refresh Data
          </Button>
          <Button onClick={() => setShowRuleBuilder(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Rule
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rules">Routing Rules</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="optimization">AI Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Metrics Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.totalAssignments || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Last 30 days
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Automated</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.automaticAssignments || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {metrics?.totalAssignments ? 
                    Math.round((metrics.automaticAssignments / metrics.totalAssignments) * 100) : 0}% automated
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Assignment Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.averageAssignmentTime || 0}ms</div>
                <p className="text-xs text-muted-foreground">
                  Processing speed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics?.totalAssignments ? 
                    Math.round((metrics.successfulMatches / metrics.totalAssignments) * 100) : 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Successful matches
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Active Rules Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Active Routing Rules</CardTitle>
              <p className="text-sm text-muted-foreground">
                Currently active rules processing lead assignments
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {rules.filter(rule => rule.isActive).map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <div>
                        <div className="font-medium">{rule.name}</div>
                        <div className="text-sm text-muted-foreground">{rule.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getPerformanceBadge(rule.successRate)}>
                        {rule.successRate.toFixed(1)}% success
                      </Badge>
                      <Badge variant="outline">
                        Priority {rule.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
                {rules.filter(rule => rule.isActive).length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    No active routing rules found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          <div className="space-y-4">
            {rules.map((rule) => (
              <Card key={rule.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{rule.name}</span>
                        {rule.isActive ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-orange-600" />
                        )}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{rule.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={rule.isActive}
                        onCheckedChange={(checked) => toggleRule(rule.id, checked)}
                      />
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div>
                      <div className="text-sm font-medium">Priority</div>
                      <div className="text-2xl font-bold">{rule.priority}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Matches</div>
                      <div className="text-2xl font-bold">{rule.matchCount}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Success Rate</div>
                      <div className={`text-2xl font-bold ${getPerformanceColor(rule.successRate)}`}>
                        {rule.successRate.toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Status</div>
                      <Badge variant={rule.isActive ? "default" : "secondary"}>
                        {rule.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rule Performance Analysis</CardTitle>
              <p className="text-sm text-muted-foreground">
                Detailed performance metrics for each routing rule
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics?.rulePerformance.map((perf) => (
                  <div key={perf.ruleId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{perf.ruleName}</div>
                      <div className="text-sm text-muted-foreground">
                        {perf.executions} executions in last 30 days
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">Success Rate</div>
                        <div className={getPerformanceColor(perf.successRate)}>
                          {perf.successRate.toFixed(1)}%
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">Avg Time</div>
                        <div>{perf.averageResponseTime.toFixed(0)}ms</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Optimization Recommendations</CardTitle>
              <p className="text-sm text-muted-foreground">
                Machine learning insights for improving routing performance
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-blue-50">
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-blue-900">Workload Optimization</div>
                      <div className="text-sm text-blue-700">
                        Consider adjusting rule priorities to better distribute workload. 
                        Rules with higher success rates should have higher priority.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-green-50">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-green-900">Performance Improvement</div>
                      <div className="text-sm text-green-700">
                        Rules performing above 80% success rate could be replicated 
                        with similar conditions for other program types.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-yellow-50">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-yellow-900">Attention Required</div>
                      <div className="text-sm text-yellow-700">
                        Some rules have low success rates and may need condition adjustments 
                        or deactivation to improve overall system performance.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}