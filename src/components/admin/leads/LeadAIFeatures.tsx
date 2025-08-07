import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Settings, Bot, Route, Target } from "lucide-react";
import { AgenticAIConfiguration } from "../config/AgenticAIConfiguration";
import { AIInsightsPanel } from "./AIInsightsPanel";
import { AIUnifiedAssistant } from "./AIUnifiedAssistant";
import { AISmartCommunication } from "./AISmartCommunication";

// Mock lead data for demonstration
const mockLead = {
  id: "lead-1",
  first_name: "John",
  last_name: "Doe", 
  email: "john.doe@example.com",
  phone: "+1234567890",
  country: "United States",
  program_interest: ["MBA", "Executive Education"],
  source: "web" as const,
  priority: "high" as const,
  status: "new" as const,
  lead_score: 85,
  tags: ["high-priority", "international"],
  created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  updated_at: new Date().toISOString()
};

interface AIFeature {
  id: string;
  name: string;
  description: string;
  icon: any;
  enabled: boolean;
  category: 'assistant' | 'communication' | 'management' | 'insights';
  impact: 'high' | 'medium' | 'low';
  usage: number;
}

export function LeadAIFeatures() {
  const [activeTab, setActiveTab] = useState("agentic");

  return (
    <div className="p-6 pt-8 w-full max-w-none space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Lead Intelligence</h1>
          <p className="text-muted-foreground">
            Configure and manage AI-powered lead intelligence and automation
          </p>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <Brain className="h-3 w-3 mr-1" />
          AI Enhanced
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="agentic" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Agentic AI
          </TabsTrigger>
          <TabsTrigger value="assistant" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Assistant
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Smart Insights
          </TabsTrigger>
          <TabsTrigger value="communication" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Communication
          </TabsTrigger>
        </TabsList>

        {/* Agentic AI Configuration */}
        <TabsContent value="agentic">
          <AgenticAIConfiguration />
        </TabsContent>

        {/* AI Assistant Demo */}
        <TabsContent value="assistant" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Lead Assistant Demo
              </CardTitle>
              <CardDescription>
                Interactive demo of the AI assistant with real-time lead analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AIUnifiedAssistant lead={mockLead} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Smart Insights */}
        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Smart Insights Panel
              </CardTitle>
              <CardDescription>
                AI-powered lead insights and conversion predictions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AIInsightsPanel lead={mockLead} expanded={true} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Communication Hub */}
        <TabsContent value="communication" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                AI Communication Hub
              </CardTitle>
              <CardDescription>
                Automated communication templates and smart messaging
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AISmartCommunication lead={mockLead} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}