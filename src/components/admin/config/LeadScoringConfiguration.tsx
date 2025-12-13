import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeadScoringEngine } from "@/components/admin/LeadScoringEngine";
import { AIModelDashboard } from "@/components/admin/leads/AIModelDashboard";
import { Brain, Settings } from "lucide-react";

export function LeadScoringConfiguration() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="ai-model" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="ai-model" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Scoring Model
          </TabsTrigger>
          <TabsTrigger value="rules" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Manual Rules
          </TabsTrigger>
        </TabsList>
        <TabsContent value="ai-model" className="mt-6">
          <AIModelDashboard />
        </TabsContent>
        <TabsContent value="rules" className="mt-6">
          <LeadScoringEngine />
        </TabsContent>
      </Tabs>
    </div>
  );
}