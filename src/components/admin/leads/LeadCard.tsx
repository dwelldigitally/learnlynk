import React from 'react';
import { Clock, Mail, Phone, Calendar, User, MapPin, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { HelpIcon } from '@/components/ui/help-icon';
import { useHelpContent } from '@/hooks/useHelpContent';
import { Lead, LeadPriority, LeadStatus } from '@/types/lead';
import { cn } from '@/lib/utils';

interface LeadCardProps {
  lead: Lead;
  onStatusChange: (leadId: string, newStatus: LeadStatus) => void;
  onViewDetails: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  onStatusChange,
  onViewDetails,
  onEdit
}) => {
  const { getHelpContent } = useHelpContent();
  
  const getPriorityClass = (priority: LeadPriority) => {
    switch (priority) {
      case 'low': return 'priority-low';
      case 'medium': return 'priority-medium';
      case 'high': return 'priority-high';
      case 'urgent': return 'priority-urgent';
      default: return 'priority-low';
    }
  };

  const getStatusClass = (status: LeadStatus) => {
    switch (status) {
      case 'new': return 'status-badge-new';
      case 'contacted': return 'status-badge-contacted';
      case 'qualified': return 'status-badge-qualified';
      case 'nurturing': return 'status-badge-nurturing';
      case 'converted': return 'status-badge-converted';
      case 'lost': return 'status-badge-lost';
      default: return 'status-badge-new';
    }
  };

  const timeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInHours = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <Card className={cn(
      "interactive-card priority-card",
      getPriorityClass(lead.priority)
    )}>
      <CardContent className="p-6">
        {/* Header with name and priority */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg">
                {lead.first_name} {lead.last_name}
              </h3>
              <Badge 
                variant="outline" 
                className={cn("text-xs font-medium", getStatusClass(lead.status))}
              >
                {lead.status}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {lead.email}
              </span>
              {lead.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {lead.phone}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              <Star className="h-3 w-3 mr-1" />
              {lead.lead_score}/100
            </Badge>
            <HelpIcon content={getHelpContent('leadScore')} />
          </div>
        </div>

        {/* Lead details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Created:</span>
              <span>{timeAgo(lead.created_at)}</span>
            </div>
            
            {lead.assigned_to && (
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Assigned to:</span>
                <span className="font-medium">{lead.assigned_to}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Source:</span>
              <span className="capitalize">{lead.source}</span>
            </div>
            
            {lead.last_contacted_at && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Last contact:</span>
                <span>{timeAgo(lead.last_contacted_at)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Program interests */}
        {lead.program_interest && lead.program_interest.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">Interested Programs:</p>
            <div className="flex flex-wrap gap-1">
              {lead.program_interest.slice(0, 3).map((program, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {program}
                </Badge>
              ))}
              {lead.program_interest.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{lead.program_interest.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        {lead.tags && lead.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {lead.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {lead.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{lead.tags.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 pt-4 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onViewDetails(lead)}
            className="flex-1"
          >
            View Details
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(lead)}
          >
            Edit
          </Button>
          
          {lead.status === 'new' && (
            <Button 
              size="sm" 
              onClick={() => onStatusChange(lead.id, 'contacted')}
              className="bg-gradient-to-r from-primary to-accent"
            >
              Contact
            </Button>
          )}
          
          {lead.status === 'contacted' && (
            <Button 
              size="sm" 
              onClick={() => onStatusChange(lead.id, 'qualified')}
              className="bg-gradient-to-r from-accent to-primary"
            >
              Qualify
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};