import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { 
  Search, Users, RefreshCw, CheckCircle2, AlertCircle,
  Filter
} from 'lucide-react';
import { HotSheetCard } from '@/components/hotsheet/HotSheetCard';
import { PastelBadge } from '@/components/hotsheet/PastelBadge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { AutomationService, type Automation } from '@/services/automationService';
import { useToast } from '@/hooks/use-toast';

interface AutomationReEnrollModalProps {
  automation: Automation | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
}

export function AutomationReEnrollModal({ 
  automation, 
  open, 
  onClose,
  onSuccess 
}: AutomationReEnrollModalProps) {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [removeExisting, setRemoveExisting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (open) {
      loadLeads();
      setSelectedLeads([]);
      setProgress(0);
    }
  }, [open]);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('leads')
        .select('id, first_name, last_name, email, status')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(500);

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error loading leads:', error);
      toast({
        title: "Error",
        description: "Failed to load leads",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = searchTerm === '' || 
      `${lead.first_name} ${lead.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const toggleLead = (leadId: string) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const toggleAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(l => l.id));
    }
  };

  const handleEnroll = async () => {
    if (!automation || selectedLeads.length === 0) return;

    setEnrolling(true);
    setProgress(0);

    try {
      const result = await AutomationService.reEnrollLeads(
        automation.id,
        selectedLeads,
        { removeExisting }
      );

      setProgress(100);

      toast({
        title: "Re-enrollment Complete",
        description: `Successfully enrolled ${result.success} leads. ${result.failed > 0 ? `${result.failed} failed.` : ''}`,
        variant: result.failed > 0 ? "default" : "default"
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error enrolling leads:', error);
      toast({
        title: "Error",
        description: "Failed to enroll leads",
        variant: "destructive"
      });
    } finally {
      setEnrolling(false);
    }
  };

  if (!automation) return null;

  const uniqueStatuses = [...new Set(leads.map(l => l.status))];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Re-enroll Leads: {automation.name}
          </DialogTitle>
          <DialogDescription>
            Select leads to enroll in this {automation.type}. They will start from the beginning.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-md border border-input bg-background text-sm"
            >
              <option value="all">All Statuses</option>
              {uniqueStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Options */}
          <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
            <div className="flex items-center gap-2">
              <Checkbox
                id="removeExisting"
                checked={removeExisting}
                onCheckedChange={(checked) => setRemoveExisting(checked as boolean)}
              />
              <Label htmlFor="removeExisting" className="text-sm cursor-pointer">
                Remove existing enrollments first
              </Label>
            </div>
          </div>

          {/* Selection Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={toggleAll}>
                {selectedLeads.length === filteredLeads.length ? 'Deselect All' : 'Select All'}
              </Button>
              <span className="text-sm text-muted-foreground">
                {selectedLeads.length} of {filteredLeads.length} selected
              </span>
            </div>
          </div>

          {/* Lead List */}
          <ScrollArea className="h-[300px] border rounded-lg">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No leads found</p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {filteredLeads.map(lead => (
                  <div
                    key={lead.id}
                    onClick={() => toggleLead(lead.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedLeads.includes(lead.id) 
                        ? 'bg-primary/10 border border-primary/20' 
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <Checkbox
                      checked={selectedLeads.includes(lead.id)}
                      onCheckedChange={() => toggleLead(lead.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {lead.first_name} {lead.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {lead.email}
                      </p>
                    </div>
                    <PastelBadge color="slate" size="sm">
                      {lead.status}
                    </PastelBadge>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Progress */}
          {enrolling && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Enrolling leads...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={enrolling}>
            Cancel
          </Button>
          <Button 
            onClick={handleEnroll} 
            disabled={selectedLeads.length === 0 || enrolling}
          >
            {enrolling ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Enrolling...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Enroll {selectedLeads.length} Leads
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
