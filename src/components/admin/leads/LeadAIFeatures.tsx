import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AILeadEnhancement from "@/components/admin/AILeadEnhancement";
import { AdvancedLeadAnalyticsDashboard } from "@/components/admin/AdvancedLeadAnalyticsDashboard";
import { BulkLeadOperations } from "@/components/admin/BulkLeadOperations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function LeadAIFeatures() {
  return (
    <div className="p-6 pt-8 w-full max-w-none space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Features</h1>
        <p className="text-muted-foreground">
          Advanced AI-powered tools for lead management and enhancement
        </p>
      </div>

      {/* AI Features Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="prediction">Prediction</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <AILeadEnhancement />
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Template Assistant</CardTitle>
              <CardDescription>
                AI-powered template generation and optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Template automation features will be available here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <AdvancedLeadAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="prediction" className="space-y-6">
          <BulkLeadOperations onOperationComplete={() => {}} />
        </TabsContent>
      </Tabs>
    </div>
  );
}