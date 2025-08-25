import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, MessageSquare, TestTube, BarChart3, Settings, TrendingUp } from 'lucide-react';
import { AIDecisionExplainer } from './AIDecisionExplainer';
import { AILogicModifier } from './AILogicModifier';
import { AIScenarioTester } from './AIScenarioTester';
import { AIInitializer } from './AIInitializer';

export function AIIntelligenceDashboard() {
  const [activeTab, setActiveTab] = useState('explainer');
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
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">247</div>
                <div className="text-sm text-muted-foreground">Decisions Today</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">87%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Brain className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">0.82</div>
                <div className="text-sm text-muted-foreground">Avg Confidence</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TestTube className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">12</div>
                <div className="text-sm text-muted-foreground">Tests Run</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="explainer" className="flex items-center space-x-2">
            <Brain className="h-4 w-4" />
            <span>Decision Explainer</span>
          </TabsTrigger>
          <TabsTrigger value="modifier" className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Logic Modifier</span>
          </TabsTrigger>
          <TabsTrigger value="tester" className="flex items-center space-x-2">
            <TestTube className="h-4 w-4" />
            <span>Scenario Tester</span>
          </TabsTrigger>
        </TabsList>

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