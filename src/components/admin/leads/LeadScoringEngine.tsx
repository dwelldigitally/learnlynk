import { LeadScoringEngine as ScoringEngineComponent } from "@/components/admin/LeadScoringEngine";

export function LeadScoringEngine() {
  return (
    <div className="p-6 pt-8 w-full max-w-none space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Scoring Engine</h1>
        <p className="text-muted-foreground">
          Configure lead scoring criteria and weights to prioritize leads
        </p>
      </div>

      {/* Scoring Engine Component */}
      <ScoringEngineComponent />
    </div>
  );
}