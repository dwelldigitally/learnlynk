import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
  GripVertical,
  UserPlus,
  Send,
  MoveHorizontal,
  Archive,
  Zap,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { Lead, LeadStatus, LeadPriority } from '@/types/lead';
import { cn } from '@/lib/utils';
import { MobileLeadCard } from './MobileLeadCard';

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
  minWidth?: number;
  maxWidth?: number;
}

// Advisor name cache type
interface AdvisorInfo {
  name: string;
  email: string;
}

const DEFAULT_COLUMNS: ColumnConfig[] = [
  { id: 'name', label: 'Name', visible: true, sortable: true, minWidth: 140, maxWidth: 220 },
  { id: 'email', label: 'Email', visible: true, sortable: true, minWidth: 160, maxWidth: 260 },
  { id: 'phone', label: 'Phone', visible: true, sortable: false, minWidth: 100, maxWidth: 160 },
  { id: 'source', label: 'Source', visible: true, sortable: true, minWidth: 80, maxWidth: 130 },
  { id: 'created_at', label: 'Created', visible: true, sortable: true, minWidth: 100, maxWidth: 160 },
  { id: 'last_activity', label: 'Last Activity', visible: true, sortable: false, minWidth: 100, maxWidth: 160 },
  { id: 'stage', label: 'Stage', visible: true, sortable: true, minWidth: 80, maxWidth: 130 },
  { id: 'lead_score', label: 'Lead Score', visible: true, sortable: true, minWidth: 90, maxWidth: 130 },
  { id: 'priority', label: 'Priority', visible: true, sortable: true, minWidth: 80, maxWidth: 120 },
  { id: 'assigned_to', label: 'Assigned To', visible: true, sortable: false, minWidth: 120, maxWidth: 200 },
  { id: 'suggested_action', label: 'Suggested Action', visible: true, sortable: false, minWidth: 130, maxWidth: 200 },
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
  const [advisorMap, setAdvisorMap] = useState<Record<string, AdvisorInfo>>({});
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(() => {
    const widths: Record<string, number> = {};
    DEFAULT_COLUMNS.forEach(col => {
      const min = col.minWidth || 80;
      const max = col.maxWidth || 200;
      widths[col.id] = min + Math.floor((max - min) / 2);
    });
    return widths;
  });
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  
  const columns = propColumns || DEFAULT_COLUMNS;

  // Get column width with defaults
  const getColumnWidth = (columnId: string) => {
    if (columnWidths[columnId]) return columnWidths[columnId];
    const col = columns.find(c => c.id === columnId);
    const min = col?.minWidth || 80;
    const max = col?.maxWidth || 200;
    return min + Math.floor((max - min) / 2);
  };

  // Handle column resize
  const handleMouseDown = (columnId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setResizingColumn(columnId);
    
    const startX = e.clientX;
    const startWidth = getColumnWidth(columnId);
    const column = columns.find(c => c.id === columnId);
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      const newWidth = Math.max(
        column?.minWidth || 80,
        Math.min(column?.maxWidth || 300, startWidth + delta)
      );
      setColumnWidths(prev => ({ ...prev, [columnId]: newWidth }));
    };
    
    const handleMouseUp = () => {
      setResizingColumn(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Fetch advisor names for assigned leads
  useEffect(() => {
    const fetchAdvisors = async () => {
      const assignedIds = leads
        .map(l => l.assigned_to)
        .filter((id): id is string => !!id && !advisorMap[id]);
      
      if (assignedIds.length === 0) return;
      
      const uniqueIds = [...new Set(assignedIds)];
      
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name, email')
        .in('user_id', uniqueIds);
      
      if (profiles) {
        const newMap = { ...advisorMap };
        profiles.forEach(p => {
          const fullName = [p.first_name, p.last_name].filter(Boolean).join(' ') || 'Unknown';
          newMap[p.user_id] = { name: fullName, email: p.email || '' };
        });
        setAdvisorMap(newMap);
      }
    };
    
    fetchAdvisors();
  }, [leads]);

  // Helper to get advisor name
  const getAdvisorName = (userId: string | undefined) => {
    if (!userId) return 'Unassigned';
    return advisorMap[userId]?.name || 'Loading...';
  };

  // HotSheet pastel status colors
  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case 'new': return 'bg-sky-100 text-sky-700 border-sky-200';
      case 'contacted': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'qualified': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'nurturing': return 'bg-violet-100 text-violet-700 border-violet-200';
      case 'converted': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'lost': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  // Softer priority icons
  const getPriorityIcon = (priority: LeadPriority) => {
    switch (priority) {
      case 'urgent': return <AlertTriangle className="h-4 w-4 text-rose-400" />;
      case 'high': return <Star className="h-4 w-4 text-amber-400" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'low': return <Clock className="h-4 w-4 text-muted-foreground/60" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground/60" />;
    }
  };

  // HotSheet pastel score colors
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (score >= 60) return 'text-amber-600 bg-amber-50 border-amber-100';
    if (score >= 40) return 'text-orange-600 bg-orange-50 border-orange-100';
    return 'text-rose-600 bg-rose-50 border-rose-100';
  };

  // Pastel suggested action colors
  const getSuggestedAction = (lead: Lead) => {
    const daysSinceCreated = Math.floor((Date.now() - new Date(lead.created_at).getTime()) / (24 * 60 * 60 * 1000));
    const score = lead.lead_score || 0;
    
    if (!lead.last_contacted_at && daysSinceCreated > 2) {
      return { action: 'Call Today', color: 'bg-rose-50 text-rose-600 border-rose-100', icon: Phone };
    }
    if (lead.priority === 'urgent') {
      return { action: 'Priority Follow-up', color: 'bg-amber-50 text-amber-600 border-amber-100', icon: AlertTriangle };
    }
    if (score > 75) {
      return { action: 'Send Application', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: ArrowRight };
    }
    if (score > 50) {
      return { action: 'Schedule Call', color: 'bg-sky-50 text-sky-600 border-sky-100', icon: Phone };
    }
    if (daysSinceCreated > 7) {
      return { action: 'Re-engage Campaign', color: 'bg-violet-50 text-violet-600 border-violet-100', icon: Mail };
    }
    return { action: 'Send Welcome Email', color: 'bg-muted text-muted-foreground border-border', icon: Mail };
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
    { label: 'Assign', icon: UserPlus, action: 'Assign to Counselor', variant: 'default' as const },
    { label: 'Send Email', icon: Send, action: 'Send Campaign', variant: 'default' as const },
    { label: 'Move Stage', icon: MoveHorizontal, action: 'Move to Stage', variant: 'outline' as const },
    { label: 'Add Tag', icon: Tag, action: 'Add Tag', variant: 'outline' as const },
    { label: 'Archive', icon: Archive, action: 'Archive', variant: 'outline' as const },
  ];

  return (
    <div className="space-y-4">

      {/* Bulk Actions Bar - HotSheet Style */}
      {selectedLeadIds.length > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-primary/5 border-2 border-primary/20 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-200 gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="bg-primary text-primary-foreground rounded-full h-9 w-9 flex items-center justify-center font-semibold text-sm flex-shrink-0">
              {selectedLeadIds.length}
            </div>
            <span className="text-sm font-medium text-foreground">
              {selectedLeadIds.length} lead{selectedLeadIds.length > 1 ? 's' : ''} selected
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSelectAll(false)}
              className="h-8 px-3 hover:bg-destructive/10 hover:text-destructive ml-auto sm:ml-0 rounded-full"
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Clear
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {bulkActions.map((bulkAction) => {
              const Icon = bulkAction.icon;
              return (
                <Button
                  key={bulkAction.action}
                  variant={bulkAction.variant}
                  size="sm"
                  onClick={() => onBulkAction(bulkAction.action, selectedLeadIds)}
                  className={cn(
                    "gap-2 flex-1 sm:flex-initial min-h-[44px] rounded-full transition-all",
                    bulkAction.variant === 'outline' && "border-border/60 hover:bg-muted/50 hover:border-primary/30"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{bulkAction.label}</span>
                </Button>
              );
            })}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="min-h-[44px] rounded-full border-border/60 hover:bg-muted/50">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover z-50 rounded-xl border-border/60">
                <DropdownMenuItem onClick={() => onBulkAction('Trigger Journey', selectedLeadIds)} className="rounded-lg">
                  <Zap className="h-4 w-4 mr-2" />
                  Trigger Journey
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onBulkAction('Delete Selected', selectedLeadIds)} className="text-destructive rounded-lg">
                  <X className="h-4 w-4 mr-2" />
                  Delete Selected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      {/* Desktop Table - HotSheet Style */}
      <div className={cn("hidden md:block overflow-hidden", resizingColumn && "select-none")}>
        <div className="overflow-x-auto">
          <table className="w-full" style={{ tableLayout: 'fixed' }}>
            <thead>
              <tr className="border-b border-border/40 bg-muted/20">
                <th className="py-2.5 px-4 text-left" style={{ width: 48 }}>
                  <Checkbox
                    checked={selectedLeadIds.length === leads.length && leads.length > 0}
                    onCheckedChange={onSelectAll}
                    className="rounded-md"
                  />
                </th>
                {visibleColumns.map((column) => (
                  <th 
                    key={column.id}
                    className={cn(
                      "py-2.5 px-4 text-left font-medium text-muted-foreground text-xs group relative",
                      column.sortable && "cursor-pointer hover:text-foreground transition-colors"
                    )}
                    style={{ width: getColumnWidth(column.id) }}
                    onClick={column.sortable ? () => handleSort(column.id) : undefined}
                  >
                    <div className="flex items-center truncate pr-2">
                      {column.label}
                      {column.sortable && renderSortIcon(column.id)}
                    </div>
                    {/* Resize handle */}
                    <div
                      className={cn(
                        "absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/50 transition-colors",
                        resizingColumn === column.id && "bg-primary"
                      )}
                      onMouseDown={(e) => handleMouseDown(column.id, e)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </th>
                ))}
                <th className="py-2.5 px-4 text-left font-medium text-muted-foreground text-xs" style={{ width: 60 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={visibleColumns.length + 2} className="p-12 text-center text-muted-foreground">
                    Loading leads...
                  </td>
                </tr>
              ) : sortedLeads.length === 0 ? (
                <tr>
                  <td colSpan={visibleColumns.length + 2} className="p-12 text-center text-muted-foreground">
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
                          <td className="py-2.5 px-4">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-7 w-7 border border-border/40">
                                <AvatarFallback className="bg-muted/50 text-xs">
                                  {lead.first_name?.[0]}{lead.last_name?.[0]}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-sm text-foreground truncate">{lead.first_name} {lead.last_name}</span>
                            </div>
                          </td>
                        );
                      case 'email':
                        return (
                          <td className="py-2.5 px-4">
                            <div className="flex items-center gap-1.5 text-sm text-foreground truncate">
                              <span className="truncate">{lead.email}</span>
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                            </div>
                          </td>
                        );
                      case 'phone':
                        return (
                          <td className="py-2.5 px-4">
                            <span className="text-sm text-foreground">{lead.phone || '-'}</span>
                          </td>
                        );
                      case 'source':
                        return (
                          <td className="py-2.5 px-4">
                            <Badge variant="outline" className="text-xs rounded-full px-2 py-0.5 border-border/60 bg-muted/30">
                              {lead.source.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </td>
                        );
                      case 'created_at':
                        return (
                          <td className="py-2.5 px-4">
                            <span className="text-sm text-foreground">{format(new Date(lead.created_at), 'MMM d')} · {format(new Date(lead.created_at), 'h:mm a')}</span>
                          </td>
                        );
                      case 'last_activity':
                        return (
                          <td className="py-2.5 px-4">
                            <div className="flex items-center gap-1.5">
                              {lead.last_contacted_at ? (
                                <>
                                  <Mail className="h-3.5 w-3.5 text-sky-400" />
                                  <span className="text-sm text-foreground">{Math.floor((Date.now() - new Date(lead.last_contacted_at).getTime()) / (60 * 60 * 1000))}h ago</span>
                                </>
                              ) : (
                                <span className="text-sm text-muted-foreground">—</span>
                              )}
                            </div>
                          </td>
                        );
                      case 'stage':
                        return (
                          <td className="py-2.5 px-4">
                            <Badge className={cn("rounded-full px-2 py-0.5 text-xs font-medium border", getStatusColor(lead.status))}>
                              {lead.status.toUpperCase()}
                            </Badge>
                          </td>
                        );
                      case 'lead_score':
                        return (
                          <td className="py-2.5 px-4">
                            <div className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border", getScoreColor(lead.lead_score || 0))}>
                              <TrendingUp className="h-3 w-3" />
                              {lead.lead_score || 0}
                            </div>
                          </td>
                        );
                      case 'priority':
                        return (
                          <td className="py-2.5 px-4">
                            <div className="flex items-center gap-1.5">
                              {getPriorityIcon(lead.priority)}
                              <span className="text-sm capitalize text-foreground">{lead.priority}</span>
                            </div>
                          </td>
                        );
                      case 'assigned_to':
                        return (
                          <td className="py-2.5 px-4">
                            <div className="flex items-center gap-1.5">
                              <User className="h-3.5 w-3.5 text-muted-foreground/60" />
                              <span className="text-sm text-foreground truncate">{getAdvisorName(lead.assigned_to)}</span>
                            </div>
                          </td>
                        );
                      case 'suggested_action':
                        return (
                          <td className="py-2.5 px-4">
                            <Badge className={cn("text-xs rounded-full px-2 py-0.5 font-medium border", suggestedAction.color)}>
                              <ActionIcon className="h-3 w-3 mr-1" />
                              {suggestedAction.action}
                            </Badge>
                          </td>
                        );
                      default:
                        return <td className="py-2.5 px-4">-</td>;
                    }
                  };
                  
                  return (
                    <tr 
                      key={lead.id} 
                      className="border-b border-border/30 hover:bg-muted/10 transition-colors cursor-pointer"
                      onClick={() => onLeadClick(lead)}
                    >
                      <td className="py-2.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedLeadIds.includes(lead.id)}
                          onCheckedChange={() => onLeadSelect(lead.id)}
                          className="rounded-md"
                        />
                      </td>
                      {visibleColumns.map((column) => renderCell(column.id))}
                      <td className="py-2.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="rounded-full h-7 w-7 p-0 hover:bg-muted/50">
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl border-border/60">
                            <DropdownMenuItem className="rounded-lg">
                              <Phone className="h-4 w-4 mr-2" />
                              Call
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-lg">
                              <Mail className="h-4 w-4 mr-2" />
                              Email
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-lg">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              SMS
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-lg">
                              <Tag className="h-4 w-4 mr-2" />
                              Add Tag
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-lg">
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

        {/* Pagination - HotSheet Style */}
        <div className="flex items-center justify-between p-5 border-t border-border/40 bg-muted/10">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>Show</span>
            <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(Number(value))}>
              <SelectTrigger className="w-20 h-9 rounded-xl border-border/60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
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
              className="rounded-full border-border/60 hover:bg-muted/50"
            >
              Previous
            </Button>
            <span className="text-sm px-3 text-foreground">
              Page {currentPage} of {Math.ceil(totalCount / pageSize)}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= Math.ceil(totalCount / pageSize)}
              className="rounded-full border-border/60 hover:bg-muted/50"
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Cards - HotSheet Style */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading leads...
          </div>
        ) : sortedLeads.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No leads found
          </div>
        ) : (
          sortedLeads.map((lead) => (
            <MobileLeadCard
              key={lead.id}
              lead={lead}
              selected={selectedLeadIds.includes(lead.id)}
              onSelect={onLeadSelect}
              onClick={onLeadClick}
            />
          ))
        )}
      </div>

      {/* Mobile Pagination - HotSheet Style */}
      <div className="md:hidden flex flex-col gap-4 p-5 border border-border/40 rounded-2xl bg-card mt-4">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span>Page {currentPage} of {Math.ceil(totalCount / pageSize)}</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 rounded-full border-border/60"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            className="flex-1 rounded-full border-border/60"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= Math.ceil(totalCount / pageSize)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
