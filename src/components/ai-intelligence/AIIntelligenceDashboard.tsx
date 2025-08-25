import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Brain, 
  MessageSquare, 
  TestTube, 
  BarChart3, 
  Settings, 
  TrendingUp, 
  Monitor, 
  AlertTriangle,
  Zap,
  Target
} from 'lucide-react';
import { AIDecisionExplainer } from './AIDecisionExplainer';
import { AILogicModifier } from './AILogicModifier';
import { AIScenarioTester } from './AIScenarioTester';
import { AIInitializer } from './AIInitializer';
import { AIRealtimeMonitor } from './AIRealtimeMonitor';
import { AIAnalyticsDashboard } from './AIAnalyticsDashboard';
import { AIModelManager } from './AIModelManager';
import { AIAlertCenter } from './AIAlertCenter';

export function AIIntelligenceDashboard() {
  const [activeTab, setActiveTab] = useState('monitor');
  const [isInitialized, setIsInitialized] = useState(false);

  if (!isInitialized) {
    return <AIInitializer onInitialized={() => setIsInitialized(true)} />;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Brain className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">AI Decision Intelligence Center</h1>
          <p className="text-muted-foreground">
            Understand, control, and optimize AI decision-making for enrollment management
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">247</div>
                <div className="text-sm text-muted-foreground">Decisions Today</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-success/10 rounded-lg">
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold text-success">87.5%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Target className="h-4 w-4 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">0.89</div>
                <div className="text-sm text-muted-foreground">Avg Confidence</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-warning/10 rounded-lg">
                <TestTube className="h-4 w-4 text-warning" />
              </div>
              <div>
                <div className="text-2xl font-bold text-warning">156</div>
                <div className="text-sm text-muted-foreground">Tests Run</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7 h-auto">
          <TabsTrigger value="monitor" className="flex items-center space-x-2 flex-col py-3">
            <Monitor className="h-4 w-4" />
            <span className="text-xs">Real-time Monitor</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2 flex-col py-3">
            <BarChart3 className="h-4 w-4" />
            <span className="text-xs">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="models" className="flex items-center space-x-2 flex-col py-3">
            <Zap className="h-4 w-4" />
            <span className="text-xs">Model Manager</span>
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center space-x-2 flex-col py-3">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-xs">Alert Center</span>
          </TabsTrigger>
          <TabsTrigger value="explainer" className="flex items-center space-x-2 flex-col py-3">
            <Brain className="h-4 w-4" />
            <span className="text-xs">Decision Explainer</span>
          </TabsTrigger>
          <TabsTrigger value="modifier" className="flex items-center space-x-2 flex-col py-3">
            <MessageSquare className="h-4 w-4" />
            <span className="text-xs">Logic Modifier</span>
          </TabsTrigger>
          <TabsTrigger value="tester" className="flex items-center space-x-2 flex-col py-3">
            <TestTube className="h-4 w-4" />
            <span className="text-xs">Scenario Tester</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="monitor" className="mt-6">
          <AIRealtimeMonitor />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <AIAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="models" className="mt-6">
          <AIModelManager />
        </TabsContent>

        <TabsContent value="alerts" className="mt-6">
          <AIAlertCenter />
        </TabsContent>

        <TabsContent value="explainer" className="mt-6">
          <AIDecisionExplainer showRecentDecisions={true} />
        </TabsContent>

        <TabsContent value="modifier" className="mt-6">
          <AILogicModifier />
        </TabsContent>

        <TabsContent value="tester" className="mt-6">
          <AIScenarioTester />
        </TabsContent>
      </Tabs>
    </div>
  );
}