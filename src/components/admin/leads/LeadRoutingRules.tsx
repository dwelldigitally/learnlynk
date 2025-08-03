import { LeadRoutingRules as RoutingRulesComponent } from "@/components/admin/LeadRoutingRules";

export function LeadRoutingRules() {
  return (
    <div className="w-full max-w-none space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Routing Rules</h1>
        <p className="text-muted-foreground">
          Configure automated lead assignment and routing based on criteria
        </p>
      </div>

      {/* Routing Rules Component */}
      <RoutingRulesComponent />
    </div>
  );
}