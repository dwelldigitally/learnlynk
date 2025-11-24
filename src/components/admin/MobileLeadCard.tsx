import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Phone, Mail, Star, AlertTriangle, Clock, ArrowRight, MoreHorizontal } from 'lucide-react';
import { Lead, LeadStatus, LeadPriority } from '@/types/lead';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MobileLeadCardProps {
  lead: Lead;
  selected: boolean;
  onSelect: (leadId: string) => void;
  onClick: (lead: Lead) => void;
}

export function MobileLeadCard({ lead, selected, onSelect, onClick }: MobileLeadCardProps) {
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

  return (
    <Card
      className="p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onClick(lead)}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <Checkbox
          checked={selected}
          onCheckedChange={() => onSelect(lead.id)}
          onClick={(e) => e.stopPropagation()}
          className="mt-1"
        />

        {/* Avatar */}
        <Avatar className="h-12 w-12 flex-shrink-0">
          <AvatarFallback>
            {lead.first_name?.[0]}{lead.last_name?.[0]}
          </AvatarFallback>
        </Avatar>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Name and Status */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base truncate">
                {lead.first_name} {lead.last_name}
              </h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge variant="outline" className="text-xs">
                  <div className={cn("w-2 h-2 rounded-full mr-1", getStatusColor(lead.status))} />
                  {lead.status}
                </Badge>
                {getPriorityIcon(lead.priority)}
              </div>
            </div>
            
            {/* More Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover z-50">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); }}>
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); }}>
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); }}>
                  <ArrowRight className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Contact Info */}
          <div className="space-y-1 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-2 truncate">
              <Mail className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{lead.email}</span>
            </div>
            {lead.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3 flex-shrink-0" />
                <span>{lead.phone}</span>
              </div>
            )}
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t">
            <div className="flex items-center gap-3 text-xs">
              <div>
                <span className="text-muted-foreground">Score: </span>
                <span className={cn("font-semibold px-2 py-0.5 rounded", getScoreColor(lead.lead_score || 0))}>
                  {lead.lead_score || 0}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Source: </span>
                <span className="font-medium">{lead.source.replace('_', ' ').toUpperCase()}</span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {format(new Date(lead.created_at), 'MMM d')}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
