import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { EnhancedLeadService, EnhancedLeadFilters } from '@/services/enhancedLeadService';
import { Lead, LeadStatus, LeadSource, LeadPriority } from '@/types/lead';
import { EnhancedDataTable } from './EnhancedDataTable';
import { AdvancedFilterPanel } from './AdvancedFilterPanel';
import { LeadFormModal } from './LeadFormModal';
import { LeadDetailModal } from './LeadDetailModal';
import { LeadCaptureForm } from './LeadCaptureForm';
import { BulkLeadOperations } from './BulkLeadOperations';
import { LeadRoutingRules } from './LeadRoutingRules';
import { LeadScoringEngine } from './LeadScoringEngine';
import { LeadAnalyticsDashboard } from './LeadAnalyticsDashboard';
import AILeadEnhancement from './AILeadEnhancement';
import { ConditionalDataWrapper } from './ConditionalDataWrapper';
import { EnhancedLeadDetailModal } from './EnhancedLeadDetailModal';
import CommunicationHub from './CommunicationHub';
import { AdvancedLeadAnalyticsDashboard } from './AdvancedLeadAnalyticsDashboard';
import { InteractiveLeadGrid } from './leads/InteractiveLeadGrid';
import { useDemoDataAccess } from '@/services/demoDataService';
import { Plus, Filter, Download, UserPlus, Settings, Target, BarChart, Upload, FileX, Zap } from 'lucide-react';
import { HelpIcon } from '@/components/ui/help-icon';
import { useHelpContent } from '@/hooks/useHelpContent';
export function LeadManagement() {
  const { getHelpContent } = useHelpContent();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState<EnhancedLeadFilters>({});
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showEnhancedModal, setShowEnhancedModal] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showLeadDetail, setShowLeadDetail] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    sources: [] as string[],
    statuses: [] as string[],
    priorities: [] as string[],
    assignees: [] as Array<{
      id: string;
      name: string;
    }>,
    programs: [] as string[]
  });
  const [stats, setStats] = useState({
    total: 0,
    new_leads: 0,
    contacted: 0,
    qualified: 0,
    converted: 0,
    conversion_rate: 0
  });
  const {
    toast
  } = useToast();
  const {
    data: hasDemoAccess,
    isLoading: demoAccessLoading
  } = useDemoDataAccess();

  // STEP 1: Simple, non-reactive functions to stop infinite loop
  const loadLeads = async () => {
    try {
      console.log('LoadLeads called at:', new Date().toISOString());
      setLoading(true);
      const enhancedFilters: EnhancedLeadFilters = {
        ...filters,
        sortBy,
        sortOrder
      };
      const response = await EnhancedLeadService.getLeads(currentPage, pageSize, enhancedFilters);
      setLeads(response.leads);
      setTotalCount(response.total);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load leads',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  const loadStats = async () => {
    try {
      console.log('LoadStats called at:', new Date().toISOString());
      const {
        LeadService
      } = await import('@/services/leadService');
      const statsData = await LeadService.getLeadStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };
  const loadFilterOptions = async () => {
    try {
      const options = await EnhancedLeadService.getFilterOptions();
      setFilterOptions(options);
    } catch (error) {
      console.error('Failed to load filter options:', error);
    }
  };

  // STEP 1: Only run on mount, no dependencies that can cause loops
  useEffect(() => {
    console.log('Initial mount - loading data');
    loadLeads();
    loadStats();
    loadFilterOptions();
  }, []); // ONLY run once on mount

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    try {
      const {
        LeadService
      } = await import('@/services/leadService');
      await LeadService.updateLeadStatus(leadId, newStatus);
      // STEP 1: Simple reload without complex dependencies
      await loadLeads();
      toast({
        title: 'Success',
        description: 'Lead status updated successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update lead status',
        variant: 'destructive'
      });
    }
  };
  const handleLeadCreated = () => {
    console.log('HandleLeadCreated called at:', new Date().toISOString());
    setShowLeadForm(false);
    // STEP 1: Simple reload
    loadLeads();
    loadStats();
    toast({
      title: 'Success',
      description: 'Lead created successfully'
    });
  };
  const getStatusBadgeVariant = (status: LeadStatus) => {
    switch (status) {
      case 'new':
        return 'default';
      case 'contacted':
        return 'secondary';
      case 'qualified':
        return 'outline';
      case 'nurturing':
        return 'default';
      case 'converted':
        return 'default';
      case 'lost':
        return 'destructive';
      case 'unqualified':
        return 'secondary';
      default:
        return 'default';
    }
  };
  const getPriorityBadgeVariant = (priority: LeadPriority) => {
    switch (priority) {
      case 'urgent':
        return 'destructive';
      case 'high':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  // Enhanced table handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page
  };
  const handleSearch = (query: string) => {
    setFilters(prev => ({
      ...prev,
      search: query
    }));
    setCurrentPage(1); // Reset to first page
  };
  const handleSort = (column: string, order: 'asc' | 'desc') => {
    setSortBy(column);
    setSortOrder(order);
    setCurrentPage(1); // Reset to first page
  };
  const handleFilter = (newFilters: Record<string, any>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
    setCurrentPage(1); // Reset to first page
  };
  const handleExport = async () => {
    try {
      const blob = await EnhancedLeadService.exportLeads(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `leads-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({
        title: 'Success',
        description: 'Leads exported successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export leads',
        variant: 'destructive'
      });
    }
  };
  const handleBulkAction = async (action: string, selectedIds: string[]) => {
    try {
      let operation;
      switch (action) {
        case 'Delete Selected':
          operation = {
            operation: 'delete' as const,
            leadIds: selectedIds
          };
          break;
        case 'Mark as Contacted':
          operation = {
            operation: 'status_change' as const,
            leadIds: selectedIds,
            data: {
              status: 'contacted'
            }
          };
          break;
        case 'Mark as Qualified':
          operation = {
            operation: 'status_change' as const,
            leadIds: selectedIds,
            data: {
              status: 'qualified'
            }
          };
          break;
        default:
          return;
      }
      const result = await EnhancedLeadService.performBulkOperation(operation);
      if (result.success > 0) {
        toast({
          title: 'Success',
          description: `${result.success} leads updated successfully`
        });
        setSelectedLeadIds([]);
        loadLeads();
      }
      if (result.failed > 0) {
        toast({
          title: 'Warning',
          description: `${result.failed} leads failed to update`,
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to perform bulk operation',
        variant: 'destructive'
      });
    }
  };
  const columns = [{
    key: 'name',
    label: 'Name',
    sortable: true,
    type: 'text' as const
  }, {
    key: 'email',
    label: 'Email',
    sortable: true,
    type: 'text' as const
  }, {
    key: 'phone',
    label: 'Phone',
    sortable: false,
    type: 'text' as const
  }, {
    key: 'source',
    label: 'Source',
    sortable: true,
    type: 'text' as const
  }, {
    key: 'status',
    label: 'Status',
    sortable: true,
    type: 'custom' as const,
    render: (value: any) => <Badge variant={getStatusBadgeVariant(value)}>
        {value.toUpperCase()}
      </Badge>
  }, {
    key: 'priority',
    label: 'Priority',
    sortable: true,
    type: 'custom' as const,
    render: (value: any) => <Badge variant={getPriorityBadgeVariant(value)}>
        {value.toUpperCase()}
      </Badge>
  }, {
    key: 'lead_score',
    label: 'Score',
    sortable: true,
    type: 'number' as const
  }, {
    key: 'created_at',
    label: 'Created',
    sortable: true,
    type: 'date' as const
  }, {
    key: 'assigned_to',
    label: 'Assigned To',
    sortable: false,
    type: 'text' as const
  }];
  const tableData = leads.map(lead => ({
    id: lead.id,
    name: `${lead.first_name} ${lead.last_name}`,
    email: lead.email,
    phone: lead.phone || '-',
    source: lead.source.replace('_', ' ').toUpperCase(),
    status: lead.status,
    priority: lead.priority,
    lead_score: lead.lead_score,
    created_at: lead.created_at,
    assigned_to: lead.assigned_to || 'Unassigned'
  }));
  const quickFilters = [{
    label: 'New Today',
    filter: {
      date_range: {
        start: new Date(),
        end: new Date()
      },
      status: ['new']
    }
  }, {
    label: 'Unassigned',
    filter: {
      assigned_to: []
    }
  }, {
    label: 'High Priority',
    filter: {
      priority: ['high', 'urgent']
    }
  }, {
    label: 'Hot Leads',
    filter: {
      lead_score_range: {
        min: 80,
        max: 100
      }
    }
  }];
  const enhancedFilterOptions = [{
    key: 'status',
    label: 'Status',
    options: filterOptions.statuses.map(s => ({
      value: s,
      label: s.charAt(0).toUpperCase() + s.slice(1)
    }))
  }, {
    key: 'source',
    label: 'Source',
    options: filterOptions.sources.map(s => ({
      value: s,
      label: s.replace('_', ' ').toUpperCase()
    }))
  }, {
    key: 'priority',
    label: 'Priority',
    options: filterOptions.priorities.map(p => ({
      value: p,
      label: p.charAt(0).toUpperCase() + p.slice(1)
    }))
  }, {
    key: 'assigned_to',
    label: 'Assigned To',
    options: filterOptions.assignees.map(a => ({
      value: a.id,
      label: a.name
    }))
  }];
  const bulkActions = [{
    label: 'Mark as Contacted',
    onClick: (ids: string[]) => handleBulkAction('Mark as Contacted', ids)
  }, {
    label: 'Mark as Qualified',
    onClick: (ids: string[]) => handleBulkAction('Mark as Qualified', ids)
  }, {
    label: 'Delete Selected',
    onClick: (ids: string[]) => handleBulkAction('Delete Selected', ids),
    variant: 'destructive' as const
  }];
  return <div className="w-full max-w-7xl mx-auto space-y-6 px-6 pr-8">
      {/* Interactive Lead Grid */}
      <ConditionalDataWrapper 
        isLoading={loading} 
        showEmptyState={!hasDemoAccess && leads.length === 0} 
        hasDemoAccess={hasDemoAccess || false} 
        hasRealData={leads.length > 0 && !leads.some(lead => lead.id.startsWith('demo-'))} 
        emptyTitle="No Leads Yet" 
        emptyDescription="Create your first lead to get started with lead management." 
        loadingRows={5}
      >
        <InteractiveLeadGrid
          leads={leads}
          onStatusChange={handleStatusChange}
          onViewDetails={(lead) => {
            setSelectedLead(lead);
            setShowEnhancedModal(true);
          }}
          onEdit={(lead) => {
            setSelectedLead(lead);
            setShowLeadForm(true);
          }}
          onAddLead={() => setShowLeadForm(true)}
          onExport={handleExport}
        />
      </ConditionalDataWrapper>

      {/* Modals */}
      <LeadFormModal open={showLeadForm} onOpenChange={setShowLeadForm} onLeadCreated={handleLeadCreated} />

      {/* Enhanced Lead Detail Modal */}
      <EnhancedLeadDetailModal lead={selectedLead} isOpen={showEnhancedModal} onClose={() => {
      setShowEnhancedModal(false);
      setSelectedLead(null);
    }} onLeadUpdate={updatedLead => {
      setLeads(prev => prev.map(lead => lead.id === updatedLead.id ? updatedLead : lead));
      loadStats();
    }} />

      {/* Legacy Lead Detail Modal for fallback */}
      {selectedLead && <LeadDetailModal open={showLeadDetail} onOpenChange={setShowLeadDetail} lead={selectedLead} onStatusChange={handleStatusChange} onLeadUpdated={() => {
      loadLeads();
      loadStats();
    }} />}
    </div>;
}