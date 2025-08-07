import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Phone, Mail, Eye, Star, Clock, User } from 'lucide-react';
import { Lead } from '@/types/lead';
import { LeadService } from '@/services/leadService';

export function NewlyAssignedLeads() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNewlyAssignedLeads();
  }, []);

  const loadNewlyAssignedLeads = async () => {
    try {
      // Get leads assigned in the last 48 hours
      const filters = {
        date_range: {
          start: new Date(Date.now() - 48 * 60 * 60 * 1000),
          end: new Date()
        }
      };
      
      const response = await LeadService.getLeads(filters, 1, 5);
      setLeads(response.leads.filter(lead => lead.assigned_to));
    } catch (error) {
      console.error('Failed to load newly assigned leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-destructive';
      case 'high': return 'text-warning';
      case 'medium': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const getSourceIcon = (source: string) => {
    // Return appropriate icon based on source
    return <User className="w-3 h-3" />;
  };

  const formatTimeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="w-4 h-4" />
            Newly Assigned Leads
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-muted rounded-lg h-16"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <User className="w-4 h-4" />
          Newly Assigned Leads
          <Badge variant="secondary" className="ml-auto">{leads.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {leads.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No new assignments</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/admin/leads/detail/${lead.id}`)}
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs">
                    {lead.first_name[0]}{lead.last_name[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm truncate">
                      {lead.first_name} {lead.last_name}
                    </p>
                    <Badge 
                      variant="outline" 
                      className={cn("text-xs", getPriorityColor(lead.priority))}
                    >
                      {lead.priority}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {getSourceIcon(lead.source)}
                    <span>{lead.source.replace('_', ' ')}</span>
                    <span>•</span>
                    <Clock className="w-3 h-3" />
                    <span>{formatTimeAgo(lead.assigned_at || lead.created_at)}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 text-warning" />
                    <span className="text-xs font-medium">{lead.lead_score}/100</span>
                  </div>
                </div>

                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Phone className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Mail className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}