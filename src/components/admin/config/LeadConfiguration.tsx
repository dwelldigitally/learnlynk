import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgenticAIConfiguration } from "./AgenticAIConfiguration";
import { LeadRoutingRulesConfiguration } from "./LeadRoutingRulesConfiguration";
import { LeadScoringConfiguration } from "./LeadScoringConfiguration";
import { LeadStatusConfiguration } from "./LeadStatusConfiguration";
import { Bot, Route, Target, Settings } from "lucide-react";

export function LeadConfiguration() {
  const [activeTab, setActiveTab] = useState("intelligence");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Lead Configuration</h2>
        <p className="text-muted-foreground">
          Configure AI intelligence, routing rules, scoring algorithms, and lead management settings
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="intelligence" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Intelligence
          </TabsTrigger>
          <TabsTrigger value="routing" className="flex items-center gap-2">
            <Route className="h-4 w-4" />
            Routing Rules
          </TabsTrigger>
          <TabsTrigger value="scoring" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Scoring
          </TabsTrigger>
          <TabsTrigger value="statuses" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Statuses & Priorities
          </TabsTrigger>
        </TabsList>

        <TabsContent value="intelligence">
          <AgenticAIConfiguration />
        </TabsContent>

        <TabsContent value="routing">
          <LeadRoutingRulesConfiguration />
        </TabsContent>

        <TabsContent value="scoring">
          <LeadScoringConfiguration />
        </TabsContent>

        <TabsContent value="statuses">
          <LeadStatusConfiguration />
        </TabsContent>
      </Tabs>
    </div>
  );
}