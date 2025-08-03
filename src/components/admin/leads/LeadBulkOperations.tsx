import { BulkLeadOperations as BulkOperationsComponent } from "@/components/admin/BulkLeadOperations";

export function LeadBulkOperations() {
  return (
    <div className="w-full max-w-none space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bulk Operations</h1>
        <p className="text-muted-foreground">
          Perform bulk actions on multiple leads including import, export, and updates
        </p>
      </div>

      {/* Bulk Operations Component */}
      <BulkOperationsComponent onOperationComplete={() => {}} />
    </div>
  );
}