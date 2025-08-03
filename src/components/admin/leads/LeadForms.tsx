import { LeadCaptureForm } from "@/components/admin/LeadCaptureForm";

export function LeadForms() {
  return (
    <div className="w-full max-w-none space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lead Forms</h1>
        <p className="text-muted-foreground">
          Create and manage lead capture forms for your marketing campaigns
        </p>
      </div>

      {/* Lead Capture Form Component */}
      <LeadCaptureForm />
    </div>
  );
}