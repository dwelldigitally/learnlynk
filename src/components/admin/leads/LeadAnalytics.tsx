import { LeadAnalyticsDashboard } from "@/components/admin/LeadAnalyticsDashboard";

export function LeadAnalytics() {
  return (
    <div className="w-full max-w-none space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lead Analytics</h1>
        <p className="text-muted-foreground">
          Track and analyze lead performance, conversion rates, and trends
        </p>
      </div>

      {/* Analytics Dashboard Component */}
      <LeadAnalyticsDashboard />
    </div>
  );
}