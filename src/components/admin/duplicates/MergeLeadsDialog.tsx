import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMergeLeads } from '@/hooks/useDuplicateDetection';
import { DuplicateGroup } from '@/services/duplicateLeadService';
import { Lead } from '@/types/lead';
import { format } from 'date-fns';
import { 
  ArrowRight, 
  CheckCircle, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  Star,
  AlertTriangle
} from 'lucide-react';

interface MergeLeadsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: DuplicateGroup;
}

export function MergeLeadsDialog({ open, onOpenChange, group }: MergeLeadsDialogProps) {
  const [primaryId, setPrimaryId] = useState(group.primaryLeadId || group.leads[0]?.id);
  const [step, setStep] = useState<'select' | 'preview'>('select');
  const { mutate: mergeLeads, isPending: merging } = useMergeLeads();

  const primaryLead = group.leads.find(l => l.id === primaryId);
  const secondaryLeads = group.leads.filter(l => l.id !== primaryId);

  const handleMerge = () => {
    if (!primaryId || secondaryLeads.length === 0) return;

    // Merge all secondary leads into primary one by one
    const mergeNext = (index: number) => {
      if (index >= secondaryLeads.length) {
        onOpenChange(false);
        return;
      }

      mergeLeads(
        { primaryLeadId: primaryId, secondaryLeadId: secondaryLeads[index].id },
        {
          onSuccess: (result) => {
            if (result.success) {
              mergeNext(index + 1);
            }
          }
        }
      );
    };

    mergeNext(0);
  };

  const getMergedPreview = () => {
    if (!primaryLead) return null;

    const merged = { ...primaryLead };
    
    for (const secondary of secondaryLeads) {
      if (!merged.phone && secondary.phone) merged.phone = secondary.phone;
      if (!merged.country && secondary.country) merged.country = secondary.country;
      if (!merged.state && secondary.state) merged.state = secondary.state;
      if (!merged.city && secondary.city) merged.city = secondary.city;
      
      // Merge programs
      const primaryPrograms = (merged.program_interest as string[]) || [];
      const secondaryPrograms = (secondary.program_interest as string[]) || [];
      merged.program_interest = [...new Set([...primaryPrograms, ...secondaryPrograms])] as any;
      
      // Merge tags
      const primaryTags = (merged.tags as string[]) || [];
      const secondaryTags = (secondary.tags as string[]) || [];
      merged.tags = [...new Set([...primaryTags, ...secondaryTags])] as any;

      // Use higher score
      if ((secondary.lead_score || 0) > (merged.lead_score || 0)) {
        merged.lead_score = secondary.lead_score;
      }
    }

    return merged;
  };

  const mergedPreview = getMergedPreview();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Merge Duplicate Leads</DialogTitle>
          <DialogDescription>
            {step === 'select' 
              ? 'Select the primary lead to keep. Data from other leads will be merged into it.'
              : 'Review the merged result before confirming.'
            }
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          {step === 'select' ? (
            <div className="space-y-4 p-1">
              <RadioGroup value={primaryId} onValueChange={setPrimaryId}>
                {group.leads.map((lead) => (
                  <div 
                    key={lead.id}
                    className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                      primaryId === lead.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-muted-foreground/50'
                    }`}
                    onClick={() => setPrimaryId(lead.id)}
                  >
                    <RadioGroupItem value={lead.id} id={lead.id} className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor={lead.id} className="text-base font-medium cursor-pointer">
                        {lead.first_name} {lead.last_name}
                        {lead.id === group.primaryLeadId && (
                          <Badge variant="secondary" className="ml-2">Suggested</Badge>
                        )}
                      </Label>
                      
                      <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-muted-foreground">
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
                        {(lead.city || lead.country) && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {[lead.city, lead.country].filter(Boolean).join(', ')}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(lead.created_at), 'MMM d, yyyy')}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{lead.status}</Badge>
                        <Badge variant="outline">{lead.source}</Badge>
                        {lead.lead_score > 0 && (
                          <Badge variant="secondary">Score: {lead.lead_score}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ) : (
            <div className="space-y-6 p-1">
              {/* What will happen */}
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex-1 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Keep</p>
                  <p className="font-medium">{primaryLead?.first_name} {primaryLead?.last_name}</p>
                  <p className="text-sm text-muted-foreground">{primaryLead?.email}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Delete</p>
                  {secondaryLeads.map(l => (
                    <p key={l.id} className="text-sm">{l.first_name} {l.last_name}</p>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Merged Preview */}
              {mergedPreview && (
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Merged Result Preview
                  </h4>
                  <div className="p-4 border rounded-lg space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Name</p>
                        <p className="font-medium">{mergedPreview.first_name} {mergedPreview.last_name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p>{mergedPreview.email}</p>
                      </div>
                      {mergedPreview.phone && (
                        <div>
                          <p className="text-xs text-muted-foreground">Phone</p>
                          <p>{mergedPreview.phone}</p>
                        </div>
                      )}
                      {(mergedPreview.city || mergedPreview.country) && (
                        <div>
                          <p className="text-xs text-muted-foreground">Location</p>
                          <p>{[mergedPreview.city, mergedPreview.state, mergedPreview.country].filter(Boolean).join(', ')}</p>
                        </div>
                      )}
                    </div>

                    {(mergedPreview.program_interest as string[])?.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Programs of Interest</p>
                        <div className="flex flex-wrap gap-1">
                          {(mergedPreview.program_interest as string[]).map(p => (
                            <Badge key={p} variant="outline">{p}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {(mergedPreview.tags as string[])?.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Tags</p>
                        <div className="flex flex-wrap gap-1">
                          {(mergedPreview.tags as string[]).map(t => (
                            <Badge key={t} variant="secondary">{t}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="text-xs text-muted-foreground">Lead Score</p>
                      <p className="font-medium">{mergedPreview.lead_score}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Warning */}
              <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-lg text-sm">
                <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                <p className="text-destructive">
                  This action cannot be undone. {secondaryLeads.length} lead(s) will be permanently deleted.
                </p>
              </div>
            </div>
          )}
        </ScrollArea>

        <DialogFooter>
          {step === 'select' ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={() => setStep('preview')} disabled={!primaryId}>
                Preview Merge
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setStep('select')}>
                Back
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleMerge} 
                disabled={merging}
              >
                {merging ? 'Merging...' : `Merge ${group.leads.length} Leads`}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
