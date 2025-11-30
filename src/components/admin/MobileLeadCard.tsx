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
    if (score >= 80) return 'text-emerald-600 bg-emerald-50';
    if (score >= 60) return 'text-amber-600 bg-amber-50';
    if (score >= 40) return 'text-orange-600 bg-orange-50';
    return 'text-rose-600 bg-rose-50';
  };

  return (
    <Card
      className={cn(
        "p-5 cursor-pointer transition-all rounded-2xl border-border/40",
        "hover:border-primary/20 hover:bg-muted/5",
        selected && "border-primary/40 bg-primary/5"
      )}
      onClick={() => onClick(lead)}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <Checkbox
          checked={selected}
          onCheckedChange={() => onSelect(lead.id)}
          onClick={(e) => e.stopPropagation()}
          className="mt-1 rounded-md"
        />

        {/* Avatar */}
        <Avatar className="h-12 w-12 flex-shrink-0 border border-border/40">
          <AvatarFallback className="bg-muted/50 text-sm">
            {lead.first_name?.[0]}{lead.last_name?.[0]}
          </AvatarFallback>
        </Avatar>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Name and Status */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base truncate text-foreground">
                {lead.first_name} {lead.last_name}
              </h3>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <Badge className={cn("text-xs rounded-full px-2.5 py-0.5 border", getStatusColor(lead.status))}>
                  {lead.status}
                </Badge>
                {getPriorityIcon(lead.priority)}
              </div>
            </div>
            
            {/* More Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full hover:bg-muted/50">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover z-50 rounded-xl border-border/60">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); }} className="rounded-lg">
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); }} className="rounded-lg">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); }} className="rounded-lg">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Contact Info */}
          <div className="space-y-1.5 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-2 truncate">
              <Mail className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{lead.email}</span>
            </div>
            {lead.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                <span>{lead.phone}</span>
              </div>
            )}
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-between gap-2 pt-3 border-t border-border/40">
            <div className="flex items-center gap-3 text-xs">
              <div>
                <span className="text-muted-foreground">Score: </span>
                <span className={cn("font-semibold px-2 py-0.5 rounded-full", getScoreColor(lead.lead_score || 0))}>
                  {lead.lead_score || 0}
                </span>
              </div>
              <Badge variant="outline" className="text-xs rounded-full px-2 py-0.5 border-border/60 bg-muted/30">
                {lead.source.replace('_', ' ').toUpperCase()}
              </Badge>
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
