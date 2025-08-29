import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, User, Mail, Phone } from "lucide-react";
import { EnhancedLeadService } from "@/services/enhancedLeadService";
import { Lead } from "@/types/lead";

interface LeadSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLead: (lead: Lead) => void;
}

export function LeadSelector({ isOpen, onClose, onSelectLead }: LeadSelectorProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadLeads();
    }
  }, [isOpen]);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const response = await EnhancedLeadService.getLeads(1, 50, {
        search: searchQuery || undefined,
        sortBy: 'created_at',
        sortOrder: 'desc'
      });
      setLeads(response.leads);
    } catch (error) {
      console.error('Error loading leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    loadLeads();
  };

  const handleLeadSelect = (lead: Lead) => {
    onSelectLead(lead);
    onClose();
  };

  const filteredLeads = leads.filter(lead => 
    lead.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (lead.phone && lead.phone.includes(searchQuery))
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select a Lead</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              Search
            </Button>
          </div>

          {/* Leads List */}
          <div className="grid gap-3 max-h-96 overflow-y-auto">
            {filteredLeads.map((lead) => (
              <Card 
                key={lead.id} 
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => handleLeadSelect(lead)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {lead.first_name[0]}{lead.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">
                          {lead.first_name} {lead.last_name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {lead.email}
                          </div>
                          {lead.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {lead.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{lead.status}</Badge>
                      <Badge variant="secondary">{lead.source}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredLeads.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? 'No leads found matching your search.' : 'No leads available.'}
            </div>
          )}

          {loading && (
            <div className="text-center py-8 text-muted-foreground">
              Loading leads...
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}