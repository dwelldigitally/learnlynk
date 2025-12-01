import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HotSheetCard, PastelBadge, PillButton, IconContainer } from '@/components/hotsheet';
import { getLeadStatusColor } from '@/components/hotsheet/utils';
import { supabase } from '@/integrations/supabase/client';
import { 
  Search, 
  Users, 
  Mail, 
  CheckCircle2, 
  XCircle,
  Filter,
  ChevronDown,
  Loader2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface SelectedLead {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  program_interest?: string[];
  status?: string;
}

interface BulkLeadSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (leads: SelectedLead[]) => void;
  initialSelected?: SelectedLead[];
}

interface LeadData {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  program_interest: string[] | null;
  status: string | null;
}

const STATUS_OPTIONS = ['new', 'contacted', 'qualified', 'nurturing', 'unqualified', 'converted', 'lost'] as const;
type LeadStatus = typeof STATUS_OPTIONS[number];

export function BulkLeadSelector({ 
  open, 
  onOpenChange, 
  onConfirm,
  initialSelected = []
}: BulkLeadSelectorProps) {
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(initialSelected.map(l => l.id)));
  const [statusFilter, setStatusFilter] = useState<LeadStatus[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 50;

  useEffect(() => {
    if (open) {
      setSelectedIds(new Set(initialSelected.map(l => l.id)));
      loadLeads(true);
    }
  }, [open]);

  const loadLeads = async (reset = false) => {
    setLoading(true);
    try {
      const currentPage = reset ? 0 : page;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let query = supabase
        .from('leads')
        .select('id, email, first_name, last_name, phone, program_interest, status')
        .eq('user_id', user.id)
        .not('email', 'is', null)
        .order('created_at', { ascending: false })
        .range(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE - 1);

      if (statusFilter.length > 0) {
        query = query.in('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;

      const leadsData = (data || []) as LeadData[];
      if (reset) {
        setLeads(leadsData);
        setPage(0);
      } else {
        setLeads(prev => [...prev, ...leadsData]);
      }
      
      setHasMore((data?.length || 0) === PAGE_SIZE);
    } catch (error) {
      console.error('Error loading leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
      loadLeads(false);
    }
  };

  useEffect(() => {
    if (statusFilter.length >= 0 && open) {
      loadLeads(true);
    }
  }, [statusFilter]);

  const filteredLeads = useMemo(() => {
    if (!searchQuery) return leads;
    const query = searchQuery.toLowerCase();
      return leads.filter(lead => 
      lead.email?.toLowerCase().includes(query) ||
      lead.first_name?.toLowerCase().includes(query) ||
      lead.last_name?.toLowerCase().includes(query)
    );
  }, [leads, searchQuery]);

  const handleSelectAll = () => {
    if (selectedIds.size === filteredLeads.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredLeads.map(l => l.id)));
    }
  };

  const handleToggleLead = (leadId: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(leadId)) {
      newSelected.delete(leadId);
    } else {
      newSelected.add(leadId);
    }
    setSelectedIds(newSelected);
  };

  const handleConfirm = () => {
    const selectedLeads: SelectedLead[] = leads
      .filter(l => selectedIds.has(l.id))
      .map(l => ({
        id: l.id,
        email: l.email,
        first_name: l.first_name || undefined,
        last_name: l.last_name || undefined,
        phone: l.phone || undefined,
        program_interest: l.program_interest || undefined,
        status: l.status || undefined,
      }));
    onConfirm(selectedLeads);
    onOpenChange(false);
  };

  const isAllSelected = filteredLeads.length > 0 && selectedIds.size === filteredLeads.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col bg-background border border-border/40">
        <DialogHeader className="border-b border-border/30 pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <IconContainer color="primary" size="sm">
              <Users className="w-4 h-4" />
            </IconContainer>
            Select Recipients
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4 py-4">
          {/* Search and Filters */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-border/40 rounded-xl"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <PillButton variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Status
                  {statusFilter.length > 0 && (
                    <PastelBadge color="primary" size="sm">{statusFilter.length}</PastelBadge>
                  )}
                  <ChevronDown className="w-4 h-4" />
                </PillButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {STATUS_OPTIONS.map(status => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={statusFilter.includes(status)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setStatusFilter(prev => [...prev, status] as LeadStatus[]);
                      } else {
                        setStatusFilter(prev => prev.filter(s => s !== status));
                      }
                    }}
                  >
                    <span className="capitalize">{status}</span>
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Selection Summary */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
                id="select-all"
              />
              <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                Select all ({filteredLeads.length})
              </label>
            </div>
            <PastelBadge color={selectedIds.size > 0 ? 'emerald' : 'slate'} size="sm">
              {selectedIds.size} selected
            </PastelBadge>
          </div>

          {/* Lead List */}
          <ScrollArea className="flex-1 -mx-4 px-4">
            {loading && leads.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : filteredLeads.length === 0 ? (
              <HotSheetCard padding="lg" className="text-center py-12">
                <IconContainer color="slate" size="lg" className="mx-auto mb-4">
                  <Users className="w-6 h-6" />
                </IconContainer>
                <p className="text-muted-foreground">No leads found matching your criteria</p>
              </HotSheetCard>
            ) : (
              <div className="space-y-2">
                {filteredLeads.map(lead => (
                  <HotSheetCard
                    key={lead.id}
                    hover
                    padding="sm"
                    className={`cursor-pointer transition-all ${
                      selectedIds.has(lead.id) ? 'ring-2 ring-primary/50 bg-primary/5' : ''
                    }`}
                    onClick={() => handleToggleLead(lead.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedIds.has(lead.id)}
                        onCheckedChange={() => handleToggleLead(lead.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-xs flex-shrink-0">
                        {(lead.first_name?.[0] || lead.email[0]).toUpperCase()}
                        {(lead.last_name?.[0] || '').toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {lead.first_name || lead.last_name 
                            ? `${lead.first_name || ''} ${lead.last_name || ''}`.trim()
                            : 'Unnamed'}
                        </p>
                        <p className="text-sm text-muted-foreground truncate flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {lead.email}
                        </p>
                      </div>
                      {lead.status && (
                        <PastelBadge color={getLeadStatusColor(lead.status)} size="sm">
                          {lead.status}
                        </PastelBadge>
                      )}
                      {selectedIds.has(lead.id) && (
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      )}
                    </div>
                  </HotSheetCard>
                ))}
                
                {hasMore && (
                  <PillButton
                    variant="ghost"
                    className="w-full mt-2"
                    onClick={loadMore}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Load more
                  </PillButton>
                )}
              </div>
            )}
          </ScrollArea>
        </div>

        <DialogFooter className="border-t border-border/30 pt-4">
          <PillButton variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </PillButton>
          <PillButton 
            variant="primary" 
            onClick={handleConfirm}
            disabled={selectedIds.size === 0}
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Confirm {selectedIds.size} Recipients
          </PillButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
