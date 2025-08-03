import { CommunicationTemplateManager } from "@/components/admin/CommunicationTemplateManager";

export function LeadTemplates() {
  return (
    <div className="p-6 pt-8 w-full max-w-none space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Communication Templates</h1>
        <p className="text-muted-foreground">
          Create and manage email and SMS templates for lead communication
        </p>
      </div>

      {/* Template Manager Component */}
      <CommunicationTemplateManager />
    </div>
  );
}