import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { EnhancedLeadService, EnhancedLeadFilters } from '@/services/enhancedLeadService';
import { Lead, LeadStatus, LeadSource, LeadPriority, LeadStage } from '@/types/lead';
import { SmartLeadTable } from './SmartLeadTable';
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
import { UnifiedLeadHeader, ColumnConfig } from './leads/UnifiedLeadHeader';
import { useDemoDataAccess } from '@/services/demoDataService';
import { Plus, Filter, Download, UserPlus, Settings, Target, BarChart, Upload, FileX, Zap, Search, Users, Phone, Mail, Calendar, Star, AlertTriangle, TrendingUp, Activity, CheckCircle, Clock, User, Tag, ArrowRight } from 'lucide-react';
import { HelpIcon } from '@/components/ui/help-icon';
import { useHelpContent } from '@/hooks/useHelpContent';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { PageHeader } from '@/components/modern/PageHeader';
import { ModernCard } from '@/components/modern/ModernCard';

export function LeadManagement() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
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
  const [activeStage, setActiveStage] = useState('all');
  const [showEnhancedModal, setShowEnhancedModal] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showLeadDetail, setShowLeadDetail] = useState(false);
  const [unassignedCount, setUnassignedCount] = useState(0);
  const [showUnassignedOnly, setShowUnassignedOnly] = useState(false);
  const [tableColumns, setTableColumns] = useState<ColumnConfig[]>([
    { id: 'name', label: 'Name', visible: true, sortable: true },
    { id: 'email', label: 'Email', visible: true, sortable: true },
    { id: 'phone', label: 'Phone', visible: true, sortable: false },
    { id: 'source', label: 'Source', visible: true, sortable: true },
    { id: 'created_at', label: 'Created', visible: true, sortable: true },
    { id: 'last_activity', label: 'Last Activity', visible: true, sortable: false },
    { id: 'stage', label: 'Stage', visible: true, sortable: true },
    { id: 'lead_score', label: 'Lead Score', visible: true, sortable: true },
    { id: 'priority', label: 'Priority', visible: true, sortable: true },
    { id: 'assigned_to', label: 'Assigned To', visible: true, sortable: false },
    { id: 'suggested_action', label: 'Suggested Action', visible: true, sortable: false },
  ]);
  
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
  const [stageStats, setStageStats] = useState([
    { key: 'NEW_INQUIRY', label: 'New Inquiry', count: 0, color: 'bg-sky-400' },
    { key: 'REQUIREMENTS_APPROVED', label: 'Requirements Approved', count: 0, color: 'bg-amber-400' },
    { key: 'PAYMENT_RECEIVED', label: 'Payment Received', count: 0, color: 'bg-emerald-400' },
    { key: 'REGISTERED', label: 'Registered', count: 0, color: 'bg-violet-400' },
    { key: 'ADMITTED', label: 'Admitted', count: 0, color: 'bg-indigo-400' },
    { key: 'DISMISSED', label: 'Dismissed', count: 0, color: 'bg-rose-400' }
  ]);
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
      let enhancedFilters: EnhancedLeadFilters = {
        ...filters,
        sortBy,
        sortOrder
      };

      // If showing unassigned only, filter for null user_id
      if (showUnassignedOnly) {
        enhancedFilters = {
          ...enhancedFilters,
          unassigned_only: true
        };
      }

      const response = await EnhancedLeadService.getLeads(currentPage, pageSize, enhancedFilters);
      setLeads(response.leads);
      setTotalCount(response.total);
      setTotalPages(response.totalPages);
      
      // Reload unassigned count
      loadUnassignedCount();
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
  const loadStageStats = async () => {
    try {
      // Calculate stage stats from current leads
      const stageCounts = leads.reduce((acc, lead) => {
        const stage = lead.stage || 'NEW_INQUIRY';
        acc[stage] = (acc[stage] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      setStageStats(prev => prev.map(stage => ({
        ...stage,
        count: stageCounts[stage.key] || 0
      })));
    } catch (error) {
      console.error('Failed to load stage stats:', error);
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

  // Load initial data
  useEffect(() => {
    console.log('Initial mount - loading data');
    loadLeads();
    loadFilterOptions();
    loadUnassignedCount();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Reload leads when filters, sorting, or pagination changes
  useEffect(() => {
    loadLeads();
  }, [filters, sortBy, sortOrder, currentPage, pageSize]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadUnassignedCount = async () => {
    try {
      const count = await EnhancedLeadService.getUnassignedLeadsCount();
      setUnassignedCount(count);
    } catch (error) {
      console.error('Failed to load unassigned count:', error);
    }
  };

  // Update stage stats when leads change
  useEffect(() => {
    loadStageStats();
  }, [leads]);

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
    loadLeads();
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

  // Auto-reload when switching between views
  useEffect(() => {
    loadLeads();
  }, [showUnassignedOnly]); // eslint-disable-line react-hooks/exhaustive-deps
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
  const handleClaimLeads = async (selectedIds: string[]) => {
    try {
      const result = await EnhancedLeadService.claimLeads(selectedIds);
      if (result.success > 0) {
        toast({
          title: 'Success',
          description: `${result.success} leads claimed successfully`
        });
        setSelectedLeadIds([]);
        loadLeads();
      }
      if (result.failed > 0) {
        toast({
          title: 'Warning',
          description: `${result.failed} leads failed to claim`,
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to claim leads',
        variant: 'destructive'
      });
    }
  };

  const handleBulkAction = async (action: string, selectedIds: string[]) => {
    if (action === 'Claim Selected') {
      return handleClaimLeads(selectedIds);
    }

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
    type: 'custom' as const,
    render: (value: any, row: any) => (
      <div className="flex items-center gap-2">
        <span>{value}</span>
        {row.is_unclaimed && (
          <Badge variant="secondary" className="text-xs">
            Needs Claim
          </Badge>
        )}
      </div>
    )
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
    assigned_to: lead.assigned_to || (lead.user_id ? 'Unassigned' : 'Unclaimed'),
    is_unclaimed: !lead.user_id
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
  const bulkActions = [
    ...(showUnassignedOnly ? [{
      label: 'Claim Selected',
      onClick: (ids: string[]) => handleBulkAction('Claim Selected', ids),
      variant: 'default' as const
    }] : []),
    {
      label: 'Mark as Contacted',
      onClick: (ids: string[]) => handleBulkAction('Mark as Contacted', ids)
    }, {
      label: 'Mark as Qualified',
      onClick: (ids: string[]) => handleBulkAction('Mark as Qualified', ids)
    }, {
      label: 'Delete Selected',
      onClick: (ids: string[]) => handleBulkAction('Delete Selected', ids),
      variant: 'destructive' as const
    }
  ];
  return (
    <div className="h-full flex flex-col bg-background">
      {/* Modern Header - HotSheet Style */}
      <div className="border-b border-border/40 bg-card">
        <div className="px-4 sm:px-8 py-6 sm:py-8">
          <UnifiedLeadHeader
            stages={stageStats}
            activeStage={activeStage}
            selectedLeadsCount={selectedLeadIds.length}
            filters={filters}
            programs={[]}
            onStageChange={setActiveStage}
            onFilterChange={setFilters}
            onClearFilters={() => setFilters({})}
            onAddLead={() => setShowLeadForm(true)}
            onExport={handleExport}
            onSearch={handleSearch}
            columns={tableColumns}
            onColumnsChange={setTableColumns}
          />
        </div>
      </div>

      {/* Main Content - Table with HotSheet Styling */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full p-4 sm:p-8">
          <ConditionalDataWrapper
            isLoading={loading}
            showEmptyState={!hasDemoAccess && leads.length === 0}
            hasDemoAccess={hasDemoAccess || false}
            hasRealData={leads.length > 0 && !leads.some((lead) => lead.id.startsWith('demo-'))}
            emptyTitle="No Leads Yet"
            emptyDescription="Create your first lead to get started with lead management."
            loadingRows={5}
          >
            <div className="h-full flex flex-col overflow-hidden bg-card rounded-2xl border border-border/40">
              <div className="flex-1 overflow-auto">
                <SmartLeadTable
                  leads={leads}
                  loading={loading}
                  selectedLeadIds={selectedLeadIds}
                  onLeadSelect={(leadId) => {
                    setSelectedLeadIds((prev) =>
                      prev.includes(leadId) ? prev.filter((id) => id !== leadId) : [...prev, leadId]
                    );
                  }}
                  onSelectAll={(selected) => {
                    setSelectedLeadIds(selected ? leads.map((l) => l.id) : []);
                  }}
                  onLeadClick={(lead) => {
                    navigate(`/admin/leads/detail/${lead.id}`);
                  }}
                  onBulkAction={handleBulkAction}
                  onSort={handleSort}
                  onFilter={handleFilter}
                  onSearch={handleSearch}
                  onExport={handleExport}
                  onAddLead={() => setShowLeadForm(true)}
                  totalCount={totalCount}
                  currentPage={currentPage}
                  pageSize={pageSize}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                  columns={tableColumns}
                />
              </div>
            </div>
          </ConditionalDataWrapper>
        </div>
      </div>
    {/* Modals */}
    <LeadFormModal open={showLeadForm} onOpenChange={setShowLeadForm} onLeadCreated={handleLeadCreated} />

    {/* Enhanced Lead Detail Modal */}
    <EnhancedLeadDetailModal 
      lead={selectedLead} 
      isOpen={showEnhancedModal} 
      onClose={() => {
        setShowEnhancedModal(false);
        setSelectedLead(null);
      }} 
      onLeadUpdate={updatedLead => {
        setLeads(prev => prev.map(lead => lead.id === updatedLead.id ? updatedLead : lead));
      }} 
    />

    {/* Legacy Lead Detail Modal for fallback */}
    {selectedLead && (
      <LeadDetailModal 
        open={showLeadDetail} 
        onOpenChange={setShowLeadDetail} 
        lead={selectedLead} 
        onStatusChange={handleStatusChange} 
        onLeadUpdated={() => {
          loadLeads();
        }} 
      />
    )}
    </div>
  );
}
