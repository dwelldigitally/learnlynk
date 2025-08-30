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
import { RefinedLeadTable } from './RefinedLeadTable';
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
import { UnifiedLeadHeader } from './leads/UnifiedLeadHeader';
import { useDemoDataAccess } from '@/services/demoDataService';
import { Plus, Filter, Download, UserPlus, Settings, Target, BarChart, Upload, FileX, Zap } from 'lucide-react';
import { HelpIcon } from '@/components/ui/help-icon';
import { useHelpContent } from '@/hooks/useHelpContent';
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
    { key: 'NEW_INQUIRY', label: 'New Inquiry', count: 0, color: 'bg-blue-500' },
    { key: 'QUALIFICATION', label: 'Qualification', count: 0, color: 'bg-orange-500' },
    { key: 'NURTURING', label: 'Nurturing', count: 0, color: 'bg-purple-500' },
    { key: 'PROPOSAL_SENT', label: 'Proposal Sent', count: 0, color: 'bg-yellow-500' },
    { key: 'APPLICATION_STARTED', label: 'Application', count: 0, color: 'bg-indigo-500' },
    { key: 'CONVERTED', label: 'Converted', count: 0, color: 'bg-green-500' },
    { key: 'LOST', label: 'Lost', count: 0, color: 'bg-red-500' }
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
  }, []);

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
  }, [showUnassignedOnly]);
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
  return <div className="h-full flex flex-col bg-background">
    {/* Mobile-Optimized Page Header */}
    <div className="bg-background border-b border-border">
      <div className={cn("px-4 lg:px-6 xl:px-8", isMobile ? "py-4" : "py-6")}>
        <div className={cn("flex gap-4", isMobile ? "flex-col" : "flex-col lg:flex-row lg:items-center lg:justify-between")}>
          <div>
            <h1 className={cn("font-bold text-foreground", isMobile ? "text-xl" : "text-2xl")}>
              Lead Management
            </h1>
            <p className={cn("text-muted-foreground mt-1", isMobile ? "text-sm" : "")}>
              {showUnassignedOnly ? `${totalCount} unassigned leads` : `${totalCount} total leads`} 
              {unassignedCount > 0 && !showUnassignedOnly && ` • ${unassignedCount} need claiming`}
              {selectedLeadIds.length > 0 && ` • ${selectedLeadIds.length} selected`}
            </p>
          </div>
          
          <div className={cn("flex gap-3", isMobile ? "flex-col" : "")}>
            {unassignedCount > 0 && (
              <Button 
                variant={showUnassignedOnly ? "default" : "outline"}
                onClick={() => setShowUnassignedOnly(!showUnassignedOnly)}
                size={isMobile ? "default" : "default"}
                className={isMobile ? "min-h-[44px]" : ""}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                {showUnassignedOnly ? "Show All Leads" : `Unclaimed (${unassignedCount})`}
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={handleExport}
              size={isMobile ? "default" : "default"}
              className={isMobile ? "min-h-[44px]" : ""}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button 
              onClick={() => setShowLeadForm(true)}
              size={isMobile ? "default" : "default"}
              className={isMobile ? "min-h-[44px]" : ""}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Lead
            </Button>
          </div>
        </div>
      </div>
    </div>

    {/* Mobile-Optimized Stats Overview Cards */}
    <div className="bg-background">
      <div className={cn("px-4 lg:px-6 xl:px-8", isMobile ? "py-4" : "py-6")}>
        {isMobile ? (
          // Mobile: Horizontal scroll for stats
          <div className="overflow-x-auto">
            <div className="flex gap-3 min-w-max pb-2">
              {stageStats.map((stage) => (
                <Card 
                  key={stage.key}
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:shadow-md min-w-[120px] flex-shrink-0",
                    activeStage === stage.key ? "border-primary bg-primary/5 shadow-md" : "border-border hover:border-primary/20"
                  )}
                  onClick={() => setActiveStage(stage.key)}
                >
                  <CardContent className="p-3 text-center">
                    <div className={cn("w-3 h-3 rounded-full mx-auto mb-2", stage.color)}></div>
                    <div className="text-xl font-bold text-foreground">{stage.count}</div>
                    <div className="text-xs text-muted-foreground font-medium leading-tight">{stage.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          // Desktop: Grid layout
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {stageStats.map((stage) => (
              <Card 
                key={stage.key}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-md",
                  activeStage === stage.key ? "border-primary bg-primary/5 shadow-md" : "border-border hover:border-primary/20"
                )}
                onClick={() => setActiveStage(stage.key)}
              >
                <CardContent className="p-4 text-center">
                  <div className={cn("w-3 h-3 rounded-full mx-auto mb-2", stage.color)}></div>
                  <div className="text-2xl font-bold text-foreground">{stage.count}</div>
                  <div className="text-xs text-muted-foreground font-medium">{stage.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>

    {/* Enhanced Filters and Actions Bar */}
    <div className="bg-background border-b border-border">
      <div className="px-4 lg:px-6 xl:px-8 py-4">
        <UnifiedLeadHeader
          stages={stageStats}
          activeStage={activeStage}
          selectedLeadsCount={selectedLeadIds.length}
          filters={filters}
          programs={[]} // You might want to fetch this from your program service
          onStageChange={setActiveStage}
          onFilterChange={setFilters}
          onClearFilters={() => setFilters({})}
          onAddLead={() => setShowLeadForm(true)}
          onExport={handleExport}
        />
      </div>
    </div>

    {/* Main Content Area with Enhanced Data Table */}
    <div className="flex-1 bg-background">
      <div className="px-4 lg:px-6 xl:px-8 py-6 h-full">
        <div className="bg-card border border-border rounded-lg shadow-sm h-full">
          <ConditionalDataWrapper 
            isLoading={loading} 
            showEmptyState={!hasDemoAccess && leads.length === 0} 
            hasDemoAccess={hasDemoAccess || false} 
            hasRealData={leads.length > 0 && !leads.some(lead => lead.id.startsWith('demo-'))} 
            emptyTitle="No Leads Yet" 
            emptyDescription="Create your first lead to get started with lead management." 
            loadingRows={5}
          >
            <RefinedLeadTable 
              title="Lead Management" 
              columns={columns} 
              data={tableData} 
              totalCount={totalCount} 
              currentPage={currentPage} 
              totalPages={totalPages} 
              pageSize={pageSize} 
              loading={loading} 
              searchable={true} 
              filterable={true} 
              exportable={true} 
              selectable={true} 
              sortBy={sortBy} 
              sortOrder={sortOrder} 
              filterOptions={enhancedFilterOptions} 
              quickFilters={quickFilters} 
              selectedIds={selectedLeadIds} 
              bulkActions={bulkActions} 
              onPageChange={handlePageChange} 
              onPageSizeChange={handlePageSizeChange} 
              onSearch={handleSearch} 
              onSort={handleSort} 
              onFilter={handleFilter} 
              onExport={handleExport} 
              onRowClick={row => {
                const lead = leads.find(l => l.id === row.id);
                if (lead) {
                  navigate(`/admin/leads/detail/${lead.id}`);
                }
              }} 
              onSelectionChange={setSelectedLeadIds} 
            />
          </ConditionalDataWrapper>
        </div>
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
  </div>;
}