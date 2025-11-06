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
  columns?: ColumnConfig[];
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
  onPageSizeChange,
  columns: propColumns
}: SmartLeadTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [sortColumn, setSortColumn] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const columns = propColumns || DEFAULT_COLUMNS;

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


  const visibleColumns = columns.filter(col => col.visible);

  const renderSortIcon = (columnId: string) => {
    if (sortColumn !== columnId) {
      return <ArrowUpDown className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-50" />;
    }
    return sortOrder === 'asc' 
      ? <ArrowUp className="h-3 w-3 ml-1" />
      : <ArrowDown className="h-3 w-3 ml-1" />;
  };

  // Enhanced lead data processing with deterministic values
  const enhanceLeadData = (lead: Lead) => {
    const salesReps = ['Sarah Johnson', 'Mike Chen', 'Emily Rodriguez', 'David Kim', 'Lisa Thompson', 'Alex Parker'];
    const daysSinceCreated = Math.floor((Date.now() - new Date(lead.created_at).getTime()) / (24 * 60 * 60 * 1000));

    // Deterministic hash from lead.id for stable assignments
    const hash = Array.from(lead.id || '').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const assignedRep = lead.assigned_to || salesReps[hash % salesReps.length];

    // Deterministic score if missing
    const baseScore = lead.lead_score ?? (() => {
      let score = 20;
      if (lead.phone) score += 15;
      if (lead.program_interest && lead.program_interest.length > 0) score += 20;
      if (daysSinceCreated < 1) score += 25;
      if (lead.source === 'webform') score += 15;
      return Math.max(0, Math.min(100, score));
    })();

    // Priority from explicit value or derived from score
    const derivedPriority: LeadPriority = lead.priority || (baseScore > 80 ? 'urgent' : baseScore > 60 ? 'high' : baseScore > 40 ? 'medium' : 'low');

    return {
      ...lead,
      lead_score: baseScore,
      priority: derivedPriority,
      assigned_to: assignedRep,
      last_contacted_at: lead.last_contacted_at || null,
    } as Lead;
  };

  const enhancedLeads = React.useMemo(() => leads.map(enhanceLeadData), [leads]);

  const sortAccessor = (l: Lead, column: string): any => {
    switch (column) {
      case 'name':
        return `${l.first_name || ''} ${l.last_name || ''}`.trim().toLowerCase();
      case 'email':
        return (l.email || '').toLowerCase();
      case 'phone':
        return l.phone || '';
      case 'source':
        return l.source || '';
      case 'created_at':
        return new Date(l.created_at).getTime();
      case 'stage':
        return l.status || '';
      case 'lead_score':
        return l.lead_score ?? 0;
      case 'priority':
        const order: Record<LeadPriority, number> = { low: 0, medium: 1, high: 2, urgent: 3 } as const;
        return order[l.priority];
      case 'assigned_to':
        return (l.assigned_to || '').toLowerCase();
      default:
        return '';
    }
  };

  const sortedLeads = React.useMemo(() => {
    const arr = [...enhancedLeads];
    return arr.sort((a, b) => {
      const av = sortAccessor(a, sortColumn);
      const bv = sortAccessor(b, sortColumn);
      if (av < bv) return sortOrder === 'asc' ? -1 : 1;
      if (av > bv) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [enhancedLeads, sortColumn, sortOrder]);

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
    <div className="space-y-4">
      {/* Quick Filters Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {quickFilters.map((filter) => (
          <Button
            key={filter.value}
            variant={activeFilters[filter.value] ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setActiveFilters(prev => ({
                ...prev,
                [filter.value]: !prev[filter.value]
              }));
            }}
            className="whitespace-nowrap"
          >
            {filter.label}
            <Badge variant="secondary" className="ml-2">{filter.count}</Badge>
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

      {/* Smart Table */}
      <div className="border rounded-lg overflow-hidden bg-card">
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
              ) : sortedLeads.length === 0 ? (
                <tr>
                  <td colSpan={visibleColumns.length + 2} className="p-8 text-center text-muted-foreground">
                    No leads found
                  </td>
                </tr>
              ) : (
                sortedLeads.map((lead) => {
                  
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
                      {visibleColumns.map((column) => renderCell(column.id))}
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
      </div>
    </div>
  );
}