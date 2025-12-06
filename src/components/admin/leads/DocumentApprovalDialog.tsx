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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, XCircle, AlertTriangle, FileText, Target } from 'lucide-react';
import { LeadEntryRequirement } from '@/services/entryRequirementService';

interface DocumentApprovalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: {
    id: string;
    file_name: string;
    file_url?: string | null;
  } | null;
  linkedRequirement?: LeadEntryRequirement | null;
  onApprove: (notes: string) => void;
  onReject: (reason: string) => void;
  isLoading?: boolean;
}

export function DocumentApprovalDialog({
  open,
  onOpenChange,
  document,
  linkedRequirement,
  onApprove,
  onReject,
  isLoading = false,
}: DocumentApprovalDialogProps) {
  const [notes, setNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [mode, setMode] = useState<'review' | 'reject'>('review');

  if (!document) return null;

  const threshold = linkedRequirement?.threshold_data;
  const hasThreshold = threshold && (
    threshold.minimum_grade || 
    threshold.minimum_score || 
    threshold.years_required ||
    threshold.description
  );

  const handleApprove = () => {
    onApprove(notes);
    setNotes('');
    setMode('review');
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) return;
    onReject(rejectionReason);
    setRejectionReason('');
    setMode('review');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Review Document
          </DialogTitle>
          <DialogDescription>
            Review and approve or reject this document submission.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Document Info */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="font-medium">{document.file_name}</p>
                  {document.file_url && (
                    <a 
                      href={document.file_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      View Document
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Linked Requirement & Threshold */}
          {linkedRequirement && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">Linked Entry Requirement</span>
                </div>
                
                <div>
                  <p className="font-medium">{linkedRequirement.requirement_title}</p>
                  <Badge variant="outline" className="mt-1 capitalize">
                    {linkedRequirement.requirement_type}
                  </Badge>
                  {linkedRequirement.is_mandatory && (
                    <Badge variant="destructive" className="ml-2">Required</Badge>
                  )}
                </div>

                {hasThreshold && (
                  <div className="mt-3 p-3 bg-background rounded-md border">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <span className="font-medium text-sm">Threshold Requirements</span>
                    </div>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      {threshold.minimum_grade && (
                        <li>• Minimum Grade: <strong className="text-foreground">{threshold.minimum_grade}</strong></li>
                      )}
                      {threshold.minimum_score && (
                        <li>• Minimum Score: <strong className="text-foreground">{threshold.minimum_score}</strong></li>
                      )}
                      {threshold.years_required && (
                        <li>• Years Required: <strong className="text-foreground">{threshold.years_required} years</strong></li>
                      )}
                      {threshold.description && (
                        <li>• {threshold.description}</li>
                      )}
                    </ul>
                    {threshold.alternatives && threshold.alternatives.length > 0 && (
                      <div className="mt-2 pt-2 border-t">
                        <p className="text-xs text-muted-foreground">
                          Alternatives: {threshold.alternatives.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <p className="text-xs text-muted-foreground mt-2">
                  ✨ Approving this document will auto-approve the linked entry requirement.
                </p>
              </CardContent>
            </Card>
          )}

          {mode === 'review' ? (
            <div className="space-y-2">
              <Label htmlFor="notes">Approval Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this approval..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="reason">Rejection Reason (Required)</Label>
              <Textarea
                id="reason"
                placeholder="Explain why this document is being rejected..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                className="border-destructive/50"
              />
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {mode === 'review' ? (
            <>
              <Button
                variant="outline"
                onClick={() => setMode('reject')}
                disabled={isLoading}
                className="text-destructive hover:text-destructive"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button
                onClick={handleApprove}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Approve Document
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setMode('review')}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={isLoading || !rejectionReason.trim()}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Confirm Rejection
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
