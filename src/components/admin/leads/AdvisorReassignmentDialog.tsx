import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, User, Check, Loader2 } from 'lucide-react';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { LeadService } from '@/services/leadService';
import { leadActivityService } from '@/services/leadActivityService';
import { useToast } from '@/hooks/use-toast';

interface AdvisorReassignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: string;
  currentAdvisorId?: string;
  currentAdvisorName?: string;
  onReassigned: () => void;
  onTimelineRefresh?: () => void;
}

export function AdvisorReassignmentDialog({
  open,
  onOpenChange,
  leadId,
  currentAdvisorId,
  currentAdvisorName,
  onReassigned,
  onTimelineRefresh
}: AdvisorReassignmentDialogProps) {
  const { toast } = useToast();
  const { teamMembers, loading: loadingMembers } = useTeamMembers();
  const [searchQuery, setSearchQuery] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [selectedAdvisorId, setSelectedAdvisorId] = useState<string | null>(null);

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAssign = async (advisorId: string, advisorName: string) => {
    setAssigning(true);
    setSelectedAdvisorId(advisorId);

    try {
      const { error } = await LeadService.updateLead(leadId, {
        assigned_to: advisorId,
        assigned_at: new Date().toISOString(),
        assignment_method: 'manual'
      });

      if (error) throw error;

      // Log the activity
      await leadActivityService.logAdvisorChange(
        leadId,
        currentAdvisorName || 'Unassigned',
        advisorName
      );

      toast({
        title: 'Advisor Reassigned',
        description: `Lead has been assigned to ${advisorName}`,
      });

      onReassigned();
      onTimelineRefresh?.();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Assignment Failed',
        description: error.message || 'Failed to reassign advisor',
        variant: 'destructive'
      });
    } finally {
      setAssigning(false);
      setSelectedAdvisorId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Reassign Lead to Advisor</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Advisor */}
          {currentAdvisorName && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Currently Assigned</div>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {currentAdvisorName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{currentAdvisorName}</span>
                <Badge variant="secondary" className="ml-auto">Current</Badge>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Team Members List */}
          <ScrollArea className="h-[300px]">
            {loadingMembers ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No team members found
              </div>
            ) : (
              <div className="space-y-2">
                {filteredMembers.map((member) => {
                  const isCurrent = member.id === currentAdvisorId;
                  const isAssigning = assigning && selectedAdvisorId === member.id;

                  return (
                    <div
                      key={member.id}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                        isCurrent ? 'bg-primary/5 border-primary/20' : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar_url} />
                          <AvatarFallback>
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{member.name}</div>
                          <div className="text-xs text-muted-foreground">{member.email}</div>
                        </div>
                      </div>

                      {isCurrent ? (
                        <Badge variant="outline" className="text-primary">
                          <Check className="h-3 w-3 mr-1" />
                          Assigned
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAssign(member.id, member.name)}
                          disabled={assigning}
                        >
                          {isAssigning ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            'Assign'
                          )}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
