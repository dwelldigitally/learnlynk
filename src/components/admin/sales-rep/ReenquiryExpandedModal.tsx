import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Search, Phone, Mail, Eye, PhoneCall, Calendar, 
  ChevronLeft, ChevronRight, ArrowUpDown, X, Filter 
} from 'lucide-react';
import { LeadService } from '@/services/leadService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Lead } from '@/types/lead';
import { format, formatDistanceToNow } from 'date-fns';

interface ReenquiryExpandedModalProps {
  open: boolean;
  onClose: () => void;
}

interface FilterState {
  search: string;
  dateFrom: string;
  dateTo: string;
  program: string;
  status: string;
}

export function ReenquiryExpandedModal({ open, onClose }: ReenquiryExpandedModalProps) {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    dateFrom: '',
    dateTo: '',
    program: '',
    status: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<string>('last_reenquiry_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [addingToCallList, setAddingToCallList] = useState(false);
  const pageSize = 20;

  useEffect(() => {
    if (open) {
      loadReenquiryLeads();
    }
  }, [open, filters.dateFrom, filters.dateTo, filters.program, filters.status]);

  const loadReenquiryLeads = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: tenantUser } = await supabase
        .from('tenant_users')
        .select('tenant_id')
        .eq('user_id', user.id)
        .eq('is_primary', true)
        .single();

      const { data, error } = await LeadService.getReenquiryStudents(
        user.id,
        tenantUser?.tenant_id,
        {
          dateFrom: filters.dateFrom || undefined,
          dateTo: filters.dateTo || undefined,
          program: filters.program || undefined,
          status: filters.status || undefined,
        }
      );

      if (error) {
        console.error('Failed to load re-enquiry leads:', error);
        return;
      }

      setLeads(data || []);
    } catch (error) {
      console.error('Error loading re-enquiry leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter(lead => {
    if (!filters.search) return true;
    const searchLower = filters.search.toLowerCase();
    return (
      `${lead.first_name} ${lead.last_name}`.toLowerCase().includes(searchLower) ||
      lead.email.toLowerCase().includes(searchLower) ||
      lead.phone?.toLowerCase().includes(searchLower)
    );
  });

  const sortedLeads = [...filteredLeads].sort((a, b) => {
    const aVal = (a as any)[sortField];
    const bVal = (b as any)[sortField];
    if (!aVal && !bVal) return 0;
    if (!aVal) return sortDir === 'asc' ? 1 : -1;
    if (!bVal) return sortDir === 'asc' ? -1 : 1;
    
    if (sortDir === 'asc') {
      return aVal > bVal ? 1 : -1;
    }
    return aVal < bVal ? 1 : -1;
  });

  const paginatedLeads = sortedLeads.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(sortedLeads.length / pageSize);

  const toggleSelectAll = () => {
    if (selectedLeads.size === paginatedLeads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(paginatedLeads.map(l => l.id)));
    }
  };

  const toggleSelect = (leadId: string) => {
    const newSelected = new Set(selectedLeads);
    if (newSelected.has(leadId)) {
      newSelected.delete(leadId);
    } else {
      newSelected.add(leadId);
    }
    setSelectedLeads(newSelected);
  };

  const handleAddToCallList = async () => {
    if (selectedLeads.size === 0) {
      toast.error('Please select at least one lead');
      return;
    }

    try {
      setAddingToCallList(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: tenantUser } = await supabase
        .from('tenant_users')
        .select('tenant_id')
        .eq('user_id', user.id)
        .eq('is_primary', true)
        .single();

      const result = await LeadService.addToCallList(
        Array.from(selectedLeads),
        user.id,
        tenantUser?.tenant_id
      );

      if (result.success > 0) {
        toast.success(`Added ${result.success} lead(s) to call list`);
        setSelectedLeads(new Set());
      }
      if (result.failed > 0) {
        toast.error(`Failed to add ${result.failed} lead(s)`);
      }
    } catch (error) {
      console.error('Error adding to call list:', error);
      toast.error('Failed to add leads to call list');
    } finally {
      setAddingToCallList(false);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const getReenquiryType = (lead: Lead) => {
    const tags = lead.tags || [];
    if (tags.includes('reenquiry')) return 'Re-enquiry';
    if (tags.includes('upsell')) return 'Upsell';
    if (tags.includes('program_change')) return 'Program Change';
    if (tags.includes('alumni_referral')) return 'Alumni Referral';
    if (tags.includes('dormant') || tags.includes('reactivation')) return 'Reactivation';
    return 'Re-enquiry';
  };

  const getTypeBadgeStyle = (type: string) => {
    switch (type) {
      case 'Upsell': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'Program Change': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'Reactivation': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'Alumni Referral': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      default: return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Re-enquiry Leads ({filteredLeads.length})</span>
            <div className="flex items-center gap-2">
              {selectedLeads.size > 0 && (
                <Button 
                  size="sm" 
                  onClick={handleAddToCallList}
                  disabled={addingToCallList}
                  className="gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  Add {selectedLeads.size} to Call List
                </Button>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 py-3 border-b">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, phone..."
              value={filters.search}
              onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
              className="pl-9"
            />
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(showFilters && "bg-muted")}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-3 py-3 border-b bg-muted/30 px-3 -mx-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">From:</span>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters(f => ({ ...f, dateFrom: e.target.value }))}
                className="w-auto"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">To:</span>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters(f => ({ ...f, dateTo: e.target.value }))}
                className="w-auto"
              />
            </div>
            <Select value={filters.status} onValueChange={(v) => setFilters(f => ({ ...f, status: v }))}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setFilters({ search: '', dateFrom: '', dateTo: '', program: '', status: '' })}
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          </div>
        )}

        {/* Table */}
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="space-y-3 py-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse bg-muted rounded-lg h-16"></div>
              ))}
            </div>
          ) : paginatedLeads.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No re-enquiry leads found matching your criteria
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-muted/50 sticky top-0">
                <tr className="border-b">
                  <th className="px-3 py-2 text-left">
                    <Checkbox
                      checked={selectedLeads.size === paginatedLeads.length && paginatedLeads.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                    Lead
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                    Type
                  </th>
                  <th 
                    className="px-3 py-2 text-left text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => handleSort('reenquiry_count')}
                  >
                    <span className="flex items-center gap-1">
                      Re-enquiries
                      <ArrowUpDown className="w-3 h-3" />
                    </span>
                  </th>
                  <th 
                    className="px-3 py-2 text-left text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground"
                    onClick={() => handleSort('last_reenquiry_at')}
                  >
                    <span className="flex items-center gap-1">
                      Last Re-enquiry
                      <ArrowUpDown className="w-3 h-3" />
                    </span>
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                    Programs
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedLeads.map((lead) => {
                  const type = getReenquiryType(lead);
                  return (
                    <tr 
                      key={lead.id} 
                      className={cn(
                        "hover:bg-muted/30 transition-colors",
                        selectedLeads.has(lead.id) && "bg-primary/5"
                      )}
                    >
                      <td className="px-3 py-3">
                        <Checkbox
                          checked={selectedLeads.has(lead.id)}
                          onCheckedChange={() => toggleSelect(lead.id)}
                        />
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {lead.first_name[0]}{lead.last_name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{lead.first_name} {lead.last_name}</p>
                            <p className="text-xs text-muted-foreground">{lead.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <Badge variant="outline" className={cn("text-xs", getTypeBadgeStyle(type))}>
                          {type}
                        </Badge>
                      </td>
                      <td className="px-3 py-3">
                        <span className="text-sm font-medium">
                          {(lead as any).reenquiry_count || 1}x
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className="text-sm text-muted-foreground">
                          {(lead as any).last_reenquiry_at 
                            ? formatDistanceToNow(new Date((lead as any).last_reenquiry_at), { addSuffix: true })
                            : lead.updated_at 
                              ? formatDistanceToNow(new Date(lead.updated_at), { addSuffix: true })
                              : 'N/A'
                          }
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-1">
                          {(lead.program_interest || []).slice(0, 2).map((prog, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {prog}
                            </Badge>
                          ))}
                          {(lead.program_interest || []).length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{(lead.program_interest || []).length - 2}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <Badge variant="outline" className="text-xs capitalize">
                          {lead.status}
                        </Badge>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {lead.phone && (
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="h-7 w-7 p-0"
                              onClick={() => window.open(`tel:${lead.phone}`, '_self')}
                              title="Call"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={() => window.open(`mailto:${lead.email}`, '_blank')}
                            title="Email"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={() => {
                              onClose();
                              navigate(`/admin/leads/detail/${lead.id}`);
                            }}
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-3 border-t">
            <span className="text-sm text-muted-foreground">
              Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, sortedLeads.length)} of {sortedLeads.length}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
