import { useState } from 'react';
import { BulkActionCard } from './bulk/BulkActionCard';
import { ImportDialog } from './bulk/dialogs/ImportDialog';
import { AssignDialog } from './bulk/dialogs/AssignDialog';
import { Lead } from '@/types/lead';
import { 
  Upload, 
  UserPlus, 
  RotateCcw, 
  Download, 
  Tag, 
  Trash2, 
  Mail, 
  AlertTriangle,
  Layers,
  CheckCircle2,
  Clock,
  TrendingUp
} from 'lucide-react';
import { PageHeader } from '@/components/modern/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface BulkLeadOperationsProps {
  selectedLeads?: Lead[];
  onOperationComplete: () => void;
}

// Stats cards data
const operationStats = [
  {
    label: 'Total Operations',
    value: '1,247',
    change: '+12%',
    trend: 'up',
    icon: Layers
  },
  {
    label: 'Success Rate',
    value: '98.5%',
    change: '+2.1%',
    trend: 'up',
    icon: CheckCircle2
  },
  {
    label: 'Avg. Processing',
    value: '2.3s',
    change: '-0.5s',
    trend: 'up',
    icon: Clock
  },
  {
    label: 'Leads Processed',
    value: '45.2K',
    change: '+8.4K',
    trend: 'up',
    icon: TrendingUp
  }
];

export function BulkLeadOperations({ selectedLeads = [], onOperationComplete }: BulkLeadOperationsProps) {
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  const bulkActions = [
    {
      title: 'Import from CSV',
      description: 'Upload leads from a CSV file with validation and error reporting',
      icon: Upload,
      onClick: () => setImportDialogOpen(true),
      lastUsed: '2 hours ago',
      variant: 'primary' as const
    },
    {
      title: 'Assign to Advisors',
      description: 'Bulk assignment of leads to team members using various methods',
      icon: UserPlus,
      onClick: () => setAssignDialogOpen(true),
      lastUsed: '1 day ago',
      variant: 'default' as const
    },
    {
      title: 'Update Status',
      description: 'Change status for multiple leads simultaneously',
      icon: RotateCcw,
      onClick: () => {},
      lastUsed: '3 days ago',
      variant: 'default' as const
    },
    {
      title: 'Export Leads',
      description: 'Export filtered leads to CSV or Excel format',
      icon: Download,
      onClick: () => {},
      lastUsed: '1 week ago',
      variant: 'default' as const
    },
    {
      title: 'Tag Management',
      description: 'Add or remove tags from multiple leads at once',
      icon: Tag,
      onClick: () => {},
      lastUsed: 'Never',
      variant: 'default' as const
    },
    {
      title: 'Delete Leads',
      description: 'Bulk deletion of leads with confirmation safeguards',
      icon: Trash2,
      onClick: () => {},
      lastUsed: 'Never',
      variant: 'danger' as const
    },
    {
      title: 'Send Communications',
      description: 'Send bulk emails or SMS campaigns to selected leads',
      icon: Mail,
      onClick: () => {},
      lastUsed: 'Never',
      variant: 'default' as const
    },
    {
      title: 'Change Priority',
      description: 'Update priority levels for multiple leads',
      icon: AlertTriangle,
      onClick: () => {},
      lastUsed: 'Never',
      variant: 'warning' as const
    }
  ];

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 max-w-7xl space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-border/50 p-6 sm:p-8">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Bulk Operations
              </h1>
              <p className="text-muted-foreground mt-1 max-w-2xl">
                Perform powerful batch operations on your leads. Import, export, assign, and manage thousands of records efficiently.
              </p>
            </div>
            {selectedLeads.length > 0 && (
              <Badge 
                variant="secondary" 
                className="self-start sm:self-center px-4 py-2 text-sm font-medium bg-primary/10 text-primary border-primary/20"
              >
                {selectedLeads.length} leads selected
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {operationStats.map((stat) => (
          <Card 
            key={stat.label} 
            className="bg-gradient-to-br from-card to-card/50 border-border/50 backdrop-blur-sm"
          >
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-primary/10">
                  <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1">
                <span className={cn(
                  "text-xs font-medium",
                  stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'
                )}>
                  {stat.change}
                </span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Available Actions
        </h2>
        <div className="h-px flex-1 bg-gradient-to-l from-border to-transparent" />
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {bulkActions.map((action) => (
          <BulkActionCard
            key={action.title}
            title={action.title}
            description={action.description}
            icon={action.icon}
            onClick={action.onClick}
            lastUsed={action.lastUsed}
            variant={action.variant}
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