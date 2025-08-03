import { AdvancedLeadAnalyticsDashboard } from "@/components/admin/AdvancedLeadAnalyticsDashboard";

export function LeadAdvancedAnalytics() {
  return (
    <div className="w-full max-w-none space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Advanced Analytics</h1>
        <p className="text-muted-foreground">
          Deep insights and predictive analytics for lead management
        </p>
      </div>

      {/* Advanced Analytics Component */}
      <AdvancedLeadAnalyticsDashboard />
    </div>
  );
}