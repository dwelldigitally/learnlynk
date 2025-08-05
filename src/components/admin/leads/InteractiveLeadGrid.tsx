import React, { useState } from 'react';
import { Search, Filter, Plus, Download, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpIcon } from '@/components/ui/help-icon';
import { useHelpContent } from '@/hooks/useHelpContent';
import { LeadCard } from './LeadCard';
import { Lead, LeadStatus, LeadPriority } from '@/types/lead';
import { cn } from '@/lib/utils';

interface InteractiveLeadGridProps {
  leads: Lead[];
  onStatusChange: (leadId: string, newStatus: LeadStatus) => void;
  onViewDetails: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onAddLead: () => void;
  onExport: () => void;
}

export const InteractiveLeadGrid: React.FC<InteractiveLeadGridProps> = ({
  leads,
  onStatusChange,
  onViewDetails,
  onEdit,
  onAddLead,
  onExport
}) => {
  const { getHelpContent } = useHelpContent();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<LeadPriority | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = searchTerm === '' || 
      lead.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPriority = selectedPriority === 'all' || lead.priority === selectedPriority;
    const matchesStatus = selectedStatus === 'all' || lead.status === selectedStatus;
    
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const getStatusCount = (status: LeadStatus) => 
    leads.filter(lead => lead.status === status).length;

  const getPriorityCount = (priority: LeadPriority) => 
    leads.filter(lead => lead.priority === priority).length;

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">Lead Management</h2>
            <HelpIcon content={getHelpContent('leadManagement')} />
          </div>
          <p className="text-muted-foreground">
            Manage and track your leads through their journey
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
          </Button>
          
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button onClick={onAddLead} className="bg-gradient-to-r from-primary to-accent">
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="interactive-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Leads</p>
                <p className="text-2xl font-bold">{leads.length}</p>
              </div>
              <Badge variant="secondary" className="h-8 w-8 rounded-full p-0 flex items-center justify-center">
                {leads.length}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="interactive-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">New</p>
                <p className="text-2xl font-bold text-blue-600">{getStatusCount('new')}</p>
              </div>
              <Badge className="status-badge-new h-8 w-8 rounded-full p-0 flex items-center justify-center">
                {getStatusCount('new')}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="interactive-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Qualified</p>
                <p className="text-2xl font-bold text-green-600">{getStatusCount('qualified')}</p>
              </div>
              <Badge className="status-badge-qualified h-8 w-8 rounded-full p-0 flex items-center justify-center">
                {getStatusCount('qualified')}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="interactive-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold text-orange-600">{getPriorityCount('high') + getPriorityCount('urgent')}</p>
              </div>
              <Badge className="priority-high h-8 w-8 rounded-full p-0 flex items-center justify-center">
                {getPriorityCount('high') + getPriorityCount('urgent')}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search leads by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as LeadStatus | 'all')}
                className="px-3 py-2 border rounded-md bg-background"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="nurturing">Nurturing</option>
                <option value="converted">Converted</option>
                <option value="lost">Lost</option>
              </select>
              
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value as LeadPriority | 'all')}
                className="px-3 py-2 border rounded-md bg-background"
              >
                <option value="all">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          
          {(searchTerm || selectedPriority !== 'all' || selectedStatus !== 'all') && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t">
              <span className="text-sm text-muted-foreground">Filters:</span>
              {searchTerm && (
                <Badge variant="secondary" className="text-xs">
                  Search: {searchTerm}
                </Badge>
              )}
              {selectedStatus !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  Status: {selectedStatus}
                </Badge>
              )}
              {selectedPriority !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  Priority: {selectedPriority}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedStatus('all');
                  setSelectedPriority('all');
                }}
              >
                Clear all
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredLeads.length} of {leads.length} leads
        </p>
      </div>

      {/* Lead grid/list */}
      <div className={cn(
        viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" 
          : "space-y-4"
      )}>
        {filteredLeads.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            onStatusChange={onStatusChange}
            onViewDetails={onViewDetails}
            onEdit={onEdit}
          />
        ))}
      </div>

      {filteredLeads.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-muted-foreground">
              <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No leads found</h3>
              <p>Try adjusting your filters or search terms</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};