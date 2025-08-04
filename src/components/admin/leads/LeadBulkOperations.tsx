import { BulkLeadOperations as BulkOperationsComponent } from "@/components/admin/BulkLeadOperations";

export function LeadBulkOperations() {
  return (
    <div className="p-6 pt-8 w-full max-w-none">
      <BulkOperationsComponent onOperationComplete={() => {}} />
    </div>
  );
}