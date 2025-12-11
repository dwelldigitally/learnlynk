import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useDeleteDuplicates } from '@/hooks/useDuplicateDetection';
import { DuplicateGroup } from '@/services/duplicateLeadService';
import { Lead } from '@/types/lead';
import { format } from 'date-fns';
import { 
  Merge, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar,
  Star,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DuplicateGroupCardProps {
  group: DuplicateGroup;
  onMerge: () => void;
  getMatchTypeLabel: (type: string) => string;
  getMatchTypeBadgeVariant: (type: string) => "default" | "secondary" | "destructive" | "outline";
  isSelected?: boolean;
  onSelectionChange?: () => void;
}

export function DuplicateGroupCard({ 
  group, 
  onMerge, 
  getMatchTypeLabel, 
  getMatchTypeBadgeVariant,
  isSelected = false,
  onSelectionChange
}: DuplicateGroupCardProps) {
  const navigate = useNavigate();
  const { mutate: deleteDuplicates, isPending: deleting } = useDeleteDuplicates();

  const getInitials = (lead: Lead) => {
    return `${lead.first_name?.[0] || ''}${lead.last_name?.[0] || ''}`.toUpperCase();
  };

  return (
    <Card className={isSelected ? 'ring-2 ring-primary' : ''}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onSelectionChange && (
              <Checkbox
                checked={isSelected}
                onCheckedChange={onSelectionChange}
                className="h-5 w-5"
              />
            )}
            <Badge variant={getMatchTypeBadgeVariant(group.matchType)}>
              {getMatchTypeLabel(group.matchType)}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {group.leads.length} contacts • {group.confidence}% confidence
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={onMerge}>
            <Merge className="h-4 w-4 mr-1" />
            Merge
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {group.leads.map((lead, index) => (
            <div 
              key={lead.id}
              className={`flex items-center gap-4 p-3 rounded-lg border ${
                lead.id === group.primaryLeadId ? 'bg-primary/5 border-primary/20' : 'bg-muted/30'
              }`}
            >
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getInitials(lead)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {lead.first_name} {lead.last_name}
                  </span>
                  {lead.id === group.primaryLeadId && (
                    <Badge variant="secondary" className="text-xs">
                      <Star className="h-3 w-3 mr-1" />
                      Primary
                    </Badge>
                  )}
                  {index === 0 && lead.id !== group.primaryLeadId && (
                    <Badge variant="outline" className="text-xs">Oldest</Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
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
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(lead.created_at), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline">{lead.status}</Badge>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => navigate(`/admin/leads/detail/${lead.id}`)}
                  title="View Lead"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                {lead.id !== group.primaryLeadId && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => deleteDuplicates([lead.id])}
                    disabled={deleting}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    title="Delete this lead"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
