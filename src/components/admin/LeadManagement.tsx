import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { LeadService } from '@/services/leadService';
import { Lead, LeadStatus, LeadSource, LeadPriority } from '@/types/lead';
import ModernDataTable from './ModernDataTable';
import { LeadFormModal } from './LeadFormModal';
import { LeadDetailModal } from './LeadDetailModal';
import { LeadCaptureForm } from './LeadCaptureForm';
import { BulkLeadOperations } from './BulkLeadOperations';
import { LeadRoutingRules } from './LeadRoutingRules';
import { LeadScoringEngine } from './LeadScoringEngine';
import { LeadAnalyticsDashboard } from './LeadAnalyticsDashboard';
import AILeadEnhancement from './AILeadEnhancement';
import { Plus, Search, Filter, Download, UserPlus, Settings, Target, BarChart, Upload } from 'lucide-react';

export function LeadManagement() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [sourceFilter, setSourceFilter] = useState<LeadSource | 'all'>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedLeads, setSelectedLeads] = useState<Lead[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showLeadDetail, setShowLeadDetail] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    new_leads: 0,
    contacted: 0,
    qualified: 0,
    converted: 0,
    conversion_rate: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    loadLeads();
    loadStats();
  }, [statusFilter, sourceFilter]);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const filters = {
        ...(statusFilter !== 'all' && { status: [statusFilter] }),
        ...(sourceFilter !== 'all' && { source: [sourceFilter] })
      };
      
      const { leads: fetchedLeads } = await LeadService.getLeads(filters);
      setLeads(fetchedLeads);
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
      const statsData = await LeadService.getLeadStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    try {
      await LeadService.updateLeadStatus(leadId, newStatus);
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
    setShowLeadForm(false);
    loadLeads();
    loadStats();
    toast({
      title: 'Success',
      description: 'Lead created successfully'
    });
  };

  const getStatusBadgeVariant = (status: LeadStatus) => {
    switch (status) {
      case 'new': return 'default';
      case 'contacted': return 'secondary';
      case 'qualified': return 'outline';
      case 'nurturing': return 'default';
      case 'converted': return 'default';
      case 'lost': return 'destructive';
      case 'unqualified': return 'secondary';
      default: return 'default';
    }
  };

  const getPriorityBadgeVariant = (priority: LeadPriority) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const filteredLeads = leads.filter(lead => 
    `${lead.first_name} ${lead.last_name} ${lead.email}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone', sortable: false },
    { key: 'source', label: 'Source', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'priority', label: 'Priority', sortable: true },
    { key: 'lead_score', label: 'Score', sortable: true },
    { key: 'created_at', label: 'Created', sortable: true },
    { key: 'assigned_to', label: 'Assigned To', sortable: false }
  ];

  const tableData = filteredLeads.map(lead => ({
    id: lead.id,
    name: `${lead.first_name} ${lead.last_name}`,
    email: lead.email,
    phone: lead.phone || '-',
    source: lead.source.replace('_', ' ').toUpperCase(),
    status: (
      <Badge variant={getStatusBadgeVariant(lead.status)}>
        {lead.status.toUpperCase()}
      </Badge>
    ),
    priority: (
      <Badge variant={getPriorityBadgeVariant(lead.priority)}>
        {lead.priority.toUpperCase()}
      </Badge>
    ),
    lead_score: lead.lead_score,
    created_at: new Date(lead.created_at).toLocaleDateString(),
    assigned_to: lead.assigned_to || 'Unassigned',
    onClick: () => {
      setSelectedLead(lead);
      setShowLeadDetail(true);
    }
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Lead Management</h1>
          <p className="text-muted-foreground">Comprehensive lead generation, routing, and conversion system</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ai">AI Features</TabsTrigger>
          <TabsTrigger value="capture">Lead Forms</TabsTrigger>
          <TabsTrigger value="routing">Routing Rules</TabsTrigger>
          <TabsTrigger value="scoring">Scoring Engine</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Operations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">New Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.new_leads}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Contacted</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.contacted}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Qualified</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{stats.qualified}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Converted</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.converted}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.conversion_rate.toFixed(1)}%</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Lead Management</CardTitle>
                <div className="flex items-center gap-2">
                  <Button onClick={() => setShowLeadForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Lead
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search leads..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as LeadStatus | 'all')}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="nurturing">Nurturing</SelectItem>
                    <SelectItem value="converted">Converted</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                    <SelectItem value="unqualified">Unqualified</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sourceFilter} onValueChange={(value) => setSourceFilter(value as LeadSource | 'all')}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Sources" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="web">Web</SelectItem>
                    <SelectItem value="social_media">Social Media</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="agent">Agent</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="walk_in">Walk In</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Data Table */}
              <ModernDataTable
                title="Leads"
                columns={columns}
                data={tableData}
                searchable={false}
                exportable={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <AILeadEnhancement />
        </TabsContent>

        <TabsContent value="capture">
          <LeadCaptureForm onLeadCreated={loadLeads} />
        </TabsContent>

        <TabsContent value="routing">
          <LeadRoutingRules onRuleCreated={loadLeads} />
        </TabsContent>

        <TabsContent value="scoring">
          <LeadScoringEngine />
        </TabsContent>

        <TabsContent value="bulk">
          <BulkLeadOperations 
            selectedLeads={selectedLeads} 
            onOperationComplete={loadLeads} 
          />
        </TabsContent>

        <TabsContent value="analytics">
          <LeadAnalyticsDashboard />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <LeadFormModal
        open={showLeadForm}
        onOpenChange={setShowLeadForm}
        onLeadCreated={handleLeadCreated}
      />

      {selectedLead && (
        <LeadDetailModal
          open={showLeadDetail}
          onOpenChange={setShowLeadDetail}
          lead={selectedLead}
          onStatusChange={handleStatusChange}
          onLeadUpdated={loadLeads}
        />
      )}
    </div>
  );
}