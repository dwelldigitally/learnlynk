import { useState } from 'react';
import { BulkActionCard } from './bulk/BulkActionCard';
import { ImportDialog } from './bulk/dialogs/ImportDialog';
import { AssignDialog } from './bulk/dialogs/AssignDialog';
import { Lead } from '@/types/lead';
import { Upload, UserPlus, RotateCcw, Download, Tag, Trash2, Mail, AlertTriangle } from 'lucide-react';

interface BulkLeadOperationsProps {
  selectedLeads?: Lead[];
  onOperationComplete: () => void;
}

export function BulkLeadOperations({ selectedLeads = [], onOperationComplete }: BulkLeadOperationsProps) {
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  const bulkActions = [
    {
      title: 'Import from CSV',
      description: 'Upload leads from a CSV file with validation and error reporting',
      icon: Upload,
      onClick: () => setImportDialogOpen(true),
      lastUsed: '2 hours ago'
    },
    {
      title: 'Assign to Advisors',
      description: 'Bulk assignment of leads to team members using various methods',
      icon: UserPlus,
      onClick: () => setAssignDialogOpen(true),
      lastUsed: '1 day ago'
    },
    {
      title: 'Update Status',
      description: 'Change status for multiple leads simultaneously',
      icon: RotateCcw,
      onClick: () => {},
      lastUsed: '3 days ago'
    },
    {
      title: 'Export Leads',
      description: 'Export filtered leads to CSV or Excel format',
      icon: Download,
      onClick: () => {},
      lastUsed: '1 week ago'
    },
    {
      title: 'Tag Management',
      description: 'Add or remove tags from multiple leads at once',
      icon: Tag,
      onClick: () => {},
      lastUsed: 'Never'
    },
    {
      title: 'Delete Leads',
      description: 'Bulk deletion of leads with confirmation safeguards',
      icon: Trash2,
      onClick: () => {},
      lastUsed: 'Never'
    },
    {
      title: 'Send Communications',
      description: 'Send bulk emails or SMS campaigns to selected leads',
      icon: Mail,
      onClick: () => {},
      lastUsed: 'Never'
    },
    {
      title: 'Change Priority',
      description: 'Update priority levels for multiple leads',
      icon: AlertTriangle,
      onClick: () => {},
      lastUsed: 'Never'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bulk Operations</h1>
        <p className="text-muted-foreground">
          Choose an action below to perform bulk operations on leads. Each action opens a dialog where you can select filters and configure the operation.
        </p>
        {selectedLeads.length > 0 && (
          <div className="mt-2 text-sm text-primary">
            {selectedLeads.length} leads currently selected
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {bulkActions.map((action) => (
          <BulkActionCard
            key={action.title}
            title={action.title}
            description={action.description}
            icon={action.icon}
            onClick={action.onClick}
            lastUsed={action.lastUsed}
          />
        ))}
      </div>

      {/* Import Dialog */}
      <ImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onSuccess={onOperationComplete}
      />

      {/* Assign Dialog */}
      <AssignDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        onSuccess={onOperationComplete}
        selectedLeadsCount={selectedLeads.length}
      />
    </div>
  );
}