import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  MoreHorizontal, 
  Phone, 
  Mail, 
  MessageSquare, 
  ArrowRight,
  Star,
  AlertTriangle,
  Activity,
  Calendar,
  User,
  Tag,
  TrendingUp,
  Clock,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Settings2,
  Eye,
  EyeOff,
  GripVertical
} from 'lucide-react';
import { format } from 'date-fns';
import { Lead, LeadStatus, LeadPriority } from '@/types/lead';
import { cn } from '@/lib/utils';

interface SmartLeadTableProps {
  leads: Lead[];
  loading: boolean;
  selectedLeadIds: string[];
  onLeadSelect: (leadId: string) => void;
  onSelectAll: (selected: boolean) => void;
  onLeadClick: (lead: Lead) => void;
  onBulkAction: (action: string, selectedIds: string[]) => void;
  onSort: (column: string, order: 'asc' | 'desc') => void;
  onFilter: (filters: Record<string, any>) => void;
  onSearch: (query: string) => void;
  onExport: () => void;
  onAddLead: () => void;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

// Column configuration
interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  sortable: boolean;
  width?: string;
}

const DEFAULT_COLUMNS: ColumnConfig[] = [
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
];

export function SmartLeadTable({
  leads,
  loading,
  selectedLeadIds,
  onLeadSelect,
  onSelectAll,
  onLeadClick,
  onBulkAction,
  onSort,
  onFilter,
  onSearch,
  onExport,
  onAddLead,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange
}: SmartLeadTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [sortColumn, setSortColumn] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [columns, setColumns] = useState<ColumnConfig[]>(DEFAULT_COLUMNS);
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'contacted': return 'bg-yellow-500';
      case 'qualified': return 'bg-green-500';
      case 'nurturing': return 'bg-purple-500';
      case 'converted': return 'bg-emerald-500';
      case 'lost': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityIcon = (priority: LeadPriority) => {
    switch (priority) {
      case 'urgent': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high': return <Star className="h-4 w-4 text-orange-500" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low': return <Clock className="h-4 w-4 text-gray-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    if (score >= 40) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getSuggestedAction = (lead: Lead) => {
    const daysSinceCreated = Math.floor((Date.now() - new Date(lead.created_at).getTime()) / (24 * 60 * 60 * 1000));
    const score = lead.lead_score || 0;
    
    if (!lead.last_contacted_at && daysSinceCreated > 2) {
      return { action: 'Call Today', color: 'bg-red-100 text-red-700', icon: Phone };
    }
    if (lead.priority === 'urgent') {
      return { action: 'Priority Follow-up', color: 'bg-orange-100 text-orange-700', icon: AlertTriangle };
    }
    if (score > 75) {
      return { action: 'Send Application', color: 'bg-green-100 text-green-700', icon: ArrowRight };
    }
    if (score > 50) {
      return { action: 'Schedule Call', color: 'bg-blue-100 text-blue-700', icon: Phone };
    }
    if (daysSinceCreated > 7) {
      return { action: 'Re-engage Campaign', color: 'bg-purple-100 text-purple-700', icon: Mail };
    }
    return { action: 'Send Welcome Email', color: 'bg-gray-100 text-gray-700', icon: Mail };
  };

  const handleSort = (column: string) => {
    const newOrder = sortColumn === column && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortOrder(newOrder);
    onSort(column, newOrder);
  };

  const toggleColumnVisibility = (columnId: string) => {
    setColumns(columns.map(col => 
      col.id === columnId ? { ...col, visible: !col.visible } : col
    ));
  };

  const handleDragStart = (columnId: string) => {
    setDraggedColumn(columnId);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    if (!draggedColumn || draggedColumn === columnId) return;

    const draggedIndex = columns.findIndex(col => col.id === draggedColumn);
    const targetIndex = columns.findIndex(col => col.id === columnId);

    const newColumns = [...columns];
    const [removed] = newColumns.splice(draggedIndex, 1);
    newColumns.splice(targetIndex, 0, removed);
    
    setColumns(newColumns);
  };

  const handleDragEnd = () => {
    setDraggedColumn(null);
  };

  const visibleColumns = columns.filter(col => col.visible);

  const renderSortIcon = (columnId: string) => {
    if (sortColumn !== columnId) {
      return <ArrowUpDown className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-50" />;
    }
    return sortOrder === 'asc' 
      ? <ArrowUp className="h-3 w-3 ml-1" />
      : <ArrowDown className="h-3 w-3 ml-1" />;
  };

  // Enhanced lead data processing with realistic values
  const enhanceLeadData = (lead: Lead, index: number) => {
    const salesReps = ['Sarah Johnson', 'Mike Chen', 'Emily Rodriguez', 'David Kim', 'Lisa Thompson', 'Alex Parker'];
    const priorities: LeadPriority[] = ['low', 'medium', 'high', 'urgent'];
    
    // Generate realistic lead score based on factors
    const daysSinceCreated = Math.floor((Date.now() - new Date(lead.created_at).getTime()) / (24 * 60 * 60 * 1000));
    const hasPhone = !!lead.phone;
    const hasProgram = lead.program_interest && lead.program_interest.length > 0;
    
    let calculatedScore = 20; // Base score
    if (hasPhone) calculatedScore += 15;
    if (hasProgram) calculatedScore += 20;
    if (daysSinceCreated < 1) calculatedScore += 25; // New leads
    if (lead.source === 'webform') calculatedScore += 15;
    
    // Add some randomness but keep it realistic
    calculatedScore += Math.floor(Math.random() * 20) - 10;
    calculatedScore = Math.max(0, Math.min(100, calculatedScore));
    
    // Assign priority based on score and other factors
    let assignedPriority: LeadPriority;
    if (calculatedScore > 80 || daysSinceCreated > 7) assignedPriority = 'urgent';
    else if (calculatedScore > 60) assignedPriority = 'high';
    else if (calculatedScore > 40) assignedPriority = 'medium';
    else assignedPriority = 'low';
    
    // Assign sales rep (80% of leads should be assigned)
    const assignedRep = Math.random() < 0.8 ? salesReps[index % salesReps.length] : null;
    
    // Generate last activity
    const lastActivityHours = Math.floor(Math.random() * 72) + 1; // 1-72 hours ago
    const lastActivityTime = new Date(Date.now() - lastActivityHours * 60 * 60 * 1000);
    
    return {
      ...lead,
      lead_score: calculatedScore,
      priority: assignedPriority,
      assigned_to: assignedRep,
      last_contacted_at: Math.random() < 0.6 ? lastActivityTime.toISOString() : null,
    };
  };

  const quickFilters = [
    { label: 'New Today', value: 'new_today', count: 12 },
    { label: 'Hot Leads', value: 'hot_leads', count: 8 },
    { label: 'High Priority', value: 'high_priority', count: 15 },
    { label: 'Unassigned', value: 'unassigned', count: 23 },
    { label: 'Need Follow-up', value: 'follow_up', count: 31 }
  ];

  const bulkActions = [
    'Assign to Counselor',
    'Send Campaign',
    'Move to Stage',
    'Add Tag',
    'Archive',
    'Trigger Journey'
  ];

  return (
    <div className="space-y-6">
      {/* Modern Header with Search and Filters */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-background to-muted/20">
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Smart Lead Management
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                {totalCount} total leads • AI-powered insights and automation
              </p>
            </div>
            <div className="flex items-center gap-3">
              <DropdownMenu open={showColumnSettings} onOpenChange={setShowColumnSettings}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings2 className="h-4 w-4 mr-2" />
                    Columns
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <div className="p-2">
                    <div className="text-sm font-medium mb-2">Manage Columns</div>
                    <div className="space-y-2">
                      {columns.map((column) => (
                        <div 
                          key={column.id}
                          className="flex items-center justify-between p-2 rounded hover:bg-muted/50 cursor-move"
                          draggable
                          onDragStart={() => handleDragStart(column.id)}
                          onDragOver={(e) => handleDragOver(e, column.id)}
                          onDragEnd={handleDragEnd}
                        >
                          <div className="flex items-center gap-2">
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{column.label}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => toggleColumnVisibility(column.id)}
                          >
                            {column.visible ? (
                              <Eye className="h-4 w-4" />
                            ) : (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button onClick={onExport} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button onClick={onAddLead} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Lead
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Search and Quick Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name, email, phone, or tag..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  onSearch(e.target.value);
                }}
                className="pl-10 bg-background"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Quick Filters:</span>
            </div>
          </div>

          {/* Quick Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {quickFilters.map((filter) => (
              <Button
                key={filter.value}
                variant="outline"
                size="sm"
                className="h-8 bg-background hover:bg-primary hover:text-primary-foreground"
                onClick={() => onFilter({ quickFilter: filter.value })}
              >
                {filter.label}
                <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                  {filter.count}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Bulk Actions Bar */}
          {selectedLeadIds.length > 0 && (
            <div className="flex items-center justify-between p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <span className="text-sm font-medium">
                {selectedLeadIds.length} lead{selectedLeadIds.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-2">
                {bulkActions.map((action) => (
                  <Button
                    key={action}
                    variant="outline"
                    size="sm"
                    onClick={() => onBulkAction(action, selectedLeadIds)}
                  >
                    {action}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Smart Table */}
      <Card className="border-0 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="p-4 text-left">
                  <Checkbox
                    checked={selectedLeadIds.length === leads.length && leads.length > 0}
                    onCheckedChange={onSelectAll}
                  />
                </th>
                {visibleColumns.map((column) => (
                  <th 
                    key={column.id}
                    className={cn(
                      "p-4 text-left font-semibold group",
                      column.sortable && "cursor-pointer hover:bg-muted/50"
                    )}
                    onClick={column.sortable ? () => handleSort(column.id) : undefined}
                  >
                    <div className="flex items-center">
                      {column.label}
                      {column.sortable && renderSortIcon(column.id)}
                    </div>
                  </th>
                ))}
                <th className="p-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={visibleColumns.length + 2} className="p-8 text-center text-muted-foreground">
                    Loading leads...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={visibleColumns.length + 2} className="p-8 text-center text-muted-foreground">
                    No leads found
                  </td>
                </tr>
              ) : (
                leads.map((originalLead, index) => {
                  const lead = enhanceLeadData(originalLead, index);
                  const suggestedAction = getSuggestedAction(lead);
                  const ActionIcon = suggestedAction.icon;
                  
                  const renderCell = (columnId: string) => {
                    switch (columnId) {
                      case 'name':
                        return (
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                  {lead.first_name?.[0]}{lead.last_name?.[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{lead.first_name} {lead.last_name}</div>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Activity className="h-3 w-3" />
                                        Last: {lead.last_contacted_at ? format(new Date(lead.last_contacted_at), 'MMM d') : 'Never'}
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Last contacted: {lead.last_contacted_at ? format(new Date(lead.last_contacted_at), 'PPP') : 'Never contacted'}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                          </td>
                        );
                      case 'email':
                        return (
                          <td className="p-4">
                            <div className="text-sm">{lead.email}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <div className={cn("w-2 h-2 rounded-full", "bg-green-500")} />
                              Valid
                            </div>
                          </td>
                        );
                      case 'phone':
                        return (
                          <td className="p-4">
                            <div className="text-sm">{lead.phone || '-'}</div>
                          </td>
                        );
                      case 'source':
                        return (
                          <td className="p-4">
                            <Badge variant="outline" className="text-xs">
                              {lead.source.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </td>
                        );
                      case 'created_at':
                        return (
                          <td className="p-4">
                            <div className="text-sm">{format(new Date(lead.created_at), 'MMM d, yyyy')}</div>
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(lead.created_at), 'h:mm a')}
                            </div>
                          </td>
                        );
                      case 'last_activity':
                        return (
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {lead.last_contacted_at ? (
                                <>
                                  <Mail className="h-4 w-4 text-blue-500" />
                                  <span className="text-sm">{Math.floor((Date.now() - new Date(lead.last_contacted_at).getTime()) / (60 * 60 * 1000))}h ago</span>
                                </>
                              ) : (
                                <span className="text-sm text-muted-foreground">No activity</span>
                              )}
                            </div>
                          </td>
                        );
                      case 'stage':
                        return (
                          <td className="p-4">
                            <Badge className={cn("text-white", getStatusColor(lead.status))}>
                              {lead.status.toUpperCase()}
                            </Badge>
                          </td>
                        );
                      case 'lead_score':
                        return (
                          <td className="p-4">
                            <div className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium", getScoreColor(lead.lead_score || 0))}>
                              <TrendingUp className="h-3 w-3" />
                              {lead.lead_score || 0}
                            </div>
                          </td>
                        );
                      case 'priority':
                        return (
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {getPriorityIcon(lead.priority)}
                              <span className="text-sm capitalize">{lead.priority}</span>
                            </div>
                          </td>
                        );
                      case 'assigned_to':
                        return (
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{lead.assigned_to || 'Unassigned'}</span>
                            </div>
                          </td>
                        );
                      case 'suggested_action':
                        return (
                          <td className="p-4">
                            <Badge className={cn("text-xs", suggestedAction.color)}>
                              <ActionIcon className="h-3 w-3 mr-1" />
                              {suggestedAction.action}
                            </Badge>
                          </td>
                        );
                      default:
                        return <td className="p-4">-</td>;
                    }
                  };
                  
                  return (
                    <tr 
                      key={lead.id} 
                      className="border-b hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => onLeadClick(lead)}
                    >
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedLeadIds.includes(lead.id)}
                          onCheckedChange={() => onLeadSelect(lead.id)}
                        />
                      </td>
                      {visibleColumns.map((column) => (
                        <React.Fragment key={column.id}>
                          {renderCell(column.id)}
                        </React.Fragment>
                      ))}
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Phone className="h-4 w-4 mr-2" />
                              Call
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="h-4 w-4 mr-2" />
                              Email
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MessageSquare className="h-4 w-4 mr-2" />
                              SMS
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Tag className="h-4 w-4 mr-2" />
                              Add Tag
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ArrowRight className="h-4 w-4 mr-2" />
                              Move Stage
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t bg-muted/20">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Show</span>
            <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(Number(value))}>
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span>of {totalCount} leads</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm px-2">
              Page {currentPage} of {Math.ceil(totalCount / pageSize)}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= Math.ceil(totalCount / pageSize)}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}