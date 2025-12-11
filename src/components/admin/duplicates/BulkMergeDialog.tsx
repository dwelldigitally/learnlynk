import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { DuplicateGroup } from '@/services/duplicateLeadService';
import { useBulkMergeLeads } from '@/hooks/useDuplicateDetection';
import { Loader2, GitMerge, FileText, GraduationCap, Tag, StickyNote, Zap } from 'lucide-react';

export interface ConflictResolution {
  programs: 'merge_all' | 'keep_primary';
  documents: 'merge_all' | 'keep_primary';
  status: 'keep_primary' | 'keep_newest';
  priority: 'keep_primary' | 'keep_highest';
  leadScore: 'keep_highest' | 'keep_primary';
  tags: 'merge_all' | 'keep_primary';
  notes: 'concatenate' | 'keep_primary';
}

interface BulkMergeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groups: DuplicateGroup[];
  onSuccess?: () => void;
}

export function BulkMergeDialog({ open, onOpenChange, groups, onSuccess }: BulkMergeDialogProps) {
  const [resolution, setResolution] = useState<ConflictResolution>({
    programs: 'merge_all',
    documents: 'merge_all',
    status: 'keep_primary',
    priority: 'keep_highest',
    leadScore: 'keep_highest',
    tags: 'merge_all',
    notes: 'concatenate'
  });
  
  const bulkMerge = useBulkMergeLeads();

  const handleMerge = async () => {
    await bulkMerge.mutateAsync({ groups, resolution });
    onOpenChange(false);
    onSuccess?.();
  };

  const totalLeadsToMerge = groups.reduce((sum, g) => sum + g.leads.length, 0);
  const leadsToRemove = totalLeadsToMerge - groups.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitMerge className="h-5 w-5 text-primary" />
            Bulk Merge {groups.length} Duplicate Groups
          </DialogTitle>
          <DialogDescription>
            This will merge {totalLeadsToMerge} leads into {groups.length} records, removing {leadsToRemove} duplicates.
            Choose how to handle conflicting properties.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Groups Preview */}
            <div>
              <Label className="text-sm font-medium">Groups to Merge</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {groups.slice(0, 5).map(group => (
                  <Badge key={group.id} variant="outline" className="text-xs">
                    {group.leads.length} contacts
                  </Badge>
                ))}
                {groups.length > 5 && (
                  <Badge variant="secondary" className="text-xs">
                    +{groups.length - 5} more
                  </Badge>
                )}
              </div>
            </div>

            <Separator />

            {/* Conflict Resolution Options */}
            <div className="space-y-5">
              {/* Programs */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <GraduationCap className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <Label className="text-sm font-medium">Program Interests</Label>
                      <p className="text-xs text-muted-foreground mb-3">
                        How to handle different program interests across duplicates
                      </p>
                      <RadioGroup
                        value={resolution.programs}
                        onValueChange={(v) => setResolution(prev => ({ ...prev, programs: v as any }))}
                        className="flex flex-col gap-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="merge_all" id="programs_merge" />
                          <Label htmlFor="programs_merge" className="text-sm font-normal cursor-pointer">
                            Merge all programs from all duplicates
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="keep_primary" id="programs_primary" />
                          <Label htmlFor="programs_primary" className="text-sm font-normal cursor-pointer">
                            Keep only primary lead's programs
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Documents */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <Label className="text-sm font-medium">Documents & Requirements</Label>
                      <p className="text-xs text-muted-foreground mb-3">
                        How to handle uploaded documents and entry requirements
                      </p>
                      <RadioGroup
                        value={resolution.documents}
                        onValueChange={(v) => setResolution(prev => ({ ...prev, documents: v as any }))}
                        className="flex flex-col gap-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="merge_all" id="docs_merge" />
                          <Label htmlFor="docs_merge" className="text-sm font-normal cursor-pointer">
                            Keep all documents from all duplicates
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="keep_primary" id="docs_primary" />
                          <Label htmlFor="docs_primary" className="text-sm font-normal cursor-pointer">
                            Keep only primary lead's documents
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Lead Score */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <Label className="text-sm font-medium">Lead Score & Priority</Label>
                      <p className="text-xs text-muted-foreground mb-3">
                        How to determine the merged lead's score and priority
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs text-muted-foreground mb-2 block">Lead Score</Label>
                          <RadioGroup
                            value={resolution.leadScore}
                            onValueChange={(v) => setResolution(prev => ({ ...prev, leadScore: v as any }))}
                            className="flex flex-col gap-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="keep_highest" id="score_highest" />
                              <Label htmlFor="score_highest" className="text-sm font-normal cursor-pointer">Highest</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="keep_primary" id="score_primary" />
                              <Label htmlFor="score_primary" className="text-sm font-normal cursor-pointer">Primary's</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground mb-2 block">Priority</Label>
                          <RadioGroup
                            value={resolution.priority}
                            onValueChange={(v) => setResolution(prev => ({ ...prev, priority: v as any }))}
                            className="flex flex-col gap-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="keep_highest" id="priority_highest" />
                              <Label htmlFor="priority_highest" className="text-sm font-normal cursor-pointer">Highest</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="keep_primary" id="priority_primary" />
                              <Label htmlFor="priority_primary" className="text-sm font-normal cursor-pointer">Primary's</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <Label className="text-sm font-medium">Tags</Label>
                      <RadioGroup
                        value={resolution.tags}
                        onValueChange={(v) => setResolution(prev => ({ ...prev, tags: v as any }))}
                        className="flex gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="merge_all" id="tags_merge" />
                          <Label htmlFor="tags_merge" className="text-sm font-normal cursor-pointer">Merge all</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="keep_primary" id="tags_primary" />
                          <Label htmlFor="tags_primary" className="text-sm font-normal cursor-pointer">Primary only</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <StickyNote className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <Label className="text-sm font-medium">Notes</Label>
                      <RadioGroup
                        value={resolution.notes}
                        onValueChange={(v) => setResolution(prev => ({ ...prev, notes: v as any }))}
                        className="flex gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="concatenate" id="notes_concat" />
                          <Label htmlFor="notes_concat" className="text-sm font-normal cursor-pointer">Combine all notes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="keep_primary" id="notes_primary" />
                          <Label htmlFor="notes_primary" className="text-sm font-normal cursor-pointer">Primary only</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleMerge} disabled={bulkMerge.isPending}>
            {bulkMerge.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Merge {groups.length} Groups
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
